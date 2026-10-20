import Link from "next/link";
import { Suspense } from "react";
import { BookOpen, Filter, LayoutGrid, List, Plus } from "lucide-react";

import { adminGetCourses } from "@/app/data/admin/admin-get-courses";
import { AdminCourseCard, AdminCourseCardSkeleton } from "./_components/AdminCourseCard";
import { PRIORITY_CARD_COUNT } from "../../(public)/_components/PublicCourseCard";
import { EmptyState } from "./_components/general/EmptyState";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCompactNumber } from "@/lib/format";

export const metadata = {
  title: "Courses",
  description: "Create, publish and manage your courses.",
};

export default async function CoursesPage() {
  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold">Your courses</h1>
          <p className="text-sm text-muted-foreground">
            Everything you have published, plus your drafts.
          </p>
        </div>

        <Button asChild>
          <Link href="/admin/courses/create">
            <Plus className="size-4" />
            New course
          </Link>
        </Button>
      </div>

      <Suspense fallback={<CourseGridSkeleton />}>
        <RenderCourses />
      </Suspense>
    </>
  );
}

async function RenderCourses() {
  const courses = await adminGetCourses();

  if (courses.length === 0) {
    return (
      <EmptyState
        title="You haven't created a course yet"
        description="Create your first course, add chapters and lessons, and publish it when you are ready."
        buttonText="Create a course"
        href="/admin/courses/create"
        icon={<BookOpen className="size-10 text-primary" />}
      />
    );
  }

  const published = courses.filter((course) => course.status === "PUBLISHED");
  const drafts = courses.filter((course) => course.status === "DRAFT");
  const archived = courses.filter((course) => course.status === "ARCHIVED");

  const totalStudents = courses.reduce(
    (sum, course) => sum + course.totalStudents,
    0,
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center gap-3">
        <Badge variant="secondary" className="gap-1.5">
          <LayoutGrid className="size-3" />
          {courses.length} course{courses.length === 1 ? "" : "s"}
        </Badge>
        <Badge variant="secondary" className="gap-1.5">
          <List className="size-3" />
          {published.length} published
        </Badge>
        <Badge variant="secondary" className="gap-1.5">
          <Filter className="size-3" />
          {drafts.length} draft{drafts.length === 1 ? "" : "s"}
        </Badge>
        <Badge variant="secondary" className="gap-1.5">
          {formatCompactNumber(totalStudents)} learners
        </Badge>
      </div>

      {courses.length > 0 && (
        <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 xl:grid-cols-3">
          {courses.map((course, index) => (
            <AdminCourseCard
              key={course.id}
              data={course}
              priority={index < PRIORITY_CARD_COUNT}
            />
          ))}
        </div>
      )}

      {archived.length > 0 && (
        <p className="text-sm text-muted-foreground">
          {archived.length} archived course
          {archived.length === 1 ? "" : "s"} hidden from the catalogue.
        </p>
      )}
    </div>
  );
}

function CourseGridSkeleton() {
  return (
    <div className="mt-6 grid grid-cols-1 gap-7 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <AdminCourseCardSkeleton key={index} />
      ))}
    </div>
  );
}
