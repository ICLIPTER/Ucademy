import "server-only";

import { prisma } from "@/lib/db";
import { requireAdmin } from "@/app/data/admin/require-admin";

/**
 * Every course on the platform, for the instructor dashboard.
 *
 * Chapters and lessons are ordered explicitly so the drag-and-drop course
 * structure editor always sees a stable sequence — the reorder action
 * writes the positions it sees straight back to the database.
 */
export async function adminGetCourses() {
  await requireAdmin();

  const data = await prisma.course.findMany({
    orderBy: { createdAt: "desc" },
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
      updatedAt: true,
      totalStudents: true,
      averageRating: true,
      totalReviews: true,
      _count: {
        select: {
          chapter: true,
          enrollment: true,
          reviews: true,
        },
      },
    },
  });

  return data;
}

export type AdminCourseType = Awaited<ReturnType<typeof adminGetCourses>>[number];
