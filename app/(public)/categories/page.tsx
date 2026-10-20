import Link from "next/link";
import { ArrowRight, BookOpen, Compass } from "lucide-react";

import { getCategoryCounts } from "@/app/data/course/get-category-counts";
import { buttonVariants } from "@/components/ui/button";
import { COURSE_CATEGORIES } from "@/lib/categories";
import { CategoryIcon } from "../_components/landing/CategoryIcon";

export const metadata = {
  title: "Browse categories — Ucademy",
  description:
    "Twelve focused learning tracks, from production development to teaching and academics. See how many courses are published in each category today and jump straight to the catalogue.",
  alternates: { canonical: "/categories" },
};

export default async function CategoriesPage() {
  const counts = await getCategoryCounts();

  const totalCourses = Object.values(counts).reduce(
    (total, count) => total + count,
    0,
  );
  const activeTracks = Object.values(counts).filter(
    (count) => count > 0,
  ).length;

  return (
    <>
      {/* Header */}
      <header className="py-12 md:py-16">
        <p className="text-sm font-medium uppercase tracking-wider text-primary">
          Directory
        </p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-balance md:text-5xl">
          Browse categories
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground text-pretty">
          Twelve learning tracks. Every course sits in exactly one of them, and
          each track is narrow enough that a course inside it goes deep instead
          of wide.
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
          <span className="flex items-center gap-2">
            <BookOpen className="size-4 text-primary" />
            {totalCourses} published{" "}
            {totalCourses === 1 ? "course" : "courses"}
          </span>
          <span className="flex items-center gap-2">
            <Compass className="size-4 text-primary" />
            {activeTracks} of {COURSE_CATEGORIES.length} tracks have content
          </span>
        </div>
      </header>

      {/* Category cards */}
      <section className="grid gap-4 pb-16 sm:grid-cols-2 lg:grid-cols-3">
        {COURSE_CATEGORIES.map((category) => {
          const count = counts[category.slug] ?? 0;

          return (
            <Link
              key={category.slug}
              href={`/courses?category=${category.slug}`}
              className="group flex flex-col rounded-2xl border bg-card p-6 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-4">
                <span className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <CategoryIcon name={category.icon} className="size-6" />
                </span>

                {count > 0 ? (
                  <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
                    {count} {count === 1 ? "course" : "courses"}
                  </span>
                ) : null}
              </div>

              <h2 className="mt-5 text-lg font-semibold">{category.label}</h2>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                {category.description}
              </p>

              <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                {count > 0 ? (
                  <>
                    View the track
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                  </>
                ) : (
                  <span className="text-muted-foreground">
                    Nothing published here yet
                  </span>
                )}
              </span>
            </Link>
          );
        })}
      </section>

      {/* CTA */}
      <section className="pb-20">
        <div className="rounded-2xl border bg-muted/40 px-6 py-12 text-center md:px-12">
          <h2 className="text-3xl font-bold tracking-tight text-balance">
            Not sure which track fits?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground text-pretty">
            Search the whole catalogue by keyword, or filter by level and sort
            by rating, price or popularity.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/courses" className={buttonVariants({ size: "lg" })}>
              Explore all courses
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/pricing"
              className={buttonVariants({ variant: "outline", size: "lg" })}
            >
              See pricing
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
