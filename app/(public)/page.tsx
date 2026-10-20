import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { CategoryGrid } from "./_components/landing/CategoryGrid";
import { FaqSection } from "./_components/landing/FaqSection";
import { FeaturesSection } from "./_components/landing/FeaturesSection";
import { HeroSection } from "./_components/landing/HeroSection";
import { HowItWorks } from "./_components/landing/HowItWorks";
import { InstructorCta } from "./_components/landing/InstructorCta";
import { Section, Stat } from "./_components/landing/Section";
import { Testimonials } from "./_components/landing/Testimonials";
import { PublicCourseCard, PRIORITY_CARD_COUNT } from "./_components/PublicCourseCard";
import { getFeaturedCourses, getLatestCourses } from "@/app/data/course/get-all-courses";
import { getPlatformStats } from "@/app/data/platform/get-platform-stats";
import { formatCompactNumber } from "@/lib/format";
import { ArrowRight, Sparkles } from "lucide-react";

export const metadata = {
  title: "Ucademy — Learn the skills the industry hires for",
  description:
    "Practical, structured online courses with progress tracking, verified certificates and instructors who do the work. Start learning free today.",
  alternates: { canonical: "/" },
};

export default async function Home() {
  const [featured, latest, stats] = await Promise.all([
    getFeaturedCourses(3),
    getLatestCourses(3),
    getPlatformStats(),
  ]);

  const { publishedCourses: courseCount, learners: learnerCount } = stats;

  // Prefer the newest courses, and fall back to the top rated ones so the
  // section is never empty on a fresh install.
  const spotlight = latest.length > 0 ? latest : featured;

  return (
    <>
      <HeroSection courseCount={courseCount} learnerCount={learnerCount} />

      {/* Social proof */}
      <section className="border-y bg-muted/30 py-8">
        <div className="grid grid-cols-2 gap-6 text-center md:grid-cols-4">
          <Stat value={formatCompactNumber(courseCount)} label="Published courses" />
          <Stat value={formatCompactNumber(learnerCount)} label="Registered learners" />
          <Stat value="4.8/5" label="Average course rating" />
          <Stat value="30 days" label="Money-back guarantee" />
        </div>
      </section>

      {/* Categories */}
      <Section
        eyebrow="Browse"
        title="Learn what matters to you"
        description="Twelve focused tracks, each with courses that go deep instead of wide."
        action={
          <Link
            href="/categories"
            className={buttonVariants({ variant: "outline", size: "sm" })}
          >
            All categories
            <ArrowRight className="size-4" />
          </Link>
        }
      >
        <CategoryGrid />
      </Section>

      {/* Featured courses */}
      {spotlight.length > 0 && (
        <Section
          eyebrow="Fresh"
          title="Newly published courses"
          description="The latest additions to the catalogue, ready to enrol today."
          action={
            <Link
              href="/courses"
              className={buttonVariants({ variant: "outline", size: "sm" })}
            >
              View all courses
              <ArrowRight className="size-4" />
            </Link>
          }
        >
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {spotlight.map((course, index) => (
              <PublicCourseCard
                key={course.id}
                data={course}
                priority={index < PRIORITY_CARD_COUNT}
              />
            ))}
          </div>
        </Section>
      )}

      {/* How it works */}
      <Section eyebrow="How it works" title="Three steps to a finished course">
        <HowItWorks />
      </Section>

      {/* Features */}
      <Section
        eyebrow="Why Ucademy"
        title="Everything a serious learning platform needs"
        description="The parts that make the difference between starting a course and finishing one."
      >
        <FeaturesSection />
      </Section>

      {/* Testimonials */}
      <Section
        eyebrow="Reviews"
        title="What learners say"
        description="Feedback from people using Ucademy to build real skills."
      >
        <Testimonials />
      </Section>

      {/* Instructor CTA */}
      <section className="pb-16">
        <InstructorCta />
      </section>

      {/* FAQ */}
      <Section
        eyebrow="FAQ"
        title="Questions, answered"
        description="Everything learners usually ask before they enrol."
      >
        <div className="mx-auto max-w-3xl">
          <FaqSection />
        </div>
      </Section>

      {/* Final CTA */}
      <section className="pb-20">
        <div className="rounded-2xl bg-primary px-6 py-14 text-center text-primary-foreground">
          <Sparkles className="mx-auto size-8" />
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-balance md:text-4xl">
            Your next skill is one course away
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-primary-foreground/85">
            Join thousands of learners building practical skills with
            structured, expert-led courses.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/courses"
              className={buttonVariants({
                variant: "secondary",
                size: "lg",
              })}
            >
              Explore courses
            </Link>
            <Link
              href="/login"
              className={buttonVariants({
                variant: "outline",
                size: "lg",
                className:
                  "border-primary-foreground/40 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground",
              })}
            >
              Create a free account
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
