"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowRight,
  Brain,
  BarChart3,
  Calendar,
  ChevronDown,
  Edit3,
  Image,
  Lightbulb,
  MessageSquare,
  Moon,
  PlayCircle,
  Sparkles,
  Sun,
  Video,
  Zap,
  DollarSign,
  MessageCircle,
  Shield,
  TrendingUp,
  Users,
} from "lucide-react";

export default function LandingPage() {
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [featuresDropdownOpen, setFeaturesDropdownOpen] = useState(false);

  const navRef = useRef<HTMLDivElement | null>(null);
  const heroRef = useRef<HTMLElement | null>(null);
  const featuresRef = useRef<HTMLElement | null>(null);
  const statsRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => setTheme(mediaQuery.matches ? "dark" : "light");

    handleChange();
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const isDark = theme === "dark";
  const palette = {
    page: isDark ? "bg-[#03050b] text-white" : "bg-white text-slate-900",
  };
  const currentYear = new Date().getFullYear();

  const heroHighlights = [
    {
      badge: "Content ops",
      title: "AI titulky v brandu",
      description: "Templates drží fonty, barvy i motion pro každý kanál.",
      metric: "98.6%",
      icon: "video",
    },
    {
      badge: "Analytics",
      title: "Realtime přehled",
      description: "Sleduj reach, retention i sentiment přímo z hero panelu.",
      metric: "Live",
      icon: "chart",
    },
    {
      badge: "Crew log",
      title: "AI odpoví a hlídá SLA",
      description: "Komentáře a DM mají audit trail i přepnutí na člověka.",
      metric: "<10s",
      icon: "idea",
    },
  ];

  const cockpitMetrics = [
    { label: "Zapojené profily", value: "12", detail: "Workspace" },
    { label: "Aktivní kampaně", value: "5", detail: "Mission" },
    { label: "Čas do exportu", value: "0:32", detail: "Fronta" },
    { label: "DM hand-offs", value: "2", detail: "Crew" },
  ];

  const tapeMessages = [
    "Mission control · SocialMat",
    "Realtime ops",
    "AI titulky",
    "Komentáře → lead",
  ];

  const featureBenefits = [
    "Každý modul je specialista, ale sdílí stejný data layer",
    "Brief, scénář i export se drží v jednom canvasu",
    "Automatizace loguje výsledky, takže víš co fungovalo",
  ];

  const systemTracks = [
    {
      badge: "Lane 01",
      title: "AI Content Studio",
      summary:
        "Headliny, storyboardy i titulky vznikají v jednom editoru s historií verzí.",
      modules: [
        {
          title: "Ideation",
          description:
            "Hook, CTA i captions ve třech variantách. Brief exportujeme do Notion i Slacku.",
          tags: ["CZ + EN copy", "Plán na měsíc"],
          href: "/features/ai-content",
        },
        {
          title: "Storyboard",
          description: "Klíčové scény a overlays připravíš drag & dropem.",
          tags: ["Brand kit", "Motion presets"],
          href: "/features/video-editor",
        },
        {
          title: "Launch decks",
          description: "Brief + assety posíláme týmu i freelancerům.",
          tags: ["PDF + Notion", "Sdílené checklisty"],
          href: "/features/projects",
        },
      ],
    },
    {
      badge: "Lane 02",
      title: "Automatizace komentářů & DM",
      summary:
        "Komentáře, odpovědi i follow-upy běží jako scénáře. Vybereš tón komunikace, SocialMat hlídá SLA i předání člověku.",
      modules: [
        {
          title: "Auto Reply",
          description:
            "Odpovídáme v češtině i angličtině, filtrujeme spam a logujeme každou reakci.",
          tags: ["Tón značky", "Schválení jedním klikem"],
          href: "/features/auto-reply",
        },
        {
          title: "DM Playbooks",
          description: "Keyword spouští PDF, slevu nebo booking link a sleduje konverze.",
          tags: ["UTM tracking", "Follow-up po 24h"],
          href: "/features/analytics",
        },
        {
          title: "Kalendář dropů",
          description: "Launch sekvence přes Stories, Reels i e-mail v jednom časovém plánu.",
          tags: ["Drag & drop", "Sdílené checklisty"],
          href: "/features/kalendar",
        },
      ],
    },
    {
      badge: "Lane 03",
      title: "Insights & řízení výkonu",
      summary:
        "Dashboard, který propojuje metriky účtu, obsahové inspekce a AI doporučení do jednoho logu.",
      modules: [
        {
          title: "Account Telemetry",
          description: "Reach, engagement a nejlepší časy publikace mapujeme po hodinách.",
          tags: ["Benchmark odvětví", "Top fanoušci"],
          href: "/features/analytics",
        },
        {
          title: "Obsahový audit",
          description: "AI vysvětlí, které hooky a délky fungují a navrhne další iteraci.",
          tags: ["Predikce výkonu", "Content tags"],
          href: "/features/stories",
        },
        {
          title: "Braintrust",
          description:
            "Tým vidí, kdo schválil titulky, kdo odpověděl na DM a co čeká na edit.",
          tags: ["Audit log", "Role & SLA"],
          href: "/dashboard",
        },
      ],
    },
  ];

  const automationFlows = [
    {
      stage: "Komentář",
      title: "Fanoušek napíše klíčové slovo",
      detail:
        "Sledujeme klíčová slova pod Reels i carouselem a spouštíme scénář jen pro kvalifikované komentáře.",
      outcome: "Trigger zachycen do 3 s",
    },
    {
      stage: "Reply",
      title: "Veřejná odpověď v nastaveném tónu",
      detail:
        "AI odpověď může obsahovat emoji, odkazy i kontext poslední kampaně. Stačí schválit nebo nechat auto mode.",
      outcome: "Publikováno do 10 s",
    },
    {
      stage: "DM",
      title: "Soukromé navázání v DM",
      detail:
        "Pošleme PDF, slevu nebo booking link. Každý DM dostane UTM parametr a uvidíte, kolik prodejů přinesl.",
      outcome: "+37% leadů",
    },
    {
      stage: "Follow-up",
      title: "Automatické připomenutí",
      detail:
        "Pokud uživatel neodpoví, SocialMat připomene benefit po 24 hodinách a přepne konverzaci na člověka, když je hotový deal.",
      outcome: "Service handoff",
    },
  ];

  const automationBenefits = [
    "Automatické zachytávání poptávky i mimo pracovní dobu",
    "Každý komentář i DM má historii a odpovědnou osobu",
    "AI odpovědi udržují tón značky bez manuální práce",
    "Follow-up se spouští jen u relevantních leadů",
  ];

  const insightWidgets = [
    {
      label: "Výkon účtu",
      value: "124k reach",
      description: "Denní vývoj reach + retention s barevným zvýrazněním odchylek.",
    },
    {
      label: "AI Debrief",
      value: "3 doporučení",
      description: "Shrnutí toho, proč poslední video fungovalo a co zopakovat příště.",
    },
    {
      label: "Brainstorm board",
      value: "7 hooků",
      description: "AI generuje hook, CTA a outlines v češtině i angličtině pro další content drop.",
    },
  ];

  const insightSteps = [
    "Zobrazování metrik účtu a obsahu v reálném čase",
    "AI vysvětlí, co stáhlo výkon nahoru nebo dolů",
    "Brainstorming dalších postů včetně titulků a CTA",
  ];

  const statHighlights = [
    {
      value: 98.6,
      suffix: "%",
      label: "Přesnost AI titulků",
      detail: "Validované na 50k klipech",
      decimals: 1,
    },
    {
      value: 0.32,
      suffix: " s",
      label: "Průměrná latence fronty",
      detail: "Od uploadu po export",
      decimals: 2,
    },
    {
      value: 10000,
      suffix: "+",
      label: "Vytvořených titulků denně",
      detail: "Napříč brandy a agenturami",
      decimals: 0,
    },
    {
      value: 2.3,
      suffix: "x",
      label: "Růst engagement",
      detail: "Po 30 dnech používání",
      decimals: 1,
    },
  ];

  const [accuracyStat, speedStat, throughputStat, engagementStat] = statHighlights;

  const statStorylines = [
    "12k videí denně se zpracuje s brand šablonami",
    "Komentáře a DM mají audit trail a SLA",
    "Týmy vidí výsledky kampaní po hodinách, ne týdnech",
  ];

  const pricingPlans = [
    {
      name: "Starter",
      price: "Zdarma",
      period: "na vždy",
      desc: "Na vyzkoušení a první titulky.",
      perks: [
        "10 minut zpracování měsíčně",
        "Základní šablony titulků",
        "Export MP4 se spálenými titulky",
      ],
      cta: "Začít zdarma",
      highlight: false,
    },
    {
      name: "Pro",
      price: "€10",
      period: "/ měsíc",
      desc: "Pro tvůrce, kteří publikují denně.",
      perks: [
        "180 minut zpracování měsíčně",
        "Prémiové šablony a barvy",
        "Export SRT + MP4 + auto-reels",
        "Prioritní fronta zpracování",
      ],
      cta: "Zvolit Pro",
      highlight: true,
    },
    {
      name: "Business",
      price: "Kontaktujte nás",
      period: "",
      desc: "Pro týmy, agentury a velké objemy.",
      perks: [
        "Neomezené minuty",
        "SSO a týmové workspace",
        "Vyhrazená podpora a SLA",
        "Custom brand šablony",
      ],
      cta: "Domluvit demo",
      highlight: false,
    },
  ];

  const testimonials = [
    {
      name: "Jakub Novák",
      role: "Content Creator",
      avatar: "JN",
      rating: 5,
      text: "SocialMat mi ušetřil spoustu času. Dřív jsem musel používat 3 různé aplikace, teď mám všechno na jednom místě. Titulky, editing, AI content - prostě skvělé!",
    },
    {
      name: "Marie Svobodová",
      role: "Marketing Manager",
      avatar: "MS",
      rating: 5,
      text: "Konečně nemusíme platit za Captions, ManyChat a další nástroje zvlášť. SocialMat má všechno co potřebujeme a za zlomek ceny.",
    },
    {
      name: "Petr Dvořák",
      role: "Social Media Specialist",
      avatar: "PD",
      rating: 5,
      text: "Kvalita AI titulků je úžasná a video editor je tak intuitivní. Vytvářím reels 3x rychleji než předtím.",
    },
    {
      name: "Anna Králová",
      role: "Influencer",
      avatar: "AK",
      rating: 5,
      text: "Miluji automatické generování contentových nápadů. AI mi pomáhá udržet konzistenci a kvalitu napříč všemi platformami.",
    },
    {
      name: "Tomáš Procházka",
      role: "Video Producer",
      avatar: "TP",
      rating: 5,
      text: "Jako profesionál jsem skeptický k novým nástrojům, ale SocialMat mě opravdu překvapil. Workflow je naprosto hladký.",
    },
    {
      name: "Lucie Černá",
      role: "Digital Marketer",
      avatar: "LČ",
      rating: 5,
      text: "ROI je neuvěřitelný. Za cenu jednoho nástroje mám kompletní social media suite. Doporučuji všem!",
    },
  ];

  const [heroTestimonial, ...otherTestimonials] = testimonials;

  const competitorComparison = [
    {
      tool: "ManyChat",
      price: "$15/měsíc",
      features: ["Chatboty", "Automatizace"],
    },
    {
      tool: "Captions",
      price: "$20/měsíc",
      features: ["AI Titulky"],
    },
    {
      tool: "CapCut Pro",
      price: "$10/měsíc",
      features: ["Video Editing"],
    },
    {
      tool: "Buffer",
      price: "$12/měsíc",
      features: ["Plánování", "Analytics"],
    },
    {
      tool: "ChatGPT Plus",
      price: "$20/měsíc",
      features: ["AI Content"],
    },
  ];

  const competitorTotal = "$77 / měsíc";

  const faqItems = [
    {
      question: "Jak přesná je AI při rozpoznávání české řeči?",
      answer:
        "Naše AI je trénovaná speciálně na češtinu a slovenštinu včetně dialektů a slangu. Přesnost je 95%+ i u rychlé řeči nebo videa s hudbou v pozadí. Titulky můžete samozřejmě kdykoliv upravit.",
    },
    {
      question: "Musím zadávat kreditní kartu pro vyzkoušení zdarma?",
      answer:
        "Ne! Můžete vyzkoušet SocialMat na 14 dní zcela zdarma bez zadání platební karty. Žádné automatické prodloužení, žádné skryté poplatky.",
    },
    {
      question: "Jaké sociální sítě podporujete?",
      answer:
        "Momentálně podporujeme Instagram (Reels, Stories, posty) a TikTok. Připravujeme integraci s YouTube Shorts, Facebookem a LinkedIn.",
    },
    {
      question: "Mohu si přizpůsobit styl titulků podle své značky?",
      answer:
        "Ano! Nastavíte barvy, fonty, pozici titulků, velikost textu i animace. Všechna nastavení se ukládají jako vaše šablona pro příští videa.",
    },
    {
      question: "Jak rychle dostanu hotové video s titulky?",
      answer:
        "U běžného 30-60 vteřinového Reels to trvá průměrně 20-40 sekund. Delší videa (3-5 minut) zpracujeme do 2 minut včetně exportu.",
    },
    {
      question: "Co když mi nevyhovuje placený plán?",
      answer:
        "Můžete kdykoliv zrušit předplatné. Pokud nejste spokojeni během prvních 30 dní, vrátíme vám peníze zpět. Chceme jen spokojené zákazníky.",
    },
  ];

  const footerLinks = [
    {
      title: "Produkt",
      items: [
        { label: "Funkcionality", href: "#features" },
        { label: "Automatizace", href: "#automation" },
        { label: "Mission Control", href: "#automation" },
      ],
    },
    {
      title: "Společnost",
      items: [
        { label: "Dashboard", href: "/dashboard" },
        { label: "Ceník", href: "#pricing" },
        { label: "Kontakt", href: "mailto:hello@socialmat.app" },
      ],
    },
    {
      title: "Právní",
      items: [
        { label: "Privacy", href: "/privacy" },
        { label: "Data Deletion", href: "/data-deletion" },
      ],
    },
  ];

  const gridLineColor = isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)";
  const spotlightGradient = isDark
    ? "radial-gradient(80% 220% at 50% 8%, rgba(255,255,255,0.22), rgba(255,255,255,0.10) 30%, rgba(255,255,255,0.03) 65%, rgba(255,255,255,0) 100%)"
    : "radial-gradient(80% 220% at 50% 8%, rgba(79,70,229,0.20), rgba(59,130,246,0.10) 35%, rgba(255,255,255,0.70) 58%, rgba(255,255,255,0) 100%)";

  useEffect(() => {
    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);

    // Navigation animation (immediate)
    if (navRef.current) {
      gsap.set(navRef.current, { opacity: 1 });
      gsap.fromTo(
        navRef.current,
        { y: -20 },
        { y: 0, duration: 0.8, ease: "power2.out", delay: 0.1 }
      );
    }

    // Hero section animations - play immediately since it's above the fold
    const heroTl = gsap.timeline({ delay: 0.2 });

    heroTl
      .fromTo(
        ".hero-title",
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
      )
      .fromTo(
        ".hero-subtitle",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
        "-=0.4"
      )
      .fromTo(
        ".hero-buttons",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
        "-=0.3"
      );

    // Features section animations
    const featuresTl = gsap.timeline({
      scrollTrigger: {
        trigger: featuresRef.current,
        start: "top 90%",
        once: true,
      },
    });

    featuresTl
      .fromTo(
        ".features-title",
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
      )
      .fromTo(
        ".features-subtitle",
        { opacity: 0, y: 25 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
        "-=0.4"
      )
      .fromTo(
        ".features-grid",
        { opacity: 0, scale: 0.98, y: 15 },
        { opacity: 1, scale: 1, y: 0, duration: 0.7, ease: "power2.out" },
        "-=0.3"
      )
      .fromTo(
        ".feature-card",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out", stagger: 0.1 },
        "-=0.35"
      );

    // Stats section animations
    const statsTl = gsap.timeline({
      scrollTrigger: {
        trigger: statsRef.current,
        start: "top 90%",
        once: true,
      },
    });

    statsTl
      .fromTo(
        ".stats-heading",
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
      )
      .fromTo(
        ".stats-subtitle",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
        "-=0.4"
      )
      .fromTo(
        ".stat-item",
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power2.out", stagger: 0.1 },
        "-=0.3"
      );

    // Cleanup function
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const CountUp = ({
    value,
    suffix = "",
    decimals = 0,
    duration = 1600,
  }: {
    value: number;
    suffix?: string;
    decimals?: number;
    duration?: number;
  }) => {
    const [display, setDisplay] = useState(0);
    const hasAnimated = useRef(false);
    const nodeRef = useRef<HTMLSpanElement | null>(null);

    useEffect(() => {
      const node = nodeRef.current;
      if (!node) return;

      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && !hasAnimated.current) {
            hasAnimated.current = true;
            const start = performance.now();
            const animate = (time: number) => {
              const progress = Math.min((time - start) / duration, 1);
              const eased = 1 - Math.pow(1 - progress, 3); // cubic ease-out
              const current = Math.min(value, value * eased);
              setDisplay(current);
              if (progress < 1) requestAnimationFrame(animate);
            };
            requestAnimationFrame(animate);
          }
        },
        { threshold: 0.3 }
      );

      observer.observe(node);
      return () => observer.disconnect();
    }, [value, duration]);

    const formatted =
      value >= 1000
        ? Math.round(display).toLocaleString("cs-CZ")
        : display.toFixed(decimals);

    return (
      <span ref={nodeRef}>
        {formatted}
        {suffix}
      </span>
    );
  };

  return (
    <div className={`${palette.page} font-sans overflow-visible`}>
      {/* Grain texture overlay */}
      <div
        className="fixed top-0 left-0 w-full h-full pointer-events-none opacity-[0.015] z-[1]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='turbulence' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Navigation */}
      <nav
        ref={navRef}
        className="fixed top-4 inset-x-0 z-50 flex justify-center px-4 opacity-0"
      >
        <div
          className={`${isDark ? "bg-black/40" : "bg-white/70"} backdrop-blur-2xl border rounded-2xl px-6 py-3.5 flex items-center justify-between w-full max-w-5xl transition-all duration-300 ${isDark ? "border-white/10 shadow-2xl shadow-black/20" : "border-slate-200/50 shadow-xl shadow-slate-900/5"}`}
        >
          {/* LOGO */}
          <button
            onClick={() => {
              window.location.href = "/";
            }}
            className={`flex items-center gap-2.5 font-bold text-xl tracking-tight cursor-pointer font-heading group ${isDark ? "text-white" : "text-slate-900"
              }`}
          >
            <div className={`w-8 h-8 rounded-lg ${isDark ? "bg-white/10" : "bg-slate-900"} flex items-center justify-center`}>
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            SocialMat
          </button>

          {/* CENTER LINKS */}
          <div className="hidden md:flex items-center gap-1 text-sm font-medium">
            {/* Features Dropdown */}
            <div className="relative">
              <button
                onClick={() => setFeaturesDropdownOpen(!featuresDropdownOpen)}
                onBlur={() => setTimeout(() => setFeaturesDropdownOpen(false), 150)}
                className={`px-4 py-2 rounded-xl transition-all duration-200 flex items-center gap-1.5 ${isDark ? "text-white/80 hover:text-white hover:bg-white/10" : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"}`}
              >
                Funkce
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${featuresDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              {featuresDropdownOpen && (
                <div className={`absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64 rounded-2xl shadow-2xl border overflow-hidden z-50 ${isDark ? 'bg-black/95 backdrop-blur-xl border-white/10' : 'bg-white backdrop-blur-xl border-slate-200'}`}>
                  <div className="p-2">
                    {[
                      { href: "/features/titulky", icon: Video, title: "AI Titulky", desc: "Automatické titulky" },
                      { href: "/features/video-editor", icon: Edit3, title: "Video Editor", desc: "Úprava videí" },
                      { href: "/features/analytics", icon: BarChart3, title: "Analýzy", desc: "Metriky & statistiky" },
                      { href: "/features/stories", icon: Image, title: "Stories", desc: "Tvorba Stories" },
                      { href: "/features/kalendar", icon: Calendar, title: "Kalendář", desc: "Plánování obsahu" },
                      { href: "/features/ai-content", icon: Brain, title: "AI Content", desc: "Generování obsahu" },
                    ].map((item) => {
                      const Icon = item.icon;
                      return (
                        <a key={item.href} href={item.href} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${isDark ? 'hover:bg-white/10 text-white/85' : 'hover:bg-slate-50 text-slate-700'}`}>
                          <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${isDark ? "bg-white/5" : "bg-slate-100"}`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold text-sm">{item.title}</div>
                            <div className={`text-xs ${isDark ? 'text-white/50' : 'text-slate-500'}`}>{item.desc}</div>
                          </div>
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
            <button
              onClick={() => scrollToSection("pricing")}
              className={`px-4 py-2 rounded-xl transition-all duration-200 ${isDark ? "text-white/80 hover:text-white hover:bg-white/10" : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"}`}
            >
              Ceník
            </button>
            <button
              onClick={() => scrollToSection("contact")}
              className={`px-4 py-2 rounded-xl transition-all duration-200 ${isDark ? "text-white/80 hover:text-white hover:bg-white/10" : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"}`}
            >
              Kontakt
            </button>
          </div>

          {/* RIGHT BUTTONS */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setTheme(isDark ? "light" : "dark")}
              className={`p-2 rounded-xl transition-all duration-200 ${isDark ? "bg-white/10 hover:bg-white/15 text-white/80" : "bg-slate-100 hover:bg-slate-200 text-slate-600"}`}
              aria-pressed={isDark}
            >
              <span className="sr-only">Přepnout vzhled</span>
              {isDark ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>
            <a
              href="/dashboard"
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${isDark ? "text-white/80 hover:text-white hover:bg-white/10" : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"}`}
            >
              Přihlášení
            </a>
            <a
              href="/signup"
              className={`${isDark ? "bg-white text-black" : "bg-slate-900 text-white"} py-2 px-5 rounded-xl text-sm font-semibold transition-all duration-300 cursor-pointer hover:scale-105`}
            >
              Začít zdarma
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        ref={heroRef}
        id="hero"
        className={`relative overflow-hidden py-20 ${isDark ? "bg-[#03050b]" : "bg-[#f8f9ff]"}`}
      >
        <div
          className="absolute inset-0 opacity-[0.15]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.35), transparent 45%), radial-gradient(circle at 80% 0%, rgba(148,197,255,0.35), transparent 40%)",
          }}
        />

        <div className="max-w-7xl mx-auto relative grid gap-12 lg:grid-cols-2 px-6 pt-8">
          <div className="space-y-6">
            <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.6em] text-slate-500">
              <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
              SocialMat · 2025 Release
            </div>
            <div className="space-y-5">
              <h1
                className={`hero-title text-left text-4xl sm:text-5xl md:text-6xl font-bold leading-[1.05] tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}
              >
                <span className="block text-xs uppercase tracking-[0.8em] mb-3 text-slate-500">Operating studio</span>
                Tvoří obsah, <span className="underline decoration-4 decoration-cyan-300 underline-offset-8">odpovídá na komentáře</span> a reportuje za tebe.
              </h1>
              <p className={`hero-subtitle text-left text-lg max-w-xl ${isDark ? "text-white/70" : "text-slate-600"}`}>
                Jeden systém pro tvorbu, automatizaci a analytics. Od AI brainstormu po automatické titulky a chatboty.
              </p>
            </div>
            <div className="hero-buttons opacity-0">
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/signup"
                  className={`inline-flex items-center gap-2 rounded-full px-8 py-3 text-base font-semibold ${isDark ? "bg-white text-black" : "bg-slate-900 text-white"} transition-transform hover:-translate-y-0.5`}
                >
                  Spustit SocialMat
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <button
                  onClick={() => scrollToSection("automation")}
                  className={`inline-flex items-center gap-2 rounded-full px-8 py-3 border text-base font-semibold ${isDark ? "border-white/25 text-white hover:bg-white/10" : "border-slate-200 text-slate-900 hover:bg-slate-100"} transition-colors`}
                >
                  Prohlédnout workflow
                  <PlayCircle className="w-5 h-5" />
                </button>
              </div>
              <div className={`mt-4 flex flex-wrap gap-6 text-xs uppercase tracking-[0.5em] ${isDark ? "text-white/40" : "text-slate-500"}`}>
                <span>14 dní zdarma</span>
                <span>Bez kreditky</span>
                <span>Cloud + AI</span>
              </div>
            </div>
          </div>

          <div className="relative">
            {/* Floating Accent Element */}
            <div className="absolute -right-12 -top-12 w-64 h-64 bg-gradient-to-br from-cyan-400/20 to-teal-400/20 rounded-full blur-3xl opacity-30 animate-pulse" />

            {/* Decorative shapes */}
            <div className="absolute -left-8 top-1/4 w-16 h-16 border-2 border-cyan-400/20 rounded-2xl rotate-12" />
            <div className="absolute -right-4 bottom-1/4 w-12 h-12 bg-cyan-400/10 rounded-full" />

            {/* Hero Dashboard Visual */}
            <div className={`relative rounded-[32px] border overflow-hidden ${isDark ? "bg-white/5 border-white/10" : "bg-white border-slate-200 shadow-2xl"}`}>
              <div className="aspect-[4/3] relative">
                <img
                  src="/screenshots/dashboard-main.png"
                  alt="SocialMat Dashboard"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent) {
                      parent.classList.add('bg-gradient-to-br', isDark ? 'from-slate-900' : 'from-slate-100', isDark ? 'to-slate-800' : 'to-slate-200', 'flex', 'items-center', 'justify-center');
                      parent.innerHTML = `<div class="text-center p-8"><div class="${isDark ? 'text-white/40' : 'text-slate-400'} text-sm uppercase tracking-widest mb-4">Dashboard Preview</div><div class="grid grid-cols-2 gap-3"><div class="h-20 rounded-lg ${isDark ? 'bg-white/5' : 'bg-slate-200'}"></div><div class="h-20 rounded-lg ${isDark ? 'bg-white/5' : 'bg-slate-200'}"></div><div class="h-20 rounded-lg col-span-2 ${isDark ? 'bg-white/5' : 'bg-slate-200'}"></div></div></div>`;
                    }
                  }}
                />
              </div>
              {/* Badge Overlay */}
              <div className={`absolute top-4 right-4 flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-md ${isDark ? 'bg-black/40 border border-white/20' : 'bg-white/80 border border-slate-200'} text-xs uppercase tracking-wider`}>
                <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
                <span className={isDark ? 'text-white/80' : 'text-slate-700'}>Live</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Signal Tape */}
      <section className={`${isDark ? "bg-[#020409]" : "bg-white"} border-y ${isDark ? "border-white/5" : "border-slate-200"}`}>
        <div className="overflow-hidden py-4">
          <div className="animate-marquee flex items-center gap-12 text-[11px] uppercase tracking-[0.6em] font-semibold">
            {[...tapeMessages, ...tapeMessages].map((message, index) => (
              <span key={`${message}-${index}`} className={`flex items-center gap-3 ${isDark ? "text-white/60" : "text-slate-500"}`}>
                <span className="h-1 w-1 rounded-full bg-current" />
                {message}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        ref={featuresRef}
        id="features"
        className={`py-20 px-6 ${isDark ? "bg-[#020409]" : "bg-[#fdfdfb]"}`}
      >
        <div className="max-w-7xl mx-auto">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <p className={`text-xs uppercase tracking-[0.6em] mb-4 ${isDark ? "text-white/50" : "text-slate-500"}`}>
              Produktový stack
            </p>
            <h2 className={`features-title text-4xl md:text-5xl font-bold leading-tight mb-5 opacity-0 ${isDark ? "text-white" : "text-slate-900"}`}>
              Komplexní workflow v jedné aplikaci
            </h2>
            <p className={`features-subtitle text-lg opacity-0 max-w-2xl mx-auto ${isDark ? "text-white/65" : "text-slate-600"}`}>
              Od AI brainstormingu přes video editing až po automatizaci odpovědí. Všechny nástroje integrované a propojené.
            </p>
          </div>

          <div className="features-grid opacity-0 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* AI Content Generation */}
            <div className={`group relative rounded-[28px] border p-6 transition-all hover:scale-[1.02] ${isDark ? "bg-white/5 border-white/10 hover:bg-white/8" : "bg-white border-slate-200 shadow-lg hover:shadow-2xl"}`}>
              <div className="relative">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${isDark ? "bg-cyan-500/10 border border-cyan-500/20" : "bg-cyan-50 border border-cyan-100"}`}>
                  <Brain className={`w-6 h-6 ${isDark ? "text-cyan-400" : "text-cyan-600"}`} />
                </div>
                <h3 className={`text-xl font-bold mb-2 ${isDark ? "text-white" : "text-slate-900"}`}>AI Brainstorm</h3>
                <p className={`text-sm ${isDark ? "text-white/70" : "text-slate-600"}`}>
                  Generuje nápady, hooky a skripty podle tvých dat a aktuálních trendů
                </p>
              </div>
            </div>

            {/* Video Editor & Subtitles */}
            <div className={`group relative rounded-[28px] border overflow-hidden transition-all hover:scale-[1.02] ${isDark ? "bg-white/5 border-white/10 hover:bg-white/8" : "bg-white border-slate-200 shadow-lg hover:shadow-2xl"}`}>
              {/* Screenshot background */}
              <div className="absolute inset-0 opacity-30">
                <img
                  src="/screenshots/video-editor.png"
                  alt="Video Editor Interface"
                  className="w-full h-full object-cover object-top"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
              </div>
              <div className="relative p-6">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${isDark ? "bg-white/10 backdrop-blur-sm" : "bg-slate-900 backdrop-blur-sm"}`}>
                  <Edit3 className={`w-6 h-6 ${isDark ? "text-white" : "text-white"}`} />
                </div>
                <h3 className={`text-xl font-bold mb-2 ${isDark ? "text-white" : "text-slate-900"}`}>Video Editor & Titulky</h3>
                <p className={`text-sm ${isDark ? "text-white/70" : "text-slate-600"}`}>
                  Automatický přepis, překlad a stylizované titulky. Export do Premiere nebo SRT
                </p>
              </div>
            </div>

            {/* Analytics Dashboard */}
            <div className={`group relative rounded-[28px] border overflow-hidden transition-all hover:scale-[1.02] ${isDark ? "bg-white/5 border-white/10 hover:bg-white/8" : "bg-white border-slate-200 shadow-lg hover:shadow-2xl"}`}>
              {/* Screenshot background */}
              <div className="absolute inset-0 opacity-30">
                <img
                  src="/screenshots/analytics-preview.png"
                  alt="Analytics Dashboard"
                  className="w-full h-full object-cover object-top"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
              </div>
              <div className="relative p-6">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${isDark ? "bg-white/10 backdrop-blur-sm" : "bg-slate-900 backdrop-blur-sm"}`}>
                  <BarChart3 className={`w-6 h-6 ${isDark ? "text-white" : "text-white"}`} />
                </div>
                <h3 className={`text-xl font-bold mb-2 ${isDark ? "text-white" : "text-slate-900"}`}>Analytics</h3>
                <p className={`text-sm ${isDark ? "text-white/70" : "text-slate-600"}`}>
                  Real-time metriky a AI doporučení jak zlepšit dosah a engagement
                </p>
              </div>
            </div>

            {/* Automation & Chatbots */}
            <div className={`group relative rounded-[28px] border p-6 transition-all hover:scale-[1.02] ${isDark ? "bg-white/5 border-white/10 hover:bg-white/8" : "bg-white border-slate-200 shadow-lg hover:shadow-2xl"}`}>
              <div className="relative">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${isDark ? "bg-white/10" : "bg-slate-900"}`}>
                  <MessageSquare className={`w-6 h-6 ${isDark ? "text-white" : "text-white"}`} />
                </div>
                <h3 className={`text-xl font-bold mb-2 ${isDark ? "text-white" : "text-slate-900"}`}>Auto-reply</h3>
                <p className={`text-sm ${isDark ? "text-white/70" : "text-slate-600"}`}>
                  Automatické odpovědi na komentáře a DM. Předá konverzaci člověku když je potřeba
                </p>
              </div>
            </div>

            {/* Calendar & Scheduling */}
            <div className={`group relative rounded-[28px] border p-6 transition-all hover:scale-[1.02] ${isDark ? "bg-white/5 border-white/10 hover:bg-white/8" : "bg-white border-slate-200 shadow-lg hover:shadow-2xl"}`}>
              <div className="relative">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${isDark ? "bg-white/10" : "bg-slate-900"}`}>
                  <Calendar className={`w-6 h-6 ${isDark ? "text-white" : "text-white"}`} />
                </div>
                <h3 className={`text-xl font-bold mb-2 ${isDark ? "text-white" : "text-slate-900"}`}>Plánování</h3>
                <p className={`text-sm ${isDark ? "text-white/70" : "text-slate-600"}`}>
                  Naplánuj posty na Instagram a TikTok podle engagement dat tvé audience
                </p>
              </div>
            </div>

            {/* Stories & Reels */}
            <div className={`group relative rounded-[28px] border p-6 transition-all hover:scale-[1.02] ${isDark ? "bg-white/5 border-white/10 hover:bg-white/8" : "bg-white border-slate-200 shadow-lg hover:shadow-2xl"}`}>
              <div className="relative">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${isDark ? "bg-white/10" : "bg-slate-900"}`}>
                  <Image className={`w-6 h-6 ${isDark ? "text-white" : "text-white"}`} />
                </div>
                <h3 className={`text-xl font-bold mb-2 ${isDark ? "text-white" : "text-slate-900"}`}>Stories & Reels</h3>
                <p className={`text-sm ${isDark ? "text-white/70" : "text-slate-600"}`}>
                  Šablony a efekty pro rychlou tvorbu short-form contentu
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Automation Section */}
      <section
        id="automation"
        className={`relative overflow-hidden py-20 px-6 ${isDark ? "bg-[#05060f]" : "bg-white"}`}
      >
        <div
          className="absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 0% 0%, rgba(34,211,238,0.25), transparent 45%), radial-gradient(circle at 80% 20%, rgba(20,184,166,0.2), transparent 40%)",
          }}
        />
        <div className="max-w-7xl mx-auto relative z-[1]">
          {/* Decorative elements */}
          <div className="absolute left-1/4 top-12 w-20 h-20 border-2 border-cyan-400/10 rounded-full" />
          <div className="absolute right-1/3 bottom-24 w-16 h-16 bg-cyan-400/5 rounded-2xl rotate-45" />

          <div className="grid gap-16 lg:grid-cols-2">
            <div className="space-y-6">
              <p className={`text-xs uppercase tracking-[0.6em] ${isDark ? "text-white/50" : "text-slate-500"}`}>
                Automatizace
              </p>
              <h2 className={`text-4xl md:text-5xl font-bold leading-tight ${isDark ? "text-white" : "text-slate-900"}`}>
                Komentáře a DM bez manuální práce
              </h2>
              <p className={`text-lg leading-relaxed ${isDark ? "text-white/70" : "text-slate-600"}`}>
                Automatické odpovědi ve tvém tónu. Přepne na člověka když je potřeba. S metrikami a audit trail.
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                {automationBenefits.map((benefit) => (
                  <div key={benefit} className={`rounded-2xl p-4 border ${isDark ? "bg-white/5 border-white/10" : "bg-slate-50 border-slate-200"}`}>
                    <p className={`text-sm font-medium ${isDark ? "text-white" : "text-slate-900"}`}>{benefit}</p>
                  </div>
                ))}
              </div>

              {/* Screenshot of chatbot flow */}
              <div className={`rounded-3xl border overflow-hidden ${isDark ? "bg-white/5 border-white/10" : "bg-white border-slate-200 shadow-xl"}`}>
                <div className="aspect-video relative">
                  <img
                    src="/screenshots/chatbot-flow.png"
                    alt="Chatbot Automation Flow"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent) {
                        parent.classList.add('bg-gradient-to-br', isDark ? 'from-green-900/20' : 'from-green-50', isDark ? 'to-teal-900/20' : 'to-teal-50', 'flex', 'items-center', 'justify-center');
                        parent.innerHTML = `<div class="text-center p-6"><div class="${isDark ? 'text-white/40' : 'text-slate-400'} text-xs uppercase tracking-widest mb-3">Chatbot Flow</div><div class="flex gap-2 justify-center"><div class="w-12 h-12 rounded-lg ${isDark ? 'bg-white/5' : 'bg-slate-200'}"></div><div class="w-12 h-12 rounded-lg ${isDark ? 'bg-white/5' : 'bg-slate-200'}"></div><div class="w-12 h-12 rounded-lg ${isDark ? 'bg-white/5' : 'bg-slate-200'}"></div></div></div>`;
                      }
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="relative">
              <div className={`absolute left-6 top-0 bottom-0 w-px ${isDark ? "bg-white/15" : "bg-slate-200"}`} />
              <div className="space-y-8 pl-14">
                {automationFlows.map((flow, index) => (
                  <div
                    key={flow.title}
                    className={`relative rounded-3xl border p-6 ${isDark ? "bg-white/5 border-white/10" : "bg-white border-slate-200 shadow-lg"}`}
                  >
                    <div className={`absolute -left-14 top-6 h-12 w-12 rounded-xl flex items-center justify-center text-xs font-bold ${isDark ? "bg-white text-black" : "bg-slate-900 text-white"}`}>
                      {String(index + 1).padStart(2, "0")}
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-xs uppercase tracking-[0.4em] ${isDark ? "text-white/40" : "text-slate-500"}`}>{flow.stage}</span>
                      <span className={`text-xs font-semibold ${isDark ? "text-white/70" : "text-slate-600"}`}>{flow.outcome}</span>
                    </div>
                    <h3 className={`text-2xl font-semibold mb-2 ${isDark ? "text-white" : "text-slate-900"}`}>{flow.title}</h3>
                    <p className={`text-sm ${isDark ? "text-white/65" : "text-slate-600"}`}>{flow.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Insights Section */}
      <section id="insights" className={`py-20 px-6 ${isDark ? "bg-[#070910]" : "bg-[#fafaf9]"}`}>
        <div className="max-w-7xl mx-auto grid gap-16 lg:grid-cols-2 items-start">
          <div className="space-y-6">
            <p className={`text-xs uppercase tracking-[0.6em] ${isDark ? "text-white/50" : "text-slate-500"}`}>
              Analytics & AI
            </p>
            <h2 className={`text-4xl md:text-5xl font-bold leading-tight ${isDark ? "text-white" : "text-slate-900"}`}>
              Z dat rovnou na akce
            </h2>
            <p className={`text-lg leading-relaxed ${isDark ? "text-white/70" : "text-slate-600"}`}>
              Metriky účtu, AI insights a návrhy dalších kroků. Včetně hooků a nápadů na content.
            </p>
            <div className={`rounded-3xl border p-5 ${isDark ? "bg-white/5 border-white/10" : "bg-white border-slate-200"}`}>
              <div className="flex items-center justify-between mb-4">
                <span className={`text-xs uppercase tracking-[0.5em] ${isDark ? "text-white/40" : "text-slate-500"}`}>Playbook</span>
                <span className={`text-xs uppercase tracking-[0.4em] ${isDark ? "text-white/50" : "text-slate-600"}`}>AI Coach</span>
              </div>
              <ul className="space-y-3">
                {insightSteps.map((step) => (
                  <li key={step} className={`flex items-start gap-3 text-sm ${isDark ? "text-white/70" : "text-slate-600"}`}>
                    <span className={`mt-1 h-2 w-2 rounded-full ${isDark ? "bg-white" : "bg-slate-900"}`} />
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="space-y-6 relative">
            {/* Analytics Screenshot */}
            <div className={`rounded-[28px] border overflow-hidden relative z-10 ${isDark ? "bg-white/5 border-white/10" : "bg-white border-slate-200 shadow-xl"}`}>
              <div className="aspect-video relative">
                <img
                  src="/screenshots/analytics-dashboard.png"
                  alt="Analytics Dashboard"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent) {
                      parent.classList.add('bg-gradient-to-br', isDark ? 'from-blue-900/20' : 'from-blue-50', isDark ? 'to-purple-900/20' : 'to-purple-50', 'flex', 'items-center', 'justify-center');
                      parent.innerHTML = `<div class="text-center p-8"><div class="${isDark ? 'text-white/40' : 'text-slate-400'} text-xs uppercase tracking-widest mb-4">Analytics</div><div class="grid grid-cols-3 gap-3"><div class="h-16 rounded ${isDark ? 'bg-white/5' : 'bg-slate-200'}"></div><div class="h-16 rounded ${isDark ? 'bg-white/5' : 'bg-slate-200'}"></div><div class="h-16 rounded ${isDark ? 'bg-white/5' : 'bg-slate-200'}"></div><div class="h-24 rounded col-span-3 ${isDark ? 'bg-white/5' : 'bg-slate-200'}"></div></div></div>`;
                    }
                  }}
                />
              </div>
            </div>

            {/* Command Room Widgets */}
            <div className={`rounded-[32px] border relative overflow-hidden ${isDark ? "bg-white/5 border-white/10" : "bg-white border-slate-200 shadow-2xl"}`}>
              <div className={`absolute top-6 right-6 rounded-xl border px-4 py-2 text-xs uppercase tracking-[0.5em] ${isDark ? "border-white/20 text-white/60 backdrop-blur-sm" : "border-slate-200 text-slate-500 bg-white/80 backdrop-blur-sm"}`}>
                Command room
              </div>
              <div className="grid gap-4 sm:grid-cols-2 p-5">
                {insightWidgets.map((widget) => (
                  <div key={widget.label} className={`rounded-2xl p-5 border flex flex-col gap-2 ${isDark ? "border-white/15 bg-white/5" : "border-slate-200 bg-white"}`}>
                    <p className={`text-xs uppercase tracking-[0.3em] ${isDark ? "text-white/60" : "text-slate-500"}`}>{widget.label}</p>
                    <div className={`text-3xl font-black ${isDark ? "text-white" : "text-slate-900"}`}>{widget.value}</div>
                    <p className={`text-sm ${isDark ? "text-white/70" : "text-slate-600"}`}>{widget.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section
        ref={statsRef}
        className={`relative py-20 px-6 overflow-hidden ${isDark ? "bg-[#04060c]" : "bg-[#f9f7f1]"}`}
      >
        <div className="max-w-7xl mx-auto grid gap-16 lg:grid-cols-2 items-center relative z-10">
          <div className="space-y-8">
            <p className={`text-xs uppercase tracking-[0.6em] ${isDark ? "text-white/40" : "text-slate-500"}`}>
              Telemetry deck
            </p>
            <div className="space-y-4">
              <h2 className={`stats-heading text-4xl md:text-5xl font-bold leading-tight opacity-0 ${isDark ? "text-white" : "text-slate-900"}`}>
                Čísla přímo z operačního stolu
              </h2>
              <p className={`stats-subtitle text-lg opacity-0 ${isDark ? "text-white/65" : "text-slate-600"}`}>
                Sledujeme přesnost AI, rychlost front a dopad automatizací stejně pečlivě jako ty.
              </p>
            </div>
            <div className={`rounded-[28px] border p-5 ${isDark ? "bg-white/5 border-white/10" : "bg-white border-slate-200"}`}>
              <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className={`text-xs uppercase tracking-[0.4em] mb-2 ${isDark ? "text-white/50" : "text-slate-500"}`}>
                    Přesnost titulků
                  </p>
                  <div className={`text-5xl font-black ${isDark ? "text-white" : "text-slate-900"}`}>
                    <CountUp value={accuracyStat.value} suffix={accuracyStat.suffix} decimals={accuracyStat.decimals} />
                  </div>
                  <p className={`text-sm ${isDark ? "text-white/60" : "text-slate-600"}`}>
                    {accuracyStat.detail}
                  </p>
                </div>
                <div className="text-right">
                  <p className={`text-xs uppercase tracking-[0.4em] mb-2 ${isDark ? "text-white/50" : "text-slate-500"}`}>
                    Latence fronty
                  </p>
                  <div className={`text-4xl font-black ${isDark ? "text-cyan-300" : "text-slate-900"}`}>
                    <CountUp value={speedStat.value} suffix={speedStat.suffix} decimals={speedStat.decimals} />
                  </div>
                  <p className={`text-sm ${isDark ? "text-white/60" : "text-slate-600"}`}>
                    {speedStat.detail}
                  </p>
                </div>
              </div>
              <div className={`mt-6 flex flex-wrap gap-6 text-xs uppercase tracking-[0.4em] ${isDark ? "text-white/50" : "text-slate-500"}`}>
                <span>Automatické QA</span>
                <span>Monitoring realtime</span>
                <span>Alert při odchylce</span>
              </div>
            </div>
            <div className="space-y-3">
              {statStorylines.map((story) => (
                <div key={story} className={`flex items-start gap-3 text-sm ${isDark ? "text-white/70" : "text-slate-600"}`}>
                  <span className={`mt-1 h-2 w-2 rounded-full ${isDark ? "bg-white" : "bg-slate-900"}`} />
                  <span>{story}</span>
                </div>
              ))}
            </div>
          </div>

          <div className={`stats-grid relative rounded-[40px] border overflow-hidden ${isDark ? "bg-gradient-to-br from-white/10 via-white/5 to-transparent border-white/10" : "bg-white border-slate-200 shadow-[0_25px_80px_rgba(15,23,42,0.08)]"}`}>
            <div className={`absolute top-6 right-6 text-xs uppercase tracking-[0.5em] ${isDark ? "text-white/50" : "text-slate-500"}`}>
              Live telemetry
            </div>
            <div className="grid gap-6 md:grid-cols-2 p-8">
              {statHighlights.map((stat) => (
                <div
                  key={stat.label}
                  className={`stat-item rounded-3xl border p-5 opacity-0 ${isDark ? "bg-black/30 border-white/10" : "bg-slate-50 border-slate-200"}`}
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className={`h-10 w-10 rounded-xl flex items-center justify-center bg-gradient-to-r`}>
                        {stat.label.includes("AI") ? <Sparkles className="w-5 h-5 text-white" /> : stat.label.includes("doba") ? <Zap className="w-5 h-5 text-white" /> : stat.label.includes("titulků") ? <Video className="w-5 h-5 text-white" /> : <TrendingUp className="w-5 h-5 text-white" />}
                      </div>
                      <span
                        className={`text-xs font-semibold uppercase tracking-[0.3em] ${isDark ? "text-white/60" : "text-slate-500"
                          }`}
                      >
                        Performance
                      </span>
                    </div>
                    <span
                      className={`text-[11px] uppercase tracking-[0.2em] ${isDark ? "text-white/40" : "text-slate-400"
                        }`}
                    >
                      {stat.detail}
                    </span>
                  </div>
                  <div
                    className={`text-4xl md:text-5xl font-bold mb-2 ${isDark ? "text-white" : "text-slate-900"
                      }`}
                  >
                    <CountUp
                      value={stat.value}
                      suffix={stat.suffix}
                      decimals={stat.decimals}
                    />
                  </div>
                  <p
                    className={`text-sm tracking-wide ${isDark ? "text-white/70" : "text-slate-600"
                      }`}
                  >
                    {stat.label}
                  </p>
                  <div className={`text-4xl font-bold mb-1 ${isDark ? "text-white" : "text-slate-900"}`}>
                    <CountUp value={stat.value} suffix={stat.suffix} decimals={stat.decimals} />
                  </div>
                  <p className={`text-sm ${isDark ? "text-white/60" : "text-slate-600"}`}>{stat.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section
        id="pricing"
        className={`py-20 px-6 ${isDark ? "bg-[#03040a]" : "bg-white"}`}
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <p className={`text-xs uppercase tracking-[0.6em] ${isDark ? "text-white/40" : "text-slate-500"}`}>
              Přístupové úrovně
            </p>
            <h2 className={`text-4xl md:text-5xl font-bold leading-tight ${isDark ? "text-white" : "text-slate-900"}`}>
              Vyber si studio pass, který odpovídá tvému tempu
            </h2>
            <p className={`text-lg max-w-2xl mx-auto ${isDark ? "text-white/65" : "text-slate-600"}`}>
              Neplatíš za funkce, které nepotřebuješ. Všechny plány mají AI titulky, editor i automatizace – liší se jen kapacitou a podporou.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3 mb-12">
            {pricingPlans.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-[28px] border p-6 flex flex-col gap-5 ${plan.highlight
                  ? `${isDark ? "bg-gradient-to-br from-cyan-900/20 to-teal-900/10 border-cyan-500/30 ring-2 ring-cyan-500/20" : "bg-gradient-to-br from-cyan-600 to-teal-700 text-white border-cyan-500 ring-2 ring-cyan-500/20"}`
                  : `${isDark ? "bg-white/5 border-white/10" : "bg-white border-slate-200"}`
                  }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className={`text-2xl font-bold ${plan.highlight ? "text-white" : isDark ? "text-white" : "text-slate-900"}`}>
                      {plan.name}
                    </h3>
                  </div>
                  {plan.highlight && (
                    <span className={`text-xs uppercase tracking-[0.3em] rounded-full px-3 py-1.5 ${isDark ? "bg-white/15 text-white" : "bg-white/20 text-white"}`}>
                      Populární
                    </span>
                  )}
                </div>

                <p className={`text-sm ${plan.highlight ? "text-white/80" : isDark ? "text-white/65" : "text-slate-600"}`}>
                  {plan.desc}
                </p>

                <div>
                  <span className={`text-4xl font-black ${plan.highlight ? "text-white" : isDark ? "text-white" : "text-slate-900"}`}>
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span className={`ml-2 text-base font-semibold ${plan.highlight ? "text-white/70" : isDark ? "text-white/60" : "text-slate-500"}`}>
                      {plan.period}
                    </span>
                  )}
                </div>

                <div className="space-y-3 text-sm flex-1">
                  {plan.perks.map((perk) => (
                    <div key={perk} className="flex items-start gap-3">
                      <svg className={`w-5 h-5 mt-0.5 flex-shrink-0 ${plan.highlight ? "text-white" : isDark ? "text-white" : "text-slate-900"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className={`${plan.highlight ? "text-white/90" : isDark ? "text-white/70" : "text-slate-600"}`}>{perk}</span>
                    </div>
                  ))}
                </div>

                <button
                  className={`w-full rounded-2xl py-3 text-sm font-semibold uppercase tracking-[0.3em] transition-all ${plan.highlight
                    ? "bg-white text-slate-900 hover:bg-slate-100"
                    : isDark
                      ? "bg-white/10 text-white hover:bg-white/20 border border-white/20"
                      : "bg-slate-900 text-white hover:bg-slate-800"
                    }`}
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>

          <div className={`text-center rounded-2xl border p-6 ${isDark ? "bg-white/5 border-white/10" : "bg-slate-50 border-slate-200"}`}>
            <p className={`text-sm ${isDark ? "text-white/70" : "text-slate-600"}`}>
              <span className="font-semibold">14 dní trial zdarma</span> · Bez kreditky · Zrušit kdykoliv
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className={`py-20 px-6 ${isDark ? 'bg-[#05060c]' : 'bg-[#f4f1e9]'}`}>
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <p className={`text-xs uppercase tracking-[0.6em] ${isDark ? 'text-white/40' : 'text-slate-500'}`}>
              Hlasy z terénu
            </p>
            <h2 className={`text-4xl md:text-5xl font-bold leading-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Lidi, kteří SocialMat používají denně
            </h2>
          </div>

          {/* Social proof screenshot */}
          <div className={`rounded-[28px] border overflow-hidden mb-12 ${isDark ? "bg-white/5 border-white/10" : "bg-white border-slate-200 shadow-xl"}`}>
            <div className="aspect-[21/9] relative">
              <img
                src="/screenshots/testimonials-grid.png"
                alt="User Testimonials"
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent) {
                    parent.classList.add('bg-gradient-to-br', isDark ? 'from-slate-900' : 'from-slate-50', isDark ? 'to-slate-800' : 'to-slate-100', 'flex', 'items-center', 'justify-center');
                    parent.innerHTML = `<div class="text-center p-8"><div class="${isDark ? 'text-white/40' : 'text-slate-400'} text-xs uppercase tracking-widest">User Feedback</div></div>`;
                  }
                }}
              />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.name}
                className={`rounded-2xl border p-6 flex flex-col gap-4 ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200'}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold ${isDark ? 'bg-white/15 text-white' : 'bg-slate-900 text-white'}`}>
                    {testimonial.avatar}
                  </div>
                  <div>
                    <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {testimonial.name}
                    </h3>
                    <p className={`text-xs ${isDark ? 'text-white/60' : 'text-slate-600'}`}>
                      {testimonial.role}
                    </p>
                  </div>
                </div>
                <p className={`text-sm leading-relaxed ${isDark ? 'text-white/70' : 'text-slate-600'}`}>
                  "{testimonial.text}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className={`py-20 px-6 ${isDark ? 'bg-[#03040b]' : 'bg-[#f5f2ea]'}`}>
        <div className="max-w-6xl mx-auto grid gap-12 lg:grid-cols-[0.85fr_1.15fr] items-start">
          <div className="space-y-6">
            <p className={`text-xs uppercase tracking-[0.6em] ${isDark ? 'text-white/40' : 'text-slate-500'}`}>
              FAQ / crew desk
            </p>
            <h2 className={`text-4xl md:text-5xl font-bold leading-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Nejčastější dotazy, které padají při demo hovorech
            </h2>
            <p className={`text-lg ${isDark ? 'text-white/65' : 'text-slate-600'}`}>
              Pokud tu odpověď nenajdeš, napiš nám a ozveme se během pracovního dne.
            </p>
            <div className={`rounded-3xl border p-5 ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200'}`}>
              <p className={`text-sm mb-3 ${isDark ? 'text-white/70' : 'text-slate-600'}`}>
                Preferuješ call? Napiš slovo demo na hello@socialmat.app a domluvíme se.
              </p>
            </div>

            <div className="space-y-4">
              {/* FAQ 1 */}
              <div className={`p-6 rounded-2xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200'}`}>
                <h3 className={`text-xl font-bold mb-3 flex items-center gap-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  <Sparkles className="w-6 h-6" />
                  Jak přesná je AI při rozpoznávání české řeči?
                </h3>
                <p className={`${isDark ? 'text-white/70' : 'text-slate-600'} leading-relaxed`}>
                  Naše AI je trénovaná speciálně na češtinu a slovenštinu včetně dialektů a slangu. Přesnost je 95%+ i u rychlé řeči nebo videa s hudbou v pozadí. Titulky můžete samozřejmě kdykoliv upravit.
                </p>
              </div>

              {/* FAQ 2 */}
              <div className={`p-6 rounded-2xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200'}`}>
                <h3 className={`text-xl font-bold mb-3 flex items-center gap-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  <Shield className="w-6 h-6" />
                  Musím zadávat kreditní kartu pro vyzkoušení zdarma?
                </h3>
                <p className={`${isDark ? 'text-white/70' : 'text-slate-600'} leading-relaxed`}>
                  Ne! Můžete vyzkoušet SocialMat na 14 dní zcela zdarma bez zadání platební karty. Žádné automatické prodloužení, žádné skryté poplatky. Prostě si to vyzkoušíte a pak se rozhodnete.
                </p>
              </div>

              {/* FAQ 3 */}
              <div className={`p-6 rounded-2xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200'}`}>
                <h3 className={`text-xl font-bold mb-3 flex items-center gap-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  <Users className="w-6 h-6" />
                  Jaké sociální sítě podporujete?
                </h3>
                <p className={`${isDark ? 'text-white/70' : 'text-slate-600'} leading-relaxed`}>
                  Momentálně podporujeme Instagram (Reels, Stories, posty) a TikTok. Připravujeme integraci s YouTube Shorts, Facebookem a LinkedIn. Všechny statistiky a automatické odpovědi fungují pro Instagram.
                </p>
              </div>

              {/* FAQ 4 */}
              <div className={`p-6 rounded-2xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200'}`}>
                <h3 className={`text-xl font-bold mb-3 flex items-center gap-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  <Edit3 className="w-6 h-6" />
                  Mohu si přizpůsobit styl titulků podle své značky?
                </h3>
                <p className={`${isDark ? 'text-white/70' : 'text-slate-600'} leading-relaxed`}>
                  Ano! Můžete si nastavit vlastní barvy, fonty, pozici titulků, velikost textu a dokonce i animace. Všechna nastavení se automaticky ukládají jako vaše šablona pro příští videa.
                </p>
              </div>

              {/* FAQ 5 */}
              <div className={`p-6 rounded-2xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200'}`}>
                <h3 className={`text-xl font-bold mb-3 flex items-center gap-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  <Zap className="w-6 h-6" />
                  Jak rychle dostanu hotové video s titulky?
                </h3>
                <p className={`${isDark ? 'text-white/70' : 'text-slate-600'} leading-relaxed`}>
                  U běžného 30-60 vteřinového Reels to trvá průměrně 20-40 sekund. Delší videa (3-5 minut) zpracujeme do 2 minut. Záleží na délce a kvalitě zvuku, ale vždy to je rychlejší než ruční přepisování!
                </p>
              </div>

              {/* FAQ 6 */}
              <div className={`p-6 rounded-2xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200'}`}>
                <h3 className={`text-xl font-bold mb-3 flex items-center gap-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  <DollarSign className="w-6 h-6" />
                  Co když mi nevyhovuje placený plán?
                </h3>
                <p className={`${isDark ? 'text-white/70' : 'text-slate-600'} leading-relaxed`}>
                  Můžete kdykoliv zrušit předplatné bez udání důvodu. Pokud nejste spokojeni během prvních 30 dní, vrátíme vám peníze zpět. Žádné otázky, žádné komplikace. Chceme jen spokojené zákazníky!
                </p>
              </div>
            </div>

            <div className="text-center mt-12">
              <p className={`text-lg mb-6 ${isDark ? 'text-white/70' : 'text-slate-600'}`}>
                Máte jinou otázku? Jsme tu pro vás!
              </p>
              <Link href="/signup">
                <button className={`inline-flex items-center gap-2 bg-gradient-to-r text-white py-3 px-8 rounded-full font-semibold text-lg transition-all duration-300 `}>
                  <MessageCircle className="w-5 h-5" />
                  Napsat podporu
                </button>
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            {faqItems.map((faq, index) => (
              <div key={faq.question} className={`rounded-3xl border p-5 ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200'}`}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className={`text-xs uppercase tracking-[0.4em] ${isDark ? 'text-white/50' : 'text-slate-500'}`}>
                      0{index + 1}
                    </p>
                    <h3 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {faq.question}
                    </h3>
                  </div>
                  <span className={`text-xs uppercase tracking-[0.4em] ${isDark ? 'text-white/40' : 'text-slate-400'}`}>Crew</span>
                </div>
                <p className={`mt-3 text-sm leading-relaxed ${isDark ? 'text-white/70' : 'text-slate-600'}`}>
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        id="contact"
        className={`px-6 pt-20 pb-12 ${isDark ? "bg-black text-white" : "bg-white text-slate-900"}`}
      >
        <div className="max-w-6xl mx-auto space-y-16">
          <div className={`rounded-[40px] border p-8 md:p-12 grid gap-10 lg:grid-cols-[1.15fr_0.85fr] ${isDark ? "bg-gradient-to-br from-white/10 via-transparent to-transparent border-white/10" : "bg-slate-50 border-slate-200"}`}>
            <div className="space-y-6">
              <p className={`text-xs uppercase tracking-[0.5em] ${isDark ? "text-white/60" : "text-slate-600"}`}>Ready to operate?</p>
              <h3 className="text-4xl md:text-5xl font-bold leading-tight">
                Připrav svůj social tým na režim, kde AI hlídá detaily a ty kurátoruješ výsledky.
              </h3>
              <div className="flex flex-wrap gap-4">
                <Link href="/signup" className={`${isDark ? "bg-white text-slate-900" : "bg-slate-900 text-white"} rounded-full px-8 py-3 font-semibold uppercase tracking-[0.4em] hover:-translate-y-0.5 transition-transform`}>
                  Spustit SocialMat
                </Link>
                <a href="mailto:hello@socialmat.app" className={`inline-flex items-center gap-2 rounded-full border px-6 py-3 text-sm uppercase tracking-[0.4em] ${isDark ? "border-white/20 text-white" : "border-slate-300 text-slate-900"}`}>
                  Domluvit demo
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
            <div className={`rounded-[32px] border p-8 h-full ${isDark ? "bg-black/40 border-white/10" : "bg-white border-slate-200"}`}>
              <p className={`text-xs uppercase tracking-[0.5em] mb-4 ${isDark ? "text-white/50" : "text-slate-500"}`}>Kontakty</p>
              <div className={`space-y-4 text-sm`}>
                <div>
                  <p className={`${isDark ? 'text-white/70' : 'text-slate-600'}`}>E-mail</p>
                  <a href="mailto:hello@socialmat.app" className={`text-lg font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>hello@socialmat.app</a>
                </div>
                <div>
                  <p className={`${isDark ? 'text-white/70' : 'text-slate-600'}`}>Instagram</p>
                  <a href="https://instagram.com" className={`text-lg font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>
                    @socialmat.app
                  </a>
                </div>
                <div>
                  <p className={`${isDark ? 'text-white/70' : 'text-slate-600'}`}>Office hours</p>
                  <p className={`${isDark ? "text-white" : "text-slate-900"}`}>Po–Pá · 9:00–18:00 CET</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
            {footerLinks.map((group) => (
              <div key={group.title} className="space-y-3">
                <h4 className="text-sm font-semibold uppercase tracking-[0.3em]">{group.title}</h4>
                <ul className={`space-y-2 text-sm ${isDark ? "text-white/70" : "text-slate-600"}`}>
                  {group.items.map((item) => (
                    <li key={item.label}>
                      <a href={item.href} className={`transition-colors ${isDark ? "hover:text-white" : "hover:text-slate-900"}`}>
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs uppercase tracking-[0.4em]">
            <span className={`${isDark ? "text-white/50" : "text-slate-500"}`}>© {currentYear} SocialMat</span>
            <span className={`inline-flex items-center gap-2 ${isDark ? "text-white/60" : "text-slate-600"}`}>
              <span className="h-1 w-1 rounded-full bg-current" />
              Od tvůrců pro tvůrce
              <span className="h-1 w-1 rounded-full bg-current" />
            </span>
            <span className={`${isDark ? "text-white/60" : "text-slate-600"}`}>Režim: Operating Studio</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
