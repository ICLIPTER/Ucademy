import { Badge } from "@/components/ui/badge";
import { StorageImage } from "@/components/ui/storage-image";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { getPublicAssetUrl } from "@/lib/storage-url";
import { formatCurrency } from "@/lib/format";
import { categoryLabel } from "@/lib/categories";
import {
  ArrowRight,
  Eye,
  MoreVertical,
  Pencil,
  Star,
  TimerIcon,
  Trash2,
  Users,
} from "lucide-react";
import Link from "next/link";

export type AdminCourseCardData = {
  id: string;
  title: string;
  smallDescription: string;
  slug: string;
  fileKey: string;
  price: number;
  duration: number;
  level: string;
  category: string;
  status: string;
  totalStudents?: number;
  averageRating?: number;
  totalReviews?: number;
  _count?: { chapter: number; enrollment: number; reviews: number };
};

interface iAppProps {
  data: AdminCourseCardData;
  /** Set on the first card of a grid so the LCP image is preloaded. */
  priority?: boolean;
}

const STATUS_VARIANT: Record<
  string,
  "default" | "secondary" | "outline" | "destructive"
> = {
  PUBLISHED: "default",
  DRAFT: "secondary",
  ARCHIVED: "outline",
};

export function AdminCourseCard({ data, priority = false }: iAppProps) {
  const thumbnailUrl = getPublicAssetUrl(data.fileKey);

  return (
    <Card className="group relative gap-0 overflow-hidden py-0">
      <div className="absolute top-2 right-2 z-10">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="flex size-8 items-center justify-center rounded-md bg-background/80 text-foreground shadow-sm backdrop-blur transition-colors hover:bg-background"
              aria-label="Course actions"
            >
              <MoreVertical className="size-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuItem asChild>
              <Link href={`/admin/courses/${data.id}/edit`}>
                <Pencil className="mr-2 size-4" />
                Edit course
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              {/* Public preview lives under /courses, not /admin. */}
              <Link href={`/courses/${data.slug}`} target="_blank">
                <Eye className="mr-2 size-4" />
                Preview
              </Link>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem asChild>
              <Link
                href={`/admin/courses/${data.id}/delete`}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 size-4" />
                Delete course
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="relative">
        <StorageImage
          src={thumbnailUrl}
          alt=""
          width={600}
          height={400}
          className="aspect-video w-full object-cover"
          priority={priority}
          sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
        />
        <div className="absolute top-2 left-2 flex gap-1.5">
          <Badge variant={STATUS_VARIANT[data.status] ?? "secondary"}>
            {data.status.charAt(0) + data.status.slice(1).toLowerCase()}
          </Badge>
          {data.averageRating ? (
            <Badge variant="secondary" className="gap-1">
              <Star className="size-3 fill-current" />
              {data.averageRating.toFixed(1)}
            </Badge>
          ) : null}
        </div>
      </div>

      <CardContent className="p-4">
        <Link
          href={`/admin/courses/${data.id}/edit`}
          className="line-clamp-2 text-lg font-medium transition-colors group-hover:text-primary"
        >
          {data.title}
        </Link>
        <p className="mt-2 line-clamp-2 text-sm leading-tight text-muted-foreground">
          {data.smallDescription}
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <TimerIcon className="size-4 text-primary" />
            {data.duration} h
          </span>
          <span className="truncate">{categoryLabel(data.category)}</span>
          {typeof data.totalStudents === "number" && (
            <span className="flex items-center gap-1.5">
              <Users className="size-4 text-primary" />
              {data.totalStudents}
            </span>
          )}
          <span className="ml-auto font-medium text-foreground">
            {formatCurrency(data.price)}
          </span>
        </div>

        <Link
          className={buttonVariants({ className: "mt-4 w-full" })}
          href={`/admin/courses/${data.id}/edit`}
        >
          Edit course
          <ArrowRight className="size-4" />
        </Link>
      </CardContent>
    </Card>
  );
}

export function AdminCourseCardSkeleton() {
  return (
    <Card className="gap-0 overflow-hidden py-0">
      <div className="relative w-full">
        <Skeleton className="aspect-video w-full rounded-none" />
      </div>
      <CardContent className="p-4">
        <Skeleton className="mb-2 h-6 w-3/4 rounded" />
        <Skeleton className="h-4 w-full rounded" />
        <div className="mt-4 flex items-center gap-x-5">
          <Skeleton className="size-6 rounded-md" />
          <Skeleton className="h-4 w-10 rounded" />
        </div>
        <Skeleton className="mt-4 h-10 w-full rounded" />
      </CardContent>
    </Card>
  );
}
