"use client";

import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";

export default function LandingPage() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState("");

  // Refs for animations
  const navRef = useRef(null);
  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const statsRef = useRef(null);

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
    <div className="bg-black text-white font-sans overflow-visible">
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
        <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-full px-8 py-3 flex items-center justify-between w-full max-w-4xl transition-all duration-300">
          {/* LOGO */}
          <button
            onClick={() => {
              window.location.href = "/";
            }}
            className="flex items-center gap-2 text-white font-bold text-lg tracking-tight cursor-pointer font-heading"
          >
            SocialMat
          </button>

          {/* CENTER LINKS */}
          <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-white/85">
            <button
              onClick={() => scrollToSection("features")}
              className="hover:text-white transition-colors duration-200 bg-transparent border-none cursor-pointer"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection("pricing")}
              className="hover:text-white transition-colors duration-200 bg-transparent border-none cursor-pointer"
            >
              Pricing
            </button>
            <button
              onClick={() => scrollToSection("contact")}
              className="hover:text-white transition-colors duration-200 bg-transparent border-none cursor-pointer"
            >
              Contact
            </button>
          </div>

          {/* RIGHT BUTTONS */}
          <div className="flex items-center gap-3">
            <a
              href="/dashboard"
              className="text-white/80 hover:text-white text-sm font-semibold bg-transparent border-none cursor-pointer transition-colors duration-300"
            >
              Login
            </a>
            <a
              href="/signup"
              className="text-black bg-white py-2 px-6 rounded-full text-sm font-semibold transition-all duration-300 cursor-pointer hover:bg-yellow-400 hover:text-black"
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
        className="min-h-screen flex items-center justify-center relative overflow-visible py-32 bg-black text-white"
      >
        {/* GRID BACKGROUND */}
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        {/* SPOTLIGHT */}
        <div
          className="absolute -top-[5%] left-1/2 -translate-x-1/2 h-[220%] pointer-events-none"
          style={{
            width: "90vw",
            background:
              "radial-gradient(90% 240% at 50% 6%, rgba(255,255,255,0.26), rgba(255,255,255,0.13) 28%, rgba(255,255,255,0.05) 60%, rgba(255,255,255,0) 98%)",
            filter: "blur(180px)",
            opacity: 0.8,
          }}
        />

        {/* CONTENT */}
        <div className="text-center max-w-5xl mx-auto px-6 relative z-[2]">
          <h1 className="hero-title text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.9] tracking-tight mb-10 text-white opacity-0">
            Tvořte <span className="text-yellow-400">české</span> titulky{" "}
            <span className="text-yellow-400">rychle</span> a{" "}
            <span className="text-yellow-400">spolehlivě</span>
          </h1>

          <p className="hero-subtitle text-lg md:text-xl lg:text-2xl text-white/85 max-w-3xl mx-auto mb-16 leading-relaxed opacity-0">
            Stačí vložit video a během pár sekund získáte kompletní titulky
            vytvořené na základě zvuku videa.
          </p>

          <div className="hero-buttons flex flex-col sm:flex-row gap-6 justify-center opacity-0">
            <Link
              href="/dashboard"
              className="bg-transparent text-white py-4 px-10 rounded-full font-semibold text-lg border border-white/20 hover:bg-yellow-400/10 hover:border-yellow-400 transition-all duration-300 cursor-pointer"
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
            <h2 className="features-title text-4xl md:text-6xl font-bold text-white mb-8 opacity-0">
              Proč SocialMat?
            </h2>
            <p className="features-subtitle text-xl md:text-2xl text-white/75 max-w-3xl mx-auto leading-relaxed font-normal opacity-0">
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
                className="feature-card relative overflow-hidden bg-gradient-to-br from-white/5 via-white/[0.02] to-transparent p-12 transition-all duration-500 flex flex-col h-full group cursor-pointer border border-white/10 rounded-3xl opacity-0"
              >
                <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 pointer-events-none">
                  <div className="absolute inset-0 bg-gradient-to-t from-[#FAE12A]/35 via-transparent to-transparent md:hidden" />
                  <div
                    className="absolute inset-0 hidden md:block"
                    style={{
                      background:
                        index % 2 === 0
                          ? "linear-gradient(to top right, rgba(255, 198, 42, 0.36), rgba(250, 206, 49, 0.04) 65%)"
                          : "linear-gradient(to top left, rgba(255, 198, 42, 0.46), rgba(250, 207, 49, 0.04) 65%)",
                    }}
                  />
                </div>
                <div className="absolute -left-10 -top-10 w-40 h-40 bg-white/5 rounded-full blur-3xl opacity-0 group-hover:opacity-80 transition-opacity duration-500" />

                <div className="relative z-[2]">
                  <h3 className="text-3xl font-bold mb-4 text-white tracking-tight leading-tight">
                    {feature.title}
                  </h3>
                  <div className="mt-6 flex items-center gap-3 text-white/60 text-sm">
                    <div className="h-px w-10 bg-gradient-to-r from-white/30 to-white/0" />
                  </div>
                  <p className="text-white/75 leading-relaxed text-lg font-normal mt-4">
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
        className="py-32 px-6 bg-black text-white relative"
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="stats-heading text-4xl md:text-6xl font-bold text-white mb-8 opacity-0">
              Věříme v transparentnost
            </h2>
            <p className="stats-subtitle text-white/70 text-lg max-w-2xl mx-auto opacity-0">
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
                <div className="text-4xl md:text-6xl font-bold text-white mb-4 transition-colors duration-300 hover:text-yellow-400">
                  <CountUp
                    value={stat.value}
                    suffix={stat.suffix}
                    decimals={stat.decimals}
                  />
                </div>
                <div className="text-white/60 text-sm tracking-wide font-thin">
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
        className="py-28 px-6 bg-gradient-to-b from-black via-[#1f1f1f] to-black text-white"
      >
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight">
              Vyberte plán, který sedí
            </h2>
            <p className="text-white/70 text-lg max-w-2xl mx-auto">
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
                className={`relative rounded-3xl border p-8 flex flex-col gap-6 bg-white/5 ${
                  plan.highlight
                    ? "border-yellow-400/60 shadow-[0_18px_60px_rgba(250,225,42,0.25)]"
                    : "border-white/10"
                }`}
              >
                {plan.highlight && (
                  <span className="absolute -top-3 left-6 px-3 py-1 rounded-full bg-yellow-400 text-black text-xs font-semibold shadow-md">
                    Nejpopulárnější
                  </span>
                )}
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold tracking-tight">
                    {plan.name}
                  </h3>
                  <p className="text-white/70 text-sm">{plan.desc}</p>
                </div>
                <div className="text-3xl font-bold text-white">
                  {plan.price}
                </div>
                <ul className="space-y-3 text-sm text-white/80 flex-1">
                  {plan.perks.map((perk) => (
                    <li
                      key={perk}
                      className="flex items-start gap-3 leading-relaxed"
                    >
                      <span className="mt-1 h-2 w-2 rounded-full bg-yellow-400/80" />
                      <span>{perk}</span>
                    </li>
                  ))}
                </ul>
                <div className="pt-2">
                  <button
                    className={`w-full h-12 rounded-full font-semibold text-sm transition-all duration-500 ease-out ${
                      plan.highlight
                        ? "bg-gradient-to-r from-yellow-300 to-amber-400 text-black hover:from-yellow-300 hover:to-amber-300 shadow-lg shadow-yellow-500/20"
                        : "bg-transparent text-white border border-white/20 hover:bg-yellow-400/10 hover:border-yellow-400"
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
