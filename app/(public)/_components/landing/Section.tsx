import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * Shared page section.
 *
 * Every marketing page (landing, categories, pricing, about, help) uses the
 * same rhythm: a small uppercase eyebrow, a tight heading, an optional muted
 * description and an optional action on the right. It lives here so the whole
 * site speaks with one voice.
 */
export function Section({
  eyebrow,
  title,
  description,
  action,
  className,
  children,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section className={cn("py-14 md:py-20", className)}>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl space-y-2">
          {eyebrow && (
            <p className="text-sm font-medium uppercase tracking-wider text-primary">
              {eyebrow}
            </p>
          )}
          <h2 className="text-3xl font-bold tracking-tight text-balance md:text-4xl">
            {title}
          </h2>
          {description && (
            <p className="text-muted-foreground text-pretty">{description}</p>
          )}
        </div>
        {action}
      </div>

      {children}
    </section>
  );
}

/**
 * A single number in a statistics band.
 *
 * The value is pre-formatted by the caller so the component stays presentational.
 */
export function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p className="text-2xl font-bold tracking-tight md:text-3xl">{value}</p>
      <p className="mt-1 text-xs text-muted-foreground md:text-sm">{label}</p>
    </div>
  );
}
