import "server-only";

import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { admin, emailOTP } from "better-auth/plugins";
import { appUrl, env, hasGitHub, hasResend } from "@/lib/env";
import { prisma } from "@/lib/db";
import { resend } from "@/lib/resend";

/**
 * Better-Auth configuration.
 *
 * Every external provider is optional. When a provider is not configured the
 * corresponding sign-in method is simply not offered, which keeps the app
 * deployable (and buildable) on a free account without a dozen secrets.
 */
export const auth = betterAuth({
  appName: "Ucademy",

  baseURL: appUrl,

  secret: env.BETTER_AUTH_SECRET,

  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  /**
   * Accept the deployment origin so OAuth callbacks and cookie handling work
   * on a custom domain in production.
   */
  trustedOrigins: [appUrl, "http://localhost:3000"],

  ...(hasGitHub
    ? {
        socialProviders: {
          github: {
            clientId: env.AUTH_GITHUB_CLIENT_ID as string,
            clientSecret: env.AUTH_GITHUB_SECRET as string,
            ...(env.AUTH_GITHUB_REDIRECT_URI
              ? { redirectUri: env.AUTH_GITHUB_REDIRECT_URI }
              : {}),
          },
        },
      }
    : {}),

  session: {
    expiresIn: 60 * 60 * 24 * 30, // 30 days
    updateAge: 60 * 60 * 24, // refresh the cookie once a day
    cookieCache: {
      // Caching the session in a cookie removes a database round-trip from
      // every single request. It is disabled in development so that role
      // changes take effect immediately while working locally.
      enabled: process.env.NODE_ENV === "production",
      maxAge: 60 * 5, // 5 minutes
    },
  },

  /*
   * The `role`, `banned`, `banReason` and `banExpires` fields are provided by
   * the `admin()` plugin below, so they must not be declared again here.
   */

  plugins: [
    emailOTP({
      otpLength: 6,
      expiresIn: 300, // 5 minutes
      async sendVerificationOTP({ email, otp }) {
        if (!hasResend || !resend) {
          console.error(
            "[auth] RESEND_API_KEY is not configured — cannot deliver the OTP.",
          );
          return;
        }

        const { error } = await resend.emails.send({
          from: env.RESEND_FROM_EMAIL,
          to: [email],
          subject: "Your Ucademy verification code",
          text: `Your Ucademy verification code is ${otp}. It expires in 5 minutes.`,
          html: `
            <div style="font-family:system-ui,-apple-system,Segoe UI,sans-serif;max-width:420px;margin:0 auto;padding:24px">
              <h1 style="font-size:20px;margin:0 0 8px">Verify your email</h1>
              <p style="color:#555;margin:0 0 20px">Enter this code to finish signing in to Ucademy.</p>
              <div style="font-size:30px;font-weight:700;letter-spacing:8px;background:#f4f4f5;border-radius:10px;padding:16px;text-align:center">${otp}</div>
              <p style="color:#888;font-size:13px;margin-top:20px">This code expires in 5 minutes. If you did not request it you can safely ignore this email.</p>
            </div>
          `,
        });

        if (error) {
          // Never swallow a delivery failure — a silently failed email means
          // a user who can never sign in.
          console.error("[auth] Failed to deliver OTP email:", error);
        }
      },
    }),
    admin(),
  ],
});
