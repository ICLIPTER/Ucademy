import "server-only";

import { prisma } from "@/lib/db";
import {
  ALL_CATEGORY_ALIASES,
  categoryLabel,
  normaliseCategory,
} from "@/lib/categories";

/**
 * Searchable, filterable course catalogue.
 *
 * The catalogue is read on every keystroke of the search box, so it is
 * executed as a single indexed query with a `where` clause instead of
 * filtering in JavaScript. The `count` query runs in parallel so the pager
 * knows the total without pulling every row.
 */

export type CatalogSort =
  | "newest"
  | "oldest"
  | "rating"
  | "popular"
  | "price-asc"
  | "price-desc";

export type CatalogFilters = {
  query?: string;
  category?: string;
  level?: string;
  sort?: CatalogSort;
  page?: number;
  pageSize?: number;
};

export const CATALOG_PAGE_SIZE = 9;

/**
 * Every stored spelling that belongs to a category slug.
 *
 * Courses created before the taxonomy was cleaned up still carry the
 * original misspelled values, so the filter has to match all of them.
 */
function categoryMatchers(slug: string): string[] {
  const canonical = categoryLabel(slug);
  const aliases = ALL_CATEGORY_ALIASES.filter(
    (alias) => normaliseCategory(alias) === slug,
  );

  return Array.from(new Set([canonical, ...aliases]));
}

export async function getCatalogCourses({
  query,
  category,
  level,
  sort = "newest",
  page = 1,
  pageSize = CATALOG_PAGE_SIZE,
}: CatalogFilters = {}) {
  const safePage = Math.max(1, Math.floor(page) || 1);
  const safeSize = Math.min(36, Math.max(1, Math.floor(pageSize) || CATALOG_PAGE_SIZE));

  const and: Record<string, unknown>[] = [];
  const or: Record<string, unknown>[] = [];

  if (query) {
    const term = query.trim();
    if (term) {
      or.push(
        { title: { contains: term, mode: "insensitive" } },
        { smallDescription: { contains: term, mode: "insensitive" } },
        { subtitle: { contains: term, mode: "insensitive" } },
        { category: { contains: term, mode: "insensitive" } },
      );
    }
  }

  if (category) {
    and.push({ category: { in: categoryMatchers(category) } });
  }

  if (level) {
    and.push({ level });
  }

  const where: Record<string, unknown> = { status: "PUBLISHED" };
  if (or.length) where.OR = or;
  if (and.length) where.AND = and;

  const orderBy =
    sort === "oldest"
      ? [{ createdAt: "asc" as const }]
      : sort === "rating"
        ? [
            { averageRating: "desc" as const },
            { totalReviews: "desc" as const },
          ]
        : sort === "popular"
          ? [
              { totalStudents: "desc" as const },
              { createdAt: "desc" as const },
            ]
          : sort === "price-asc"
            ? [{ price: "asc" as const }]
            : sort === "price-desc"
              ? [{ price: "desc" as const }]
              : [{ createdAt: "desc" as const }];

  const [courses, total] = await Promise.all([
    prisma.course.findMany({
      where,
      orderBy,
      skip: (safePage - 1) * safeSize,
      take: safeSize,
      select: {
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
      },
    }),
    prisma.course.count({ where }),
  ]);

  return {
    courses,
    total,
    page: safePage,
    pageSize: safeSize,
    totalPages: Math.max(1, Math.ceil(total / safeSize)),
  };
}

/** Distinct categories that currently have at least one published course. */
export async function getCatalogCategories(): Promise<string[]> {
  const rows = await prisma.course.findMany({
    where: { status: "PUBLISHED" },
    select: { category: true },
    distinct: ["category"],
  });

  return rows.map((row) => row.category);
}
