import "server-only";

import { prisma } from "@/lib/db";
import { requireUser } from "@/app/data/user/require_user";

/**
 * Courses the caller has an active enrolment for, with their progress.
 *
 * The curriculum is ordered explicitly — without an `orderBy` Postgres
 * returns rows in an arbitrary order, which made the chapter/lesson sequence
 * differ between page loads.
 */
export async function getEnrolledCourses() {
  const user = await requireUser();

  const data = await prisma.enrollment.findMany({
    where: {
      userId: user.id,
      status: "Active",
    },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      amount: true,
      status: true,
      createdAt: true,
      course: {
        select: {
          id: true,
          smallDescription: true,
          subtitle: true,
          title: true,
          fileKey: true,
          level: true,
          category: true,
          slug: true,
          duration: true,
          chapter: {
            orderBy: { position: "asc" },
            select: {
              id: true,
              title: true,
              position: true,
              lessons: {
                orderBy: { position: "asc" },
                select: {
                  id: true,
                  title: true,
                  description: true,
                  position: true,
                  durationMinutes: true,
                  isPreview: true,
                  lessonProgress: {
                    where: { userId: user.id },
                    select: {
                      id: true,
                      completed: true,
                      lessonId: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  return data;
}

export type EnrolledCourseType = Awaited<
  ReturnType<typeof getEnrolledCourses>
>[number];
