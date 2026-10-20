import "server-only";

import { prisma } from "@/lib/db";
import { requireUser } from "@/app/data/user/require_user";

/**
 * A learner's certificates.
 *
 * A certificate is issued when every lesson in a course has been marked
 * complete. Certificates are stored so they can be re-verified later by
 * their serial number.
 */
export async function getCertificates() {
  const user = await requireUser();

  const certificates = await prisma.certificate.findMany({
    where: { userId: user.id },
    orderBy: { issuedAt: "desc" },
    select: {
      id: true,
      serial: true,
      finalScore: true,
      issuedAt: true,
      course: {
        select: {
          id: true,
          title: true,
          subtitle: true,
          slug: true,
          fileKey: true,
          category: true,
          level: true,
          duration: true,
        },
      },
    },
  });

  return certificates;
}

export type CertificateType = Awaited<ReturnType<typeof getCertificates>>[number];

/**
 * Courses the learner has finished (100% of lessons completed) but has not
 * yet been issued a certificate for.
 */
export async function getCertifiableCourses() {
  const user = await requireUser();

  const enrollments = await prisma.enrollment.findMany({
    where: { userId: user.id, status: "Active" },
    select: {
      id: true,
      course: {
        select: {
          id: true,
          title: true,
          slug: true,
          fileKey: true,
          chapter: {
            select: {
              lessons: {
                select: {
                  id: true,
                  lessonProgress: {
                    where: { userId: user.id, completed: true },
                    select: { id: true },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  const issued = await prisma.certificate.findMany({
    where: { userId: user.id },
    select: { courseId: true },
  });

  const issuedIds = new Set(issued.map((c) => c.courseId));

  return enrollments
    .filter(({ course }) => {
      const lessons = course.chapter.flatMap((chapter) => chapter.lessons);
      if (lessons.length === 0) return false;
      return lessons.every((lesson) => lesson.lessonProgress.length > 0);
    })
    .filter(({ course }) => !issuedIds.has(course.id))
    .map(({ course }) => course);
}
