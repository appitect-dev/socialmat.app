"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Sun,
  Moon,
  ChevronDown,
  Menu,
  X,
  ArrowRight,
  Check,
  Star,
  Video,
  Bot,
  LineChart,
  Calendar,
  Edit3,
  Brain,
} from "lucide-react";

// Types
interface Stat {
  value: string;
  label: string;
}

interface Step {
  number: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface SubFeature {
  title: string;
  description: string;
  features: string[];
  imagePosition: "left" | "right";
}

interface UseCase {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface Testimonial {
  name: string;
  role: string;
  text: string;
  avatar?: string;
}

interface RelatedFeature {
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
  color: string;
}

interface FeaturePageLayoutProps {
  // Hero
  badge: string;
  badgeIcon?: React.ReactNode;
  title: string;
  titleGradient: string;
  subtitle: string;
  heroScreenshot?: React.ReactNode;

  // Stats
  stats: Stat[];

  // How it works
  steps: Step[];

  // Sub-features
  subFeatures: SubFeature[];

  // Before/After (optional)
  beforeAfter?: {
    before: React.ReactNode;
    after: React.ReactNode;
  };

  // Use Cases
  useCases: UseCase[];

  // Testimonials
  testimonials: Testimonial[];

  // CTA
  ctaTitle: string;
  ctaSubtitle: string;

  // Related
  relatedFeatures: RelatedFeature[];
}

export function FeaturePageLayout({
  badge,
  badgeIcon,
  title,
  titleGradient,
  subtitle,
  heroScreenshot,
  stats,
  steps,
  subFeatures,
  useCases,
  testimonials,
  ctaTitle,
  ctaSubtitle,
  relatedFeatures,
}: FeaturePageLayoutProps) {
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [featuresDropdownOpen, setFeaturesDropdownOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = localStorage.getItem("landing-theme");
    if (saved === "light") setTheme("light");
  }, []);

  const isDark = theme === "dark";
  const currentYear = new Date().getFullYear();
  const gradientPrimary = "from-[#833AB4] via-[#E1306C] to-[#F77737]";
  const accentPink = "#E1306C";

  const features = [
    { icon: Video, title: "AI Titulky", href: "/features/titulky", color: "from-[#833AB4] to-[#C13584]" },
    { icon: Bot, title: "Auto-reply", href: "/features/auto-reply", color: "from-[#E1306C] to-[#F77737]" },
    { icon: LineChart, title: "Analytics", href: "/features/analytics", color: "from-[#F77737] to-[#FCB045]" },
    { icon: Edit3, title: "Video Editor", href: "/features/video-editor", color: "from-[#833AB4] to-[#E1306C]" },
    { icon: Calendar, title: "Plánování", href: "/features/kalendar", color: "from-[#C13584] to-[#833AB4]" },
    { icon: Brain, title: "AI Brainstorming", href: "/features/ai-content", color: "from-[#F77737] to-[#E1306C]" },
  ];

