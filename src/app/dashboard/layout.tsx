import { cookies } from "next/headers";
import { Navbar } from "@/components/Navbar";
import { SessionSync } from "@/components/SessionSync";
import { DashboardWrapper } from "@/components/DashboardWrapper";
import { DashboardThemeProvider } from "@/components/dashboard-theme";
import { redirect } from "next/navigation";

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

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const rawSession = cookieStore.get("session")?.value;

  const parseSession = (
    value?: string
  ): {
    email?: string;
    firstName?: string;
    lastName?: string;
    token?: string;
    refreshToken?: string;
  } | null => {
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

  const session = parseSession(rawSession);

  const tokenExpiry = getJwtExpiry(session?.token);
  const isExpired = tokenExpiry === null || Date.now() >= tokenExpiry;

  if (!session?.token || isExpired) {
    redirect("/login");
  }

  const displayName =
    [session.firstName, session.lastName].filter(Boolean).join(" ") ||
    session.email ||
    "Uživatel";

  return (
    <DashboardThemeProvider>
      <SessionSync session={session} />
      <DashboardWrapper>
        <Navbar userName={displayName} userEmail={session.email} />
        {children}
      </DashboardWrapper>
    </DashboardThemeProvider>
  );
}
