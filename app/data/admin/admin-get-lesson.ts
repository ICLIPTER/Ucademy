import "server-only";

import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/app/data/admin/require-admin";

/**
 * A single lesson for the lesson editor.
 *
 * The `courseId` and `chapterId` from the URL are validated against the
 * lesson so a lesson can never be edited through a mismatched path.
 */
export async function adminGetLesson(
  lessonId: string,
  courseId?: string,
  chapterId?: string,
) {
  await requireAdmin();

  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    select: {
      id: true,
      title: true,
      description: true,
      thumbnailKey: true,
      videoKey: true,
      position: true,
      durationMinutes: true,
      isPreview: true,
      chapter: {
        select: {
          id: true,
          title: true,
          position: true,
          course: {
            select: { id: true, title: true, slug: true },
          },
        },
      },
    },
  });

  if (!lesson) notFound();

  if (courseId && lesson.chapter.course.id !== courseId) notFound();
  if (chapterId && lesson.chapter.id !== chapterId) notFound();

  return lesson;
}

export type AdminLessonType = Awaited<ReturnType<typeof adminGetLesson>>;
