"use server";

import { revalidatePath, revalidateTag } from "next/cache";

import { syncCourseRating } from "@/app/data/course/get-reviews";
import { requireUser } from "@/app/data/user/require_user";
import { allowAction } from "@/lib/action-guard";
import { prisma } from "@/lib/db";
import { ApiResponse } from "@/lib/types";
import { reviewSchema, ReviewSchemaType } from "@/lib/zodSchemas";

/**
 * Creates or updates the caller's review for a course.
 *
 * Only learners with an active enrolment can review, which keeps the rating
 * signal meaningful (and stops review spam from throwaway accounts).
 */
export async function submitReviewAction(
  values: ReviewSchemaType,
): Promise<ApiResponse> {
  const user = await requireUser();

  const allowed = await allowAction({
    scope: "review",
    userId: user.id,
    limit: 10,
    windowSeconds: 3600,
  });

  if (!allowed) {
    return {
      status: "error",
      message: "You are submitting reviews too quickly. Please try again later.",
    };
  }

  const result = reviewSchema.safeParse(values);

  if (!result.success) {
    const first = result.error.issues[0];
    return {
      status: "error",
      message: first?.message ?? "Invalid review.",
      fields: first?.path.length
        ? { [String(first.path[0])]: first.message }
        : undefined,
    };
  }

  const { courseId, rating, title, comment } = result.data;

  const course = await prisma.course.findFirst({
    where: { id: courseId, status: "PUBLISHED" },
    select: { id: true, slug: true },
  });

  if (!course) {
    return { status: "error", message: "This course is no longer available." };
  }

  const enrollment = await prisma.enrollment.findUnique({
    where: { courseId_userId: { courseId, userId: user.id } },
    select: { status: true },
  });

  if (enrollment?.status !== "Active") {
    return {
      status: "error",
      message: "Only enrolled learners can review this course.",
    };
  }

  try {
    await prisma.review.upsert({
      where: { userId_courseId: { userId: user.id, courseId } },
      create: {
        userId: user.id,
        courseId,
        rating,
        title: title || null,
        comment: comment || null,
      },
      update: {
        rating,
        title: title || null,
        comment: comment || null,
      },
    });

    await syncCourseRating(courseId);

    revalidateTag("courses");
    revalidatePath(`/courses/${course.slug}`);

    return { status: "success", message: "Thanks for your review!" };
  } catch (error) {
    console.error("[review] Failed to submit review:", error);
    return { status: "error", message: "Could not save your review." };
  }
}

/**
 * Removes the caller's review.
 */
export async function deleteReviewAction(courseId: string): Promise<ApiResponse> {
  const user = await requireUser();

  try {
    await prisma.review.deleteMany({
      where: { courseId, userId: user.id },
    });

    await syncCourseRating(courseId);

    revalidateTag("courses");

    return { status: "success", message: "Your review was removed." };
  } catch (error) {
    console.error("[review] Failed to delete review:", error);
    return { status: "error", message: "Could not remove your review." };
  }
}
