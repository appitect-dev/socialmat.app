"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useDashboardTheme } from "@/components/dashboard-theme";
import {
  User,
  Mail,
  Lock,
  Bell,
  Instagram,
  Palette,
  Globe,
  Trash2,
  Save,
  Check,
  Shield,
  CreditCard,
  Zap,
  FileText,
  Download,
} from "lucide-react";

export default function SettingsPage() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const { palette, isDark } = useDashboardTheme();
  const [activeTab, setActiveTab] = useState(tabParam || "profile");
  const [saved, setSaved] = useState(false);

  // Update active tab when URL parameter changes
  useEffect(() => {
    if (tabParam) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  // Mock user data
  const [profileData, setProfileData] = useState({
    name: "Adam Bardžák",
    email: "adam@socialmat.app",
    username: "@socialmater",
    bio: "Content creator & marketer",
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    weeklyReport: true,
    newFeatures: false,
    aiSuggestions: true,
    commentReplies: true,
    dmMessages: true,
  });

  const [aiSettings, setAiSettings] = useState({
    autoReply: false,
    autoReplyTone: "professional",
    captionStyle: "engaging",
    language: "cs",
    autoTranslate: false,
  });

  const [brandingSettings, setBrandingSettings] = useState({
    primaryColor: "#6366f1",
    secondaryColor: "#3b82f6",
    fontFamily: "Inter",
    logoUrl: "",
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  // Get tab title based on active tab
  const getTabTitle = () => {
    const titles: Record<string, string> = {
      profile: "Profil",
      instagram: "Instagram",
      notifications: "Notifikace",
      ai: "AI Nastavení",
      branding: "Branding",
      billing: "Fakturace",
      security: "Zabezpečení",
    };
    return titles[activeTab] || "Nastavení";
  };

  return (
    <div
      className={`relative min-h-screen ${
        isDark ? "bg-black text-white" : palette.page
      }`}
    >
      {!isDark && (
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(99,102,241,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.35) 1px, transparent 1px)",
            backgroundSize: "120px 120px",
          }}
        />
      )}

      <div className="max-w-5xl mx-auto px-4 py-10 relative">
        {/* Header */}
        <div className="mb-10">
          <h1
            className={`text-4xl font-bold mb-2 ${
              isDark ? "text-white" : "text-slate-900"
            }`}
          >
            {getTabTitle()}
          </h1>
          <p className={isDark ? "text-white/60" : "text-slate-600"}>
            Přizpůsob si SocialMat podle svých potřeb
          </p>
        </div>

        {/* Main Content */}
        <div
          className={`rounded-2xl border p-8 ${
            isDark ? "bg-white/5 border-white/10" : "bg-white border-slate-200"
          }`}
        >
          {/* Profile Tab */}
          {activeTab === "profile" && (
                <div className="space-y-6">
                  <div>
                    <h2 className={`text-2xl font-bold mb-6 ${isDark ? "text-white" : "text-slate-900"}`}>
                      Osobní údaje
                    </h2>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className={`block text-sm font-semibold mb-2 ${isDark ? "text-white/80" : "text-slate-700"}`}>
                        Jméno
                      </label>
                      <input
                        type="text"
                        value={profileData.name}
                        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                        className={`w-full px-4 py-3 rounded-xl border transition-all ${
                          isDark
                            ? "bg-white/5 border-white/10 text-white focus:border-white/30"
                            : "bg-white border-slate-200 text-slate-900 focus:border-indigo-400"
                        } focus:outline-none`}
                      />
                    </div>

                    <div>
                      <label className={`block text-sm font-semibold mb-2 ${isDark ? "text-white/80" : "text-slate-700"}`}>
                        Email
                      </label>
                      <input
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                        className={`w-full px-4 py-3 rounded-xl border transition-all ${
                          isDark
                            ? "bg-white/5 border-white/10 text-white focus:border-white/30"
                            : "bg-white border-slate-200 text-slate-900 focus:border-indigo-400"
                        } focus:outline-none`}
                      />
                    </div>

                    <div>
                      <label className={`block text-sm font-semibold mb-2 ${isDark ? "text-white/80" : "text-slate-700"}`}>
                        Username
                      </label>
                      <input
                        type="text"
                        value={profileData.username}
                        onChange={(e) => setProfileData({ ...profileData, username: e.target.value })}
                        className={`w-full px-4 py-3 rounded-xl border transition-all ${
                          isDark
                            ? "bg-white/5 border-white/10 text-white focus:border-white/30"
                            : "bg-white border-slate-200 text-slate-900 focus:border-indigo-400"
                        } focus:outline-none`}
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className={`block text-sm font-semibold mb-2 ${isDark ? "text-white/80" : "text-slate-700"}`}>
                        Bio
                      </label>
                      <textarea
                        value={profileData.bio}
                        onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                        rows={3}
                        className={`w-full px-4 py-3 rounded-xl border transition-all ${
                          isDark
                            ? "bg-white/5 border-white/10 text-white focus:border-white/30"
                            : "bg-white border-slate-200 text-slate-900 focus:border-indigo-400"
                        } focus:outline-none resize-none`}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Instagram Tab */}
              {activeTab === "instagram" && (
                <div className="space-y-6">
                  <div>
                    <h2 className={`text-2xl font-bold mb-2 ${isDark ? "text-white" : "text-slate-900"}`}>
                      Instagram propojení
                    </h2>
                    <p className={`text-sm ${isDark ? "text-white/60" : "text-slate-600"}`}>
                      Spravuj své Instagram účty
                    </p>
                  </div>

                  <div className={`p-6 rounded-xl border ${isDark ? "bg-white/5 border-white/10" : "bg-slate-50 border-slate-200"}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                          <Instagram className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className={`font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>
                            @socialmater
                          </h3>
                          <p className={`text-sm ${isDark ? "text-white/60" : "text-slate-600"}`}>
                            Připojeno • 2,847 followerů
                          </p>
                        </div>
                      </div>
                      <button
                        className={`px-4 py-2 rounded-lg text-sm font-semibold ${
                          isDark ? "bg-red-500/20 text-red-400 hover:bg-red-500/30" : "bg-red-50 text-red-600 hover:bg-red-100"
                        }`}
                      >
                        Odpojit
                      </button>
                    </div>
                  </div>

                  <button
                    className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                      isDark
                        ? "bg-white/10 hover:bg-white/15 text-white border border-white/20"
                        : "bg-white hover:bg-slate-50 text-slate-900 border border-slate-200"
                    }`}
                  >
                    <Instagram className="w-5 h-5" />
                    Přidat další účet
                  </button>
                </div>
              )}

              {/* Notifications Tab */}
              {activeTab === "notifications" && (
                <div className="space-y-6">
                  <div>
                    <h2 className={`text-2xl font-bold mb-2 ${isDark ? "text-white" : "text-slate-900"}`}>
                      Notifikace
                    </h2>
                    <p className={`text-sm ${isDark ? "text-white/60" : "text-slate-600"}`}>
                      Uprav, jak chceš být informován
                    </p>
                  </div>

                  <div className="space-y-4">
                    {[
                      { key: "emailNotifications", label: "Email notifikace", desc: "Dostávej důležité updaty na email" },
                      { key: "pushNotifications", label: "Push notifikace", desc: "Oznámení v prohlížeči" },
                      { key: "weeklyReport", label: "Týdenní report", desc: "Souhrn výkonu každý týden" },
                      { key: "newFeatures", label: "Nové funkce", desc: "Informace o nových features" },
                      { key: "aiSuggestions", label: "AI doporučení", desc: "Návrhy od AI asistenta" },
                      { key: "commentReplies", label: "Odpovědi na komentáře", desc: "Když někdo odpoví na tvůj komentář" },
                      { key: "dmMessages", label: "Nové DM zprávy", desc: "Upozornění na nové zprávy" },
                    ].map((item) => (
                      <div
                        key={item.key}
                        className={`flex items-center justify-between p-4 rounded-xl ${
                          isDark ? "bg-white/5" : "bg-slate-50"
                        }`}
                      >
                        <div>
                          <h3 className={`font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>
                            {item.label}
                          </h3>
                          <p className={`text-sm ${isDark ? "text-white/60" : "text-slate-600"}`}>
                            {item.desc}
                          </p>
                        </div>
                        <button
                          onClick={() =>
                            setNotificationSettings({
                              ...notificationSettings,
                              [item.key]: !notificationSettings[item.key as keyof typeof notificationSettings],
                            })
                          }
                          className={`relative w-14 h-8 rounded-full transition-all ${
                            notificationSettings[item.key as keyof typeof notificationSettings]
                              ? "bg-indigo-600"
                              : isDark
                              ? "bg-white/10"
                              : "bg-slate-300"
                          }`}
                        >
                          <span
                            className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
                              notificationSettings[item.key as keyof typeof notificationSettings]
                                ? "translate-x-6"
                                : "translate-x-0"
                            }`}
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* AI Settings Tab */}
              {activeTab === "ai" && (
                <div className="space-y-6">
                  <div>
                    <h2 className={`text-2xl font-bold mb-2 ${isDark ? "text-white" : "text-slate-900"}`}>
                      AI Nastavení
                    </h2>
                    <p className={`text-sm ${isDark ? "text-white/60" : "text-slate-600"}`}>
                      Přizpůsob chování AI asistenta
                    </p>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className={`block text-sm font-semibold mb-2 ${isDark ? "text-white/80" : "text-slate-700"}`}>
                        Tón AI odpovědí
                      </label>
                      <select
                        value={aiSettings.autoReplyTone}
                        onChange={(e) => setAiSettings({ ...aiSettings, autoReplyTone: e.target.value })}
                        className={`w-full px-4 py-3 rounded-xl border transition-all ${
                          isDark
                            ? "bg-white/5 border-white/10 text-white focus:border-white/30"
                            : "bg-white border-slate-200 text-slate-900 focus:border-indigo-400"
                        } focus:outline-none`}
                      >
                        <option value="professional">Profesionální</option>
                        <option value="friendly">Přátelský</option>
                        <option value="casual">Neformální</option>
                        <option value="witty">Vtipný</option>
                      </select>
                    </div>

                    <div>
                      <label className={`block text-sm font-semibold mb-2 ${isDark ? "text-white/80" : "text-slate-700"}`}>
                        Styl captionů
                      </label>
                      <select
                        value={aiSettings.captionStyle}
                        onChange={(e) => setAiSettings({ ...aiSettings, captionStyle: e.target.value })}
                        className={`w-full px-4 py-3 rounded-xl border transition-all ${
                          isDark
                            ? "bg-white/5 border-white/10 text-white focus:border-white/30"
                            : "bg-white border-slate-200 text-slate-900 focus:border-indigo-400"
                        } focus:outline-none`}
                      >
                        <option value="engaging">Engaging</option>
                        <option value="educational">Vzdělávací</option>
                        <option value="storytelling">Story-telling</option>
                        <option value="minimal">Minimalistický</option>
                      </select>
                    </div>

                    <div>
                      <label className={`block text-sm font-semibold mb-2 ${isDark ? "text-white/80" : "text-slate-700"}`}>
                        Jazyk
                      </label>
                      <select
                        value={aiSettings.language}
                        onChange={(e) => setAiSettings({ ...aiSettings, language: e.target.value })}
                        className={`w-full px-4 py-3 rounded-xl border transition-all ${
                          isDark
                            ? "bg-white/5 border-white/10 text-white focus:border-white/30"
                            : "bg-white border-slate-200 text-slate-900 focus:border-indigo-400"
                        } focus:outline-none`}
                      >
                        <option value="cs">Čeština</option>
                        <option value="en">Angličtina</option>
                        <option value="sk">Slovenština</option>
                      </select>
                    </div>

                    <div className={`p-4 rounded-xl ${isDark ? "bg-white/5" : "bg-slate-50"}`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className={`font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>
                            Auto Reply
                          </h3>
                          <p className={`text-sm ${isDark ? "text-white/60" : "text-slate-600"}`}>
                            Automatické odpovědi na komentáře
                          </p>
                        </div>
                        <button
                          onClick={() => setAiSettings({ ...aiSettings, autoReply: !aiSettings.autoReply })}
                          className={`relative w-14 h-8 rounded-full transition-all ${
                            aiSettings.autoReply ? "bg-indigo-600" : isDark ? "bg-white/10" : "bg-slate-300"
                          }`}
                        >
                          <span
                            className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
                              aiSettings.autoReply ? "translate-x-6" : "translate-x-0"
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Branding Tab */}
              {activeTab === "branding" && (
                <div className="space-y-6">
                  <div>
                    <h2 className={`text-2xl font-bold mb-2 ${isDark ? "text-white" : "text-slate-900"}`}>
                      Branding
                    </h2>
                    <p className={`text-sm ${isDark ? "text-white/60" : "text-slate-600"}`}>
                      Přizpůsob si vzhled titulků a obsahu
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className={`block text-sm font-semibold mb-2 ${isDark ? "text-white/80" : "text-slate-700"}`}>
                        Primární barva
                      </label>
                      <div className="flex gap-3">
                        <input
                          type="color"
                          value={brandingSettings.primaryColor}
                          onChange={(e) => setBrandingSettings({ ...brandingSettings, primaryColor: e.target.value })}
                          className="w-16 h-12 rounded-xl cursor-pointer"
                        />
                        <input
                          type="text"
                          value={brandingSettings.primaryColor}
                          onChange={(e) => setBrandingSettings({ ...brandingSettings, primaryColor: e.target.value })}
                          className={`flex-1 px-4 py-3 rounded-xl border transition-all ${
                            isDark
                              ? "bg-white/5 border-white/10 text-white focus:border-white/30"
                              : "bg-white border-slate-200 text-slate-900 focus:border-indigo-400"
                          } focus:outline-none`}
                        />
                      </div>
                    </div>

                    <div>
                      <label className={`block text-sm font-semibold mb-2 ${isDark ? "text-white/80" : "text-slate-700"}`}>
                        Sekundární barva
                      </label>
                      <div className="flex gap-3">
                        <input
                          type="color"
                          value={brandingSettings.secondaryColor}
                          onChange={(e) => setBrandingSettings({ ...brandingSettings, secondaryColor: e.target.value })}
                          className="w-16 h-12 rounded-xl cursor-pointer"
                        />
                        <input
                          type="text"
                          value={brandingSettings.secondaryColor}
                          onChange={(e) => setBrandingSettings({ ...brandingSettings, secondaryColor: e.target.value })}
                          className={`flex-1 px-4 py-3 rounded-xl border transition-all ${
                            isDark
                              ? "bg-white/5 border-white/10 text-white focus:border-white/30"
                              : "bg-white border-slate-200 text-slate-900 focus:border-indigo-400"
                          } focus:outline-none`}
                        />
                      </div>
                    </div>

                    <div>
                      <label className={`block text-sm font-semibold mb-2 ${isDark ? "text-white/80" : "text-slate-700"}`}>
                        Font pro titulky
                      </label>
                      <select
                        value={brandingSettings.fontFamily}
                        onChange={(e) => setBrandingSettings({ ...brandingSettings, fontFamily: e.target.value })}
                        className={`w-full px-4 py-3 rounded-xl border transition-all ${
                          isDark
                            ? "bg-white/5 border-white/10 text-white focus:border-white/30"
                            : "bg-white border-slate-200 text-slate-900 focus:border-indigo-400"
                        } focus:outline-none`}
                      >
                        <option value="Inter">Inter</option>
                        <option value="Roboto">Roboto</option>
                        <option value="Montserrat">Montserrat</option>
                        <option value="Poppins">Poppins</option>
                        <option value="Oswald">Oswald</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Billing Tab */}
              {activeTab === "billing" && (
                <div className="space-y-6">
                  <div>
                    <h2 className={`text-2xl font-bold mb-2 ${isDark ? "text-white" : "text-slate-900"}`}>
                      Fakturace
                    </h2>
                    <p className={`text-sm ${isDark ? "text-white/60" : "text-slate-600"}`}>
                      Spravuj své předplatné a platby
                    </p>
                  </div>

                  <div className={`p-6 rounded-xl border-2 ${isDark ? "bg-indigo-500/10 border-indigo-500/30" : "bg-indigo-50 border-indigo-200"}`}>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className={`text-2xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
                          Pro Plan
                        </h3>
                        <p className={`text-sm ${isDark ? "text-white/60" : "text-slate-600"}`}>
                          Měsíční fakturace
                        </p>
                      </div>
                      <div className="text-right">
                        <div className={`text-3xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
                          990 Kč
                        </div>
                        <p className={`text-sm ${isDark ? "text-white/60" : "text-slate-600"}`}>
                          / měsíc
                        </p>
                      </div>
                    </div>
                    <button
                      className={`w-full px-6 py-3 rounded-xl font-semibold transition-all ${
                        isDark
                          ? "bg-white/10 hover:bg-white/15 text-white"
                          : "bg-white hover:bg-slate-50 text-slate-900"
                      }`}
                    >
                      Změnit plán
                    </button>
                  </div>

                  <div>
                    <h3 className={`font-semibold mb-4 ${isDark ? "text-white" : "text-slate-900"}`}>
                      Platební historie
                    </h3>
                    <div className="space-y-3">
                      {[
                        { date: "1. 12. 2025", amount: "990 Kč", status: "Zaplaceno" },
                        { date: "1. 11. 2025", amount: "990 Kč", status: "Zaplaceno" },
                        { date: "1. 10. 2025", amount: "990 Kč", status: "Zaplaceno" },
                      ].map((invoice, idx) => (
                        <div
                          key={idx}
                          className={`flex items-center justify-between p-4 rounded-xl ${
                            isDark ? "bg-white/5" : "bg-slate-50"
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            <FileText className={`w-5 h-5 ${isDark ? "text-white/60" : "text-slate-600"}`} />
                            <div>
                              <p className={`font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>
                                {invoice.date}
                              </p>
                              <p className={`text-sm ${isDark ? "text-white/60" : "text-slate-600"}`}>
                                {invoice.amount}
                              </p>
                            </div>
                          </div>
                          <button
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold ${
                              isDark ? "bg-white/10 hover:bg-white/15 text-white" : "bg-slate-200 hover:bg-slate-300 text-slate-900"
                            }`}
                          >
                            <Download className="w-4 h-4" />
                            Stáhnout
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Security Tab */}
              {activeTab === "security" && (
                <div className="space-y-6">
                  <div>
                    <h2 className={`text-2xl font-bold mb-2 ${isDark ? "text-white" : "text-slate-900"}`}>
                      Zabezpečení
                    </h2>
                    <p className={`text-sm ${isDark ? "text-white/60" : "text-slate-600"}`}>
                      Spravuj bezpečnost svého účtu
                    </p>
                  </div>

                  <div>
                    <h3 className={`font-semibold mb-4 ${isDark ? "text-white" : "text-slate-900"}`}>
                      Změna hesla
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className={`block text-sm font-semibold mb-2 ${isDark ? "text-white/80" : "text-slate-700"}`}>
                          Současné heslo
                        </label>
                        <input
                          type="password"
                          className={`w-full px-4 py-3 rounded-xl border transition-all ${
                            isDark
                              ? "bg-white/5 border-white/10 text-white focus:border-white/30"
                              : "bg-white border-slate-200 text-slate-900 focus:border-indigo-400"
                          } focus:outline-none`}
                        />
                      </div>
                      <div>
                        <label className={`block text-sm font-semibold mb-2 ${isDark ? "text-white/80" : "text-slate-700"}`}>
                          Nové heslo
                        </label>
                        <input
                          type="password"
                          className={`w-full px-4 py-3 rounded-xl border transition-all ${
                            isDark
                              ? "bg-white/5 border-white/10 text-white focus:border-white/30"
                              : "bg-white border-slate-200 text-slate-900 focus:border-indigo-400"
                          } focus:outline-none`}
                        />
                      </div>
                      <div>
                        <label className={`block text-sm font-semibold mb-2 ${isDark ? "text-white/80" : "text-slate-700"}`}>
                          Potvrdit nové heslo
                        </label>
                        <input
                          type="password"
                          className={`w-full px-4 py-3 rounded-xl border transition-all ${
                            isDark
                              ? "bg-white/5 border-white/10 text-white focus:border-white/30"
                              : "bg-white border-slate-200 text-slate-900 focus:border-indigo-400"
                          } focus:outline-none`}
                        />
                      </div>
                      <button
                        className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                          isDark
                            ? "bg-indigo-600 hover:bg-indigo-500 text-white"
                            : "bg-indigo-600 hover:bg-indigo-500 text-white"
                        }`}
                      >
                        Změnit heslo
                      </button>
                    </div>
                  </div>

                  <div className={`p-6 rounded-xl border ${isDark ? "bg-red-500/10 border-red-500/30" : "bg-red-50 border-red-200"}`}>
                    <div className="flex items-start gap-4 mb-4">
                      <Trash2 className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />
                      <div>
                        <h3 className={`font-bold mb-1 ${isDark ? "text-white" : "text-slate-900"}`}>
                          Smazat účet
                        </h3>
                        <p className={`text-sm ${isDark ? "text-white/70" : "text-slate-600"}`}>
                          Tato akce je nevratná. Všechna tvá data budou trvale smazána.
                        </p>
                      </div>
                    </div>
                    <button className="px-6 py-3 rounded-xl font-semibold bg-red-600 hover:bg-red-500 text-white transition-all">
                      Smazat můj účet
                    </button>
                  </div>
                </div>
              )}

              {/* Save Button */}
              {activeTab !== "billing" && activeTab !== "security" && (
                <div className="flex items-center justify-end gap-4 mt-8 pt-6 border-t border-white/10">
                  <button
                    onClick={handleSave}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                      isDark
                        ? "bg-indigo-600 hover:bg-indigo-500 text-white"
                        : "bg-indigo-600 hover:bg-indigo-500 text-white"
                    }`}
                  >
                    {saved ? (
                      <>
                        <Check className="w-5 h-5" />
                        Uloženo
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        Uložit změny
                      </>
                    )}
                  </button>
                </div>
              )}
        </div>
      </div>
    </div>
  );
}
