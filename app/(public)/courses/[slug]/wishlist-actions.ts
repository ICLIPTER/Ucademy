"use server";

import { revalidatePath } from "next/cache";

import { requireUser } from "@/app/data/user/require_user";
import { allowAction } from "@/lib/action-guard";
import { prisma } from "@/lib/db";
import { ApiResponse } from "@/lib/types";

/**
 * Adds or removes a course from the caller's saved list.
 */
export async function toggleWishlistAction(courseId: string): Promise<ApiResponse> {
  const user = await requireUser();

  const allowed = await allowAction({
    scope: "wishlist",
    userId: user.id,
    limit: 60,
    windowSeconds: 60,
  });

  if (!allowed) {
    return { status: "error", message: "Slow down a moment, please." };
  }

  try {
    const course = await prisma.course.findFirst({
      where: { id: courseId, status: "PUBLISHED" },
      select: { id: true, slug: true },
    });

    if (!course) {
      return { status: "error", message: "This course is no longer available." };
    }

    const existing = await prisma.wishlist.findUnique({
      where: { userId_courseId: { userId: user.id, courseId } },
      select: { id: true },
    });

    if (existing) {
      await prisma.wishlist.delete({ where: { id: existing.id } });
      revalidatePath("/dashboard/wishlist");
      revalidatePath(`/courses/${course.slug}`);

      return { status: "success", message: "Removed from your saved list." };
    }

    await prisma.wishlist.create({
      data: { userId: user.id, courseId },
    });

    revalidatePath("/dashboard/wishlist");
    revalidatePath(`/courses/${course.slug}`);

    return { status: "success", message: "Saved to your list." };
  } catch (error) {
    console.error("[wishlist] Failed to toggle wishlist:", error);
    return { status: "error", message: "Could not update your saved list." };
  }
}
