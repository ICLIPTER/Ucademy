"use server";

import { revalidatePath, revalidateTag } from "next/cache";

import { requireAdmin } from "@/app/data/admin/require-admin";
import { allowAction } from "@/lib/action-guard";
import { prisma } from "@/lib/db";
import { ApiResponse } from "@/lib/types";
import {
  chapterSchema,
  ChapterSchemaType,
  CourseSchema,
  CourseSchemaType,
  lessonSchema,
  LessonSchemaType,
} from "@/lib/zodSchemas";

/**
 * Updates the editable fields of a course.
 *
 * Ownership is enforced consistently: the previous implementation filtered
 * on `userId` in the `where` clause only, so an instructor could open another
 * instructor's course and silently fail to save it.
 */
export async function editCourse(
  data: CourseSchemaType,
  courseId: string,
): Promise<ApiResponse> {
  const user = await requireAdmin();

  const allowed = await allowAction({
    scope: "edit-course",
    userId: user.user.id,
    limit: 40,
    windowSeconds: 60,
  });

  if (!allowed) {
    return {
      status: "error",
      message: "You are saving too quickly. Please slow down.",
    };
  }

  const result = CourseSchema.safeParse(data);

  if (!result.success) {
    const first = result.error.issues[0];
    return {
      status: "error",
      message: first?.message ?? "Invalid data.",
      fields: first?.path.length
        ? { [String(first.path[0])]: first.message }
        : undefined,
    };
  }

  const existing = await prisma.course.findUnique({
    where: { id: courseId },
    select: { id: true, userId: true, slug: true },
  });

  if (!existing) {
    return { status: "error", message: "Course not found." };
  }

  if (existing.userId !== user.user.id) {
    return {
      status: "error",
      message: "You can only edit courses that you created.",
    };
  }

  if (existing.slug !== result.data.slug) {
    const taken = await prisma.course.findUnique({
      where: { slug: result.data.slug },
      select: { id: true },
    });

    if (taken) {
      return {
        status: "error",
        message: "That URL slug is already taken.",
        fields: { slug: "This slug is already in use." },
      };
    }
  }

  try {
    await prisma.course.update({
      where: { id: courseId },
      data: { ...result.data },
    });
  } catch (error) {
    console.error("[courses] Failed to update course:", error);
    return { status: "error", message: "Failed to update the course." };
  }

  revalidateTag("courses");
  revalidatePath(`/admin/courses/${courseId}/edit`);
  revalidatePath(`/courses/${result.data.slug}`);
  revalidatePath("/courses");

  return { status: "success", message: "Course updated successfully." };
}

/**
 * Persists the order of the lessons inside a chapter.
 */
export async function reorderLessons(
  chapterId: string,
  lessons: { id: string; position: number }[],
  courseId: string,
): Promise<ApiResponse> {
  await requireAdmin();

  try {
    if (!lessons?.length) {
      return { status: "error", message: "No lessons provided for reordering." };
    }

    await prisma.$transaction(
      lessons.map((lesson) =>
        prisma.lesson.update({
          where: { id: lesson.id, chapterId },
          data: { position: lesson.position },
        }),
      ),
    );

    revalidatePath(`/admin/courses/${courseId}/edit`);

    return { status: "success", message: "Lessons reordered successfully." };
  } catch (error) {
    console.error("[courses] Failed to reorder lessons:", error);
    return { status: "error", message: "Failed to reorder lessons." };
  }
}

/**
 * Persists the order of the chapters inside a course.
 */
export async function reorderChapters(
  courseId: string,
  chapters: { id: string; position: number }[],
): Promise<ApiResponse> {
  await requireAdmin();

  try {
    if (!chapters?.length) {
      return { status: "error", message: "No chapters provided for reordering." };
    }

    await prisma.$transaction(
      chapters.map((chapter) =>
        prisma.chapter.update({
          where: { id: chapter.id, courseId },
          data: { position: chapter.position },
        }),
      ),
    );

    revalidatePath(`/admin/courses/${courseId}/edit`);

    return { status: "success", message: "Chapters reordered successfully." };
  } catch (error) {
    console.error("[courses] Failed to reorder chapters:", error);
    return { status: "error", message: "Failed to reorder chapters." };
  }
}

/**
 * Appends a chapter to a course.
 */
