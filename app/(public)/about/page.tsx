import Link from "next/link";
import {
  BadgeCheck,
  BookOpenCheck,
  Compass,
  Handshake,
  Receipt,
  Scale,
} from "lucide-react";

import { prisma } from "@/lib/db";
import { formatCompactNumber } from "@/lib/format";
import { buttonVariants } from "@/components/ui/button";
import { COURSE_CATEGORIES } from "@/lib/categories";
import { Section, Stat } from "../_components/landing/Section";

export const metadata = {
  title: "About us — Ucademy",
  description:
    "Why Ucademy exists, how the platform is built, what we believe about online learning and who works on the team.",
  alternates: { canonical: "/about" },
};

const values = [
  {
    icon: BookOpenCheck,
    title: "Completion beats consumption",
    description:
      "The metric that matters is how many people finish a course, not how many hours they streamed. Every design decision we make is judged against that.",
  },
  {
    icon: Receipt,
    title: "The price is on the page",
    description:
      "You see the cost, the full curriculum, the level and the refund window before you enter a single detail. No drip pricing, no countdown timers.",
  },
  {
    icon: Compass,
    title: "Practitioners teach",
    description:
      "We publish courses from people who do the work daily and can point at what changed their mind. A popular blog is not a qualification.",
  },
  {
    icon: Scale,
    title: "Your record is yours",
    description:
      "Download your certificates, ask us to delete your account, and get a straight answer on your data. We do not hold progress hostage.",
  },
];

const team = [
  {
    name: "Aditi Menon",
    role: "Founder",
    initials: "AM",
    bio: "Started Ucademy after buying four courses in a year and finishing none of them. Previously built scheduling software for a logistics company.",
    accent: "bg-blue-500/15 text-blue-700 dark:text-blue-300",
  },
  {
    name: "Rahul Iyer",
    role: "Head of Instruction",
    initials: "RI",
    bio: "Spends his days reading course outlines and rejecting the ones that are a list of topics instead of a path. Taught statistics for a decade.",
    accent: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
  },
  {
    name: "Sofia Marchetti",
    role: "Lead Engineer",
    initials: "SM",
    bio: "Owns the course player, the progress engine and the certificate signer. Cares mostly about how fast the player is on a three-year-old phone.",
    accent: "bg-violet-500/15 text-violet-700 dark:text-violet-300",
  },
  {
    name: "Tomás Ferreira",
    role: "Head of Design",
    initials: "TF",
    bio: "Keeps the interface quiet so the content can be loud. Believes a course page should answer one question: is this worth my weekend?",
    accent: "bg-amber-500/15 text-amber-700 dark:text-amber-300",
  },
  {
    name: "Grace Okonkwo",
    role: "Learner Support",
    initials: "GO",
    bio: "Handles refunds, billing questions and the messages that arrive at 2am. Has never once made a learner wait longer than a day.",
    accent: "bg-rose-500/15 text-rose-700 dark:text-rose-300",
  },
];

