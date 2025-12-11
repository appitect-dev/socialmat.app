"use client";

import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";

export default function LandingPage() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState("");
  const [theme, setTheme] = useState<"light" | "dark" | null>(null);

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
      ? "bg-black/40 backdrop-blur-xl border border-white/10"
      : "bg-white/80 backdrop-blur-xl border border-black/10 shadow-lg",
    navLinks: isDark
      ? "text-white/85 hover:text-white"
      : "text-slate-600 hover:text-slate-900",
    navLogin: isDark
      ? "text-white/80 hover:text-white"
      : "text-slate-700 hover:text-slate-900",
    heroTitle: isDark ? "text-white" : "text-slate-900",
    heroSubtitle: isDark ? "text-white/85" : "text-slate-600",
    featureCard: isDark
      ? "bg-gradient-to-br from-white/5 via-white/[0.02] to-transparent border border-white/10"
      : "bg-gradient-to-br from-slate-50 via-white to-slate-100 border border-slate-200 shadow-md",
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

  const gridLineColor = isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)";
  const spotlightGradient = isDark
    ? "radial-gradient(90% 240% at 50% 6%, rgba(255,255,255,0.26), rgba(255,255,255,0.13) 28%, rgba(255,255,255,0.05) 60%, rgba(255,255,255,0) 98%)"
    : "radial-gradient(90% 240% at 50% 6%, rgba(79,70,229,0.25), rgba(59,130,246,0.12) 32%, rgba(255,255,255,0.65) 55%, rgba(255,255,255,0) 98%)";

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
            className={`flex items-center gap-2 font-bold text-lg tracking-tight cursor-pointer font-heading ${
              isDark ? "text-white" : "text-slate-900"
            }`}
          >
            SocialMat
          </button>

          {/* CENTER LINKS */}
          <div className="hidden md:flex items-center gap-8 text-sm font-semibold">
            <button
              onClick={() => scrollToSection("features")}
              className={`${palette.navLinks} transition-colors duration-200 bg-transparent border-none cursor-pointer`}
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection("pricing")}
              className={`${palette.navLinks} transition-colors duration-200 bg-transparent border-none cursor-pointer`}
            >
              Pricing
            </button>
            <button
              onClick={() => scrollToSection("contact")}
              className={`${palette.navLinks} transition-colors duration-200 bg-transparent border-none cursor-pointer`}
            >
              Contact
            </button>
          </div>

          {/* RIGHT BUTTONS */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setTheme(isDark ? "light" : "dark")}
              className={`relative h-9 w-16 rounded-full border transition-all duration-300 ${
                isDark
                  ? "bg-slate-900/80 border-white/10 shadow-inner shadow-white/5"
                  : "bg-white border-slate-200 shadow-sm"
              }`}
              aria-pressed={isDark}
            >
              <span className="sr-only">Přepnout vzhled</span>
              <span
                className={`absolute top-1 left-1 h-7 w-7 rounded-full transition-all duration-300 ${
                  isDark
                    ? "translate-x-6 bg-gradient-to-r from-indigo-500 to-blue-500 shadow-lg shadow-indigo-500/25"
                    : "translate-x-0 bg-slate-200 shadow"
                }`}
              />
            </button>
            <a
              href="/dashboard"
              className={`${palette.navLogin} text-sm font-semibold bg-transparent border-none cursor-pointer transition-colors duration-300`}
            >
              Login
            </a>
            <a
              href="/signup"
              className="text-white bg-gradient-to-r from-indigo-600 to-blue-500 py-2 px-6 rounded-full text-sm font-semibold transition-all duration-300 cursor-pointer shadow-md shadow-indigo-500/20 hover:from-indigo-500 hover:to-sky-500 hover:shadow-indigo-500/35"
            >
              Get Started
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        ref={heroRef}
        id="hero"
        className={`min-h-screen flex items-center justify-center relative overflow-visible py-32 ${palette.page}`}
      >
        {/* GRID BACKGROUND */}
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              `linear-gradient(${gridLineColor} 1px, transparent 1px), linear-gradient(90deg, ${gridLineColor} 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
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
          <h1
            className={`hero-title text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.9] tracking-tight mb-10 opacity-0 ${palette.heroTitle}`}
          >
            Tvořte{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500">
              české
            </span>{" "}
            titulky{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500">
              rychle
            </span>{" "}
            a{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500">
              spolehlivě
            </span>
          </h1>

          <p
            className={`hero-subtitle text-lg md:text-xl lg:text-2xl max-w-3xl mx-auto mb-16 leading-relaxed opacity-0 ${palette.heroSubtitle}`}
          >
            Stačí vložit video a během pár sekund získáte kompletní titulky
            vytvořené na základě zvuku videa.
          </p>

          <div className="hero-buttons flex flex-col sm:flex-row gap-6 justify-center opacity-0">
            <Link
              href="/dashboard"
              className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white py-4 px-10 rounded-full font-semibold text-lg border border-transparent hover:from-indigo-500 hover:to-sky-500 shadow-lg shadow-indigo-500/25 transition-all duration-300 cursor-pointer"
            >
              Zobrazit demo
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        ref={featuresRef}
        id="features"
        className="py-48 relative overflow-visible"
      >
        <div className="max-w-7xl mx-auto px-10 relative z-[2]">
          <div className="text-center mb-32">
            <h2
              className={`features-title text-4xl md:text-6xl font-bold mb-8 opacity-0 ${
                isDark ? "text-white" : "text-slate-900"
              }`}
            >
              Proč SocialMat?
            </h2>
            <p
              className={`features-subtitle text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed font-normal opacity-0 ${
                isDark ? "text-white/75" : "text-slate-600"
              }`}
            >
              ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
              tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
              minim veniam, quis nostrud exercitation ullamco laboris nisi ut
              aliquip ex ea commodo consequat.
            </p>
          </div>

          <div className="features-grid grid grid-cols-1 md:grid-cols-2 gap-0.5 rounded-3xl shadow-xl opacity-0">
            {[
              {
                title: "Czech-First AI",
                description:
                  "lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
              },
              {
                title: "30s Processing",
                description:
                  "lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
              },
              {
                title: "Viral Templates",
                description:
                  "lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
              },
              {
                title: "Performance Analytics",
                description:
                  "lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className={`feature-card relative overflow-hidden ${palette.featureCard} p-12 transition-all duration-500 flex flex-col h-full group cursor-pointer rounded-3xl opacity-0`}
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
                  className={`absolute -left-10 -top-10 w-40 h-40 rounded-full blur-3xl opacity-0 group-hover:opacity-80 transition-opacity duration-500 ${
                    isDark ? "bg-white/5" : "bg-indigo-200/30"
                  }`}
                />

                <div className="relative z-[2]">
                  <h3
                    className={`text-3xl font-bold mb-4 tracking-tight leading-tight ${
                      isDark ? "text-white" : "text-slate-900"
                    }`}
                  >
                    {feature.title}
                  </h3>
                  <div
                    className={`mt-6 flex items-center gap-3 text-sm ${
                      isDark ? "text-white/60" : "text-slate-500"
                    }`}
                  >
                    <div
                      className={`h-px w-10 bg-gradient-to-r ${
                        isDark
                          ? "from-white/30 to-white/0"
                          : "from-indigo-500/40 to-indigo-500/0"
                      }`}
                    />
                  </div>
                  <p
                    className={`leading-relaxed text-lg font-normal mt-4 ${
                      isDark ? "text-white/75" : "text-slate-600"
                    }`}
                  >
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section
        ref={statsRef}
        className={`py-32 px-6 relative ${palette.statsSection}`}
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-24">
            <h2
              className={`stats-heading text-4xl md:text-6xl font-bold mb-8 opacity-0 ${
                isDark ? "text-white" : "text-slate-900"
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            {[
              {
                value: 98.7,
                suffix: "%",
                label: "Přesnost českého AI",
                decimals: 1,
              },
              {
                value: 30,
                suffix: "s",
                label: "Průměrná doba zpracování",
                decimals: 0,
              },
              {
                value: 10000,
                suffix: "+",
                label: "Vytvořených titulků denně",
                decimals: 0,
              },
              {
                value: 2.3,
                suffix: "x",
                label: "Růst engagement",
                decimals: 1,
              },
            ].map((stat, index) => (
              <div key={index} className="stat-item text-center opacity-0">
                <div
                  className={`text-4xl md:text-6xl font-bold mb-4 transition-colors duration-300 ${palette.statHover} ${
                    isDark ? "text-white" : "text-slate-900"
                  }`}
                >
                  <CountUp
                    value={stat.value}
                    suffix={stat.suffix}
                    decimals={stat.decimals}
                  />
                </div>
                <div
                  className={`text-sm tracking-wide font-thin ${
                    isDark ? "text-white/60" : "text-slate-500"
                  }`}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section
        id="pricing"
        className={`py-28 px-6 ${palette.pricingSection}`}
      >
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h2
              className={`text-4xl md:text-6xl font-bold tracking-tight ${
                isDark ? "text-white" : "text-slate-900"
              }`}
            >
              Vyberte plán, který sedí
            </h2>
            <p
              className={`text-lg max-w-2xl mx-auto ${
                isDark ? "text-white/70" : "text-slate-600"
              }`}
            >
              Transparentní ceny bez skrytých poplatků. Nahrajte video a plaťte
              jen za to, co opravdu používáte.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                name: "Starter",
                price: "Zdarma",
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
                price: "€10 / měsíc",
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
            ].map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-3xl p-8 flex flex-col gap-6 ${
                  plan.highlight
                    ? palette.pricingHighlightBorder
                    : palette.pricingBorder
                } ${isDark ? "bg-white/5" : "bg-white"}`}
              >
                {plan.highlight && (
                  <span className="absolute -top-3 left-6 px-3 py-1 rounded-full bg-gradient-to-r from-indigo-600 to-blue-500 text-white text-xs font-semibold shadow-md">
                    Nejpopulárnější
                  </span>
                )}
                <div className="space-y-2">
                  <h3
                    className={`text-2xl font-bold tracking-tight ${
                      isDark ? "text-white" : "text-slate-900"
                    }`}
                  >
                    {plan.name}
                  </h3>
                  <p
                    className={`text-sm ${
                      isDark ? "text-white/70" : "text-slate-600"
                    }`}
                  >
                    {plan.desc}
                  </p>
                </div>
                <div
                  className={`text-3xl font-bold ${
                    isDark ? "text-white" : "text-slate-900"
                  }`}
                >
                  {plan.price}
                </div>
                <ul
                  className={`space-y-3 text-sm flex-1 ${
                    isDark ? "text-white/80" : "text-slate-700"
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
                    className={`w-full h-12 rounded-full font-semibold text-sm transition-all duration-500 ease-out ${
                      plan.highlight
                        ? "bg-gradient-to-r from-indigo-600 to-blue-500 text-white hover:from-indigo-500 hover:to-sky-500 shadow-lg shadow-indigo-500/25"
                        : `bg-transparent text-white border hover:bg-indigo-500/10 hover:border-indigo-500 ${
                            isDark
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
    </div>
  );
}
