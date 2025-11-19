import { ChartAreaInteractive } from "@/components/sidebar/chart-area-interactive";
import { SectionCards } from "@/components/sidebar/section-cards";
import { AdminGetEnrollmentStats } from "../data/admin/admin-get-enrollment-stats";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { EmptyState } from "./courses/_components/general/EmptyState";
import { AdminCourseCard, AdminCourseCardSkeleton } from "./courses/_components/AdminCourseCard";
import { adminGetRecentCourses } from "../data/admin/admin-get-recent-courses";
import { Suspense } from "react";

export default async function AdminIndexPage() {
  const enrollmentData = await AdminGetEnrollmentStats();

  return (
    <div className="space-y-10 p-6 animate-in fade-in duration-500">
      {/* Dashboard Top Section */}
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
        <p className="text-muted-foreground">A quick glance at your platform&apos; performance.</p>
      </div>

      {/* Summary Cards */}
      <SectionCards />

      {/* Chart Section */}
      <div className="rounded-2xl bg-card shadow-xl border p-6 hover:shadow-2xl transition-shadow duration-300">
        <h2 className="text-xl font-semibold mb-4">Enrollment Trends</h2>
        <ChartAreaInteractive data={enrollmentData} />
      </div>

      {/* Recent Courses */}
      <div className="space-y-4 rounded-2xl bg-card shadow-xl border p-6 hover:shadow-2xl transition-shadow duration-300">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Recent Courses</h2>
          <Link className={buttonVariants({ variant: "outline" })} href="/admin/courses">
            View All Courses
          </Link>
        </div>

        <Suspense fallback={<RenderRecentCoursesSkeleton />}> 
          <RenderRecentCourses />
        </Suspense>
      </div>
    </div>
  );
}

async function RenderRecentCourses() {
  const data = await adminGetRecentCourses();

  if (data.length === 0) {
    return (
      <EmptyState
        buttonText="Create New Course"
        description="You don't have any courses. Create one to view here."
        title="You Don't Have Any Courses Yet."
        href="/admin/courses/create"
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {data.map((course) => (
        <AdminCourseCard key={course.id} data={course} />
      ))}
    </div>
  );
}

function RenderRecentCoursesSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {Array.from({ length: 2 }).map((_, index) => (
        <AdminCourseCardSkeleton key={index} />
      ))}
    </div>
  );
}