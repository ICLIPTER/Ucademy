"use server";

import { requireAdmin } from "@/app/data/admin/require-admin";
import arcjet, {  fixedWindow } from "@/lib/arcjet";
import { prisma } from "@/lib/db";
import { stripe } from "@/lib/stripe";
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

        const data = await stripe.products.create({
            name: validation.data.title,
            description: validation.data.smallDescription,
            default_price_data: {
                currency: 'inr',
                unit_amount: validation.data.price * 100,
            }
        })

        await prisma.course.create({
            data: {
                ...validation.data,
                userId : session?.user.id as string,
                stripePriceId : data.default_price as string,
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