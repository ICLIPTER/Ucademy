# Ucademy

A production-grade learning management system (LMS) built with Next.js 15,
React 19, Prisma and Tailwind v4. Runners-up on cost: the whole platform
deploys on a **free Vercel Hobby account** and a free Postgres database.

---

## Table of contents

- [Stack](#stack)
- [Features](#features)
- [Getting started](#getting-started)
- [Environment variables](#environment-variables)
- [Deploying to Vercel (free tier)](#deploying-to-vercel-free-tier)
- [Database & migrations](#database--migrations)
- [Project structure](#project-structure)
- [Scripts](#scripts)
- [Architecture notes](#architecture-notes)
- [Security](#security)
- [Performance](#performance)

---

## Stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 15.5 (App Router, Turbopack, React Server Components) |
| UI | React 19, TypeScript (strict), Tailwind v4, shadcn/ui (Radix) |
| Data | PostgreSQL (Neon) via Prisma 6 |
| Auth | better-auth 1.3 — email one-time code + optional GitHub OAuth |
| Payments | Stripe Checkout 19 |
| Email | Resend |
| Media | Any S3-compatible bucket (AWS S3, Cloudflare R2, MinIO, T3) |
| Charts | Recharts (admin only, loaded on demand) |
| Editor | TipTap 3 |

**Package manager: pnpm** — a single `pnpm-lock.yaml` is committed and the
`packageManager` field pins the version, so local, CI and Vercel all install
the exact same dependency tree.

---

## Features

### Learners
- Course catalogue with full-text search, category/level filters, sorting and pagination — all state in the URL, so results are shareable and indexable.
- Course pages with the complete curriculum, ratings breakdown, instructor info, and a sticky purchase panel.
- A course player with a collapsible curriculum, per-lesson progress, responsive layout and "mark as complete".
- A learning dashboard: continue-where-you-left-off, in-progress, ready-to-start and completed courses, plus lifetime spend.
- Certificates: issued when every lesson is complete, with a unique serial and a printable page.
- Saved courses (wishlist), reviews with a star rating, and a profile/settings page.
- Email one-time-code sign-in with anti-bot signals, plus optional GitHub OAuth.

### Instructors (studio)
- Create and publish courses with rich-text descriptions, thumbnails, chapters and lessons.
- Drag-and-drop reordering of chapters and lessons.
- Per-course analytics: enrolments, completion, ratings and revenue.
- A learner directory with search, role management and suspension.
- Platform settings that show exactly which integrations are configured.

### Platform
- Marketing site: hero with search, statistics, category grid, featured courses, how-it-works, features, testimonials, instructor CTA and FAQ.
- SEO: dynamic sitemap, robots rules, Open Graph/Twitter metadata, JSON-LD-ready metadata and a web manifest.
- Reliability: route-level and global error boundaries, a 404 page, streaming skeletons and graceful degradation when an optional provider is not configured.

---

## Getting started

```bash
# 1. Install dependencies (also runs `prisma generate`)
pnpm install

# 2. Configure the environment
cp .env.example .env
#   then fill in DATABASE_URL and BETTER_AUTH_SECRET

# 3. Create the schema
pnpm db:migrate

# 4. Start the dev server
pnpm dev
```

Open <http://localhost:3000>.

### Making yourself an instructor

The first account you create is a normal learner. To open the studio, set the
role in the database:

```sql
UPDATE "user" SET role = 'admin' WHERE email = 'you@example.com';
```

Sign out and back in — the session caches the role for five minutes in
production.

---

## Environment variables

Only **two** variables are required. Everything else is optional and the
matching feature is disabled when it is missing (it never fails the build).

| Variable | Required | Purpose |
| --- | :---: | --- |
| `DATABASE_URL` | ✅ | PostgreSQL connection string |
| `BETTER_AUTH_SECRET` | ✅ | Session signing secret (32+ chars) |
| `BETTER_AUTH_URL` | | Canonical origin, defaults to `http://localhost:3000` |
| `NEXT_PUBLIC_APP_URL` | | Used for metadata, sitemap and OG tags |
| `AUTH_GITHUB_CLIENT_ID` / `AUTH_GITHUB_SECRET` | | GitHub sign-in |
| `RESEND_API_KEY` | | Delivers the sign-in codes |
| `RESEND_FROM_EMAIL` | | Verified sender, defaults to the Resend sandbox |
| `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY` | | Object storage credentials |
| `AWS_ENDPOINT_URL_S3` | | Storage endpoint (S3, R2, MinIO, T3) |
| `AWS_REGION` | | Defaults to `us-east-1` |
| `AWS_S3_FORCE_PATH_STYLE` | | `true` for path-style providers |
| `NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES` | | Bucket name |
| `NEXT_PUBLIC_STORAGE_BASE_URL` | | Public CDN base URL for the bucket |
| `STRIPE_SECRET_KEY` | | Enables checkout |
| `STRIPE_WEBHOOK_SECRET` | | Verifies Stripe webhooks |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | | Only needed for a future embedded checkout |

---

## A fifth gotcha: `next/image` and remote storage

Next.js validates a remote `<Image src>` against `images.remotePatterns`
**inside its default loader**, and that check runs in the **browser** using
the image config that was serialised into the page. A client holding a stale
config throws:

```
Invalid src prop (…) on `next/image`, hostname "…" is not configured
under images in your `next.config.js`
```

which is a hydration error — it takes the whole page down, not just the
image.

`components/ui/storage-image.tsx` removes that failure mode. It supplies a
custom `loader` for remote assets, and Next.js replaces the default loader
entirely when one is given, so the browser-side hostname check never runs.
The URL it produces is byte-for-byte what the default loader produces, so
the images are still optimised (AVIF/WebP, resized, CDN-cached).

**The server-side allow-list is unchanged** and remains the security
control: `/_next/image` still refuses hosts that are not in
`images.remotePatterns`, returning `400`.

Use `<StorageImage>` for anything that lives in object storage and plain
`<Image>` for local assets. The file uploader's preview needs one more
distinction: a file that was just selected has a `blob:` URL, which
`next/image` cannot handle at all, so the uploader falls back to a plain
`<img>` for those.

---

## A fourth gotcha: ProseMirror must be a single copy

TipTap v3's `@tiptap/pm` pins `prosemirror-model@1.25.12`, but each
individual `prosemirror-*` package declares `1.25.3` in its own range. pnpm
honours both, so the tree ends up with **two copies** of `prosemirror-model`,
`prosemirror-state`, `prosemirror-transform` and `prosemirror-view`.

Two copies of `prosemirror-state` means two independent plugin-key counters,
and both of them mint the key `plugin$` for their first unnamed plugin.
ProseMirror then refuses to build the editor state:

```
RangeError: Adding different instances of a keyed plugin (plugin$)
```

`pnpm-workspace.yaml` forces a single version of every `prosemirror-*`
package, which makes pnpm behave like a hoisted install. If you ever add a
ProseMirror-dependent package, keep that override list in sync.

---

## A third gotcha: `next.config.ts` is not hot-reloaded

Next.js reads `next.config.ts` **once**, when the server starts. Editing it
while `pnpm dev` is running has no effect until you restart the dev server —
and the browser keeps showing the *old* error overlay until you hard-reload
(`Ctrl`/`Cmd` + `Shift` + `R`).

If you ever see

```
Invalid src prop (…) on `next/image`, hostname "…" is not configured
under images in your `next.config.js`
```

do this, in order:

1. Stop the dev server and delete `.next` (it caches the resolved config).
2. `pnpm dev` again.
3. Hard-reload the browser.

The hosts are derived in `lib/storage-config.ts`, which **both**
`next.config.ts` and `lib/storage-url.ts` import, so the allow-list and the
rendered URLs can never drift apart. `next.config.ts` additionally unions the
configured S3 endpoint and a static `t3.storage.dev` entry as a safety net.

---

## Two Next.js 15.5.3 quirks this project works around

Both are upstream bugs and both break `next build` in a way that is easy to
mistake for a mistake in this codebase.

**1. `app/error.tsx` and `app/global-error.tsx` cannot coexist.**
Having both at the root of `app/` makes the build fail during "Collecting
page data" with `PageNotFoundError: Cannot find module for page: /_document`.
This project keeps the route-level boundary (`app/error.tsx`), which is the
one that actually catches page errors, and does not add a `global-error.tsx`.
If you add one back, the deployment will break.

**2. A root-level `app/loading.tsx` turns every 404 into a soft 404.**
A `loading.tsx` creates a Suspense boundary at the root, so the response
shell (and its `200` status) is flushed before the page renders. A
`notFound()` raised after that point can no longer change the status code —
the visitor gets a 404 page with an HTTP `200`, which search engines treat as
a duplicate of a valid page. The loading skeletons therefore live in
`app/dashboard/loading.tsx` and `app/admin/loading.tsx`, and
`/courses/[slug]` raises its 404 from `generateMetadata`, which runs before
the shell is sent.

---

## Deploying to Vercel (free tier)

The repository is already configured for a one-click deploy.

1. **Push to GitHub** and import the repository into Vercel.

2. **Set the environment variables** in *Project → Settings → Environment
   Variables*. Add every variable from `.env.example` that you have a value
   for — at minimum `DATABASE_URL` and `BETTER_AUTH_SECRET`.

3. **Create the database.** Neon (Postgres) has a free tier:
   <https://console.neon.tech>. Copy the pooled connection string into
   `DATABASE_URL`.

4. **Apply the migrations** once, from your machine:

   ```bash
   pnpm db:migrate
   ```

   Migrations are deliberately **not** part of the Vercel build — a build
   that mutates the database is slow, non-reproducible and fails the whole
   deployment if the database is briefly unreachable.

5. **Deploy.** Vercel runs `pnpm install --frozen-lockfile` and then
   `pnpm run build`, which runs `prisma generate` before `next build`.

### Vercel configuration (`vercel.json`)

```json
{
  "framework": "nextjs",
  "installCommand": "pnpm install --frozen-lockfile",
  "buildCommand": "pnpm run build",
  "regions": ["iad1"]
}
```

### Stripe webhook

Add a webhook endpoint pointing at `https://<your-domain>/api/webhook/stripe`
and subscribe to:

- `checkout.session.completed`
- `checkout.session.expired`
- `charge.refunded`

Copy the signing secret into `STRIPE_WEBHOOK_SECRET`. For local testing use
the Stripe CLI:

```bash
stripe listen --forward-to localhost:3000/api/webhook/stripe
```

---

## Database & migrations

The schema lives in `prisma/schema.prisma` and the client is generated into
`lib/generated/prisma` (git-ignored).

```bash
pnpm db:migrate      # apply pending migrations (production)
pnpm db:migrate:dev  # create + apply a new migration (development)
pnpm db:generate     # regenerate the client
pnpm db:studio       # open Prisma Studio
```

Migrations are committed under `prisma/migrations`, so a fresh database is
reproducible from an empty state.

---

## Project structure

```
app/
  (public)/        Marketing site — navbar, footer, landing, catalogue
  (auth)/          Sign-in and code verification
  dashboard/       Learner area — courses, certificates, saved, settings
  admin/           Instructor studio — courses, analytics, learners, settings
  api/             Route handlers — auth, storage, Stripe webhook
  data/            Server-only data access layer (one function per query)
components/
  sidebar/         App-shell navigation (admin + learner)
  ui/              shadcn/ui primitives
  rich-text-editor/ TipTap editor + renderers
  file-uploader/   Drag-and-drop uploads to S3
lib/
  env.ts           Validated environment contract
  auth.ts          better-auth configuration
  db.ts            Prisma client singleton
  rate-limit.ts    Postgres-backed rate limiter
  abuse.ts         Anti-bot and email validation
  categories.ts    Canonical course taxonomy
  format.ts        Currency / duration / date formatting
prisma/            Schema + migrations
```

---

## Scripts

| Script | Description |
| --- | --- |
| `pnpm dev` | Development server with Turbopack |
| `pnpm build` | `prisma generate` + production build |
| `pnpm start` | Serve the production build |
| `pnpm lint` | ESLint |
| `pnpm typecheck` | `tsc --noEmit` |
| `pnpm db:migrate` | Apply pending migrations |
| `pnpm db:studio` | Prisma Studio |

> The production build deliberately uses webpack (`next build`) rather than
> `next build --turbopack`. Turbopack's production build is still beta in
> Next.js 15.5 and fails on this project with
> `PageNotFoundError: Cannot find module for page: /_document`. Turbopack is
> still used for `pnpm dev`, where it is fast and stable.

---

## Architecture notes

**Server Components by default.** Pages are rendered on the server; only the
small interactive islands (filters, dialogs, dropdowns) ship JavaScript. The
course description is rendered to HTML on the server, so the TipTap runtime
is never downloaded by a reader.

**One query per concern.** `app/data` contains one function per query, each
with an explicit `select` so Prisma never fetches a column that is not used.
Public catalogue reads are cached with `unstable_cache` and invalidated with
`revalidateTag("courses")`.

**React `cache()` for shared reads.** `getCourseSidebarData` is memoised, so
the layout and the page below it share a single database round-trip instead
of running the same heavy nested query twice.

**Optimistic, denormalised aggregates.** `totalStudents`, `averageRating` and
`totalReviews` are stored on the course row and updated by the server
actions, so the catalogue renders without join-heavy aggregate queries.

**Graceful degradation.** `stripe`, `resend` and `S3` are `null` when their
credentials are absent. The corresponding UI hides itself and the build never
fails.

---

## Security

- Authorisation is enforced in the data layer (`requireUser`, `requireAdmin`),
  never in the client. The middleware only performs a cheap cookie-presence
  redirect as a UX convenience.
- Every write validates its input with Zod and checks ownership.
- Uploads are restricted by content type and size **on the server**, use
  UUID-prefixed keys inside managed prefixes, and can only be deleted by
  admins.
- Rate limiting is distributed (Postgres-backed) and applies to sign-in, code
  verification, checkout, course creation and uploads.
- Bot defence uses a honeypot, a form-elapsed-time check and a disposable
  email blocklist — no paid service, no extra network hop.
- Stripe webhooks are signature-verified, idempotent and answer with 4xx on
  bad input instead of throwing.

---

## Performance

- Turbopack for development and production builds.
- `optimizePackageImports` for the two icon libraries, so only the icons you
  use are bundled.
- AVIF/WebP negotiation, tuned device sizes and a 30-day CDN cache for
  optimised images.
- Immutable cache headers on hashed build assets, Brotli/gzip compression and
  `X-Powered-By` disabled.
- Recharts is loaded with `next/dynamic` on the admin pages only, so the
  public bundle stays small.
- Parallel `Promise.all` data fetching and indexed database queries.
- `scrollbar-gutter: stable` and streaming skeletons remove layout shift.

---

## Licence

Private project. All rights reserved.
