"use client";

/**
 * LOGIN STRÁNKA
 *
 * Formulář pro přihlášení uživatele
 * Používá React Hook Form pro validaci a useActionState pro Server Actions
 */

import { useActionState, useEffect, useState } from "react";
import { login } from "@/app/actions/auth";
import Link from "next/link";
import { LogIn } from "lucide-react";

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(login, null);
  const [theme, setTheme] = useState<"light" | "dark" | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const savedTheme = localStorage.getItem("landing-theme");
    if (savedTheme === "dark" || savedTheme === "light") {
      setTheme(savedTheme);
      return;
    }
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setTheme("dark");
      return;
    }
    setTheme("light");
  }, []);

  const isDark = (theme ?? "light") === "dark";

  const palette = {
    page: isDark
      ? "bg-[#05050a] text-white"
      : "bg-gradient-to-br from-white via-slate-50 to-blue-50 text-slate-900",
    card: isDark
      ? "bg-white/5 border border-white/10"
      : "bg-white border border-slate-200 shadow-xl",
    label: isDark ? "text-white/70" : "text-slate-600",
    input: isDark
      ? "bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:ring-indigo-400/50 focus:border-indigo-300/80"
      : "bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:ring-indigo-300/60 focus:border-indigo-400",
    supporting: isDark ? "text-white/70" : "text-slate-600",
    accentText: isDark ? "text-indigo-300 hover:text-indigo-200" : "text-indigo-600 hover:text-indigo-500",
    accentButton:
      "bg-gradient-to-r from-indigo-500 to-sky-500 text-white hover:from-indigo-400 hover:to-sky-400",
    errorBox: isDark
      ? "bg-red-500/10 border-red-500/40 text-red-100"
      : "bg-red-50 border-red-200 text-red-700",
    errorText: isDark ? "text-red-300" : "text-red-600",
    mutedLink: isDark ? "text-white/60 hover:text-white" : "text-slate-500 hover:text-slate-800",
  } as const;

  const gridColor = isDark ? "rgba(255,255,255,0.06)" : "rgba(15,23,42,0.06)";

  // Avoid flicker by only rendering once theme is resolved
  if (theme === null) {
    return (
      <div className="min-h-screen bg-white" aria-hidden />
    );
  }

  return (
    <div className={`min-h-screen relative overflow-hidden ${palette.page}`}>
      <div className="absolute inset-0 pointer-events-none">
        <div
          className={
            isDark
              ? "absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-sky-500/5"
              : "absolute inset-0 bg-gradient-to-br from-indigo-100 via-white to-sky-50"
          }
        />
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage: `linear-gradient(${gridColor} 1px, transparent 1px), linear-gradient(90deg, ${gridColor} 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(79,70,229,0.16),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(14,165,233,0.12),transparent_30%)]" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-16 flex flex-col items-center text-center gap-8">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight">
            Vítejte zpět v <span className="text-indigo-400">SocialMat</span>
          </h1>
          <p className={`${palette.supporting} max-w-xl mx-auto`}>
            Přihlaste se a pokračujte v tvorbě titulků
          </p>
        </div>

        <div className="w-full max-w-md">
          <div className={`${palette.card} rounded-3xl shadow-2xl p-8 backdrop-blur`}>
            <form action={formAction} className="space-y-6">
              {/* Globální error message */}
              {state?.message && (
                <div className={`${palette.errorBox} px-4 py-3 rounded-lg text-sm border`}>
                  {state.message}
                </div>
              )}

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className={`block text-sm font-medium mb-2 ${palette.label}`}
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className={`w-full px-4 py-3 rounded-full focus:ring-2 outline-none transition-all ${palette.input}`}
                  placeholder="vas@email.cz"
                />
                {state?.errors?.email && (
                  <p className={`mt-1 text-sm ${palette.errorText}`}>
                    {state.errors.email[0]}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className={`block text-sm font-medium mb-2 ${palette.label}`}
                >
                  Heslo
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  required
                  className={`w-full px-4 py-3 rounded-full focus:ring-2 outline-none transition-all ${palette.input}`}
                  placeholder="••••••••"
                />
                {state?.errors?.password && (
                  <p className={`mt-1 text-sm ${palette.errorText}`}>
                    {state.errors.password[0]}
                  </p>
                )}
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={isPending}
                className={`w-full py-3 px-4 rounded-full font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/25 ${palette.accentButton}`}
              >
                {isPending ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Přihlašuji...
                  </>
                ) : (
                  <>
                    <LogIn className="w-5 h-5" />
                    Přihlásit se
                  </>
                )}
              </button>
            </form>

            {/* Link na registraci */}
            <div className="mt-6 text-center">
              <p className={`text-sm ${palette.supporting}`}>
                Ještě nemáte účet?{" "}
                <Link
                  href="/signup"
                  className={`${palette.accentText} font-semibold`}
                >
                  Zaregistrovat se
                </Link>
              </p>
            </div>

            {/* Link zpět */}
            <div className="mt-4 text-center">
              <Link
                href="/"
                className={`text-sm ${palette.mutedLink}`}
              >
                ← Zpět na homepage
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
