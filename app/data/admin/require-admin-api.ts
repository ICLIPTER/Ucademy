import "server-only";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";

/**
 * API-route variant of the admin guard.
 *
 * `requireAdmin()` redirects, which is correct for pages but wrong for an
 * API route — an API should answer with a status code, not a 307 to an HTML
 * login page. Returns `null` when the caller is not an authenticated admin.
 */
export async function requireAdminApi(): Promise<{
  id: string;
  email: string;
  name: string;
} | null> {
  const session = await auth.api
    .getSession({ headers: await headers() })
    .catch(() => null);

  if (!session?.user) return null;
  if (session.user.role !== "admin") return null;

  return {
    id: session.user.id,
    email: session.user.email,
    name: session.user.name,
  };
}
