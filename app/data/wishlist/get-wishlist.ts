import "server-only";

import { prisma } from "@/lib/db";
import { requireUser } from "@/app/data/user/require_user";

/**
 * A learner's saved courses.
 */
export async function getWishlist() {
  const user = await requireUser();

  const items = await prisma.wishlist.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      createdAt: true,
      course: {
        select: {
          id: true,
          title: true,
          subtitle: true,
          smallDescription: true,
          slug: true,
          fileKey: true,
          price: true,
          duration: true,
          level: true,
          category: true,
          averageRating: true,
          totalReviews: true,
          totalStudents: true,
        },
      },
    },
  });

  return items;
}

export type WishlistItemType = Awaited<ReturnType<typeof getWishlist>>[number];

/** Course ids the learner has saved — used to badge the catalogue cards. */
export async function getWishlistIds(): Promise<Set<string>> {
  const user = await requireUser();

  const items = await prisma.wishlist.findMany({
    where: { userId: user.id },
    select: { courseId: true },
  });

  return new Set(items.map((item) => item.courseId));
}
