"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { BarChart3, TrendingUp, Users, Eye, Heart, Target, ArrowRight } from "lucide-react";
import { FeatureNavbar } from "@/components/FeatureNavbar";

export default function AnalyticsPage() {
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
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Výkon profilu v reálném čase",
      description: "Sleduj reach, engagement, follower growth a další klíčové metriky na jednom místě.",
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "AI doporučení",
      description: "Umělá inteligence ti řekne, kdy publikovat, jaký obsah funguje a kde máš prostor pro růst.",
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Analýza publika",
      description: "Zjisti, kdo jsou tvoji fanoušci, odkud jsou, kdy jsou online a co je zajímá.",
    },
    {
      icon: <Eye className="w-6 h-6" />,
      title: "Konkurenční analýza",
      description: "Porovnej svůj výkon s konkurencí a objevuj nové příležitosti pro růst.",
    },
  ];

  return (
    <div className={`min-h-screen ${isDark ? "bg-black text-white" : "bg-white text-slate-900"}`}>
      <FeatureNavbar isDark={isDark} onThemeToggle={() => setTheme(isDark ? "light" : "dark")} />

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 mb-6">
            <BarChart3 className="w-4 h-4 text-emerald-500" />
            <span className="text-sm font-semibold text-emerald-500">Analýzy profilu</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-500 bg-clip-text text-transparent">
            Vidíš výkon svého profilu<br />na jeden pohled
          </h1>
          <p className={`text-xl md:text-2xl mb-10 max-w-3xl mx-auto ${isDark ? "text-white/70" : "text-slate-600"}`}>
            Propojíme tvůj Instagram a zobrazíme reach, engagement, nejlepší čas na publikování i top fanoušky. Všechno přehledně na jednom místě.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup" className="inline-flex items-center gap-2 text-white bg-gradient-to-r from-emerald-600 to-teal-500 py-4 px-8 rounded-full text-lg font-semibold shadow-lg hover:shadow-emerald-500/50 transition-all">
              Propojit Instagram
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
            Co všechno se dozvíš o svém profilu
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <div key={index} className={`p-8 rounded-2xl border ${isDark ? "bg-white/5 border-white/10" : "bg-slate-50 border-slate-200"}`}>
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 ${isDark ? "bg-emerald-500/10 text-emerald-400" : "bg-emerald-100 text-emerald-600"}`}>
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

      {/* Stats Preview */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            Metriky, které skutečně potřebuješ
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <Eye className="w-6 h-6" />, label: "Reach", value: "124.5K", trend: "+23%" },
              { icon: <Heart className="w-6 h-6" />, label: "Engagement", value: "8.4%", trend: "+2.1%" },
              { icon: <Users className="w-6 h-6" />, label: "Followers", value: "2,847", trend: "+15%" },
              { icon: <TrendingUp className="w-6 h-6" />, label: "Growth", value: "+247", trend: "+12%" },
            ].map((stat, index) => (
              <div key={index} className={`p-6 rounded-2xl border ${isDark ? "bg-white/5 border-white/10" : "bg-slate-50 border-slate-200"}`}>
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${isDark ? "bg-emerald-500/10 text-emerald-400" : "bg-emerald-100 text-emerald-600"}`}>
                  {stat.icon}
                </div>
                <div className={`text-sm font-medium mb-1 ${isDark ? "text-white/60" : "text-slate-500"}`}>{stat.label}</div>
                <div className="text-2xl font-bold mb-1">{stat.value}</div>
                <div className="text-sm text-green-500 font-semibold">{stat.trend}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className={`max-w-4xl mx-auto text-center p-12 rounded-3xl ${isDark ? "bg-gradient-to-br from-emerald-900/30 to-teal-900/30 border border-white/10" : "bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200"}`}>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Začni růst na Instagramu
          </h2>
          <p className={`text-xl mb-8 ${isDark ? "text-white/70" : "text-slate-600"}`}>
            Propoj svůj profil a získej přístup k pokročilým analytikám zdarma.
          </p>
          <Link href="/signup" className="inline-flex items-center gap-2 text-white bg-gradient-to-r from-emerald-600 to-teal-500 py-4 px-8 rounded-full text-lg font-semibold shadow-lg hover:shadow-emerald-500/50 transition-all">
            Vyzkoušet zdarma
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
