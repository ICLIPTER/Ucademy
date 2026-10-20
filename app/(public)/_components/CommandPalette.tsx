"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Award,
  BookOpen,
  Compass,
  LayoutDashboard,
  Search,
  Settings,
  Sparkles,
  Star,
} from "lucide-react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { categoryLabel } from "@/lib/categories";

export type PaletteCourse = {
  id: string;
  title: string;
  slug: string;
  category: string;
  level: string;
};

/**
 * Command palette (⌘K / Ctrl+K).
 *
 * Searches the catalogue and jumps straight to any area of the product. The
 * course list is passed in from the server so the palette opens instantly
 * and never needs a network round-trip.
 */
export function CommandPalette({ courses }: { courses: PaletteCourse[] }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setOpen((current) => !current);
      }
    }

    document.addEventListener("keydown", onKeyDown);

    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  function navigate(href: string) {
    setOpen(false);
    router.push(href);
  }

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="hidden gap-2 text-muted-foreground lg:inline-flex"
        onClick={() => setOpen(true)}
      >
        <Search className="size-4" />
        Search
        <kbd className="pointer-events-none ml-2 hidden rounded border bg-muted px-1.5 font-mono text-[10px] font-medium sm:inline-block">
          ⌘K
        </kbd>
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        onClick={() => setOpen(true)}
        aria-label="Search"
      >
        <Search className="size-4" />
      </Button>

      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        title="Command palette"
        description="Search courses, categories and pages."
        className="rounded-xl border shadow-2xl"
      >
        <CommandInput placeholder="Search courses, categories and pages…" />

        <CommandList className="max-h-[420px]">
          <CommandEmpty>
            <span className="text-muted-foreground">
              No results. Try a different search.
            </span>
          </CommandEmpty>

          <CommandGroup heading="Navigate">
            <CommandItem onSelect={() => navigate("/courses")}>
              <BookOpen className="size-4" />
              Browse all courses
              <CommandShortcut>↵</CommandShortcut>
            </CommandItem>
            <CommandItem onSelect={() => navigate("/categories")}>
              <Compass className="size-4" />
              Browse by category
            </CommandItem>
            <CommandItem onSelect={() => navigate("/dashboard")}>
              <LayoutDashboard className="size-4" />
              My learning
            </CommandItem>
            <CommandItem onSelect={() => navigate("/dashboard/certificates")}>
              <Award className="size-4" />
              My certificates
            </CommandItem>
            <CommandItem onSelect={() => navigate("/dashboard/wishlist")}>
              <Star className="size-4" />
              Saved courses
            </CommandItem>
            <CommandItem onSelect={() => navigate("/dashboard/settings")}>
              <Settings className="size-4" />
              Settings
            </CommandItem>
            <CommandItem onSelect={() => navigate("/instructors")}>
              <Sparkles className="size-4" />
              Teach on Ucademy
            </CommandItem>
          </CommandGroup>

          {courses.length > 0 && (
            <CommandGroup heading="Courses">
              {courses.map((course) => (
                <CommandItem
                  key={course.id}
                  value={`${course.title} ${course.category} ${course.level}`}
                  onSelect={() => navigate(`/courses/${course.slug}`)}
                >
                  <BookOpen className="size-4" />
                  <span className="truncate">{course.title}</span>
                  <span className="ml-auto shrink-0 text-xs text-muted-foreground">
                    {categoryLabel(course.category)}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
}
