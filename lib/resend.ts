import "server-only";

import { Resend } from "resend";
import { env } from "@/lib/env";

/**
 * Resend is only instantiated when the API key is present so that the app
 * can boot (and build) without a mail provider attached.
 */
export const resend = env.RESEND_API_KEY
  ? new Resend(env.RESEND_API_KEY)
  : null;