  return (
    <div className={`${isDark ? "bg-[#0A0A0A]" : "bg-white"} min-h-screen font-sans`}>
      {/* Gradient background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div
          className={`absolute -top-40 -left-40 w-[800px] h-[800px] rounded-full blur-[150px] ${isDark ? "opacity-30" : "opacity-20"}`}
          style={{ background: "linear-gradient(135deg, #833AB4 0%, #E1306C 50%, #F77737 100%)" }}
        />
        <div
          className={`absolute top-1/2 -right-40 w-[600px] h-[600px] rounded-full blur-[120px] ${isDark ? "opacity-20" : "opacity-15"}`}
          style={{ background: "linear-gradient(225deg, #F77737 0%, #E1306C 100%)" }}
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
                              <div className={`font-semibold text-sm ${isDark ? "text-white" : "text-slate-900"}`}>{feature.title}</div>
                            </Link>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <Link href="/#pricing" className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${isDark ? "text-white/80 hover:text-white hover:bg-white/10" : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"}`}>
                Ceník
              </Link>
              <Link href="/#faq" className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${isDark ? "text-white/80 hover:text-white hover:bg-white/10" : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"}`}>
                FAQ
              </Link>
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
                className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:-translate-y-0.5"
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
                <Link key={f.href} href={f.href} className={`block px-4 py-3 rounded-xl ${isDark ? "text-white/80" : "text-slate-600"}`}>{f.title}</Link>
              ))}
              <Link href="/#pricing" className={`block px-4 py-3 ${isDark ? "text-white/80" : "text-slate-600"}`}>Ceník</Link>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-6 ${isDark ? "bg-white/5 border-white/10" : "bg-pink-50 border-pink-200"}`}>
              {badgeIcon}
              <span className={`text-sm font-medium ${isDark ? "text-white/80" : "text-[#E1306C]"}`}>{badge}</span>
            </div>

            <h1 className={`text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 ${isDark ? "text-white" : "text-slate-900"}`}>
              {title}
              <span className={`block bg-gradient-to-r ${titleGradient} bg-clip-text text-transparent`}>
                {titleGradient && title.includes("\n") ? title.split("\n")[1] : ""}
              </span>
            </h1>

            <p className={`text-lg sm:text-xl max-w-3xl mx-auto mb-8 ${isDark ? "text-white/60" : "text-slate-600"}`}>
              {subtitle}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl text-lg font-semibold text-white transition-all hover:-translate-y-1"
                style={{ background: `linear-gradient(135deg, #833AB4, #E1306C, #F77737)`, boxShadow: `0 12px 40px -12px ${accentPink}` }}
              >
                Vyzkoušet zdarma
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/#pricing"
                className={`inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl text-lg font-semibold border transition-all ${isDark ? "border-white/20 text-white hover:bg-white/10" : "border-slate-200 text-slate-700 hover:bg-slate-50"}`}
              >
                Zobrazit ceník
              </Link>
            </div>
          </motion.div>

          {/* Hero Screenshot */}
          {heroScreenshot && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="max-w-5xl mx-auto"
            >
              {heroScreenshot}
            </motion.div>
          )}
        </div>
      </section>

