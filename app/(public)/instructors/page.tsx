import Link from "next/link";
import {
  BarChart3,
  Check,
  Coins,
  FileText,
  Headphones,
  Infinity as InfinityIcon,
  LineChart,
  Rocket,
  ShieldCheck,
  Video,
} from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { Section } from "../_components/landing/Section";
import { ApplicationForm } from "./_components/ApplicationForm";

export const metadata = {
  title: "Teach on Ucademy",
  description:
    "Turn what you know into a structured course. Publish in your own studio, keep 90% of every sale, and reach learners without a marketing budget.",
  alternates: { canonical: "/instructors" },
};

const benefits = [
  {
    icon: Coins,
    title: "Keep 90% of every sale",
    description:
      "Ninety paise in every rupee of a course sale is yours. The rest covers payment processing, hosting and the platform.",
  },
  {
    icon: Video,
    title: "A real studio",
    description:
      "Write, record, structure, reorder and publish without leaving the platform. Chapters, lessons, thumbnails and trailers all live here.",
  },
  {
    icon: BarChart3,
    title: "Analytics that mean something",
    description:
      "Enrolments, completion rates, ratings and revenue for each course. Not vanity impressions — what learners actually finished.",
  },
  {
    icon: InfinityIcon,
    title: "A catalogue that keeps earning",
    description:
      "Courses do not expire. An updated course finds new learners years after you publish it, without you doing anything.",
  },
  {
    icon: ShieldCheck,
    title: "We run the boring parts",
    description:
      "Video hosting and delivery, payments, receipts, certificates, refunds and the support inbox are handled by us.",
  },
  {
    icon: Headphones,
    title: "A person to ask",
    description:
      "You get a named contact who has read your course. If something is unclear, you can fix it before a learner hits it.",
  },
];

const steps = [
  {
    number: "01",
    title: "Apply",
    description:
      "Send us the topic you want to teach and who it is for. Two paragraphs is enough to start the conversation.",
  },
  {
    number: "02",
    title: "We review it together",
    description:
      "We tell you honestly whether the topic fits, and help you narrow it to something a learner can finish in a weekend.",
  },
  {
    number: "03",
    title: "Build it in the studio",
    description:
      "Structure the chapters, record the lessons, upload the media. We review the outline before you record anything.",
  },
  {
    number: "04",
    title: "Publish and earn",
    description:
      "Set your price, publish, and get 90% of every sale paid out on a schedule that suits you.",
  },
];

const criteria = [
  {
    title: "Evidence that you do the work",
    description:
      "A shipped project, five years of practice, a job you held. We care much less about how many followers you have.",
  },
  {
    title: "A topic with an edge",
    description:
      "Narrow enough to be useful. \"Become a data scientist\" is a curriculum; \"read a Postgres query plan\" is a course.",
  },
  {
    title: "Something teachable in a sitting",
    description:
      "Five to twelve hours of video is the sweet spot. Long enough to be worth buying, short enough to be finished.",
  },
  {
    title: "Real examples",
    description:
      "Show the actual work: the broken code, the wrong chart, the migration that went sideways. Theory is the easy part.",
  },
  {
    title: "A point of view",
    description:
      "Say what you would do and why, including the trade-offs. Learners are paying for judgement, not a summary of a manual.",
  },
  {
    title: "A willingness to update",
    description:
      "Tools change. A course that is honest about its age and updated when it matters is worth more than one that pretends to be timeless.",
  },
];

