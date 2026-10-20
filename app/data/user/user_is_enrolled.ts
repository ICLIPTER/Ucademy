import "server-only";

import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

/**
 * Whether the current visitor owns an active enrolment for a course.
 *
 * Authentication is optional here: anonymous visitors simply do not own an
 * enrolment. The session lookup is intentionally separate from
 * `requireUser()` because the public course page must render for logged-out
 * visitors as well.
 */
export async function checkIfCourseBought(courseId: string): Promise<boolean> {
  const session = await auth.api
    .getSession({ headers: await headers() })
    .catch(() => null);

  if (!session?.user) return false;

  const enrollment = await prisma.enrollment.findUnique({
    where: {
      courseId_userId: {
        courseId,
        userId: session.user.id,
      },
    },
    select: { status: true },
  });

  return enrollment?.status === "Active";
}

/**
 * Batch variant — a single query for many courses.
 * Used by the catalogue so a signed-in learner does not trigger one query
 * per card.
 */
export async function getEnrolledCourseIds(
  courseIds: string[],
): Promise<Set<string>> {
  if (courseIds.length === 0) return new Set();

  const session = await auth.api
    .getSession({ headers: await headers() })
    .catch(() => null);

  if (!session?.user) return new Set();

  const enrollments = await prisma.enrollment.findMany({
    where: {
      userId: session.user.id,
      status: "Active",
      courseId: { in: courseIds },
    },
    select: { courseId: true },
  });

  return new Set(enrollments.map((e) => e.courseId));
}