export async function createChapter(
  values: ChapterSchemaType,
): Promise<ApiResponse> {
  await requireAdmin();

  const result = chapterSchema.safeParse(values);

  if (!result.success) {
    return { status: "error", message: "Invalid data." };
  }

  try {
    await prisma.$transaction(async (tx) => {
      const maxPosition = await tx.chapter.findFirst({
        where: { courseId: result.data.courseId },
        select: { position: true },
        orderBy: { position: "desc" },
      });

      await tx.chapter.create({
        data: {
          title: result.data.name,
          courseId: result.data.courseId,
          position: (maxPosition?.position ?? 0) + 1,
        },
      });
    });

    revalidatePath(`/admin/courses/${result.data.courseId}/edit`);

    return { status: "success", message: "Chapter created successfully." };
  } catch (error) {
    console.error("[courses] Failed to create chapter:", error);
    return { status: "error", message: "Failed to create the chapter." };
  }
}

/**
 * Appends a lesson to a chapter.
 *
 * The new position is derived from the **chapter**, not the course — the
 * previous implementation filtered on `courseId`, which numbered lessons
 * across the whole course and mixed up the ordering between chapters.
 */
export async function createLesson(values: LessonSchemaType): Promise<ApiResponse> {
  await requireAdmin();

  const result = lessonSchema.safeParse(values);

  if (!result.success) {
    return { status: "error", message: "Invalid data." };
  }

  try {
    await prisma.$transaction(async (tx) => {
      const maxPosition = await tx.lesson.findFirst({
        where: { chapterId: result.data.chapterId },
        select: { position: true },
        orderBy: { position: "desc" },
      });

      await tx.lesson.create({
        data: {
          title: result.data.name,
          description: result.data.description,
          videoKey: result.data.videoKey,
          thumbnailKey: result.data.thumbnailkey,
          chapterId: result.data.chapterId,
          position: (maxPosition?.position ?? 0) + 1,
        },
      });
    });

    revalidatePath(`/admin/courses/${result.data.courseId}/edit`);

    return { status: "success", message: "Lesson created successfully." };
  } catch (error) {
    console.error("[courses] Failed to create lesson:", error);
    return { status: "error", message: "Failed to create the lesson." };
  }
}

/**
 * Deletes a lesson and closes the gap in the remaining positions.
 */
export async function deleteLesson({
  courseId,
  chapterId,
  lessonId,
}: {
  courseId: string;
  chapterId: string;
  lessonId: string;
}): Promise<ApiResponse> {
  await requireAdmin();

  try {
    const chapterWithLessons = await prisma.chapter.findUnique({
      where: { id: chapterId },
      select: {
        lessons: {
          orderBy: { position: "asc" },
          select: { id: true, position: true },
        },
      },
    });

    if (!chapterWithLessons) {
      return { status: "error", message: "Chapter not found." };
    }

    const lessons = chapterWithLessons.lessons;

    if (!lessons.some((lesson) => lesson.id === lessonId)) {
      return { status: "error", message: "Lesson not found." };
    }

    const remaining = lessons.filter((lesson) => lesson.id !== lessonId);

    await prisma.$transaction([
      ...remaining.map((lesson, index) =>
        prisma.lesson.update({
          where: { id: lesson.id },
          data: { position: index + 1 },
        }),
      ),
      prisma.lesson.delete({
        where: { id: lessonId, chapterId },
      }),
    ]);

    revalidatePath(`/admin/courses/${courseId}/edit`);

    return { status: "success", message: "Lesson deleted successfully." };
  } catch (error) {
    console.error("[courses] Failed to delete lesson:", error);
    return { status: "error", message: "Failed to delete the lesson." };
  }
}

/**
 * Deletes a chapter (and its lessons) and closes the gap in the positions.
 */
export async function deleteChapter({
  courseId,
  chapterId,
}: {
  courseId: string;
  chapterId: string;
}): Promise<ApiResponse> {
  await requireAdmin();

  try {
    const courseWithChapters = await prisma.course.findUnique({
      where: { id: courseId },
      select: {
        chapter: {
          orderBy: { position: "asc" },
          select: { id: true, position: true },
        },
      },
    });

    if (!courseWithChapters) {
      return { status: "error", message: "Course not found." };
    }

    const chapters = courseWithChapters.chapter;

    if (!chapters.some((chapter) => chapter.id === chapterId)) {
      return { status: "error", message: "Chapter not found." };
    }

    const remaining = chapters.filter((chapter) => chapter.id !== chapterId);

    await prisma.$transaction([
      ...remaining.map((chapter, index) =>
        prisma.chapter.update({
          where: { id: chapter.id },
          data: { position: index + 1 },
        }),
      ),
      prisma.chapter.delete({
        where: { id: chapterId },
      }),
    ]);

    revalidatePath(`/admin/courses/${courseId}/edit`);

    return { status: "success", message: "Chapter deleted successfully." };
  } catch (error) {
    console.error("[courses] Failed to delete chapter:", error);
    return { status: "error", message: "Failed to delete the chapter." };
  }
}
