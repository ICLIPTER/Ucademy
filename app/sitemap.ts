import type { MetadataRoute } from "next";

import { appUrl } from "@/lib/env";
import { getAllCourses } from "@/app/data/course/get-all-courses";
import { COURSE_CATEGORIES } from "@/lib/categories";

/**
 * XML sitemap.
 *
 * Every published course is listed so search engines can index the
 * catalogue. The route is regenerated at most once an hour.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = appUrl.replace(/\/$/, "");

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, changeFrequency: "daily", priority: 1 },
    { url: `${base}/courses`, changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/categories`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${base}/pricing`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/about`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/instructors`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/help`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/terms`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/privacy`, changeFrequency: "yearly", priority: 0.3 },
  ];

  const categoryRoutes: MetadataRoute.Sitemap = COURSE_CATEGORIES.map(
    (category) => ({
      url: `${base}/courses?category=${category.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }),
  );

  let courseRoutes: MetadataRoute.Sitemap = [];

  try {
    const courses = await getAllCourses();

    courseRoutes = courses.map((course) => ({
      url: `${base}/courses/${course.slug}`,
      lastModified: course.createdAt,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));
  } catch {
    // A sitemap without course entries is still far better than a 500.
    courseRoutes = [];
  }

  return [...staticRoutes, ...categoryRoutes, ...courseRoutes];
}
