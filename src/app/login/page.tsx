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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo a nadpis */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Přihlášení
          </h1>
          <p className="text-gray-600">
            Vítejte zpět v SocialMat
          </p>
        </div>

        {/* Formulář */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form action={formAction} className="space-y-6">
            {/* Globální error message */}
            {state?.message && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {state.message}
              </div>
            )}

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-900 placeholder:text-gray-400"
                placeholder="vas@email.cz"
              />
              {state?.errors?.email && (
                <p className="mt-1 text-sm text-red-600">
                  {state.errors.email[0]}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Heslo
              </label>
              <input
                type="password"
                id="password"
                name="password"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-900 placeholder:text-gray-400"
                placeholder="••••••••"
              />
              {state?.errors?.password && (
                <p className="mt-1 text-sm text-red-600">
                  {state.errors.password[0]}
                </p>
              )}
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-black text-white py-3 px-4 rounded-lg font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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

          {/* Demo info */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800 font-medium mb-2">
              Demo přihlášení:
            </p>
            <p className="text-xs text-blue-700">
              Email: <code className="bg-blue-100 px-1 py-0.5 rounded">demo@socialmat.app</code>
            </p>
            <p className="text-xs text-blue-700">
              Heslo: <code className="bg-blue-100 px-1 py-0.5 rounded">demo123</code>
            </p>
          </div>

          {/* Link na registraci */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Ještě nemáte účet?{" "}
              <Link
                href="/signup"
                className="text-blue-600 hover:text-blue-700 font-semibold"
              >
                Zaregistrovat se
              </Link>
            </p>
          </div>

          {/* Link zpět */}
          <div className="mt-4 text-center">
            <Link
              href="/"
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              ← Zpět na homepage
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
