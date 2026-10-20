import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CourseSearch } from "./CourseSearch";
import { Star, Users, Award, PlayCircle } from "lucide-react";

/**
 * Landing hero.
 *
 * Server-rendered apart from the search box, which is a small client island.
 */
export function HeroSection({
  courseCount,
  learnerCount,
}: {
  courseCount: number;
  learnerCount: number;
}) {
  return (
    <section className="relative overflow-hidden">
      {/* Soft background wash — pure CSS, no image request. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_50%_0%,var(--primary)/12%,transparent_70%)]"
      />

      <div className="flex flex-col items-center gap-8 py-16 text-center md:py-24">
        <Badge variant="outline" className="gap-1.5 px-3 py-1">
          <Star className="size-3 fill-amber-400 text-amber-400" />
          Practical courses. Real projects. Certificates that count.
        </Badge>

        <div className="max-w-4xl space-y-6">
          <h1 className="text-4xl font-bold tracking-tight text-balance md:text-6xl">
            Build the skills the{" "}
            <span className="text-primary">industry actually hires for</span>
          </h1>

          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-muted-foreground text-pretty md:text-xl">
            Learn from practitioners, track your progress lesson by lesson, and
            leave with work you can show. Start free, upgrade when you&apos;re
            ready.
          </p>
        </div>

        <CourseSearch />

        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-muted-foreground">
          <span className="flex items-center gap-2">
            <PlayCircle className="size-4 text-primary" />
            {courseCount}+ structured courses
          </span>
          <span className="flex items-center gap-2">
            <Users className="size-4 text-primary" />
            {learnerCount > 0 ? `${learnerCount} learners` : "Join learners worldwide"}
          </span>
          <span className="flex items-center gap-2">
            <Award className="size-4 text-primary" />
            Shareable certificates
          </span>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button size="lg" asChild>
            <Link href="/courses">Explore courses</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/instructors">Teach on Ucademy</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
