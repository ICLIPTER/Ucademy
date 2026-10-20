import "server-only";

import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/db";

/**
 * Public platform statistics shown on the marketing site.
 *
 * Cached for five minutes and invalidated with the `courses` tag whenever an
 * instructor publishes or edits a course.
 */
export const getPlatformStats = unstable_cache(
  async () => {
    const [publishedCourses, learners, lessons] = await Promise.all([
      prisma.course.count({ where: { status: "PUBLISHED" } }),
      prisma.user.count(),
      prisma.lesson.count(),
    ]);

    return { publishedCourses, learners, lessons };
  },
  ["platform-stats"],
  { revalidate: 300, tags: ["courses"] },
);

export type PlatformStats = Awaited<ReturnType<typeof getPlatformStats>>;
