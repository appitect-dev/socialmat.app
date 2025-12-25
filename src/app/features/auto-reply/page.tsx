"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { MessageSquare, Zap, Filter, CheckCircle2, Shield, Bot, ArrowRight } from "lucide-react";
import { FeatureNavbar } from "@/components/FeatureNavbar";

export default function AutoReplyPage() {
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
      icon: <Bot className="w-6 h-6" />,
      title: "AI odpovědi v tvém stylu",
      description: "Nastav tón komunikace a AI bude odpovídat fanouškům profesionálně, přátelsky a včas. V češtině i angličtině.",
    },
    {
      icon: <Filter className="w-6 h-6" />,
      title: "Automatické filtrování",
      description: "AI rozpozná spam, toxické komentáře a nevhodný obsah. Ty se jen zaměř na pozitivní interakce.",
    },
    {
      icon: <CheckCircle2 className="w-6 h-6" />,
      title: "Schválení jedním kliknutím",
      description: "Zkontroluj AI odpovědi před odesláním nebo nech běžet na autopilot. Máš plnou kontrolu.",
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Okamžité reakce",
      description: "Odpovídej na komentáře během vteřin, ne hodin. Zvyš engagement a buduj komunitu rychleji.",
    },
  ];

  const benefits = [
    "Odpovědi do 10 sekund po komentáři",
    "Automatická detekce spamu a toxicity",
    "Personalizované odpovědi podle kontextu",
    "Schválení nebo autopilot režim",
    "Podpora češtiny i angličtiny",
    "Sledování engagement metrik",
  ];

  return (
    <div className={`min-h-screen ${isDark ? "bg-black text-white" : "bg-white text-slate-900"}`}>
      <FeatureNavbar isDark={isDark} onThemeToggle={() => setTheme(isDark ? "light" : "dark")} />

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 mb-6">
            <MessageSquare className="w-4 h-4 text-orange-500" />
            <span className="text-sm font-semibold text-orange-500">Auto Reply</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-orange-600 via-red-500 to-rose-500 bg-clip-text text-transparent">
            Odpovídáme na komentáře<br />místo tebe
          </h1>
          <p className={`text-xl md:text-2xl mb-10 max-w-3xl mx-auto ${isDark ? "text-white/70" : "text-slate-600"}`}>
            Nastav tón komunikace a SocialMat bude odpovídat fanouškům profesionálně, přátelsky a včas. Ty jen schválíš nebo necháš běžet na autopilot.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup" className="inline-flex items-center gap-2 text-white bg-gradient-to-r from-orange-600 to-red-500 py-4 px-8 rounded-full text-lg font-semibold shadow-lg hover:shadow-orange-500/50 transition-all">
              Aktivovat Auto Reply
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
            Jak funguje Auto Reply
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <div key={index} className={`p-8 rounded-2xl border ${isDark ? "bg-white/5 border-white/10" : "bg-slate-50 border-slate-200"}`}>
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 ${isDark ? "bg-orange-500/10 text-orange-400" : "bg-orange-100 text-orange-600"}`}>
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
            Co všechno Auto Reply umí
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {benefits.map((benefit, index) => (
              <div key={index} className={`flex items-start gap-3 p-4 rounded-xl ${isDark ? "bg-white/5" : "bg-slate-50"}`}>
                <CheckCircle2 className="w-6 h-6 text-orange-500 flex-shrink-0 mt-1" />
                <span className="text-lg">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works flow */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            Automatická odpověď ve 3 krocích
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Fanoušek napíše komentář",
                description: "AI okamžitě zachytí nový komentář pod tvým postem nebo Reels.",
                icon: <MessageSquare className="w-8 h-8" />,
              },
              {
                step: "02",
                title: "AI vytvoří odpověď",
                description: "Vygeneruje odpověď v tvém stylu podle kontextu komentáře.",
                icon: <Bot className="w-8 h-8" />,
              },
              {
                step: "03",
                title: "Schválíš nebo autopilot",
                description: "Můžeš odpověď schválit nebo nechat AI publikovat automaticky.",
                icon: <Zap className="w-8 h-8" />,
              },
            ].map((step, index) => (
              <div key={index} className={`relative p-8 rounded-2xl border ${isDark ? "bg-white/5 border-white/10" : "bg-slate-50 border-slate-200"}`}>
                <div className={`absolute -top-4 -left-4 w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${isDark ? "bg-orange-500/20 text-orange-400 border-2 border-orange-500/40" : "bg-orange-100 text-orange-600 border-2 border-orange-200"}`}>
                  {step.step}
                </div>
                <div className={`w-16 h-16 rounded-xl flex items-center justify-center mb-4 mx-auto ${isDark ? "bg-orange-500/10 text-orange-400" : "bg-orange-100 text-orange-600"}`}>
                  {step.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 text-center">{step.title}</h3>
                <p className={`text-center ${isDark ? "text-white/70" : "text-slate-600"}`}>
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid sm:grid-cols-3 gap-8 text-center">
            {[
              { number: "10s", label: "Průměrná doba odpovědi" },
              { number: "97%", label: "Přesnost AI odpovědí" },
              { number: "+37%", label: "Vyšší engagement" },
            ].map((stat, index) => (
              <div key={index} className={`p-8 rounded-2xl border ${isDark ? "bg-white/5 border-white/10" : "bg-slate-50 border-slate-200"}`}>
                <div className="text-5xl font-bold mb-2 bg-gradient-to-r from-orange-600 to-red-500 bg-clip-text text-transparent">
                  {stat.number}
                </div>
                <div className={`text-lg ${isDark ? "text-white/70" : "text-slate-600"}`}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className={`max-w-4xl mx-auto text-center p-12 rounded-3xl ${isDark ? "bg-gradient-to-br from-orange-900/30 to-red-900/30 border border-white/10" : "bg-gradient-to-br from-orange-50 to-red-50 border border-orange-200"}`}>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Začni odpovídat rychleji než konkurence
          </h2>
          <p className={`text-xl mb-8 ${isDark ? "text-white/70" : "text-slate-600"}`}>
            Bez závazků, bez platební karty. Vyzkoušej Auto Reply zdarma.
          </p>
          <Link href="/signup" className="inline-flex items-center gap-2 text-white bg-gradient-to-r from-orange-600 to-red-500 py-4 px-8 rounded-full text-lg font-semibold shadow-lg hover:shadow-orange-500/50 transition-all">
            Vyzkoušet zdarma
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
