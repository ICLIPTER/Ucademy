import "server-only";

import { prisma } from "@/lib/db";
import { requireAdmin } from "@/app/data/admin/require-admin";

/**
 * Headline platform metrics.
 *
 * "Customers" counts learners with an **active** enrolment. The previous
 * implementation counted any enrolment row, which included abandoned
 * checkouts and cancelled orders.
 */
export async function AdminGetDashboardStats() {
  await requireAdmin();

  const [totalUsers, totalCustomers, totalCourses, totalLessons, publishedCourses] =
    await Promise.all([
      prisma.user.count(),
      prisma.user.count({
        where: { enrollment: { some: { status: "Active" } } },
      }),
      prisma.course.count(),
      prisma.lesson.count(),
      prisma.course.count({ where: { status: "PUBLISHED" } }),
    ]);

  return {
    totalUsers,
    totalCustomers,
    totalCourses,
    totalLessons,
    publishedCourses,
  };
}
