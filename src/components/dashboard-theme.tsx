"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

type DashboardTheme = "light" | "dark";

type DashboardThemeContextValue = {
  theme: DashboardTheme;
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (theme: DashboardTheme) => void;
  palette: {
    page: string;
    card: string;
    softCard: string;
    muted: string;
    subtle: string;
    border: string;
    accentButton: string;
    accentButtonHover: string;
    nav: {
      container: string;
      link: string;
      linkActive: string;
      userButton: string;
      mobileLink: string;
      mobileLinkActive: string;
      toggleBase: string;
      toggleThumb: string;
    };
  };
};

const DashboardThemeContext = createContext<
  DashboardThemeContextValue | undefined
>(undefined);

const getInitialTheme = (): DashboardTheme => {
  if (typeof window === "undefined") return "light";

  const storedDashboard = localStorage.getItem("dashboard-theme");
  const storedLanding = localStorage.getItem("landing-theme");

  if (storedDashboard === "dark" || storedDashboard === "light") {
    return storedDashboard;
  }
  if (storedLanding === "dark" || storedLanding === "light") {
    return storedLanding;
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

export function DashboardThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [theme, setTheme] = useState<DashboardTheme>(getInitialTheme);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // Align with client preference immediately after hydration to avoid flash
    setTheme(getInitialTheme());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined" && theme) {
      localStorage.setItem("dashboard-theme", theme);
      localStorage.setItem("landing-theme", theme);
    }
  }, [theme]);

  const toggleTheme = () =>
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));

  const palette = useMemo(() => {
    const isDark = theme === "dark";

    return {
      page: isDark
        ? "bg-gradient-to-b from-black via-[#0f0f0f] to-black text-white"
        : "bg-gradient-to-b from-white via-slate-50 to-white text-slate-900",
      card: isDark
        ? "bg-[#0f0f14] border border-white/10 text-white shadow-[0_18px_60px_rgba(0,0,0,0.35)]"
        : "bg-white border border-slate-200 text-slate-900 shadow-[0_18px_60px_rgba(79,70,229,0.12)]",
      softCard: isDark
        ? "bg-white/5 border border-white/10"
        : "bg-slate-50 border border-slate-200",
      muted: isDark ? "text-white/70" : "text-slate-600",
      subtle: isDark ? "text-white/50" : "text-slate-500",
      border: isDark ? "border-white/10" : "border-slate-200",
      accentButton:
        "bg-gradient-to-r from-indigo-600 to-blue-500 text-white shadow-lg shadow-indigo-500/20",
      accentButtonHover:
        "hover:from-indigo-500 hover:to-sky-500 hover:shadow-indigo-500/35",
      nav: {
        container: isDark
          ? "bg-black/70 border-b border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.45)]"
          : "bg-white border-b border-slate-200 shadow-[0_12px_40px_rgba(15,23,42,0.08)]",
        link: isDark
          ? "text-white/80 hover:text-white"
          : "text-slate-600 hover:text-slate-900",
        linkActive: isDark
          ? "bg-white/10 text-white"
          : "bg-slate-100 text-slate-900",
        userButton: isDark
          ? "bg-white/5 hover:bg-white/10 text-white"
          : "bg-slate-100 hover:bg-slate-200 text-slate-900",
        mobileLink: isDark
          ? "text-gray-200 hover:text-white hover:bg-white/10"
          : "text-slate-700 hover:text-slate-900 hover:bg-slate-100",
        mobileLinkActive: isDark
          ? "bg-white/15 text-white"
          : "bg-slate-100 text-slate-900",
        toggleBase: isDark
          ? "bg-slate-900/80 border-white/10"
          : "bg-white border-slate-200",
        toggleThumb: isDark
          ? "translate-x-6 bg-gradient-to-r from-indigo-500 to-blue-500 shadow-lg shadow-indigo-500/25"
          : "translate-x-0 bg-slate-200 shadow",
      },
    };
  }, [theme]);

  return (
    <DashboardThemeContext.Provider
      value={{
        theme,
        isDark: theme === "dark",
        toggleTheme,
        setTheme,
        palette,
      }}
    >
      {hydrated ? children : <div className="min-h-screen bg-white" />}
    </DashboardThemeContext.Provider>
  );
}

export function useDashboardTheme() {
  const ctx = useContext(DashboardThemeContext);
  if (!ctx) {
    throw new Error(
      "useDashboardTheme must be used within a DashboardThemeProvider"
    );
  }
  return ctx;
}
