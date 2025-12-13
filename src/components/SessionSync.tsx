"use client";

import { useEffect } from "react";

type SessionData = {
  token?: string;
  refreshToken?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
};

const getJwtExpiry = (token?: string): number | null => {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length < 2) return null;
  try {
    const payload = JSON.parse(
      atob(parts[1].replace(/-/g, "+").replace(/_/g, "/"))
    ) as { exp?: number };
    return typeof payload.exp === "number" ? payload.exp * 1000 : null;
  } catch {
    return null;
  }
};

const clearClientSession = () => {
  document.cookie = "session=; path=/; max-age=0; samesite=lax";
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
};

/**
 * Keeps the client-side cookie and localStorage in sync with the server session
 * so client-side API calls always include the Authorization header.
 */
export function SessionSync({ session }: { session?: SessionData | null }) {
  useEffect(() => {
    if (!session?.token) return;

    const exp = getJwtExpiry(session.token);
    if (exp === null || Date.now() >= exp) {
      clearClientSession();
      return;
    }

    const value = encodeURIComponent(JSON.stringify(session));
    document.cookie = `session=${value}; path=/; max-age=604800; samesite=lax`;
    localStorage.setItem("token", session.token);

    if (session.refreshToken) {
      localStorage.setItem("refreshToken", session.refreshToken);
    }
  }, [session?.token, session?.refreshToken, session?.email]);

  return null;
}
