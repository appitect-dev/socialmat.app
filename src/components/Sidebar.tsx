"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderKanban,
  Settings,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { useDashboardTheme } from "./dashboard-theme";
import { useSidebar } from "./DashboardWrapper";

const navLinks = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/projects", label: "Titulky", icon: FolderKanban },
  { href: "/dashboard/settings", label: "Nastavení", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { isDark } = useDashboardTheme();
  const { isOpen, setIsOpen } = useSidebar();

  const sidebarWidth = "w-64";
  const sidebarBg = isDark ? "bg-black/70" : "bg-white";
  const sidebarChrome = isOpen
    ? isDark
      ? "border-r border-white/10 shadow-[2px_0_20px_rgba(0,0,0,0.3)]"
      : "border-r border-slate-200 shadow-[2px_0_20px_rgba(15,23,42,0.08)]"
    : "border-r border-transparent shadow-none";
  const linkHover = isDark ? "hover:bg-white/10" : "hover:bg-slate-100";
  const linkActive = isDark
    ? "bg-white/10 text-white"
    : "bg-slate-100 text-slate-900";
  const linkInactive = isDark ? "text-white/80" : "text-slate-600";

  return (
    <aside
      className={`${sidebarWidth} ${sidebarBg} ${sidebarChrome} overflow-hidden backdrop-blur-xl fixed left-0 top-0 h-screen z-40 transition-transform duration-300 ease-in-out hidden md:flex flex-col ${
        isOpen ? "translate-x-0" : "-translate-x-full pointer-events-none"
      }`}
    >
      {/* Logo + toggle */}
      <div className="flex items-center h-16 border-inherit pl-6 pr-6 gap-3">
        {isOpen ? (
          <Link href="/" className="flex items-center space-x-2">
            <span
              className={`text-xl font-bold transition-opacity duration-200 ${
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
        ) : null}
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Skrýt sidebar" : "Zobrazit sidebar"}
          className={`inline-flex items-center justify-center w-9 h-9 rounded-md  transition-colors ml-auto ${
            isDark
              ? "text-white border-white/15 bg-black/50 hover:bg-white/10"
              : "text-slate-800 border-slate-200 bg-white/90 hover:bg-slate-100"
          }`}
        >
          {isOpen ? (
            <ChevronsLeft className="w-5 h-5" />
          ) : (
            <ChevronsRight className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Navigation Links */}
      <nav
        className={`flex-1 px-6 py-4 space-y-1 overflow-y-auto transition-opacity duration-200 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive ? linkActive : linkInactive
              } ${linkHover} ${
                isOpen ? "justify-start gap-3" : "justify-center gap-2"
              }`}
              title={!isOpen ? link.label : undefined}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {isOpen && (
                <span className="transition-opacity duration-200 whitespace-nowrap">
                  {link.label}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
