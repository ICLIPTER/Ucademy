import Link from "next/link";
import type { ReactNode } from "react";
import {
  BookOpenCheck,
  Clock,
  Cookie,
  CreditCard,
  Mail,
  RefreshCcw,
  Scale,
  ShieldCheck,
  UserCog,
} from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { Section } from "../_components/landing/Section";
import { HelpFaq } from "./_components/HelpFaq";

export const metadata = {
  title: "Help centre — Ucademy",
  description:
    "Answers about courses, progress, certificates, refunds and billing, plus how to reach a human. Written for learners, not for lawyers.",
  alternates: { canonical: "/help" },
};

const SUPPORT_EMAIL = "support@ucademy.app";

const quickLinks = [
  {
    icon: UserCog,
    title: "Account and access",
    description: "Sign-in, progress sync and losing access to your email.",
    href: "#account",
  },
  {
    icon: RefreshCcw,
    title: "Refunds and cancellations",
    description: "The 30-day guarantee, how to claim it and what we exclude.",
    href: "#refunds",
  },
  {
    icon: CreditCard,
    title: "Billing",
    description: "Invoices, taxes, failed payments and payment methods.",
    href: "#billing",
  },
  {
    icon: Mail,
    title: "Contact us",
    description: "Email a human and find out when to expect a reply.",
    href: "#contact",
  },
];

