import { getSessionCookie } from "better-auth/cookies";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Edge middleware.
 *
 * Responsibilities (deliberately minimal — every millisecond here is added
 * to every page load):
 *
 *  1. Cheap, cookie-presence based redirect for private areas. This is a
 *     UX convenience, NOT a security boundary; the real authorisation is
 *     enforced in the data layer (`requireUser` / `requireAdmin`), which
 *     validates the session server-side.
 *  2. Security headers for the static marketing pages.
 *
 * The previous implementation called a third-party bot-management API on
 * every single request, which added a full network round-trip to the
 * critical path of every page view and required a paid plan to run in
 * production.
 */

const PROTECTED_PREFIXES = ["/dashboard", "/admin"];

const AUTH_ROUTES = ["/login", "/verify-request"];

export const config = {
  matcher: [
    /*
     * Everything except:
     *  - static assets / images / favicon
     *  - the auth + webhook API routes (they do their own guarding)
     *  - files with an extension (e.g. /logo.png, /robots.txt)
     */
    "/((?!_next/static|_next/image|favicon.ico|icon.svg|manifest.webmanifest|robots.txt|sitemap.xml|api/auth|api/webhook|api/s3|.*\\.[\\w]+$).*)",
  ],
};

function hasSessionCookie(request: NextRequest): boolean {
  try {
    return Boolean(getSessionCookie(request));
  } catch {
    return false;
  }
}

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  const isProtected = PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );

  if (isProtected && !hasSessionCookie(request)) {
    const loginUrl = new URL("/login", request.url);
    // Preserve the destination so the user lands where they intended.
    loginUrl.searchParams.set("callbackUrl", `${pathname}${search}`);
    return NextResponse.redirect(loginUrl);
  }

  // Signed-in users have no reason to see the auth screens.
  if (AUTH_ROUTES.some((route) => pathname === route) && hasSessionCookie(request)) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}
