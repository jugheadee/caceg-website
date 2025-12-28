import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { adminAuth } from "@/lib/firebaseAdmin";

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Allow public routes
  if (
    pathname === "/admin/session-expired" ||
    pathname.startsWith("/admin/login") ||
    pathname.startsWith("/_next") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Protect /admin routes
  if (pathname.startsWith("/admin")) {
    const sessionCookie = request.cookies.get("session")?.value;

    if (!sessionCookie) {
      return NextResponse.redirect(
        new URL("/admin/session-expired", request.url)
      );
    }

    try {
      await adminAuth.verifySessionCookie(sessionCookie);
      return NextResponse.next();
    } catch (error) {
      // Expired or invalid → session expired page
      return NextResponse.redirect(
        new URL("/admin/session-expired", request.url)
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/admin/:path*",
};
