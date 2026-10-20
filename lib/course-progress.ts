import type { CourseProgressSource } from "@/lib/course-types";

/**
 * Progress for a course, computed from the curriculum payload.
 *
 * Isomorphic so the same calculation runs on the server (for the dashboard
 * summary) and on the client (for the sidebar progress bar) and can never
 * disagree.
 */
export type CourseProgress = {
  totalLessons: number;
  completedLessons: number;
  progressPercentage: number;
  isComplete: boolean;
};

export function courseProgress(course: CourseProgressSource): CourseProgress {
  let totalLessons = 0;
  let completedLessons = 0;

  for (const chapter of course.chapter) {
    for (const lesson of chapter.lessons) {
      totalLessons += 1;

      const isCompleted = lesson.lessonProgress.some(
        (progress) => progress.lessonId === lesson.id && progress.completed,
      );

      if (isCompleted) completedLessons += 1;
    }
  }

  return {
    totalLessons,
    completedLessons,
    progressPercentage:
      totalLessons > 0
        ? Math.round((completedLessons / totalLessons) * 100)
        : 0,
    isComplete: totalLessons > 0 && completedLessons === totalLessons,
  };
}
