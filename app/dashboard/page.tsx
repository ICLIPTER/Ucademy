import Link from "next/link";
import {
  ArrowRight,
  Award,
  BookOpen,
  CheckCircle2,
  Clock,
  Flame,
} from "lucide-react";

import { getEnrolledCourses } from "@/app/data/user/get-enrolled-courses";
import { getLearnerStats } from "@/app/data/user/get-learner-stats";
import { getAllCourses } from "@/app/data/course/get-all-courses";
import { EmptyState } from "@/app/admin/courses/_components/general/EmptyState";
import { PublicCourseCard, PRIORITY_CARD_COUNT } from "../(public)/_components/PublicCourseCard";
import { CourseProgressCard } from "./_components/CourseProgressCard";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatCompactNumber, formatCurrency } from "@/lib/format";
import { courseProgress } from "@/lib/course-progress";

export const metadata = {
  title: "My learning",
  description: "Track your courses, progress and certificates.",
};

export default async function DashboardPage() {
  const [enrolledCourses, stats, catalogue] = await Promise.all([
    getEnrolledCourses(),
    getLearnerStats(),
    getAllCourses(),
  ]);

  const withProgress = enrolledCourses.map((enrollment) => ({
    enrollment,
    progress: courseProgress(enrollment.course),
  }));

  const inProgress = withProgress
    .filter(
      ({ progress }) =>
        progress.totalLessons > 0 &&
        progress.completedLessons > 0 &&
        progress.completedLessons < progress.totalLessons,
    )
    .sort((a, b) => b.progress.progressPercentage - a.progress.progressPercentage);

  const notStarted = withProgress.filter(
    ({ progress }) => progress.completedLessons === 0,
  );

  const completed = withProgress.filter(
    ({ progress }) =>
      progress.totalLessons > 0 &&
      progress.completedLessons === progress.totalLessons,
  );

  const enrolledIds = new Set(enrolledCourses.map((e) => e.course.id));

  const recommended = catalogue
    .filter((course) => !enrolledIds.has(course.id))
    .slice(0, 3);

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">My learning</h1>
          <p className="text-muted-foreground">
            Everything you&apos;re learning, in one place.
          </p>
        </div>
        <Link href="/courses" className={buttonVariants({ variant: "outline" })}>
          <BookOpen className="size-4" />
          Browse courses
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          icon={BookOpen}
          label="Enrolled courses"
          value={formatCompactNumber(stats.enrolledCourses)}
          href="/dashboard"
        />
        <StatCard
          icon={CheckCircle2}
          label="Lessons completed"
          value={formatCompactNumber(stats.completedLessons)}
        />
        <StatCard
          icon={Award}
          label="Certificates"
          value={formatCompactNumber(stats.certificates)}
          href="/dashboard/certificates"
        />
        <StatCard
          icon={Flame}
          label="Total invested"
          value={
            stats.totalSpent > 0 ? formatCurrency(stats.totalSpent) : "—"
          }
        />
      </div>

      {enrolledCourses.length === 0 ? (
        <EmptyState
          title="You haven't enrolled in a course yet"
          description="Browse the catalogue and start learning something new — your progress will show up here."
          buttonText="Browse courses"
          href="/courses"
          icon={<BookOpen className="size-10 text-primary" />}
        />
      ) : (
        <>
          {/* Continue learning */}
          {inProgress.length > 0 && (
            <section className="space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Continue learning</h2>
                <span className="text-sm text-muted-foreground">
                  {inProgress.length} in progress
                </span>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {inProgress.map(({ enrollment }, index) => (
                  <CourseProgressCard
                    key={enrollment.id}
                    data={enrollment}
                    priority={index === 0}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Not started */}
          {notStarted.length > 0 && (
            <section className="space-y-5">
              <h2 className="text-xl font-semibold">Ready to start</h2>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {notStarted.map(({ enrollment }, index) => (
                  <CourseProgressCard
                    key={enrollment.id}
                    data={enrollment}
                    priority={index === 0}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Completed */}
          {completed.length > 0 && (
            <section className="space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Completed</h2>
                <Link
                  href="/dashboard/certificates"
                  className="text-sm text-muted-foreground hover:text-primary"
                >
                  View certificates
                </Link>
              </div>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {completed.map(({ enrollment }, index) => (
                  <CourseProgressCard
                    key={enrollment.id}
                    data={enrollment}
                    priority={index === 0}
                  />
                ))}
              </div>
            </section>
          )}
        </>
      )}

      {/* Recommended */}
      {recommended.length > 0 && (
        <section className="space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Recommended for you</h2>
            <Link
              href="/courses"
              className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary"
            >
              See all
              <ArrowRight className="size-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {recommended.map((course, index) => (
              <PublicCourseCard
                key={course.id}
                data={course}
                priority={index < PRIORITY_CARD_COUNT}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: typeof Clock;
  label: string;
  value: string;
  href?: string;
}) {
  const content = (
    <Card className="transition-shadow hover:shadow-md">
      <CardContent className="flex items-center gap-4 p-5">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="size-5" />
        </span>
        <span className="min-w-0">
          <span className="block text-xl font-bold tabular-nums">{value}</span>
          <span className="block truncate text-xs text-muted-foreground">
            {label}
          </span>
        </span>
      </CardContent>
    </Card>
  );

  if (!href) return content;

  return (
    <Link href={href} className="block rounded-xl focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none">
      {content}
    </Link>
  );
}
