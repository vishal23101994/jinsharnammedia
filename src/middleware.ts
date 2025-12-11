// middleware.ts
import { getToken } from "next-auth/jwt";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Middleware that:
 * 1) maps requests for jinsharnamtirth.com -> /jinsharnam-tirth...
 * 2) applies admin route protection based on the effective path
 */
export async function middleware(req: NextRequest) {
  const host = req.headers.get("host") ?? "";
  const { pathname } = req.nextUrl;

  // Compute effectivePath: what path the request *should* be handled as,
  // after accounting for domain-based mapping.
  let effectivePath = pathname;

  if (host === "jinsharnamtirth.com" || host === "www.jinsharnamtirth.com") {
    if (pathname === "/") {
      effectivePath = "/jinsharnam-tirth";
    } else {
      effectivePath = `/jinsharnam-tirth${pathname}`;
    }
  }

  // ADMIN protection: check effectivePath for /admin
  if (effectivePath.startsWith("/admin")) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    // Not logged in → redirect to login
    if (!token) {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }

    // Logged in but not an admin → redirect to home
    if (token.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  // If host requires rewrite, perform it (keeping the browser host same)
  if (host === "jinsharnamtirth.com" || host === "www.jinsharnamtirth.com") {
    const url = req.nextUrl.clone();
    // set url.pathname to the effectivePath we computed
    url.pathname = effectivePath;
    return NextResponse.rewrite(url);
  }

  // Otherwise continue normally
  return NextResponse.next();
}

/**
 * Apply middleware broadly so rewrite and admin protection will work.
 * Exclude Next.js static resources from matcher.
 */
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)",
    "/",
  ],
};
