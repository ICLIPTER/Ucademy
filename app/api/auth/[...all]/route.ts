import { toNextJsHandler } from "better-auth/next-js";
import { NextResponse, type NextRequest } from "next/server";

import { auth } from "@/lib/auth";
import { checkBotSignals, checkEmail } from "@/lib/abuse";
import { rateLimit, requestFingerprint } from "@/lib/rate-limit";

/**
 * Better-Auth catch-all endpoint.
 *
 * Abuse protection is implemented in-house (no paid WAF, no extra network
 * hop on the critical path):
 *
 *  - Sliding-window rate limits, persisted in Postgres so they hold across
 *    serverless instances.
 *  - A honeypot header (`x-hp`) that only an automated client fills in.
 *  - A form-elapsed-time check (`x-started-at`).
 *  - Disposable-email and address-shape validation.
 */

const authHandlers = toNextJsHandler(auth.handler);

export const { GET } = authHandlers;

/** Endpoints that send an email — the most abuse-prone surface. */
const EMAIL_SEND_PATHS = [
  "/api/auth/email-otp/send-verification-otp",
  "/api/auth/sign-up/email",
];

/** Endpoints that verify a one-time code — brute-forceable, so rate limited hard. */
const OTP_VERIFY_PATHS = ["/api/auth/email-otp/verify-otp"];

async function readJson(request: NextRequest): Promise<Record<string, unknown>> {
  try {
    return (await request.clone().json()) as Record<string, unknown>;
  } catch {
    return {};
  }
}

export const POST = async (request: NextRequest) => {
  const { pathname } = request.nextUrl;
  const isEmailSend = EMAIL_SEND_PATHS.includes(pathname);
  const isOtpVerify = OTP_VERIFY_PATHS.includes(pathname);

  // --- Rate limiting -----------------------------------------------------
  const session = await auth.api.getSession({ headers: request.headers }).catch(() => null);
  const fingerprint = requestFingerprint(request, session?.user.id);

  const limit = await rateLimit({
    key: `auth:${pathname}:${fingerprint}`,
    limit: isOtpVerify ? 10 : isEmailSend ? 5 : 30,
    windowSeconds: isOtpVerify ? 900 : isEmailSend ? 600 : 60,
  });

  if (!limit.success) {
    return NextResponse.json(
      {
        message:
          isOtpVerify
            ? "Too many verification attempts. Please try again later."
            : "Too many requests. Please wait a moment and try again.",
      },
      {
        status: 429,
        headers: {
          "Retry-After": String(
            Math.max(1, Math.ceil((limit.reset - Date.now()) / 1000)),
          ),
        },
      },
    );
  }

  // --- Bot signals -------------------------------------------------------
  if (isEmailSend) {
    const botCheck = checkBotSignals(
      request.headers.get("x-hp"),
      request.headers.get("x-started-at"),
    );

    if (!botCheck.allowed) {
      return NextResponse.json({ message: botCheck.reason }, { status: 400 });
    }
  }

  // --- Email validation --------------------------------------------------
  if (isEmailSend || isOtpVerify) {
    const body = await readJson(request);
    const emailCheck = checkEmail(body.email);

    if (!emailCheck.valid) {
      return NextResponse.json({ message: emailCheck.reason }, { status: 400 });
    }
  }

  return authHandlers.POST(request);
};
