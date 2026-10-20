import "server-only";

import { headers } from "next/headers";
import { rateLimit } from "@/lib/rate-limit";

/**
 * Rate-limits a server action.
 *
 * Server actions are public HTTP endpoints — without a guard any bot can
 * hammer "create course" or "send OTP" all day. The limit is keyed on the
 * session user when there is one, otherwise on the client IP.
 *
 * @returns `true` when the action may proceed.
 */
export async function allowAction({
  scope,
  userId,
  limit = 30,
  windowSeconds = 60,
}: {
  scope: string;
  userId?: string | null;
  limit?: number;
  windowSeconds?: number;
}): Promise<boolean> {
  const headerList = await headers();

  const forwarded = headerList.get("x-forwarded-for");
  const ip =
    forwarded?.split(",")[0]?.trim() ||
    headerList.get("x-real-ip") ||
    "anonymous";

  const key = `action:${scope}:${userId ? `u:${userId}` : `ip:${ip}`}`;

  const result = await rateLimit({ key, limit, windowSeconds });

  return result.success;
}
