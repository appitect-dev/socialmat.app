"use client";

import { useDashboardTheme } from "@/components/dashboard-theme";

export default function AIContentPage() {
  const { palette, isDark } = useDashboardTheme();

  return (
    <div
      className={`relative min-h-screen ${
        isDark ? "bg-black text-white" : palette.page
      }`}
    >
      {!isDark && (
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(99,102,241,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.35) 1px, transparent 1px)",
            backgroundSize: "120px 120px",
          }}
        />
      )}
      <div
        className="absolute -top-1/2 left-1/2 -translate-x-1/2 w-[140%] h-[120%] rounded-full blur-[160px] opacity-70 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 50% 40%, rgba(79,70,229,0.22), rgba(14,165,233,0.08), transparent 60%)",
        }}
      />
      <div className="max-w-6xl mx-auto px-4 py-12 relative">
        <div className="mb-10 text-center space-y-3">
          <h1
            className={`text-3xl font-bold ${
              isDark ? "text-white" : "text-slate-900"
            }`}
          >
            AI Content
          </h1>
          <p className={isDark ? "text-white/70" : "text-slate-600"}></p>
        </div>
      </div>
    </div>
  );
}
