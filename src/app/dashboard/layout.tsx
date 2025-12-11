import { cookies } from "next/headers";
import { Navbar } from "@/components/Navbar";
import { DashboardThemeProvider } from "@/components/dashboard-theme";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const rawSession = cookieStore.get("session")?.value;

  const parseSession = (
    value?: string
  ): { email?: string; firstName?: string; lastName?: string; token?: string } | null => {
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

  if (!session?.token) {
    redirect("/login");
  }

  const displayName =
    [session.firstName, session.lastName].filter(Boolean).join(" ") ||
    session.email ||
    "Uživatel";

  return (
    <DashboardThemeProvider>
      <Navbar userName={displayName} userEmail={session.email} />
      {children}
    </DashboardThemeProvider>
  );
}
