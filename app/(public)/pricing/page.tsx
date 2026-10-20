import Link from "next/link";
import { Check, Info, Minus, Sparkles } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency } from "@/lib/format";
import { Section } from "../_components/landing/Section";
import { PricingFaq } from "./_components/PricingFaq";

export const metadata = {
  title: "Pricing — Ucademy",
  description:
    "Free browsing, a Learner plan at ₹999 a month and a Team plan for companies. Compare exactly what each plan includes before you pay for anything.",
  alternates: { canonical: "/pricing" },
};

/** Amounts are stored in the smallest currency unit (paise). */
const MONTHLY_LEARNER = 99900;
const YEARLY_LEARNER = 799900;

type Tier = {
  id: "free" | "learner" | "team";
  name: string;
  price: string;
  cadence: string;
  alternative?: string;
  tagline: string;
  cta: { label: string; href: string };
  ctaVariant: "default" | "outline";
  highlighted: boolean;
  features: string[];
};

const tiers: Tier[] = [
  {
    id: "free",
    name: "Free",
    price: formatCurrency(0),
    cadence: "forever",
    tagline:
      "See the whole catalogue, try lessons before you pay, and keep track of what you are learning.",
    cta: { label: "Browse courses", href: "/courses" },
    ctaVariant: "outline",
    highlighted: false,
    features: [
      "Browse every published course and the full curriculum",
      "Watch the free preview lessons of any course",
      "Track progress lesson by lesson across every course",
      "Save courses to your wishlist for later",
      "Buy any course individually at its listed price",
    ],
  },
  {
    id: "learner",
    name: "Learner",
    price: formatCurrency(MONTHLY_LEARNER),
    cadence: "per month",
    alternative: `or ${formatCurrency(YEARLY_LEARNER)} per year`,
    tagline:
      "For people taking more than one course and finishing them. Everything you need to earn a certificate.",
    cta: { label: "Get started", href: "/courses" },
    ctaVariant: "default",
    highlighted: true,
    features: [
      "Everything in the Free plan",
      "Full access to every course you purchase",
      "Verified certificates with a unique, shareable serial",
      "Write reviews and rate the courses you finished",
      "Lifetime access, including every future course update",
      "Early access to new tracks and release dates",
    ],
  },
  {
    id: "team",
    name: "Team",
    price: "Custom",
    cadence: "quoted per seat",
    tagline:
      "For companies buying learning for a group, with one invoice and a report of who actually finished.",
    cta: { label: "Talk to us", href: "/help#contact" },
    ctaVariant: "outline",
    highlighted: false,
    features: [
      "Everything in the Learner plan, for every seat",
      "Seats you can add, move and remove yourself",
      "One consolidated invoice instead of many receipts",
      "Progress reporting across the whole team",
      "Priority support and a named onboarding contact",
      "Custom course development, quoted separately",
    ],
  },
];

const comparisonRows: { feature: string; free: boolean; learner: boolean; team: boolean }[] =
  [
    { feature: "Browse the full catalogue", free: true, learner: true, team: true },
    { feature: "Free preview lessons", free: true, learner: true, team: true },
    { feature: "Progress tracking across courses", free: true, learner: true, team: true },
    { feature: "Wishlist of saved courses", free: true, learner: true, team: true },
    { feature: "Full access to purchased courses", free: false, learner: true, team: true },
    { feature: "Verified certificates with a serial", free: false, learner: true, team: true },
    { feature: "Publish reviews and ratings", free: false, learner: true, team: true },
    { feature: "Lifetime access and future updates", free: false, learner: true, team: true },
    { feature: "Seat management", free: false, learner: false, team: true },
    { feature: "Consolidated invoicing", free: false, learner: false, team: true },
    { feature: "Team progress reporting", free: false, learner: false, team: true },
    { feature: "Priority support and onboarding", free: false, learner: false, team: true },
  ];

