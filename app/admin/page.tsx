import { ChartAreaInteractive } from "@/components/sidebar/chart-area-interactive";
import { SectionCards } from "@/components/sidebar/section-cards";
import { AdminGetEnrollmentStats } from "../data/admin/admin-get-enrollment-stats";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { EmptyState } from "./courses/_components/general/EmptyState";
import { AdminCourseCard, AdminCourseCardSkeleton } from "./courses/_components/AdminCourseCard";
import { adminGetRecentCourses } from "../data/admin/admin-get-recent-courses";
import { Suspense } from "react";

export default async function AdminIndexPage () {
  const enrollmentData = await AdminGetEnrollmentStats();
  return (
    
        <>
        
        <SectionCards />
        
        <ChartAreaInteractive data={enrollmentData} />

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Recent Courses</h2>
            <Link className={buttonVariants({variant: 'outline'})} href="/admin/courses">
            View All Courses
            </Link>
          </div>

          <Suspense fallback={<RenderRecentCoursesSkeleton />}>
            <RenderRecentCourses />
          </Suspense>
        </div>

        </>
  );
}

async function RenderRecentCourses() {
  const data = await adminGetRecentCourses();
  
  if(
    data.length === 0
    ) {
      return (
        <EmptyState 
        buttonText="Create New Course" 
        description="You dont have any courses. create one to view here"
        title="You Don't Have Any Courses Yet." 
        href="/admin/courses/create"/>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {data.map((course) => (
          <AdminCourseCard key={course.id} data={course} />
        ))}
      </div>
    )
}

function RenderRecentCoursesSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {Array.from({ length: 2}).map((_, index) => (
        <AdminCourseCardSkeleton key={index} />
      ))}
    </div>
  )
}