"use client";

import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { Moon, Sun, Sparkles, TrendingUp, Lightbulb, Video, BarChart3, MessageSquare, Send, Zap, CheckCircle2, ArrowRight, PlayCircle, Edit3, Rocket, Star, Briefcase, Users, Target, Clock, Award, Shield, ChevronDown, Image, Calendar, Brain, DollarSign, MessageCircle } from "lucide-react";

export default function LandingPage() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState("");
  const [theme, setTheme] = useState<"light" | "dark" | null>(null);
  const [featuresDropdownOpen, setFeaturesDropdownOpen] = useState(false);

  // Refs for animations
  const navRef = useRef(null);
  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const statsRef = useRef(null);

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
      localStorage.setItem("dashboard-theme", theme);
    }
  }, [theme]);

  const resolvedTheme = theme ?? "light";
  const isDark = resolvedTheme === "dark";

  const palette = {
    page: isDark ? "bg-black text-white" : "bg-white text-slate-900",
    navContainer: isDark
      ? "bg-black/60 backdrop-blur-2xl border border-white/10 shadow-2xl shadow-black/50"
      : "bg-white/90 backdrop-blur-2xl border border-slate-200/80 shadow-xl shadow-slate-900/5",
    navLinks: isDark
      ? "text-white/85 hover:text-white"
      : "text-slate-600 hover:text-slate-900",
    navLogin: isDark
      ? "text-white/80 hover:text-white"
      : "text-slate-700 hover:text-slate-900",
    heroTitle: isDark ? "text-white" : "text-slate-900",
    heroSubtitle: isDark ? "text-white/85" : "text-slate-600",
    featureCard: isDark
      ? "bg-gradient-to-br from-white/[0.08] via-white/[0.03] to-transparent border border-white/10 shadow-xl shadow-black/30"
      : "bg-gradient-to-br from-white via-slate-50/50 to-white border border-slate-200/80 shadow-xl shadow-slate-900/5",
    featureOverlay: {
      touch: isDark
        ? "bg-gradient-to-t from-indigo-600/30 via-transparent to-transparent"
        : "bg-gradient-to-t from-indigo-500/20 via-transparent to-transparent",
      desktop: (index: number) =>
        isDark
          ? index % 2 === 0
            ? "linear-gradient(to top right, rgba(79, 70, 229, 0.32), rgba(59, 130, 246, 0.06) 65%)"
            : "linear-gradient(to top left, rgba(79, 70, 229, 0.32), rgba(59, 130, 246, 0.06) 65%)"
          : index % 2 === 0
            ? "linear-gradient(to top right, rgba(79, 70, 229, 0.18), rgba(59, 130, 246, 0.04) 65%)"
            : "linear-gradient(to top left, rgba(79, 70, 229, 0.18), rgba(59, 130, 246, 0.04) 65%)",
    },
    statsSection: isDark
      ? "bg-black text-white"
      : "bg-gradient-to-b from-white to-slate-50 text-slate-900",
    statsSubtitle: isDark ? "text-white/70" : "text-slate-600",
    statHover: isDark ? "hover:text-sky-400" : "hover:text-indigo-500",
    pricingSection: isDark
      ? "bg-gradient-to-b from-black via-[#1f1f1f] to-black text-white"
      : "bg-gradient-to-b from-white via-slate-50 to-white text-slate-900",
    pricingBorder: isDark ? "border-white/10" : "border-slate-200",
    pricingHighlightBorder: isDark
      ? "border-indigo-500/50 shadow-[0_18px_60px_rgba(79,70,229,0.35)]"
      : "border-indigo-500/40 shadow-[0_18px_60px_rgba(79,70,229,0.18)]",
    pricingDot: isDark ? "bg-blue-400/80" : "bg-indigo-500/70",
  };

  const brandGradient = isDark
    ? "from-orange-400 via-pink-500 to-rose-500"
    : "from-orange-500 via-pink-500 to-rose-500";
  const brandGradientHover = isDark
    ? "hover:from-orange-300 hover:via-pink-400 hover:to-rose-400"
    : "hover:from-orange-400 hover:via-pink-400 hover:to-rose-400";
  const brandGlow = isDark
    ? "shadow-[0_20px_70px_rgba(249,115,22,0.35)]"
    : "shadow-[0_18px_60px_rgba(249,115,22,0.25)]";

  const heroHighlights = [
    {
      badge: "AI titulky",
      title: "Hotové za 30 vteřin",
      description:
        "Nahraj video a během chvilky máš profesionální české titulky. Žádné zdlouhavé přepisování.",
      metric: "0:30",
      icon: "video",
    },
    {
      badge: "Analytics",
      title: "Sleduj svůj růst",
      description:
        "Dashboard s metrikami účtu, výkonem každého postu a predikcí toho příštího.",
      metric: "+68%",
      icon: "chart",
    },
    {
      badge: "AI Ideas",
      title: "Nikdy ti nedojdou nápady",
      description:
        "AI navrhne hook, celý copy i odpovědi na komentáře během jedné minuty.",
      metric: "24 nápadů",
      icon: "FX",
    },
  ];

  const coreFeatures = [
    {
      category: "AI titulky",
      title: "Profesionální české titulky za 30 vteřin",
      description:
        "Nahraj video a během chvilky máš profesionální titulky. Žádné zdlouhavé přepisování, žádné chyby. Naše AI rozumí češtině perfektně včetně slangu a dialektů.",
      details: ["Brandové barvy a fonty", "Auto CTA slide a emotikony", "Export SRT, TXT i hotové video"],
      icon: "video",
    },
    {
      category: "Metriky účtu",
      title: "Vidíš výkon svého účtu na jeden pohled",
      description:
        "Propojíme tvůj Instagram a zobrazíme reach, engagement, nejlepší čas na publikování i top fanoušky. Všechno přehledně na jednom místě bez přepínání aplikací.",
      details: ["Denní trend grafy", "Benchmark podle tvého odvětví", "Sledování konkurence"],
      icon: "chart",
    },
    {
      category: "Statistiky obsahu",
      title: "AI ti řekne, co funguje a co ne",
      description:
        "Nestačí vidět čísla - potřebuješ vědět PROČ. SocialMat analyzuje tvůj obsah a vysvětlí, které hooky, délky a formáty přinášejí nejvíc engagement.",
      details: ["Doporučené kroky pro růst", "Predikce výkonu příštího postu", "Trendy ve tvém oboru"],
      icon: "target",
    },
    {
      category: "Auto reply",
      title: "Odpovídáme na komentáře místo tebe",
      description:
        "Nastav tón komunikace a SocialMat bude odpovídat fanouškům profesionálně, přátelsky a včas. V češtině i angličtině. Ty jen schválíš nebo necháš běžet na autopilot.",
      details: ["Filtrování spam a toxických komentářů", "Schválení jedním kliknutím", "Odkazy s UTM parametry"],
      icon: "message",
    },
    {
      category: "DM automatizace",
      title: "Automatické DM po klíčovém slově",
      description:
        "Když někdo napíše 'INFO' nebo 'CHCI', SocialMat mu pošle DM s PDF, slevou nebo odkazem na rezervaci. Sledujeme konverze a posíláme follow-upy.",
      details: ["Personalizované zprávy", "Automatické připomenutí po 24h", "Sledování ROI každého DM"],
      icon: "send",
    },
    {
      category: "AI Brainstorming",
      title: "Nikdy ti nedojdou nápady na obsah",
      description:
        "Řekni téma a SocialMat ti navrhne 3 úhly pohledu, hooky, celý copy i CTA. Pro Reels, Stories i carousely. Vytvoříme ti plán na celý měsíc během pár minut.",
      details: ["Export do Notion nebo Google Docs", "Multi-jazyčná verze", "Trendy a virální formáty"],
      icon: "lightbulb",
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

  const automationBenefits = [
    "Auto reply na komentáře v češtině i angličtině",
    "DM workflow navázaný na klíčové slovo",
    "Schvalování a editace odpovědi na jedno kliknutí",
  ];

  const currentYear = new Date().getFullYear();

  const statHighlights = [
    {
      value: 98.7,
      suffix: "%",
      label: "Přesnost českého AI",
      detail: "Validováno na 12k videích",
      decimals: 1,
    },
    {
      value: 30,
      suffix: "s",
      label: "Průměrná doba zpracování",
      detail: "Včetně exportu MP4",
      decimals: 0,
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

  const footerLinks = [
    {
      title: "Produkt",
      items: [
        { label: "Funkcionality", href: "#features" },
        { label: "Automatizace", href: "#automation" },
        { label: "Insights", href: "#insights" },
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
        className="fixed top-6 inset-x-0 z-50 flex justify-center px-4 opacity-0"
      >
        <div
          className={`${palette.navContainer} rounded-full px-8 py-3 flex items-center justify-between w-full max-w-4xl transition-all duration-300`}
        >
          {/* LOGO */}
          <button
            onClick={() => {
              window.location.href = "/";
            }}
            className={`flex items-center gap-2 font-bold text-lg tracking-tight cursor-pointer font-heading ${isDark ? "text-white" : "text-slate-900"
              }`}
          >
            SocialMat
          </button>

          {/* CENTER LINKS */}
          <div className="hidden md:flex items-center gap-8 text-sm font-semibold">
            {/* Features Dropdown */}
            <div className="relative">
              <button
                onClick={() => setFeaturesDropdownOpen(!featuresDropdownOpen)}
                onBlur={() => setTimeout(() => setFeaturesDropdownOpen(false), 150)}
                className={`${palette.navLinks} transition-colors duration-200 bg-transparent border-none cursor-pointer flex items-center gap-1`}
              >
                Funkce
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${featuresDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              {featuresDropdownOpen && (
                <div className={`absolute top-full left-1/2 -translate-x-1/2 mt-2 w-56 rounded-xl shadow-2xl border overflow-hidden z-50 ${isDark ? 'bg-black/95 backdrop-blur-xl border-white/10' : 'bg-white/95 backdrop-blur-xl border-slate-200'}`}>
                  <div className="py-2">
                    <a href="/features/titulky" className={`flex items-center gap-3 px-4 py-3 transition-colors ${isDark ? 'hover:bg-white/10 text-white/85' : 'hover:bg-slate-100 text-slate-700'}`}>
                      <Video className="w-5 h-5" />
                      <div>
                        <div className="font-semibold text-sm">AI Titulky</div>
                        <div className={`text-xs ${isDark ? 'text-white/60' : 'text-slate-500'}`}>Automatické titulky</div>
                      </div>
                    </a>
                    <a href="/features/video-editor" className={`flex items-center gap-3 px-4 py-3 transition-colors ${isDark ? 'hover:bg-white/10 text-white/85' : 'hover:bg-slate-100 text-slate-700'}`}>
                      <Edit3 className="w-5 h-5" />
                      <div>
                        <div className="font-semibold text-sm">Video Editor</div>
                        <div className={`text-xs ${isDark ? 'text-white/60' : 'text-slate-500'}`}>Úprava videí</div>
                      </div>
                    </a>
                    <a href="/features/analytics" className={`flex items-center gap-3 px-4 py-3 transition-colors ${isDark ? 'hover:bg-white/10 text-white/85' : 'hover:bg-slate-100 text-slate-700'}`}>
                      <BarChart3 className="w-5 h-5" />
                      <div>
                        <div className="font-semibold text-sm">Analýzy profilu</div>
                        <div className={`text-xs ${isDark ? 'text-white/60' : 'text-slate-500'}`}>Metriky & statistiky</div>
                      </div>
                    </a>
                    <a href="/features/stories" className={`flex items-center gap-3 px-4 py-3 transition-colors ${isDark ? 'hover:bg-white/10 text-white/85' : 'hover:bg-slate-100 text-slate-700'}`}>
                      <Image className="w-5 h-5" />
                      <div>
                        <div className="font-semibold text-sm">Stories Editor</div>
                        <div className={`text-xs ${isDark ? 'text-white/60' : 'text-slate-500'}`}>Tvorba Stories</div>
                      </div>
                    </a>
                    <a href="/features/kalendar" className={`flex items-center gap-3 px-4 py-3 transition-colors ${isDark ? 'hover:bg-white/10 text-white/85' : 'hover:bg-slate-100 text-slate-700'}`}>
                      <Calendar className="w-5 h-5" />
                      <div>
                        <div className="font-semibold text-sm">Kalendář</div>
                        <div className={`text-xs ${isDark ? 'text-white/60' : 'text-slate-500'}`}>Plánování obsahu</div>
                      </div>
                    </a>
                    <a href="/features/ai-content" className={`flex items-center gap-3 px-4 py-3 transition-colors ${isDark ? 'hover:bg-white/10 text-white/85' : 'hover:bg-slate-100 text-slate-700'}`}>
                      <Brain className="w-5 h-5" />
                      <div>
                        <div className="font-semibold text-sm">AI Content</div>
                        <div className={`text-xs ${isDark ? 'text-white/60' : 'text-slate-500'}`}>Generování obsahu</div>
                      </div>
                    </a>
                    <a href="/features/auto-reply" className={`flex items-center gap-3 px-4 py-3 transition-colors ${isDark ? 'hover:bg-white/10 text-white/85' : 'hover:bg-slate-100 text-slate-700'}`}>
                      <MessageSquare className="w-5 h-5" />
                      <div>
                        <div className="font-semibold text-sm">Auto Reply</div>
                        <div className={`text-xs ${isDark ? 'text-white/60' : 'text-slate-500'}`}>Automatické odpovědi</div>
                      </div>
                    </a>
                  </div>
                </div>
              )}
            </div>
            <button
              onClick={() => scrollToSection("pricing")}
              className={`${palette.navLinks} transition-colors duration-200 bg-transparent border-none cursor-pointer`}
            >
              Ceník
            </button>
            <button
              onClick={() => scrollToSection("contact")}
              className={`${palette.navLinks} transition-colors duration-200 bg-transparent border-none cursor-pointer`}
            >
              Kontakt
            </button>
          </div>

          {/* RIGHT BUTTONS */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setTheme(isDark ? "light" : "dark")}
              className={`relative h-9 w-16 rounded-full border transition-colors duration-300 ${isDark
                ? "bg-white/5 border-white/10"
                : "bg-white border-gray-200 shadow-[0_1px_4px_rgba(0,0,0,0.08)]"
                }`}
              aria-pressed={isDark}
            >
              <span className="sr-only">Přepnout vzhled</span>
              <Moon
                className={`absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 transition-opacity duration-300 ${isDark ? "opacity-100 text-amber-200" : "opacity-60 text-slate-500"
                  }`}
              />
              <Sun
                className={`absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 transition-opacity duration-300 ${isDark ? "opacity-0" : "opacity-100 text-amber-500"
                  }`}
              />
              <span
                className={`absolute top-[3px] left-1 h-7 w-7 rounded-full shadow transition-transform duration-300 ${isDark
                  ? "translate-x-7 bg-white/10 border border-white/15"
                  : "translate-x-0 bg-white border border-slate-200"
                  }`}
              />
            </button>
            <a
              href="/dashboard"
              className={`${palette.navLogin} text-sm font-semibold bg-transparent border-none cursor-pointer transition-colors duration-300`}
            >
              Přihlášení
            </a>
            <a
              href="/signup"
              className="text-white bg-gradient-to-r from-indigo-600 to-blue-500 py-2 px-6 rounded-full text-sm font-semibold transition-all duration-300 cursor-pointer shadow-md shadow-indigo-500/20 hover:from-indigo-500 hover:to-sky-500 hover:shadow-indigo-500/35"
            >
              Vyzkoušet zdarma
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        ref={heroRef}
        id="hero"
        className={`min-h-screen flex items-center justify-center relative overflow-visible py-32 pt-40 ${palette.page}`}
      >
        {/* GRID BACKGROUND */}
        <div
          className="absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage:
              `linear-gradient(${gridLineColor} 1.5px, transparent 1.5px), linear-gradient(90deg, ${gridLineColor} 1.5px, transparent 1.5px)`,
            backgroundSize: "80px 80px",
          }}
        />

        {/* SPOTLIGHT */}
        <div
          className="absolute -top-[5%] left-1/2 -translate-x-1/2 h-[220%] pointer-events-none"
          style={{
            width: "90vw",
            background: spotlightGradient,
            filter: "blur(180px)",
            opacity: 0.8,
          }}
        />

        {/* CONTENT */}
        <div className="text-center max-w-5xl mx-auto px-6 relative z-[2]">
          <div className="mb-6 flex justify-center">
            <span
              className={`inline-flex items-center gap-2 rounded-full px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] ${isDark ? "bg-white/10 text-white/70" : "bg-slate-100 text-slate-600"
                }`}
            >
              SocialMat Platform · 2025
            </span>
          </div>

          <h1
            className={`hero-title text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.9] tracking-tight mb-10 opacity-0 ${palette.heroTitle}`}
          >
            Váš nový{" "}
            <span className={`text-transparent bg-clip-text bg-gradient-to-r ${brandGradient}`}>
              AI marketingový tým
            </span>{" "}
            pro sociální sítě
          </h1>

          <p
            className={`hero-subtitle text-lg md:text-xl lg:text-2xl max-w-3xl mx-auto mb-12 leading-relaxed opacity-0 ${palette.heroSubtitle}`}
          >
            Česká AI aplikace, která za vás vytvoří titulky, analyzuje výkon, odpovídá na komentáře a vymýšlí obsah
            (rychleji, levněji a efektivněji než celý tým).
          </p>

          <div className="hero-buttons flex flex-col sm:flex-row gap-6 justify-center opacity-0">
            <Link
              href="/signup"
              className={`bg-gradient-to-r ${brandGradient} text-white py-4 px-10 rounded-full font-semibold text-lg border border-transparent transition-all duration-300 cursor-pointer ${brandGradientHover} ${brandGlow} flex items-center gap-2 justify-center`}
            >
              <Rocket className="w-5 h-5" />
              Vyzkoušet ZDARMA na 14 dní
            </Link>
            <button
              onClick={() => scrollToSection("features")}
              className={`px-10 py-4 rounded-full font-semibold text-lg border transition-all duration-300 ${isDark
                ? "border-white/30 text-white hover:border-white/60 hover:bg-white/5"
                : "border-slate-200 text-slate-900 hover:bg-slate-900 hover:text-white"
                }`}
            >
              Prohlédnout funkce
            </button>
          </div>

          <div className={`mt-6 text-sm opacity-0 hero-subtitle ${isDark ? "text-white/60" : "text-slate-500"} flex items-center justify-center gap-4 flex-wrap`}>
            <span className="flex items-center gap-1"><Sparkles className="w-4 h-4" /> Bez zadávání karty</span>
            <span>·</span>
            <span className="flex items-center gap-1"><Shield className="w-4 h-4" /> Možnost zrušit kdykoliv</span>
          </div>

          <div
            className={`mt-10 text-sm uppercase tracking-[0.4em] font-semibold ${isDark ? "text-white/50" : "text-slate-500"
              }`}
          >
            Týmy pro značky, agentury i startupy
          </div>

          {/* Hero Dashboard Mockup */}
          <div className="mt-16 relative">
            <div className={`relative rounded-3xl overflow-hidden border shadow-2xl ${isDark ? "border-white/10 bg-gradient-to-br from-white/10 to-white/5" : "border-slate-200 bg-white"
              }`}>
              <div className="aspect-[16/10] flex items-center justify-center p-8 md:p-12">
                {/* Mockup Grid */}
                <div className="w-full h-full grid grid-cols-3 gap-4">
                  {/* Left Panel */}
                  <div className={`col-span-2 rounded-2xl border-2 border-dashed flex flex-col gap-3 p-4 ${isDark ? "border-white/10" : "border-slate-200"
                    }`}>
                    <div className={`h-8 rounded-lg ${isDark ? "bg-white/10" : "bg-slate-100"}`} />
                    <div className={`flex-1 rounded-lg ${isDark ? "bg-white/5" : "bg-slate-50"} flex items-center justify-center`}>
                      <div className="text-center space-y-2">
                        <div className={`text-4xl ${isDark ? "text-white/30" : "text-slate-300"}`}>📊</div>
                        <p className={`text-xs font-semibold ${isDark ? "text-white/50" : "text-slate-400"}`}>
                          Dashboard View
                        </p>
                      </div>
                    </div>
                  </div>
                  {/* Right Panel */}
                  <div className="flex flex-col gap-3">
                    <div className={`flex-1 rounded-xl border-2 border-dashed flex items-center justify-center ${isDark ? "border-white/10" : "border-slate-200"
                      }`}>
                      <span className={`text-2xl ${isDark ? "text-white/30" : "text-slate-300"}`}>📈</span>
                    </div>
                    <div className={`flex-1 rounded-xl border-2 border-dashed flex items-center justify-center ${isDark ? "border-white/10" : "border-slate-200"
                      }`}>
                      <span className={`text-2xl ${isDark ? "text-white/30" : "text-slate-300"}`}>💬</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Floating Stats Cards */}
            <div className={`absolute -right-4 top-8 rounded-2xl border p-4 shadow-xl backdrop-blur-xl animate-bounce-slow ${isDark ? "bg-black/80 border-white/10" : "bg-white/90 border-slate-200"
              }`} style={{ animationDuration: "3s" }}>
              <div className={`text-xs uppercase tracking-wider mb-1 ${isDark ? "text-white/60" : "text-slate-500"}`}>Reach</div>
              <div className={`text-2xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}>124k</div>
              <div className="text-xs text-green-500 font-semibold flex items-center gap-1">
                <span>↑</span>+23%
              </div>
            </div>
            <div className={`absolute -left-4 bottom-12 rounded-2xl border p-4 shadow-xl backdrop-blur-xl animate-bounce-slow ${isDark ? "bg-black/80 border-white/10" : "bg-white/90 border-slate-200"
              }`} style={{ animationDuration: "3.5s", animationDelay: "0.5s" }}>
              <div className={`text-xs uppercase tracking-wider mb-1 ${isDark ? "text-white/60" : "text-slate-500"}`}>Engagement</div>
              <div className={`text-2xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}>8.4%</div>
              <div className="text-xs text-green-500 font-semibold flex items-center gap-1">
                <span>↑</span>+2.1%
              </div>
            </div>
          </div>

          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            {heroHighlights.map((highlight) => (
              <div
                key={highlight.title}
                className={`relative overflow-hidden rounded-3xl p-8 border transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl ${isDark
                  ? "bg-white/5 border-white/10"
                  : "bg-white border-slate-200 shadow-xl"
                  } flex flex-col gap-6`}
              >
                <div className="flex items-center justify-between">
                  <div
                    className={`h-14 w-14 rounded-2xl flex items-center justify-center bg-gradient-to-r ${brandGradient} text-white shadow-lg`}
                  >
                    {highlight.icon === "video" ? <Video className="w-7 h-7" /> : highlight.icon === "chart" ? <BarChart3 className="w-7 h-7" /> : <Lightbulb className="w-7 h-7" />}
                  </div>
                  <span
                    className={`inline-flex items-center text-[11px] font-semibold uppercase tracking-[0.2em] px-3 py-1 rounded-full ${isDark ? "bg-white/10 text-white/80" : "bg-slate-100 text-slate-600"
                      }`}
                  >
                    {highlight.badge}
                  </span>
                </div>
                <div>
                  <h3
                    className={`text-2xl font-bold mb-2 ${isDark ? "text-white" : "text-slate-900"
                      }`}
                  >
                    {highlight.title}
                  </h3>
                  <p
                    className={`text-sm leading-relaxed ${isDark ? "text-white/70" : "text-slate-600"
                      }`}
                  >
                    {highlight.description}
                  </p>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className={`text-3xl font-black ${isDark ? "text-white" : "text-slate-900"}`}>
                    {highlight.metric}
                  </span>
                  <div className={`h-px flex-1 ml-4 ${isDark ? "bg-white/20" : "bg-slate-200"}`} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works - 3 Steps Section */}
      <section className={`py-24 md:py-32 relative ${isDark ? "bg-gradient-to-b from-black via-zinc-950 to-black" : "bg-gradient-to-b from-slate-50 to-white"}`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className={`text-4xl md:text-6xl font-bold mb-6 ${isDark ? "text-white" : "text-slate-900"}`}>
              Začni podnikat ve 3 krocích
            </h2>
            <p className={`text-xl md:text-2xl max-w-3xl mx-auto ${isDark ? "text-white/70" : "text-slate-600"}`}>
              Žádné složité nastavování. Prostě nahraj video, klikni a hotovo.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {/* Step 1 */}
            <div className={`relative rounded-3xl p-8 md:p-10 transition-all duration-500 hover:-translate-y-2 ${isDark ? "bg-white/5 border border-white/10" : "bg-white border border-slate-200 shadow-xl"}`}>
              <div className="flex items-center gap-4 mb-6">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${isDark ? "bg-gradient-to-br from-indigo-500/30 to-blue-500/30" : "bg-gradient-to-br from-indigo-100 to-blue-100"}`}>
                  <PlayCircle className={`w-8 h-8 ${isDark ? "text-indigo-400" : "text-indigo-600"}`} />
                </div>
                <div className={`text-xl font-bold px-4 py-2 rounded-full ${isDark ? "bg-white/10 text-white" : "bg-gradient-to-r from-indigo-500 to-blue-500 text-white"}`}>
                  #1
                </div>
              </div>
              <h3 className={`text-2xl font-bold mb-4 ${isDark ? "text-white" : "text-slate-900"}`}>
                Nahraj své video
              </h3>
              <p className={`text-lg leading-relaxed ${isDark ? "text-white/70" : "text-slate-600"}`}>
                Přetáhni video z telefonu nebo počítače. SocialMat okamžitě rozpozná řeč a připraví české titulky.
              </p>
            </div>

            {/* Step 2 */}
            <div className={`relative rounded-3xl p-8 md:p-10 transition-all duration-500 hover:-translate-y-2 ${isDark ? "bg-white/5 border border-white/10" : "bg-white border border-slate-200 shadow-xl"}`}>
              <div className="flex items-center gap-4 mb-6">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${isDark ? "bg-gradient-to-br from-indigo-500/30 to-blue-500/30" : "bg-gradient-to-br from-indigo-100 to-blue-100"}`}>
                  <Edit3 className={`w-8 h-8 ${isDark ? "text-indigo-400" : "text-indigo-600"}`} />
                </div>
                <div className={`text-xl font-bold px-4 py-2 rounded-full ${isDark ? "bg-white/10 text-white" : "bg-gradient-to-r from-indigo-500 to-blue-500 text-white"}`}>
                  #2
                </div>
              </div>
              <h3 className={`text-2xl font-bold mb-4 ${isDark ? "text-white" : "text-slate-900"}`}>
                Uprav styl a obsah
              </h3>
              <p className={`text-lg leading-relaxed ${isDark ? "text-white/70" : "text-slate-600"}`}>
                Vyber barvy, font, pozici titulků. Přidej CTA slide nebo emoji. AI ti navrhne vylepšení textu.
              </p>
            </div>

            {/* Step 3 */}
            <div className={`relative rounded-3xl p-8 md:p-10 transition-all duration-500 hover:-translate-y-2 ${isDark ? "bg-white/5 border border-white/10" : "bg-white border border-slate-200 shadow-xl"}`}>
              <div className="flex items-center gap-4 mb-6">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${isDark ? "bg-gradient-to-br from-indigo-500/30 to-blue-500/30" : "bg-gradient-to-br from-indigo-100 to-blue-100"}`}>
                  <Zap className={`w-8 h-8 ${isDark ? "text-indigo-400" : "text-indigo-600"}`} />
                </div>
                <div className={`text-xl font-bold px-4 py-2 rounded-full ${isDark ? "bg-white/10 text-white" : "bg-gradient-to-r from-indigo-500 to-blue-500 text-white"}`}>
                  #3
                </div>
              </div>
              <h3 className={`text-2xl font-bold mb-4 ${isDark ? "text-white" : "text-slate-900"}`}>
                Stáhni a publikuj
              </h3>
              <p className={`text-lg leading-relaxed ${isDark ? "text-white/70" : "text-slate-600"}`}>
                Exportuj video s vypálenými titulky, nahraj na Instagram/TikTok a sleduj růst engagement v dashboardu.
              </p>
            </div>
          </div>

          <div className="text-center mt-16">
            <Link
              href="/signup"
              className={`inline-flex items-center gap-2 bg-gradient-to-r ${brandGradient} text-white py-4 px-12 rounded-full font-semibold text-lg transition-all duration-300 ${brandGradientHover} ${brandGlow}`}
            >
              <Target className="w-5 h-5" />
              Začít tvořit obsah nyní
            </Link>
          </div>
        </div>
      </section>

      {/* Media Coverage Section */}
      <section className={`py-16 relative ${isDark ? "bg-black" : "bg-white"}`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className={`text-sm uppercase tracking-[0.3em] font-semibold mb-4 ${isDark ? "text-white/60" : "text-slate-500"}`}>
              Píšou o nás přední česká média
            </p>
            <div className="flex flex-wrap items-center justify-center gap-12 md:gap-16">
              {/* Forbes */}
              <div className={`text-3xl font-bold tracking-tight opacity-40 hover:opacity-70 transition-opacity ${isDark ? "text-white" : "text-slate-900"}`}>
                Forbes
              </div>
              {/* StartItUp */}
              <div className={`text-2xl font-semibold opacity-40 hover:opacity-70 transition-opacity ${isDark ? "text-white" : "text-slate-900"}`}>
                StartItUp
              </div>
              {/* Živě.cz */}
              <div className={`text-2xl font-semibold opacity-40 hover:opacity-70 transition-opacity ${isDark ? "text-white" : "text-slate-900"}`}>
                Živě.cz
              </div>
              {/* Marketing Journal */}
              <div className={`text-2xl font-semibold opacity-40 hover:opacity-70 transition-opacity ${isDark ? "text-white" : "text-slate-900"}`}>
                MarketingJournal
              </div>
            </div>
          </div>

          {/* Social Proof Stats */}
          <div className="flex flex-wrap items-center justify-center gap-12 mt-12">
            <div className="text-center">
              <div className={`text-4xl font-bold mb-2 ${isDark ? "text-white" : "text-slate-900"}`}>
                1000+
              </div>
              <p className={`text-sm ${isDark ? "text-white/60" : "text-slate-600"}`}>
                Aktivních uživatelů
              </p>
            </div>
            <div className={`h-12 w-px ${isDark ? "bg-white/10" : "bg-slate-200"}`} />
            <div className="text-center">
              <div className={`text-4xl font-bold mb-2 ${isDark ? "text-white" : "text-slate-900"}`}>
                50k+
              </div>
              <p className={`text-sm ${isDark ? "text-white/60" : "text-slate-600"}`}>
                Vygenerovaných titulků
              </p>
            </div>
            <div className={`h-12 w-px ${isDark ? "bg-white/10" : "bg-slate-200"}`} />
            <div className="text-center">
              <div className={`text-4xl font-bold mb-2 ${isDark ? "text-white" : "text-slate-900"}`}>
                4.8/5
              </div>
              <p className={`text-sm ${isDark ? "text-white/60" : "text-slate-600"}`}>
                Hodnocení uživatelů
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        ref={featuresRef}
        id="features"
        className="py-32 md:py-48 relative overflow-visible"
      >
        <div className="max-w-7xl mx-auto px-10 relative z-[2]">
          <div className="text-center mb-20 md:mb-32">
            <h2
              className={`features-title text-4xl md:text-6xl font-bold mb-8 opacity-0 ${isDark ? "text-white" : "text-slate-900"
                }`}
            >
              Vše, co potřebuješ pro růst na sociálních sítích
            </h2>
            <p
              className={`features-subtitle text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed font-normal opacity-0 ${isDark ? "text-white/75" : "text-slate-600"
                }`}
            >
              Od titulků přes automatické odpovědi až po AI brainstorming. SocialMat je jediný nástroj, který skutečně potřebuješ.
            </p>
          </div>

          <div
            className={`features-grid grid grid-cols-1 md:grid-cols-2 gap-8 rounded-[40px] p-6 md:p-8 opacity-0 ${isDark ? "border border-white/10" : "border border-slate-200 bg-white"
              }`}
          >
            {coreFeatures.map((feature, index) => {
              const featureNumber = String(index + 1).padStart(2, "0");
              const featureLinks = [
                "/features/titulky",
                "/features/analytics",
                "/features/analytics",
                "/features/auto-reply",
                "#",
                "/features/ai-content"
              ];
              const featureLink = featureLinks[index] || "#";
              
              return (
                <Link
                  key={feature.title}
                  href={featureLink}
                  className={`feature-card relative overflow-hidden ${palette.featureCard} p-8 md:p-12 transition-all duration-500 flex flex-col h-full group cursor-pointer rounded-3xl opacity-0 hover:scale-[1.02]`}
                >
                  <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 pointer-events-none">
                    <div className={`absolute inset-0 ${palette.featureOverlay.touch} md:hidden`} />
                    <div
                      className="absolute inset-0 hidden md:block"
                      style={{
                        background: palette.featureOverlay.desktop(index),
                      }}
                    />
                  </div>
                  <div
                    className={`absolute -left-10 -top-10 w-40 h-40 rounded-full blur-3xl opacity-0 group-hover:opacity-80 transition-opacity duration-500 ${isDark ? "bg-white/5" : "bg-indigo-200/30"
                      }`}
                  />

                  <div className="relative z-[2] flex flex-col gap-6">
                    {/* Feature Visual - Enhanced with gradient backgrounds */}
                    <div className={`rounded-2xl border overflow-hidden ${isDark ? "border-white/10" : "border-slate-200"
                      }`}>
                      <div className={`aspect-video flex items-center justify-center ${
                        index === 0 ? "bg-gradient-to-br from-indigo-500/10 to-blue-500/10" :
                        index === 1 ? "bg-gradient-to-br from-emerald-500/10 to-teal-500/10" :
                        index === 2 ? "bg-gradient-to-br from-purple-500/10 to-pink-500/10" :
                        index === 3 ? "bg-gradient-to-br from-orange-500/10 to-red-500/10" :
                        index === 4 ? "bg-gradient-to-br from-cyan-500/10 to-blue-500/10" :
                        "bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10"
                      }`}>
                        <div className="text-center space-y-3">
                          <div className={`flex items-center justify-center w-20 h-20 rounded-2xl mx-auto ${
                            index === 0 ? "bg-gradient-to-br from-indigo-500 to-blue-500" :
                            index === 1 ? "bg-gradient-to-br from-emerald-500 to-teal-500" :
                            index === 2 ? "bg-gradient-to-br from-purple-500 to-pink-500" :
                            index === 3 ? "bg-gradient-to-br from-orange-500 to-red-500" :
                            index === 4 ? "bg-gradient-to-br from-cyan-500 to-blue-500" :
                            "bg-gradient-to-br from-violet-500 to-fuchsia-500"
                          } text-white shadow-lg`}>
                            {coreFeatures[index].icon === "video" ? <Video className="w-10 h-10" /> :
                              coreFeatures[index].icon === "chart" ? <BarChart3 className="w-10 h-10" /> :
                                coreFeatures[index].icon === "target" ? <Target className="w-10 h-10" /> :
                                  coreFeatures[index].icon === "message" ? <MessageSquare className="w-10 h-10" /> :
                                    coreFeatures[index].icon === "send" ? <Send className="w-10 h-10" /> :
                                      <Lightbulb className="w-10 h-10" />}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div
                        className={`text-sm font-semibold tracking-[0.4em] uppercase ${isDark ? "text-white/40" : "text-slate-400"
                          }`}
                      >
                        {featureNumber}
                      </div>
                      <span
                        className={`inline-flex text-[11px] uppercase tracking-[0.2em] font-semibold px-3 py-1 rounded-full bg-gradient-to-r ${brandGradient} text-white`}
                      >
                        {feature.category}
                      </span>
                    </div>
                    <div>
                      <h3
                        className={`text-3xl font-bold mb-3 tracking-tight leading-tight ${isDark ? "text-white" : "text-slate-900"
                          }`}
                      >
                        {feature.title}
                      </h3>
                      <p
                        className={`leading-relaxed text-base font-normal ${isDark ? "text-white/75" : "text-slate-600"
                          }`}
                      >
                        {feature.description}
                      </p>
                    </div>
                    {feature.details?.length ? (
                      <ul
                        className={`pt-4 border-t text-sm space-y-2 ${isDark
                          ? "border-white/10 text-white/65"
                          : "border-slate-200 text-slate-600"
                          }`}
                      >
                        {feature.details.map((detail) => (
                          <li key={detail} className="flex items-center gap-2">
                            <span className={`h-1.5 w-1.5 rounded-full ${palette.pricingDot}`} />
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                    
                    {/* "Zjistit více" link */}
                    <div className={`flex items-center gap-2 text-sm font-semibold mt-auto pt-4 transition-all group-hover:gap-3 ${
                      index === 0 ? "text-indigo-500" :
                      index === 1 ? "text-emerald-500" :
                      index === 2 ? "text-purple-500" :
                      index === 3 ? "text-orange-500" :
                      index === 4 ? "text-cyan-500" :
                      "text-violet-500"
                    }`}>
                      <span>Zjistit více</span>
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Automation Section */}
      <section
        id="automation"
        className="relative py-24 md:py-32 px-6 overflow-hidden"
      >
        <div
          className="absolute inset-0 opacity-60"
          style={{
            background:
              "radial-gradient(circle at top, rgba(253,186,116,0.25), transparent 55%)",
          }}
        />
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 relative z-[2]">
          <div className="order-1 md:order-2 space-y-6">
            <p
              className={`text-sm uppercase tracking-[0.3em] font-semibold ${isDark ? "text-white/60" : "text-slate-500"
                }`}
            >
              Automatizace komentářů & DM
            </p>
            <h2
              className={`text-4xl md:text-5xl font-bold leading-tight ${isDark ? "text-white" : "text-slate-900"
                }`}
            >
              Každý komentář se promění na kvalifikovaný lead
            </h2>
            <p
              className={`text-lg leading-relaxed ${isDark ? "text-white/70" : "text-slate-600"
                }`}
            >
              SocialMat sleduje komentáře v reálném čase, odpoví na ně v brand voice
              a naváže konverzaci v DM. Vidíte, kolik prodejů nebo registrací přinesla
              každá automatizace.
            </p>
            <ul className="space-y-3">
              {automationBenefits.map((benefit) => (
                <li
                  key={benefit}
                  className={`flex items-start gap-3 text-sm ${isDark ? "text-white/70" : "text-slate-600"
                    }`}
                >
                  <span
                    className={`mt-1 h-2 w-2 rounded-full bg-gradient-to-r ${brandGradient}`}
                  />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
            <div
              className={`inline-flex items-center gap-3 rounded-full px-5 py-3 text-sm font-semibold bg-gradient-to-r ${brandGradient} text-white`}
            >
              <span>Nepropásnete žádnou reakci</span>
            </div>
          </div>

          <div className="relative">
            <div
              className={`absolute left-6 top-0 bottom-0 w-px ${isDark
                ? "bg-gradient-to-b from-white/40 via-white/10 to-transparent"
                : "bg-gradient-to-b from-slate-300 via-slate-200 to-transparent"
                }`}
            />
            <div className="space-y-6 pl-14">
              {automationFlows.map((flow, index) => {
                const timelineNumber = String(index + 1).padStart(2, "0");
                return (
                  <div
                    key={flow.title}
                    className={`relative rounded-2xl p-6 border overflow-hidden ${isDark
                      ? "bg-white/5 border-white/10"
                      : "bg-white border-slate-200 shadow-xl"
                      }`}
                  >
                    <div
                      className={`absolute -left-14 top-6 h-12 w-12 rounded-2xl flex items-center justify-center text-xs font-bold uppercase tracking-wide bg-gradient-to-r ${brandGradient} text-white shadow-lg shadow-orange-500/25`}
                    >
                      {timelineNumber}
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className={`text-xs font-semibold uppercase tracking-[0.2em] ${isDark ? "text-white/60" : "text-slate-500"
                          }`}
                      >
                        {flow.stage}
                      </span>
                      <span
                        className={`text-xs font-semibold ${isDark ? "text-white/70" : "text-slate-600"
                          }`}
                      >
                        {flow.outcome}
                      </span>
                    </div>
                    <h3
                      className={`text-2xl font-semibold mb-2 ${isDark ? "text-white" : "text-slate-900"
                        }`}
                    >
                      {flow.title}
                    </h3>
                    <p
                      className={`text-sm leading-relaxed ${isDark ? "text-white/65" : "text-slate-600"
                        }`}
                    >
                      {flow.detail}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Insights Section */}
      <section id="insights" className="py-24 md:py-32 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className={`rounded-[32px] p-8 md:p-10 border relative overflow-hidden ${isDark ? "bg-white/5 border-white/10" : "bg-white border-slate-200 shadow-2xl"
            }`}>
            <div className="absolute inset-0 opacity-20 bg-[conic-gradient(at_top,_rgba(251,113,133,0.3),_transparent_60%)]" />
            {/* Mini Chart Illustration */}
            <div className={`absolute top-4 right-4 rounded-xl border p-3 ${isDark ? "border-white/10 bg-white/5" : "border-slate-200 bg-white/80"
              }`}>
              <div className="flex items-end gap-1 h-12 w-16">
                <div className="w-2 bg-gradient-to-t from-orange-500 to-pink-500 rounded-t" style={{ height: "40%" }} />
                <div className="w-2 bg-gradient-to-t from-orange-500 to-pink-500 rounded-t" style={{ height: "70%" }} />
                <div className="w-2 bg-gradient-to-t from-orange-500 to-pink-500 rounded-t" style={{ height: "55%" }} />
                <div className="w-2 bg-gradient-to-t from-orange-500 to-pink-500 rounded-t" style={{ height: "90%" }} />
                <div className="w-2 bg-gradient-to-t from-orange-500 to-pink-500 rounded-t" style={{ height: "100%" }} />
              </div>
            </div>
            <div className="relative grid gap-4 sm:grid-cols-2">
              {insightWidgets.map((widget) => (
                <div
                  key={widget.label}
                  className={`rounded-2xl p-6 border flex flex-col gap-2 ${isDark
                    ? "border-white/10 bg-white/5"
                    : "border-slate-200 bg-white/80"
                    }`}
                >
                  <p
                    className={`text-xs uppercase tracking-[0.2em] mb-2 ${isDark ? "text-white/60" : "text-slate-500"
                      }`}
                  >
                    {widget.label}
                  </p>
                  <div
                    className={`text-3xl font-black ${isDark ? "text-white" : "text-slate-900"
                      }`}
                  >
                    {widget.value}
                  </div>
                  <p
                    className={`text-sm leading-relaxed ${isDark ? "text-white/70" : "text-slate-600"
                      }`}
                  >
                    {widget.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <p
              className={`text-sm uppercase tracking-[0.3em] font-semibold ${isDark ? "text-white/60" : "text-slate-500"
                }`}
            >
              Insights & Brainstorming
            </p>
            <h2
              className={`text-4xl md:text-5xl font-bold leading-tight ${isDark ? "text-white" : "text-slate-900"
                }`}
            >
              Data, která hovoří, a AI, která navrhne další krok
            </h2>
            <p
              className={`text-lg leading-relaxed ${isDark ? "text-white/70" : "text-slate-600"
                }`}
            >
              SocialMat propojuje statistiky z Instagramu s vlastním AI modelem.
              Ten popíše, co fungovalo, doporučí formát a přidá brainstorming pro
              další publikaci. Nemusíte přepisovat čísla do prezentací.
            </p>
            <ul className="space-y-3">
              {insightSteps.map((step) => (
                <li
                  key={step}
                  className={`flex items-start gap-3 text-sm ${isDark ? "text-white/70" : "text-slate-600"
                    }`}
                >
                  <span className={`mt-1 h-2 w-2 rounded-full bg-gradient-to-r ${brandGradient}`} />
                  <span>{step}</span>
                </li>
              ))}
            </ul>
            <div
              className={`flex items-center gap-4 text-sm ${isDark ? "text-white/70" : "text-slate-600"
                }`}
            >
              <span className={`flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r ${brandGradient} text-white font-bold`}>
                AI
              </span>
              <span>
                Brainstorm board navrhne obsahové pilíře a titulky na měsíc dopředu,
                včetně auto-exportu do Notion nebo Google Sheets.
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section
        ref={statsRef}
        className={`py-24 md:py-32 px-6 relative ${palette.statsSection}`}
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-24">
            <h2
              className={`stats-heading text-4xl md:text-6xl font-bold mb-8 opacity-0 ${isDark ? "text-white" : "text-slate-900"
                }`}
            >
              Věříme v transparentnost
            </h2>
            <p
              className={`stats-subtitle text-lg max-w-2xl mx-auto opacity-0 ${palette.statsSubtitle}`}
            >
              Naše čísla hovoří za nás
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {statHighlights.map((stat) => (
              <div
                key={stat.label}
                className={`stat-item relative rounded-3xl border p-8 opacity-0 ${isDark ? "border-white/10 bg-white/5" : "border-slate-200 bg-white shadow-xl"
                  }`}
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className={`h-10 w-10 rounded-xl flex items-center justify-center bg-gradient-to-r ${brandGradient}`}>
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
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section
        id="pricing"
        className={`py-24 md:py-32 px-6 ${palette.pricingSection}`}
      >
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h2
              className={`text-4xl md:text-6xl font-bold tracking-tight ${isDark ? "text-white" : "text-slate-900"
                }`}
            >
              Jednoduchý ceník
            </h2>
            <p
              className={`text-lg max-w-2xl mx-auto ${isDark ? "text-white/70" : "text-slate-600"
                }`}
            >
              Bez skrytých poplatků, bez komplikací. Vyber si plán a začni tvořit obsah, který roste tvůj business.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {pricingPlans.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-3xl p-8 flex flex-col gap-6 border-2 transition-all duration-500 hover:-translate-y-2 ${plan.highlight
                  ? `${palette.pricingHighlightBorder} ${brandGlow}`
                  : palette.pricingBorder
                  } ${isDark ? "bg-white/5 hover:bg-white/10" : "bg-white hover:shadow-2xl"}`}
              >
                {plan.highlight && (
                  <span className="absolute -top-3 left-6 px-4 py-1.5 rounded-full bg-gradient-to-r from-indigo-600 to-blue-500 text-white text-sm font-bold shadow-lg animate-pulse">
                    ⭐ NEJPOPULÁRNĚJŠÍ
                  </span>
                )}
                <div className="space-y-2">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`h-14 w-14 rounded-2xl flex items-center justify-center ${plan.highlight ? `bg-gradient-to-r ${brandGradient}` : isDark ? "bg-white/10" : "bg-slate-100"
                      }`}>
                      {plan.name === "Starter" ? <Rocket className={`w-7 h-7 ${plan.highlight ? "text-white" : isDark ? "text-white/70" : "text-slate-600"}`} /> : plan.name === "Pro" ? <Star className={`w-7 h-7 ${plan.highlight ? "text-white" : isDark ? "text-white/70" : "text-slate-600"}`} /> : <Briefcase className={`w-7 h-7 ${plan.highlight ? "text-white" : isDark ? "text-white/70" : "text-slate-600"}`} />}
                    </div>
                    <h3
                      className={`text-2xl font-bold tracking-tight ${isDark ? "text-white" : "text-slate-900"
                        }`}
                    >
                      {plan.name}
                    </h3>
                  </div>
                  <p
                    className={`text-sm ${isDark ? "text-white/70" : "text-slate-600"
                      }`}
                  >
                    {plan.desc}
                  </p>
                </div>
                <div>
                  <div
                    className={`text-5xl font-bold ${isDark ? "text-white" : "text-slate-900"
                      }`}
                  >
                    {plan.price}
                    {plan.period ? (
                      <span
                        className={`text-lg font-normal ml-2 ${isDark ? "text-white/60" : "text-slate-500"
                          }`}
                      >
                        {plan.period}
                      </span>
                    ) : null}
                  </div>
                </div>
                <ul
                  className={`space-y-3 text-sm flex-1 ${isDark ? "text-white/80" : "text-slate-700"
                    }`}
                >
                  {plan.perks.map((perk) => (
                    <li
                      key={perk}
                      className="flex items-start gap-3 leading-relaxed"
                    >
                      <span className={`mt-1 h-2 w-2 rounded-full ${palette.pricingDot}`} />
                      <span>{perk}</span>
                    </li>
                  ))}
                </ul>
                <div className="pt-2">
                  <button
                    className={`w-full h-12 rounded-full font-semibold text-sm transition-all duration-500 ease-out ${plan.highlight
                      ? "bg-gradient-to-r from-indigo-600 to-blue-500 text-white hover:from-indigo-500 hover:to-sky-500 shadow-lg shadow-indigo-500/25"
                      : `bg-transparent text-white border hover:bg-indigo-500/10 hover:border-indigo-500 ${isDark
                        ? "border-white/15 text-white"
                        : "border-slate-200 text-slate-900"
                      }`
                      }`}
                  >
                    {plan.cta}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className={`py-24 md:py-32 px-6 ${isDark ? 'bg-gradient-to-b from-black via-[#0a0a0a] to-black' : 'bg-gradient-to-b from-slate-50 via-white to-slate-50'}`}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-4 mb-20">
            <h2 className={`text-4xl md:text-6xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
              💬 Co říkají naši zákazníci?
            </h2>
            <p className={`text-lg md:text-xl max-w-2xl mx-auto ${isDark ? 'text-white/70' : 'text-slate-600'}`}>
              Přidejte se k více než 1000 spokojených tvůrců z Česka a Slovenska
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className={`p-8 md:p-10 rounded-3xl border ${isDark
                  ? 'bg-white/5 border-white/10 hover:bg-white/10'
                  : 'bg-white border-slate-200 hover:shadow-2xl'
                  } transition-all duration-500 hover:-translate-y-2`}
              >
                <div className="flex items-start gap-4 mb-6">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center font-bold text-xl ${isDark ? 'bg-gradient-to-br from-indigo-500/30 to-purple-500/30 text-indigo-300' : 'bg-gradient-to-br from-indigo-100 to-purple-100 text-indigo-700'
                    }`}>
                    {testimonial.avatar}
                  </div>
                  <div className="flex-1">
                    <h3 className={`font-bold text-lg ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {testimonial.name}
                    </h3>
                    <p className={`text-sm ${isDark ? 'text-white/60' : 'text-slate-600'}`}>
                      {testimonial.role}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                      </svg>
                    ))}
                  </div>
                </div>

                <p className={`text-base leading-relaxed ${isDark ? 'text-white/80' : 'text-slate-700'}`}>
                  &quot;{testimonial.text}&quot;
                </p>
              </div>
            ))}
          </div>

          {/* Featured Testimonial */}
          <div className={`mt-12 p-10 md:p-12 rounded-3xl border ${isDark ? 'bg-gradient-to-br from-indigo-950/50 to-purple-950/30 border-indigo-500/30' : 'bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200'
            }`}>
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className={`w-20 h-20 rounded-full flex items-center justify-center font-bold text-2xl shrink-0 ${isDark ? 'bg-gradient-to-br from-indigo-500/40 to-purple-500/40 text-indigo-200' : 'bg-gradient-to-br from-indigo-200 to-purple-200 text-indigo-800'
                }`}>
                PE
              </div>
              <div className="flex-1 text-center md:text-left">
                <p className={`text-lg md:text-xl leading-relaxed mb-4 ${isDark ? 'text-white/90' : 'text-slate-800'}`}>
                  &quot;SocialMat je přesně to, co jsem hledala! Jednoduše a následně vše automaticky za mě prodává. Je to jako kdybych vůbec nepodnikala a jen mi chodily peníze. 😄 Miluju to!&quot;
                </p>
                <div>
                  <p className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    @perfekcionistkaeliska
                  </p>
                  <p className={`text-sm ${isDark ? 'text-white/60' : 'text-slate-600'}`}>
                    275k sledujících na IG · Tvůrce obsahu
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Price Comparison Section */}
      <section className={`py-24 md:py-32 px-6 ${isDark ? 'bg-black' : 'bg-white'}`}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 className={`text-4xl md:text-6xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
              💸 Ušetři tisíce měsíčně za jiné aplikace
            </h2>
            <p className={`text-lg md:text-xl max-w-3xl mx-auto ${isDark ? 'text-white/70' : 'text-slate-600'}`}>
              SocialMat nahradí složité weby, funnelové softwary a 5+ dalších aplikací. Jednodušší, efektivnější a levnější řešení pro tvé podnikání.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Competitors Side */}
            <div className={`p-8 rounded-2xl border ${isDark ? 'bg-red-950/20 border-red-500/30' : 'bg-red-50 border-red-200'
              }`}>
              <h3 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Bez SocialMat
              </h3>
              <div className="space-y-4">
                {competitorComparison.map((comp, index) => (
                  <div key={index} className={`p-4 rounded-lg ${isDark ? 'bg-black/40' : 'bg-white'
                    }`}>
                    <div className="flex justify-between items-start mb-2">
                      <span className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {comp.tool}
                      </span>
                      <span className={`font-bold ${isDark ? 'text-red-400' : 'text-red-600'}`}>
                        {comp.price}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {comp.features.map((feature, i) => (
                        <span key={i} className={`text-xs px-2 py-1 rounded ${isDark ? 'bg-white/10 text-white/70' : 'bg-slate-100 text-slate-600'
                          }`}>
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
                <div className={`mt-6 pt-6 border-t ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
                  <div className="flex justify-between items-center">
                    <span className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      Celkem měsíčně:
                    </span>
                    <span className={`text-3xl font-bold ${isDark ? 'text-red-400' : 'text-red-600'}`}>
                      $77
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* SocialMat Side */}
            <div className={`p-8 rounded-2xl border relative overflow-hidden ${isDark
              ? 'bg-gradient-to-br from-indigo-950/40 to-blue-950/40 border-indigo-500/50'
              : 'bg-gradient-to-br from-indigo-50 to-blue-50 border-indigo-200'
              }`}>
              <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold ${isDark ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-700'
                }`}>
                UŠETŘETE 87%
              </div>

              <h3 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Se SocialMat
              </h3>

              <div className={`p-6 rounded-lg mb-6 ${isDark ? 'bg-black/40' : 'bg-white'
                }`}>
                <div className="flex justify-between items-start mb-4">
                  <span className={`font-semibold text-lg ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    SocialMat Pro
                  </span>
                  <span className={`font-bold text-2xl ${isDark ? 'text-green-400' : 'text-green-600'}`}>
                    €10
                  </span>
                </div>
                <div className="space-y-2">
                  {[
                    'AI Titulky a přepisy',
                    'Video Editor',
                    'AI Content generátor',
                    'Automatické plánování',
                    'Analytics a insights',
                    'Chatboty a automatizace',
                    'Multi-platform export',
                    'Neomezený storage'
                  ].map((feature, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <svg className={`w-5 h-5 ${isDark ? 'text-green-400' : 'text-green-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className={`text-sm ${isDark ? 'text-white/80' : 'text-slate-700'}`}>
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className={`p-4 rounded-lg ${isDark ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20' : 'bg-gradient-to-r from-green-100 to-emerald-100'
                }`}>
                <div className="text-center">
                  <p className={`text-sm mb-1 ${isDark ? 'text-white/70' : 'text-slate-600'}`}>
                    Ušetříte každý měsíc
                  </p>
                  <p className={`text-4xl font-bold ${isDark ? 'text-green-400' : 'text-green-600'}`}>
                    $67
                  </p>
                  <p className={`text-xs mt-1 ${isDark ? 'text-white/60' : 'text-slate-500'}`}>
                    To je $804 ročně!
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <Link href="/signup">
              <button className={`px-12 py-5 rounded-full bg-gradient-to-r ${brandGradient} text-white font-bold text-xl transition-all duration-300 ${brandGradientHover} ${brandGlow} hover:scale-105`}>
                🎯 Začít šetřit ZDARMA
              </button>
            </Link>
            <p className={`mt-4 text-sm ${isDark ? 'text-white/60' : 'text-slate-500'}`}>
              ✨ Bez zadání karty · Zruš kdykoliv · 14 dní trial
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className={`py-24 md:py-32 px-6 ${isDark ? 'bg-gradient-to-b from-black to-zinc-950' : 'bg-gradient-to-b from-white to-slate-50'}`}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className={`text-4xl md:text-6xl font-bold mb-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              ❓ Často kladené otázky
            </h2>
            <p className={`text-lg md:text-xl ${isDark ? 'text-white/70' : 'text-slate-600'}`}>
              Máte otázky? Máme odpovědi!
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
              <button className={`inline-flex items-center gap-2 bg-gradient-to-r ${brandGradient} text-white py-3 px-8 rounded-full font-semibold text-lg transition-all duration-300 ${brandGradientHover} ${brandGlow}`}>
                <MessageCircle className="w-5 h-5" />
                Napsat podporu
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        id="contact"
        className={`px-6 pt-24 pb-12 ${isDark
          ? "bg-black text-white"
          : "bg-gradient-to-b from-white via-slate-50 to-slate-100 text-slate-900"
          }`}
      >
        <div className="max-w-6xl mx-auto flex flex-col gap-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="space-y-4">
              <span
                className={`text-xs uppercase tracking-[0.4em] ${isDark ? "text-white/70" : "text-slate-500"
                  }`}
              >
                SocialMat
              </span>
              <h3 className="text-3xl font-bold tracking-tight">
                Od tvůrců pro tvůrce
              </h3>
              <p className={`text-sm ${isDark ? "text-white/70" : "text-slate-600"}`}>
                Vytváříme nástroje, které jsme sami potřebovali pro vedení content týmů.
                Přidejte se a mějte titulky, metriky i komunitu v jednom dashboardu.
              </p>
            </div>
            <div className="md:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-8">
              {footerLinks.map((group) => (
                <div key={group.title} className="space-y-3">
                  <h4 className="text-sm font-semibold uppercase tracking-[0.2em]">
                    {group.title}
                  </h4>
                  <ul
                    className={`space-y-2 text-sm ${isDark ? "text-white/70" : "text-slate-600"
                      }`}
                  >
                    {group.items.map((item) => (
                      <li key={item.label}>
                        <a
                          href={item.href}
                          className={`transition-colors ${isDark
                            ? "hover:text-white"
                            : "hover:text-slate-900"
                            }`}
                        >
                          {item.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs uppercase tracking-[0.3em]">
            <span className={`${isDark ? "text-white/50" : "text-slate-500"}`}>
              © {currentYear} SocialMat
            </span>
            <span className={`inline-flex items-center gap-2 ${isDark ? "text-white/70" : "text-slate-600"}`}>
              <span className="h-1 w-1 rounded-full bg-current" />
              Od tvůrců pro tvůrce
              <span className="h-1 w-1 rounded-full bg-current" />
            </span>
            <div className="flex items-center gap-4 text-sm">
              <a
                href="https://instagram.com"
                className={`hover:underline ${isDark ? "text-white/80" : "text-slate-600"
                  }`}
              >
                Instagram
              </a>
              <a
                href="mailto:hello@socialmat.app"
                className={`hover:underline ${isDark ? "text-white/80" : "text-slate-600"
                  }`}
              >
                hello@socialmat.app
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
