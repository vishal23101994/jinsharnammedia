// middleware.ts
import { getToken } from "next-auth/jwt";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const host = req.headers.get("host") ?? "";
  const { pathname } = req.nextUrl;

  // Compute effectivePath: what path the request *should* be handled as,
  // after accounting for domain-based mapping.
  let effectivePath = pathname;

  // .com mapping (you already had this)
  if (host === "jinsharnamtirth.com" || host === "www.jinsharnamtirth.com") {
    effectivePath = pathname === "/" ? "/jinsharnam-tirth" : `/jinsharnam-tirth${pathname}`;
  }

  // .in mapping: rewrite jinsharnamtirth.in -> /organization/jinsharnam-tirth
  if (host === "jinsharnamtirth.in" || host === "www.jinsharnamtirth.in") {
    effectivePath = pathname === "/" ? "/organization/jinsharnam-tirth" : `/organization/jinsharnam-tirth${pathname}`;
  }

  // ADMIN protection uses the effectivePath
  if (effectivePath.startsWith("/admin")) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) return NextResponse.redirect(new URL("/auth/login", req.url));
    if (token.role !== "ADMIN") return NextResponse.redirect(new URL("/", req.url));
  }

  // If host is .com or .in, rewrite to the effective path (keeps browser host same)
  if (
    host === "jinsharnamtirth.com" ||
    host === "www.jinsharnamtirth.com" ||
    host === "jinsharnamtirth.in" ||
    host === "www.jinsharnamtirth.in"
  ) {
    const url = req.nextUrl.clone();
    url.pathname = effectivePath;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)",
    "/",
  ],
};
