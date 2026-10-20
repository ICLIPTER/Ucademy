import { Badge } from "@/components/ui/badge";
import { StorageImage } from "@/components/ui/storage-image";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getPublicAssetUrl } from "@/lib/storage-url";
import { categoryLabel } from "@/lib/categories";
import { formatCompactNumber, formatCurrency, formatDuration } from "@/lib/format";
import { Clock, Star, Users } from "lucide-react";
import Link from "next/link";
import { WishlistButton } from "./WishlistButton";

/**
 * How many cards at the top of a grid should be preloaded.
 *
 * The catalogue renders three columns on desktop, so the first six cards
 * cover the two rows that are visible in a typical viewport. Preloading them
 * means the Largest Contentful Paint image is discovered with the document
 * instead of after the first paint — and it keeps Next.js from warning that
 * an above-the-fold image was found late.
 *
 * Mobile only shows one card, but the extra requests are `fetchpriority`
 * hints rather than blocking downloads, so the cost is a few hundred
 * kilobytes at worst.
 */
export const PRIORITY_CARD_COUNT = 6;

export type PublicCourseCardData = {  id: string;
  title: string;
  subtitle?: string | null;
  smallDescription: string;
  slug: string;
  fileKey: string;
  price: number;
  duration: number;
  level: string;
  category: string;
  averageRating?: number;
  totalReviews?: number;
  totalStudents?: number;
};

/**
 * A course card in the public catalogue.
 *
 * Rendered on the server — it has no interactivity of its own, so no
 * JavaScript is shipped for it. The only interactive element (the wishlist
 * button) is a small client island.
 */
export function PublicCourseCard({
  data,
  saved = false,
  showWishlist = false,
  priority = false,
}: {
  data: PublicCourseCardData;
  saved?: boolean;
  showWishlist?: boolean;
  /** Set on the first card of a grid so the LCP image is preloaded. */
  priority?: boolean;
}) {
  const thumbnailUrl = getPublicAssetUrl(data.fileKey);
  const rating = data.averageRating ?? 0;

  return (
    <Card className="group relative gap-0 overflow-hidden py-0 transition-shadow hover:shadow-lg">
      <div className="relative">
        <StorageImage
          width={600}
          height={400}
          className="aspect-video w-full object-cover"
          src={thumbnailUrl}
          alt=""
          priority={priority}
          sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
        />
        <div className="absolute top-2 left-2 flex gap-1.5">
          <Badge variant="secondary" className="backdrop-blur">
            {data.level.charAt(0) + data.level.slice(1).toLowerCase()}
          </Badge>
        </div>
        {showWishlist && (
          <WishlistButton courseId={data.id} initialSaved={saved} />
        )}
      </div>

      <CardContent className="p-4">
        <div className="mb-2 flex items-center gap-3 text-xs text-muted-foreground">
          {rating > 0 && (
            <span className="flex items-center gap-1 font-medium text-foreground">
              <Star className="size-3.5 fill-amber-400 text-amber-400" />
              {rating.toFixed(1)}
              {data.totalReviews ? (
                <span className="text-muted-foreground">
                  ({formatCompactNumber(data.totalReviews)})
                </span>
              ) : null}
            </span>
          )}
          {typeof data.totalStudents === "number" && data.totalStudents > 0 && (
            <span className="flex items-center gap-1">
              <Users className="size-3.5" />
              {formatCompactNumber(data.totalStudents)}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Clock className="size-3.5" />
            {formatDuration(data.duration)}
          </span>
        </div>

        <Link
          href={`/courses/${data.slug}`}
          className="line-clamp-2 text-lg font-medium transition-colors group-hover:text-primary"
        >
          {data.title}
        </Link>

        <p className="mt-1.5 line-clamp-2 text-sm leading-tight text-muted-foreground">
          {data.subtitle || data.smallDescription}
        </p>

        <p className="mt-2 text-xs text-muted-foreground">
          {categoryLabel(data.category)}
        </p>

        <div className="mt-4 flex items-center justify-between gap-3">
          <span className="text-lg font-semibold">
            {data.price === 0 ? "Free" : formatCurrency(data.price)}
          </span>

          <Link
            href={`/courses/${data.slug}`}
            className={buttonVariants({ variant: "outline", size: "sm" })}
          >
            View course
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

export function PublicCourseCardSkeleton() {  return (
    <Card className="gap-0 overflow-hidden py-0">
      <div className="relative w-full">
        <Skeleton className="aspect-video w-full rounded-none" />
      </div>
      <CardContent className="p-4">
        <div className="space-y-2">
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-3/4" />
        </div>
        <div className="mt-4 flex items-center gap-x-5">
          <Skeleton className="size-6 rounded-md" />
          <Skeleton className="h-4 w-8" />
        </div>
        <Skeleton className="mt-4 h-10 w-full rounded-md" />
      </CardContent>
    </Card>
  );
}