export default function PricingPage() {
  return (
    <>
      {/* Header */}
      <header className="py-12 md:py-16">
        <p className="text-sm font-medium uppercase tracking-wider text-primary">
          Pricing
        </p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-balance md:text-5xl">
          Pay for what you actually use
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground text-pretty">
          Browsing and progress tracking are free. Courses are sold one at a
          time. The plans below describe what a subscription will look like
          once we switch it on.
        </p>
      </header>

      {/* Honest note about the current model */}
      <div className="flex gap-3 rounded-xl border bg-muted/40 p-4 text-sm">
        <Info className="mt-0.5 size-4 shrink-0 text-primary" />
        <p className="text-muted-foreground">
          <span className="font-medium text-foreground">
            Nothing on this page is billed yet.
          </span>{" "}
          Ucademy currently sells individual courses with lifetime access. The
          Learner and Team plans describe a future subscription product, so
          the buttons below take you to the catalogue or to our help centre
          rather than to a checkout.
        </p>
      </div>

      {/* Tiers */}
      <section className="grid gap-6 py-14 md:grid-cols-3 md:items-start">
        {tiers.map((tier) => (
          <div
            key={tier.id}
            className={
              tier.highlighted
                ? "flex flex-col rounded-2xl border-2 border-primary bg-card p-7 shadow-lg"
                : "flex flex-col rounded-2xl border bg-card p-7"
            }
          >
            {tier.highlighted ? (
              <span className="mb-4 inline-flex w-fit items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                <Sparkles className="size-3" />
                The one most people want
              </span>
            ) : null}

            <h2 className="text-xl font-semibold">{tier.name}</h2>

            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-4xl font-bold tracking-tight">
                {tier.price}
              </span>
              <span className="text-sm text-muted-foreground">{tier.cadence}</span>
            </div>

            {tier.alternative ? (
              <p className="mt-1 text-sm text-muted-foreground">
                {tier.alternative}
              </p>
            ) : null}

            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              {tier.tagline}
            </p>

            <Link
              href={tier.cta.href}
              className={buttonVariants({
                variant: tier.ctaVariant,
                size: "lg",
                className: "mt-6 w-full",
              })}
            >
              {tier.cta.label}
            </Link>

            <ul className="mt-7 space-y-3 border-t pt-6">
              {tier.features.map((feature) => (
                <li key={feature} className="flex gap-3 text-sm">
                  <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                  <span className="text-muted-foreground">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      {/* Comparison table */}
      <Section
        eyebrow="Compare"
        title="Every feature, side by side"
        description="No hidden rows. If a capability is not on this list, it is not part of any plan."
        className="pt-0"
      >
        <div className="overflow-hidden rounded-xl border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[45%]">Feature</TableHead>
                <TableHead className="text-center">Free</TableHead>
                <TableHead className="text-center">Learner</TableHead>
                <TableHead className="text-center">Team</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {comparisonRows.map((row) => (
                <TableRow key={row.feature}>
                  <TableCell className="whitespace-normal font-medium">
                    {row.feature}
                  </TableCell>
                  <TableCell className="text-center">
                    <FeatureMark enabled={row.free} />
                  </TableCell>
                  <TableCell className="text-center">
                    <FeatureMark enabled={row.learner} />
                  </TableCell>
                  <TableCell className="text-center">
                    <FeatureMark enabled={row.team} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Section>

      {/* FAQ */}
      <Section
        eyebrow="FAQ"
        title="Questions about the plans"
        description="How pricing, refunds and cancellation actually work today."
        className="pt-0"
      >
        <div className="mx-auto max-w-3xl">
          <PricingFaq />
        </div>
      </Section>

      {/* CTA */}
      <section className="pb-20">
        <div className="rounded-2xl bg-primary px-6 py-14 text-center text-primary-foreground">
          <Sparkles className="mx-auto size-8" />
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-balance md:text-4xl">
            Start with one course
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-primary-foreground/85">
            You do not need a plan to start. Pick one course, finish it, and
            decide later whether a subscription makes sense for you.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/courses"
              className={buttonVariants({ variant: "secondary", size: "lg" })}
            >
              Explore courses
            </Link>
            <Link
              href="/help#contact"
              className={buttonVariants({
                variant: "outline",
                size: "lg",
                className:
                  "border-primary-foreground/40 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground",
              })}
            >
              Ask us a question
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

function FeatureMark({ enabled }: { enabled: boolean }) {
  if (enabled) {
    return (
      <Check
        className="mx-auto size-4 text-primary"
        aria-label="Included"
      />
    );
  }

  return (
    <Minus
      className="mx-auto size-4 text-muted-foreground/50"
      aria-label="Not included"
    />
  );
}
