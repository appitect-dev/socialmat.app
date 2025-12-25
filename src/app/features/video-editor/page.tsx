"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Edit3, Scissors, Sparkles, Layers, Upload, Download, ArrowRight, Wand2 } from "lucide-react";
import { FeatureNavbar } from "@/components/FeatureNavbar";

export default function VideoEditorPage() {
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
      icon: <Scissors className="w-6 h-6" />,
      title: "Intuitivní střih",
      description: "Stříhej videa jednoduše jako v profesionálním editoru. Drag & drop, timeline, klávesové zkratky.",
    },
    {
      icon: <Wand2 className="w-6 h-6" />,
      title: "AI úpravy",
      description: "AI automaticky odstraní ticho, vyladí barvy, stabilizuje obraz a vylepší zvuk.",
    },
    {
      icon: <Layers className="w-6 h-6" />,
      title: "Vrstvy & efekty",
      description: "Přidávej texty, přechody, filtry, stickery a další efekty. Všechno v reálném čase.",
    },
    {
      icon: <Upload className="w-6 h-6" />,
      title: "Rychlý export",
      description: "Exportuj v jakékoliv kvalitě a formátu pro Instagram, TikTok, YouTube nebo Facebook.",
    },
  ];

  return (
    <div className={`min-h-screen ${isDark ? "bg-black text-white" : "bg-white text-slate-900"}`}>
      <FeatureNavbar isDark={isDark} onThemeToggle={() => setTheme(isDark ? "light" : "dark")} />

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 mb-6">
            <Edit3 className="w-4 h-4 text-purple-500" />
            <span className="text-sm font-semibold text-purple-500">Video Editor</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-pink-500 to-rose-500 bg-clip-text text-transparent">
            Profesionální video editor<br />přímo v prohlížeči
          </h1>
          <p className={`text-xl md:text-2xl mb-10 max-w-3xl mx-auto ${isDark ? "text-white/70" : "text-slate-600"}`}>
            Stříhej, upravuj a exportuj videa jako profesionál. Bez instalace, bez komplikací. Všechno online s pomocí AI.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup" className="inline-flex items-center gap-2 text-white bg-gradient-to-r from-purple-600 to-pink-500 py-4 px-8 rounded-full text-lg font-semibold shadow-lg hover:shadow-purple-500/50 transition-all">
              Začít editovat zdarma
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
            Všechno, co potřebuješ pro úpravu videí
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <div key={index} className={`p-8 rounded-2xl border ${isDark ? "bg-white/5 border-white/10" : "bg-slate-50 border-slate-200"}`}>
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 ${isDark ? "bg-purple-500/10 text-purple-400" : "bg-purple-100 text-purple-600"}`}>
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

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className={`max-w-4xl mx-auto text-center p-12 rounded-3xl ${isDark ? "bg-gradient-to-br from-purple-900/30 to-pink-900/30 border border-white/10" : "bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200"}`}>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Začni stříhat videa jako profík
          </h2>
          <p className={`text-xl mb-8 ${isDark ? "text-white/70" : "text-slate-600"}`}>
            Bez závazků, bez platební karty. Vyzkoušej zdarma.
          </p>
          <Link href="/signup" className="inline-flex items-center gap-2 text-white bg-gradient-to-r from-purple-600 to-pink-500 py-4 px-8 rounded-full text-lg font-semibold shadow-lg hover:shadow-purple-500/50 transition-all">
            Vyzkoušet zdarma
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
