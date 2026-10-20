"use client";

import { EnrolledCourseType } from "@/app/data/user/get-enrolled-courses";
import { StorageImage } from "@/components/ui/storage-image";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useConstructUrl } from "@/hooks/use-construct";
import { useCourseProgress } from "@/hooks/use-course-progress";
import { categoryLabel } from "@/lib/categories";
import { formatDuration } from "@/lib/format";
import { CheckCircle2, Clock, PlayCircle } from "lucide-react";
import Link from "next/link";

interface iAppProps {
  data: EnrolledCourseType;
  /** Set on the first card of a grid so the LCP image is preloaded. */
  priority?: boolean;
}

/**
 * An enrolled course with a progress bar.
 *
 * The call-to-action adapts to the state of the course: start it, continue
 * it, or review it.
 */
export function CourseProgressCard({ data, priority = false }: iAppProps) {
  const thumbnailUrl = useConstructUrl(data.course.fileKey);
  const { totalLessons, completedLessons, progressPercentage, isComplete } =
    useCourseProgress({ courseData: data.course });

  const started = completedLessons > 0;

  const cta = isComplete
    ? "Review course"
    : started
      ? "Continue learning"
      : "Start course";

  return (
    <Card className="group relative gap-0 overflow-hidden py-0 transition-shadow hover:shadow-md">
      <div className="relative">
        <StorageImage
          width={600}
          height={400}
          className="aspect-video w-full object-cover"
          src={thumbnailUrl}
          alt=""
          priority={priority}
          sizes="(min-width: 768px) 50vw, 100vw"
        />
        <div className="absolute top-2 left-2 flex gap-1.5">
          <Badge variant="secondary" className="backdrop-blur">
            {data.course.level.charAt(0) + data.course.level.slice(1).toLowerCase()}
          </Badge>
        </div>
      </div>

      <CardContent className="p-4">
        <Link
          href={`/dashboard/${data.course.slug}`}
          className="line-clamp-2 text-lg font-medium transition-colors group-hover:text-primary"
        >
          {data.course.title}
        </Link>

        <p className="mt-1.5 line-clamp-2 text-sm leading-tight text-muted-foreground">
          {data.course.subtitle || data.course.smallDescription}
        </p>

        <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Clock className="size-3.5" />
            {formatDuration(data.course.duration)}
          </span>
          <span className="truncate">{categoryLabel(data.course.category)}</span>
        </div>

        <div className="mt-5 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium tabular-nums">
              {progressPercentage}%
            </span>
          </div>
          <Progress value={progressPercentage} className="h-1.5" />
          <p className="text-xs text-muted-foreground">
            {completedLessons} of {totalLessons} lessons completed
          </p>
        </div>

        <Link
          href={`/dashboard/${data.course.slug}`}
          className={buttonVariants({ className: "mt-4 w-full" })}
        >
          {isComplete ? (
            <CheckCircle2 className="size-4" />
          ) : (
            <PlayCircle className="size-4" />
          )}
          {cta}
        </Link>
      </CardContent>
    </Card>
  );
}
