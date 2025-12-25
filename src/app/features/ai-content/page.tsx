"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Brain, Sparkles, Zap, MessageSquare, Lightbulb, FileText, ArrowRight } from "lucide-react";
import { FeatureNavbar } from "@/components/FeatureNavbar";

export default function AIContentPage() {
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
      icon: <Lightbulb className="w-6 h-6" />,
      title: "Nápady na obsah",
      description: "AI ti navrhne témata, úhly pohledu a formáty podle tvého oboru a cílové skupiny.",
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: "Generování copy",
      description: "Vytvoř hook, celý caption i CTA během jedné minuty. Pro Reels, Stories i carousely.",
    },
    {
      icon: <MessageSquare className="w-6 h-6" />,
      title: "Odpovědi na komentáře",
      description: "AI napíše odpovědi na komentáře v tvém stylu. Profesionálně, přátelsky a včas.",
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Brainstorming asistent",
      description: "Zadej téma a AI vytvoří kompletní content plan na celý měsíc s trendy a formáty.",
    },
  ];

  return (
    <div className={`min-h-screen ${isDark ? "bg-black text-white" : "bg-white text-slate-900"}`}>
      <FeatureNavbar isDark={isDark} onThemeToggle={() => setTheme(isDark ? "light" : "dark")} />

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 border border-violet-500/20 mb-6">
            <Brain className="w-4 h-4 text-violet-500" />
            <span className="text-sm font-semibold text-violet-500">AI Content</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-violet-600 via-fuchsia-500 to-pink-500 bg-clip-text text-transparent">
            Nikdy ti nedojdou<br />nápady na obsah
          </h1>
          <p className={`text-xl md:text-2xl mb-10 max-w-3xl mx-auto ${isDark ? "text-white/70" : "text-slate-600"}`}>
            AI asistent, který ti navrhne témata, napíše captions, vytvoří content plan a odpoví na komentáře. Všechno v češtině i angličtině.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup" className="inline-flex items-center gap-2 text-white bg-gradient-to-r from-violet-600 to-fuchsia-500 py-4 px-8 rounded-full text-lg font-semibold shadow-lg hover:shadow-violet-500/50 transition-all">
              Vyzkoušet AI asistenta
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
            Co všechno AI umí
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <div key={index} className={`p-8 rounded-2xl border ${isDark ? "bg-white/5 border-white/10" : "bg-slate-50 border-slate-200"}`}>
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 ${isDark ? "bg-violet-500/10 text-violet-400" : "bg-violet-100 text-violet-600"}`}>
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

      {/* Use Cases */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            Jak AI pomáhá s tvorbou obsahu
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "Content Plan",
                description: "AI vytvoří plan na celý měsíc s tématy, formáty a trendy.",
                icon: <FileText className="w-8 h-8" />,
              },
              {
                title: "Hooky & Captions",
                description: "Vygeneruj přitažlivé hooky a kompletní captions během vteřiny.",
                icon: <Sparkles className="w-8 h-8" />,
              },
              {
                title: "Automatické odpovědi",
                description: "AI odpoví na komentáře profesionálně a v tvém tónu.",
                icon: <MessageSquare className="w-8 h-8" />,
              },
            ].map((useCase, index) => (
              <div key={index} className={`p-8 rounded-2xl border text-center ${isDark ? "bg-white/5 border-white/10" : "bg-slate-50 border-slate-200"}`}>
                <div className={`w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4 ${isDark ? "bg-violet-500/10 text-violet-400" : "bg-violet-100 text-violet-600"}`}>
                  {useCase.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{useCase.title}</h3>
                <p className={isDark ? "text-white/70" : "text-slate-600"}>
                  {useCase.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className={`max-w-4xl mx-auto text-center p-12 rounded-3xl ${isDark ? "bg-gradient-to-br from-violet-900/30 to-fuchsia-900/30 border border-white/10" : "bg-gradient-to-br from-violet-50 to-fuchsia-50 border border-violet-200"}`}>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Začni tvořit obsah s AI
          </h2>
          <p className={`text-xl mb-8 ${isDark ? "text-white/70" : "text-slate-600"}`}>
            Bez závazků, bez platební karty. Vyzkoušej AI asistenta zdarma.
          </p>
          <Link href="/signup" className="inline-flex items-center gap-2 text-white bg-gradient-to-r from-violet-600 to-fuchsia-500 py-4 px-8 rounded-full text-lg font-semibold shadow-lg hover:shadow-violet-500/50 transition-all">
            Vyzkoušet zdarma
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
