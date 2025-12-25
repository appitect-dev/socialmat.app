"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Video, Check, Zap, Globe, Download, Sparkles, ArrowRight } from "lucide-react";
import { FeatureNavbar } from "@/components/FeatureNavbar";

export default function TitulkyPage() {
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
      icon: <Zap className="w-6 h-6" />,
      title: "Titulky za 30 vteřin",
      description: "Naše AI zpracuje video a vytvoří perfektní titulky rychleji než by to udělal člověk.",
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Perfektní čeština",
      description: "Rozumíme slangu, dialektům i přirozenému českému jazyku. Žádné 'překladačové' titulky.",
    },
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: "Brandové styly",
      description: "Vlastní barvy, fonty, pozice. Nebo použij naše hotové šablony pro různé platformy.",
    },
    {
      icon: <Download className="w-6 h-6" />,
      title: "Flexibilní export",
      description: "Stáhni jako SRT, TXT nebo přímo hotové video s vypálenými titulky.",
    },
  ];

  const benefits = [
    "Automatické rozpoznání českého jazyka",
    "Přidání emoji a CTA slidů",
    "Časové značky na milisekundy",
    "Korekce překlepů a gramatiky",
    "Export pro Instagram, TikTok, YouTube",
    "Upravitelné titulky v editoru",
  ];

  return (
    <div className={`min-h-screen ${isDark ? "bg-black text-white" : "bg-white text-slate-900"}`}>
      <FeatureNavbar isDark={isDark} onThemeToggle={() => setTheme(isDark ? "light" : "dark")} />

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-indigo-500/10 to-blue-500/10 border border-indigo-500/20 mb-6">
            <Video className="w-4 h-4 text-indigo-500" />
            <span className="text-sm font-semibold text-indigo-500">AI Titulky</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-indigo-600 via-blue-500 to-sky-500 bg-clip-text text-transparent">
            Profesionální české titulky<br />za 30 vteřin
          </h1>
          <p className={`text-xl md:text-2xl mb-10 max-w-3xl mx-auto ${isDark ? "text-white/70" : "text-slate-600"}`}>
            Nahraj video a během chvilky máš profesionální titulky. Žádné zdlouhavé přepisování, žádné chyby. Naše AI rozumí češtině perfektně.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup" className="inline-flex items-center gap-2 text-white bg-gradient-to-r from-indigo-600 to-blue-500 py-4 px-8 rounded-full text-lg font-semibold shadow-lg hover:shadow-indigo-500/50 transition-all">
              Vyzkoušet nyní zdarma
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
            Jak to funguje
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <div key={index} className={`p-8 rounded-2xl border ${isDark ? "bg-white/5 border-white/10" : "bg-slate-50 border-slate-200"}`}>
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 ${isDark ? "bg-indigo-500/10 text-indigo-400" : "bg-indigo-100 text-indigo-600"}`}>
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

      {/* Benefits Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            Co všechno umí AI Titulky
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {benefits.map((benefit, index) => (
              <div key={index} className={`flex items-start gap-3 p-4 rounded-xl ${isDark ? "bg-white/5" : "bg-slate-50"}`}>
                <Check className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                <span className="text-lg">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className={`max-w-4xl mx-auto text-center p-12 rounded-3xl ${isDark ? "bg-gradient-to-br from-indigo-900/30 to-blue-900/30 border border-white/10" : "bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-200"}`}>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Začni vytvářet titulky ještě dnes
          </h2>
          <p className={`text-xl mb-8 ${isDark ? "text-white/70" : "text-slate-600"}`}>
            Bez závazků, bez platební karty. Vyzkoušej zdarma.
          </p>
          <Link href="/signup" className="inline-flex items-center gap-2 text-white bg-gradient-to-r from-indigo-600 to-blue-500 py-4 px-8 rounded-full text-lg font-semibold shadow-lg hover:shadow-indigo-500/50 transition-all">
            Vyzkoušet zdarma
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
