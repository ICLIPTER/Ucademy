import { getCourseSidebarData } from "@/app/data/course/get-course-sidebar-data";
import { redirect } from "next/navigation";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { BookOpenIcon } from "lucide-react";

interface iAppProps {
  params: Promise<{ slug: string }>;
}

export default async function CourseSlugRoute({ params }: iAppProps) {
  const { slug } = await params;

  const { course } = await getCourseSidebarData(slug);

  // The first lesson of the first chapter is the entry point of the course.
  // A course may legitimately have no chapters yet, so every level of the
  // lookup is guarded.
  const firstLesson = course.chapter[0]?.lessons[0];

  if (firstLesson) {
    redirect(`/dashboard/${slug}/${firstLesson.id}`);
  }

  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
      <div className="flex size-14 items-center justify-center rounded-full bg-muted">
        <BookOpenIcon className="size-7 text-muted-foreground" />
      </div>
      <h2 className="text-2xl font-bold">No lessons available yet</h2>
      <p className="max-w-md text-muted-foreground">
        The instructor has not published any lessons for this course. Check back
        soon — new lessons are added regularly.
      </p>
      <Link href="/dashboard" className={buttonVariants({ variant: "outline" })}>
        Back to my courses
      </Link>
    </div>
  );
}
