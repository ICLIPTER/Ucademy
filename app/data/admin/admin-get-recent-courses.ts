import "server-only";

import { prisma } from "@/lib/db";
import { requireAdmin } from "@/app/data/admin/require-admin";

/**
 * The most recently created courses, for the admin overview.
 *
 * The previous implementation hard-coded `take: 2`, so the section could
 * never show more than two courses no matter how many existed.
 */
export async function adminGetRecentCourses(limit = 6) {
  await requireAdmin();

  return prisma.course.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
    select: {
      id: true,
      title: true,
      smallDescription: true,
      slug: true,
      fileKey: true,
      price: true,
      duration: true,
      level: true,
      category: true,
      status: true,
      createdAt: true,
    },
  });
}
