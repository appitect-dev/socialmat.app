"use client";

import { useState, useEffect, createContext, useContext } from "react";
import { Sidebar } from "./Sidebar";
import { useDashboardTheme } from "./dashboard-theme";

const SIDEBAR_STORAGE_KEY = "dashboard-sidebar-open";

type SidebarContextType = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
};

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within DashboardWrapper");
  }
  return context;
}

export function DashboardWrapper({ children }: { children: React.ReactNode }) {
  const { isDark } = useDashboardTheme();
  const [isOpen, setIsOpen] = useState(true);

  // Load sidebar state from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(SIDEBAR_STORAGE_KEY);
    if (stored !== null) {
      setIsOpen(stored === "true");
    }
  }, []);

  // Save sidebar state to localStorage
  useEffect(() => {
    localStorage.setItem(SIDEBAR_STORAGE_KEY, String(isOpen));
  }, [isOpen]);

  const sidebarWidth = isOpen ? "md:pl-64" : "md:pl-0";
  const contentTransition = "transition-[padding] duration-300 ease-in-out";

  const wrapperBg = isDark ? "bg-black" : "bg-white";

  return (
    <SidebarContext.Provider value={{ isOpen, setIsOpen }}>
      <div className={`${wrapperBg} min-h-screen relative`}>
        <Sidebar />
        <div className={`${sidebarWidth} ${contentTransition} pt-16`}>
          {children}
        </div>
      </div>
    </SidebarContext.Provider>
  );
}
