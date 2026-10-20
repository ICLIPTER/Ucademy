import Link from "next/link";

import { COURSE_CATEGORIES } from "@/lib/categories";
import { CategoryIcon } from "./CategoryIcon";

/**
 * Category grid.
 *
 * The whole tile is one link (no nested interactive elements) and the icon
 * is chosen from a static map, so the section ships no client JavaScript.
 */
export function CategoryGrid() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {COURSE_CATEGORIES.map((category) => {
        return (
          <Link
            key={category.slug}
            href={`/courses?category=${category.slug}`}
            className="group flex items-start gap-3 rounded-xl border bg-card p-4 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
          >
            <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
              <CategoryIcon name={category.icon} className="size-5" />
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-medium">{category.label}</span>
              <span className="mt-0.5 block line-clamp-2 text-xs text-muted-foreground">
                {category.description}
              </span>
            </span>
          </Link>
        );
      })}
    </div>
  );
}
