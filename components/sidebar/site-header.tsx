"use client";

import { Fragment } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, ExternalLink } from "lucide-react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeToggle } from "../ui/themeToggle";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/** Human readable label for each known route segment. */
const LABELS: Record<string, string> = {
  admin: "Studio",
  dashboard: "My learning",
  courses: "Courses",
  certificates: "Certificates",
  wishlist: "Saved",
  settings: "Settings",
  users: "Learners",
  analytics: "Analytics",
  adminDashboard: "Overview",
  new: "New",
  edit: "Edit",
  create: "Create",
};

function labelFor(segment: string): string {
  if (LABELS[segment]) return LABELS[segment];
  // Dynamic segments (ids, slugs) are shown as-is in title case.
  return segment
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

export function SiteHeader() {
  const pathname = usePathname();

  const segments = pathname.split("/").filter(Boolean);
  const isAdmin = segments[0] === "admin";

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />

        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href={isAdmin ? "/admin" : "/dashboard"}>Ucademy</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>

            {segments.map((segment, index) => {
              const isLast = index === segments.length - 1;
              const href = `/${segments.slice(0, index + 1).join("/")}`;

              return (
                /*
                 * `BreadcrumbSeparator` renders an `<li>`, so it has to be a
                 * sibling of `BreadcrumbItem` (which is also an `<li>`) —
                 * nesting one inside the other is invalid HTML and breaks
                 * hydration.
                 */
                <Fragment key={href}>
                  <BreadcrumbSeparator>
                    <ChevronRight className="size-3.5" />
                  </BreadcrumbSeparator>

                  <BreadcrumbItem>
                    {isLast ? (
                      <BreadcrumbPage>{labelFor(segment)}</BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink asChild>
                        <Link href={href}>{labelFor(segment)}</Link>
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                </Fragment>
              );
            })}
          </BreadcrumbList>
        </Breadcrumb>

        <div className="ml-auto flex items-center gap-2">
          <Link
            href="/"
            target="_blank"
            className={cn(
              buttonVariants({ variant: "ghost", size: "sm" }),
              "hidden text-muted-foreground sm:inline-flex",
            )}
          >
            View site
            <ExternalLink className="size-3.5" />
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
