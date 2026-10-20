import "server-only";

import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/app/data/admin/require-admin";

/**
 * A single course with its full structure, for the editor.
 *
 * Chapters and lessons are ordered by `position` so the editor always
 * renders them in the intended sequence.
 */
export async function adminGetCourse(courseId: string) {
  await requireAdmin();

  const course = await prisma.course.findUnique({
    where: { id: courseId },
    select: {
      id: true,
      title: true,
      subtitle: true,
      smallDescription: true,
      description: true,
      slug: true,
      fileKey: true,
      price: true,
      duration: true,
      level: true,
      category: true,
      status: true,
      createdAt: true,
      updatedAt: true,
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
              thumbnailKey: true,
              videoKey: true,
              position: true,
              durationMinutes: true,
              isPreview: true,
            },
          },
        },
      },
    },
  });

  if (!course) notFound();

  return course;
}

export type AdminCourseDetailType = Awaited<
  ReturnType<typeof adminGetCourse>
>;

/** @deprecated Use `AdminCourseDetailType`. */
export type AdminCourseSingularType = AdminCourseDetailType;
