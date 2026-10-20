"use client";

import { useMemo } from "react";

import { courseProgress, type CourseProgress } from "@/lib/course-progress";
import type { CourseProgressSource } from "@/lib/course-types";

/**
 * Computes a learner's progress through a course.
 *
 * The calculation is done on the client from the payload that was already
 * fetched, so switching lessons never triggers another request.
 */
export function useCourseProgress({
  courseData,
}: {
  courseData: CourseProgressSource;
}): CourseProgress {
  return useMemo(() => courseProgress(courseData), [courseData]);
}
