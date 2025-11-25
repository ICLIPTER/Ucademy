// middleware.ts
import { NextRequest, NextResponse } from "next/server";

export const config = {
  matcher: ["/admin/:path*", "/api/auth/sign-up"],
};

export default function middleware(req: NextRequest) {
  const sessionCookie = req.cookies.get("session"); // simple check
  if (!sessionCookie && req.nextUrl.pathname.startsWith("/admin")) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Light bot detection (Arcjet)
  // Only import detectBot directly, not the whole protectSignup API
  return NextResponse.next();
}
