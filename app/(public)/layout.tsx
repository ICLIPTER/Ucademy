import { ReactNode } from "react";
import { Footer } from "./_components/Footer";
import { Navbar } from "./_components/Navbar";
import { getAllCourses } from "@/app/data/course/get-all-courses";

export default async function LayoutPublic({
  children,
}: {
  children: ReactNode;
}) {
  // The command palette searches the catalogue client-side, so the list is
  // fetched once here (cached for five minutes) instead of on every
  // keystroke.
  const courses = await getAllCourses();

  return (
    <div className="flex min-h-dvh flex-col">
      <Navbar
        courses={courses.map((course) => ({
          id: course.id,
          title: course.title,
          slug: course.slug,
          category: course.category,
          level: course.level,
        }))}
      />
      <main className="container mx-auto w-full flex-1 px-4 md:px-6 lg:px-8">
        {children}
      </main>
      <Footer />
    </div>
  );
}
