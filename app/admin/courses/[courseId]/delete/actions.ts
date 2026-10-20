"use server";

import { revalidatePath, revalidateTag } from "next/cache";

import { requireAdmin } from "@/app/data/admin/require-admin";
import { allowAction } from "@/lib/action-guard";
import { prisma } from "@/lib/db";
import { ApiResponse } from "@/lib/types";

/**
 * Deletes a course.
 *
 * Ownership is enforced — the previous implementation deleted any course by
 * id, regardless of who created it.
 */
export async function deleteCourse(courseId: string): Promise<ApiResponse> {
  const session = await requireAdmin();

  const allowed = await allowAction({
    scope: "delete-course",
    userId: session.user.id,
    limit: 10,
    windowSeconds: 300,
  });

  if (!allowed) {
    return {
      status: "error",
      message: "You are performing too many deletions. Please slow down.",
    };
  }

  try {
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      select: { id: true, userId: true, slug: true },
    });

    if (!course) {
      return { status: "error", message: "Course not found." };
    }

    if (course.userId !== session.user.id) {
      return {
        status: "error",
        message: "You can only delete courses that you created.",
      };
    }

    await prisma.course.delete({ where: { id: courseId } });

    revalidateTag("courses");
    revalidatePath("/admin/courses");
    revalidatePath("/courses");
    revalidatePath(`/courses/${course.slug}`);

    return {
      status: "success",
      message: "Course deleted successfully.",
      redirectTo: "/admin/courses",
    };
  } catch (error) {
    console.error("[courses] Failed to delete course:", error);
    return { status: "error", message: "Failed to delete the course." };
  }
}
