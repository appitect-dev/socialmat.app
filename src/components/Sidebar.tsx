"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderKanban,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useDashboardTheme } from "./dashboard-theme";
import { useSidebar } from "./DashboardWrapper";

const navLinks = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/projects", label: "Projekty", icon: FolderKanban },
  { href: "/dashboard/settings", label: "Nastavení", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { isDark } = useDashboardTheme();
  const { isOpen, setIsOpen } = useSidebar();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const sidebarWidth = isOpen ? "w-64" : "w-16";
  const sidebarBg = isDark
    ? "bg-black/70 border-r border-white/10 shadow-[2px_0_20px_rgba(0,0,0,0.3)]"
    : "bg-white border-r border-slate-200 shadow-[2px_0_20px_rgba(15,23,42,0.08)]";
  const linkHover = isDark ? "hover:bg-white/10" : "hover:bg-slate-100";
  const linkActive = isDark
    ? "bg-white/10 text-white"
    : "bg-slate-100 text-slate-900";
  const linkInactive = isDark ? "text-white/80" : "text-slate-600";

  return (
    <aside
      className={`${sidebarWidth} ${sidebarBg} backdrop-blur-xl fixed left-0 top-0 h-screen z-40 transition-all duration-300 ease-in-out hidden md:flex flex-col`}
    >
      {/* Logo and Toggle */}
      <div
        className={`flex items-center h-16 border-b border-inherit ${
          isOpen ? "justify-between px-4" : "justify-center px-2"
        }`}
      >
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
          onClick={toggleSidebar}
          className={`p-2 rounded-lg transition-colors ${linkHover}`}
          aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
        >
          {isOpen ? (
            <ChevronLeft
              className={`w-5 h-5 ${
                isDark ? "text-white/80" : "text-slate-600"
              }`}
            />
          ) : (
            <ChevronRight
              className={`w-5 h-5 ${
                isDark ? "text-white/80" : "text-slate-600"
              }`}
            />
          )}
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => {
                // #region agent log
                fetch(
                  "http://127.0.0.1:7242/ingest/95f1db15-3356-46ec-ac70-bd4736c3da51",
                  {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      location: "Sidebar.tsx:93",
                      message: "Sidebar link clicked",
                      data: { href: link.href, currentPath: pathname },
                      timestamp: Date.now(),
                      sessionId: "debug-session",
                      runId: "run1",
                      hypothesisId: "E",
                    }),
                  }
                ).catch(() => {});
                // #endregion
              }}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive ? linkActive : linkInactive
              } ${linkHover} ${isOpen ? "justify-start" : "justify-center"}`}
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
