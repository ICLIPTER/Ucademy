import type { ReactNode } from "react";

import { LegalToc, type LegalSection } from "../_components/LegalToc";

export const metadata = {
  title: "Privacy Policy — Ucademy",
  description:
    "What personal data Ucademy collects, why we collect it, who processes payments and media, the cookies we set, and the rights you have over your data.",
  alternates: { canonical: "/privacy" },
};

const LAST_UPDATED = "20 October 2026";

const sections: (LegalSection & { body: ReactNode })[] = [
  {
    id: "information-we-collect",
    title: "Information We Collect",
    body: (
      <>
        <p>
          We collect the least we can while still running a learning
          platform. In practice that means the following categories of data.
        </p>
        <h3>Account information</h3>
        <p>
          Your name, email address and, if you set one, a profile picture and
          job title. If you sign in with a third-party provider, we receive
          the identifier and email that provider shares with us. Passwords are
          stored as salted hashes, never in plain text.
        </p>
        <h3>Learning activity</h3>
        <p>
          The courses you enrol in, the lessons you complete, your progress
          per lesson, the certificates issued to you, the reviews you write
          and the courses you save to your wishlist. This is the product: it
          is what lets you continue a course on a different device.
        </p>
        <h3>Payment records</h3>
        <p>
          The payment provider&apos;s customer identifier, the price you
          paid, the currency, the status of the payment, any amount refunded,
          and the card brand and last four digits shown back to you. We never
          receive or store a full card number or the security code.
        </p>
        <h3>Technical and security data</h3>
        <p>
          Your IP address, browser and device type, the session identifier and
          the pages you visited. We keep the IP address and user agent
          attached to a session so that we can detect account sharing, limit
          abuse and investigate a compromised account.
        </p>
        <h3>Content you publish</h3>
        <p>
          If you are an instructor: your course drafts, the chapters and
          lessons inside them, the media you upload, and the analytics we
          show you about your own courses. We do not give instructors access
          to other learners&apos; personal data.
        </p>
        <h3>Communications</h3>
        <p>
          Messages you send to support, and the email we send you about
          receipts, enrolment, certificates and account security.
        </p>
      </>
    ),
  },
  {
    id: "how-we-use",
    title: "How We Use Information",
    body: (
      <>
        <p>We use your data to do these things and nothing else:</p>
        <ul>
          <li>Provide the service: enrol you, store your progress, issue certificates and show you your dashboard.</li>
          <li>Authenticate you and keep the account safe, including rate limiting and abuse prevention.</li>
          <li>Take payment, issue receipts and invoices, and handle refunds.</li>
          <li>Send service messages that are part of using the product, such as a receipt or a certificate.</li>
          <li>Send occasional emails about new courses and features. These are optional and every one of them has an unsubscribe link.</li>
          <li>Understand, in aggregate, which pages are slow and which courses people finish, so we can fix the product.</li>
          <li>Detect fraud, spam and abuse, and enforce our terms.</li>
          <li>Meet legal obligations that apply to us as a business.</li>
        </ul>
        <p>
          We do not sell your personal data, and we do not share it for
          advertising. We do not build advertising profiles of individual
          learners.
        </p>
      </>
    ),
  },
  {
    id: "payments",
    title: "Payments",
    body: (
      <>
        <p>
          Payments are handled by Stripe. When you enter card details you are
          on Stripe&apos;s own page, and your card number, expiry date and
          security code are sent directly to them. They never reach our
          servers and we cannot see them.
        </p>
        <p>
          Stripe acts as an independent controller for the payment data it
          processes, and its own privacy policy and terms apply to that data
          in addition to this policy. We receive a confirmation, an amount, a
          currency, a status, the customer identifier and the card brand and
          last four digits, and we store those so we can show you your
          purchases and reconcile our books.
        </p>
        <p>
          When a payment fails, the enrolment stays pending and no access is
          granted. Access is only opened after a signed confirmation from
          Stripe, so it cannot be faked by editing a page.
        </p>
      </>
    ),
  },
  {
    id: "object-storage",
    title: "Object Storage and Media",
    body: (
      <>
        <p>
          Course video, thumbnails and trailers are stored in S3-compatible
          object storage. The storage provider processes the files and their
          metadata on our instructions, under a written data processing
          agreement, and may use its own infrastructure to do it.
        </p>
        <p>
          Media is served to enrolled learners through short-lived signed
          URLs. We keep the object key of each file, the course it belongs to
          and when it was uploaded. We do not use the media for machine
          learning or model training, and we do not allow it to be used that
          way by the storage provider.
        </p>
        <p>
          You keep ownership of the material you upload. You give us the
          licence needed to host it and serve it to learners, which ends when
          you delete the course. We remove material that infringes someone
          else&apos;s rights or breaks our acceptable use rules.
        </p>
      </>
    ),
  },
  {
    id: "cookies",
    title: "Cookies",
    body: (
      <>
        <p>
          We keep cookie usage to the minimum needed to run a signed-in
          service. We set no advertising cookies, no third-party tracking
          cookies, and we run no cross-site trackers.
        </p>
        <h3>Session cookie</h3>
        <p>
          When you sign in we set a session cookie (issued by our
          authentication layer as{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs">
            better-auth.session_token
          </code>
          ). It stores a session identifier so the site knows who you are,
          and it is refreshed once a day. A short-lived cached copy of the
          session is also kept in the cookie in production so that a page
          load does not need a database round trip. The cookie expires when
          you sign out or after 30 days of inactivity. It is strictly
          necessary and cannot be switched off without breaking sign-in.
        </p>
        <h3>Theme preference</h3>
        <p>
          Your light or dark theme choice is stored in your browser&apos;s
          local storage under the key{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs">theme</code>
          , not in a cookie. It stays on your device, is never sent to us, and
          is only read to decide which theme to paint the page with.
        </p>
        <h3>Sign-in and verification codes</h3>
        <p>
          If you sign in with an email code, the code is sent to your inbox
          and is valid for five minutes. It is never stored in a cookie and
          we do not keep a copy of it after it is used.
        </p>
        <h3>Clearing them</h3>
        <p>
          You can clear cookies and site data in your browser settings at any
          time. Doing so signs you out and resets your theme to the system
          default. Nothing else is affected, and no personal data is lost
          from our side, because your account and progress live on the server
          rather than in your browser.
        </p>
        <p>
          Because we do not use analytics or advertising cookies, there is
          nothing to consent to and no cookie banner to dismiss.
        </p>
      </>
    ),
  },
  {
    id: "your-rights",
    title: "Your Rights",
    body: (
      <>
        <p>
          Depending on where you live, you may have the right to ask us to:
        </p>
        <ul>
          <li>Give you a copy of the personal data we hold about you.</li>
          <li>Correct anything that is wrong or out of date.</li>
          <li>Delete your account and the personal data attached to it.</li>
          <li>Restrict or object to how we use your data.</li>
          <li>Receive your data in a portable, machine-readable format.</li>
          <li>Withdraw consent for optional marketing email at any time, using the unsubscribe link in the email or by telling us.</li>
        </ul>
        <p>
          Email{" "}
          <a
            href="mailto:support@ucademy.app"
            className="font-medium text-primary underline underline-offset-4"
          >
            support@ucademy.app
          </a>{" "}
          and we will action it. We respond within 30 days, and usually much
          sooner. We do not charge for this and we do not treat a data request
          differently from any other message.
        </p>
        <p>
          If you are unhappy with our response you can complain to your local
          data protection authority.
        </p>
      </>
    ),
  },
  {
    id: "retention",
    title: "Data Retention",
    body: (
      <>
        <p>
          We keep data only for as long as we have a reason to.
        </p>
        <ul>
          <li>Account and learning data is kept for as long as your account is open, and deleted when you close it.</li>
          <li>Invoice and transaction records are kept for eight years, because tax law requires it.</li>
          <li>Session records, including the IP address and user agent, are kept for 30 days and then deleted.</li>
          <li>Support correspondence is kept for two years so that we have the history of what we promised you.</li>
          <li>Rate limiting counters are deleted once the window they cover has passed.</li>
          <li>Backups roll on a 35-day cycle, so deleted data disappears from them within that period.</li>
        </ul>
        <p>
          Where we delete data on request, it is removed from the live
          database immediately and from backups as those backups roll. The
          invoice records described above are the exception, and they are
          detached from your account so that they are no longer personal
          data in practice.
        </p>
      </>
    ),
  },
  {
    id: "security",
    title: "Data Security",
    body: (
      <>
        <p>
          Traffic is encrypted in transit with TLS, and data at rest is
          encrypted by our hosting and storage providers. Passwords are stored
          as salted hashes using a deliberately slow algorithm, so a stolen
          database is not a list of usable passwords. Session tokens are
          rotated and signed.
        </p>
        <p>
          Access to production data is limited to the people who need it, and
          instructors see analytics for their own courses rather than the
          personal details of the people who bought them. Backups are
          encrypted and tested.
        </p>
        <p>
          No system is perfectly secure. If a breach affects your personal
          data we will tell you and the relevant authority without undue
          delay, describe what happened in plain language, and explain what
          we are doing about it.
        </p>
      </>
    ),
  },
  {
    id: "children",
    title: "Children's Privacy",
    body: (
      <>
        <p>
          Ucademy is not directed at children, and we do not knowingly
          collect personal data from anyone under 13 (or under the age of
          digital consent where you live, if that is higher). If you believe
          a child has created an account, write to us and we will delete it
          and its data.
        </p>
        <p>
          Schools and companies buying seats are responsible for obtaining
          any consent a learner needs, and for setting up an appropriate
          arrangement for the people they enrol.
        </p>
      </>
    ),
  },
  {
    id: "international-transfers",
    title: "International Transfers",
    body: (
      <>
        <p>
          Some of the services we rely on are outside India, including payment
          processing, object storage, email delivery and application hosting.
          Your data can therefore be processed in another country.
        </p>
        <p>
          Where that happens we rely on an adequacy decision or on standard
          contractual clauses, and we keep transfers to the minimum needed to
          deliver the service. Data is encrypted in transit wherever it
          travels.
        </p>
        <p>
          If you want to know which providers hold your data and where they
          are based, ask us and we will tell you. Our current providers are
          listed throughout this policy.
        </p>
      </>
    ),
  },
  {
    id: "changes",
    title: "Changes",
    body: (
      <>
        <p>
          We update this policy when we change what we collect or what we do
          with it. Material changes are announced by email and posted here at
          least 14 days before they take effect, and earlier versions stay
          available so you can see exactly what changed.
        </p>
        <p>
          If a change affects how we use data you have already given us, and
          we need your consent, we will ask for it rather than assume it.
        </p>
      </>
    ),
  },
  {
    id: "contact",
    title: "Contact",
    body: (
      <>
        <p>
          For anything about your data, write to{" "}
          <a
            href="mailto:support@ucademy.app"
            className="font-medium text-primary underline underline-offset-4"
          >
            support@ucademy.app
          </a>
          . Our postal address is: Ucademy, Bengaluru, Karnataka, India.
        </p>
        <p>
          If you are in the European Economic Area or the United Kingdom, you
          can also reach our data protection contact at the same address, or
          complain to your local supervisory authority.
        </p>
      </>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <>
      <header className="py-12 md:py-16">
        <p className="text-sm font-medium uppercase tracking-wider text-primary">
          Legal
        </p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-balance md:text-5xl">
          Privacy Policy
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground text-pretty">
          What we collect, why we collect it, and what you can do about it.
          The cookie section is the one most people are looking for.
        </p>
      </header>

      <div className="sticky top-16 z-30 border-y bg-background/95 py-3 backdrop-blur">
        <p className="text-xs text-muted-foreground">
          Last updated:{" "}
          <span className="font-medium text-foreground">{LAST_UPDATED}</span>
          <span className="mx-2 text-border">|</span>
          <a
            href="#cookies"
            className="font-medium text-primary underline underline-offset-4"
          >
            Jump to the cookies section
          </a>
        </p>
      </div>

      <div className="grid gap-10 pb-20 pt-10 lg:grid-cols-[240px_minmax(0,1fr)]">
        <aside className="hidden lg:block">
          <div className="sticky top-32">
            <LegalToc sections={sections} />
          </div>
        </aside>

        <article className="min-w-0">
          {sections.map((section, index) => (
            <section
              key={section.id}
              id={section.id}
              className="scroll-mt-32 border-b pb-10 pt-2 last:border-b-0"
            >
              <h2 className="text-2xl font-bold tracking-tight text-balance">
                <span className="text-muted-foreground">
                  {String(index + 1).padStart(2, "0")}
                </span>{" "}
                {section.title}
              </h2>
              <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_code]:text-foreground [&_h3]:pt-2 [&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-foreground [&_li]:pl-1 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5">
                {section.body}
              </div>
            </section>
          ))}
        </article>
      </div>
    </>
  );
}
