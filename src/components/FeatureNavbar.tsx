"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Moon, 
  Sun, 
  ChevronDown, 
  Video, 
  Edit3, 
  BarChart3, 
  Image, 
  Calendar, 
  Brain, 
  MessageSquare 
} from "lucide-react";

interface FeatureNavbarProps {
  isDark: boolean;
  onThemeToggle: () => void;
}

export function FeatureNavbar({ isDark, onThemeToggle }: FeatureNavbarProps) {
  const [featuresDropdownOpen, setFeaturesDropdownOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    window.location.href = `/#${sectionId}`;
  };

  const palette = {
    navContainer: isDark
      ? "bg-black/60 backdrop-blur-2xl border border-white/10 shadow-2xl shadow-black/50"
      : "bg-white/90 backdrop-blur-2xl border border-slate-200/80 shadow-xl shadow-slate-900/5",
    navLinks: isDark
      ? "text-white/85 hover:text-white"
      : "text-slate-600 hover:text-slate-900",
    navLogin: isDark
      ? "text-white/80 hover:text-white"
      : "text-slate-700 hover:text-slate-900",
  };

  return (
    <nav className="fixed top-6 inset-x-0 z-50 flex justify-center px-4">
      <div
        className={`${palette.navContainer} rounded-full px-8 py-3 flex items-center justify-between w-full max-w-4xl transition-all duration-300`}
      >
        {/* LOGO */}
        <Link
          href="/"
          className={`flex items-center gap-2 font-bold text-lg tracking-tight cursor-pointer ${
            isDark ? "text-white" : "text-slate-900"
          }`}
        >
          SocialMat
        </Link>

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
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-200 ${
                  featuresDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            {featuresDropdownOpen && (
              <div
                className={`absolute top-full left-1/2 -translate-x-1/2 mt-2 w-56 rounded-xl shadow-2xl border overflow-hidden z-50 ${
                  isDark
                    ? "bg-black/95 backdrop-blur-xl border-white/10"
                    : "bg-white/95 backdrop-blur-xl border-slate-200"
                }`}
              >
                <div className="py-2">
                  <a
                    href="/features/titulky"
                    className={`flex items-center gap-3 px-4 py-3 transition-colors ${
                      isDark
                        ? "hover:bg-white/10 text-white/85"
                        : "hover:bg-slate-100 text-slate-700"
                    }`}
                  >
                    <Video className="w-5 h-5" />
                    <div>
                      <div className="font-semibold text-sm">AI Titulky</div>
                      <div
                        className={`text-xs ${
                          isDark ? "text-white/60" : "text-slate-500"
                        }`}
                      >
                        Automatické titulky
                      </div>
                    </div>
                  </a>
                  <a
                    href="/features/video-editor"
                    className={`flex items-center gap-3 px-4 py-3 transition-colors ${
                      isDark
                        ? "hover:bg-white/10 text-white/85"
                        : "hover:bg-slate-100 text-slate-700"
                    }`}
                  >
                    <Edit3 className="w-5 h-5" />
                    <div>
                      <div className="font-semibold text-sm">Video Editor</div>
                      <div
                        className={`text-xs ${
                          isDark ? "text-white/60" : "text-slate-500"
                        }`}
                      >
                        Úprava videí
                      </div>
                    </div>
                  </a>
                  <a
                    href="/features/analytics"
                    className={`flex items-center gap-3 px-4 py-3 transition-colors ${
                      isDark
                        ? "hover:bg-white/10 text-white/85"
                        : "hover:bg-slate-100 text-slate-700"
                    }`}
                  >
                    <BarChart3 className="w-5 h-5" />
                    <div>
                      <div className="font-semibold text-sm">Analýzy profilu</div>
                      <div
                        className={`text-xs ${
                          isDark ? "text-white/60" : "text-slate-500"
                        }`}
                      >
                        Metriky & statistiky
                      </div>
                    </div>
                  </a>
                  <a
                    href="/features/stories"
                    className={`flex items-center gap-3 px-4 py-3 transition-colors ${
                      isDark
                        ? "hover:bg-white/10 text-white/85"
                        : "hover:bg-slate-100 text-slate-700"
                    }`}
                  >
                    <Image className="w-5 h-5" />
                    <div>
                      <div className="font-semibold text-sm">Stories Editor</div>
                      <div
                        className={`text-xs ${
                          isDark ? "text-white/60" : "text-slate-500"
                        }`}
                      >
                        Tvorba Stories
                      </div>
                    </div>
                  </a>
                  <a
                    href="/features/kalendar"
                    className={`flex items-center gap-3 px-4 py-3 transition-colors ${
                      isDark
                        ? "hover:bg-white/10 text-white/85"
                        : "hover:bg-slate-100 text-slate-700"
                    }`}
                  >
                    <Calendar className="w-5 h-5" />
                    <div>
                      <div className="font-semibold text-sm">Kalendář</div>
                      <div
                        className={`text-xs ${
                          isDark ? "text-white/60" : "text-slate-500"
                        }`}
                      >
                        Plánování obsahu
                      </div>
                    </div>
                  </a>
                  <a
                    href="/features/ai-content"
                    className={`flex items-center gap-3 px-4 py-3 transition-colors ${
                      isDark
                        ? "hover:bg-white/10 text-white/85"
                        : "hover:bg-slate-100 text-slate-700"
                    }`}
                  >
                    <Brain className="w-5 h-5" />
                    <div>
                      <div className="font-semibold text-sm">AI Content</div>
                      <div
                        className={`text-xs ${
                          isDark ? "text-white/60" : "text-slate-500"
                        }`}
                      >
                        Generování obsahu
                      </div>
                    </div>
                  </a>
                  <a
                    href="/features/auto-reply"
                    className={`flex items-center gap-3 px-4 py-3 transition-colors ${
                      isDark
                        ? "hover:bg-white/10 text-white/85"
                        : "hover:bg-slate-100 text-slate-700"
                    }`}
                  >
                    <MessageSquare className="w-5 h-5" />
                    <div>
                      <div className="font-semibold text-sm">Auto Reply</div>
                      <div
                        className={`text-xs ${
                          isDark ? "text-white/60" : "text-slate-500"
                        }`}
                      >
                        Automatické odpovědi
                      </div>
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
            onClick={onThemeToggle}
            className={`relative h-9 w-16 rounded-full border transition-colors duration-300 ${
              isDark
                ? "bg-white/5 border-white/10"
                : "bg-white border-gray-200 shadow-[0_1px_4px_rgba(0,0,0,0.08)]"
            }`}
            aria-pressed={isDark}
          >
            <span className="sr-only">Přepnout vzhled</span>
            <Moon
              className={`absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 transition-opacity duration-300 ${
                isDark ? "opacity-100 text-amber-200" : "opacity-60 text-slate-500"
              }`}
            />
            <Sun
              className={`absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 transition-opacity duration-300 ${
                isDark ? "opacity-0" : "opacity-100 text-amber-500"
              }`}
            />
            <span
              className={`absolute top-[3px] left-1 h-7 w-7 rounded-full shadow transition-transform duration-300 ${
                isDark
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
  );
}