export default async function AboutPage() {
  const [courseCount, learnerCount, rating] = await Promise.all([
    prisma.course.count({ where: { status: "PUBLISHED" } }),
    prisma.user.count(),
    prisma.course.aggregate({
      where: { status: "PUBLISHED" },
      _avg: { averageRating: true },
    }),
  ]);

  const averageRating = rating._avg.averageRating;

  return (
    <>
      {/* Hero */}
      <header className="py-12 md:py-16">
        <p className="text-sm font-medium uppercase tracking-wider text-primary">
          About
        </p>
        <h1 className="mt-3 max-w-3xl text-4xl font-bold tracking-tight text-balance md:text-5xl">
          We are trying to make people finish what they start
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground text-pretty">
          Ucademy is a small, independent learning platform built around one
          stubborn idea: most online courses are abandoned halfway through, and
          the reason is almost never the teaching.
        </p>
      </header>

      {/* Stats band */}
      <section className="border-y bg-muted/30 py-8">
        <div className="grid grid-cols-2 gap-6 text-center md:grid-cols-4">
          <Stat
            value={formatCompactNumber(courseCount)}
            label="Published courses"
          />
          <Stat
            value={formatCompactNumber(learnerCount)}
            label="Registered learners"
          />
          <Stat value={String(COURSE_CATEGORIES.length)} label="Learning tracks" />
          <Stat
            value={
              averageRating && averageRating > 0
                ? `${averageRating.toFixed(1)}/5`
                : "—"
            }
            label="Average course rating"
          />
        </div>
      </section>

      {/* Our story */}
      <Section
        eyebrow="Our story"
        title="It started with four unfinished courses"
        className="pb-0"
      >
        <div className="max-w-3xl space-y-5 text-muted-foreground">
          <p className="leading-relaxed">
            The founders of Ucademy bought four courses in the first year of
            trying to learn on their own, and finished none of them. The
            courses were not bad. The videos were sharp, the instructors knew
            their subjects. The problem was that each course was a wall: no
            clear order, no sense of how far along you were, and no way to
            know what you had already sat through an hour earlier.
          </p>
          <p className="leading-relaxed">
            The platforms that do best are built around catalogue size. More
            courses, more hours, more traffic. That is a reasonable business,
            but it optimises for browsing, and browsing is not learning. So we
            built the opposite: short lessons in a fixed order, progress that
            survives a closed tab, a curriculum you can read before you pay,
            and a certificate only issued once every lesson is actually done.
          </p>
          <p className="leading-relaxed">
            Ucademy launched with a single track and a handful of courses
            written by people we already knew. It now covers{" "}
            {COURSE_CATEGORIES.length} tracks, and the catalogue grows every
            week as instructors publish. Courses are priced individually and
            include lifetime access, because a subscription that you cancel
            should not take your notes and your certificate with it.
          </p>
          <p className="leading-relaxed">
            We are deliberately small. There is no mobile app yet, no live
            cohort sessions, no AI tutor, and our certificates are not
            accredited by any university. What we do have is a working player,
            an honest catalogue and a refund policy we would happily defend.
          </p>
        </div>
      </Section>

      {/* What we believe */}
      <Section
        eyebrow="What we believe"
        title="Four positions we will argue about"
        description="These are decisions, not slogans. They decide what we build and what we refuse to build."
        className="pb-0"
      >
        <div className="grid gap-6 sm:grid-cols-2">
          {values.map((value) => (
            <div
              key={value.title}
              className="rounded-xl border bg-card p-6 transition-shadow hover:shadow-md"
            >
              <div className="flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <value.icon className="size-5" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">{value.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* The team */}
      <Section
        eyebrow="The team"
        title="The people behind the platform"
        description="A small group spread across three time zones, most of them former learners."
        className="pb-0"
      >
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {team.map((member) => (
            <div
              key={member.name}
              className="rounded-xl border bg-card p-6 transition-shadow hover:shadow-md"
            >
              <div className="flex items-center gap-4">
                <span
                  aria-hidden
                  className={`flex size-12 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${member.accent}`}
                >
                  {member.initials}
                </span>
                <div>
                  <h3 className="font-semibold">{member.name}</h3>
                  <p className="text-sm text-muted-foreground">{member.role}</p>
                </div>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                {member.bio}
              </p>
            </div>
          ))}
        </div>

        <p className="mt-6 text-xs text-muted-foreground">
          These profiles are placeholders. Real names, photographs and
          biographies will be published as the team grows.
        </p>
      </Section>

      {/* CTA */}
      <section className="pb-20 pt-14">
        <div className="rounded-2xl border bg-muted/40 px-6 py-12 text-center md:px-12">
          <Handshake className="mx-auto size-8 text-primary" />
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-balance">
            Want to build with us?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground text-pretty">
            Instructors publish their own courses and keep 90% of the revenue.
            If you know a subject well enough to teach it, that is the shortest
            route into Ucademy.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/instructors#apply"
              className={buttonVariants({ size: "lg" })}
            >
              <BadgeCheck className="size-4" />
              Teach on Ucademy
            </Link>
            <Link
              href="/courses"
              className={buttonVariants({ variant: "outline", size: "lg" })}
            >
              Explore courses
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
