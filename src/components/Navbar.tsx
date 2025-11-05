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
    <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo a navigace */}
          <div className="flex items-center space-x-8">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <span className="text-xl font-bold text-gray-900">SocialMat</span>
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
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-gray-100 text-gray-900"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
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
                  className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  aria-label="User menu"
                >
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {userName || "Uživatel"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {userEmail || "user@example.com"}
                    </p>
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </button>
              </DropdownMenu.Trigger>

              <DropdownMenu.Portal>
                <DropdownMenu.Content
                  className="min-w-[220px] bg-white rounded-lg shadow-lg border border-gray-200 p-1 z-50"
                  sideOffset={5}
                  align="end"
                >
                  <DropdownMenu.Item
                    className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md cursor-pointer outline-none"
                    onSelect={() => router.push("/dashboard/settings")}
                  >
                    <Settings className="w-4 h-4" />
                    Nastavení
                  </DropdownMenu.Item>

                  <DropdownMenu.Separator className="h-px bg-gray-200 my-1" />

                  <DropdownMenu.Item
                    className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md cursor-pointer outline-none"
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
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-gray-100 text-gray-900"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
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
                  <p className="text-sm font-medium text-gray-900">
                    {userName || "Uživatel"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {userEmail || "user@example.com"}
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50"
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
