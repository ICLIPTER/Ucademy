"use server";

import { revalidatePath } from "next/cache";

import { requireUser } from "@/app/data/user/require_user";
import { allowAction } from "@/lib/action-guard";
import { prisma } from "@/lib/db";
import { ApiResponse } from "@/lib/types";

/**
 * Marks a lesson as complete.
 *
 * The enrolment is verified first — previously any signed-in user could
 * write progress rows for lessons in courses they had not bought.
 */
export async function MarkLessonComplete(
  lessonId: string,
  slug: string,
): Promise<ApiResponse> {
  const user = await requireUser();

  const allowed = await allowAction({
    scope: "complete-lesson",
    userId: user.id,
    limit: 120,
    windowSeconds: 60,
  });

  if (!allowed) {
    return { status: "error", message: "Slow down a moment, please." };
  }

  try {
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      select: {
        id: true,
        chapter: { select: { course: { select: { id: true, slug: true } } } },
      },
    });

    if (!lesson || lesson.chapter.course.slug !== slug) {
      return { status: "error", message: "Lesson not found." };
    }

    const enrollment = await prisma.enrollment.findUnique({
      where: {
        courseId_userId: {
          courseId: lesson.chapter.course.id,
          userId: user.id,
        },
      },
      select: { status: true },
    });

    if (enrollment?.status !== "Active") {
      return {
        status: "error",
        message: "You need an active enrolment to track progress.",
      };
    }

    await prisma.lessonProgress.upsert({
      where: {
        userId_lessonId: {
          userId: user.id,
          lessonId,
        },
      },
      update: { completed: true },
      create: {
        lessonId,
        userId: user.id,
        completed: true,
      },
    });

    revalidatePath(`/dashboard/${slug}`);
    revalidatePath(`/dashboard/${slug}/${lessonId}`);
    revalidatePath("/dashboard");

    return {
      status: "success",
      message: "Lesson marked as complete.",
    };
  } catch (error) {
    console.error("[lesson] Failed to mark lesson complete:", error);
    return { status: "error", message: "Something went wrong." };
  }
}
