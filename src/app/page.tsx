"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Brain,
  BarChart3,
  Calendar,
  ChevronDown,
  ChevronRight,
  Edit3,
  MessageSquare,
  Moon,
  Play,
  Sparkles,
  Sun,
  Video,
  Zap,
  Check,
  Star,
  Instagram,
  Clock,
  TrendingUp,
  Shield,
  CreditCard,
  Users,
  MessageCircle,
  Wand2,
  Bot,
  LineChart,
  Layers,
  Send,
  Heart,
  X,
  Menu,
} from "lucide-react";

export default function LandingPage() {
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [featuresDropdownOpen, setFeaturesDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.15], [1, 0.95]);

  useEffect(() => {
    // Auto-rotate testimonials
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const isDark = theme === "dark";
  const currentYear = new Date().getFullYear();

  // Gradient colors
  const gradientPrimary = "from-violet-600 via-fuchsia-500 to-orange-400";
  const gradientSecondary = "from-violet-500 to-fuchsia-500";
  const gradientText = "bg-gradient-to-r from-violet-400 via-fuchsia-400 to-orange-300 bg-clip-text text-transparent";

  // Features data
  const features = [
    {
      icon: Video,
      title: "AI Titulky",
      description: "Automatické titulky v češtině a slovenštině. 95%+ přesnost i u rychlé řeči. Export do SRT nebo přímo do videa.",
      color: "from-violet-500 to-purple-600",
      href: "/features/titulky",
      badge: "Populární",
    },
    {
      icon: Bot,
      title: "Auto-reply chatbot",
      description: "Automatické odpovědi na komentáře a DM ve tvém tónu. Předá konverzaci člověku když je potřeba.",
      color: "from-fuchsia-500 to-pink-600",
      href: "/features/auto-reply",
      badge: "Nové",
    },
    {
      icon: LineChart,
      title: "Analytics dashboard",
      description: "Real-time metriky tvého účtu. AI ti řekne co funguje a proč. Doporučení na zlepšení.",
      color: "from-orange-500 to-red-500",
      href: "/features/analytics",
    },
    {
      icon: Edit3,
      title: "Video Editor",
      description: "Střih videí přímo v prohlížeči. Šablony pro Reels a Stories. Drag & drop jednoduchost.",
      color: "from-cyan-500 to-blue-600",
      href: "/features/video-editor",
    },
    {
      icon: Calendar,
      title: "Plánování obsahu",
      description: "Naplánuj posty na týdny dopředu. AI ti navrhne nejlepší čas publikace.",
      color: "from-green-500 to-emerald-600",
      href: "/features/kalendar",
    },
    {
      icon: Brain,
      title: "AI Brainstorming",
      description: "Generuje nápady, hooky a skripty. Personalizované podle tvého stylu a audience.",
      color: "from-amber-500 to-orange-600",
      href: "/features/ai-content",
    },
  ];

  // How it works steps
  const steps = [
    {
      number: "01",
      emoji: "📱",
      title: "Připoj svůj účet",
      description: "Propoj Instagram za 30 sekund. Bezpečné OAuth přihlášení.",
    },
    {
      number: "02",
      emoji: "🎬",
      title: "Nahraj video",
      description: "Drag & drop nebo vyber z knihovny. Podporujeme všechny formáty.",
    },
    {
      number: "03",
      emoji: "✨",
      title: "AI udělá zbytek",
      description: "Titulky, odpovědi, analytics. Vše automaticky za pár sekund.",
    },
  ];

  // Testimonials
  const testimonials = [
    {
      name: "Tereza Králová",
      role: "Content Creator",
      handle: "@tereza.creates",
      avatar: "/avatars/tereza.jpg",
      text: "SocialMat mi ušetřil hodiny práce týdně. Titulky jsou přesné, automatické odpovědi fungují skvěle. Konečně mám čas na tvorbu, ne na admin! 🙌",
      followers: "52K",
    },
    {
      name: "Jakub Novotný",
      role: "Fitness Influencer",
      handle: "@jakub.fit",
      avatar: "/avatars/jakub.jpg",
      text: "Nejlepší investice do mého contentu. Auto-reply mi přinesl 3x více leadů na můj program. Analytics jsou super přehledné.",
      followers: "128K",
    },
    {
      name: "Marie Svobodová",
      role: "Marketing Agency Owner",
      handle: "@marie.social",
      avatar: "/avatars/marie.jpg",
      text: "Spravujeme 15 účtů a SocialMat nám šetří minimálně 20 hodin týdně. ROI je neuvěřitelný. Doporučuji všem agenturám!",
      followers: "89K",
    },
    {
      name: "Petr Dvořák",
      role: "E-commerce Owner",
      handle: "@petr.ecom",
      avatar: "/avatars/petr.jpg",
      text: "Chatbot odpovídá na dotazy zákazníků 24/7. Konverze z Instagramu vzrostly o 47%. SocialMat je game changer.",
      followers: "34K",
    },
    {
      name: "Anna Černá",
      role: "Lifestyle Blogger",
      handle: "@anna.lifestyle",
      avatar: "/avatars/anna.jpg",
      text: "Miluji jak jednoduché je vytvořit Reels s titulky. Dřív mi to zabralo hodinu, teď 2 minuty. Kvalita je top! 💜",
      followers: "67K",
    },
  ];

  // Pricing plans
  const pricingPlans = [
    {
      name: "Starter",
      price: "Zdarma",
      period: "navždy",
      description: "Pro vyzkoušení a první kroky",
      features: [
        "10 minut AI titulků měsíčně",
        "Základní šablony",
        "Export MP4",
        "Email podpora",
      ],
      cta: "Začít zdarma",
      highlight: false,
    },
    {
      name: "Pro",
      price: "299 Kč",
      period: "měsíčně",
      description: "Pro aktivní tvůrce",
      features: [
        "180 minut AI titulků",
        "Auto-reply chatbot",
        "Analytics dashboard",
        "Prémiové šablony",
        "Prioritní fronta",
        "Chat podpora",
      ],
      cta: "Vyzkoušet Pro",
      highlight: true,
      badge: "Nejoblíbenější",
    },
    {
      name: "Business",
      price: "799 Kč",
      period: "měsíčně",
      description: "Pro agentury a týmy",
      features: [
        "Neomezené minuty",
        "Více účtů (až 10)",
        "Týmový přístup",
        "Custom branding",
        "API přístup",
        "Dedikovaný support",
      ],
      cta: "Kontaktovat sales",
      highlight: false,
    },
  ];

  // FAQ items
  const faqItems = [
    {
      question: "Jak přesná je AI při rozpoznávání české řeči?",
      answer: "Naše AI je speciálně trénovaná na češtinu a slovenštinu včetně dialektů a slangu. Dosahujeme 95%+ přesnosti i u rychlé řeči nebo videa s hudbou na pozadí. Titulky můžeš kdykoliv upravit přímo v editoru.",
    },
    {
      question: "Musím zadávat kreditní kartu?",
      answer: "Ne! Starter plán je úplně zdarma a nepotřebuje kartu. U placených plánů nabízíme 14 dní trial zdarma. Žádné automatické prodloužení, žádné skryté poplatky.",
    },
    {
      question: "Jaké sociální sítě podporujete?",
      answer: "Momentálně plně podporujeme Instagram (Reels, Stories, posty). TikTok a YouTube Shorts jsou v beta verzi. Facebook a LinkedIn připravujeme.",
    },
    {
      question: "Jak rychle dostanu hotové video?",
      answer: "30-60 vteřinové Reels zpracujeme za 20-40 sekund. Delší videa do 5 minut jsou hotová do 2 minut. Máme nejrychlejší zpracování na trhu!",
    },
    {
      question: "Mohu zrušit kdykoliv?",
      answer: "Ano, předplatné můžeš zrušit jedním klikem. Pokud nejsi spokojený během prvních 30 dní, vrátíme ti peníze. Bez otázek.",
    },
  ];

  // Social proof avatars
  const avatars = [
    { initials: "TK", color: "bg-violet-500" },
    { initials: "JN", color: "bg-fuchsia-500" },
    { initials: "MS", color: "bg-orange-500" },
    { initials: "PD", color: "bg-pink-500" },
    { initials: "+", color: "bg-slate-700" },
  ];

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setMobileMenuOpen(false);
  };

  return (
    <div className={`${isDark ? "bg-[#0a0a0f]" : "bg-white"} font-sans overflow-x-hidden`}>
      {/* Animated gradient background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div
          className={`absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full blur-[120px] ${isDark ? "opacity-30" : "opacity-20"}`}
          style={{ background: "linear-gradient(135deg, #8B5CF6 0%, #EC4899 50%, #F97316 100%)" }}
        />
        <div
          className={`absolute top-1/3 right-0 w-[500px] h-[500px] rounded-full blur-[100px] ${isDark ? "opacity-20" : "opacity-15"}`}
          style={{ background: "linear-gradient(225deg, #F97316 0%, #EC4899 100%)" }}
        />
        <div
          className={`absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full blur-[80px] ${isDark ? "opacity-20" : "opacity-10"}`}
          style={{ background: "linear-gradient(45deg, #8B5CF6 0%, #06B6D4 100%)" }}
        />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-4 py-4">
        <div className={`max-w-6xl mx-auto rounded-2xl px-6 py-3 backdrop-blur-xl border transition-all duration-300 ${isDark ? "bg-black/40 border-white/10" : "bg-white/70 border-slate-200/50 shadow-lg"}`}>
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradientPrimary} flex items-center justify-center`}>
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className={`font-bold text-xl ${isDark ? "text-white" : "text-slate-900"}`}>
                SocialMat
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              <div className="relative">
                <button
                  onClick={() => setFeaturesDropdownOpen(!featuresDropdownOpen)}
                  onBlur={() => setTimeout(() => setFeaturesDropdownOpen(false), 200)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-1.5 transition-all ${isDark ? "text-white/80 hover:text-white hover:bg-white/10" : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"}`}
                >
                  Funkce
                  <ChevronDown className={`w-4 h-4 transition-transform ${featuresDropdownOpen ? "rotate-180" : ""}`} />
                </button>

                <AnimatePresence>
                  {featuresDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className={`absolute top-full left-0 mt-2 w-72 rounded-2xl border overflow-hidden ${isDark ? "bg-black/90 backdrop-blur-xl border-white/10" : "bg-white border-slate-200 shadow-xl"}`}
                    >
                      <div className="p-2">
                        {features.slice(0, 6).map((feature) => {
                          const Icon = feature.icon;
                          return (
                            <Link
                              key={feature.href}
                              href={feature.href}
                              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${isDark ? "hover:bg-white/10" : "hover:bg-slate-50"}`}
                            >
                              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center`}>
                                <Icon className="w-5 h-5 text-white" />
                              </div>
                              <div>
                                <div className={`font-semibold text-sm ${isDark ? "text-white" : "text-slate-900"}`}>{feature.title}</div>
                                <div className={`text-xs ${isDark ? "text-white/50" : "text-slate-500"}`}>{feature.description.split(".")[0]}</div>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <button onClick={() => scrollToSection("pricing")} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${isDark ? "text-white/80 hover:text-white hover:bg-white/10" : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"}`}>
                Ceník
              </button>
              <button onClick={() => scrollToSection("faq")} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${isDark ? "text-white/80 hover:text-white hover:bg-white/10" : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"}`}>
                FAQ
              </button>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setTheme(isDark ? "light" : "dark")}
                className={`p-2.5 rounded-xl transition-all ${isDark ? "bg-white/10 hover:bg-white/15 text-white" : "bg-slate-100 hover:bg-slate-200 text-slate-600"}`}
              >
                {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>

              <Link href="/login" className={`hidden sm:block px-4 py-2 rounded-xl text-sm font-medium transition-all ${isDark ? "text-white/80 hover:text-white" : "text-slate-600 hover:text-slate-900"}`}>
                Přihlášení
              </Link>

              <Link href="/signup" className={`px-5 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r ${gradientPrimary} text-white hover:shadow-lg hover:shadow-violet-500/25 transition-all hover:-translate-y-0.5`}>
                Začít zdarma
              </Link>

              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`md:hidden p-2.5 rounded-xl transition-all ${isDark ? "bg-white/10 text-white" : "bg-slate-100 text-slate-600"}`}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`md:hidden mt-2 rounded-2xl p-4 backdrop-blur-xl border ${isDark ? "bg-black/90 border-white/10" : "bg-white border-slate-200"}`}
            >
              <div className="space-y-2">
                {features.slice(0, 4).map((feature) => (
                  <Link
                    key={feature.href}
                    href={feature.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block px-4 py-3 rounded-xl transition-all ${isDark ? "hover:bg-white/10 text-white/80" : "hover:bg-slate-50 text-slate-600"}`}
                  >
                    {feature.title}
                  </Link>
                ))}
                <button onClick={() => scrollToSection("pricing")} className={`block w-full text-left px-4 py-3 rounded-xl transition-all ${isDark ? "hover:bg-white/10 text-white/80" : "hover:bg-slate-50 text-slate-600"}`}>
                  Ceník
                </button>
                <button onClick={() => scrollToSection("faq")} className={`block w-full text-left px-4 py-3 rounded-xl transition-all ${isDark ? "hover:bg-white/10 text-white/80" : "hover:bg-slate-50 text-slate-600"}`}>
                  FAQ
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-screen flex items-center pt-32 pb-20 px-4 overflow-hidden">
        <div className="max-w-6xl mx-auto relative z-10">
          {/* Announcement badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center mb-8"
          >
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border backdrop-blur-sm ${isDark ? "bg-white/5 border-white/10" : "bg-violet-50 border-violet-200"}`}>
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500"></span>
              </span>
              <span className={`text-sm font-medium ${isDark ? "text-white/80" : "text-violet-700"}`}>
                🚀 Nová verze 2025 je tady!
              </span>
              <ChevronRight className={`w-4 h-4 ${isDark ? "text-white/50" : "text-violet-500"}`} />
            </div>
          </motion.div>

          {/* Main headline */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-center mb-8"
          >
            <h1 className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight mb-6 ${isDark ? "text-white" : "text-slate-900"}`}>
              Tvůj Instagram na
              <span className={`block ${gradientText}`}>autopilotu ✨</span>
            </h1>
            <p className={`text-lg sm:text-xl max-w-2xl mx-auto ${isDark ? "text-white/70" : "text-slate-600"}`}>
              AI titulky, automatické odpovědi, analytics a video editor.
              Všechno v jednom nástroji pro české tvůrce.
            </p>
          </motion.div>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
          >
            <Link
              href="/signup"
              className={`group w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl text-lg font-semibold bg-gradient-to-r ${gradientPrimary} text-white hover:shadow-xl hover:shadow-violet-500/30 transition-all hover:-translate-y-1`}
            >
              Vyzkoušet zdarma
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <button
              onClick={() => scrollToSection("features")}
              className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl text-lg font-semibold border transition-all hover:-translate-y-1 ${isDark ? "border-white/20 text-white hover:bg-white/10" : "border-slate-200 text-slate-700 hover:bg-slate-50"}`}
            >
              <Play className="w-5 h-5" />
              Jak to funguje
            </button>
          </motion.div>

          {/* Social proof */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <div className="flex items-center">
              <div className="flex -space-x-3">
                {avatars.map((avatar, i) => (
                  <div
                    key={i}
                    className={`w-10 h-10 rounded-full ${avatar.color} border-2 ${isDark ? "border-[#0a0a0f]" : "border-white"} flex items-center justify-center text-white text-sm font-bold`}
                  >
                    {avatar.initials}
                  </div>
                ))}
              </div>
              <div className="ml-4">
                <div className={`font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>500+ českých tvůrců</div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                  <span className={`text-sm ml-1 ${isDark ? "text-white/60" : "text-slate-500"}`}>4.9/5</span>
                </div>
              </div>
            </div>

            <div className={`hidden sm:block h-8 w-px ${isDark ? "bg-white/20" : "bg-slate-200"}`} />

            <div className={`flex items-center gap-4 text-sm ${isDark ? "text-white/60" : "text-slate-500"}`}>
              <span className="flex items-center gap-1.5">
                <Shield className="w-4 h-4" />
                14 dní zdarma
              </span>
              <span className="flex items-center gap-1.5">
                <CreditCard className="w-4 h-4" />
                Bez kreditky
              </span>
            </div>
          </motion.div>

          {/* Dashboard mockup */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-16 relative"
          >
            <div className={`absolute inset-0 bg-gradient-to-t ${isDark ? "from-[#0a0a0f] via-transparent to-transparent" : "from-white via-transparent to-transparent"} z-10 pointer-events-none`} />

            <div className={`relative rounded-3xl border overflow-hidden ${isDark ? "bg-white/5 border-white/10" : "bg-white border-slate-200 shadow-2xl"}`}>
              {/* Browser chrome */}
              <div className={`flex items-center gap-2 px-4 py-3 border-b ${isDark ? "border-white/10 bg-white/5" : "border-slate-100 bg-slate-50"}`}>
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <div className={`flex-1 text-center text-xs ${isDark ? "text-white/40" : "text-slate-400"}`}>
                  app.socialmat.cz/dashboard
                </div>
              </div>

              {/* Dashboard content placeholder */}
              <div className="aspect-[16/9] relative bg-gradient-to-br from-violet-900/20 via-fuchsia-900/20 to-orange-900/20 flex items-center justify-center">
                <div className="text-center p-8">
                  <div className={`${isDark ? "text-white/30" : "text-slate-400"} text-sm uppercase tracking-widest mb-4`}>
                    Dashboard Preview
                  </div>
                  <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
                    <div className={`h-24 rounded-xl ${isDark ? "bg-white/5" : "bg-slate-100"}`} />
                    <div className={`h-24 rounded-xl ${isDark ? "bg-white/5" : "bg-slate-100"}`} />
                    <div className={`h-24 rounded-xl ${isDark ? "bg-white/5" : "bg-slate-100"}`} />
                    <div className={`h-32 rounded-xl col-span-2 ${isDark ? "bg-white/5" : "bg-slate-100"}`} />
                    <div className={`h-32 rounded-xl ${isDark ? "bg-white/5" : "bg-slate-100"}`} />
                  </div>
                </div>
              </div>
            </div>

            {/* Floating feature badges */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className={`absolute -left-4 top-1/4 hidden lg:flex items-center gap-3 px-4 py-3 rounded-2xl border backdrop-blur-xl ${isDark ? "bg-black/60 border-white/10" : "bg-white/90 border-slate-200 shadow-lg"}`}
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                <Video className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className={`font-semibold text-sm ${isDark ? "text-white" : "text-slate-900"}`}>AI Titulky</div>
                <div className={`text-xs ${isDark ? "text-white/60" : "text-slate-500"}`}>Hotovo za 30s</div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 1 }}
              className={`absolute -right-4 top-1/3 hidden lg:flex items-center gap-3 px-4 py-3 rounded-2xl border backdrop-blur-xl ${isDark ? "bg-black/60 border-white/10" : "bg-white/90 border-slate-200 shadow-lg"}`}
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-fuchsia-500 to-pink-600 flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className={`font-semibold text-sm ${isDark ? "text-white" : "text-slate-900"}`}>Auto-reply</div>
                <div className={`text-xs ${isDark ? "text-white/60" : "text-slate-500"}`}>24/7 aktivní</div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.2 }}
              className={`absolute right-8 -bottom-4 hidden lg:flex items-center gap-3 px-4 py-3 rounded-2xl border backdrop-blur-xl ${isDark ? "bg-black/60 border-white/10" : "bg-white/90 border-slate-200 shadow-lg"}`}
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className={`font-semibold text-sm ${isDark ? "text-white" : "text-slate-900"}`}>+47% engagement</div>
                <div className={`text-xs ${isDark ? "text-white/60" : "text-slate-500"}`}>Za 30 dní</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Logos / Trust strip */}
      <section className={`py-12 px-4 border-y ${isDark ? "border-white/5 bg-black/20" : "border-slate-100 bg-slate-50"}`}>
        <div className="max-w-6xl mx-auto">
          <p className={`text-center text-sm mb-8 ${isDark ? "text-white/40" : "text-slate-500"}`}>
            Používají tvůrci z těchto oblastí
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
            {["Fitness", "Lifestyle", "E-commerce", "Travel", "Food", "Beauty"].map((category) => (
              <div
                key={category}
                className={`text-lg font-semibold ${isDark ? "text-white/30" : "text-slate-300"}`}
              >
                {category}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-6 ${isDark ? "bg-white/5 border-white/10" : "bg-violet-50 border-violet-200"}`}>
              <Layers className={`w-4 h-4 ${isDark ? "text-violet-400" : "text-violet-600"}`} />
              <span className={`text-sm font-medium ${isDark ? "text-white/80" : "text-violet-700"}`}>
                Kompletní toolkit pro tvůrce
              </span>
            </div>
            <h2 className={`text-3xl sm:text-4xl md:text-5xl font-bold mb-6 ${isDark ? "text-white" : "text-slate-900"}`}>
              Všechno co potřebuješ,
              <span className={`block ${gradientText}`}>na jednom místě 🎯</span>
            </h2>
            <p className={`text-lg max-w-2xl mx-auto ${isDark ? "text-white/60" : "text-slate-600"}`}>
              Přestaň platit za 5 různých nástrojů. SocialMat má AI titulky, chatbot,
              analytics i video editor v jednom balíčku.
            </p>
          </motion.div>

          {/* Bento grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Link
                    href={feature.href}
                    className={`group relative block h-full p-6 rounded-3xl border overflow-hidden transition-all hover:-translate-y-2 hover:shadow-xl ${isDark ? "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20" : "bg-white border-slate-200 hover:border-slate-300 shadow-lg"}`}
                  >
                    {/* Gradient overlay on hover */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity`} />

                    {/* Badge */}
                    {feature.badge && (
                      <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${feature.color} text-white`}>
                        {feature.badge}
                      </div>
                    )}

                    <div className="relative">
                      {/* Icon */}
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                        <Icon className="w-7 h-7 text-white" />
                      </div>

                      {/* Content */}
                      <h3 className={`text-xl font-bold mb-3 ${isDark ? "text-white" : "text-slate-900"}`}>
                        {feature.title}
                      </h3>
                      <p className={`text-sm leading-relaxed ${isDark ? "text-white/60" : "text-slate-600"}`}>
                        {feature.description}
                      </p>

                      {/* Arrow */}
                      <div className={`mt-5 flex items-center gap-2 text-sm font-medium ${isDark ? "text-white/80" : "text-slate-900"}`}>
                        Zjistit více
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Auto-reply showcase */}
      <section className={`py-24 px-4 ${isDark ? "bg-black/30" : "bg-slate-50"}`}>
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-6 ${isDark ? "bg-white/5 border-white/10" : "bg-fuchsia-50 border-fuchsia-200"}`}>
                <Bot className={`w-4 h-4 ${isDark ? "text-fuchsia-400" : "text-fuchsia-600"}`} />
                <span className={`text-sm font-medium ${isDark ? "text-white/80" : "text-fuchsia-700"}`}>
                  Automatizace komentářů & DM
                </span>
              </div>

              <h2 className={`text-3xl sm:text-4xl font-bold mb-6 ${isDark ? "text-white" : "text-slate-900"}`}>
                Odpovídej na komentáře
                <span className={`block ${gradientText}`}>i když spíš 😴</span>
              </h2>

              <p className={`text-lg mb-8 ${isDark ? "text-white/60" : "text-slate-600"}`}>
                AI chatbot odpovídá v tvém tónu 24/7. Zachytává leady, posílá DM
                a předá konverzaci tobě když je potřeba osobní přístup.
              </p>

              <div className="space-y-4">
                {[
                  "Automatické odpovědi pod Reels a posty",
                  "DM follow-up s PDF, slevou nebo linkem",
                  "Predikce intence uživatele pomocí AI",
                  "Přepnutí na člověka jedním klikem",
                ].map((benefit, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${gradientSecondary} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                      <Check className="w-3.5 h-3.5 text-white" />
                    </div>
                    <span className={`${isDark ? "text-white/80" : "text-slate-700"}`}>{benefit}</span>
                  </div>
                ))}
              </div>

              <Link
                href="/features/auto-reply"
                className={`inline-flex items-center gap-2 mt-8 px-6 py-3 rounded-xl font-semibold bg-gradient-to-r ${gradientSecondary} text-white hover:shadow-lg hover:shadow-fuchsia-500/25 transition-all`}
              >
                Zjistit více
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>

            {/* Right - Chat mockup */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className={`rounded-3xl border overflow-hidden ${isDark ? "bg-white/5 border-white/10" : "bg-white border-slate-200 shadow-xl"}`}>
                {/* Chat header */}
                <div className={`flex items-center gap-3 px-5 py-4 border-b ${isDark ? "border-white/10" : "border-slate-100"}`}>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center">
                    <Instagram className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className={`font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>Instagram DM</div>
                    <div className={`text-xs ${isDark ? "text-white/50" : "text-slate-500"}`}>Auto-reply aktivní</div>
                  </div>
                  <div className="ml-auto">
                    <span className="flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-2.5 w-2.5 rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                    </span>
                  </div>
                </div>

                {/* Chat messages */}
                <div className="p-5 space-y-4 min-h-[400px]">
                  {/* User message */}
                  <div className="flex justify-end">
                    <div className={`max-w-[80%] px-4 py-3 rounded-2xl rounded-br-md ${isDark ? "bg-white/10" : "bg-slate-100"}`}>
                      <p className={`text-sm ${isDark ? "text-white/90" : "text-slate-700"}`}>
                        Ahoj! Kolik stojí ten tvůj kurz? 🙏
                      </p>
                      <span className={`text-xs ${isDark ? "text-white/40" : "text-slate-400"}`}>14:32</span>
                    </div>
                  </div>

                  {/* Bot response */}
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                    <div className={`max-w-[80%] px-4 py-3 rounded-2xl rounded-bl-md bg-gradient-to-br ${isDark ? "from-violet-500/20 to-fuchsia-500/20 border border-violet-500/30" : "from-violet-50 to-fuchsia-50 border border-violet-200"}`}>
                      <p className={`text-sm ${isDark ? "text-white/90" : "text-slate-700"}`}>
                        Ahoj! 👋 Super že se ptáš!
                      </p>
                      <p className={`text-sm mt-2 ${isDark ? "text-white/90" : "text-slate-700"}`}>
                        Kurz stojí 2490 Kč a právě teď máme slevu -20% pro nové studenty. 🎉
                      </p>
                      <p className={`text-sm mt-2 ${isDark ? "text-white/90" : "text-slate-700"}`}>
                        Posílám ti odkaz na přihlášku + PDF s obsahem kurzu zdarma! 📚
                      </p>
                      <span className={`text-xs ${isDark ? "text-white/40" : "text-slate-400"}`}>14:32 · AI</span>
                    </div>
                  </div>

                  {/* User message 2 */}
                  <div className="flex justify-end">
                    <div className={`max-w-[80%] px-4 py-3 rounded-2xl rounded-br-md ${isDark ? "bg-white/10" : "bg-slate-100"}`}>
                      <p className={`text-sm ${isDark ? "text-white/90" : "text-slate-700"}`}>
                        Super! Díky moc, hned se podívám 💜
                      </p>
                      <span className={`text-xs ${isDark ? "text-white/40" : "text-slate-400"}`}>14:33</span>
                    </div>
                  </div>

                  {/* Stats overlay */}
                  <div className={`absolute bottom-4 left-4 right-4 flex items-center justify-between px-4 py-3 rounded-xl backdrop-blur-sm ${isDark ? "bg-black/60 border border-white/10" : "bg-white/90 border border-slate-200"}`}>
                    <div className="flex items-center gap-2">
                      <Zap className={`w-4 h-4 ${isDark ? "text-yellow-400" : "text-yellow-500"}`} />
                      <span className={`text-xs font-medium ${isDark ? "text-white/80" : "text-slate-600"}`}>Odpověď za 3s</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className={`w-4 h-4 ${isDark ? "text-green-400" : "text-green-500"}`} />
                      <span className={`text-xs font-medium ${isDark ? "text-white/80" : "text-slate-600"}`}>+37% leadů</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-6 ${isDark ? "bg-white/5 border-white/10" : "bg-orange-50 border-orange-200"}`}>
              <Wand2 className={`w-4 h-4 ${isDark ? "text-orange-400" : "text-orange-600"}`} />
              <span className={`text-sm font-medium ${isDark ? "text-white/80" : "text-orange-700"}`}>
                Tak jednoduché, že to zvládneš za 2 minuty
              </span>
            </div>
            <h2 className={`text-3xl sm:text-4xl md:text-5xl font-bold mb-6 ${isDark ? "text-white" : "text-slate-900"}`}>
              3 kroky k lepšímu
              <span className={`block ${gradientText}`}>Instagramu 🚀</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="relative"
              >
                {/* Connector line */}
                {index < steps.length - 1 && (
                  <div className={`hidden md:block absolute top-12 left-[60%] w-full h-px ${isDark ? "bg-white/10" : "bg-slate-200"}`} />
                )}

                <div className={`relative p-8 rounded-3xl border text-center ${isDark ? "bg-white/5 border-white/10" : "bg-white border-slate-200 shadow-lg"}`}>
                  {/* Step number */}
                  <div className={`absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-gradient-to-br ${gradientPrimary} flex items-center justify-center text-white text-sm font-bold`}>
                    {index + 1}
                  </div>

                  {/* Emoji */}
                  <div className="text-5xl mb-6">{step.emoji}</div>

                  {/* Content */}
                  <h3 className={`text-xl font-bold mb-3 ${isDark ? "text-white" : "text-slate-900"}`}>
                    {step.title}
                  </h3>
                  <p className={`text-sm ${isDark ? "text-white/60" : "text-slate-600"}`}>
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className={`py-24 px-4 ${isDark ? "bg-black/30" : "bg-slate-50"}`}>
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-6 ${isDark ? "bg-white/5 border-white/10" : "bg-pink-50 border-pink-200"}`}>
              <Heart className={`w-4 h-4 ${isDark ? "text-pink-400" : "text-pink-600"}`} />
              <span className={`text-sm font-medium ${isDark ? "text-white/80" : "text-pink-700"}`}>
                Milované českými tvůrci
              </span>
            </div>
            <h2 className={`text-3xl sm:text-4xl md:text-5xl font-bold mb-6 ${isDark ? "text-white" : "text-slate-900"}`}>
              Co říkají naši
              <span className={`block ${gradientText}`}>uživatelé 💬</span>
            </h2>
          </motion.div>

          {/* Testimonial carousel */}
          <div className="relative">
            <div className="overflow-hidden">
              <motion.div
                className="flex"
                animate={{ x: `-${currentTestimonial * 100}%` }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              >
                {testimonials.map((testimonial, index) => (
                  <div key={index} className="w-full flex-shrink-0 px-4">
                    <div className={`max-w-2xl mx-auto p-8 rounded-3xl border ${isDark ? "bg-white/5 border-white/10" : "bg-white border-slate-200 shadow-xl"}`}>
                      <div className="flex items-center gap-4 mb-6">
                        <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${gradientPrimary} flex items-center justify-center text-white text-xl font-bold`}>
                          {testimonial.name.split(" ").map(n => n[0]).join("")}
                        </div>
                        <div>
                          <div className={`font-bold text-lg ${isDark ? "text-white" : "text-slate-900"}`}>
                            {testimonial.name}
                          </div>
                          <div className={`text-sm ${isDark ? "text-white/60" : "text-slate-500"}`}>
                            {testimonial.role}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <Instagram className={`w-4 h-4 ${isDark ? "text-white/40" : "text-slate-400"}`} />
                            <span className={`text-sm ${isDark ? "text-white/40" : "text-slate-400"}`}>
                              {testimonial.handle} · {testimonial.followers} followers
                            </span>
                          </div>
                        </div>
                      </div>

                      <p className={`text-lg leading-relaxed mb-6 ${isDark ? "text-white/80" : "text-slate-700"}`}>
                        "{testimonial.text}"
                      </p>

                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Dots */}
            <div className="flex justify-center gap-2 mt-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${currentTestimonial === index ? `bg-gradient-to-r ${gradientPrimary} w-8` : isDark ? "bg-white/20" : "bg-slate-300"}`}
                />
              ))}
            </div>
          </div>

          {/* Scrolling ticker */}
          <div className="mt-16 overflow-hidden">
            <motion.div
              className="flex gap-8"
              animate={{ x: [0, -1000] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              {[...testimonials, ...testimonials].map((t, i) => (
                <div key={i} className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap ${isDark ? "bg-white/5" : "bg-white"}`}>
                  <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${gradientPrimary} flex items-center justify-center text-white text-xs font-bold`}>
                    {t.name[0]}
                  </div>
                  <span className={`text-sm ${isDark ? "text-white/60" : "text-slate-600"}`}>{t.name}</span>
                  <span className={`text-sm font-medium ${isDark ? "text-white/80" : "text-slate-900"}`}>{t.handle}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-6 ${isDark ? "bg-white/5 border-white/10" : "bg-green-50 border-green-200"}`}>
              <CreditCard className={`w-4 h-4 ${isDark ? "text-green-400" : "text-green-600"}`} />
              <span className={`text-sm font-medium ${isDark ? "text-white/80" : "text-green-700"}`}>
                Jednoduchý a férový ceník
              </span>
            </div>
            <h2 className={`text-3xl sm:text-4xl md:text-5xl font-bold mb-6 ${isDark ? "text-white" : "text-slate-900"}`}>
              Vyber si plán
              <span className={`block ${gradientText}`}>podle sebe 💰</span>
            </h2>
            <p className={`text-lg max-w-2xl mx-auto ${isDark ? "text-white/60" : "text-slate-600"}`}>
              Všechny plány zahrnují AI titulky, video editor a základní analytics.
              Upgrade kdykoliv, cancel kdykoliv.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`relative p-8 rounded-3xl border ${plan.highlight ? `bg-gradient-to-br ${isDark ? "from-violet-500/20 via-fuchsia-500/10 to-transparent" : "from-violet-50 via-fuchsia-50 to-white"} border-violet-500/30 ring-2 ring-violet-500/20` : isDark ? "bg-white/5 border-white/10" : "bg-white border-slate-200 shadow-lg"}`}
              >
                {/* Badge */}
                {plan.badge && (
                  <div className={`absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full text-sm font-semibold bg-gradient-to-r ${gradientPrimary} text-white`}>
                    {plan.badge}
                  </div>
                )}

                <div className="text-center mb-8">
                  <h3 className={`text-2xl font-bold mb-2 ${isDark ? "text-white" : "text-slate-900"}`}>
                    {plan.name}
                  </h3>
                  <p className={`text-sm mb-4 ${isDark ? "text-white/60" : "text-slate-600"}`}>
                    {plan.description}
                  </p>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className={`text-4xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
                      {plan.price}
                    </span>
                    {plan.period && (
                      <span className={`text-sm ${isDark ? "text-white/60" : "text-slate-500"}`}>
                        /{plan.period}
                      </span>
                    )}
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${plan.highlight ? `bg-gradient-to-br ${gradientPrimary}` : isDark ? "bg-white/20" : "bg-slate-200"}`}>
                        <Check className="w-3 h-3 text-white" />
                      </div>
                      <span className={`text-sm ${isDark ? "text-white/80" : "text-slate-700"}`}>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/signup"
                  className={`block w-full py-4 rounded-2xl text-center font-semibold transition-all hover:-translate-y-1 ${plan.highlight ? `bg-gradient-to-r ${gradientPrimary} text-white hover:shadow-lg hover:shadow-violet-500/30` : isDark ? "bg-white/10 text-white hover:bg-white/20 border border-white/20" : "bg-slate-900 text-white hover:bg-slate-800"}`}
                >
                  {plan.cta}
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className={`mt-12 flex flex-wrap items-center justify-center gap-6 p-6 rounded-2xl border ${isDark ? "bg-white/5 border-white/10" : "bg-slate-50 border-slate-200"}`}
          >
            <div className="flex items-center gap-2">
              <Shield className={`w-5 h-5 ${isDark ? "text-green-400" : "text-green-600"}`} />
              <span className={`text-sm ${isDark ? "text-white/80" : "text-slate-700"}`}>14 dní zdarma</span>
            </div>
            <div className={`h-4 w-px ${isDark ? "bg-white/20" : "bg-slate-300"}`} />
            <div className="flex items-center gap-2">
              <CreditCard className={`w-5 h-5 ${isDark ? "text-blue-400" : "text-blue-600"}`} />
              <span className={`text-sm ${isDark ? "text-white/80" : "text-slate-700"}`}>Bez kreditky</span>
            </div>
            <div className={`h-4 w-px ${isDark ? "bg-white/20" : "bg-slate-300"}`} />
            <div className="flex items-center gap-2">
              <Clock className={`w-5 h-5 ${isDark ? "text-orange-400" : "text-orange-600"}`} />
              <span className={`text-sm ${isDark ? "text-white/80" : "text-slate-700"}`}>Zrušit kdykoliv</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className={`py-24 px-4 ${isDark ? "bg-black/30" : "bg-slate-50"}`}>
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-6 ${isDark ? "bg-white/5 border-white/10" : "bg-cyan-50 border-cyan-200"}`}>
              <MessageCircle className={`w-4 h-4 ${isDark ? "text-cyan-400" : "text-cyan-600"}`} />
              <span className={`text-sm font-medium ${isDark ? "text-white/80" : "text-cyan-700"}`}>
                Nejčastější dotazy
              </span>
            </div>
            <h2 className={`text-3xl sm:text-4xl md:text-5xl font-bold mb-6 ${isDark ? "text-white" : "text-slate-900"}`}>
              Máš otázky?
              <span className={`block ${gradientText}`}>Máme odpovědi 🙋</span>
            </h2>
          </motion.div>

          <div className="space-y-4">
            {faqItems.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                  className={`w-full p-6 rounded-2xl border text-left transition-all ${activeFaq === index ? isDark ? "bg-white/10 border-white/20" : "bg-white border-slate-300 shadow-lg" : isDark ? "bg-white/5 border-white/10 hover:bg-white/10" : "bg-white border-slate-200 hover:border-slate-300"}`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <h3 className={`font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>
                      {item.question}
                    </h3>
                    <ChevronDown className={`w-5 h-5 transition-transform flex-shrink-0 ${activeFaq === index ? "rotate-180" : ""} ${isDark ? "text-white/60" : "text-slate-500"}`} />
                  </div>

                  <AnimatePresence>
                    {activeFaq === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <p className={`mt-4 ${isDark ? "text-white/70" : "text-slate-600"}`}>
                          {item.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className={`mt-12 p-6 rounded-2xl border text-center ${isDark ? "bg-white/5 border-white/10" : "bg-white border-slate-200"}`}
          >
            <p className={`mb-4 ${isDark ? "text-white/70" : "text-slate-600"}`}>
              Nenašel jsi odpověď? Napiš nám!
            </p>
            <a
              href="mailto:hello@socialmat.app"
              className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${isDark ? "bg-white/10 text-white hover:bg-white/20" : "bg-slate-100 text-slate-900 hover:bg-slate-200"}`}
            >
              <Send className="w-4 h-4" />
              hello@socialmat.app
            </a>
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <div className={`relative p-12 rounded-[40px] overflow-hidden ${isDark ? "bg-gradient-to-br from-violet-600/30 via-fuchsia-600/20 to-orange-600/30" : "bg-gradient-to-br from-violet-600 via-fuchsia-600 to-orange-500"}`}>
            {/* Background decoration */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div className="absolute -top-20 -right-20 w-60 h-60 bg-white/10 rounded-full blur-3xl" />
              <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-white/10 rounded-full blur-3xl" />
            </div>

            <div className="relative text-center">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6">
                Připraven posunout svůj
                <span className="block">Instagram na další level? ✨</span>
              </h2>
              <p className="text-lg text-white/80 mb-8 max-w-xl mx-auto">
                Vyzkoušej SocialMat zdarma a přidej se k 500+ českým tvůrcům,
                kteří šetří čas a rostou rychleji.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
                <Link
                  href="/signup"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl text-lg font-semibold bg-white text-slate-900 hover:bg-slate-100 transition-all hover:-translate-y-1 hover:shadow-xl"
                >
                  Začít zdarma ještě dnes
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-white/70">
                <span className="flex items-center gap-1.5">
                  <Check className="w-4 h-4" />
                  14 dní zdarma
                </span>
                <span className="flex items-center gap-1.5">
                  <Check className="w-4 h-4" />
                  Bez kreditky
                </span>
                <span className="flex items-center gap-1.5">
                  <Check className="w-4 h-4" />
                  Zrušit kdykoliv
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className={`py-16 px-4 border-t ${isDark ? "border-white/10 bg-black/50" : "border-slate-200 bg-slate-50"}`}>
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            {/* Logo & description */}
            <div className="col-span-2 md:col-span-1">
              <Link href="/" className="flex items-center gap-2.5 mb-4">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradientPrimary} flex items-center justify-center`}>
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className={`font-bold text-xl ${isDark ? "text-white" : "text-slate-900"}`}>
                  SocialMat
                </span>
              </Link>
              <p className={`text-sm ${isDark ? "text-white/60" : "text-slate-600"}`}>
                AI nástroje pro české content creatry. Titulky, chatbot, analytics v jednom.
              </p>
            </div>

            {/* Product links */}
            <div>
              <h4 className={`font-semibold mb-4 ${isDark ? "text-white" : "text-slate-900"}`}>Produkt</h4>
              <ul className={`space-y-2 text-sm ${isDark ? "text-white/60" : "text-slate-600"}`}>
                <li><Link href="/features/titulky" className="hover:underline">AI Titulky</Link></li>
                <li><Link href="/features/auto-reply" className="hover:underline">Auto-reply</Link></li>
                <li><Link href="/features/analytics" className="hover:underline">Analytics</Link></li>
                <li><Link href="/features/video-editor" className="hover:underline">Video Editor</Link></li>
              </ul>
            </div>

            {/* Company links */}
            <div>
              <h4 className={`font-semibold mb-4 ${isDark ? "text-white" : "text-slate-900"}`}>Společnost</h4>
              <ul className={`space-y-2 text-sm ${isDark ? "text-white/60" : "text-slate-600"}`}>
                <li><button onClick={() => scrollToSection("pricing")} className="hover:underline">Ceník</button></li>
                <li><button onClick={() => scrollToSection("faq")} className="hover:underline">FAQ</button></li>
                <li><a href="mailto:hello@socialmat.app" className="hover:underline">Kontakt</a></li>
              </ul>
            </div>

            {/* Legal links */}
            <div>
              <h4 className={`font-semibold mb-4 ${isDark ? "text-white" : "text-slate-900"}`}>Právní</h4>
              <ul className={`space-y-2 text-sm ${isDark ? "text-white/60" : "text-slate-600"}`}>
                <li><Link href="/privacy" className="hover:underline">Ochrana soukromí</Link></li>
                <li><Link href="/data-deletion" className="hover:underline">Smazání dat</Link></li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className={`pt-8 border-t flex flex-col md:flex-row items-center justify-between gap-4 ${isDark ? "border-white/10" : "border-slate-200"}`}>
            <p className={`text-sm ${isDark ? "text-white/50" : "text-slate-500"}`}>
              © {currentYear} SocialMat. Vytvořeno s 💜 v Česku.
            </p>
            <div className="flex items-center gap-4">
              <a href="https://instagram.com/socialmat.app" target="_blank" rel="noopener noreferrer" className={`p-2 rounded-lg transition-colors ${isDark ? "hover:bg-white/10 text-white/60 hover:text-white" : "hover:bg-slate-100 text-slate-500 hover:text-slate-900"}`}>
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
