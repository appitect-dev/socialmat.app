"use client";

import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function LandingPage() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState("");

  // Refs for animations
  const navRef = useRef(null);
  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const statsRef = useRef(null);
  const ctaRef = useRef(null);

  useEffect(() => {
    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);

    // Navigation animation (immediate) - show navbar immediately for debugging
    if (navRef.current) {
      gsap.set(navRef.current, { opacity: 1 }); // Make it visible immediately
      gsap.fromTo(
        navRef.current,
        { y: -20 },
        { y: 0, duration: 0.8, ease: "power2.out", delay: 0.1 }
      );
    }

    // Hero section animations
    const heroTl = gsap.timeline({
      scrollTrigger: {
        trigger: heroRef.current,
        start: "top 80%",
        once: true,
      },
    });

    heroTl
      .fromTo(
        ".hero-badge",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
      )
      .fromTo(
        ".hero-title",
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" },
        "-=0.4"
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
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out", stagger: 0.1 },
        "-=0.3"
      )
      .fromTo(
        ".hero-demo",
        { opacity: 0, scale: 0.95, y: 20 },
        { opacity: 1, scale: 1, y: 0, duration: 0.8, ease: "power2.out" },
        "-=0.5"
      );

    // Features section animations
    const featuresTl = gsap.timeline({
      scrollTrigger: {
        trigger: featuresRef.current,
        start: "top 80%",
        once: true,
      },
    });

    featuresTl
      .fromTo(
        ".features-badge",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
      )
      .fromTo(
        ".features-title",
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" },
        "-=0.4"
      )
      .fromTo(
        ".features-subtitle",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
        "-=0.4"
      )
      .fromTo(
        ".features-grid",
        { opacity: 0, scale: 0.95, y: 20 },
        { opacity: 1, scale: 1, y: 0, duration: 0.8, ease: "power2.out" },
        "-=0.3"
      )
      .fromTo(
        ".feature-card",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out", stagger: 0.1 },
        "-=0.4"
      );

    // Stats section animations
    const statsTl = gsap.timeline({
      scrollTrigger: {
        trigger: statsRef.current,
        start: "top 80%",
        once: true,
      },
    });

    statsTl
      .fromTo(
        ".stats-title",
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

    // CTA section animations
    const ctaTl = gsap.timeline({
      scrollTrigger: {
        trigger: ctaRef.current,
        start: "top 80%",
        once: true,
      },
    });

    ctaTl
      .fromTo(
        ".cta-badge",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
      )
      .fromTo(
        ".cta-title",
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" },
        "-=0.4"
      )
      .fromTo(
        ".cta-subtitle",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
        "-=0.4"
      )
      .fromTo(
        ".cta-form",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
        "-=0.3"
      )
      .fromTo(
        ".trust-badge",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power2.out", stagger: 0.1 },
        "-=0.2"
      );

    // Cleanup function
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email || !email.includes("@")) {
      setSubmitStatus("invalid");
      setTimeout(() => setSubmitStatus(""), 2000);
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus("loading");

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1200));

      setSubmitStatus("success");
      setEmail("");

      setTimeout(() => {
        setSubmitStatus("");
        setIsSubmitting(false);
      }, 3000);
    } catch {
      setSubmitStatus("error");
      setTimeout(() => setSubmitStatus(""), 2000);
    }
  };

  const getButtonText = () => {
    switch (submitStatus) {
      case "loading":
        return "Joining...";
      case "success":
        return "Welcome! 🎉";
      case "invalid":
        return "Invalid email";
      case "error":
        return "Try again";
      default:
        return "Join Beta";
    }
  };

  const getButtonStyles = () => {
    const baseStyles =
      "py-5 px-8 rounded-2xl font-bold text-sm cursor-pointer transition-all duration-300 uppercase tracking-wider border-none";

    switch (submitStatus) {
      case "success":
        return `${baseStyles} bg-emerald-500 text-white`;
      case "invalid":
      case "error":
        return `${baseStyles} bg-red-500 text-white`;
      default:
        return `${baseStyles} bg-black text-white hover:bg-gray-800 hover:-translate-y-0.5 hover:shadow-lg`;
    }
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
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
      {/* Navigation with GSAP animations */}
      <nav
        ref={navRef}
        className="
    fixed top-6 inset-x-0
    z-50 
    flex justify-center
    px-4
    opacity-0
  "
      >
        <div
          className="
      bg-black/40 backdrop-blur-xl 
      border border-white/10 
      rounded-full
      px-8 py-3
      flex items-center justify-between
      w-full max-w-4xl
      transition-all duration-300
    "
        >
          {/* LOGO LEFT */}
          <div
            className="flex items-center gap-2 text-white font-bold text-lg tracking-tight cursor-pointer"
            style={{
              fontFamily:
                "var(--font-clash), var(--font-archivo), Arial, Helvetica, sans-serif",
            }}
          >
            SocialMat
          </div>

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
            {/* Login button */}
            <a
              href="/dashboard"
              className="
        text-white/80 hover:text-white 
        text-sm font-semibold
        bg-transparent border-none cursor-pointer
        transition-colors duration-300
      "
            >
              Login
            </a>

            {/* Get Started */}
            <button
              onClick={() => scrollToSection("waitlist")}
              className="
        text-black
        bg-white
        py-2 px-6 
        rounded-full 
        text-sm font-semibold 
        transition-all duration-300 
        hover:scale-105 hover:shadow-[0_12px_28px_rgba(98,52,255,0.3)] cursor-pointer
      "
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>
      {/* Hero Section with GSAP scroll animations */}
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

        {/* SPOTLIGHT — simple editable column */}
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
          {/* TITLE */}
          <h1 className="hero-title text-5xl md:text-7xl lg:text-8xl font-heading font-bold leading-[0.9] tracking-tight mb-10 text-white opacity-0">
            Tvořte české titulky{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500">
              rychle a spolehlivě
            </span>
          </h1>

          {/* SUBTITLE */}
          <p className="hero-subtitle text-lg md:text-xl lg:text-2xl text-white/85 font-normal max-w-3xl mx-auto mb-16 leading-relaxed opacity-0">
            Stačí vložit video a během pár sekund získáte kompletní titulky
            vytvořené na základě zvuku videa.
          </p>

          {/* CTA BUTTONS */}
          <div className="hero-buttons flex flex-col sm:flex-row gap-6 justify-center opacity-0">
            <button
              onClick={() => scrollToSection("waitlist")}
              className="bg-white text-black py-4 px-10 rounded-full font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-[0_14px_34px_rgba(98,52,255,0.3)] cursor-pointer"
            >
              Získat early access
            </button>

            <button
              onClick={() => scrollToSection("demo")}
              className="bg-transparent text-white py-4 px-10 rounded-full font-semibold text-lg border border-white/20 hover:bg-white/10 transition-all duration-300 cursor-pointer"
            >
              Zobrazit demo
            </button>
          </div>
        </div>
      </section>
      {/* Features Section with GSAP scroll animations */}
      <section
        ref={featuresRef}
        id="features"
        className="py-48 relative overflow-visible"
      >
        {/* Subtle background */}
        <div className="absolute inset-0 opacity-20" style={{}} />

        <div className="max-w-7xl mx-auto px-10 relative z-[2]">
          {/* Features header */}
          <div className="text-center mb-32">
            <div className="features-badge inline-block bg-white/10 text-white py-2 px-5 rounded-full text-xs font-semibold uppercase tracking-wider border border-white/10 mb-8 transition-all duration-300 hover:bg-white/15 hover:shadow-sm opacity-0">
              Features
            </div>
            <h2 className="features-title text-5xl md:text-7xl font-extrabold tracking-tight mb-8 text-white leading-tight opacity-0">
              Proč SocialMat?
            </h2>
            <p className="features-subtitle text-xl md:text-2xl text-white/75 max-w-3xl mx-auto leading-relaxed font-normal opacity-0">
              První AI systém navržený specificky pro český jazyk a potřeby
              lokálních content creatorů
            </p>
          </div>

          {/* Features grid */}
          <div className="features-grid grid grid-cols-1 md:grid-cols-2 gap-0.5  rounded-3xl2 shadow-xl opacity-0">
            {[
              {
                icon: "🇨🇿",
                title: "Czech-First AI",
                description:
                  "Trénovaná výhradně na českém obsahu. Rozpozná slang, rychlou řeč i regionální přízvuky s 98.7% přesností.",
              },
              {
                icon: "⚡",
                title: "30s Processing",
                description:
                  "Průměrný čas zpracování 30 sekund. Zatímco ostatní služby běží minuty, vy už uploadujete na TikTok.",
              },
              {
                icon: "🎨",
                title: "Viral Templates",
                description:
                  "Styly inspirované nejvíce sledovanými účty. Nebo si vytvořte vlastní brand identity.",
              },
              {
                icon: "📊",
                title: "Performance Analytics",
                description:
                  "Sledujte které styly titulků generují nejvíce views a optimalizujte obsah na základě dat.",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="feature-card bg-[#0f0f14] p-16 transition-all duration-400 relative flex flex-col h-full hover:shadow-lg group cursor-pointer opacity-0 border border-white/5"
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-8px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0px)";
                }}
              >
                {/* Subtle hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/2 to-blue-500/2 opacity-0 transition-opacity duration-400 group-hover:opacity-100" />

                <div className="relative z-[2]">
                  {/* Clean icon */}
                  <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-3xl mb-8 border border-white/10 transition-all duration-300 group-hover:bg-white/10 group-hover:scale-105">
                    {feature.icon}
                  </div>

                  {/* Clean title */}
                  <h3 className="text-3xl font-bold mb-5 text-white tracking-tight">
                    {feature.title}
                  </h3>

                  {/* Clean description */}
                  <p className="text-white/75 leading-relaxed text-lg font-normal">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Stats Section with GSAP scroll animations */}
      <section
        ref={statsRef}
        className="py-32 px-6 bg-black text-white relative "
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="stats-title text-4xl md:text-6xl font-bold text-white mb-8 opacity-0">
              Věříme v transparentnost
            </h2>
            <p className="stats-subtitle text-white/70 text-lg max-w-2xl mx-auto opacity-0">
              Naše čísla hovoří za nás
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            {[
              { number: "98.7%", label: "Přesnost českého AI" },
              { number: "30s", label: "Průměrná doba zpracování" },
              { number: "10,000+", label: "Vytvořených titulků denně" },
              { number: "2.3x", label: "Růst engagement" },
            ].map((stat, index) => (
              <div key={index} className="stat-item text-center opacity-0">
                <div className="text-4xl md:text-6xl font-bold text-white mb-4 transition-colors duration-300 hover:text-blue-400">
                  {stat.number}
                </div>
                <div className="text-white/60 text-sm uppercase tracking-wider">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* CTA Section with GSAP scroll animations */}
      <section
        ref={ctaRef}
        className="cta bg-black text-white py-40 relative "
        id="waitlist"
      >
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-orange-500/3 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/2 to-transparent"></div>
        </div>

        <div className="container max-w-7xl mx-auto px-10 relative z-10 text-white">
          <div className="cta-content text-center">
            <div className="cta-badge inline-flex items-center gap-2 bg-white/10 border border-white/15 px-5 py-2 rounded-full text-xs font-semibold text-white mb-8 uppercase tracking-wider transition-all duration-300 hover:shadow-md cursor-pointer opacity-0">
              <div className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-pulse"></div>
              Limited Beta Access
            </div>

            <h2 className="cta-title text-4xl md:text-6xl font-extrabold leading-tight tracking-tight mb-8 text-white opacity-0">
              Připojte se k beta programu
            </h2>

            <p className="cta-subtitle text-xl text-white/75 mb-16 max-w-3xl mx-auto leading-relaxed font-normal opacity-0">
              Získejte early access a 3 měsíce premium funkcí zdarma. Pouze pro
              prvních 1,000 uživatelů.
            </p>

            <form
              onSubmit={handleSubmit}
              className="cta-form max-w-2xl mx-auto mb-12 relative opacity-0"
            >
              <div className="flex gap-2 bg-[#0f0f14] border-2 border-white/10 rounded-2xl p-2 transition-all duration-300 shadow-lg focus-within:border-white focus-within:shadow-xl">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 bg-transparent border-none py-5 px-6 text-base text-white outline-none font-medium placeholder-white/50"
                  placeholder="vas@email.cz"
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`${getButtonStyles()} transition-all duration-300`}
                >
                  {getButtonText()}
                </button>
              </div>
            </form>

            <div className="trust-badges flex justify-center gap-12 flex-wrap">
              {[
                "3 měsíce zdarma",
                "Bez platebních údajů",
                "Zrušit kdykoliv",
              ].map((text, index) => (
                <div
                  key={index}
                  className="trust-badge trust-item flex items-center gap-3 text-white/75 text-sm font-medium transition-colors duration-300 hover:text-white opacity-0"
                >
                  <div className="trust-icon w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    ✓
                  </div>
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
