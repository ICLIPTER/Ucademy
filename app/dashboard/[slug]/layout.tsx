import { ReactNode } from "react";
import { CourseSidebar } from "../_components/CourseSidebar";
import { getCourseSidebarData } from "@/app/data/course/get-course-sidebar-data";

interface iAppProps {
  params: Promise<{ slug: string }>;
  children: ReactNode;
}

export default async function CourseLayout({ children, params }: iAppProps) {
  const { slug } = await params;

  /*
   * Server-side security check + lightweight data fetch.
   * `getCourseSidebarData` is memoised with React `cache()`, so this and
   * the page below share a single database round-trip.
   */
  const { course } = await getCourseSidebarData(slug);

  return (
    <div className="flex flex-1 flex-col lg:flex-row">
      {/* Curriculum — full width on mobile, fixed rail on desktop. */}
      <aside className="w-full shrink-0 border-b border-border lg:h-[calc(100vh-var(--header-height))] lg:w-80 lg:overflow-y-auto lg:border-b-0 lg:border-r">
        <CourseSidebar course={course} />
      </aside>

      {/* Lesson content */}
      <div className="min-w-0 flex-1 overflow-hidden">{children}</div>
    </div>
  );
}
