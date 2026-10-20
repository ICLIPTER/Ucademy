import "server-only";

import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/db";

/**
 * Public course catalogue.
 *
 * The published catalogue is read on every marketing page, so it is cached
 * at the data layer and invalidated with `revalidateTag("courses")` whenever
 * an instructor publishes, edits or archives a course.
 */

const courseSelect = {
  id: true,
  title: true,
  subtitle: true,
  smallDescription: true,
  slug: true,
  fileKey: true,
  price: true,
  duration: true,
  level: true,
  category: true,
  averageRating: true,
  totalReviews: true,
  totalStudents: true,
  createdAt: true,
} as const;

export const getAllCourses = unstable_cache(
  async () =>
    prisma.course.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { createdAt: "desc" },
      select: courseSelect,
    }),
  ["public-courses"],
  { revalidate: 300, tags: ["courses"] },
);

/** Highest rated published courses, used on the landing page. */
export const getFeaturedCourses = unstable_cache(
  async (limit = 6) =>
    prisma.course.findMany({
      where: { status: "PUBLISHED" },
      orderBy: [{ averageRating: "desc" }, { totalStudents: "desc" }],
      take: limit,
      select: courseSelect,
    }),
  ["featured-courses"],
  { revalidate: 300, tags: ["courses"] },
);

/** Newest published courses, used on the landing page. */
export const getLatestCourses = unstable_cache(
  async (limit = 6) =>
    prisma.course.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { createdAt: "desc" },
      take: limit,
      select: courseSelect,
    }),
  ["latest-courses"],
  { revalidate: 300, tags: ["courses"] },
);

/** Number of published courses — shown as a platform statistic. */
export const getPublishedCourseCount = unstable_cache(
  async () => prisma.course.count({ where: { status: "PUBLISHED" } }),
  ["published-course-count"],
  { revalidate: 300, tags: ["courses"] },
);

export type PublicCourseType = Awaited<ReturnType<typeof getAllCourses>>[number];
export type FeaturedCourseType = Awaited<
  ReturnType<typeof getFeaturedCourses>
>[number];
