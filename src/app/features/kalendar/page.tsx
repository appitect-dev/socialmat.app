"use client";

import { FeaturePageLayout } from "@/components/layout/FeaturePageLayout";
import {
  Calendar as CalendarIcon,
  Clock,
  CheckCircle2,
  Grid3x3,
  Users,
  Sparkles,
  Image as ImageIcon,
  Send,
  Bot,
  LineChart,
  Type,
} from "lucide-react";

export default function KalendarPage() {
  const stats = [
    { value: "30+", label: "Dní dopředu" },
    { value: "Auto", label: "Publikování" },
    { value: "AI", label: "Optimální časy" },
    { value: "Team", label: "Spolupráce" },
  ];

  const steps = [
    {
      number: "1",
      title: "Připrav obsah",
      description: "Nahraj fotky, videa a napíš popisky. Vše na jednom místě.",
      icon: <ImageIcon className="w-7 h-7 text-white" />,
    },
    {
      number: "2",
      title: "Naplánuj v kalendáři",
      description: "Přetáhni posty na konkrétní dny. AI navrhne optimální čas.",
      icon: <CalendarIcon className="w-7 h-7 text-white" />,
    },
    {
      number: "3",
      title: "Publikuj automaticky",
      description: "Systém publikuje posty přesně v naplánovaný čas.",
      icon: <Send className="w-7 h-7 text-white" />,
    },
  ];

  const subFeatures = [
    {
      title: "Vizuální plánování obsahu",
      description:
        "Vidíš celý měsíc najednou. Přetáhni, přesuň nebo zkopíruj posty podle potřeby. Drag & drop jako v Excelu.",
      features: [
        "Měsíční a týdenní zobrazení",
        "Drag & drop přesouvání postů",
        "Kopírování a duplikování",
        "Barevné štítky a kategorie",
      ],
      imagePosition: "right" as const,
    },
    {
      title: "AI optimální čas publikování",
      description:
        "AI analyzuje tvé publikum a navrhne nejlepší čas pro každý post. Publikuj, když jsou tvoji followers online.",
      features: [
        "Analýza aktivity publika",
        "Personalizovaná doporučení",
        "A/B testování časů",
        "Historická data výkonu",
      ],
      imagePosition: "left" as const,
    },
    {
      title: "Týmová spolupráce",
      description:
        "Sdílej kalendář s týmem, přidávej komentáře a schvaluj obsah před publikací. Ideální pro agentury a týmy.",
      features: [
        "Role: Admin, Editor, Viewer",
        "Komentáře a schvalování",
        "Historie změn",
        "Notifikace o úpravách",
      ],
      imagePosition: "right" as const,
    },
  ];

  const useCases = [
    {
      icon: <Users className="w-6 h-6 text-white" />,
      title: "Content Creators",
      description: "Naplánuj celý měsíc obsahu dopředu a udržuj konzistenci.",
    },
    {
      icon: <Sparkles className="w-6 h-6 text-white" />,
      title: "Influenceři",
      description: "Koordinuj sponzorované posty a kampaně s přehledem.",
    },
    {
      icon: <Grid3x3 className="w-6 h-6 text-white" />,
      title: "Značky",
      description: "Spravuj content calendar pro více platforem najednou.",
    },
    {
      icon: <CheckCircle2 className="w-6 h-6 text-white" />,
      title: "Agentury",
      description: "Spolupracuj s klienty na schvalování obsahu.",
    },
  ];

  const testimonials = [
    {
      name: "Anna Procházková",
      role: "Social Media Manager · Agentura",
      text: "Spravuju 8 klientů a bez kalendáře bych se zbláznila. Vidím všechno na jednom místě a klienti mohou schvalovat přímo v appce.",
    },
    {
      name: "Jakub Veselý",
      role: "Content Creator · 95K followers",
      text: "AI mi doporučila publikovat v neděli večer místo pondělí ráno. Reach vyrostl o 50%. Game changer!",
    },
  ];

  const relatedFeatures = [
    {
      title: "Analytics",
      description: "Sleduj výkon svého profilu v reálném čase",
      href: "/features/analytics",
      icon: <LineChart className="w-5 h-5 text-white" />,
      color: "from-[#F77737] to-[#FCB045]",
    },
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
  ];

  const heroScreenshot = (
    <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-[#1a1a1a]/80 backdrop-blur-xl shadow-2xl">
      {/* Calendar mockup */}
      <div className="aspect-video bg-gradient-to-br from-[#0A0A0A] to-[#1a1a1a] p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="text-white font-semibold text-lg">Leden 2026</div>
            <div className="flex gap-1">
              <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/50 text-sm">&lt;</div>
              <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/50 text-sm">&gt;</div>
            </div>
          </div>
          <div className="flex gap-2">
            <div className="px-3 py-1.5 bg-white/5 rounded-lg text-white/50 text-xs">Týden</div>
            <div className="px-3 py-1.5 bg-[#E1306C]/20 text-[#E1306C] rounded-lg text-xs font-medium">Měsíc</div>
          </div>
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-2">
          {/* Day headers */}
          {["Po", "Út", "St", "Čt", "Pá", "So", "Ne"].map((day) => (
            <div key={day} className="text-center text-white/40 text-xs py-2">
              {day}
            </div>
          ))}

          {/* Calendar days */}
          {Array.from({ length: 35 }, (_, i) => {
            const day = i - 2; // Start from previous month
            const isCurrentMonth = day >= 1 && day <= 31;
            const hasPost = [3, 7, 10, 14, 17, 21, 24, 28].includes(day);
            const isToday = day === 15;

            return (
              <div
                key={i}
                className={`aspect-square rounded-lg p-1 ${
                  isCurrentMonth
                    ? isToday
                      ? "bg-[#E1306C]/20 border border-[#E1306C]/50"
                      : "bg-white/5"
                    : "bg-transparent"
                }`}
              >
                <div className={`text-xs ${isCurrentMonth ? "text-white/60" : "text-white/20"}`}>
                  {isCurrentMonth ? day : ""}
                </div>
                {hasPost && isCurrentMonth && (
                  <div className="mt-1">
                    <div className="w-full h-1 rounded-full bg-gradient-to-r from-[#833AB4] to-[#E1306C]" />
                    <div className="text-[8px] text-white/40 mt-0.5 truncate">Post</div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Upcoming posts */}
        <div className="absolute bottom-4 right-4 w-48 bg-white/5 rounded-xl p-3 border border-white/10">
          <div className="text-white text-xs font-medium mb-2">Další publikace</div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-gradient-to-br from-[#833AB4] to-[#E1306C]" />
              <div>
                <div className="text-white/80 text-xs">Reels #23</div>
                <div className="text-white/40 text-[10px] flex items-center gap-1">
                  <Clock className="w-2.5 h-2.5" />
                  Dnes 18:00
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <FeaturePageLayout
      badge="Smart Scheduling"
      badgeIcon={<CalendarIcon className="w-4 h-4 text-[#E1306C]" />}
      title="Plánuj obsah jako profík"
      titleGradient="from-[#833AB4] via-[#E1306C] to-[#F77737]"
      subtitle="Vizuální kalendář pro Instagram, TikTok a další platformy. Naplánuj si celý měsíc dopředu a publikuj v optimální čas."
      heroScreenshot={heroScreenshot}
      stats={stats}
      steps={steps}
      subFeatures={subFeatures}
      useCases={useCases}
      testimonials={testimonials}
      ctaTitle="Naplánuj si celý měsíc dopředu"
      ctaSubtitle="Bez závazků, bez platební karty. Vyzkoušej zdarma."
      relatedFeatures={relatedFeatures}
    />
  );
}
