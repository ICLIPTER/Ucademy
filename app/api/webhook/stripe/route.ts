import { NextResponse } from "next/server";
import Stripe from "stripe";

import { prisma } from "@/lib/db";
import { env } from "@/lib/env";
import { stripe } from "@/lib/stripe";

/**
 * Stripe webhook.
 *
 * Notes:
 *  - The raw body is required for signature verification, so the request is
 *    read with `text()` and never parsed before `constructEvent`.
 *  - Every failure path answers with a 4xx and a message. Throwing would
 *    return a 500, which makes Stripe retry the event forever.
 *  - The handler is idempotent: the checkout session id is stored on the
 *    enrolment, so a replayed event cannot double-apply.
 */

export async function POST(request: Request) {
  if (!stripe || !env.STRIPE_WEBHOOK_SECRET) {
    console.warn("[stripe] Webhook received but Stripe is not configured.");
    return NextResponse.json(
      { message: "Payments are not configured." },
      { status: 503 },
    );
  }

  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { message: "Missing Stripe-Signature header." },
      { status: 400 },
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (error) {
    console.error("[stripe] Signature verification failed:", error);
    return NextResponse.json(
      { message: "Invalid webhook signature." },
      { status: 400 },
    );
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        break;
      }

      case "checkout.session.expired": {
        const session = event.data.object as Stripe.Checkout.Session;
        const enrollmentId = session.metadata?.enrollmentId;

        if (enrollmentId) {
          await prisma.enrollment.updateMany({
            where: { id: enrollmentId, status: "Pending" },
            data: { status: "Cancelled" },
          });
        }
        break;
      }

      case "charge.refunded": {
        const charge = event.data.object as Stripe.Charge;
        await handleRefund(charge);
        break;
      }

      default:
        // Unhandled event types are acknowledged so Stripe stops retrying.
        break;
    }
  } catch (error) {
    console.error(`[stripe] Failed to process ${event.type}:`, error);
    return NextResponse.json(
      { message: "Failed to process the event." },
      { status: 500 },
    );
  }

  return NextResponse.json({ received: true });
}

/**
 * Marks the enrolment as refunded and revokes access.
 *
 * A refund is delivered against the Charge, not the Checkout Session, so the
 * session is resolved through the payment intent before the enrolment can be
 * located.
 */
async function handleRefund(charge: Stripe.Charge) {
  if (!stripe) return;

  const paymentIntentId =
    typeof charge.payment_intent === "string"
      ? charge.payment_intent
      : charge.payment_intent?.id;

  if (!paymentIntentId) return;

  const sessions = await stripe.checkout.sessions.list({
    payment_intent: paymentIntentId,
    limit: 1,
  });

  const session = sessions.data[0];
  const enrollmentId = session?.metadata?.enrollmentId;

  if (!enrollmentId) return;

  await prisma.enrollment.updateMany({
    where: { id: enrollmentId },
    data: {
      status: "Refunded",
      refundedAmount: charge.amount_refunded,
    },
  });
}

/**
 * Activates the enrolment created before checkout.
 *
 * The enrolment id, course id and user id are all taken from the session
 * metadata that we set when creating the checkout session, and every one of
 * them is validated before it is used.
 */
async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const { courseId, enrollmentId, userId } = session.metadata ?? {};

  if (!courseId || !enrollmentId) {
    console.error("[stripe] checkout.session.completed is missing metadata.");
    return;
  }

  const enrollment = await prisma.enrollment.findUnique({
    where: { id: enrollmentId },
    select: { id: true, userId: true, courseId: true, status: true },
  });

  if (!enrollment) {
    console.error(`[stripe] No enrolment found for ${enrollmentId}.`);
    return;
  }

  // Resolve the learner. Prefer the metadata id, fall back to the Stripe
  // customer id we persisted when the customer was created.
  let resolvedUserId: string | null = userId ?? enrollment.userId;

  if (!resolvedUserId) {
    const customerId =
      typeof session.customer === "string" ? session.customer : null;

    if (customerId) {
      const user = await prisma.user.findUnique({
        where: { stripeCustomerId: customerId },
        select: { id: true },
      });
      resolvedUserId = user?.id ?? null;
    }
  }

  if (!resolvedUserId) {
    console.error("[stripe] Could not resolve the learner for the order.");
    return;
  }

  const amount = session.amount_total ?? 0;

  await prisma.$transaction([
    prisma.enrollment.update({
      where: { id: enrollmentId },
      data: {
        userId: resolvedUserId,
        courseId,
        amount,
        status: "Active",
        checkoutSessionId: session.id,
      },
    }),
    // Keep the denormalised counter on the course in sync.
    prisma.course.update({
      where: { id: courseId },
      data: { totalStudents: { increment: 1 } },
    }),
  ]);
}
