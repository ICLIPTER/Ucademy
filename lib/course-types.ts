/**
 * Client-safe structural types.
 *
 * These describe the *shape* of a course curriculum without importing from a
 * `server-only` module. Client components import from here, so the server
 * data layer stays out of the browser bundle and the types cannot drift.
 */

export type CourseLessonProgress = {
  id: string;
  completed: boolean;
  /**
   * Nullable in the database (a progress row can exist without a lesson
   * while the relation is being written), so the type mirrors that.
   */
  lessonId: string | null;
};

export type CourseLessonShape = {
  id: string;
  title: string;
  description?: string | null;
  position: number;
  durationMinutes?: number;
  isPreview?: boolean;
  lessonProgress: CourseLessonProgress[];
};

export type CourseChapterShape = {
  id: string;
  title: string;
  position: number;
  lessons: CourseLessonShape[];
};

/** The minimum a course needs to expose for progress to be computed. */
export type CourseProgressSource = {
  chapter: CourseChapterShape[];
};
