import "server-only";

import { prisma } from "@/lib/db";
import { requireUser } from "@/app/data/user/require_user";

/**
 * Headline numbers for the learner dashboard.
 */
export async function getLearnerStats() {
  const user = await requireUser();

  const [enrollments, certificates, completedLessons, wishlist, reviews] =
    await Promise.all([
      prisma.enrollment.count({ where: { userId: user.id, status: "Active" } }),
      prisma.certificate.count({ where: { userId: user.id } }),
      prisma.lessonProgress.count({
        where: { userId: user.id, completed: true },
      }),
      prisma.wishlist.count({ where: { userId: user.id } }),
      prisma.review.count({ where: { userId: user.id } }),
    ]);

  const totalSpent = await prisma.enrollment.aggregate({
    where: { userId: user.id, status: "Active" },
    _sum: { amount: true },
  });

  return {
    enrolledCourses: enrollments,
    certificates,
    completedLessons,
    wishlist,
    reviews,
    totalSpent: totalSpent._sum.amount ?? 0,
  };
}

export type LearnerStats = Awaited<ReturnType<typeof getLearnerStats>>;
