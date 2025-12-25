"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Image as ImageIcon, Sparkles, Palette, Type, Grid3x3, Download, ArrowRight } from "lucide-react";
import { FeatureNavbar } from "@/components/FeatureNavbar";

export default function StoriesPage() {
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

  useEffect(() => {
    if (typeof window !== "undefined" && theme) {
      localStorage.setItem("landing-theme", theme);
    }
  }, [theme]);

  const isDark = theme === "dark";

  const features = [
    {
      icon: <Grid3x3 className="w-6 h-6" />,
      title: "Hotové šablony",
      description: "Vyber si z desítek profesionálních šablon pro Instagram Stories. Žádný design není potřeba.",
    },
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: "AI návrhy",
      description: "AI ti navrhne design podle tvého brandu a obsahu. Stačí kliknout a Stories je hotová.",
    },
    {
      icon: <Type className="w-6 h-6" />,
      title: "Vlastní texty & fonty",
      description: "Přidej texty, vyber si z fontů, změň barvy. Všechno v reálném čase s náhledem.",
    },
    {
      icon: <Download className="w-6 h-6" />,
      title: "Export a sdílení",
      description: "Stáhni v perfektním 9:16 formátu pro Instagram nebo sdílej přímo z aplikace.",
    },
  ];

  return (
    <div className={`min-h-screen ${isDark ? "bg-black text-white" : "bg-white text-slate-900"}`}>
      <FeatureNavbar isDark={isDark} onThemeToggle={() => setTheme(isDark ? "light" : "dark")} />

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-pink-500/10 to-rose-500/10 border border-pink-500/20 mb-6">
            <ImageIcon className="w-4 h-4 text-pink-500" />
            <span className="text-sm font-semibold text-pink-500">Stories Editor</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-pink-600 via-rose-500 to-orange-500 bg-clip-text text-transparent">
            Vytvoř perfektní Stories<br />za pár sekund
          </h1>
          <p className={`text-xl md:text-2xl mb-10 max-w-3xl mx-auto ${isDark ? "text-white/70" : "text-slate-600"}`}>
            Profesionální šablony, AI návrhy a intuitivní editor. Vytvoř Stories, které zaujmou, bez Canvy a bez designéra.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup" className="inline-flex items-center gap-2 text-white bg-gradient-to-r from-pink-600 to-rose-500 py-4 px-8 rounded-full text-lg font-semibold shadow-lg hover:shadow-pink-500/50 transition-all">
              Začít tvořit zdarma
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/#pricing" className={`inline-flex items-center gap-2 py-4 px-8 rounded-full text-lg font-semibold border-2 transition-all ${isDark ? "border-white/20 hover:bg-white/10" : "border-slate-300 hover:bg-slate-100"}`}>
              Zobrazit ceník
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            Všechno, co potřebuješ pro Stories
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <div key={index} className={`p-8 rounded-2xl border ${isDark ? "bg-white/5 border-white/10" : "bg-slate-50 border-slate-200"}`}>
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 ${isDark ? "bg-pink-500/10 text-pink-400" : "bg-pink-100 text-pink-600"}`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className={isDark ? "text-white/70" : "text-slate-600"}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Templates Preview */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            Profesionální šablony pro každou příležitost
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { name: "Minimal", gradient: "from-slate-100 to-slate-200" },
              { name: "Colorful", gradient: "from-purple-400 via-pink-400 to-orange-400" },
              { name: "Business", gradient: "from-blue-500 to-indigo-600" },
              { name: "Nature", gradient: "from-green-400 to-emerald-600" },
              { name: "Sunset", gradient: "from-orange-400 to-pink-500" },
              { name: "Neon", gradient: "from-cyan-400 to-purple-600" },
            ].map((template, index) => (
              <div key={index} className="group cursor-pointer">
                <div className={`aspect-[9/16] rounded-2xl bg-gradient-to-br ${template.gradient} mb-2 transition-transform group-hover:scale-105 shadow-lg`} />
                <div className={`text-sm font-medium text-center ${isDark ? "text-white/80" : "text-slate-700"}`}>
                  {template.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className={`max-w-4xl mx-auto text-center p-12 rounded-3xl ${isDark ? "bg-gradient-to-br from-pink-900/30 to-rose-900/30 border border-white/10" : "bg-gradient-to-br from-pink-50 to-rose-50 border border-pink-200"}`}>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Začni tvořit Stories, které zaujmou
          </h2>
          <p className={`text-xl mb-8 ${isDark ? "text-white/70" : "text-slate-600"}`}>
            Bez závazků, bez platební karty. Vyzkoušej zdarma.
          </p>
          <Link href="/signup" className="inline-flex items-center gap-2 text-white bg-gradient-to-r from-pink-600 to-rose-500 py-4 px-8 rounded-full text-lg font-semibold shadow-lg hover:shadow-pink-500/50 transition-all">
            Vyzkoušet zdarma
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
