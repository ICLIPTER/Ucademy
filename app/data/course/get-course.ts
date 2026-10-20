import "server-only";

import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";

/**
 * Looks up a published course, including its curriculum and aggregate rating.
 *
 * Returns `null` instead of calling `notFound()`, so the caller can decide
 * *when* the 404 is raised. `generateMetadata` needs that control: a
 * `notFound()` thrown while the response is already streaming produces a
 * 404 page with a 200 status.
 *
 * Draft and archived courses are **never** returned to the public. The
 * previous implementation omitted the status filter, which exposed the full
 * curriculum of unpublished courses.
 */
export async function findCourseBySlug(slug: string) {
  return prisma.course.findFirst({
    where: { slug, status: "PUBLISHED" },
    select: {
      id: true,
      title: true,
      subtitle: true,
      description: true,
      smallDescription: true,
      slug: true,
      fileKey: true,
      trailerKey: true,
      price: true,
      duration: true,
      level: true,
      category: true,
      status: true,
      averageRating: true,
      totalReviews: true,
      totalStudents: true,
      createdAt: true,
      updatedAt: true,
      user: { select: { id: true, name: true, image: true } },
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
            },
          },
        },
      },
    },
  });
}

/**
 * A single published course. Raises a 404 when it does not exist.
 */
export async function getIndividualCourse(slug: string) {
  const course = await findCourseBySlug(slug);

  if (!course) notFound();

  return course;
}

export type IndividualCourseType = Awaited<
  ReturnType<typeof getIndividualCourse>
>;