export default function HelpPage() {
  return (
    <>
      {/* Header */}
      <header className="py-12 md:py-16">
        <p className="text-sm font-medium uppercase tracking-wider text-primary">
          Help centre
        </p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-balance md:text-5xl">
          How can we help?
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground text-pretty">
          Search the answers below, or jump straight to the policy you need.
          If something is not covered, email us and a person will reply.
        </p>
      </header>

      {/* Quick links */}
      <section className="grid gap-4 pb-14 sm:grid-cols-2 lg:grid-cols-4">
        {quickLinks.map((link) => (
          <a
            key={link.title}
            href={link.href}
            className="group rounded-xl border bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
          >
            <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <link.icon className="size-5" />
            </span>
            <h2 className="mt-4 text-sm font-semibold">{link.title}</h2>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              {link.description}
            </p>
          </a>
        ))}
      </section>

      {/* FAQ */}
      <Section
        eyebrow="Answers"
        title="Frequently asked questions"
        description="The questions support gets most often, in plain language."
        className="pb-0 pt-0"
      >
        <div className="mx-auto max-w-3xl">
          <HelpFaq />
        </div>
      </Section>

      {/* Legal quick links */}
      <section className="pb-14 pt-14">
        <div className="mx-auto flex max-w-3xl flex-col gap-4 rounded-xl border bg-muted/40 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <Scale className="mt-0.5 size-5 shrink-0 text-primary" />
            <div>
              <h2 className="text-sm font-semibold">The formal documents</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                The plain-language answers above are summaries. The legal terms
                and the privacy policy are the binding versions.
              </p>
            </div>
          </div>
          <div className="flex shrink-0 flex-wrap gap-2">
            <Link
              href="/terms"
              className={buttonVariants({ variant: "outline", size: "sm" })}
            >
              Terms of service
            </Link>
            <Link
              href="/privacy"
              className={buttonVariants({ variant: "outline", size: "sm" })}
            >
              Privacy policy
            </Link>
            <Link
              href="/privacy#cookies"
              className={buttonVariants({ variant: "outline", size: "sm" })}
            >
              <Cookie className="size-4" />
              Cookies
            </Link>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="scroll-mt-24 pb-14">
        <div className="rounded-2xl border bg-card p-6 md:p-10">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-sm font-medium uppercase tracking-wider text-primary">
                Contact
              </p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-balance">
                Talk to a person
              </h2>
              <p className="mt-3 max-w-lg leading-relaxed text-muted-foreground">
                There is no ticket robot in front of us. Write to us and the
                message lands in the same inbox the team reads.
              </p>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <ButtonLink
                  href={`mailto:${SUPPORT_EMAIL}`}
                  label="Email support"
                  icon={<Mail className="size-4" />}
                />
                <Link
                  href="/instructors#apply"
                  className={buttonVariants({ variant: "outline" })}
                >
                  Ask about teaching
                </Link>
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-xl border bg-muted/30 p-5">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Mail className="size-4 text-primary" />
                  {SUPPORT_EMAIL}
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  Use the address on your account so we can find your purchases
                  without asking for details.
                </p>
              </div>

              <div className="rounded-xl border bg-muted/30 p-5">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Clock className="size-4 text-primary" />
                  Response times
                </div>
                <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                  <li>Refunds and billing: within one business day.</li>
                  <li>Account and access issues: within two business days.</li>
                  <li>Everything else: within three business days.</li>
                </ul>
              </div>

              <div className="rounded-xl border bg-muted/30 p-5">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <ShieldCheck className="size-4 text-primary" />
                  What to include
                </div>
                <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                  <li>The email address on your account.</li>
                  <li>The course name, or the order reference for a purchase.</li>
                  <li>What you expected and what happened instead.</li>
                  <li>A screenshot, if a page is not behaving.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Refunds */}
      <section id="refunds" className="scroll-mt-24 pb-14">
        <div className="rounded-2xl border bg-card p-6 md:p-10">
          <p className="text-sm font-medium uppercase tracking-wider text-primary">
            Policy
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-balance">
            Refunds and cancellations
          </h2>

          <div className="mt-6 grid gap-8 lg:grid-cols-2">
            <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
              <h3 className="text-base font-semibold text-foreground">
                The 30-day guarantee
              </h3>
              <p>
                Every course you buy is covered by a 30-day money-back
                guarantee, counted from the day of the purchase. If the course
                is not what we described, tell us within those 30 days and we
                refund it in full. You do not need to justify the request, and
                we do not ask you to complete a feedback form first.
              </p>
              <p>
                We refund to the original payment method. Depending on your
                bank, the money takes 5 to 10 working days to appear. For
                UPI and net banking payments it is usually faster.
              </p>

              <h3 className="pt-2 text-base font-semibold text-foreground">
                How to claim one
              </h3>
              <ol className="list-decimal space-y-2 pl-5">
                <li>
                  Email {SUPPORT_EMAIL} with the email on your account and the
                  course name.
                </li>
                <li>
                  We confirm the purchase and ask one clarifying question if
                  something is unclear.
                </li>
                <li>
                  The refund is issued and you get a confirmation with the
                  reference.
                </li>
              </ol>
            </div>

            <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
              <h3 className="text-base font-semibold text-foreground">
                Cancellations
              </h3>
              <p>
                If you cancel a purchase yourself, the course is removed from
                your account and the refund follows the same path above. A
                course that is already in progress can be cancelled at any
                time during the guarantee period.
              </p>
              <p>
                Any subscription that is running can be cancelled at any time.
                Access continues until the end of the period you have already
                paid for, and you are not charged again.
              </p>

              <h3 className="pt-2 text-base font-semibold text-foreground">
                What we cannot refund
              </h3>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  Purchases more than 30 days old, unless the course is broken
                  or materially different from its description.
                </li>
                <li>
                  Company or team purchases, which are handled by whoever made
                  the purchase on your organisation&apos;s behalf.
                </li>
                <li>
                  Payments that were already refunded to you by your bank or
                  card issuer.
                </li>
              </ul>

              <p className="rounded-lg border bg-muted/40 p-4">
                Buying a course, finishing it and then asking for a refund
                because you finished it is not something we will process. The
                guarantee exists for courses that did not deliver.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Billing */}
      <section id="billing" className="scroll-mt-24 pb-20">
        <div className="rounded-2xl border bg-card p-6 md:p-10">
          <p className="text-sm font-medium uppercase tracking-wider text-primary">
            Policy
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-balance">
            Billing
          </h2>

          <div className="mt-6 grid gap-8 lg:grid-cols-2">
            <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
              <h3 className="text-base font-semibold text-foreground">
                Payment methods
              </h3>
              <p>
                Checkout is handled by Stripe. You can pay with any major card,
                and with UPI and net banking for Indian accounts. The methods
                you see at checkout are the ones we can actually accept in
                your country.
              </p>

              <h3 className="pt-2 text-base font-semibold text-foreground">
                Invoices and receipts
              </h3>
              <p>
                A receipt is emailed to the address on your account as soon as
                a payment completes. If the receipt is missing, check the spam
                folder first, then ask us to resend it. Prices are listed in
                rupees and any tax that applies is shown on the invoice.
              </p>
              <p>
                For team purchases, invoices are issued to the billing contact
                named on the order, not to each individual seat holder.
              </p>
            </div>

            <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
              <h3 className="text-base font-semibold text-foreground">
                Failed and pending payments
              </h3>
              <p>
                If a payment fails, the enrolment stays pending and no access
                is granted until the money clears. Retry with the same card or
                a different method, and write to us if it keeps failing — we
                will not leave a learner stuck at the checkout.
              </p>

              <h3 className="pt-2 text-base font-semibold text-foreground">
                Changing your billing details
              </h3>
              <p>
                Invoices are issued against the address and tax details
                supplied at checkout, so tell us within a reasonable time if
                they need to be corrected. We can reissue an invoice, but we
                cannot rewrite a payment that has already settled.
              </p>

              <h3 className="pt-2 text-base font-semibold text-foreground">
                Security
              </h3>
              <p>
                Card details are entered on Stripe&apos;s pages and never
                reach our servers. Every transaction is confirmed by a signed
                webhook before access is granted, so an enrolment cannot be
                faked by editing a page.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Account */}
      <section id="account" className="scroll-mt-24 pb-20">
        <div className="rounded-2xl border bg-card p-6 md:p-10">
          <p className="text-sm font-medium uppercase tracking-wider text-primary">
            Policy
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-balance">
            Account and access
          </h2>

          <div className="mt-6 grid gap-8 lg:grid-cols-2">
            <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
              <h3 className="text-base font-semibold text-foreground">
                Signing in
              </h3>
              <p>
                You sign in with an email link. If a message never arrives,
                check the spam folder and make sure you are using the same
                address you signed up with. Magic links expire, so request a
                fresh one rather than reusing an old email.
              </p>

              <h3 className="pt-2 text-base font-semibold text-foreground">
                If you lose the email on your account
              </h3>
              <p>
                We can move an account to a new address, but we need proof
                that you own it — a payment reference for a purchase, or the
                serial on a certificate, is enough. This protects learners
                from someone else taking over their progress.
              </p>
            </div>

            <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
              <h3 className="text-base font-semibold text-foreground">
                Progress and certificates
              </h3>
              <p>
                Progress and certificates belong to the account, not to the
                device. Signing in on another device restores everything. If
                progress looks lost, it is almost always a sign-in with a
                different email address.
              </p>

              <h3 className="pt-2 text-base font-semibold text-foreground">
                Deleting your account
              </h3>
              <p>
                Ask us and we will delete your profile, your progress and your
                personal data. Records we are legally required to keep, such
                as invoice details, are retained for the period the tax law
                requires and no longer.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="pb-20">
        <div className="rounded-2xl bg-primary px-6 py-12 text-center text-primary-foreground">
          <BookOpenCheck className="mx-auto size-8" />
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-balance">
            Still stuck?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-primary-foreground/85">
            Send us a message. A real person reads every one, and we would
            rather answer a question twice than let you sit on a blocked
            course.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <a
              href={`mailto:${SUPPORT_EMAIL}`}
              className={buttonVariants({ variant: "secondary", size: "lg" })}
            >
              <Mail className="size-4" />
              {SUPPORT_EMAIL}
            </a>
            <Link
              href="/courses"
              className={buttonVariants({
                variant: "outline",
                size: "lg",
                className:
                  "border-primary-foreground/40 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground",
              })}
            >
              Back to the catalogue
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

/** A mailto link styled as the primary button. */
function ButtonLink({
  href,
  label,
  icon,
}: {
  href: string;
  label: string;
  icon: ReactNode;
}) {
  return (
    <a href={href} className={buttonVariants({ size: "lg" })}>
      {icon}
      {label}
    </a>
  );
}
