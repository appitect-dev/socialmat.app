/**
 * Auth middleware – protects dashboard routes and expires stale sessions.
 *
 * Runs on every request (except POST) and will:
 * - Redirect unauthenticated users away from protected routes.
 * - Redirect logged-in users away from public auth routes.
 * - Drop expired tokens based on JWT `exp`.
 */
import { NextRequest, NextResponse } from "next/server";

const protectedRoutes = ["/dashboard"];
const publicRoutes = ["/", "/login", "/signup"];
const SESSION_COOKIE = "session";

const parseSession = (
  value?: string
): { token?: string; refreshToken?: string; userId?: string } | null => {
  if (!value) return null;
  const candidates = [value];
  try {
    candidates.push(decodeURIComponent(value));
  } catch {
    // ignore decode failure
  }
  for (const candidate of candidates) {
    try {
      return JSON.parse(candidate);
    } catch {
      // try next variant
    }
  }
  return null;
};

const getJwtExpiry = (token?: string): number | null => {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length < 2) return null;
  try {
    const payload = JSON.parse(
      Buffer.from(parts[1], "base64").toString("utf8")
    ) as { exp?: number };
    return typeof payload.exp === "number" ? payload.exp * 1000 : null;
  } catch {
    return null;
  }
};

const clearSessionCookie = (res: NextResponse) => {
  res.cookies.set(SESSION_COOKIE, "", {
    path: "/",
    maxAge: 0,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
};

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // Skip middleware for POST (server actions) to avoid interfering
  if (req.method === "POST") {
    return NextResponse.next();
  }

  const isProtectedRoute = protectedRoutes.some((route) =>
    path.startsWith(route)
  );
  const isPublicRoute = publicRoutes.includes(path);

  const rawSession = req.cookies.get(SESSION_COOKIE)?.value;
  const session = parseSession(rawSession);
  const tokenExpiry = session?.token ? getJwtExpiry(session.token) : null;
  // Treat undecodable/missing exp as expired only when a token exists
  const isExpired =
    session?.token && tokenExpiry !== null
      ? Date.now() >= tokenExpiry
      : session?.token
      ? true
      : false;

  // If session is expired, clear it
  if (session?.token && isExpired) {
    const res = NextResponse.redirect(new URL("/login", req.nextUrl));
    clearSessionCookie(res);
    return res;
  }

  // Protected route without valid session -> login
  if (isProtectedRoute && !session?.token) {
    const res = NextResponse.redirect(new URL("/login", req.nextUrl));
    clearSessionCookie(res);
    return res;
  }

  // Public auth routes when already logged in -> dashboard
  if (isPublicRoute && session?.token && !path.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
  }

  const res = NextResponse.next();
  // If session is missing, ensure cookie cleared
  if (!session?.token && rawSession) {
    clearSessionCookie(res);
  }
  return res;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
