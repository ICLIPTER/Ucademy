import Link from "next/link";
import { StorageImage } from "@/components/ui/storage-image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  IconBook,
  IconCategory,
  IconChartBar,
  IconChevronDown,
  IconClock,
  IconInfinity,
  IconPlayerPlay,
  IconSchool,
  IconStar,
  IconUsers,
  IconWorld,
} from "@tabler/icons-react";
import { CheckIcon } from "lucide-react";

import { getIndividualCourse, findCourseBySlug } from "@/app/data/course/get-course";
import { checkIfCourseBought } from "@/app/data/user/user_is_enrolled";
import { getPublicAssetUrl } from "@/lib/storage-url";
import { categoryLabel } from "@/lib/categories";
import { formatCurrency, formatDuration, formatLevel } from "@/lib/format";
import { RenderDescription } from "@/components/rich-text-editor/RenderDescription";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import { EnrollmentButton } from "./_components/EnrollmentButton";
import { ReviewsSection } from "./_components/ReviewsSection";
import { ReviewDialog } from "./_components/ReviewDialog";
import { getOptionalUserReview } from "@/app/data/course/get-reviews";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;

  const course = await findCourseBySlug(slug);

  // Raising the 404 here — before the response body starts streaming — is
  // what makes the status code a real 404 instead of a 200 with a 404 page.
  if (!course) notFound();

  return {
    title: course.title,
    description: course.smallDescription,
    openGraph: {
      title: course.title,
      description: course.smallDescription,
      images: [{ url: getPublicAssetUrl(course.fileKey) }],
    },
    alternates: { canonical: `/courses/${course.slug}` },
  };
}

