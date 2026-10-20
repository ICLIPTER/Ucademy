"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/app/data/admin/require-admin";
import { allowAction } from "@/lib/action-guard";
import { prisma } from "@/lib/db";
import { ApiResponse } from "@/lib/types";
import { lessonSchema, LessonSchemaType } from "@/lib/zodSchemas";

/**
 * Updates a lesson.
 *
 * The lesson's chapter and course are validated against the ids that came
 * with the request, so a lesson can never be moved between courses by
 * editing a form.
 */
export async function updateLesson(
  values: LessonSchemaType,
  lessonId: string,
): Promise<ApiResponse> {
  const admin = await requireAdmin();

  const allowed = await allowAction({
    scope: "update-lesson",
    userId: admin.user.id,
    limit: 60,
    windowSeconds: 60,
  });

  if (!allowed) {
    return { status: "error", message: "Slow down a moment, please." };
  }

  const result = lessonSchema.safeParse(values);

  if (!result.success) {
    return { status: "error", message: "Invalid form data." };
  }

  try {
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      select: {
        id: true,
        chapterId: true,
        chapter: { select: { courseId: true } },
      },
    });

    if (!lesson) {
      return { status: "error", message: "Lesson not found." };
    }

    if (
      lesson.chapterId !== result.data.chapterId ||
      lesson.chapter.courseId !== result.data.courseId
    ) {
      return {
        status: "error",
        message: "This lesson does not belong to that course.",
      };
    }

    await prisma.lesson.update({
      where: { id: lessonId },
      data: {
        title: result.data.name,
        description: result.data.description,
        thumbnailKey: result.data.thumbnailkey,
        videoKey: result.data.videoKey,
      },
    });

    revalidatePath(`/admin/courses/${result.data.courseId}/edit`);

    return { status: "success", message: "Lesson updated successfully." };
  } catch (error) {
    console.error("[courses] Failed to update lesson:", error);
    return { status: "error", message: "Failed to update the lesson." };
  }
}
