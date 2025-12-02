"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import {
  LayoutDashboard,
  FolderKanban,
  Settings,
  LogOut,
  User,
  ChevronDown,
  Menu,
  X,
} from "lucide-react";

interface NavbarProps {
  userName?: string;
  userEmail?: string;
}

export function Navbar({ userName, userEmail }: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/dashboard/projects", label: "Projekty", icon: FolderKanban },
    { href: "/dashboard/settings", label: "Nastavení", icon: Settings },
  ];

  // Zavřít mobile menu při změně routy
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    try {
      // Volání logout Server Action
      const { logout } = await import("@/app/actions/auth");
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
      // Fallback - přesměruj na homepage i když logout selhal
      router.push("/");
    }
  };

  return (
    <nav className="backdrop-blur-xl bg-black order-b border-white/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo a navigace */}
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-2">
              <span
                className="text-xl font-bold text-white"
                style={{
                  fontFamily:
                    "var(--font-clash), var(--font-archivo), Arial, Helvetica, sans-serif",
                }}
              >
                SocialMat
              </span>
            </Link>

            {/* Desktop navigace */}
            <div className="hidden md:flex items-center space-x-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-body transition-colors ${
                      isActive
                        ? "bg-white/20 text-white"
                        : "text-gray-300 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Desktop user menu */}
          <div className="hidden md:flex items-center">
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <button
                  className="flex items-center space-x-3 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-[#FAE12A] focus:ring-offset-2 focus:ring-offset-black"
                  aria-label="User menu"
                >
                  <div className="text-right">
                    <p className="text-sm font-medium text-white">
                      {userName || "Uživatel"}
                    </p>
                    <p className="text-xs text-white/70">
                      {userEmail || "user@example.com"}
                    </p>
                  </div>
                  <ChevronDown className="w-4 h-4 text-white/70" />
                </button>
              </DropdownMenu.Trigger>

              <DropdownMenu.Portal>
                <DropdownMenu.Content
                  className="min-w-[220px] bg-[#0f0f14] text-white rounded-lg shadow-lg border border-white/10 p-1 z-50"
                  sideOffset={5}
                  align="end"
                >
                  <DropdownMenu.Item
                    className="flex items-center gap-2 px-3 py-2 text-sm text-white hover:bg-white/10 rounded-md cursor-pointer outline-none"
                    onSelect={() => router.push("/dashboard/settings")}
                  >
                    <Settings className="w-4 h-4" />
                    Nastavení
                  </DropdownMenu.Item>

                  <DropdownMenu.Separator className="h-px bg-white/10 my-1" />

                  <DropdownMenu.Item
                    className="flex items-center gap-2 px-3 py-2 text-sm text-red-300 hover:bg-red-900/30 rounded-md cursor-pointer outline-none"
                    onSelect={handleLogout}
                  >
                    <LogOut className="w-4 h-4" />
                    Odhlásit se
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label={mobileMenuOpen ? "Zavřít menu" : "Otevřít menu"}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/20 backdrop-blur-xl bg-white/10">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-body transition-colors ${
                    isActive
                      ? "bg-white/20 text-white"
                      : "text-gray-300 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {link.label}
                </Link>
              );
            })}

            <div className="pt-3 mt-3 border-t border-gray-200">
            <div className="flex items-center gap-3 px-3 py-2 mb-2">
              <div>
                <p className="text-sm font-medium text-white">
                  {userName || "Uživatel"}
                </p>
                <p className="text-xs text-white/70">
                  {userEmail || "user@example.com"}
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleLogout();
              }}
              className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm font-medium text-red-300 hover:bg-red-900/30"
            >
              <LogOut className="w-5 h-5" />
              Odhlásit se
            </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
