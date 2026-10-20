
import { Suspense } from "react";

import { getCatalogCourses, type CatalogSort } from "@/app/data/course/get-catalog";
import {
  PRIORITY_CARD_COUNT,
  PublicCourseCard,
  PublicCourseCardSkeleton,
} from "../_components/PublicCourseCard";
import { CourseFilters } from "./_components/CourseFilters";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { EmptyState } from "@/app/admin/courses/_components/general/EmptyState";

import { SearchX } from "lucide-react";

export const metadata = {
  title: "Explore courses",
  description:
    "Browse hundreds of expert-led courses across development, design, business, data and more.",
};

type SearchParams = Promise<{
  q?: string;
  category?: string;
  level?: string;
  sort?: string;
  page?: string;
}>;

const VALID_SORTS: CatalogSort[] = [
  "newest",
  "oldest",
  "rating",
  "popular",
  "price-asc",
  "price-desc",
];

export default async function PublicCoursesRoute({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;

  const sort = VALID_SORTS.includes(params.sort as CatalogSort)
    ? (params.sort as CatalogSort)
    : "newest";

  const page = Number.parseInt(params.page ?? "1", 10) || 1;

  return (
    <div className="mt-5 pb-10">
      <div className="mb-8 space-y-2">
        <h1 className="text-3xl font-bold tracking-tighter md:text-4xl">
          Explore courses
        </h1>
        <p className="text-muted-foreground">
          Learn from industry practitioners with structured, hands-on courses
          that you can finish at your own pace.
        </p>
      </div>

      <Suspense fallback={<FiltersSkeleton />}>
        <FilterSection />
      </Suspense>

      <div className="mt-8">
        <Suspense fallback={<CourseGridSkeleton />}>
          <CourseGrid
            query={params.q}
            category={params.category}
            level={params.level}
            sort={sort}
            page={page}
          />
        </Suspense>
      </div>
    </div>
  );
}

async function FilterSection() {
  // A cheap count keeps the filter bar responsive without waiting for the
  // full catalogue query.
  const { total } = await getCatalogCourses({ pageSize: 1 });
  return <CourseFilters total={total} />;
}

async function CourseGrid({
  query,
  category,
  level,
  sort,
  page,
}: {
  query?: string;
  category?: string;
  level?: string;
  sort: CatalogSort;
  page: number;
}) {
  const { courses, total, totalPages } = await getCatalogCourses({
    query,
    category,
    level,
    sort,
    page,
  });

  if (courses.length === 0) {
    return (
      <EmptyState
        title="No courses match your filters"
        description="Try a different search term, or clear the filters to see the full catalogue."
        buttonText="Browse all courses"
        href="/courses"
        icon={<SearchX className="size-6" />}
      />
    );
  }

  return (
    <div className="space-y-10">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {courses.map((course, index) => (
          <PublicCourseCard key={course.id} data={course} priority={index < PRIORITY_CARD_COUNT} />
        ))}
      </div>

      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                aria-disabled={page <= 1}
                className={page <= 1 ? "pointer-events-none opacity-50" : undefined}
                href={buildHref({ page: page - 1, query, category, level, sort })}
              />
            </PaginationItem>

            {pageWindow(page, totalPages).map((entry, index) =>
              entry === "ellipsis" ? (
                <PaginationItem key={`ellipsis-${index}`}>
                  <PaginationEllipsis />
                </PaginationItem>
              ) : (
                <PaginationItem key={entry}>
                  <PaginationLink
                    isActive={entry === page}
                    href={buildHref({ page: entry, query, category, level, sort })}
                  >
                    {entry}
                  </PaginationLink>
                </PaginationItem>
              ),
            )}

            <PaginationItem>
              <PaginationNext
                aria-disabled={page >= totalPages}
                className={
                  page >= totalPages ? "pointer-events-none opacity-50" : undefined
                }
                href={buildHref({ page: page + 1, query, category, level, sort })}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      <p className="text-center text-sm text-muted-foreground">
        Showing {courses.length} of {total} courses
      </p>
    </div>
  );
}

function buildHref({
  page,
  query,
  category,
  level,
  sort,
}: {
  page: number;
  query?: string;
  category?: string;
  level?: string;
  sort: CatalogSort;
}) {
  const params = new URLSearchParams();

  if (query) params.set("q", query);
  if (category) params.set("category", category);
  if (level) params.set("level", level);
  if (sort && sort !== "newest") params.set("sort", sort);
  if (page > 1) params.set("page", String(page));

  const search = params.toString();
  return search ? `/courses?${search}` : "/courses";
}

/** Page numbers to render, with ellipses for large ranges. */
function pageWindow(current: number, total: number): (number | "ellipsis")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, index) => index + 1);
  }

  if (current <= 3) {
    return [1, 2, 3, 4, "ellipsis", total];
  }

  if (current >= total - 2) {
    return [1, "ellipsis", total - 3, total - 2, total - 1, total];
  }

  return [1, "ellipsis", current - 1, current, current + 1, "ellipsis", total];
}

function CourseGridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 9 }).map((_, index) => (
        <PublicCourseCardSkeleton key={index} />
      ))}
    </div>
  );
}

function FiltersSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row">
        <div className="h-11 flex-1 animate-pulse rounded-md bg-muted" />
        <div className="h-11 w-44 animate-pulse rounded-md bg-muted" />
        <div className="h-11 w-36 animate-pulse rounded-md bg-muted" />
      </div>
    </div>
  );
}
