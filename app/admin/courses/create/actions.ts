"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { ApiResponse } from "@/lib/types";
import { CourseSchema, CourseSchemaType } from "@/lib/zodSchemas";
import { headers } from "next/headers";

export async function CreateCourse(values : CourseSchemaType) : Promise<ApiResponse> {

    const session = await auth.api.getSession({
        headers: await headers()
    });

    try {
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