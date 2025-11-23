import { cookies } from "next/headers";
import { Navbar } from "@/components/Navbar";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const rawSession = cookieStore.get("session")?.value;
  let user:
    | { email?: string; firstName?: string; lastName?: string }
    | null = null;

  if (rawSession) {
    try {
      const parsed = JSON.parse(rawSession);
      user = {
        email: parsed.email,
        firstName: parsed.firstName,
        lastName: parsed.lastName,
      };
    } catch (e) {
      user = null;
    }
  }

  // Pokud uživatel není přihlášený, přesměruj na login
  // (double check - middleware už by měl zachytit, ale pro jistotu)
  if (!user) {
    redirect("/login");
  }

  const displayName =
    [user.firstName, user.lastName].filter(Boolean).join(" ") || user.email;

  return (
    <>
      <Navbar userName={displayName} userEmail={user.email} />
      {children}
    </>
  );
}
