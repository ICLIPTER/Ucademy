"use server";

import { requireAdmin } from "@/app/data/admin/require-admin";
import arcjet, { detectBot, fixedWindow } from "@/lib/arcjet";
import { prisma } from "@/lib/db";
import { ApiResponse } from "@/lib/types";
import { CourseSchema, CourseSchemaType } from "@/lib/zodSchemas";
import { request } from "@arcjet/next";

const aj = arcjet.withRule(
  detectBot({
    mode: "LIVE",
    allow: [],
  })
).withRule(
  fixedWindow({
    mode: "LIVE",
    max: 5,
    window: "1m",
  })
);

export async function editCourse(
    data: CourseSchemaType, 
    courseId: string
): Promise<ApiResponse> {
    const user = await requireAdmin();

    try {
        const req  = await request();
        const decision = await aj.protect(req, {
            fingerprint: user.user.id,
        });

        if(decision.isDenied()) {
        if(decision.reason.isRateLimit()) {
            return {
                status: 'error',
                message: 'You have been blocked due to rate limiting',
            };
        } else {
            return {
                status: "error",
                message: "Your are a bot! Please contact out support",
            };
        }
       }

        const result = CourseSchema.safeParse(data);

        if(!result.success) {
            return {
                status: "error",
                message: "Invalid data",
            };
        }

        await prisma.course.update({
            where: {
                id: courseId,
                userId: user.user.id,
            },
            data: {
                ...result.data,
            },
    });

    return {
        status: "success",
        message: "Course updated successfully",
    };  
    } catch  {
        return {
            status : 'error',
            message :  'Failed to Update Course',
        };
    };
}