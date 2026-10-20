import { z } from "zod";

import { CATEGORY_LABELS } from "@/lib/categories";

export const CourseLevels = ["BEGINNER", "INTERMEDIATE", "ADVANCED"] as const;

export const CourseStatus = ["DRAFT", "PUBLISHED", "ARCHIVED"] as const;

/**
 * Canonical category labels.
 *
 * The historical list contained several misspellings ("Developemnt",
 * "Office Producitivity", "Teaching & Acadamics"). Those values still exist
 * in the database; they are normalised on read by `lib/categories.ts` so the
 * catalogue never renders a broken category.
 */
export const CourseCategories = CATEGORY_LABELS;

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const CourseSchema = z.object({
  title: z
    .string()
    .min(3, { message: "Title must be at least 3 characters" })
    .max(100, { message: "Title must be at most 100 characters" }),

  description: z.string().min(3, { message: "Description must be at least 3 characters" }),

  fileKey: z.string().min(1, { message: "Thumbnail image is required" }),

  price: z.coerce
    .number()
    .int("Price must be a whole number")
    .min(0, { message: "Price cannot be negative" })
    .max(10_000_000, { message: "Price is unrealistically high" }),

  duration: z.coerce
    .number()
    .int("Duration must be a whole number")
    .min(1, { message: "Duration must be at least 1 hour" })
    .max(500, { message: "Duration must be at most 500 hours" }),

  level: z.enum(CourseLevels, { error: "Level must be beginner, intermediate or advanced" }),

  category: z.enum(CourseCategories, {
    error: "Please choose a category",
  }),

  smallDescription: z
    .string()
    .min(3, { message: "Summary must be at least 3 characters" })
    .max(200, { message: "Summary must be at most 200 characters" }),

  /** Short marketing tagline shown on cards and in the hero. */
  subtitle: z
    .string()
    .max(140, { message: "Tagline must be at most 140 characters" })
    .optional()
    .or(z.literal("")),

  slug: z
    .string()
    .min(3, { message: "Slug must be at least 3 characters" })
    .max(120, { message: "Slug must be at most 120 characters" })
    .regex(
      slugPattern,
      "Slug may only contain lowercase letters, numbers and single hyphens",
    ),

  status: z.enum(CourseStatus, {
    error: "Status must be DRAFT, PUBLISHED or ARCHIVED",
  }),
});

export const chapterSchema = z.object({
  name: z.string().min(3, { message: "Chapter name must be at least 3 characters" }),
  courseId: z.string().min(1, { message: "Course id is required" }),
});

export const lessonSchema = z.object({
  name: z.string().min(3, { message: "Lesson name must be at least 3 characters" }),
  courseId: z.string().min(1, { message: "Course id is required" }),
  chapterId: z.string().min(1, { message: "Chapter id is required" }),
  description: z.string().optional(),
  thumbnailkey: z.string().optional(),
  videoKey: z.string().optional(),
});

export const reviewSchema = z.object({
  courseId: z.string().min(1, { message: "Course id is required" }),
  rating: z.coerce
    .number()
    .int("Rating must be a whole number")
    .min(1, { message: "Please choose a rating" })
    .max(5, { message: "Rating must be between 1 and 5" }),
  title: z.string().max(120, { message: "Title must be at most 120 characters" }).optional(),
  comment: z.string().max(2000, { message: "Review must be at most 2000 characters" }).optional(),
});

export const profileSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }).max(80),
  jobTitle: z.string().max(120).optional(),
  bio: z.string().max(600, { message: "Bio must be at most 600 characters" }).optional(),
});

export type CourseSchemaType = z.infer<typeof CourseSchema>;
export type ChapterSchemaType = z.infer<typeof chapterSchema>;
export type LessonSchemaType = z.infer<typeof lessonSchema>;
export type ReviewSchemaType = z.infer<typeof reviewSchema>;
export type ProfileSchemaType = z.infer<typeof profileSchema>;
