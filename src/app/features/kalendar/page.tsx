"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Calendar as CalendarIcon, Clock, Zap, CheckCircle2, Grid3x3, ArrowRight } from "lucide-react";
import { FeatureNavbar } from "@/components/FeatureNavbar";

export default function KalendarPage() {
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
      title: "Vizuální plánování",
      description: "Vidíš celý měsíc najednou. Přetáhni, přesuň nebo zkopíruj posty podle potřeby.",
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Optimální čas publikování",
      description: "AI ti navrhne nejlepší čas pro každý post podle tvého publika a historických dat.",
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Automatické publikování",
      description: "Naplánuj si posty dopředu a systém je publikuje přesně v ten správný čas.",
    },
    {
      icon: <CheckCircle2 className="w-6 h-6" />,
      title: "Schvalování & spolupráce",
      description: "Sdílej kalendář s týmem, přidávej komentáře a schvaluj obsah před publikací.",
    },
  ];

  return (
    <div className={`min-h-screen ${isDark ? "bg-black text-white" : "bg-white text-slate-900"}`}>
      <FeatureNavbar isDark={isDark} onThemeToggle={() => setTheme(isDark ? "light" : "dark")} />

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-blue-500/20 mb-6">
            <CalendarIcon className="w-4 h-4 text-blue-500" />
            <span className="text-sm font-semibold text-blue-500">Kalendář</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-500 bg-clip-text text-transparent">
            Plánuj obsah jako profesionál
          </h1>
          <p className={`text-xl md:text-2xl mb-10 max-w-3xl mx-auto ${isDark ? "text-white/70" : "text-slate-600"}`}>
            Vizuální kalendář pro Instagram, TikTok a další platformy. Naplánuj si celý měsíc dopředu a publikuj v optimální čas.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup" className="inline-flex items-center gap-2 text-white bg-gradient-to-r from-blue-600 to-indigo-500 py-4 px-8 rounded-full text-lg font-semibold shadow-lg hover:shadow-blue-500/50 transition-all">
              Začít plánovat zdarma
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
            Plánování obsahu, které ti ušetří hodiny práce
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <div key={index} className={`p-8 rounded-2xl border ${isDark ? "bg-white/5 border-white/10" : "bg-slate-50 border-slate-200"}`}>
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 ${isDark ? "bg-blue-500/10 text-blue-400" : "bg-blue-100 text-blue-600"}`}>
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

      {/* Benefits */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            Proč používat kalendář SocialMat
          </h2>
          <div className="space-y-4">
            {[
              "Vidíš celý měsíc obsahu na jeden pohled",
              "AI navrhne nejlepší čas pro každý post",
              "Automatické publikování ve vybraný čas",
              "Spolupráce s týmem a schvalování obsahu",
              "Podpora všech hlavních platforem",
              "Historie a statistiky zveřejněného obsahu",
            ].map((benefit, index) => (
              <div key={index} className={`flex items-center gap-3 p-4 rounded-xl ${isDark ? "bg-white/5" : "bg-slate-50"}`}>
                <CheckCircle2 className="w-6 h-6 text-blue-500 flex-shrink-0" />
                <span className="text-lg">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className={`max-w-4xl mx-auto text-center p-12 rounded-3xl ${isDark ? "bg-gradient-to-br from-blue-900/30 to-indigo-900/30 border border-white/10" : "bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200"}`}>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Naplánuj si celý měsíc dopředu
          </h2>
          <p className={`text-xl mb-8 ${isDark ? "text-white/70" : "text-slate-600"}`}>
            Bez závazků, bez platební karty. Vyzkoušej zdarma.
          </p>
          <Link href="/signup" className="inline-flex items-center gap-2 text-white bg-gradient-to-r from-blue-600 to-indigo-500 py-4 px-8 rounded-full text-lg font-semibold shadow-lg hover:shadow-blue-500/50 transition-all">
            Vyzkoušet zdarma
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
