"use client";

import { useState, useEffect, createContext, useContext } from "react";
import { Sidebar } from "./Sidebar";

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

  const sidebarWidth = isOpen ? "md:pl-64" : "md:pl-16";

  return (
    <SidebarContext.Provider value={{ isOpen, setIsOpen }}>
      <Sidebar />
      <div className={`${sidebarWidth} transition-all duration-300`}>
        {children}
      </div>
    </SidebarContext.Provider>
  );
}
