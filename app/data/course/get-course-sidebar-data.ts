import "server-only";

import { cache } from "react";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireUser } from "@/app/data/user/require_user";

/**
 * Course curriculum + the caller's personal progress.
 *
 * Wrapped in React's `cache()` because the dashboard layout *and* the page
 * both need it — without the memo the identical (heavy) nested query ran
 * twice for every single lesson page view.
 */
export const getCourseSidebarData = cache(async (slug: string) => {
  const user = await requireUser();

  const course = await prisma.course.findUnique({
    where: { slug },
    select: {
      id: true,
      title: true,
      slug: true,
      category: true,
      fileKey: true,
      level: true,
      status: true,
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
  });

  if (!course) notFound();

  const enrollment = await prisma.enrollment.findUnique({
    where: { courseId_userId: { courseId: course.id, userId: user.id } },
    select: { id: true, status: true },
  });

  // Access requires an active enrolment.
  if (!enrollment || enrollment.status !== "Active") notFound();

  return { course };
});

export type CourseSidebarDataType = Awaited<
  ReturnType<typeof getCourseSidebarData>
>["course"];
