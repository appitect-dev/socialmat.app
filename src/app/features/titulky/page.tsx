"use client";

import { FeaturePageLayout } from "@/components/layout/FeaturePageLayout";
import {
  Video,
  Upload,
  Wand2,
  Download,
  Camera,
  Mic,
  Radio,
  Users,
  Bot,
  LineChart,
  Edit3,
} from "lucide-react";

export default function TitulkyPage() {
  return (
    <FeaturePageLayout
      badge="AI Powered"
      badgeIcon={<Video className="w-4 h-4 text-[#E1306C]" />}
      title="AI Titulky za sekundy ⚡"
      titleGradient="from-[#833AB4] via-[#E1306C] to-[#F77737]"
      subtitle="Nahraj video a během 30 sekund máš profesionální české titulky. Žádné zdlouhavé přepisování, žádné chyby. Naše AI rozumí češtině perfektně."
      heroScreenshot={
        <div className="rounded-2xl border border-white/10 bg-[#1a1a1a]/80 backdrop-blur-xl overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10 bg-black/30">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
              <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
              <div className="w-3 h-3 rounded-full bg-[#28CA41]" />
            </div>
            <div className="flex-1 flex items-center justify-center gap-2 text-xs text-white/40">
              <div className="px-3 py-1 rounded-md bg-white/5">app.socialmat.cz/titulky</div>
            </div>
          </div>
          <div className="aspect-video bg-[#111] p-4 flex gap-4">
            {/* Video Preview */}
            <div className="flex-1 rounded-xl bg-black relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[#833AB4]/20 to-[#E1306C]/20" />
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-lg bg-black/80 backdrop-blur-sm">
                <span className="text-white font-medium">A tohle je <span className="text-[#E1306C]">klíčové slovo</span> ✨</span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
                <div className="h-full w-2/3 bg-gradient-to-r from-[#833AB4] to-[#E1306C]" />
              </div>
            </div>
            {/* Settings */}
            <div className="w-64 rounded-xl bg-white/5 p-4">
              <div className="text-sm font-semibold text-white mb-4">Styl titulků</div>
              <div className="space-y-3">
                <div className="p-2 rounded-lg bg-white/10">
                  <span className="text-xs text-white/50">Font</span>
                  <div className="text-sm text-white font-semibold">Montserrat Bold</div>
                </div>
                <div>
                  <span className="text-xs text-white/50">Barva zvýraznění</span>
                  <div className="mt-2 flex gap-2">
                    {["#E1306C", "#833AB4", "#F77737", "#FCB045"].map((color, i) => (
                      <div key={i} className={`w-8 h-8 rounded-lg ${i === 0 ? "ring-2 ring-white" : ""}`} style={{ background: color }} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      }
      stats={[
        { value: "95%+", label: "Přesnost rozpoznání" },
        { value: "30s", label: "Průměrný čas zpracování" },
        { value: "CZ/SK", label: "Podpora jazyků" },
        { value: "10k+", label: "Videí denně" },
      ]}
      steps={[
        {
          number: "1",
          title: "Nahraj video",
          description: "Drag & drop nebo vyber soubor. Podporujeme MP4, MOV, WebM a další.",
          icon: <Upload className="w-8 h-8 text-white" />,
        },
        {
          number: "2",
          title: "AI zpracuje",
          description: "Naše AI přepíše řeč a vytvoří perfektně načasované titulky.",
          icon: <Wand2 className="w-8 h-8 text-white" />,
        },
        {
          number: "3",
          title: "Exportuj",
          description: "Stáhni jako SRT, TXT nebo video s vypálenými titulky.",
          icon: <Download className="w-8 h-8 text-white" />,
        },
      ]}
      subFeatures={[
        {
          title: "Automatický přepis s 95% přesností",
          description: "Naše AI je speciálně trénovaná na češtinu a slovenštinu. Rozpozná i rychlou řeč, dialekty, slang a hudbu na pozadí.",
          features: [
            "Rozpoznání více mluvčích",
            "Automatická interpunkce",
            "Korekce překlepů a gramatiky",
            "Časové značky na milisekundy",
          ],
          imagePosition: "right" as const,
        },
        {
          title: "Kompletní stylizace titulků",
          description: "Vyber si z desítek fontů, barev a animací. Nebo vytvoř vlastní brandový styl a použij ho na všechna videa.",
          features: [
            "20+ profesionálních fontů",
            "Vlastní barvy a pozadí",
            "Animace (fade, pop, highlight)",
            "Pozice a velikost na míru",
          ],
          imagePosition: "left" as const,
        },
        {
          title: "Flexibilní export",
          description: "Exportuj titulky v jakémkoliv formátu nebo je rovnou vypal do videa. Optimalizováno pro všechny platformy.",
          features: [
            "SRT, VTT, TXT formáty",
            "Video s vypálenými titulky",
            "Optimalizace pro Instagram, TikTok, YouTube",
            "Hromadný export více videí",
          ],
          imagePosition: "right" as const,
        },
      ]}
      useCases={[
        {
          icon: <Camera className="w-6 h-6 text-white" />,
          title: "Content Creators",
          description: "Reels, TikToky a Stories s profesionálními titulky za minutu.",
        },
        {
          icon: <Mic className="w-6 h-6 text-white" />,
          title: "Podcastersi",
          description: "Přepiš celé epizody a vytvoř highlight clips.",
        },
        {
          icon: <Radio className="w-6 h-6 text-white" />,
          title: "YouTubeři",
          description: "Automatické titulky pro lepší SEO a dostupnost.",
        },
        {
          icon: <Users className="w-6 h-6 text-white" />,
          title: "Agentury",
          description: "Zpracuj desítky videí pro klienty každý den.",
        },
      ]}
      testimonials={[
        {
          name: "Tereza Králová",
          role: "Content Creator · 52K followers",
          text: "Titulky mi dřív zabraly hodiny. Teď nahraju video a za minutu mám hotovo. Kvalita je úplně stejná jako když jsem to dělala ručně.",
        },
        {
          name: "Jakub Novotný",
          role: "Fitness Influencer · 128K followers",
          text: "Nejlepší investice do mého contentu. Titulky zvýšily watch time o 40% a engagement o 25%.",
        },
      ]}
      ctaTitle="Začni vytvářet titulky ještě dnes ✨"
      ctaSubtitle="Bez závazků, bez platební karty. Vyzkoušej 10 minut zdarma."
      relatedFeatures={[
        {
          title: "Auto-reply Chatbot",
          description: "Automatické odpovědi na komentáře a DM ve tvém tónu.",
          href: "/features/auto-reply",
          icon: <Bot className="w-6 h-6 text-white" />,
          color: "from-[#E1306C] to-[#F77737]",
        },
        {
          title: "Video Editor",
          description: "Střih videí přímo v prohlížeči s AI nástroji.",
          href: "/features/video-editor",
          icon: <Edit3 className="w-6 h-6 text-white" />,
          color: "from-[#833AB4] to-[#E1306C]",
        },
        {
          title: "Analytics Dashboard",
          description: "Real-time metriky a AI doporučení pro růst.",
          href: "/features/analytics",
          icon: <LineChart className="w-6 h-6 text-white" />,
          color: "from-[#F77737] to-[#FCB045]",
        },
      ]}
    />
  );
}
