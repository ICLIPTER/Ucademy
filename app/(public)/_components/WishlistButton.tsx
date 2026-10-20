"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Heart, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { toggleWishlistAction } from "@/app/(public)/courses/[slug]/wishlist-actions";
import { cn } from "@/lib/utils";

/**
 * Saves a course to the learner's list.
 *
 * The button optimistically flips so the interaction feels instant, and
 * rolls back if the server rejects the change.
 */
export function WishlistButton({
  courseId,
  initialSaved = false,
  className,
}: {
  courseId: string;
  initialSaved?: boolean;
  className?: string;
}) {
  const [saved, setSaved] = useState(initialSaved);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  function onToggle() {
    const previous = saved;
    setSaved(!previous);

    startTransition(async () => {
      try {
        const result = await toggleWishlistAction(courseId);

        if (result.status === "error") {
          setSaved(previous);
          toast.error(result.message);
          return;
        }

        toast.success(result.message);
        router.refresh();
      } catch {
        setSaved(previous);
        toast.error("Could not update your saved list.");
      }
    });
  }

  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={pending}
      aria-label={saved ? "Remove from saved list" : "Save course"}
      aria-pressed={saved}
      className={cn(
        "absolute top-2 right-2 z-10 flex size-9 items-center justify-center rounded-full bg-background/85 text-foreground shadow-sm backdrop-blur transition-colors hover:bg-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
        saved && "text-destructive",
        className,
      )}
    >
      {pending ? (
        <Loader2 className="size-4 animate-spin" />
      ) : (
        <Heart className={cn("size-4", saved && "fill-current")} />
      )}
    </button>
  );
}
