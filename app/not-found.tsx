import Link from "next/link";
import { Home, Search } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";


export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-6 px-4 text-center">
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.3em] text-primary">
          404
        </p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-balance md:text-5xl">
          We couldn&apos;t find that page
        </h1>
        <p className="mx-auto mt-4 max-w-md leading-relaxed text-muted-foreground">
          The course, page or profile you were looking for may have been moved,
          unpublished or never existed.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Link href="/" className={buttonVariants()}>
          <Home className="size-4" />
          Back to home
        </Link>
        <Link
          href="/courses"
          className={buttonVariants({ variant: "outline" })}
        >
          <Search className="size-4" />
          Browse courses
        </Link>
      </div>
    </div>
  );
}
