import { buttonVariants } from "@/components/ui/button";
import { Ban, PlusCircle } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

interface iAppProps {
  title: string;
  description: string;
  buttonText: string;
  href: string;
  /** Overrides the default illustration. */
  icon?: ReactNode;
}

/**
 * A friendly "nothing here yet" panel.
 *
 * Lives in `app/admin` but is used across the product — the dashboard and
 * the public catalogue both render it.
 */
export function EmptyState({
  buttonText,
  title,
  description,
  href,
  icon,
}: iAppProps) {
  return (
    <div className="flex h-full w-full animate-in flex-col items-center justify-center rounded-xl border border-dashed p-8 text-center fade-in-50">
      <div className="flex size-20 items-center justify-center rounded-full bg-primary/10">
        {icon ?? <Ban className="size-10 text-primary" />}
      </div>

      <h2 className="mt-6 text-xl font-semibold">{title}</h2>
      <p className="mt-2 max-w-md text-sm leading-tight text-muted-foreground">
        {description}
      </p>

      {href ? (
        <Link href={href} className={buttonVariants({ className: "mt-8" })}>
          <PlusCircle className="size-4" />
          {buttonText}
        </Link>
      ) : null}
    </div>
  );
}
