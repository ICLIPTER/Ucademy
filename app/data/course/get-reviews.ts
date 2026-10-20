import "server-only";

import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { requireUser } from "@/app/data/user/require_user";

/**
 * Rating summary for a course, computed from the stored reviews.
 *
 * The denormalised `averageRating` / `totalReviews` columns on the course
 * are the fast path; this query is the source of truth used to recompute
 * them after a review is written.
 */
export async function getReviewSummary(courseId: string) {
  const [aggregate, distribution] = await Promise.all([
    prisma.review.aggregate({
      where: { courseId },
      _avg: { rating: true },
      _count: { rating: true },
    }),
    prisma.review.groupBy({
      by: ["rating"],
      where: { courseId },
      _count: { rating: true },
    }),
  ]);

  const total = aggregate._count.rating ?? 0;
  const average = aggregate._avg.rating ?? 0;

  const buckets = [5, 4, 3, 2, 1].map((rating) => {
    const count =
      distribution.find((row) => row.rating === rating)?._count.rating ?? 0;
    return {
      rating,
      count,
      percentage: total === 0 ? 0 : Math.round((count / total) * 100),
    };
  });

  return { average, total, buckets };
}

/**
 * Recomputes and persists the denormalised rating columns on a course.
 * Called after a review is created, updated or deleted.
 */
export async function syncCourseRating(courseId: string) {
  const aggregate = await prisma.review.aggregate({
    where: { courseId },
    _avg: { rating: true },
    _count: { rating: true },
  });

  const average = aggregate._avg.rating ?? 0;
  const total = aggregate._count.rating ?? 0;

  await prisma.course.update({
    where: { id: courseId },
    data: {
      averageRating: Math.round(average * 100) / 100,
      totalReviews: total,
    },
  });

  return { average, total };
}

/**
 * The caller's own review for a course, if any.
 */
export async function getUserReview(courseId: string) {
  const user = await requireUser();

  return prisma.review.findUnique({
    where: { userId_courseId: { userId: user.id, courseId } },
    select: { id: true, rating: true, title: true, comment: true, createdAt: true },
  });
}

/**
 * The caller's own review, without requiring a session.
 *
 * The public course page must render for anonymous visitors, so this variant
 * returns `null` instead of redirecting to the login screen.
 */
export async function getOptionalUserReview(courseId: string) {
  const session = await auth.api
    .getSession({ headers: await headers() })
    .catch(() => null);

  if (!session?.user) return null;

  return prisma.review.findUnique({
    where: { userId_courseId: { userId: session.user.id, courseId } },
    select: { id: true, rating: true, title: true, comment: true, createdAt: true },
  });
}

/**
 * The published reviews for a course, newest first.
 */
export async function getCourseReviews(
  courseId: string,
  limit = 20,
) {
  return prisma.review.findMany({
    where: { courseId },
    orderBy: { createdAt: "desc" },
    take: limit,
    select: {
      id: true,
      rating: true,
      title: true,
      comment: true,
      createdAt: true,
      user: { select: { id: true, name: true, image: true } },
    },
  });
}
