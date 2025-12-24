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
  Moon,
  Sun,
  ChevronsLeft,
  ChevronsRight,
  User,
  ChevronDown,
  Menu,
  X,
  Brain,
  Film,
  Calendar,
} from "lucide-react";
import { useDashboardTheme } from "./dashboard-theme";
import { logout as apiLogout } from "@/lib/api";
import { useSidebar } from "./DashboardWrapper";

interface NavbarProps {
  userName?: string;
  userEmail?: string;
}

export function Navbar({ userName, userEmail }: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { isDark, toggleTheme, palette } = useDashboardTheme();
  const { isOpen: sidebarOpen, setIsOpen: setSidebarOpen } = useSidebar();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/dashboard/titulky", label: "Titulky", icon: FolderKanban },
    { href: "/dashboard/editor", label: "Video Editor", icon: Film },
    { href: "/dashboard/calendar", label: "Kalendář", icon: Calendar },
    { href: "/dashboard/aicontent", label: "AI Content", icon: Brain },
    { href: "/dashboard/projects", label: "Projekty", icon: FolderKanban },
    {
      href: "/dashboard/instagram-connect",
      label: "Instagram Connect",
      icon: LayoutDashboard,
    },
    { href: "/dashboard/settings", label: "Nastavení", icon: Settings },
  ];
  const exactMatch = navLinks.find((link) => pathname === link.href);
  const nestedMatch =
    exactMatch ||
    navLinks
      .filter((link) => pathname.startsWith(`${link.href}/`))
      .sort((a, b) => b.href.length - a.href.length)[0];
  const currentPageLabel = nestedMatch?.label || "Dashboard";

  // Zavřít mobile menu při změně routy
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    try {
      // Call API logout so the server clears httpOnly session
      await apiLogout();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      // Always clear client tokens
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        document.cookie = "session=; path=/; max-age=0; samesite=lax; secure";
      }
      router.replace("/login");
    }
  };

  return (
    <nav
      className={`backdrop-blur-xl fixed top-0 left-0 right-0 z-[60] ${palette.nav.container}`}
    >
      <div className="w-full px-10 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Page title + sidebar toggle */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label={sidebarOpen ? "Skrýt sidebar" : "Zobrazit sidebar"}
              className={`hidden md:inline-flex items-center justify-center w-9 h-9 rounded-md transition-colors ${
                isDark
                  ? "text-white border-white/15 bg-black/60 hover:bg-white/10"
                  : "text-slate-800 border-slate-200 bg-white/90 hover:bg-slate-100"
              }`}
            >
              {sidebarOpen ? (
                <ChevronsLeft className="w-5 h-5" />
              ) : (
                <ChevronsRight className="w-5 h-5" />
              )}
            </button>
            <span
              className={`text-lg font-semibold ${
                isDark ? "text-white" : "text-slate-900"
              }`}
              style={{
                fontFamily:
                  "var(--font-clash), var(--font-archivo), Arial, Helvetica, sans-serif",
              }}
            >
              {currentPageLabel}
            </span>
          </div>

          {/* Desktop actions */}
          <div className="hidden md:flex items-center">
            <button
              onClick={toggleTheme}
              aria-label="Přepnout vzhled"
              className="relative h-9 w-16 rounded-full border transition-colors duration-300 mr-3 focus:outline-none border-white/10"
            >
              <span className="sr-only">Přepnout vzhled</span>
              <span
                className={`absolute inset-0 rounded-full transition-colors duration-300 ${
                  isDark
                    ? "bg-white/5 border border-white/10"
                    : "bg-white border border-gray-200 shadow-[0_1px_4px_rgba(0,0,0,0.08)]"
                }`}
              />
              <Moon
                className={`absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 transition-opacity duration-300 ${
                  isDark
                    ? "opacity-100 text-amber-200"
                    : "opacity-60 text-slate-500"
                }`}
              />
              <Sun
                className={`absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 transition-opacity duration-300 ${
                  isDark ? "opacity-0" : "opacity-100 text-amber-500"
                }`}
              />
              <span
                className={`absolute top-[3px] left-1 h-7 w-7 rounded-full shadow transition-transform duration-300 ${
                  isDark
                    ? "translate-x-7 bg-white/10 border border-white/15"
                    : "translate-x-0 bg-white border border-slate-200"
                }`}
              />
            </button>
            <Link href="/" className="flex items-center space-x-2 mr-3">
              <span
                className={`text-lg font-bold ${
                  isDark ? "text-white" : "text-slate-900"
                }`}
                style={{
                  fontFamily:
                    "var(--font-clash), var(--font-archivo), Arial, Helvetica, sans-serif",
                }}
              >
                SocialMat
              </span>
            </Link>
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <button
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors focus:outline-none ${
                    isDark
                      ? "text-white hover:bg-white/10"
                      : "text-slate-900 hover:bg-slate-100"
                  } `}
                  aria-label="User menu"
                >
                  <div className="text-right">
                    <p
                      className={`text-sm font-medium ${
                        isDark ? "text-white" : "text-slate-900"
                      }`}
                    >
                      {userName || "Uživatel"}
                    </p>
                    <p
                      className={`text-xs ${
                        isDark ? "text-white/70" : "text-slate-500"
                      }`}
                    >
                      {userEmail || "user@example.com"}
                    </p>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 ${
                      isDark ? "text-white/70" : "text-slate-500"
                    }`}
                  />
                </button>
              </DropdownMenu.Trigger>

              <DropdownMenu.Portal>
                <DropdownMenu.Content
                  className={`min-w-[220px] rounded-lg shadow-lg border p-1 z-50 ${
                    isDark
                      ? "bg-[#0f0f14] text-white border-white/10"
                      : "bg-white text-slate-900 border-slate-200"
                  }`}
                  sideOffset={5}
                  align="end"
                >
                  <DropdownMenu.Item
                    className={`flex items-center gap-2 px-3 py-2 text-sm rounded-md cursor-pointer outline-none ${
                      isDark
                        ? "text-white hover:bg-white/10"
                        : "text-slate-800 hover:bg-slate-100"
                    }`}
                    onSelect={() => router.push("/dashboard/settings")}
                  >
                    <Settings className="w-4 h-4" />
                    Nastavení
                  </DropdownMenu.Item>

                  <DropdownMenu.Separator
                    className={`h-px my-1 ${
                      isDark ? "bg-white/10" : "bg-slate-200"
                    }`}
                  />

                  <DropdownMenu.Item
                    className={`flex items-center gap-2 px-3 py-2 text-sm rounded-md cursor-pointer outline-none ${
                      isDark
                        ? "text-red-300 hover:bg-red-900/30"
                        : "text-red-600 hover:bg-red-50"
                    }`}
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
              className={`p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isDark
                  ? "text-white hover:bg-white/10"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
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
        <div
          className={`md:hidden backdrop-blur-xl border-t ${
            isDark
              ? "border-white/10 bg-black/70"
              : "border-slate-200 bg-white/90"
          }`}
        >
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
                      ? palette.nav.mobileLinkActive
                      : palette.nav.mobileLink
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {link.label}
                </Link>
              );
            })}

            <div
              className={`pt-3 mt-3 border-t ${
                isDark ? "border-white/10" : "border-slate-200"
              }`}
            >
              <div className="flex items-center gap-3 px-3 py-2 mb-2">
                <div>
                  <p
                    className={`text-sm font-medium ${
                      isDark ? "text-white" : "text-slate-900"
                    }`}
                  >
                    {userName || "Uživatel"}
                  </p>
                  <p
                    className={`text-xs ${
                      isDark ? "text-white/70" : "text-slate-500"
                    }`}
                  >
                    {userEmail || "user@example.com"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 px-3 py-2 mb-2">
                <button
                  onClick={toggleTheme}
                  aria-label="Přepnout vzhled"
                  className={`relative h-9 w-16 rounded-full border transition-all duration-300 ${palette.nav.toggleBase}`}
                >
                  <span className="sr-only">Přepnout vzhled</span>
                  <span
                    className={`absolute top-1 left-1 h-7 w-7 rounded-full transition-all duration-300 ${palette.nav.toggleThumb}`}
                  />
                </button>
              </div>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isDark
                    ? "text-red-300 hover:bg-red-900/30"
                    : "text-red-600 hover:bg-red-50"
                }`}
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
