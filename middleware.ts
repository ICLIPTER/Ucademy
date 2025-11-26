import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export const config = {
  matcher: ["/admin/:path*"],
};

export function middleware(request: NextRequest) {
  const session = getSessionCookie(request);

  if (!session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}
