"use client";

import { ProjectsPanel } from "@/components/ProjectsPanel";
import { useDashboardTheme } from "@/components/dashboard-theme";

export default function ProjectsPage() {
  const { palette, isDark } = useDashboardTheme();

  return (
    <div className={`relative min-h-screen ${palette.page}`}>
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(99,102,241,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.35) 1px, transparent 1px)",
          backgroundSize: "120px 120px",
        }}
      />
      <div className="max-w-6xl mx-auto px-4 py-12 relative">
        <div className="mb-10 text-center space-y-3">
          <h1
            className={`text-4xl font-bold ${
              isDark ? "text-white" : "text-slate-900"
            }`}
          >
            Titulky
          </h1>
          <p
            className={`text-lg ${isDark ? "text-white/75" : "text-slate-600"}`}
          >
            Tvorte, zobrazte a spravujte svoje titulky a jejich zpracování.
          </p>
        </div>
        <ProjectsPanel />
      </div>
    </div>
  );
}
