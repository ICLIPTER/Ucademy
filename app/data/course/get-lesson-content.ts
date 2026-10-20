import "server-only";

import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireUser } from "@/app/data/user/require_user";

/**
 * A single lesson plus the caller's progress.
 *
 * The `slug` is validated against the lesson's course so a lesson can never
 * be read under a different course' URL.
 */
export async function getLessonContent(lessonId: string, slug: string) {
  const user = await requireUser();

  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    select: {
      id: true,
      title: true,
      description: true,
      videoKey: true,
      thumbnailKey: true,
      position: true,
      durationMinutes: true,
      isPreview: true,
      chapter: {
        select: {
          id: true,
          title: true,
          position: true,
          course: {
            select: { id: true, slug: true, title: true, fileKey: true },
          },
        },
      },
      lessonProgress: {
        where: { userId: user.id },
        select: { id: true, completed: true, lessonId: true },
      },
    },
  });

  if (!lesson) notFound();

  // The lesson must belong to the course in the URL.
  if (lesson.chapter.course.slug !== slug) notFound();

  const enrollment = await prisma.enrollment.findUnique({
    where: {
      courseId_userId: { courseId: lesson.chapter.course.id, userId: user.id },
    },
    select: { id: true, status: true },
  });

  if (!enrollment || enrollment.status !== "Active") notFound();

  return lesson;
}

export type LessonContentType = Awaited<ReturnType<typeof getLessonContent>>;
