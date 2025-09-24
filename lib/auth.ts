import { _email, betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./db";
import { env } from "./env";
import { emailOTP } from "better-auth/plugins"
import { resend } from "./resend";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql", // or "mysql", "sqlite", etc.
  }),
  socialProviders: {
    github: {
      clientId:env.AUTH_GITHUB_CLIENT_ID,
      clientSecret:env.AUTH_GITHUB_SECRET,
    },
  },

  plugins: [
    emailOTP({
      async sendVerificationOTP({email, otp}) {
        const { data, error } = await resend.emails.send({
           from: 'Ucadamy <onboarding@resend.dev>',
           to: [email],
           subject: 'Ucadamy - verify your email',
           html: `<p>Your OTP is <strong>${otp}</strong></p>`,
         });
      },
    }),
  ],
});