export default function InstructorsPage() {
  return (
    <>
      {/* Hero */}
      <header className="py-12 md:py-16">
        <p className="text-sm font-medium uppercase tracking-wider text-primary">
          For instructors
        </p>
        <h1 className="mt-3 max-w-3xl text-4xl font-bold tracking-tight text-balance md:text-5xl">
          Teach what you know. We handle the rest.
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground text-pretty">
          If you have spent years getting good at something, you already know
          what a beginner gets wrong. Package that as a course, publish it
          yourself, and keep 90% of what it earns.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="#apply"
            className={buttonVariants({ size: "lg" })}
          >
            <Rocket className="size-4" />
            Apply to teach
          </Link>
          <Link
            href="/courses"
            className={buttonVariants({ variant: "outline", size: "lg" })}
          >
            See what learners get
          </Link>
        </div>
      </header>

      {/* Benefits */}
      <Section
        eyebrow="Why teach here"
        title="Everything except the teaching is our job"
        description="You should be spending your time on the material, not on marketing, hosting and paperwork."
        className="pt-0"
      >
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((benefit) => (
            <div
              key={benefit.title}
              className="rounded-xl border bg-card p-6 transition-shadow hover:shadow-md"
            >
              <div className="flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <benefit.icon className="size-5" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">{benefit.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* How it works */}
      <Section
        eyebrow="How it works"
        title="From idea to published course"
        className="pt-0"
      >
        <div className="grid gap-8 md:grid-cols-4">
          {steps.map((step, index) => (
            <div key={step.number} className="relative">
              <div className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                  {step.number}
                </span>
                {index < steps.length - 1 && (
                  <span
                    aria-hidden
                    className="hidden h-px flex-1 bg-border md:block"
                  />
                )}
              </div>
              <h3 className="mt-4 text-lg font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* Revenue share */}
      <Section
        eyebrow="Revenue"
        title="The 90/10 split, in plain numbers"
        description="No monthly fee, no listing fee, no exclusivity clause, and no clawback if a learner asks for a refund."
        className="pt-0"
      >
        <div className="grid gap-8 rounded-2xl border bg-card p-6 md:p-10 lg:grid-cols-2 lg:items-center">
          <div>
            <div className="flex h-10 w-full overflow-hidden rounded-lg">
              <div className="flex w-[90%] items-center justify-center bg-primary text-sm font-semibold text-primary-foreground">
                90% to you
              </div>
              <div className="flex w-[10%] items-center justify-center bg-muted text-xs font-semibold text-muted-foreground">
                10%
              </div>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              On a course sold for{" "}
              <span className="font-medium text-foreground">₹1,000</span>, you
              keep{" "}
              <span className="font-medium text-foreground">₹900</span> before
              tax. The 10% covers the payment provider&apos;s fee, video
              hosting and delivery, certificates, refunds and the support
              team. If a course sells 100 times, that is ₹90,000 to you.
            </p>
          </div>

          <ul className="space-y-3">
            {[
              "Paid out on a schedule you choose, by bank transfer.",
              "Your earnings, reviews and course analytics are visible in the studio at all times.",
              "If a learner is refunded, the refund is taken out of your share first, never billed back to you.",
              "Prices are yours to set, within a range we agree when the course is published.",
            ].map((point) => (
              <li key={point} className="flex gap-3 text-sm">
                <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                <span className="text-muted-foreground">{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* Criteria */}
      <Section
        eyebrow="What we look for"
        title="What makes a course worth buying"
        description="These are the things we check when an outline lands. They are also what learners are paying for."
        className="pt-0"
      >
        <div className="grid gap-6 md:grid-cols-2">
          {criteria.map((criterion) => (
            <div
              key={criterion.title}
              className="rounded-xl border bg-card p-6"
            >
              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <FileText className="size-4" />
                </span>
                <div>
                  <h3 className="font-semibold">{criterion.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {criterion.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Application */}
      <Section
        eyebrow="Apply"
        title="Tell us what you want to teach"
        description="There is no fee, no exclusivity and no approval committee. We read every outline ourselves."
        className="pt-0"
      >
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_300px]">
          <div id="apply" className="scroll-mt-24">
            <ApplicationForm />
          </div>

          <aside className="space-y-4">
            <div className="rounded-xl border bg-muted/40 p-5">
              <h3 className="flex items-center gap-2 text-sm font-semibold">
                <LineChart className="size-4 text-primary" />
                What happens next
              </h3>
              <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-muted-foreground">
                <li>You send the outline. We read it within three working days.</li>
                <li>If the topic fits, we reply with an idea for the structure.</li>
                <li>You write the course in the studio, with review at the outline stage.</li>
                <li>You publish, set your price, and start earning.</li>
              </ol>
            </div>

            <div className="rounded-xl border bg-muted/40 p-5">
              <h3 className="text-sm font-semibold">Already have a course?</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                If you have written and taught something before, send it to us
                as-is. We are happy to publish material that is already good,
                with an edit pass rather than a rewrite.
              </p>
              <Link
                href="/help#contact"
                className="mt-3 inline-block text-sm font-medium text-primary underline underline-offset-4"
              >
                Ask a question first
              </Link>
            </div>
          </aside>
        </div>
      </Section>
    </>
  );
}