      {/* Stats Strip */}
      <section className={`py-8 px-4 border-y ${isDark ? "border-white/5 bg-black/30" : "border-slate-100 bg-slate-50"}`}>
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl font-bold bg-gradient-to-r from-[#833AB4] via-[#E1306C] to-[#F77737] bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className={`text-sm mt-1 ${isDark ? "text-white/50" : "text-slate-500"}`}>{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className={`text-3xl sm:text-4xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
              Jak to funguje
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={i}
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
                  <div
                    className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
                    style={{ background: `linear-gradient(135deg, #833AB4, #E1306C)` }}
                  >
                    {step.number}
                  </div>
                  <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br ${gradientPrimary} flex items-center justify-center mb-4 mt-4`}>
                    {step.icon}
                  </div>
                  <h3 className={`font-bold text-lg mb-2 ${isDark ? "text-white" : "text-slate-900"}`}>{step.title}</h3>
                  <p className={`text-sm ${isDark ? "text-white/60" : "text-slate-600"}`}>{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Sub-features */}
      {subFeatures.map((feature, i) => (
        <section
          key={i}
          className={`py-24 px-4 ${i % 2 === 1 ? (isDark ? "bg-black/30" : "bg-slate-50") : ""}`}
        >
          <div className="max-w-6xl mx-auto">
            <div className={`grid lg:grid-cols-2 gap-12 items-center ${feature.imagePosition === "left" ? "" : "lg:flex-row-reverse"}`}>
              <motion.div
                initial={{ opacity: 0, x: feature.imagePosition === "left" ? 30 : -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className={feature.imagePosition === "left" ? "order-2" : "order-2 lg:order-1"}
              >
                <h2 className={`text-2xl sm:text-3xl font-bold mb-4 ${isDark ? "text-white" : "text-slate-900"}`}>
                  {feature.title}
                </h2>
                <p className={`text-lg mb-6 ${isDark ? "text-white/60" : "text-slate-600"}`}>
                  {feature.description}
                </p>
                <div className="space-y-3">
                  {feature.features.map((f, j) => (
                    <div key={j} className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#833AB4] to-[#E1306C] flex items-center justify-center">
                        <Check className="w-3.5 h-3.5 text-white" />
                      </div>
                      <span className={isDark ? "text-white/80" : "text-slate-700"}>{f}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: feature.imagePosition === "left" ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className={feature.imagePosition === "left" ? "order-1" : "order-1 lg:order-2"}
              >
                <div className={`aspect-video rounded-2xl border overflow-hidden ${isDark ? "bg-[#1a1a1a]/80 border-white/10" : "bg-white border-slate-200"}`}>
                  <div className={`w-full h-full flex items-center justify-center ${isDark ? "bg-gradient-to-br from-[#833AB4]/20 to-[#E1306C]/20" : "bg-gradient-to-br from-pink-50 to-orange-50"}`}>
                    <span className={`text-sm ${isDark ? "text-white/30" : "text-slate-400"}`}>Screenshot</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      ))}

      {/* Use Cases */}
      <section className={`py-24 px-4 ${isDark ? "bg-black/30" : "bg-slate-50"}`}>
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className={`text-3xl sm:text-4xl font-bold mb-4 ${isDark ? "text-white" : "text-slate-900"}`}>
              Pro koho je to ideální
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {useCases.map((useCase, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`p-6 rounded-2xl border ${isDark ? "bg-[#1a1a1a]/50 border-white/10" : "bg-white border-slate-200"}`}
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradientPrimary} flex items-center justify-center mb-4`}>
                  {useCase.icon}
                </div>
                <h3 className={`font-bold mb-2 ${isDark ? "text-white" : "text-slate-900"}`}>{useCase.title}</h3>
                <p className={`text-sm ${isDark ? "text-white/60" : "text-slate-600"}`}>{useCase.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className={`text-3xl sm:text-4xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
              Co říkají uživatelé
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`p-6 rounded-2xl border ${isDark ? "bg-[#1a1a1a]/50 border-white/10" : "bg-white border-slate-200"}`}
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-[#FCB045] text-[#FCB045]" />
                  ))}
                </div>
                <p className={`mb-4 ${isDark ? "text-white/80" : "text-slate-700"}`}>&ldquo;{t.text}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${gradientPrimary} flex items-center justify-center text-white font-bold text-sm`}>
                    {t.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div>
                    <div className={`font-semibold text-sm ${isDark ? "text-white" : "text-slate-900"}`}>{t.name}</div>
                    <div className={`text-xs ${isDark ? "text-white/50" : "text-slate-500"}`}>{t.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <div
            className="relative p-12 rounded-3xl overflow-hidden"
            style={{ background: `linear-gradient(135deg, rgba(131, 58, 180, 0.9), rgba(225, 48, 108, 0.9), rgba(247, 119, 55, 0.9))` }}
          >
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -top-20 -right-20 w-60 h-60 bg-white/10 rounded-full blur-3xl" />
              <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-white/10 rounded-full blur-3xl" />
            </div>
            <div className="relative text-center">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">{ctaTitle}</h2>
              <p className="text-lg text-white/80 mb-8">{ctaSubtitle}</p>
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
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Related Features */}
      <section className={`py-24 px-4 ${isDark ? "bg-black/30" : "bg-slate-50"}`}>
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className={`text-2xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
              Podívej se také na
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {relatedFeatures.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Link
                  href={feature.href}
                  className={`block p-6 rounded-2xl border transition-all hover:-translate-y-1 ${isDark ? "bg-[#1a1a1a]/50 border-white/10 hover:border-[#E1306C]/50" : "bg-white border-slate-200 hover:border-[#E1306C]/50"}`}
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4`}>
                    {feature.icon}
                  </div>
                  <h3 className={`font-bold mb-2 ${isDark ? "text-white" : "text-slate-900"}`}>{feature.title}</h3>
                  <p className={`text-sm ${isDark ? "text-white/60" : "text-slate-600"}`}>{feature.description}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
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
                <li><Link href="/#pricing" className="hover:underline">Ceník</Link></li>
                <li><Link href="/#faq" className="hover:underline">FAQ</Link></li>
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
