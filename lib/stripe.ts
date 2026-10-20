import "server-only";

import Stripe from "stripe";
import { env } from "@/lib/env";

/**
 * Stripe client.
 *
 * Only constructed when `STRIPE_SECRET_KEY` is configured, so a deployment
 * without payments still builds and boots. Course creation degrades to
 * "payment disabled" instead of crashing.
 */
export const stripe = env.STRIPE_SECRET_KEY
  ? new Stripe(env.STRIPE_SECRET_KEY, {
      apiVersion: "2025-10-29.clover",
      typescript: true,
      // The SDK retries idempotently instead of failing a checkout because
      // of a transient network blip.
      maxNetworkRetries: 2,
      timeout: 20_000,
    })
  : null;

/** Thrown when a Stripe-only code path is reached without Stripe configured. */
export class StripeNotConfiguredError extends Error {
  constructor() {
    super("Payments are not configured for this deployment.");
    this.name = "StripeNotConfiguredError";
  }
}
