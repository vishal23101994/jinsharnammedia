import { getToken } from "next-auth/jwt";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Middleware to protect admin routes
 */
export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  // ✅ Protect all /admin routes
  if (pathname.startsWith("/admin")) {
    // Not logged in → redirect to login
    if (!token) {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }

    // Logged in but not an admin → redirect to home
    if (token.role !== "ADMIN") {  // ✅ FIXED here
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  // ✅ Allow all other routes
  return NextResponse.next();
}

/**
 * Apply this middleware only to /admin paths
 */
export const config = {
  matcher: ["/admin/:path*"],
};
