"use client";

/**
 * LOGIN STRÁNKA
 *
 * Formulář pro přihlášení uživatele
 * Používá React Hook Form pro validaci a useActionState pro Server Actions
 */

import { useActionState } from "react";
import { login } from "@/app/actions/auth";
import Link from "next/link";
import { LogIn } from "lucide-react";

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(login, null);

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/10 via-transparent to-white/5 blur-3xl" />
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-16 flex flex-col items-center text-center gap-8">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight">
            Vítejte zpět v <span className="text-yellow-400">SocialMat</span>
          </h1>
          <p className="text-white/70 max-w-xl mx-auto">
            Přihlaste se a pokračujte v tvorbě titulků
          </p>
        </div>

        <div className="w-full max-w-md">
          <div className="bg-white/5 border border-white/10 rounded-3xl shadow-2xl p-8 backdrop-blur">
            <form action={formAction} className="space-y-6">
              {/* Globální error message */}
              {state?.message && (
                <div className="bg-red-500/10 border border-red-500/40 text-red-200 px-4 py-3 rounded-lg text-sm">
                  {state.message}
                </div>
              )}

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-white/70 mb-2"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-full focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/60 outline-none transition-all text-white placeholder:text-white/40"
                  placeholder="vas@email.cz"
                />
                {state?.errors?.email && (
                  <p className="mt-1 text-sm text-red-300">
                    {state.errors.email[0]}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-white/70 mb-2"
                >
                  Heslo
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-full focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/60 outline-none transition-all text-white placeholder:text-white/40"
                  placeholder="••••••••"
                />
                {state?.errors?.password && (
                  <p className="mt-1 text-sm text-red-300">
                    {state.errors.password[0]}
                  </p>
                )}
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={isPending}
                className="w-full bg-gradient-to-r from-yellow-300 to-amber-400 text-black py-3 px-4 rounded-full font-semibold hover:from-yellow-200 hover:to-amber-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-yellow-500/20"
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
              <p className="text-sm text-white/60">
                Ještě nemáte účet?{" "}
                <Link
                  href="/signup"
                  className="text-yellow-300 hover:text-yellow-200 font-semibold"
                >
                  Zaregistrovat se
                </Link>
              </p>
            </div>

            {/* Link zpět */}
            <div className="mt-4 text-center">
              <Link
                href="/"
                className="text-sm text-white/50 hover:text-white/80"
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
