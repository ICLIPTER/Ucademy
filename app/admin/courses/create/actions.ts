"use server";

import { requireAdmin } from "@/app/data/admin/require-admin";
import arcjet, {  fixedWindow } from "@/lib/arcjet";
import { prisma } from "@/lib/db";
import { ApiResponse } from "@/lib/types";
import { CourseSchema, CourseSchemaType } from "@/lib/zodSchemas";
import { request } from "@arcjet/next";

const aj = arcjet

.withRule(
  fixedWindow({
    mode: "LIVE",
    max: 5,
    window: "1m",
  })
);

export async function CreateCourse(values : CourseSchemaType) : Promise<ApiResponse> {

    const session = await requireAdmin();

    try {
        const req = await request();
        const decision = await aj.protect(req, {
            fingerprint : session?.user.id,
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

        const validation = CourseSchema.safeParse(values);


        if(!validation.success) {
            return {
                status: 'error',
                message : "Invalid Form Data"
            };
        }

        await prisma.course.create({
            data: {
                ...validation.data,
                userId : session?.user.id as string,
            },
        });

        return {
            status: 'success',
            message: 'Course Created Successfully'
        }
    } catch  {
        return {
            status: 'error',
            message: 'Failed to Create Course'
        }
    }


}