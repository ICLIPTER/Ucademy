import "server-only";

import { unstable_cache } from "next/cache";

import { normaliseCategory } from "@/lib/categories";
import { prisma } from "@/lib/db";

/**
 * Live count of published courses per canonical category.
 *
 * The catalogue stores the category as free text, and a number of rows still
 * carry a legacy spelling ("Developemnt", "Office Producitivity", …). The
 * raw `groupBy` therefore returns more buckets than the taxonomy has, so
 * every bucket is normalised onto its canonical slug before it is counted.
 * Two spellings of the same track are merged into a single number.
 *
 * The result is a plain object (JSON serialisable) so it can be cached with
 * `unstable_cache` and shared with client components without conversion.
 */
export const getCategoryCounts = unstable_cache(
  async (): Promise<Record<string, number>> => {
    const rows = await prisma.course.groupBy({
      by: ["category"],
      where: { status: "PUBLISHED" },
      _count: { _all: true },
    });

    const counts: Record<string, number> = {};

    for (const row of rows) {
      const slug = normaliseCategory(row.category);
      counts[slug] = (counts[slug] ?? 0) + row._count._all;
    }

    return counts;
  },
  ["category-counts"],
  { revalidate: 300, tags: ["courses"] },
);
