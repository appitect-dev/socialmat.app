"use client";

import { useActionState } from "react";
import { signup } from "@/app/actions/auth";
import Link from "next/link";
import { UserPlus, Check, CreditCard } from "lucide-react";
import { AuthLayout } from "@/components/layout/AuthLayout";

export default function SignupPage() {
  const [state, formAction, isPending] = useActionState(signup, null);

  const accentPink = "#E1306C";

  return (
    <AuthLayout
      title="Vytvořit účet"
      subtitle="Začni tvořit obsah chytřeji"
    >
      {/* OAuth Buttons */}
      <div className="space-y-3 mb-6">
        <button
          type="button"
          className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-white text-slate-900 font-medium hover:bg-slate-100 transition-all"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Pokračovat s Google
        </button>

        <button
          type="button"
          className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-white text-slate-900 font-medium hover:bg-slate-100 transition-all"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
          </svg>
          Pokračovat s Apple
        </button>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex-1 h-px bg-white/10" />
        <span className="text-white/40 text-sm">nebo</span>
        <div className="flex-1 h-px bg-white/10" />
      </div>

      {/* Form */}
      <form action={formAction} className="space-y-4">
        {state?.message && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-200 px-4 py-3 rounded-xl text-sm">
            {state.message}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-white/70 mb-2">
              Jméno
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              required
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:border-[#E1306C]/50 focus:ring-1 focus:ring-[#E1306C]/50 outline-none transition-all"
              placeholder="Jan"
            />
            {state?.errors?.firstName && (
              <p className="mt-1 text-sm text-red-400">{state.errors.firstName[0]}</p>
            )}
          </div>

          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-white/70 mb-2">
              Příjmení
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              required
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:border-[#E1306C]/50 focus:ring-1 focus:ring-[#E1306C]/50 outline-none transition-all"
              placeholder="Novák"
            />
            {state?.errors?.lastName && (
              <p className="mt-1 text-sm text-red-400">{state.errors.lastName[0]}</p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-white/70 mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:border-[#E1306C]/50 focus:ring-1 focus:ring-[#E1306C]/50 outline-none transition-all"
            placeholder="vas@email.cz"
          />
          {state?.errors?.email && (
            <p className="mt-1 text-sm text-red-400">{state.errors.email[0]}</p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-white/70 mb-2">
            Heslo
          </label>
          <input
            type="password"
            id="password"
            name="password"
            required
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:border-[#E1306C]/50 focus:ring-1 focus:ring-[#E1306C]/50 outline-none transition-all"
            placeholder="••••••••"
          />
          {state?.errors?.password && (
            <p className="mt-1 text-sm text-red-400">{state.errors.password[0]}</p>
          )}
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-white/70 mb-2">
            Potvrdit heslo
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            required
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:border-[#E1306C]/50 focus:ring-1 focus:ring-[#E1306C]/50 outline-none transition-all"
            placeholder="••••••••"
          />
          {state?.errors?.confirmPassword && (
            <p className="mt-1 text-sm text-red-400">{state.errors.confirmPassword[0]}</p>
          )}
        </div>

        {/* Terms checkbox */}
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            id="terms"
            name="terms"
            required
            className="mt-1 w-4 h-4 rounded border-white/20 bg-white/5 text-[#E1306C] focus:ring-[#E1306C]/50"
          />
          <label htmlFor="terms" className="text-sm text-white/60">
            Souhlasím s{" "}
            <Link href="/privacy" className="text-[#E1306C] hover:underline">
              ochranou osobních údajů
            </Link>{" "}
            a podmínkami služby
          </label>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isPending}
          className="w-full py-3.5 px-4 rounded-xl font-semibold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          style={{
            background: "linear-gradient(135deg, #833AB4, #E1306C, #F77737)",
            boxShadow: `0 8px 24px -8px ${accentPink}`,
          }}
        >
          {isPending ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Registruji...
            </>
          ) : (
            <>
              <UserPlus className="w-5 h-5" />
              Začít zdarma
            </>
          )}
        </button>
      </form>

      {/* Benefits */}
      <div className="flex flex-wrap justify-center gap-4 mt-6 text-sm text-white/50">
        <span className="flex items-center gap-1.5">
          <Check className="w-4 h-4 text-green-400" />
          14 dní zdarma
        </span>
        <span className="flex items-center gap-1.5">
          <CreditCard className="w-4 h-4 text-blue-400" />
          Bez kreditky
        </span>
      </div>

      {/* Login link */}
      <div className="mt-6 text-center">
        <p className="text-sm text-white/60">
          Už máš účet?{" "}
          <Link href="/login" className="text-[#E1306C] font-semibold hover:underline">
            Přihlásit se
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
