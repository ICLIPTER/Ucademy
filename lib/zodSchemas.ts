import { IconEPassport } from "@tabler/icons-react";
import { z } from "zod";

export const CourseLevels = ["BEGINNER", "INTERMEDIATE", "ADVANCED"] as const;

export const CourseStatus = ["DRAFT", "PUBLISHED", "ARCHIVED"] as const;

export const CourseCategories = [
    'Developemnt',
    'Finance',
    'Business',
    'Marketing',
    'Design',
    'Health & Fitness',
    'Office Producitivity',
    'Photography',
    'It & Software',
    'Personal Developement',
    'Teaching & Acadamics'
] as const;



export const CourseSchema = z.object({
    title : z.string().min(3, {message: "Title must be at least 3 characters"}).max(100, {message: "Title must be at most 100 characters"}),

    description : z.string().min(3, {message: "Description must be at least 3 characters"}),

    fileKey : z.string().min(1, {message: "File key is required"}),

    price: z.coerce.number().min(1, {message: "Price must be at least 1"}),

    duration: z.coerce.number()
    .min(1, { message: "Duration must be at least 1" })
    .max(500, { message: "Duration must be at most 500" }),

    level: z.enum(CourseLevels),

    category : z.enum(CourseCategories, {message: "Category is required"}),
    
    smallDescription: z.string().min(3, {message: "Small description must be at least 3 characters"}).max(200, {message: "Small description must be at most 200 characters"}),

    slug: z.string().min(3, {message: "Slug must be at least 3 characters"}),

    status: z.enum(CourseStatus, {message: "Status must be DRAFT, PUBLISHED or ARCHIVED"}),

});


export type CourseSchemaType = z.infer<typeof CourseSchema>;