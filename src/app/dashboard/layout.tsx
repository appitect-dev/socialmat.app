import { Navbar } from "@/components/Navbar";
import { getUser } from "@/lib/dal";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Získej aktuálního přihlášeného uživatele
  const user = await getUser();

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
