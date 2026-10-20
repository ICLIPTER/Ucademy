"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

/**
 * Hero search box.
 *
 * Submits to `/courses?q=…` so the search is server-rendered, shareable and
 * indexable — no client-side filtering of a preloaded list.
 */
export function CourseSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = query.trim();
    router.push(trimmed ? `/courses?q=${encodeURIComponent(trimmed)}` : "/courses");
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto w-full max-w-xl">
      <div className="flex flex-col gap-2 rounded-xl border bg-background p-2 shadow-lg sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="What do you want to learn?"
            className="h-11 border-0 pl-9 shadow-none focus-visible:ring-0"
            aria-label="Search courses"
          />
        </div>
        <Button type="submit" size="lg" className="sm:w-32">
          Search
        </Button>
      </div>
    </form>
  );
}
