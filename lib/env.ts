import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

/**
 * Environment contract.
 *
 * Design rules (these exist because the app must build & boot on a free
 * Vercel Hobby account):
 *
 *  1. Nothing that is *optional at runtime* is allowed to be *required at
 *     build time*. Next.js evaluates this module while collecting page data,
 *     so a single missing optional var used to abort the whole build.
 *  2. External providers (Stripe, Resend, GitHub OAuth, S3) are all optional.
 *     When a provider is not configured the corresponding feature degrades
 *     gracefully instead of throwing.
 *  3. Only `DATABASE_URL` and `BETTER_AUTH_SECRET` are truly mandatory.
 *
 * `SKIP_ENV_VALIDATION=1` bypasses validation entirely (used by CI / image
 * builds that validate the schema before booting).
 */
export const env = createEnv({
  server: {
    // --- Core (required) -------------------------------------------------
    DATABASE_URL: z
      .string()
      .min(1, "DATABASE_URL is required")
      .refine(
        (v) => v.startsWith("postgres://") || v.startsWith("postgresql://"),
        "DATABASE_URL must be a Postgres connection string",
      ),
    BETTER_AUTH_SECRET: z.string().min(16, "BETTER_AUTH_SECRET must be at least 16 characters"),

    // --- Core (optional, with defaults) ----------------------------------
    BETTER_AUTH_URL: z.string().min(1).default("http://localhost:3000"),
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),

    // --- Auth providers (optional) ---------------------------------------
    AUTH_GITHUB_CLIENT_ID: z.string().min(1).optional(),
    AUTH_GITHUB_SECRET: z.string().min(1).optional(),
    AUTH_GITHUB_REDIRECT_URI: z.string().min(1).optional(),

    // --- Email (optional) -------------------------------------------------
    RESEND_API_KEY: z.string().min(1).optional(),
    /**
     * Verified Resend sender. Resend's `onboarding@resend.dev` sandbox only
     * delivers to the account owner, so a real domain is required for a
     * production deployment.
     */
    RESEND_FROM_EMAIL: z.string().min(1).default("Ucademy <onboarding@resend.dev>"),

    // --- Object storage (optional) ---------------------------------------
    AWS_ACCESS_KEY_ID: z.string().min(1).optional(),
    AWS_SECRET_ACCESS_KEY: z.string().min(1).optional(),
    AWS_ENDPOINT_URL_S3: z.string().min(1).optional(),
    AWS_REGION: z.string().min(1).default("us-east-1"),
    /** Set to `true` for AWS S3, `false` for path-style providers (T3, R2, MinIO). */
    AWS_S3_FORCE_PATH_STYLE: z
      .enum(["true", "false"])
      .default("false")
      .transform((v) => v === "true"),

    // --- Payments (optional) ----------------------------------------------
    STRIPE_SECRET_KEY: z.string().min(1).optional(),
    STRIPE_WEBHOOK_SECRET: z.string().min(1).optional(),

    // --- Bot / abuse protection -------------------------------------------
    /**
     * When set, request fingerprinting is enabled. Left unset by default so
     * the platform runs with zero paid third-party dependencies.
     */
    TURNSTILE_SECRET_KEY: z.string().min(1).optional(),
    TURNSTILE_SITE_KEY: z.string().min(1).optional(),
  },

  client: {
    NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES: z.string().min(1).default("ucademy"),
    /**
     * Public base URL that serves the object-storage bucket. Defaults to the
     * virtual-hosted style used by T3 (`https://<bucket>.t3.storage.dev`).
     * Override for Cloudflare R2 (`https://pub-xxxx.r2.dev`) or a CDN.
     */
    NEXT_PUBLIC_STORAGE_BASE_URL: z.string().min(1).optional(),
    /** Canonical origin used for metadata, sitemap and OG tags. */
    NEXT_PUBLIC_APP_URL: z.string().min(1).optional(),
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().min(1).optional(),
    NEXT_PUBLIC_TURNSTILE_SITE_KEY: z.string().min(1).optional(),
  },

  /**
   * Next.js inlines `process.env.NEXT_PUBLIC_*` at build time, so the client
   * bundle cannot read them dynamically. t3-env needs the explicit mapping.
   */
  experimental__runtimeEnv: {
    NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES:
      process.env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES,
    NEXT_PUBLIC_STORAGE_BASE_URL: process.env.NEXT_PUBLIC_STORAGE_BASE_URL,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    NEXT_PUBLIC_TURNSTILE_SITE_KEY:
      process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
  },

  /**
   * Never throw during `next build`. The build must succeed so the app can be
   * deployed; runtime requests surface configuration problems instead.
   */
  skipValidation: process.env.SKIP_ENV_VALIDATION === "1",
  emptyStringAsUndefined: true,
});

/** Canonical origin of the deployment (no trailing slash). */
export const appUrl = (
  env.NEXT_PUBLIC_APP_URL ??
  env.BETTER_AUTH_URL ??
  "http://localhost:3000"
).replace(/\/$/, "");

/** True when the given provider is configured and safe to call. */
export const hasStripe = Boolean(env.STRIPE_SECRET_KEY);
export const hasResend = Boolean(env.RESEND_API_KEY);
export const hasGitHub = Boolean(
  env.AUTH_GITHUB_CLIENT_ID && env.AUTH_GITHUB_SECRET,
);
export const hasStorage = Boolean(
  env.AWS_ACCESS_KEY_ID &&
    env.AWS_SECRET_ACCESS_KEY &&
    env.AWS_ENDPOINT_URL_S3,
);
