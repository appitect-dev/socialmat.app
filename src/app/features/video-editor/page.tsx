"use client";

import { FeaturePageLayout } from "@/components/layout/FeaturePageLayout";
import {
  Edit3,
  Scissors,
  Download,
  Upload,
  Video,
  Music,
  Type,
  Play,
  Film,
  Bot,
  LineChart,
} from "lucide-react";

export default function VideoEditorPage() {
  const stats = [
    { value: "4K", label: "Max kvalita exportu" },
    { value: "50+", label: "Efektů a přechodů" },
    { value: "30s", label: "Průměrný render" },
    { value: "0", label: "Instalace" },
  ];

  const steps = [
    {
      number: "1",
      title: "Nahraj video",
      description: "Přetáhni video do editoru nebo nahraj z počítače. Podporujeme všechny běžné formáty.",
      icon: <Upload className="w-7 h-7 text-white" />,
    },
    {
      number: "2",
      title: "Uprav a stříhej",
      description: "Použij timeline, přidej efekty, texty, hudbu. AI ti pomůže s automatickými úpravami.",
      icon: <Scissors className="w-7 h-7 text-white" />,
    },
    {
      number: "3",
      title: "Exportuj a sdílej",
      description: "Vyber kvalitu a formát optimalizovaný pro Instagram, TikTok nebo YouTube.",
      icon: <Download className="w-7 h-7 text-white" />,
    },
  ];

  const subFeatures = [
    {
      title: "Intuitivní timeline editor",
      description:
        "Profesionální timeline s drag & drop ovládáním. Přesouvej klipy, měň délku, přidávej vrstvy - vše jako v desktopu, ale přímo v prohlížeči.",
      features: [
        "Multi-track timeline pro video i audio",
        "Přesné ořezávání s frame accuracy",
        "Klávesové zkratky pro rychlou editaci",
        "Zoom a navigace v časové ose",
      ],
      imagePosition: "right" as const,
    },
    {
      title: "AI automatické úpravy",
      description:
        "Nech AI udělat nudnou práci za tebe. Automatické odstranění ticha, vylepšení barev, stabilizace a úprava zvuku jedním kliknutím.",
      features: [
        "Auto-remove silence - odstranění tichých pasáží",
        "AI color correction - vylepšení barev",
        "Stabilizace roztřeseného videa",
        "Audio enhancement - vyčištění zvuku",
      ],
      imagePosition: "left" as const,
    },
    {
      title: "Bohatá knihovna efektů",
      description:
        "50+ profesionálních přechodů, filtrů a efektů. Od jednoduchých fade až po pokročilé motion graphics.",
      features: [
        "Přechody: fade, slide, zoom, glitch a další",
        "Filtry inspirované Instagramem",
        "Animované texty a titulky",
        "Stickery a emoji overlays",
      ],
      imagePosition: "right" as const,
    },
  ];

  const useCases = [
    {
      icon: <Film className="w-6 h-6 text-white" />,
      title: "Reels & TikToky",
      description: "Rychle stříhej krátká videa s trendy efekty a hudbou.",
    },
    {
      icon: <Video className="w-6 h-6 text-white" />,
      title: "YouTube Shorts",
      description: "Optimalizovaný export pro vertikální formát Shorts.",
    },
    {
      icon: <Play className="w-6 h-6 text-white" />,
      title: "Stories",
      description: "Tvoř engaging Stories s texty, stickery a animacemi.",
    },
    {
      icon: <Music className="w-6 h-6 text-white" />,
      title: "Hudební videa",
      description: "Synchronizuj střihy s rytmem hudby automaticky.",
    },
  ];

  const testimonials = [
    {
      name: "Marek Svoboda",
      role: "YouTuber · 85K subscribers",
      text: "Konečně editor, který funguje v prohlížeči a není pomalý. AI automaticky odstraní ticho a ušetří mi hodiny práce.",
    },
    {
      name: "Kristýna Malá",
      role: "TikToker · 120K followers",
      text: "Používám to denně na TikToky. Export je rychlý a kvalita super. Navíc nemusím nic instalovat.",
    },
  ];

  const relatedFeatures = [
    {
      title: "AI Titulky",
      description: "Automatické české titulky s 95% přesností",
      href: "/features/titulky",
      icon: <Type className="w-5 h-5 text-white" />,
      color: "from-[#833AB4] to-[#C13584]",
    },
    {
      title: "Auto-reply",
      description: "AI odpovídá na komentáře místo tebe",
      href: "/features/auto-reply",
      icon: <Bot className="w-5 h-5 text-white" />,
      color: "from-[#E1306C] to-[#F77737]",
    },
    {
      title: "Analytics",
      description: "Sleduj výkon svého profilu v reálném čase",
      href: "/features/analytics",
      icon: <LineChart className="w-5 h-5 text-white" />,
      color: "from-[#F77737] to-[#FCB045]",
    },
  ];

  const heroScreenshot = (
    <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-[#1a1a1a]/80 backdrop-blur-xl shadow-2xl">
      {/* Editor mockup */}
      <div className="aspect-video bg-gradient-to-br from-[#0A0A0A] to-[#1a1a1a]">
        {/* Top toolbar */}
        <div className="h-12 border-b border-white/10 flex items-center px-4 gap-4">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
          </div>
          <div className="flex gap-2">
            <div className="px-3 py-1 rounded bg-white/5 text-white/50 text-xs">Oříznutí</div>
            <div className="px-3 py-1 rounded bg-white/5 text-white/50 text-xs">Efekty</div>
            <div className="px-3 py-1 rounded bg-white/5 text-white/50 text-xs">Text</div>
            <div className="px-3 py-1 rounded bg-[#E1306C]/20 text-[#E1306C] text-xs font-medium">AI Úpravy</div>
          </div>
        </div>

        {/* Main area */}
        <div className="flex h-[calc(100%-48px-80px)]">
          {/* Preview */}
          <div className="flex-1 flex items-center justify-center p-6">
            <div className="relative w-full max-w-md aspect-[9/16] bg-gradient-to-br from-[#833AB4]/30 to-[#E1306C]/30 rounded-lg flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                <Play className="w-8 h-8 text-white ml-1" />
              </div>
              <div className="absolute bottom-4 left-4 right-4 bg-black/50 backdrop-blur rounded-lg p-2">
                <div className="text-white text-xs font-medium">Ahoj, dnes vám ukážu...</div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="w-48 border-l border-white/10 p-3 space-y-2">
            <div className="text-white/50 text-xs mb-2">Efekty</div>
            {["Fade In", "Glitch", "Zoom", "Slide"].map((effect, i) => (
              <div
                key={effect}
                className={`px-3 py-2 rounded text-xs ${i === 1 ? "bg-[#E1306C]/20 text-[#E1306C]" : "bg-white/5 text-white/50"}`}
              >
                {effect}
              </div>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div className="h-20 border-t border-white/10 bg-black/30 p-2">
          <div className="flex gap-1 h-full">
            <div className="w-12 flex-shrink-0 flex flex-col justify-center gap-1 text-[10px] text-white/30">
              <div>Video</div>
              <div>Audio</div>
            </div>
            <div className="flex-1 flex flex-col gap-1">
              <div className="flex-1 flex gap-1">
                <div className="w-1/3 bg-gradient-to-r from-[#833AB4] to-[#E1306C] rounded opacity-80" />
                <div className="w-1/4 bg-gradient-to-r from-[#E1306C] to-[#F77737] rounded opacity-80" />
                <div className="w-1/3 bg-gradient-to-r from-[#F77737] to-[#FCB045] rounded opacity-80" />
              </div>
              <div className="flex-1 flex gap-1">
                <div className="w-3/4 bg-white/10 rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <FeaturePageLayout
      badge="Browser Editor"
      badgeIcon={<Edit3 className="w-4 h-4 text-[#E1306C]" />}
      title="Profesionální video editor"
      titleGradient="from-[#833AB4] via-[#E1306C] to-[#F77737]"
      subtitle="Stříhej, upravuj a exportuj videa jako profesionál. Bez instalace, bez komplikací. Všechno online s pomocí AI."
      heroScreenshot={heroScreenshot}
      stats={stats}
      steps={steps}
      subFeatures={subFeatures}
      useCases={useCases}
      testimonials={testimonials}
      ctaTitle="Začni stříhat videa jako profík"
      ctaSubtitle="Bez závazků, bez platební karty. Vyzkoušej editor zdarma."
      relatedFeatures={relatedFeatures}
    />
  );
}
