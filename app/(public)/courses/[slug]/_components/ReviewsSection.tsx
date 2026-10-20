import { Star } from "lucide-react";
import type { ReactNode } from "react";

import {
  getCourseReviews,
  getReviewSummary,
} from "@/app/data/course/get-reviews";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { formatRelativeTime } from "@/lib/format";
import { cn } from "@/lib/utils";

/**
 * The review section of a course page.
 *
 * Server-rendered so the ratings are visible without a round-trip.
 */
export async function ReviewsSection({
  courseId,
  action,
}: {
  courseId: string;
  /** Optional call to action rendered in the header (e.g. "write a review"). */
  action?: ReactNode;
}) {
  const [summary, reviews] = await Promise.all([
    getReviewSummary(courseId),
    getCourseReviews(courseId),
  ]);

  return (
    <section className="space-y-8" id="reviews">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">
            Learner reviews
          </h2>
          <p className="mt-2 text-muted-foreground">
            {summary.total === 0
              ? "No reviews yet — be the first to share your experience."
              : `${summary.total} review${summary.total === 1 ? "" : "s"} from enrolled learners.`}
          </p>
        </div>
        {action}
      </div>

      {summary.total > 0 && (
        <div className="grid gap-8 rounded-xl border bg-card p-6 md:grid-cols-3">
          <div className="flex flex-col items-center justify-center gap-2 text-center">
            <span className="text-5xl font-bold tabular-nums">
              {summary.average.toFixed(1)}
            </span>
            <div className="flex gap-0.5" aria-hidden>
              {Array.from({ length: 5 }).map((_, index) => (
                <Star
                  key={index}
                  className={cn(
                    "size-4",
                    index < Math.round(summary.average)
                      ? "fill-amber-400 text-amber-400"
                      : "text-muted-foreground/30",
                  )}
                />
              ))}
            </div>
            <p className="text-sm text-muted-foreground">
              {summary.total} rating{summary.total === 1 ? "" : "s"}
            </p>
          </div>

          <div className="space-y-2 md:col-span-2">
            {summary.buckets.map((bucket) => (
              <div key={bucket.rating} className="flex items-center gap-3">
                <span className="w-12 shrink-0 text-sm text-muted-foreground">
                  {bucket.rating} star
                </span>
                <Progress value={bucket.percentage} className="h-2 flex-1" />
                <span className="w-10 shrink-0 text-right text-sm tabular-nums text-muted-foreground">
                  {bucket.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {reviews.length > 0 ? (
        <ul className="space-y-6">
          {reviews.map((review) => (
            <li key={review.id} className="rounded-xl border bg-card p-6">
              <div className="flex items-start gap-4">
                <Avatar className="size-10">
                  <AvatarImage src={review.user.image ?? undefined} alt="" />
                  <AvatarFallback>
                    {(review.user.name?.[0] ?? "?").toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <span className="font-medium">{review.user.name}</span>
                    <span className="flex gap-0.5" aria-label={`${review.rating} out of 5`}>
                      {Array.from({ length: 5 }).map((_, index) => (
                        <Star
                          key={index}
                          className={cn(
                            "size-3.5",
                            index < review.rating
                              ? "fill-amber-400 text-amber-400"
                              : "text-muted-foreground/30",
                          )}
                        />
                      ))}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {formatRelativeTime(review.createdAt)}
                    </span>
                  </div>

                  {review.title && (
                    <p className="mt-2 font-medium">{review.title}</p>
                  )}

                  {review.comment && (
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      {review.comment}
                    </p>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