export default async function SlugPage({ params }: { params: Params }) {
  const { slug } = await params;

  const course = await getIndividualCourse(slug);
  const [isEnrolled, existingReview] = await Promise.all([
    checkIfCourseBought(course.id),
    getOptionalUserReview(course.id),
  ]);

  const totalLessons = course.chapter.reduce(
    (total, chapter) => total + chapter.lessons.length,
    0,
  );

  const reviewSummary = course.totalReviews;

  return (
    <div className="pb-16">
      {/* Breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-2 py-6 text-sm text-muted-foreground"
      >
        <Link href="/" className="hover:text-foreground">
          Home
        </Link>
        <span aria-hidden>/</span>
        <Link href="/courses" className="hover:text-foreground">
          Courses
        </Link>
        <span aria-hidden>/</span>
        <Link
          href={`/courses?category=${encodeURIComponent(
            categoryLabel(course.category).toLowerCase().replace(/\s*&\s*/g, "-").replace(/\s+/g, "-"),
          )}`}
          className="hover:text-foreground"
        >
          {categoryLabel(course.category)}
        </Link>
        <span aria-hidden>/</span>
        <span className="truncate text-foreground">{course.title}</span>
      </nav>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="order-1 lg:col-span-2">
          {/* Hero image */}
          <div className="relative aspect-video w-full overflow-hidden rounded-xl shadow-lg">
            <StorageImage
              src={getPublicAssetUrl(course.fileKey)}
              alt=""
              fill
              className="object-cover"
              priority
              sizes="(min-width: 1024px) 66vw, 100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          </div>

          <div className="mt-8 space-y-6">
            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tight text-balance">
                {course.title}
              </h1>

              {course.subtitle && (
                <p className="text-lg text-muted-foreground">{course.subtitle}</p>
              )}

              <p className="max-w-3xl leading-relaxed text-muted-foreground">
                {course.smallDescription}
              </p>
            </div>

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
              {reviewSummary > 0 && (
                <span className="flex items-center gap-1.5">
                  <span className="flex gap-0.5" aria-hidden>
                    {Array.from({ length: 5 }).map((_, index) => (
                      <IconStar
                        key={index}
                        className={
                          index < Math.round(course.averageRating)
                            ? "size-4 fill-amber-400 text-amber-400"
                            : "size-4 text-muted-foreground/30"
                        }
                      />
                    ))}
                  </span>
                  <span className="font-medium">
                    {course.averageRating.toFixed(1)}
                  </span>
                  <span className="text-muted-foreground">
                    ({reviewSummary} ratings)
                  </span>
                </span>
              )}

              {course.totalStudents > 0 && (
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <IconUsers className="size-4" />
                  {course.totalStudents} learners
                </span>
              )}

              <span className="flex items-center gap-1.5 text-muted-foreground">
                <IconWorld className="size-4" />
                English
              </span>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="gap-1 px-3 py-1">
                <IconChartBar className="size-3.5" />
                {formatLevel(course.level)}
              </Badge>
              <Badge variant="secondary" className="gap-1 px-3 py-1">
                <IconCategory className="size-3.5" />
                {categoryLabel(course.category)}
              </Badge>
              <Badge variant="secondary" className="gap-1 px-3 py-1">
                <IconClock className="size-3.5" />
                {formatDuration(course.duration)}
              </Badge>
            </div>

            <Separator />

            {/* Description */}
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold tracking-tight">
                About this course
              </h2>
              <RenderDescription content={course.description} />
            </div>
          </div>

          {/* Curriculum */}
          <div className="mt-12 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-2xl font-semibold tracking-tight">
                Course content
              </h2>
              <p className="text-sm text-muted-foreground">
                {course.chapter.length} chapters · {totalLessons} lessons
              </p>
            </div>

            {course.chapter.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  The curriculum for this course is being prepared.
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {course.chapter.map((chapter, index) => (
                  <Collapsible key={chapter.id} defaultOpen={index === 0}>
                    <Card className="gap-0 overflow-hidden p-0 transition-all duration-200 hover:shadow-md">
                      <CollapsibleTrigger className="group w-full">
                        <CardContent className="flex items-center justify-between p-5 transition-colors hover:bg-muted/50">
                          <div className="flex items-center gap-4">
                            <span className="flex size-10 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary">
                              {index + 1}
                            </span>
                            <div className="text-left">
                              <h3 className="text-lg font-semibold">
                                {chapter.title}
                              </h3>
                              <p className="mt-0.5 text-sm text-muted-foreground">
                                {chapter.lessons.length} lesson
                                {chapter.lessons.length === 1 ? "" : "s"}
                              </p>
                            </div>
                          </div>

                          <IconChevronDown className="size-5 shrink-0 transition-transform duration-300 group-data-[state=open]:-rotate-90" />
                        </CardContent>
                      </CollapsibleTrigger>

                      <CollapsibleContent>
                        <div className="border-t bg-muted/20 px-5 py-4">
                          <ul className="space-y-2">
                            {chapter.lessons.map((lesson, lessonIndex) => (
                              <li
                                key={lesson.id}
                                className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-accent"
                              >
                                <span className="flex size-7 shrink-0 items-center justify-center rounded-full border bg-background">
                                  <IconPlayerPlay className="size-3.5 text-muted-foreground" />
                                </span>
                                <span className="min-w-0 flex-1 truncate text-sm font-medium">
                                  {lessonIndex + 1}. {lesson.title}
                                </span>
                                {lesson.isPreview && (
                                  <Badge variant="outline" className="shrink-0">
                                    Preview
                                  </Badge>
                                )}
                                {lesson.durationMinutes > 0 && (
                                  <span className="shrink-0 text-xs text-muted-foreground">
                                    {lesson.durationMinutes} min
                                  </span>
                                )}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </CollapsibleContent>
                    </Card>
                  </Collapsible>
                ))}
              </div>
            )}
          </div>

          {/* Reviews */}
          <div className="mt-12">
            <ReviewsSection
              courseId={course.id}
              action={
                isEnrolled ? (
                  <ReviewDialog
                    courseId={course.id}
                    existing={existingReview}
                  />
                ) : null
              }
            />
          </div>
        </div>

        {/* Sticky purchase card */}
        <div className="order-2 lg:col-span-1">
          <div className="sticky top-20 space-y-4">
            <Card className="py-0">
              <CardContent className="p-6">
                <div className="mb-6 flex items-baseline justify-between">
                  <span className="text-lg font-medium">Price</span>
                  <span className="text-3xl font-bold text-primary">
                    {course.price === 0
                      ? "Free"
                      : formatCurrency(course.price)}
                  </span>
                </div>

                {isEnrolled ? (
                  <Link
                    className={buttonVariants({ className: "w-full" })}
                    href={`/dashboard/${course.slug}`}
                  >
                    <IconPlayerPlay className="size-4" />
                    Watch course
                  </Link>
                ) : (
                  <EnrollmentButton courseId={course.id} />
                )}

                <p className="mt-3 text-center text-xs text-muted-foreground">
                  30-day money-back guarantee
                </p>

                <Separator className="my-6" />

                <h4 className="font-medium">This course includes</h4>
                <ul className="mt-4 space-y-3">
                  {[
                    `${formatDuration(course.duration)} of on-demand video`,
                    `${totalLessons} lessons across ${course.chapter.length} chapters`,
                    "Full lifetime access, including future updates",
                    "Access on mobile, tablet and desktop",
                    "Certificate of completion with a unique serial",
                    "Progress tracking across all your courses",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm">
                      <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                        <CheckIcon className="size-2.5" />
                      </span>
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Instructor */}
            {course.user && (
              <Card className="py-0">
                <CardContent className="p-6">
                  <h4 className="text-sm font-medium text-muted-foreground">
                    Your instructor
                  </h4>
                  <div className="mt-3 flex items-center gap-3">
                    <span className="flex size-11 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary">
                      {(course.user.name?.[0] ?? "?").toUpperCase()}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate font-medium">{course.user.name}</p>
                      <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <IconSchool className="size-3.5" />
                        Course instructor
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Course facts */}
            <Card className="py-0">
              <CardContent className="space-y-4 p-6">
                <h4 className="text-sm font-medium text-muted-foreground">
                  Course details
                </h4>

                <Fact
                  icon={IconClock}
                  label="Duration"
                  value={formatDuration(course.duration)}
                />
                <Fact
                  icon={IconBook}
                  label="Lessons"
                  value={`${totalLessons}`}
                />
                <Fact
                  icon={IconChartBar}
                  label="Level"
                  value={formatLevel(course.level)}
                />
                <Fact
                  icon={IconCategory}
                  label="Category"
                  value={categoryLabel(course.category)}
                />
                <Fact
                  icon={IconInfinity}
                  label="Access"
                  value="Lifetime"
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

function Fact({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof IconClock;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="flex items-center gap-2 text-muted-foreground">
        <Icon className="size-4" />
        {label}
      </span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
