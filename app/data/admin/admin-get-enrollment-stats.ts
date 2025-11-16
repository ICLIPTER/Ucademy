import "server-only";

import { prisma } from "@/lib/db";
import { requireAdmin } from "./require-admin";

export async function AdminGetEnrollmentStats() {

  await requireAdmin();

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setUTCDate(thirtyDaysAgo.getUTCDate() - 30);

  const enrollments = await prisma.enrollment.findMany({
    where: {
      createdAt: {
        gte: thirtyDaysAgo,
      },
    },
    select: {
      createdAt: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  const last30Days: { date: string; enrollments: number }[] = [];

  for (let i = 29; i >= 0; i--) {
    const date = new Date();
    date.setUTCHours(0, 0, 0, 0);
    date.setUTCDate(date.getUTCDate() - i);

    last30Days.push({
      date: date.toISOString().split("T")[0],
      enrollments: 0,
    });
  }

  enrollments.forEach((enrollment) => {
    const createdAt = new Date(enrollment.createdAt);

    // Skip invalid DB dates
    if (isNaN(createdAt.getTime())) return;

    const enrollmentDate = createdAt.toISOString().split("T")[0];
    const index = last30Days.findIndex((d) => d.date === enrollmentDate);
    if (index !== -1) {
      last30Days[index].enrollments++;
    }
  });

  return last30Days;
}
