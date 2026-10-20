import "server-only";

import { prisma } from "@/lib/db";

/**
 * A dependency-free, distributed rate limiter.
 *
 * Why not a paid bot-management service?
 *  - The platform must run on a free Vercel Hobby account.
 *  - Every request that goes through a third-party WAF adds a network round
 *    trip to the critical path, which directly contradicts "must load fast".
 *
 * The limiter is backed by Postgres (already provisioned, free tier) so the
 * window survives across serverless instances, and falls back to an
 * in-process window if the backing table is unavailable — the limiter is
 * always fail-open so a database hiccup can never take the site down.
 */

export type RateLimitResult = {
  success: boolean;
  limit: number;
  remaining: number;
  /** Unix timestamp (ms) at which the current window resets. */
  reset: number;
};

type Bucket = { count: number; reset: number };

const memoryBuckets = new Map<string, Bucket>();
const MEMORY_MAX_KEYS = 10_000;
let memoryTableAvailable: boolean | null = null;

/** Removes expired in-process buckets so the map cannot grow unbounded. */
function sweepMemory(now: number) {
  if (memoryBuckets.size < MEMORY_MAX_KEYS) return;
  for (const [key, bucket] of memoryBuckets) {
    if (bucket.reset <= now) memoryBuckets.delete(key);
  }
}

/**
 * Atomically increments the counter for `key` and reports whether the caller
 * is still within the limit.
 *
 * The single `INSERT ... ON CONFLICT ... DO UPDATE` statement guarantees the
 * increment is race-free even with many concurrent requests.
 */
export async function rateLimit({
  key,
  limit,
  windowSeconds,
}: {
  key: string;
  limit: number;
  windowSeconds: number;
}): Promise<RateLimitResult> {
  const now = Date.now();
  const windowMs = windowSeconds * 1000;

  if (memoryTableAvailable !== false) {
    try {
      const rows = await prisma.$queryRaw<
        { count: number; resetAt: Date }[]
      >`
        INSERT INTO "RateLimit" (id, key, count, "resetAt", "updatedAt")
        VALUES (${key}, ${key}, 1, ${new Date(now + windowMs)}, NOW())
        ON CONFLICT (key) DO UPDATE
        SET count = CASE
              WHEN "RateLimit"."resetAt" <= NOW() THEN 1
              ELSE "RateLimit".count + 1
            END,
            "resetAt" = CASE
              WHEN "RateLimit"."resetAt" <= NOW() THEN ${new Date(now + windowMs)}
              ELSE "RateLimit"."resetAt"
            END,
            "updatedAt" = NOW()
        RETURNING count, "resetAt"
      `;

      memoryTableAvailable = true;
      const row = rows[0];
      const count = Number(row.count);
      const reset = new Date(row.resetAt).getTime();

      return {
        success: count <= limit,
        limit,
        remaining: Math.max(0, limit - count),
        reset,
      };
    } catch {
      // Table missing (migration not applied yet) or DB unreachable.
      memoryTableAvailable = false;
    }
  }

  // ---- In-process fallback -------------------------------------------
  sweepMemory(now);
  const bucket = memoryBuckets.get(key);

  if (!bucket || bucket.reset <= now) {
    const fresh = { count: 1, reset: now + windowMs };
    memoryBuckets.set(key, fresh);
    return {
      success: limit >= 1,
      limit,
      remaining: Math.max(0, limit - 1),
      reset: fresh.reset,
    };
  }

  bucket.count += 1;
  return {
    success: bucket.count <= limit,
    limit,
    remaining: Math.max(0, limit - bucket.count),
    reset: bucket.reset,
  };
}

/**
 * Convenience helper that derives a stable key from the request.
 * Uses the authenticated user id when available, otherwise the client IP.
 */
export function requestFingerprint(
  request: Request,
  userId?: string | null,
): string {
  if (userId) return `u:${userId}`;

  const forwarded = request.headers.get("x-forwarded-for");
  const ip =
    forwarded?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    request.headers.get("cf-connecting-ip") ||
    "anonymous";

  return `ip:${ip}`;
}

/** Standard response headers so clients can back off politely. */
export function rateLimitHeaders(result: RateLimitResult): Record<string, string> {
  return {
    "X-RateLimit-Limit": String(result.limit),
    "X-RateLimit-Remaining": String(result.remaining),
    "X-RateLimit-Reset": String(Math.ceil(result.reset / 1000)),
  };
}
