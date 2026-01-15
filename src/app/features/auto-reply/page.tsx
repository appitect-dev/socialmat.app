"use client";

import { FeaturePageLayout } from "@/components/layout/FeaturePageLayout";
import {
  MessageSquare,
  Bot,
  Zap,
  Shield,
  Heart,
  Users,
  TrendingUp,
  LineChart,
  Calendar,
  Type,
} from "lucide-react";

export default function AutoReplyPage() {
  const stats = [
    { value: "10s", label: "Průměrná doba odpovědi" },
    { value: "97%", label: "Přesnost AI odpovědí" },
    { value: "+37%", label: "Vyšší engagement" },
    { value: "24/7", label: "Non-stop aktivita" },
  ];

  const steps = [
    {
      number: "1",
      title: "Fanoušek napíše komentář",
      description: "AI okamžitě zachytí nový komentář pod tvým postem nebo Reels.",
      icon: <MessageSquare className="w-7 h-7 text-white" />,
    },
    {
      number: "2",
      title: "AI vytvoří odpověď",
      description: "Vygeneruje odpověď v tvém stylu podle kontextu komentáře.",
      icon: <Bot className="w-7 h-7 text-white" />,
    },
    {
      number: "3",
      title: "Schválíš nebo autopilot",
      description: "Můžeš odpověď schválit nebo nechat AI publikovat automaticky.",
      icon: <Zap className="w-7 h-7 text-white" />,
    },
  ];

  const subFeatures = [
    {
      title: "AI odpovědi ve tvém stylu",
      description:
        "Nastav tón komunikace a AI bude odpovídat fanouškům profesionálně, přátelsky a včas. V češtině i angličtině.",
      features: [
        "Personalizované odpovědi podle kontextu",
        "Podpora češtiny, slovenštiny i angličtiny",
        "Nastavitelný tón: formální / neformální",
        "Učí se z tvých předchozích odpovědí",
      ],
      imagePosition: "right" as const,
    },
    {
      title: "Automatické filtrování spamu",
      description:
        "AI rozpozná spam, toxické komentáře a nevhodný obsah. Ty se jen zaměř na pozitivní interakce.",
      features: [
        "Detekce spamu a reklamních komentářů",
        "Filtrování toxických zpráv",
        "Skrytí nevhodného obsahu",
        "Whitelist pro důležité účty",
      ],
      imagePosition: "left" as const,
    },
    {
      title: "Schválení jedním kliknutím",
      description:
        "Zkontroluj AI odpovědi před odesláním nebo nech běžet na autopilot. Máš plnou kontrolu.",
      features: [
        "Preview odpovědi před publikací",
        "Autopilot režim pro rutinní dotazy",
        "Editace AI návrhů",
        "Historie všech konverzací",
      ],
      imagePosition: "right" as const,
    },
  ];

  const useCases = [
    {
      icon: <Users className="w-6 h-6 text-white" />,
      title: "Content Creators",
      description: "Stihni odpovědět všem fanouškům i při tisících komentářů.",
    },
    {
      icon: <TrendingUp className="w-6 h-6 text-white" />,
      title: "Influenceři",
      description: "Udržuj engagement rate vysoko bez hodin práce.",
    },
    {
      icon: <Heart className="w-6 h-6 text-white" />,
      title: "Malé značky",
      description: "Buduj komunitu a odpovídej zákazníkům 24/7.",
    },
    {
      icon: <Shield className="w-6 h-6 text-white" />,
      title: "Agentury",
      description: "Spravuj více klientů efektivně z jednoho místa.",
    },
  ];

  const testimonials = [
    {
      name: "Petra Novotná",
      role: "Influencer · 150K followers",
      text: "Dostávám stovky komentářů denně. Bez Auto Reply bych to nestíhala. Teď odpovídám všem a engagement mi vyrostl o třetinu.",
    },
    {
      name: "David Krejčí",
      role: "E-shop owner · 45K followers",
      text: "Zákazníci dostávají odpověď do minuty místo hodin. Automatické filtry mě zbavily spamu a haterů.",
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
      title: "Analytics",
      description: "Sleduj výkon svého profilu v reálném čase",
      href: "/features/analytics",
      icon: <LineChart className="w-5 h-5 text-white" />,
      color: "from-[#F77737] to-[#FCB045]",
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
      {/* Chat interface mockup */}
      <div className="aspect-video bg-gradient-to-br from-[#0A0A0A] to-[#1a1a1a] p-6">
        <div className="grid grid-cols-2 gap-6 h-full">
          {/* Comments list */}
          <div className="space-y-3">
            <div className="text-white/50 text-xs mb-2 flex items-center justify-between">
              <span>Nové komentáře</span>
              <span className="bg-[#E1306C] text-white text-[10px] px-2 py-0.5 rounded-full">12 nových</span>
            </div>
            {[
              { user: "@jana.style", text: "Kde koupím ty náušnice? ", time: "2m", status: "pending" },
              { user: "@petr.foto", text: "Super video! Jakou kameru používáš?", time: "5m", status: "replied" },
              { user: "@marie_22", text: "Moc hezké, díky za inspiraci!", time: "8m", status: "replied" },
            ].map((comment, i) => (
              <div
                key={i}
                className={`p-3 rounded-xl border ${comment.status === "pending" ? "bg-[#E1306C]/10 border-[#E1306C]/30" : "bg-white/5 border-white/10"}`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-white text-xs font-medium">{comment.user}</span>
                  <span className="text-white/30 text-[10px]">{comment.time}</span>
                </div>
                <p className="text-white/60 text-xs">{comment.text}</p>
                {comment.status === "pending" && (
                  <div className="flex gap-2 mt-2">
                    <div className="px-2 py-1 bg-[#E1306C] text-white text-[10px] rounded">Odpovědět</div>
                    <div className="px-2 py-1 bg-white/10 text-white/50 text-[10px] rounded">Autopilot</div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* AI Response panel */}
          <div className="bg-white/5 rounded-xl border border-white/10 p-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#833AB4] to-[#E1306C] flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="text-white text-xs font-medium">AI Odpověď</div>
                <div className="text-white/30 text-[10px]">Pro @jana.style</div>
              </div>
            </div>

            <div className="bg-white/5 rounded-lg p-3 mb-4">
              <p className="text-white/80 text-sm">
                Ahoj! Ty náušnice jsou od @czechjewelry - mám je ve stories zvýrazněných.
              </p>
            </div>

            <div className="flex items-center gap-2 text-[10px] text-white/30 mb-4">
              <Zap className="w-3 h-3" />
              <span>Tón: Přátelský · Jazyk: Čeština</span>
            </div>

            <div className="flex gap-2">
              <div className="flex-1 px-3 py-2 bg-gradient-to-r from-[#833AB4] to-[#E1306C] text-white text-xs rounded-lg text-center font-medium">
                Odeslat odpověď
              </div>
              <div className="px-3 py-2 bg-white/10 text-white/50 text-xs rounded-lg">
                Upravit
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <FeaturePageLayout
      badge="AI Powered"
      badgeIcon={<MessageSquare className="w-4 h-4 text-[#E1306C]" />}
      title="Odpovídáme na komentáře"
      titleGradient="from-[#833AB4] via-[#E1306C] to-[#F77737]"
      subtitle="Nastav tón komunikace a SocialMat bude odpovídat fanouškům profesionálně, přátelsky a včas. Ty jen schválíš nebo necháš běžet na autopilot."
      heroScreenshot={heroScreenshot}
      stats={stats}
      steps={steps}
      subFeatures={subFeatures}
      useCases={useCases}
      testimonials={testimonials}
      ctaTitle="Začni odpovídat rychleji než konkurence"
      ctaSubtitle="Bez závazků, bez platební karty. Vyzkoušej Auto Reply zdarma."
      relatedFeatures={relatedFeatures}
    />
  );
}
