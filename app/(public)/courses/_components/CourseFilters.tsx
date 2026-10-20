"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { CourseLevels } from "@/lib/zodSchemas";
import { categoryLabel, COURSE_CATEGORIES } from "@/lib/categories";

/**
 * Catalogue filters.
 *
 * All state lives in the URL, so a filtered catalogue is shareable,
 * bookmarkable and works with the browser's back button. The search input
 * is debounced so typing does not fire a request per keystroke.
 */
export function CourseFilters({
  total,
}: {
  total: number;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const queryParam = searchParams.get("q") ?? "";
  const categoryParam = searchParams.get("category") ?? "";
  const levelParam = searchParams.get("level") ?? "";
  const sortParam = searchParams.get("sort") ?? "newest";

  const [search, setSearch] = useState(queryParam);

  // Keep the input in sync when the URL changes (e.g. Back button).
  useEffect(() => {
    setSearch(queryParam);
  }, [queryParam]);

  const push = useCallback(
    (mutate: (params: URLSearchParams) => void) => {
      const params = new URLSearchParams(searchParams.toString());
      mutate(params);

      // Any filter change resets pagination.
      params.delete("page");

      const queryString = params.toString();
      startTransition(() => {
        router.replace(
          queryString ? `${pathname}?${queryString}` : pathname,
          { scroll: false },
        );
      });
    },
    [pathname, router, searchParams],
  );

  // Debounce the search term.
  useEffect(() => {
    if (search === queryParam) return;

    const timer = setTimeout(() => {
      push((params) => {
        if (search.trim()) {
          params.set("q", search.trim());
        } else {
          params.delete("q");
        }
      });
    }, 350);

    return () => clearTimeout(timer);
  }, [search, queryParam, push]);

  const hasFilters = Boolean(queryParam || categoryParam || levelParam);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search courses, topics and skills…"
            className="h-11 pl-9"
            aria-label="Search courses"
          />
        </div>

        <div className="flex gap-3">
          <Select
            value={categoryParam || "all"}
            onValueChange={(value) =>
              push((params) => {
                if (value === "all") {
                  params.delete("category");
                } else {
                  params.set("category", value);
                }
              })
            }
          >
            <SelectTrigger className="h-11 min-w-[11rem]" aria-label="Category">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {COURSE_CATEGORIES.map((category) => (
                <SelectItem key={category.slug} value={category.slug}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={levelParam || "all"}
            onValueChange={(value) =>
              push((params) => {
                if (value === "all") {
                  params.delete("level");
                } else {
                  params.set("level", value);
                }
              })
            }
          >
            <SelectTrigger className="h-11 min-w-[9rem]" aria-label="Level">
              <SelectValue placeholder="Level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All levels</SelectItem>
              {CourseLevels.map((level) => (
                <SelectItem key={level} value={level}>
                  {level.charAt(0) + level.slice(1).toLowerCase()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={sortParam}
            onValueChange={(value) =>
              push((params) => {
                if (value === "newest") {
                  params.delete("sort");
                } else {
                  params.set("sort", value);
                }
              })
            }
          >
            <SelectTrigger
              className="hidden h-11 min-w-[10rem] sm:flex"
              aria-label="Sort by"
            >
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest first</SelectItem>
              <SelectItem value="popular">Most popular</SelectItem>
              <SelectItem value="rating">Highest rated</SelectItem>
              <SelectItem value="price-asc">Price: low to high</SelectItem>
              <SelectItem value="price-desc">Price: high to low</SelectItem>
              <SelectItem value="oldest">Oldest first</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="secondary" className="gap-1.5">
          <SlidersHorizontal className="size-3" />
          {total} {total === 1 ? "course" : "courses"}
        </Badge>

        {queryParam && (
          <FilterChip
            label={`“${queryParam}”`}
            onClear={() =>
              push((params) => {
                params.delete("q");
                setSearch("");
              })
            }
          />
        )}

        {categoryParam && (
          <FilterChip
            label={categoryLabel(categoryParam)}
            onClear={() =>
              push((params) => {
                params.delete("category");
              })
            }
          />
        )}

        {levelParam && (
          <FilterChip
            label={levelParam.charAt(0) + levelParam.slice(1).toLowerCase()}
            onClear={() =>
              push((params) => {
                params.delete("level");
              })
            }
          />
        )}

        {hasFilters && (
          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-muted-foreground"
            onClick={() => {
              setSearch("");
              startTransition(() => {
                router.replace(pathname, { scroll: false });
              });
            }}
          >
            Clear all
          </Button>
        )}
      </div>
    </div>
  );
}

function FilterChip({
  label,
  onClear,
}: {
  label: string;
  onClear: () => void;
}) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border bg-muted/50 px-2.5 py-0.5 text-xs">
      {label}
      <button
        type="button"
        onClick={onClear}
        className="rounded-full p-0.5 text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
        aria-label={`Remove filter ${label}`}
      >
        <X className="size-3" />
      </button>
    </span>
  );
}
