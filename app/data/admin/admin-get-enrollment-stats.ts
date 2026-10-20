import "server-only";

import { prisma } from "@/lib/db";
import { requireAdmin } from "@/app/data/admin/require-admin";

export type EnrollmentPoint = {
  /** ISO date (UTC) of the day. */
  date: string;
  /** Human readable label, e.g. "12 Mar". */
  label: string;
  count: number;
};

/**
 * Daily enrolment counts for the last `days` days.
 *
 * The window and the bucket boundaries are both anchored to UTC midnight,
 * so the oldest bucket is never silently under-counted. (The previous
 * implementation filtered from `now - 30 days` while bucketing on midnight
 * boundaries, which systematically dropped the oldest day.)
 */
export async function AdminGetEnrollmentStats(days = 30) {
  await requireAdmin();

  const today = new Date();
  const startOfToday = Date.UTC(
    today.getUTCFullYear(),
    today.getUTCMonth(),
    today.getUTCDate(),
  );
  const windowStart = startOfToday - (days - 1) * 24 * 60 * 60 * 1000;

  const enrollments = await prisma.enrollment.findMany({
    where: {
      createdAt: { gte: new Date(windowStart) },
    },
    select: { createdAt: true },
  });

  const counts = new Map<string, number>();

  for (const enrollment of enrollments) {
    const key = new Date(enrollment.createdAt)
      .toISOString()
      .slice(0, 10);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }

  const points: EnrollmentPoint[] = [];

  for (let index = 0; index < days; index += 1) {
    const timestamp = windowStart + index * 24 * 60 * 60 * 1000;
    const date = new Date(timestamp);
    const iso = date.toISOString().slice(0, 10);

    points.push({
      date: iso,
      label: date.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        timeZone: "UTC",
      }),
      count: counts.get(iso) ?? 0,
    });
  }

  return points;
}

/**
 * Revenue and enrolment breakdown for the analytics page.
 */
export async function AdminGetRevenueStats() {
  await requireAdmin();

  const [active, pending, cancelled, refunded, revenue] = await Promise.all([
    prisma.enrollment.count({ where: { status: "Active" } }),
    prisma.enrollment.count({ where: { status: "Pending" } }),
    prisma.enrollment.count({ where: { status: "Cancelled" } }),
    prisma.enrollment.count({ where: { status: "Refunded" } }),
    prisma.enrollment.aggregate({
      where: { status: "Active" },
      _sum: { amount: true },
    }),
  ]);

  return {
    active,
    pending,
    cancelled,
    refunded,
    // Amounts are stored in the smallest currency unit.
    revenue: revenue._sum.amount ?? 0,
  };
}

/**
 * The five best performing courses by enrolment.
 */
export async function AdminGetTopCourses(limit = 5) {
  await requireAdmin();

  return prisma.course.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { totalStudents: "desc" },
    take: limit,
    select: {
      id: true,
      title: true,
      slug: true,
      fileKey: true,
      price: true,
      totalStudents: true,
      averageRating: true,
      totalReviews: true,
    },
  });
}
