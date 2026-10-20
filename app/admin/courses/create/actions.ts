"use server";

import { revalidatePath, revalidateTag } from "next/cache";

import { requireAdmin } from "@/app/data/admin/require-admin";
import { allowAction } from "@/lib/action-guard";
import { prisma } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { ApiResponse } from "@/lib/types";
import { CourseSchema, CourseSchemaType } from "@/lib/zodSchemas";

/**
 * Creates a course.
 *
 * The Stripe product/price is created first so the course can be checked out
 * immediately, but the database write is the source of truth: if Stripe is
 * not configured the course is still created (and can be paid for later).
 */
export async function CreateCourse(values: CourseSchemaType): Promise<ApiResponse> {
  const session = await requireAdmin();

  const allowed = await allowAction({
    scope: "create-course",
    userId: session.user.id,
    limit: 10,
    windowSeconds: 300,
  });

  if (!allowed) {
    return {
      status: "error",
      message: "You are creating courses too quickly. Please slow down.",
    };
  }

  const validation = CourseSchema.safeParse(values);

  if (!validation.success) {
    const first = validation.error.issues[0];

    return {
      status: "error",
      message: first?.message ?? "Invalid form data.",
      fields: first?.path.length
        ? { [String(first.path[0])]: first.message }
        : undefined,
    };
  }

  const data = validation.data;

  // The slug must be unique — catch the conflict before it reaches the
  // database so the instructor gets a useful message.
  const existing = await prisma.course.findUnique({
    where: { slug: data.slug },
    select: { id: true },
  });

  if (existing) {
    return {
      status: "error",
      message: "That URL slug is already taken. Please choose another one.",
      fields: { slug: "This slug is already in use." },
    };
  }

  let stripePriceId: string | null = null;

  if (stripe) {
    try {
      const product = await stripe.products.create({
        name: data.title,
        description: data.smallDescription,
        metadata: { slug: data.slug },
        default_price_data: {
          currency: "inr",
          unit_amount: data.price * 100,
        },
      });

      stripePriceId =
        typeof product.default_price === "string"
          ? product.default_price
          : product.default_price?.id ?? null;
    } catch (error) {
      console.error("[courses] Failed to create Stripe product:", error);
      return {
        status: "error",
        message: "Could not set up the price for this course. Please try again.",
      };
    }
  }

  try {
    await prisma.course.create({
      data: {
        ...data,
        userId: session.user.id,
        stripePriceId,
      },
    });
  } catch (error) {
    console.error("[courses] Failed to create course:", error);
    return { status: "error", message: "Failed to create the course." };
  }

  revalidateTag("courses");
  revalidatePath("/admin/courses");
  revalidatePath("/courses");

  return {
    status: "success",
    message: "Course created successfully.",
    redirectTo: "/admin/courses",
  };
}
