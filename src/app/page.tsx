"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Brain,
  Calendar,
  ChevronDown,
  ChevronRight,
  Edit3,
  Moon,
  Play,
  Sparkles,
  Sun,
  Video,
  Zap,
  Check,
  Star,
  Clock,
  TrendingUp,
  Shield,
  CreditCard,
  MessageCircle,
  Wand2,
  Bot,
  LineChart,
  Layers,
  Send,
  Heart,
  X,
  Menu,
  Eye,
  Users,
  ThumbsUp,
  Settings,
  Bell,
  Type,
  Palette,
  Download,
  PlayCircle,
  PauseCircle,
  Scissors,
  Volume2,
  ChevronLeft,
  MoreHorizontal,
  Image,
  Smile,
  Paperclip,
} from "lucide-react";

export default function LandingPage() {
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [featuresDropdownOpen, setFeaturesDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonialsCount = 3; // Static count to avoid hook dependency
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonialsCount);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const isDark = theme === "dark";
  const currentYear = new Date().getFullYear();

  // Instagram-inspired gradient colors
  const gradientPrimary = "from-[#833AB4] via-[#E1306C] to-[#F77737]";
  const gradientText = "bg-gradient-to-r from-[#833AB4] via-[#E1306C] to-[#F77737] bg-clip-text text-transparent";
  const accentPink = "#E1306C";

  // Features data
  const features = [
    {
      icon: Video,
      title: "AI Titulky",
      description: "Automatické titulky v češtině a slovenštině. 95%+ přesnost i u rychlé řeči.",
      color: "from-[#833AB4] to-[#C13584]",
      href: "/features/titulky",
      badge: "Populární",
    },
    {
      icon: Bot,
      title: "Auto-reply chatbot",
      description: "Automatické odpovědi na komentáře a DM ve tvém tónu.",
      color: "from-[#E1306C] to-[#F77737]",
      href: "/features/auto-reply",
      badge: "Nové",
    },
    {
      icon: LineChart,
      title: "Analytics dashboard",
      description: "Real-time metriky tvého účtu. AI ti řekne co funguje.",
      color: "from-[#F77737] to-[#FCB045]",
      href: "/features/analytics",
    },
    {
      icon: Edit3,
      title: "Video Editor",
      description: "Střih videí přímo v prohlížeči. Šablony pro Reels a Stories.",
      color: "from-[#833AB4] to-[#E1306C]",
      href: "/features/video-editor",
    },
    {
      icon: Calendar,
      title: "Plánování obsahu",
      description: "Naplánuj posty na týdny dopředu. AI navrhne nejlepší čas.",
      color: "from-[#C13584] to-[#833AB4]",
      href: "/features/kalendar",
    },
    {
      icon: Brain,
      title: "AI Brainstorming",
      description: "Generuje nápady, hooky a skripty podle tvého stylu.",
      color: "from-[#F77737] to-[#E1306C]",
      href: "/features/ai-content",
    },
  ];

  // How it works steps
  const steps = [
    {
      number: "01",
      emoji: "📱",
      title: "Připoj účet",
      description: "Propoj Instagram za 30 sekund",
    },
    {
      number: "02",
      emoji: "🎬",
      title: "Nahraj video",
      description: "Drag & drop, podporujeme vše",
    },
    {
      number: "03",
      emoji: "✨",
      title: "AI pracuje",
      description: "Titulky hotové za pár sekund",
    },
  ];

  // Testimonials
  const testimonials = [
    {
      name: "Tereza Králová",
      role: "Content Creator",
      handle: "@tereza.creates",
      text: "SocialMat mi ušetřil hodiny práce týdně. Titulky jsou přesné, automatické odpovědi fungují skvěle. 🙌",
      followers: "52K",
    },
    {
      name: "Jakub Novotný",
      role: "Fitness Influencer",
      handle: "@jakub.fit",
      text: "Nejlepší investice do mého contentu. Auto-reply mi přinesl 3x více leadů na můj program.",
      followers: "128K",
    },
    {
      name: "Marie Svobodová",
      role: "Marketing Agency",
      handle: "@marie.social",
      text: "Spravujeme 15 účtů a SocialMat nám šetří minimálně 20 hodin týdně. ROI je neuvěřitelný!",
      followers: "89K",
    },
  ];

  // Pricing plans
  const pricingPlans = [
    {
      name: "Starter",
      price: "Zdarma",
      period: "navždy",
      description: "Pro vyzkoušení",
      features: ["10 minut AI titulků", "Základní šablony", "Export MP4", "Email podpora"],
      cta: "Začít zdarma",
      highlight: false,
    },
    {
      name: "Pro",
      price: "299 Kč",
      period: "měsíčně",
      description: "Pro aktivní tvůrce",
      features: ["180 minut AI titulků", "Auto-reply chatbot", "Analytics dashboard", "Prémiové šablony", "Prioritní fronta", "Chat podpora"],
      cta: "Vyzkoušet Pro",
      highlight: true,
      badge: "Nejoblíbenější",
    },
    {
      name: "Business",
      price: "799 Kč",
      period: "měsíčně",
      description: "Pro agentury",
      features: ["Neomezené minuty", "Až 10 účtů", "Týmový přístup", "API přístup", "Dedikovaný support"],
      cta: "Kontaktovat",
      highlight: false,
    },
  ];

  // FAQ items
  const faqItems = [
    {
      question: "Jak přesná je AI při rozpoznávání české řeči?",
      answer: "Naše AI dosahuje 95%+ přesnosti i u rychlé řeči nebo videa s hudbou. Titulky můžeš kdykoliv upravit.",
    },
    {
      question: "Musím zadávat kreditní kartu?",
      answer: "Ne! Starter plán je zdarma bez karty. U placených plánů 14 dní trial zdarma.",
    },
    {
      question: "Jaké sociální sítě podporujete?",
      answer: "Plně Instagram (Reels, Stories, posty). TikTok a YouTube Shorts v beta verzi.",
    },
    {
      question: "Jak rychle dostanu hotové video?",
      answer: "30-60s Reels zpracujeme za 20-40 sekund. Máme nejrychlejší zpracování na trhu!",
    },
  ];

  // Social proof avatars
  const avatars = [
    { initials: "TK", color: "bg-[#833AB4]" },
    { initials: "JN", color: "bg-[#E1306C]" },
    { initials: "MS", color: "bg-[#F77737]" },
    { initials: "PD", color: "bg-[#C13584]" },
    { initials: "+", color: "bg-slate-700" },
  ];

  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
    setMobileMenuOpen(false);
  };

  // Browser Frame Component
  const BrowserFrame = ({ children, url = "app.socialmat.cz" }: { children: React.ReactNode; url?: string }) => (
    <div className={`rounded-2xl border overflow-hidden ${isDark ? "bg-[#1a1a1a]/80 border-white/10" : "bg-white border-slate-200"} backdrop-blur-xl shadow-2xl`}>
      <div className={`flex items-center gap-2 px-4 py-3 border-b ${isDark ? "border-white/10 bg-black/30" : "border-slate-100 bg-slate-50"}`}>
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
          <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
          <div className="w-3 h-3 rounded-full bg-[#28CA41]" />
        </div>
        <div className={`flex-1 flex items-center justify-center gap-2 text-xs ${isDark ? "text-white/40" : "text-slate-400"}`}>
          <div className={`px-3 py-1 rounded-md ${isDark ? "bg-white/5" : "bg-slate-100"}`}>
            {url}
          </div>
        </div>
      </div>
      {children}
    </div>
  );

  // Phone Frame Component
  const PhoneFrame = ({ children }: { children: React.ReactNode }) => (
    <div className={`relative rounded-[3rem] border-8 ${isDark ? "border-slate-800 bg-black" : "border-slate-200 bg-white"} shadow-2xl overflow-hidden`}>
      {/* Notch */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-black rounded-b-2xl z-10" />
      <div className="pt-8">
        {children}
      </div>
    </div>
  );

  return (
    <div className={`${isDark ? "bg-[#0A0A0A]" : "bg-white"} font-sans overflow-x-hidden`}>
      {/* Animated gradient background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div
          className={`absolute -top-40 -left-40 w-[800px] h-[800px] rounded-full blur-[150px] ${isDark ? "opacity-30" : "opacity-20"}`}
          style={{ background: "linear-gradient(135deg, #833AB4 0%, #E1306C 50%, #F77737 100%)" }}
        />
        <div
          className={`absolute top-1/2 -right-40 w-[600px] h-[600px] rounded-full blur-[120px] ${isDark ? "opacity-20" : "opacity-15"}`}
          style={{ background: "linear-gradient(225deg, #F77737 0%, #E1306C 100%)" }}
        />
        <div
          className={`absolute -bottom-40 left-1/3 w-[500px] h-[500px] rounded-full blur-[100px] ${isDark ? "opacity-20" : "opacity-10"}`}
          style={{ background: "linear-gradient(45deg, #833AB4 0%, #C13584 100%)" }}
        />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-4 py-4">
        <div className={`max-w-6xl mx-auto rounded-2xl px-6 py-3 backdrop-blur-xl border ${isDark ? "bg-[#1a1a1a]/80 border-white/10" : "bg-white/80 border-slate-200"}`}>
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradientPrimary} flex items-center justify-center shadow-lg shadow-[#E1306C]/20`}>
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className={`font-bold text-xl ${isDark ? "text-white" : "text-slate-900"}`}>SocialMat</span>
            </Link>

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
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className={`absolute top-full left-0 mt-2 w-72 rounded-2xl border overflow-hidden backdrop-blur-xl ${isDark ? "bg-[#1a1a1a]/95 border-white/10" : "bg-white border-slate-200"}`}
                    >
                      <div className="p-2">
                        {features.map((feature) => {
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

            <div className="flex items-center gap-3">
              <button
                onClick={() => setTheme(isDark ? "light" : "dark")}
                className={`p-2.5 rounded-xl transition-all ${isDark ? "bg-white/10 hover:bg-white/15 text-white" : "bg-slate-100 hover:bg-slate-200 text-slate-600"}`}
              >
                {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
              <Link href="/login" className={`hidden sm:block px-4 py-2 rounded-xl text-sm font-medium ${isDark ? "text-white/80 hover:text-white" : "text-slate-600"}`}>
                Přihlášení
              </Link>
              <Link
                href="/signup"
                className={`px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:-translate-y-0.5`}
                style={{ background: `linear-gradient(135deg, #833AB4, #E1306C, #F77737)`, boxShadow: `0 8px 32px -8px ${accentPink}` }}
              >
                Začít zdarma
              </Link>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`md:hidden p-2.5 rounded-xl ${isDark ? "bg-white/10 text-white" : "bg-slate-100 text-slate-600"}`}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`md:hidden mt-2 rounded-2xl p-4 backdrop-blur-xl border ${isDark ? "bg-[#1a1a1a]/95 border-white/10" : "bg-white border-slate-200"}`}
            >
              {features.slice(0, 4).map((f) => (
                <Link key={f.href} href={f.href} onClick={() => setMobileMenuOpen(false)} className={`block px-4 py-3 rounded-xl ${isDark ? "text-white/80" : "text-slate-600"}`}>{f.title}</Link>
              ))}
              <button onClick={() => scrollToSection("pricing")} className={`block w-full text-left px-4 py-3 ${isDark ? "text-white/80" : "text-slate-600"}`}>Ceník</button>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto relative z-10 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left - Text content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Badge */}
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-6 ${isDark ? "bg-white/5 border-white/10" : "bg-pink-50 border-pink-200"}`}>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E1306C] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#E1306C]"></span>
                </span>
                <span className={`text-sm font-medium ${isDark ? "text-white/80" : "text-[#E1306C]"}`}>🚀 Nová verze 2025 je tady!</span>
                <ChevronRight className="w-4 h-4 text-[#E1306C]" />
              </div>

              <h1 className={`text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight mb-6 ${isDark ? "text-white" : "text-slate-900"}`}>
                Tvůj Instagram na
                <span className={`block ${gradientText}`}>autopilotu ✨</span>
              </h1>

              <p className={`text-lg sm:text-xl mb-8 ${isDark ? "text-white/70" : "text-slate-600"}`}>
                AI titulky, automatické odpovědi, analytics a video editor.
                Všechno v jednom nástroji pro české tvůrce.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link
                  href="/signup"
                  className="group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl text-lg font-semibold text-white transition-all hover:-translate-y-1"
                  style={{ background: `linear-gradient(135deg, #833AB4, #E1306C, #F77737)`, boxShadow: `0 12px 40px -12px ${accentPink}` }}
                >
                  Vyzkoušet zdarma
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <button
                  onClick={() => scrollToSection("features")}
                  className={`inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl text-lg font-semibold border ${isDark ? "border-white/20 text-white hover:bg-white/10" : "border-slate-200 text-slate-700 hover:bg-slate-50"}`}
                >
                  <Play className="w-5 h-5" />
                  Jak to funguje
                </button>
              </div>

              {/* Social proof */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="flex items-center">
                  <div className="flex -space-x-3">
                    {avatars.map((a, i) => (
                      <div key={i} className={`w-10 h-10 rounded-full ${a.color} border-2 ${isDark ? "border-[#0A0A0A]" : "border-white"} flex items-center justify-center text-white text-sm font-bold`}>
                        {a.initials}
                      </div>
                    ))}
                  </div>
                  <div className="ml-4">
                    <div className={`font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>500+ českých tvůrců</div>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-[#FCB045] text-[#FCB045]" />
                      ))}
                      <span className={`text-sm ml-1 ${isDark ? "text-white/60" : "text-slate-500"}`}>4.9/5</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right - Dashboard Screenshot */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <BrowserFrame url="app.socialmat.cz/dashboard">
                {/* Dashboard Mockup - Replace with real screenshot */}
                {/* TODO: Replace this mockup with real dashboard screenshot at /public/screenshots/dashboard.png */}
                <div className={`aspect-[16/10] ${isDark ? "bg-[#111]" : "bg-slate-50"} p-4`}>
                  {/* Sidebar */}
                  <div className="flex gap-4 h-full">
                    <div className={`w-16 rounded-xl ${isDark ? "bg-white/5" : "bg-slate-100"} p-2 flex flex-col items-center gap-3`}>
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradientPrimary} flex items-center justify-center`}>
                        <Sparkles className="w-5 h-5 text-white" />
                      </div>
                      {[Video, Bot, LineChart, Calendar, Settings].map((Icon, i) => (
                        <div key={i} className={`w-10 h-10 rounded-xl flex items-center justify-center ${i === 0 ? "bg-[#E1306C]/20" : ""} ${isDark ? "text-white/40 hover:text-white/70" : "text-slate-400"}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                      ))}
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 space-y-4">
                      {/* Header */}
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className={`font-bold text-lg ${isDark ? "text-white" : "text-slate-900"}`}>Dashboard</h3>
                          <p className={`text-sm ${isDark ? "text-white/50" : "text-slate-500"}`}>Přehled tvého účtu</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className={`w-8 h-8 rounded-lg ${isDark ? "bg-white/5" : "bg-slate-100"} flex items-center justify-center`}>
                            <Bell className={`w-4 h-4 ${isDark ? "text-white/60" : "text-slate-500"}`} />
                          </div>
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#833AB4] to-[#E1306C]" />
                        </div>
                      </div>

                      {/* Stats Cards */}
                      <div className="grid grid-cols-4 gap-3">
                        {[
                          { label: "Reach", value: "124.5K", change: "+12%", icon: Eye },
                          { label: "Engagement", value: "8.2%", change: "+3.1%", icon: ThumbsUp },
                          { label: "Followers", value: "52.3K", change: "+847", icon: Users },
                          { label: "Posts", value: "23", change: "Tento měsíc", icon: Image },
                        ].map((stat, i) => (
                          <div key={i} className={`rounded-xl p-3 ${isDark ? "bg-white/5" : "bg-white border border-slate-100"}`}>
                            <div className="flex items-center gap-2 mb-2">
                              <stat.icon className={`w-4 h-4 ${isDark ? "text-white/50" : "text-slate-400"}`} />
                              <span className={`text-xs ${isDark ? "text-white/50" : "text-slate-500"}`}>{stat.label}</span>
                            </div>
                            <div className={`font-bold text-lg ${isDark ? "text-white" : "text-slate-900"}`}>{stat.value}</div>
                            <div className="text-xs text-green-500">{stat.change}</div>
                          </div>
                        ))}
                      </div>

                      {/* Chart Area */}
                      <div className={`rounded-xl p-4 ${isDark ? "bg-white/5" : "bg-white border border-slate-100"}`}>
                        <div className="flex items-center justify-between mb-4">
                          <span className={`font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>Engagement tento týden</span>
                          <div className={`text-xs px-2 py-1 rounded ${isDark ? "bg-white/10 text-white/70" : "bg-slate-100 text-slate-600"}`}>Posledních 7 dní</div>
                        </div>
                        {/* Chart Bars */}
                        <div className="flex items-end gap-2 h-24">
                          {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-1">
                              <div
                                className="w-full rounded-t-md"
                                style={{
                                  height: `${h}%`,
                                  background: i === 5 ? `linear-gradient(180deg, #833AB4, #E1306C)` : isDark ? "rgba(255,255,255,0.1)" : "#e2e8f0"
                                }}
                              />
                              <span className={`text-[10px] ${isDark ? "text-white/40" : "text-slate-400"}`}>{["Po", "Út", "St", "Čt", "Pá", "So", "Ne"][i]}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Recent Activity */}
                      <div className={`rounded-xl p-4 ${isDark ? "bg-white/5" : "bg-white border border-slate-100"}`}>
                        <span className={`font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>Poslední aktivita</span>
                        <div className="mt-3 space-y-2">
                          {[
                            { text: "Nové titulky vygenerovány", time: "Před 5 min", icon: Video },
                            { text: "Auto-reply odeslal 3 DM", time: "Před 12 min", icon: Bot },
                          ].map((item, i) => (
                            <div key={i} className={`flex items-center gap-3 p-2 rounded-lg ${isDark ? "bg-white/5" : "bg-slate-50"}`}>
                              <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${gradientPrimary} flex items-center justify-center`}>
                                <item.icon className="w-4 h-4 text-white" />
                              </div>
                              <div className="flex-1">
                                <div className={`text-sm font-medium ${isDark ? "text-white" : "text-slate-900"}`}>{item.text}</div>
                                <div className={`text-xs ${isDark ? "text-white/50" : "text-slate-500"}`}>{item.time}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </BrowserFrame>

              {/* Floating badges */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className={`absolute -bottom-6 -left-6 hidden lg:flex items-center gap-3 px-4 py-3 rounded-2xl border backdrop-blur-xl ${isDark ? "bg-[#1a1a1a]/90 border-white/10" : "bg-white/90 border-slate-200"}`}
                style={{ boxShadow: `0 8px 32px -8px rgba(225, 48, 108, 0.3)` }}
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#833AB4] to-[#E1306C] flex items-center justify-center">
                  <Video className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className={`font-semibold text-sm ${isDark ? "text-white" : "text-slate-900"}`}>AI Titulky</div>
                  <div className={`text-xs ${isDark ? "text-white/60" : "text-slate-500"}`}>95% přesnost</div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className={`absolute -top-4 -right-4 hidden lg:flex items-center gap-3 px-4 py-3 rounded-2xl border backdrop-blur-xl ${isDark ? "bg-[#1a1a1a]/90 border-white/10" : "bg-white/90 border-slate-200"}`}
                style={{ boxShadow: `0 8px 32px -8px rgba(225, 48, 108, 0.3)` }}
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#E1306C] to-[#F77737] flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className={`font-semibold text-sm ${isDark ? "text-white" : "text-slate-900"}`}>+47% engagement</div>
                  <div className={`text-xs ${isDark ? "text-white/60" : "text-slate-500"}`}>Za 30 dní</div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trust Strip */}
      <section className={`py-8 px-4 border-y ${isDark ? "border-white/5 bg-black/30" : "border-slate-100 bg-slate-50"}`}>
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-center gap-8">
          <span className={`text-sm ${isDark ? "text-white/40" : "text-slate-500"}`}>Používají tvůrci z:</span>
          {["Fitness", "Lifestyle", "E-commerce", "Travel", "Food", "Beauty"].map((cat) => (
            <span key={cat} className={`text-lg font-semibold ${isDark ? "text-white/20" : "text-slate-300"}`}>{cat}</span>
          ))}
        </div>
      </section>

      {/* Video Editor Section */}
      <section id="editor" className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-6 ${isDark ? "bg-white/5 border-white/10" : "bg-pink-50 border-pink-200"}`}>
                <Edit3 className={`w-4 h-4 ${isDark ? "text-[#E1306C]" : "text-[#E1306C]"}`} />
                <span className={`text-sm font-medium ${isDark ? "text-white/80" : "text-[#E1306C]"}`}>Video Editor</span>
              </div>

              <h2 className={`text-3xl sm:text-4xl font-bold mb-6 ${isDark ? "text-white" : "text-slate-900"}`}>
                Profesionální střih
                <span className={`block ${gradientText}`}>přímo v prohlížeči 🎬</span>
              </h2>

              <p className={`text-lg mb-8 ${isDark ? "text-white/60" : "text-slate-600"}`}>
                Drag & drop jednoduchost s profesionálními funkcemi. Šablony pro Reels, Stories i carousely.
              </p>

              <div className="space-y-4">
                {[
                  "Timeline editor s multi-track podporou",
                  "Přechody, efekty a filtry jedním klikem",
                  "Export v optimálním rozlišení pro každou platformu",
                  "Automatické formátování pro různé poměry stran",
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#833AB4] to-[#E1306C] flex items-center justify-center">
                      <Check className="w-3.5 h-3.5 text-white" />
                    </div>
                    <span className={isDark ? "text-white/80" : "text-slate-700"}>{item}</span>
                  </div>
                ))}
              </div>

              <Link
                href="/features/video-editor"
                className="inline-flex items-center gap-2 mt-8 px-6 py-3 rounded-xl font-semibold text-white"
                style={{ background: `linear-gradient(135deg, #833AB4, #E1306C)`, boxShadow: `0 8px 24px -8px ${accentPink}` }}
              >
                Prozkoumat editor
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <BrowserFrame url="app.socialmat.cz/editor">
                {/* Video Editor Mockup */}
                {/* TODO: Replace with real video editor screenshot at /public/screenshots/video-editor.png */}
                <div className={`aspect-[16/10] ${isDark ? "bg-[#111]" : "bg-slate-50"} p-3`}>
                  {/* Toolbar */}
                  <div className={`flex items-center gap-2 mb-3 p-2 rounded-lg ${isDark ? "bg-white/5" : "bg-white"}`}>
                    {[Scissors, Type, Palette, Wand2, Volume2, Download].map((Icon, i) => (
                      <div key={i} className={`w-8 h-8 rounded-lg flex items-center justify-center ${isDark ? "hover:bg-white/10 text-white/60" : "hover:bg-slate-100 text-slate-500"}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                    ))}
                    <div className="flex-1" />
                    <button className="px-3 py-1.5 rounded-lg text-white text-sm font-medium bg-gradient-to-r from-[#833AB4] to-[#E1306C]">
                      Export
                    </button>
                  </div>

                  {/* Preview Area */}
                  <div className="flex gap-3" style={{ height: "calc(100% - 100px)" }}>
                    <div className={`flex-1 rounded-xl overflow-hidden ${isDark ? "bg-black" : "bg-slate-900"} flex items-center justify-center relative`}>
                      <div className="absolute inset-0 bg-gradient-to-br from-[#833AB4]/20 to-[#E1306C]/20" />
                      <div className="text-center z-10">
                        <PlayCircle className={`w-16 h-16 mx-auto mb-2 ${isDark ? "text-white/30" : "text-white/50"}`} />
                        <span className={`text-sm ${isDark ? "text-white/40" : "text-white/60"}`}>Video Preview</span>
                      </div>
                      {/* Subtitle Preview */}
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-lg bg-black/80 backdrop-blur-sm">
                        <span className="text-white text-sm font-medium">Takhle vypadají titulky ✨</span>
                      </div>
                    </div>

                    {/* Side Panel */}
                    <div className={`w-48 rounded-xl p-3 ${isDark ? "bg-white/5" : "bg-white"}`}>
                      <div className={`text-xs font-semibold mb-3 ${isDark ? "text-white/50" : "text-slate-500"}`}>ŠABLONY</div>
                      <div className="space-y-2">
                        {["Reels Vertical", "Story 9:16", "Square 1:1"].map((t, i) => (
                          <div key={i} className={`p-2 rounded-lg text-xs ${i === 0 ? "bg-gradient-to-r from-[#833AB4]/20 to-[#E1306C]/20 border border-[#E1306C]/30" : isDark ? "bg-white/5" : "bg-slate-50"} ${isDark ? "text-white/80" : "text-slate-700"}`}>
                            {t}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Timeline */}
                  <div className={`mt-3 rounded-xl p-3 ${isDark ? "bg-white/5" : "bg-white"}`}>
                    <div className="flex items-center gap-3 mb-2">
                      <PauseCircle className={`w-5 h-5 ${isDark ? "text-white" : "text-slate-900"}`} />
                      <div className="flex-1 h-1 rounded-full bg-gradient-to-r from-[#833AB4] via-[#E1306C] to-[#F77737]" style={{ width: "60%" }} />
                      <span className={`text-xs ${isDark ? "text-white/50" : "text-slate-500"}`}>0:24 / 0:45</span>
                    </div>
                    <div className="flex gap-1 h-12">
                      {[...Array(8)].map((_, i) => (
                        <div key={i} className={`flex-1 rounded ${i < 5 ? "bg-gradient-to-b from-[#833AB4]/40 to-[#E1306C]/40" : isDark ? "bg-white/10" : "bg-slate-100"}`} />
                      ))}
                    </div>
                  </div>
                </div>
              </BrowserFrame>
            </motion.div>
          </div>
        </div>
      </section>

      {/* AI Subtitles Section */}
      <section id="subtitles" className={`py-24 px-4 ${isDark ? "bg-black/30" : "bg-slate-50"}`}>
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="order-2 lg:order-1"
            >
              <BrowserFrame url="app.socialmat.cz/titulky">
                {/* Subtitles Mockup */}
                {/* TODO: Replace with real subtitles screenshot at /public/screenshots/subtitles.png */}
                <div className={`aspect-[16/10] ${isDark ? "bg-[#111]" : "bg-slate-50"} p-4`}>
                  <div className="flex gap-4 h-full">
                    {/* Video Preview */}
                    <div className={`flex-1 rounded-xl overflow-hidden ${isDark ? "bg-black" : "bg-slate-900"} relative`}>
                      <div className="absolute inset-0 bg-gradient-to-br from-[#E1306C]/10 to-[#F77737]/10" />
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        {/* Animated Subtitles */}
                        <div className="space-y-2">
                          <div className="flex justify-center">
                            <span className="px-4 py-2 rounded-lg bg-black/80 backdrop-blur-sm text-white text-lg font-bold">
                              A tohle je <span className="text-[#E1306C]">klíčové slovo</span>
                            </span>
                          </div>
                        </div>
                      </div>
                      {/* Progress */}
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
                        <div className="h-full w-2/3 bg-gradient-to-r from-[#833AB4] to-[#E1306C]" />
                      </div>
                    </div>

                    {/* Settings Panel */}
                    <div className={`w-56 rounded-xl p-4 ${isDark ? "bg-white/5" : "bg-white"}`}>
                      <div className={`text-sm font-semibold mb-4 ${isDark ? "text-white" : "text-slate-900"}`}>Styl titulků</div>

                      <div className="space-y-4">
                        <div>
                          <label className={`text-xs ${isDark ? "text-white/50" : "text-slate-500"}`}>Font</label>
                          <div className={`mt-1 p-2 rounded-lg ${isDark ? "bg-white/10" : "bg-slate-100"}`}>
                            <span className={`text-sm font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>Montserrat Bold</span>
                          </div>
                        </div>

                        <div>
                          <label className={`text-xs ${isDark ? "text-white/50" : "text-slate-500"}`}>Barva zvýraznění</label>
                          <div className="mt-1 flex gap-2">
                            {["#E1306C", "#833AB4", "#F77737", "#FCB045"].map((color, i) => (
                              <div
                                key={i}
                                className={`w-8 h-8 rounded-lg ${i === 0 ? "ring-2 ring-white ring-offset-2 ring-offset-black" : ""}`}
                                style={{ background: color }}
                              />
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className={`text-xs ${isDark ? "text-white/50" : "text-slate-500"}`}>Animace</label>
                          <div className={`mt-1 p-2 rounded-lg ${isDark ? "bg-white/10" : "bg-slate-100"}`}>
                            <span className={`text-sm ${isDark ? "text-white" : "text-slate-900"}`}>Fade In + Highlight</span>
                          </div>
                        </div>
                      </div>

                      <button className="w-full mt-4 py-2 rounded-lg text-white text-sm font-medium bg-gradient-to-r from-[#833AB4] to-[#E1306C]">
                        Aplikovat změny
                      </button>
                    </div>
                  </div>
                </div>
              </BrowserFrame>

              {/* Stats badges */}
              <div className="flex gap-4 mt-6 justify-center">
                {[
                  { label: "Přesnost", value: "95%+", icon: Zap },
                  { label: "Rychlost", value: "30s", icon: Clock },
                  { label: "Jazyky", value: "CZ/SK", icon: Type },
                ].map((stat, i) => (
                  <div key={i} className={`flex items-center gap-2 px-4 py-2 rounded-xl ${isDark ? "bg-white/5" : "bg-white border border-slate-200"}`}>
                    <stat.icon className={`w-4 h-4 ${isDark ? "text-[#E1306C]" : "text-[#E1306C]"}`} />
                    <span className={`text-sm font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>{stat.value}</span>
                    <span className={`text-xs ${isDark ? "text-white/50" : "text-slate-500"}`}>{stat.label}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="order-1 lg:order-2"
            >
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-6 ${isDark ? "bg-white/5 border-white/10" : "bg-pink-50 border-pink-200"}`}>
                <Video className={`w-4 h-4 text-[#E1306C]`} />
                <span className={`text-sm font-medium ${isDark ? "text-white/80" : "text-[#E1306C]"}`}>AI Titulky</span>
                <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-gradient-to-r from-[#833AB4] to-[#E1306C] text-white">Populární</span>
              </div>

              <h2 className={`text-3xl sm:text-4xl font-bold mb-6 ${isDark ? "text-white" : "text-slate-900"}`}>
                Titulky za 30 sekund
                <span className={`block ${gradientText}`}>s 95% přesností ⚡</span>
              </h2>

              <p className={`text-lg mb-8 ${isDark ? "text-white/60" : "text-slate-600"}`}>
                Naše AI je speciálně trénovaná na češtinu a slovenštinu. Rozpozná i rychlou řeč, dialekty a slang.
              </p>

              <div className="space-y-4">
                {[
                  "Automatický přepis mluvené řeči",
                  "Customizace fontů, barev a animací",
                  "Export do SRT nebo přímo do videa",
                  "Podpora pro hudbu na pozadí",
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#833AB4] to-[#E1306C] flex items-center justify-center">
                      <Check className="w-3.5 h-3.5 text-white" />
                    </div>
                    <span className={isDark ? "text-white/80" : "text-slate-700"}>{item}</span>
                  </div>
                ))}
              </div>

              <Link
                href="/features/titulky"
                className="inline-flex items-center gap-2 mt-8 px-6 py-3 rounded-xl font-semibold text-white"
                style={{ background: `linear-gradient(135deg, #833AB4, #E1306C)`, boxShadow: `0 8px 24px -8px ${accentPink}` }}
              >
                Vyzkoušet titulky
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Auto-reply Section */}
      <section id="autoreply" className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-6 ${isDark ? "bg-white/5 border-white/10" : "bg-pink-50 border-pink-200"}`}>
                <Bot className={`w-4 h-4 text-[#E1306C]`} />
                <span className={`text-sm font-medium ${isDark ? "text-white/80" : "text-[#E1306C]"}`}>Auto-reply</span>
                <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-gradient-to-r from-[#E1306C] to-[#F77737] text-white">Nové</span>
              </div>

              <h2 className={`text-3xl sm:text-4xl font-bold mb-6 ${isDark ? "text-white" : "text-slate-900"}`}>
                Odpovídej na komentáře
                <span className={`block ${gradientText}`}>i když spíš 😴</span>
              </h2>

              <p className={`text-lg mb-8 ${isDark ? "text-white/60" : "text-slate-600"}`}>
                AI chatbot odpovídá v tvém tónu 24/7. Zachytává leady, posílá DM a předá konverzaci tobě když je potřeba.
              </p>

              <div className="space-y-4">
                {[
                  "Automatické odpovědi pod Reels a posty",
                  "DM follow-up s PDF, slevou nebo linkem",
                  "Predikce intence uživatele pomocí AI",
                  "Přepnutí na člověka jedním klikem",
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#E1306C] to-[#F77737] flex items-center justify-center">
                      <Check className="w-3.5 h-3.5 text-white" />
                    </div>
                    <span className={isDark ? "text-white/80" : "text-slate-700"}>{item}</span>
                  </div>
                ))}
              </div>

              <Link
                href="/features/auto-reply"
                className="inline-flex items-center gap-2 mt-8 px-6 py-3 rounded-xl font-semibold text-white"
                style={{ background: `linear-gradient(135deg, #E1306C, #F77737)`, boxShadow: `0 8px 24px -8px ${accentPink}` }}
              >
                Aktivovat chatbot
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="flex justify-center"
            >
              {/* Phone mockup with DM */}
              <div className="relative">
                <PhoneFrame>
                  {/* TODO: Replace with real DM screenshot at /public/screenshots/dm-chat.png */}
                  <div className={`w-72 ${isDark ? "bg-[#111]" : "bg-white"}`}>
                    {/* DM Header */}
                    <div className={`flex items-center gap-3 p-4 border-b ${isDark ? "border-white/10" : "border-slate-100"}`}>
                      <ChevronLeft className={`w-5 h-5 ${isDark ? "text-white" : "text-slate-900"}`} />
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#833AB4] to-[#E1306C]" />
                      <div className="flex-1">
                        <div className={`font-semibold text-sm ${isDark ? "text-white" : "text-slate-900"}`}>@tereza.creates</div>
                        <div className={`text-xs ${isDark ? "text-white/50" : "text-slate-500"}`}>Aktivní teď</div>
                      </div>
                      <MoreHorizontal className={`w-5 h-5 ${isDark ? "text-white/50" : "text-slate-400"}`} />
                    </div>

                    {/* Messages */}
                    <div className="p-4 space-y-3 h-80 overflow-hidden">
                      {/* Incoming */}
                      <div className="flex gap-2">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#833AB4] to-[#E1306C] flex-shrink-0" />
                        <div className={`max-w-[80%] px-3 py-2 rounded-2xl rounded-tl-md ${isDark ? "bg-white/10" : "bg-slate-100"}`}>
                          <p className={`text-sm ${isDark ? "text-white" : "text-slate-900"}`}>Ahoj! Kolik stojí ten tvůj kurz? 🙏</p>
                        </div>
                      </div>

                      {/* Bot response */}
                      <div className="flex justify-end">
                        <div className="max-w-[85%] px-3 py-2 rounded-2xl rounded-tr-md bg-gradient-to-br from-[#833AB4] to-[#E1306C]">
                          <p className="text-sm text-white">Ahoj! 👋 Díky za zájem!</p>
                          <p className="text-sm text-white mt-1">Kurz stojí 2490 Kč a právě máme -20% slevu! 🎉</p>
                          <p className="text-sm text-white mt-1">Posílám ti odkaz + PDF zdarma!</p>
                          <div className="flex items-center gap-1 mt-2 text-xs text-white/70">
                            <Bot className="w-3 h-3" />
                            <span>Automatická odpověď</span>
                          </div>
                        </div>
                      </div>

                      {/* Link preview */}
                      <div className="flex justify-end">
                        <div className={`max-w-[85%] rounded-xl overflow-hidden border ${isDark ? "border-white/10 bg-white/5" : "border-slate-200 bg-white"}`}>
                          <div className="h-20 bg-gradient-to-br from-[#833AB4]/30 to-[#E1306C]/30" />
                          <div className="p-2">
                            <div className={`text-xs font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>Kurz Instagram Pro</div>
                            <div className={`text-xs ${isDark ? "text-white/50" : "text-slate-500"}`}>kurzy.socialmat.cz</div>
                          </div>
                        </div>
                      </div>

                      {/* Incoming reply */}
                      <div className="flex gap-2">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#833AB4] to-[#E1306C] flex-shrink-0" />
                        <div className={`max-w-[80%] px-3 py-2 rounded-2xl rounded-tl-md ${isDark ? "bg-white/10" : "bg-slate-100"}`}>
                          <p className={`text-sm ${isDark ? "text-white" : "text-slate-900"}`}>Super, díky! 💜</p>
                        </div>
                      </div>
                    </div>

                    {/* Input */}
                    <div className={`p-3 border-t ${isDark ? "border-white/10" : "border-slate-100"}`}>
                      <div className={`flex items-center gap-2 p-2 rounded-full ${isDark ? "bg-white/5" : "bg-slate-100"}`}>
                        <Smile className={`w-5 h-5 ${isDark ? "text-white/40" : "text-slate-400"}`} />
                        <input type="text" placeholder="Zpráva..." className={`flex-1 bg-transparent text-sm outline-none ${isDark ? "text-white placeholder:text-white/40" : "text-slate-900 placeholder:text-slate-400"}`} />
                        <Paperclip className={`w-5 h-5 ${isDark ? "text-white/40" : "text-slate-400"}`} />
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#833AB4] to-[#E1306C] flex items-center justify-center">
                          <Send className="w-4 h-4 text-white" />
                        </div>
                      </div>
                    </div>
                  </div>
                </PhoneFrame>

                {/* Stats floating */}
                <div className={`absolute -bottom-4 -left-8 px-4 py-2 rounded-xl border backdrop-blur-xl ${isDark ? "bg-[#1a1a1a]/90 border-white/10" : "bg-white/90 border-slate-200"}`}
                     style={{ boxShadow: `0 8px 24px -8px rgba(225, 48, 108, 0.4)` }}>
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-[#FCB045]" />
                    <span className={`text-sm font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>Odpověď za 3s</span>
                  </div>
                </div>

                <div className={`absolute -top-4 -right-8 px-4 py-2 rounded-xl border backdrop-blur-xl ${isDark ? "bg-[#1a1a1a]/90 border-white/10" : "bg-white/90 border-slate-200"}`}
                     style={{ boxShadow: `0 8px 24px -8px rgba(225, 48, 108, 0.4)` }}>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <span className={`text-sm font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>+37% leadů</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Analytics Section */}
      <section id="analytics" className={`py-24 px-4 ${isDark ? "bg-black/30" : "bg-slate-50"}`}>
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-6 ${isDark ? "bg-white/5 border-white/10" : "bg-orange-50 border-orange-200"}`}>
              <LineChart className={`w-4 h-4 text-[#F77737]`} />
              <span className={`text-sm font-medium ${isDark ? "text-white/80" : "text-[#F77737]"}`}>Analytics Dashboard</span>
            </div>

            <h2 className={`text-3xl sm:text-4xl font-bold mb-4 ${isDark ? "text-white" : "text-slate-900"}`}>
              Všechna data na jednom místě
              <span className={`block ${gradientText}`}>s AI doporučeními 📊</span>
            </h2>
            <p className={`text-lg max-w-2xl mx-auto ${isDark ? "text-white/60" : "text-slate-600"}`}>
              Real-time metriky, AI insights a návrhy na zlepšení. Vše v přehledném dashboardu.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <BrowserFrame url="app.socialmat.cz/analytics">
              {/* Analytics Dashboard Mockup */}
              {/* TODO: Replace with real analytics screenshot at /public/screenshots/analytics.png */}
              <div className={`aspect-[16/9] ${isDark ? "bg-[#111]" : "bg-slate-50"} p-6`}>
                <div className="grid grid-cols-12 gap-4 h-full">
                  {/* Left Stats Column */}
                  <div className="col-span-3 space-y-4">
                    {[
                      { label: "Total Reach", value: "1.2M", change: "+23%", color: "from-[#833AB4] to-[#E1306C]" },
                      { label: "Engagement Rate", value: "8.7%", change: "+1.2%", color: "from-[#E1306C] to-[#F77737]" },
                      { label: "New Followers", value: "+2,847", change: "This week", color: "from-[#F77737] to-[#FCB045]" },
                      { label: "Profile Visits", value: "45.2K", change: "+18%", color: "from-[#833AB4] to-[#C13584]" },
                    ].map((stat, i) => (
                      <div key={i} className={`p-4 rounded-xl ${isDark ? "bg-white/5" : "bg-white"}`}>
                        <div className={`text-xs ${isDark ? "text-white/50" : "text-slate-500"}`}>{stat.label}</div>
                        <div className={`text-2xl font-bold mt-1 ${isDark ? "text-white" : "text-slate-900"}`}>{stat.value}</div>
                        <div className="flex items-center gap-1 mt-1">
                          <TrendingUp className="w-3 h-3 text-green-500" />
                          <span className="text-xs text-green-500">{stat.change}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Main Chart */}
                  <div className="col-span-6 space-y-4">
                    <div className={`h-2/3 rounded-xl p-4 ${isDark ? "bg-white/5" : "bg-white"}`}>
                      <div className="flex items-center justify-between mb-4">
                        <span className={`font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>Engagement Overview</span>
                        <div className="flex gap-2">
                          {["7D", "30D", "90D"].map((p, i) => (
                            <button key={i} className={`px-2 py-1 rounded text-xs ${i === 1 ? "bg-gradient-to-r from-[#833AB4] to-[#E1306C] text-white" : isDark ? "bg-white/10 text-white/60" : "bg-slate-100 text-slate-600"}`}>{p}</button>
                          ))}
                        </div>
                      </div>
                      {/* Chart visualization */}
                      <div className="h-32 flex items-end gap-1">
                        {[30, 45, 35, 60, 50, 80, 65, 90, 70, 85, 75, 95].map((h, i) => (
                          <div key={i} className="flex-1">
                            <div
                              className="w-full rounded-t"
                              style={{
                                height: `${h}%`,
                                background: i >= 9 ? `linear-gradient(180deg, #833AB4, #E1306C, #F77737)` : isDark ? "rgba(255,255,255,0.1)" : "#e2e8f0"
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* AI Insights */}
                    <div className={`h-1/3 rounded-xl p-4 ${isDark ? "bg-gradient-to-br from-[#833AB4]/20 to-[#E1306C]/20 border border-[#E1306C]/30" : "bg-gradient-to-br from-pink-50 to-orange-50 border border-pink-200"}`}>
                      <div className="flex items-center gap-2 mb-2">
                        <Wand2 className="w-4 h-4 text-[#E1306C]" />
                        <span className={`text-sm font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>AI Insight</span>
                      </div>
                      <p className={`text-sm ${isDark ? "text-white/80" : "text-slate-700"}`}>
                        Tvoje Reels s hookem v prvních 3s mají o <span className="font-bold text-[#E1306C]">47% vyšší</span> watch time. Zkus použít podobný formát i pro další obsah.
                      </p>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="col-span-3 space-y-4">
                    {/* Top Posts */}
                    <div className={`rounded-xl p-4 ${isDark ? "bg-white/5" : "bg-white"}`}>
                      <span className={`text-sm font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>Top Posts</span>
                      <div className="mt-3 space-y-2">
                        {[
                          { views: "124K", likes: "8.2K" },
                          { views: "98K", likes: "6.1K" },
                          { views: "76K", likes: "4.8K" },
                        ].map((post, i) => (
                          <div key={i} className={`flex items-center gap-2 p-2 rounded-lg ${isDark ? "bg-white/5" : "bg-slate-50"}`}>
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#833AB4] to-[#E1306C]" />
                            <div className="flex-1">
                              <div className={`text-xs ${isDark ? "text-white/80" : "text-slate-900"}`}>{post.views} views</div>
                              <div className={`text-xs ${isDark ? "text-white/50" : "text-slate-500"}`}>{post.likes} likes</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Best Time */}
                    <div className={`rounded-xl p-4 ${isDark ? "bg-white/5" : "bg-white"}`}>
                      <span className={`text-sm font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>Best Time to Post</span>
                      <div className="mt-3 grid grid-cols-3 gap-1">
                        {["Po", "Út", "St", "Čt", "Pá", "So", "Ne"].map((day, i) => (
                          <div key={i} className={`text-center p-2 rounded-lg ${i === 4 || i === 5 ? "bg-gradient-to-br from-[#833AB4]/30 to-[#E1306C]/30" : isDark ? "bg-white/5" : "bg-slate-50"}`}>
                            <div className={`text-[10px] ${isDark ? "text-white/50" : "text-slate-500"}`}>{day}</div>
                            <div className={`text-xs font-bold ${i === 4 || i === 5 ? "text-[#E1306C]" : isDark ? "text-white/80" : "text-slate-700"}`}>
                              {i === 4 ? "18:00" : i === 5 ? "20:00" : "-"}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </BrowserFrame>
          </motion.div>
        </div>
      </section>

      {/* Bento Features Grid */}
      <section id="features" className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-6 ${isDark ? "bg-white/5 border-white/10" : "bg-pink-50 border-pink-200"}`}>
              <Layers className={`w-4 h-4 text-[#E1306C]`} />
              <span className={`text-sm font-medium ${isDark ? "text-white/80" : "text-[#E1306C]"}`}>Kompletní toolkit</span>
            </div>
            <h2 className={`text-3xl sm:text-4xl font-bold mb-4 ${isDark ? "text-white" : "text-slate-900"}`}>
              Všechno co potřebuješ,
              <span className={`block ${gradientText}`}>na jednom místě 🎯</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    href={feature.href}
                    className={`group block h-full p-6 rounded-2xl border transition-all hover:-translate-y-1 ${isDark ? "bg-[#1a1a1a]/50 border-white/10 hover:border-[#E1306C]/50" : "bg-white border-slate-200 hover:border-[#E1306C]/50"}`}
                    style={{ boxShadow: isDark ? "" : "0 4px 20px -4px rgba(0,0,0,0.1)" }}
                  >
                    {feature.badge && (
                      <span className="inline-block px-2 py-0.5 rounded-full text-xs font-semibold bg-gradient-to-r from-[#833AB4] to-[#E1306C] text-white mb-3">
                        {feature.badge}
                      </span>
                    )}
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                         style={{ boxShadow: `0 8px 20px -8px ${accentPink}` }}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className={`font-bold text-lg mb-2 ${isDark ? "text-white" : "text-slate-900"}`}>{feature.title}</h3>
                    <p className={`text-sm ${isDark ? "text-white/60" : "text-slate-600"}`}>{feature.description}</p>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className={`py-24 px-4 ${isDark ? "bg-black/30" : "bg-slate-50"}`}>
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-6 ${isDark ? "bg-white/5 border-white/10" : "bg-orange-50 border-orange-200"}`}>
              <Wand2 className={`w-4 h-4 text-[#F77737]`} />
              <span className={`text-sm font-medium ${isDark ? "text-white/80" : "text-[#F77737]"}`}>Jednoduché jako 1-2-3</span>
            </div>
            <h2 className={`text-3xl sm:text-4xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
              3 kroky k lepšímu
              <span className={`block ${gradientText}`}>Instagramu 🚀</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {steps.map((step, i) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="relative"
              >
                {i < steps.length - 1 && (
                  <div className={`hidden md:block absolute top-12 left-[60%] w-full h-0.5 ${isDark ? "bg-white/10" : "bg-slate-200"}`} />
                )}
                <div className={`relative p-6 rounded-2xl border text-center ${isDark ? "bg-[#1a1a1a]/50 border-white/10" : "bg-white border-slate-200"}`}>
                  <div className={`absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold`}
                       style={{ background: `linear-gradient(135deg, #833AB4, #E1306C)` }}>
                    {i + 1}
                  </div>
                  <div className="text-4xl mb-4">{step.emoji}</div>
                  <h3 className={`font-bold text-lg mb-2 ${isDark ? "text-white" : "text-slate-900"}`}>{step.title}</h3>
                  <p className={`text-sm ${isDark ? "text-white/60" : "text-slate-600"}`}>{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-6 ${isDark ? "bg-white/5 border-white/10" : "bg-pink-50 border-pink-200"}`}>
              <Heart className={`w-4 h-4 text-[#E1306C]`} />
              <span className={`text-sm font-medium ${isDark ? "text-white/80" : "text-[#E1306C]"}`}>500+ spokojených tvůrců</span>
            </div>
            <h2 className={`text-3xl sm:text-4xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
              Co říkají naši
              <span className={`block ${gradientText}`}>uživatelé 💬</span>
            </h2>
          </motion.div>

          <div className="relative">
            <div className="overflow-hidden">
              <motion.div
                className="flex"
                animate={{ x: `-${currentTestimonial * 100}%` }}
                transition={{ duration: 0.5 }}
              >
                {testimonials.map((t, i) => (
                  <div key={i} className="w-full flex-shrink-0 px-4">
                    <div className={`max-w-xl mx-auto p-8 rounded-3xl border ${isDark ? "bg-[#1a1a1a]/50 border-white/10" : "bg-white border-slate-200"}`}
                         style={{ boxShadow: `0 8px 40px -12px rgba(225, 48, 108, 0.2)` }}>
                      <div className="flex items-center gap-4 mb-6">
                        <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${gradientPrimary} flex items-center justify-center text-white text-lg font-bold`}>
                          {t.name.split(" ").map(n => n[0]).join("")}
                        </div>
                        <div>
                          <div className={`font-bold ${isDark ? "text-white" : "text-slate-900"}`}>{t.name}</div>
                          <div className={`text-sm ${isDark ? "text-white/60" : "text-slate-500"}`}>{t.role}</div>
                          <div className={`text-xs ${isDark ? "text-white/40" : "text-slate-400"}`}>{t.handle} · {t.followers}</div>
                        </div>
                      </div>
                      <p className={`text-lg ${isDark ? "text-white/80" : "text-slate-700"}`}>&ldquo;{t.text}&rdquo;</p>
                      <div className="flex items-center gap-1 mt-4">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-5 h-5 fill-[#FCB045] text-[#FCB045]" />
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>
            <div className="flex justify-center gap-2 mt-6">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentTestimonial(i)}
                  className={`h-2 rounded-full transition-all ${currentTestimonial === i ? "w-8 bg-gradient-to-r from-[#833AB4] to-[#E1306C]" : `w-2 ${isDark ? "bg-white/20" : "bg-slate-300"}`}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className={`py-24 px-4 ${isDark ? "bg-black/30" : "bg-slate-50"}`}>
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-6 ${isDark ? "bg-white/5 border-white/10" : "bg-green-50 border-green-200"}`}>
              <CreditCard className={`w-4 h-4 ${isDark ? "text-green-400" : "text-green-600"}`} />
              <span className={`text-sm font-medium ${isDark ? "text-white/80" : "text-green-700"}`}>Jednoduchý ceník</span>
            </div>
            <h2 className={`text-3xl sm:text-4xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
              Vyber si plán
              <span className={`block ${gradientText}`}>podle sebe 💰</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {pricingPlans.map((plan, i) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`relative p-6 rounded-2xl border ${plan.highlight
                  ? `${isDark ? "bg-gradient-to-br from-[#833AB4]/20 via-[#E1306C]/10 to-transparent" : "bg-gradient-to-br from-pink-50 to-orange-50"} border-[#E1306C]/50`
                  : `${isDark ? "bg-[#1a1a1a]/50 border-white/10" : "bg-white border-slate-200"}`}`}
                style={plan.highlight ? { boxShadow: `0 8px 40px -12px rgba(225, 48, 108, 0.3)` } : {}}
              >
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-semibold text-white"
                       style={{ background: `linear-gradient(135deg, #833AB4, #E1306C)` }}>
                    {plan.badge}
                  </div>
                )}
                <div className="text-center mb-6">
                  <h3 className={`text-xl font-bold mb-1 ${isDark ? "text-white" : "text-slate-900"}`}>{plan.name}</h3>
                  <p className={`text-sm ${isDark ? "text-white/60" : "text-slate-600"}`}>{plan.description}</p>
                  <div className="mt-4">
                    <span className={`text-3xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}>{plan.price}</span>
                    {plan.period && <span className={`text-sm ${isDark ? "text-white/60" : "text-slate-500"}`}>/{plan.period}</span>}
                  </div>
                </div>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-2">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center ${plan.highlight ? "bg-gradient-to-br from-[#833AB4] to-[#E1306C]" : isDark ? "bg-white/20" : "bg-slate-200"}`}>
                        <Check className="w-3 h-3 text-white" />
                      </div>
                      <span className={`text-sm ${isDark ? "text-white/80" : "text-slate-700"}`}>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/signup"
                  className={`block w-full py-3 rounded-xl text-center font-semibold transition-all ${plan.highlight
                    ? "text-white"
                    : isDark ? "bg-white/10 text-white border border-white/20" : "bg-slate-900 text-white"}`}
                  style={plan.highlight ? { background: `linear-gradient(135deg, #833AB4, #E1306C, #F77737)`, boxShadow: `0 8px 20px -8px ${accentPink}` } : {}}
                >
                  {plan.cta}
                </Link>
              </motion.div>
            ))}
          </div>

          <div className={`mt-8 flex flex-wrap items-center justify-center gap-6 p-4 rounded-xl ${isDark ? "bg-white/5" : "bg-white border border-slate-200"}`}>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-green-500" />
              <span className={`text-sm ${isDark ? "text-white/80" : "text-slate-700"}`}>14 dní zdarma</span>
            </div>
            <div className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-blue-500" />
              <span className={`text-sm ${isDark ? "text-white/80" : "text-slate-700"}`}>Bez kreditky</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-orange-500" />
              <span className={`text-sm ${isDark ? "text-white/80" : "text-slate-700"}`}>Zrušit kdykoliv</span>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 px-4">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-6 ${isDark ? "bg-white/5 border-white/10" : "bg-cyan-50 border-cyan-200"}`}>
              <MessageCircle className={`w-4 h-4 ${isDark ? "text-cyan-400" : "text-cyan-600"}`} />
              <span className={`text-sm font-medium ${isDark ? "text-white/80" : "text-cyan-700"}`}>FAQ</span>
            </div>
            <h2 className={`text-3xl sm:text-4xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
              Máš otázky?
              <span className={`block ${gradientText}`}>Máme odpovědi 🙋</span>
            </h2>
          </motion.div>

          <div className="space-y-3">
            {faqItems.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                  className={`w-full p-5 rounded-xl border text-left transition-all ${activeFaq === i ? isDark ? "bg-white/10 border-[#E1306C]/50" : "bg-white border-[#E1306C]/50 shadow-lg" : isDark ? "bg-[#1a1a1a]/50 border-white/10 hover:border-white/20" : "bg-white border-slate-200 hover:border-slate-300"}`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>{item.question}</span>
                    <ChevronDown className={`w-5 h-5 transition-transform ${activeFaq === i ? "rotate-180" : ""} ${isDark ? "text-white/60" : "text-slate-500"}`} />
                  </div>
                  <AnimatePresence>
                    {activeFaq === i && (
                      <motion.p
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className={`mt-3 overflow-hidden ${isDark ? "text-white/70" : "text-slate-600"}`}
                      >
                        {item.answer}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </button>
              </motion.div>
            ))}
          </div>

          <div className={`mt-8 p-6 rounded-xl text-center ${isDark ? "bg-white/5" : "bg-slate-50"}`}>
            <p className={`mb-3 ${isDark ? "text-white/70" : "text-slate-600"}`}>Nenašel jsi odpověď?</p>
            <a href="mailto:hello@socialmat.app" className={`inline-flex items-center gap-2 px-5 py-2 rounded-lg font-medium ${isDark ? "bg-white/10 text-white" : "bg-slate-200 text-slate-900"}`}>
              <Send className="w-4 h-4" />
              hello@socialmat.app
            </a>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <div className="relative p-12 rounded-3xl overflow-hidden"
               style={{ background: `linear-gradient(135deg, rgba(131, 58, 180, 0.9), rgba(225, 48, 108, 0.9), rgba(247, 119, 55, 0.9))` }}>
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -top-20 -right-20 w-60 h-60 bg-white/10 rounded-full blur-3xl" />
              <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-white/10 rounded-full blur-3xl" />
            </div>
            <div className="relative text-center">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Připraven posunout svůj
                <span className="block">Instagram na další level? ✨</span>
              </h2>
              <p className="text-lg text-white/80 mb-8">
                Vyzkoušej SocialMat zdarma a přidej se k 500+ českým tvůrcům.
              </p>
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl text-lg font-semibold bg-white text-slate-900 hover:bg-slate-100 transition-all hover:-translate-y-1"
                style={{ boxShadow: `0 12px 40px -12px rgba(0,0,0,0.3)` }}
              >
                Začít zdarma
                <ArrowRight className="w-5 h-5" />
              </Link>
              <div className="flex flex-wrap justify-center gap-6 mt-6 text-sm text-white/70">
                <span className="flex items-center gap-1.5"><Check className="w-4 h-4" />14 dní zdarma</span>
                <span className="flex items-center gap-1.5"><Check className="w-4 h-4" />Bez kreditky</span>
                <span className="flex items-center gap-1.5"><Check className="w-4 h-4" />Zrušit kdykoliv</span>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className={`py-12 px-4 border-t ${isDark ? "border-white/10 bg-black/50" : "border-slate-200 bg-slate-50"}`}>
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-2 md:col-span-1">
              <Link href="/" className="flex items-center gap-2.5 mb-4">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradientPrimary} flex items-center justify-center`}>
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className={`font-bold text-xl ${isDark ? "text-white" : "text-slate-900"}`}>SocialMat</span>
              </Link>
              <p className={`text-sm ${isDark ? "text-white/60" : "text-slate-600"}`}>
                AI nástroje pro české content creatry.
              </p>
            </div>
            <div>
              <h4 className={`font-semibold mb-3 ${isDark ? "text-white" : "text-slate-900"}`}>Produkt</h4>
              <ul className={`space-y-2 text-sm ${isDark ? "text-white/60" : "text-slate-600"}`}>
                <li><Link href="/features/titulky" className="hover:underline">AI Titulky</Link></li>
                <li><Link href="/features/auto-reply" className="hover:underline">Auto-reply</Link></li>
                <li><Link href="/features/analytics" className="hover:underline">Analytics</Link></li>
              </ul>
            </div>
            <div>
              <h4 className={`font-semibold mb-3 ${isDark ? "text-white" : "text-slate-900"}`}>Společnost</h4>
              <ul className={`space-y-2 text-sm ${isDark ? "text-white/60" : "text-slate-600"}`}>
                <li><button onClick={() => scrollToSection("pricing")} className="hover:underline">Ceník</button></li>
                <li><button onClick={() => scrollToSection("faq")} className="hover:underline">FAQ</button></li>
                <li><a href="mailto:hello@socialmat.app" className="hover:underline">Kontakt</a></li>
              </ul>
            </div>
            <div>
              <h4 className={`font-semibold mb-3 ${isDark ? "text-white" : "text-slate-900"}`}>Právní</h4>
              <ul className={`space-y-2 text-sm ${isDark ? "text-white/60" : "text-slate-600"}`}>
                <li><Link href="/privacy" className="hover:underline">Ochrana soukromí</Link></li>
                <li><Link href="/data-deletion" className="hover:underline">Smazání dat</Link></li>
              </ul>
            </div>
          </div>
          <div className={`pt-6 border-t flex flex-col md:flex-row items-center justify-between gap-4 ${isDark ? "border-white/10" : "border-slate-200"}`}>
            <p className={`text-sm ${isDark ? "text-white/50" : "text-slate-500"}`}>© {currentYear} SocialMat. Vytvořeno s 💜 v Česku.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
