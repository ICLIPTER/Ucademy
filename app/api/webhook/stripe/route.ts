import { prisma } from "@/lib/db";
import { env } from "@/lib/env";
import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import Stripe from "stripe";

export async function POST(req: Request) {
    const body = await req.text();

    const headerList = await headers();

    const signature = headerList.get("Stripe-Signature") as string;

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            env.STRIPE_WEBHOOK_SECRET,
        );
    } catch {
        return new Response('Webhook error', { status: 400 });
    }

    const session = event.data.object as Stripe.Checkout.Session;

    if (event.type === "checkout.session.completed") {
        const courseId = session.metadata?.courseId;
        const customerId = session.customer ?? session.metadata?.customerId;
        const enrollmentId = session.metadata?.enrollmentId;

        if (!courseId) {
            throw new Error("Course id is missing");
        }

        const user = await prisma.user.findUnique({
            where: {
                stripeCustomerId: customerId as string,
            },
            select: {
                id: true,
            },
        });

        if (!user) {
            throw new Error("User not found");
        }

        await prisma.enrollment.update({
            where: {
                id: enrollmentId as string,
            },
            data: {
                userId: user.id,
                courseId: courseId,
                amount: session.amount_total as number,
                status: "Active",
            },
        });
    }

    return new Response(null, { status: 200 });
}
