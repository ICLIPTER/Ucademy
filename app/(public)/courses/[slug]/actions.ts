"use server";

import { requireUser } from "@/app/data/user/require_user";
import { allowAction } from "@/lib/action-guard";
import { appUrl } from "@/lib/env";
import { prisma } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { ApiResponse } from "@/lib/types";

/**
 * Starts a Stripe Checkout session for a course.
 *
 * The URL is returned to the client instead of using `redirect()`: a
 * `redirect()` raised inside a server action is caught by the `tryCatch`
 * wrapper the client uses, so the learner was never sent to Stripe and the
 * enrolment silently failed.
 *
 * The price comes from the course record and is sent as inline `price_data`,
 * so every course is charged its own amount. (The previous implementation
 * used a hard-coded Stripe price id, which charged every learner the same
 * amount regardless of the course price.)
 */
export async function enrollInCourseAction(
  courseId: string,
): Promise<ApiResponse> {
  const user = await requireUser();

  const allowed = await allowAction({
    scope: "enroll",
    userId: user.id,
    limit: 10,
    windowSeconds: 300,
  });

  if (!allowed) {
    return {
      status: "error",
      message: "Too many checkout attempts. Please wait a few minutes.",
    };
  }

  if (!stripe) {
    return {
      status: "error",
      message: "Payments are not available on this deployment yet.",
    };
  }

  try {
    const course = await prisma.course.findFirst({
      where: { id: courseId, status: "PUBLISHED" },
      select: {
        id: true,
        title: true,
        subtitle: true,
        smallDescription: true,
        price: true,
        slug: true,
      },
    });

    if (!course) {
      return { status: "error", message: "This course is no longer available." };
    }

    const existing = await prisma.enrollment.findUnique({
      where: { courseId_userId: { courseId: course.id, userId: user.id } },
      select: { id: true, status: true },
    });

    if (existing?.status === "Active") {
      return {
        status: "success",
        message: "You already have access to this course.",
        redirectTo: `/dashboard/${course.slug}`,
      };
    }

    // --- Resolve the Stripe customer -------------------------------------
    const userWithCustomer = await prisma.user.findUnique({
      where: { id: user.id },
      select: { stripeCustomerId: true },
    });

    let stripeCustomerId = userWithCustomer?.stripeCustomerId ?? null;

    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name,
        metadata: { userId: user.id },
      });

      stripeCustomerId = customer.id;

      await prisma.user.update({
        where: { id: user.id },
        data: { stripeCustomerId },
      });
    }

    // --- Create (or reset) the enrolment ---------------------------------
    const enrollment = existing
      ? await prisma.enrollment.update({
          where: { id: existing.id },
          data: { amount: course.price, status: "Pending" },
        })
      : await prisma.enrollment.create({
          data: {
            userId: user.id,
            courseId: course.id,
            amount: course.price,
            status: "Pending",
          },
        });

    // --- Stripe checkout ---------------------------------------------------
    // The Stripe call is deliberately outside the database transaction: a
    // network round-trip to Stripe must never hold a transaction open.
    const checkoutSession = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      line_items: [
        {
          price_data: {
            currency: "inr",
            unit_amount: course.price * 100,
            product_data: {
              name: course.title,
              description:
                course.subtitle ?? course.smallDescription ?? undefined,
            },
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      allow_promotion_codes: true,
      success_url: `${appUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/payment/cancel?course=${course.slug}`,
      metadata: {
        userId: user.id,
        courseId: course.id,
        enrollmentId: enrollment.id,
      },
    });

    if (!checkoutSession.url) {
      return {
        status: "error",
        message: "Could not start the checkout. Please try again.",
      };
    }

    return {
      status: "success",
      message: "Redirecting you to secure checkout…",
      redirectTo: checkoutSession.url,
    };
  } catch (error) {
    console.error("[enroll] Failed to create checkout session:", error);

    return {
      status: "error",
      message: "We could not start the checkout. Please try again.",
    };
  }
}

/**
 * Confirms a completed checkout from the browser.
 *
 * The Stripe webhook is the source of truth, but the learner is redirected
 * back before the webhook has necessarily been delivered, so the success
 * page polls this action to pick up the activation immediately.
 */
export async function verifyCheckoutAction(
  sessionId: string,
): Promise<ApiResponse> {
  if (!stripe) {
    return { status: "error", message: "Payments are not configured." };
  }

  const user = await requireUser();

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.metadata?.userId !== user.id) {
      return { status: "error", message: "This order does not belong to you." };
    }

    const enrollmentId = session.metadata?.enrollmentId;

    if (!enrollmentId) {
      return { status: "error", message: "Order metadata is incomplete." };
    }

    const enrollment = await prisma.enrollment.findUnique({
      where: { id: enrollmentId },
      select: { id: true, status: true, course: { select: { slug: true } } },
    });

    if (!enrollment) {
      return { status: "error", message: "We could not find your order." };
    }

    if (enrollment.status === "Active") {
      return {
        status: "success",
        message: "Payment confirmed.",
        redirectTo: `/dashboard/${enrollment.course.slug}`,
      };
    }

    // The webhook has not landed yet — apply the change here as well. The
    // webhook is idempotent, so the two paths cannot conflict.
    await prisma.enrollment.update({
      where: { id: enrollmentId },
      data: {
        status: "Active",
        userId: user.id,
        amount: session.amount_total ?? 0,
        checkoutSessionId: session.id,
      },
    });

    await prisma.course.update({
      where: { id: session.metadata.courseId },
      data: { totalStudents: { increment: 1 } },
    });

    return {
      status: "success",
      message: "Payment confirmed.",
      redirectTo: `/dashboard/${enrollment.course.slug}`,
    };
  } catch (error) {
    console.error("[enroll] Failed to verify checkout:", error);
    return {
      status: "error",
      message: "We could not confirm the payment yet. Please try again shortly.",
    };
  }
}
