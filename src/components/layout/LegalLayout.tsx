"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Sun,
  Moon,
  ChevronDown,
  Menu,
  X,
  FileText,
  ArrowRight,
} from "lucide-react";

interface Section {
  id: string;
  title: string;
}

interface LegalLayoutProps {
  children: React.ReactNode;
  title: string;
  badge: string;
  lastUpdated: string;
  sections?: Section[];
}

export function LegalLayout({
  children,
  title,
  badge,
  lastUpdated,
  sections = [],
}: LegalLayoutProps) {
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = localStorage.getItem("landing-theme");
    if (saved === "light") setTheme("light");
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-100px 0px -66%" }
    );

    sections.forEach((section) => {
      const el = document.getElementById(section.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [sections]);

  const isDark = theme === "dark";
  const currentYear = new Date().getFullYear();
  const gradientPrimary = "from-[#833AB4] via-[#E1306C] to-[#F77737]";
  const accentPink = "#E1306C";

  return (
    <div className={`${isDark ? "bg-[#0A0A0A]" : "bg-white"} min-h-screen font-sans`}>
      {/* Gradient background blob */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div
          className={`absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full blur-[150px] ${isDark ? "opacity-20" : "opacity-10"}`}
          style={{ background: "linear-gradient(135deg, #833AB4 0%, #E1306C 50%, #F77737 100%)" }}
        />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-4 py-4">
        <div className={`max-w-6xl mx-auto rounded-2xl px-6 py-3 backdrop-blur-xl border ${isDark ? "bg-[#1a1a1a]/80 border-white/10" : "bg-white/80 border-slate-200"}`}>
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradientPrimary} flex items-center justify-center shadow-lg shadow-[#E1306C]/20`}>
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className={`font-bold text-xl ${isDark ? "text-white" : "text-slate-900"}`}>SocialMat</span>
            </Link>

            <div className="hidden md:flex items-center gap-1">
              <Link href="/#pricing" className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${isDark ? "text-white/80 hover:text-white hover:bg-white/10" : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"}`}>
                Ceník
              </Link>
              <Link href="/#faq" className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${isDark ? "text-white/80 hover:text-white hover:bg-white/10" : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"}`}>
                FAQ
              </Link>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setTheme(isDark ? "light" : "dark")}
                className={`p-2.5 rounded-xl transition-all ${isDark ? "bg-white/10 hover:bg-white/15 text-white" : "bg-slate-100 hover:bg-slate-200 text-slate-600"}`}
              >
                {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
              <Link href="/login" className={`hidden sm:block px-4 py-2 rounded-xl text-sm font-medium ${isDark ? "text-white/80 hover:text-white" : "text-slate-600"}`}>
                Přihlášení
              </Link>
              <Link
                href="/signup"
                className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:-translate-y-0.5"
                style={{ background: `linear-gradient(135deg, #833AB4, #E1306C, #F77737)`, boxShadow: `0 8px 32px -8px ${accentPink}` }}
              >
                Začít zdarma
              </Link>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`md:hidden p-2.5 rounded-xl ${isDark ? "bg-white/10 text-white" : "bg-slate-100 text-slate-600"}`}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`md:hidden mt-2 rounded-2xl p-4 backdrop-blur-xl border ${isDark ? "bg-[#1a1a1a]/95 border-white/10" : "bg-white border-slate-200"}`}
            >
              <Link href="/#pricing" className={`block px-4 py-3 rounded-xl ${isDark ? "text-white/80" : "text-slate-600"}`}>Ceník</Link>
              <Link href="/#faq" className={`block px-4 py-3 rounded-xl ${isDark ? "text-white/80" : "text-slate-600"}`}>FAQ</Link>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Header */}
      <header className="relative pt-32 pb-16 px-4 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background: isDark
              ? "linear-gradient(180deg, rgba(131, 58, 180, 0.15) 0%, rgba(10, 10, 10, 1) 100%)"
              : "linear-gradient(180deg, rgba(131, 58, 180, 0.1) 0%, rgba(255, 255, 255, 1) 100%)",
          }}
        />
        <div className="relative max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-6 ${isDark ? "bg-white/5 border-white/10" : "bg-pink-50 border-pink-200"}`}>
              <FileText className={`w-4 h-4 text-[#E1306C]`} />
              <span className={`text-sm font-medium ${isDark ? "text-white/80" : "text-[#E1306C]"}`}>{badge}</span>
            </div>

            <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${isDark ? "text-white" : "text-slate-900"}`}>
              {title}
            </h1>

            <p className={`text-sm ${isDark ? "text-white/50" : "text-slate-500"}`}>
              Poslední aktualizace: {lastUpdated}
            </p>
          </motion.div>
        </div>
      </header>

      {/* Content */}
      <main className="relative px-4 pb-24">
        <div className="max-w-6xl mx-auto">
          <div className="flex gap-8">
            {/* Sticky TOC - Desktop */}
            {sections.length > 0 && (
              <aside className="hidden lg:block w-64 flex-shrink-0">
                <div className="sticky top-28">
                  <div className={`rounded-2xl border p-4 ${isDark ? "bg-[#1a1a1a]/50 border-white/10" : "bg-white border-slate-200"}`}>
                    <h3 className={`font-semibold mb-4 ${isDark ? "text-white" : "text-slate-900"}`}>Obsah</h3>
                    <nav className="space-y-1">
                      {sections.map((section) => (
                        <a
                          key={section.id}
                          href={`#${section.id}`}
                          className={`block px-3 py-2 rounded-lg text-sm transition-all ${
                            activeSection === section.id
                              ? `${isDark ? "bg-[#E1306C]/20 text-[#E1306C]" : "bg-pink-50 text-[#E1306C]"} font-medium`
                              : `${isDark ? "text-white/60 hover:text-white hover:bg-white/5" : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"}`
                          }`}
                        >
                          {section.title}
                        </a>
                      ))}
                    </nav>
                  </div>
                </div>
              </aside>
            )}

            {/* Main Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex-1 max-w-3xl"
            >
              <div className={`rounded-3xl border p-8 md:p-12 ${isDark ? "bg-[#1a1a1a]/50 border-white/10" : "bg-white border-slate-200"}`}>
                <div className={`prose prose-lg max-w-none ${isDark ? "prose-invert" : ""}`}>
                  {children}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className={`py-12 px-4 border-t ${isDark ? "border-white/10 bg-black/50" : "border-slate-200 bg-slate-50"}`}>
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-2 md:col-span-1">
              <Link href="/" className="flex items-center gap-2.5 mb-4">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradientPrimary} flex items-center justify-center`}>
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className={`font-bold text-xl ${isDark ? "text-white" : "text-slate-900"}`}>SocialMat</span>
              </Link>
              <p className={`text-sm ${isDark ? "text-white/60" : "text-slate-600"}`}>
                AI nástroje pro české content creatry.
              </p>
            </div>
            <div>
              <h4 className={`font-semibold mb-3 ${isDark ? "text-white" : "text-slate-900"}`}>Produkt</h4>
              <ul className={`space-y-2 text-sm ${isDark ? "text-white/60" : "text-slate-600"}`}>
                <li><Link href="/features/titulky" className="hover:underline">AI Titulky</Link></li>
                <li><Link href="/features/auto-reply" className="hover:underline">Auto-reply</Link></li>
                <li><Link href="/features/analytics" className="hover:underline">Analytics</Link></li>
              </ul>
            </div>
            <div>
              <h4 className={`font-semibold mb-3 ${isDark ? "text-white" : "text-slate-900"}`}>Společnost</h4>
              <ul className={`space-y-2 text-sm ${isDark ? "text-white/60" : "text-slate-600"}`}>
                <li><Link href="/#pricing" className="hover:underline">Ceník</Link></li>
                <li><Link href="/#faq" className="hover:underline">FAQ</Link></li>
                <li><a href="mailto:hello@socialmat.app" className="hover:underline">Kontakt</a></li>
              </ul>
            </div>
            <div>
              <h4 className={`font-semibold mb-3 ${isDark ? "text-white" : "text-slate-900"}`}>Právní</h4>
              <ul className={`space-y-2 text-sm ${isDark ? "text-white/60" : "text-slate-600"}`}>
                <li><Link href="/privacy" className="hover:underline">Ochrana soukromí</Link></li>
                <li><Link href="/data-deletion" className="hover:underline">Smazání dat</Link></li>
              </ul>
            </div>
          </div>
          <div className={`pt-6 border-t flex flex-col md:flex-row items-center justify-between gap-4 ${isDark ? "border-white/10" : "border-slate-200"}`}>
            <p className={`text-sm ${isDark ? "text-white/50" : "text-slate-500"}`}>© {currentYear} SocialMat. Vytvořeno s 💜 v Česku.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
