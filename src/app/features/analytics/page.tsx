"use client";

import { FeaturePageLayout } from "@/components/layout/FeaturePageLayout";
import {
  BarChart3,
  TrendingUp,
  Users,
  Eye,
  Heart,
  Target,
  Lightbulb,
  ArrowUpRight,
  Bot,
  Calendar,
  Type,
} from "lucide-react";

export default function AnalyticsPage() {
  const stats = [
    { value: "15+", label: "Sledovaných metrik" },
    { value: "Real-time", label: "Aktualizace dat" },
    { value: "90 dní", label: "Historie dat" },
    { value: "AI", label: "Doporučení" },
  ];

  const steps = [
    {
      number: "1",
      title: "Propoj Instagram",
      description: "Jedním kliknutím propoj svůj Instagram účet přes oficiální API.",
      icon: <Target className="w-7 h-7 text-white" />,
    },
    {
      number: "2",
      title: "Sleduj metriky",
      description: "Všechny důležité statistiky na jednom přehledném dashboardu.",
      icon: <BarChart3 className="w-7 h-7 text-white" />,
    },
    {
      number: "3",
      title: "Získej AI tipy",
      description: "Umělá inteligence ti poradí, jak zlepšit výkon profilu.",
      icon: <Lightbulb className="w-7 h-7 text-white" />,
    },
  ];

  const subFeatures = [
    {
      title: "Výkon profilu v reálném čase",
      description:
        "Sleduj reach, engagement, follower growth a další klíčové metriky na jednom místě. Data se aktualizují automaticky.",
      features: [
        "Reach a impressions za období",
        "Engagement rate s trendy",
        "Přírůstek a úbytek followers",
        "Porovnání s předchozím obdobím",
      ],
      imagePosition: "right" as const,
    },
    {
      title: "AI doporučení pro růst",
      description:
        "Umělá inteligence analyzuje tvá data a říká ti, kdy publikovat, jaký obsah funguje a kde máš prostor pro růst.",
      features: [
        "Optimální čas pro publikování",
        "Analýza nejúspěšnějšího obsahu",
        "Doporučení pro hashtags",
        "Tipy pro zvýšení engagement",
      ],
      imagePosition: "left" as const,
    },
    {
      title: "Detailní analýza publika",
      description:
        "Zjisti, kdo jsou tvoji fanoušci, odkud jsou, kdy jsou online a co je zajímá. Poznej své publikum do detailu.",
      features: [
        "Demografie: věk, pohlaví, lokace",
        "Aktivita followers v čase",
        "Nejaktivnější fanoušci",
        "Zájmy a chování publika",
      ],
      imagePosition: "right" as const,
    },
  ];

  const useCases = [
    {
      icon: <Users className="w-6 h-6 text-white" />,
      title: "Content Creators",
      description: "Pochop, jaký obsah tvé publikum miluje a vytvárej víc.",
    },
    {
      icon: <TrendingUp className="w-6 h-6 text-white" />,
      title: "Influenceři",
      description: "Měř růst, dokazuj hodnotu brandům s daty.",
    },
    {
      icon: <Target className="w-6 h-6 text-white" />,
      title: "Značky",
      description: "Sleduj výkon kampaní a ROI sociálních sítí.",
    },
    {
      icon: <Heart className="w-6 h-6 text-white" />,
      title: "Malé firmy",
      description: "Optimalizuj strategii a šetři čas s AI tipy.",
    },
  ];

  const testimonials = [
    {
      name: "Lucie Veselá",
      role: "Lifestyle blogger · 80K followers",
      text: "Konečně vidím všechny metriky na jednom místě. AI mi řekla, že mám publikovat v pondělí večer - engagement vyrostl o 40%!",
    },
    {
      name: "Tomáš Horák",
      role: "Marketing Manager · Agentura",
      text: "Pro naše klienty potřebujeme přesná data. SocialMat nám šetří hodiny práce s reporty každý měsíc.",
    },
  ];

  const relatedFeatures = [
    {
      title: "Auto-reply",
      description: "AI odpovídá na komentáře místo tebe",
      href: "/features/auto-reply",
      icon: <Bot className="w-5 h-5 text-white" />,
      color: "from-[#E1306C] to-[#F77737]",
    },
    {
      title: "AI Titulky",
      description: "Automatické české titulky s 95% přesností",
      href: "/features/titulky",
      icon: <Type className="w-5 h-5 text-white" />,
      color: "from-[#833AB4] to-[#C13584]",
    },
    {
      title: "Plánování",
      description: "Vizuální kalendář pro plánování obsahu",
      href: "/features/kalendar",
      icon: <Calendar className="w-5 h-5 text-white" />,
      color: "from-[#C13584] to-[#833AB4]",
    },
  ];

  const heroScreenshot = (
    <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-[#1a1a1a]/80 backdrop-blur-xl shadow-2xl">
      {/* Dashboard mockup */}
      <div className="aspect-video bg-gradient-to-br from-[#0A0A0A] to-[#1a1a1a] p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="text-white font-semibold">Přehled profilu</div>
            <div className="text-white/40 text-xs">Posledních 30 dní</div>
          </div>
          <div className="flex gap-2">
            <div className="px-3 py-1.5 bg-white/5 rounded-lg text-white/50 text-xs">7 dní</div>
            <div className="px-3 py-1.5 bg-[#E1306C]/20 text-[#E1306C] rounded-lg text-xs font-medium">30 dní</div>
            <div className="px-3 py-1.5 bg-white/5 rounded-lg text-white/50 text-xs">90 dní</div>
          </div>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            { label: "Reach", value: "124.5K", change: "+23%", icon: Eye },
            { label: "Engagement", value: "8.4%", change: "+2.1%", icon: Heart },
            { label: "Followers", value: "52,847", change: "+847", icon: Users },
            { label: "Posts", value: "24", change: "+8", icon: BarChart3 },
          ].map((stat, i) => (
            <div key={i} className="bg-white/5 rounded-xl p-4 border border-white/10">
              <div className="flex items-center justify-between mb-2">
                <stat.icon className="w-4 h-4 text-white/40" />
                <div className="flex items-center gap-1 text-green-400 text-xs">
                  <ArrowUpRight className="w-3 h-3" />
                  {stat.change}
                </div>
              </div>
              <div className="text-white font-bold text-lg">{stat.value}</div>
              <div className="text-white/40 text-xs">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Chart placeholder */}
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2 bg-white/5 rounded-xl p-4 border border-white/10">
            <div className="text-white text-sm font-medium mb-3">Engagement trend</div>
            <div className="flex items-end gap-1 h-24">
              {[40, 55, 45, 70, 60, 85, 75, 90, 80, 95, 85, 100].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-t bg-gradient-to-t from-[#833AB4] to-[#E1306C]"
                  style={{ height: `${h}%`, opacity: 0.3 + (i / 12) * 0.7 }}
                />
              ))}
            </div>
          </div>
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <div className="text-white text-sm font-medium mb-3">Nejlepší čas</div>
            <div className="space-y-2">
              {[
                { day: "Po", time: "18:00", score: 95 },
                { day: "St", time: "20:00", score: 87 },
                { day: "Pá", time: "19:00", score: 82 },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-8 text-white/40 text-xs">{item.day}</div>
                  <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#833AB4] to-[#E1306C] rounded-full"
                      style={{ width: `${item.score}%` }}
                    />
                  </div>
                  <div className="text-white/60 text-xs w-12">{item.time}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <FeaturePageLayout
      badge="Real-time Data"
      badgeIcon={<BarChart3 className="w-4 h-4 text-[#E1306C]" />}
      title="Vidíš výkon profilu"
      titleGradient="from-[#833AB4] via-[#E1306C] to-[#F77737]"
      subtitle="Propojíme tvůj Instagram a zobrazíme reach, engagement, nejlepší čas na publikování i top fanoušky. Všechno přehledně na jednom místě."
      heroScreenshot={heroScreenshot}
      stats={stats}
      steps={steps}
      subFeatures={subFeatures}
      useCases={useCases}
      testimonials={testimonials}
      ctaTitle="Začni růst na Instagramu"
      ctaSubtitle="Propoj svůj profil a získej přístup k pokročilým analytikám zdarma."
      relatedFeatures={relatedFeatures}
    />
  );
}
