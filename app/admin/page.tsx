import Link from "next/link";
import { Suspense } from "react";
import { ArrowRightIcon, PlusIcon } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { SectionCards } from "@/components/sidebar/section-cards";
import { EnrollmentChart } from "@/components/sidebar/enrollment-chart";
import { AdminGetEnrollmentStats, AdminGetTopCourses } from "@/app/data/admin/admin-get-enrollment-stats";
import { adminGetRecentCourses } from "@/app/data/admin/admin-get-recent-courses";
import { EmptyState } from "./courses/_components/general/EmptyState";
import { AdminCourseCard, AdminCourseCardSkeleton } from "./courses/_components/AdminCourseCard";
import { formatCurrency, formatCompactNumber } from "@/lib/format";
import { Badge } from "@/components/ui/badge";

export default async function AdminIndexPage() {
  const [enrollmentData, topCourses] = await Promise.all([
    AdminGetEnrollmentStats(30),
    AdminGetTopCourses(5),
  ]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard overview</h1>
          <p className="text-muted-foreground">
            A quick glance at your platform&apos;s performance.
          </p>
        </div>

        <Link
          className={buttonVariants({ className: "w-fit" })}
          href="/admin/courses/create"
        >
          <PlusIcon className="size-4" />
          New course
        </Link>
      </div>

      {/* Summary cards */}
      <SectionCards />

      {/* Chart + top courses */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <EnrollmentChart data={enrollmentData} />
        </div>

        <div className="space-y-4 rounded-xl border bg-card p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Top courses</h2>
            <Link
              href="/admin/analytics"
              className="text-sm text-muted-foreground hover:text-primary"
            >
              Analytics
            </Link>
          </div>

          {topCourses.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Publish a course to see performance here.
            </p>
          ) : (
            <ol className="space-y-4">
              {topCourses.map((course, index) => (
                <li key={course.id} className="flex items-start gap-3">
                  <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                    {index + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/courses/${course.slug}`}
                      className="line-clamp-1 text-sm font-medium hover:underline"
                    >
                      {course.title}
                    </Link>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {formatCompactNumber(course.totalStudents)} learners ·{" "}
                      {formatCurrency(course.price)}
                    </p>
                  </div>
                  {course.averageRating > 0 && (
                    <Badge variant="secondary" className="shrink-0">
                      {course.averageRating.toFixed(1)} ★
                    </Badge>
                  )}
                </li>
              ))}
            </ol>
          )}
        </div>
      </div>

      {/* Recent courses */}
      <div className="space-y-4 rounded-xl border bg-card p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Recent courses</h2>
          <Link
            className={buttonVariants({ variant: "outline", size: "sm" })}
            href="/admin/courses"
          >
            View all
            <ArrowRightIcon className="size-4" />
          </Link>
        </div>

        <Suspense fallback={<RecentCoursesSkeleton />}>
          <RenderRecentCourses />
        </Suspense>
      </div>
    </div>
  );
}

async function RenderRecentCourses() {
  const data = await adminGetRecentCourses(4);

  if (data.length === 0) {
    return (
      <EmptyState
        buttonText="Create New Course"
        description="You don't have any courses yet. Create one to see it here."
        title="You don't have any courses yet"
        href="/admin/courses/create"
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {data.map((course) => (
        <AdminCourseCard key={course.id} data={course} />
      ))}
    </div>
  );
}

function RecentCoursesSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {Array.from({ length: 2 }).map((_, index) => (
        <AdminCourseCardSkeleton key={index} />
      ))}
    </div>
  );
}
