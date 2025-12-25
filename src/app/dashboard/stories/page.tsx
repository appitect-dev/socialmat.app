"use client";

import { useState } from "react";
import { useDashboardTheme } from "@/components/dashboard-theme";
import { Image, Upload, Type, Palette, Sparkles, Download, Grid3x3, Zap, Plus } from "lucide-react";

export default function StoriesEditorPage() {
  const { isDark } = useDashboardTheme();
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  const templates = [
    { id: "minimal", name: "Minimalistický", preview: "bg-gradient-to-br from-slate-900 to-slate-700" },
    { id: "colorful", name: "Barevný", preview: "bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500" },
    { id: "business", name: "Business", preview: "bg-gradient-to-br from-blue-900 to-cyan-700" },
    { id: "nature", name: "Přírodní", preview: "bg-gradient-to-br from-green-600 to-teal-500" },
    { id: "sunset", name: "Sunset", preview: "bg-gradient-to-br from-orange-500 via-red-500 to-pink-600" },
    { id: "neon", name: "Neon", preview: "bg-gradient-to-br from-purple-900 via-pink-700 to-red-600" },
  ];

  const tools = [
    { icon: Type, label: "Text", description: "Přidat text" },
    { icon: Image, label: "Obrázek", description: "Nahrát obrázek" },
    { icon: Palette, label: "Barvy", description: "Upravit barvy" },
    { icon: Sparkles, label: "AI návrh", description: "Generovat AI" },
    { icon: Grid3x3, label: "Mřížka", description: "Layout grid" },
  ];

  return (
    <div className={`min-h-screen ${isDark ? "bg-black text-white" : "bg-white text-slate-900"}`}>
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Image className="w-8 h-8 text-indigo-500" />
            <h1 className="text-3xl font-bold">Stories Editor</h1>
          </div>
          <p className={isDark ? "text-white/70" : "text-slate-600"}>
            Vytvářejte profesionální Instagram Stories během několika vteřin
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Templates & Tools */}
          <div className="lg:col-span-1 space-y-6">
            {/* Templates */}
            <div
              className={`p-6 rounded-2xl border ${
                isDark ? "bg-white/5 border-white/10" : "bg-white border-slate-200 shadow-lg"
              }`}
            >
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Grid3x3 className="w-5 h-5" />
                Šablony
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {templates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => setSelectedTemplate(template.id)}
                    className={`aspect-[9/16] rounded-lg ${template.preview} transition-all duration-300 hover:scale-105 border-2 ${
                      selectedTemplate === template.id
                        ? "border-indigo-500 shadow-lg shadow-indigo-500/50"
                        : "border-transparent"
                    }`}
                    title={template.name}
                  >
                    <div className="h-full flex items-end p-2">
                      <span className="text-xs text-white font-semibold bg-black/50 px-2 py-1 rounded">
                        {template.name}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Tools */}
            <div
              className={`p-6 rounded-2xl border ${
                isDark ? "bg-white/5 border-white/10" : "bg-white border-slate-200 shadow-lg"
              }`}
            >
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Nástroje
              </h2>
              <div className="space-y-2">
                {tools.map((tool) => {
                  const Icon = tool.icon;
                  return (
                    <button
                      key={tool.label}
                      className={`w-full p-3 rounded-lg flex items-center gap-3 transition-colors ${
                        isDark ? "hover:bg-white/10" : "hover:bg-slate-100"
                      }`}
                    >
                      <Icon className="w-5 h-5 text-indigo-500" />
                      <div className="text-left">
                        <p className="text-sm font-semibold">{tool.label}</p>
                        <p className={`text-xs ${isDark ? "text-white/60" : "text-slate-500"}`}>
                          {tool.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Main Canvas */}
          <div className="lg:col-span-3">
            <div
              className={`p-6 rounded-2xl border ${
                isDark ? "bg-white/5 border-white/10" : "bg-white border-slate-200 shadow-lg"
              }`}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Canvas</h2>
                <div className="flex items-center gap-2">
                  <button
                    className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${
                      isDark
                        ? "bg-white/10 hover:bg-white/20 text-white"
                        : "bg-slate-100 hover:bg-slate-200 text-slate-900"
                    }`}
                  >
                    <Upload className="w-4 h-4 inline mr-2" />
                    Nahrát
                  </button>
                  <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-blue-500 text-white font-semibold text-sm hover:from-indigo-500 hover:to-sky-500 transition-all">
                    <Download className="w-4 h-4 inline mr-2" />
                    Exportovat
                  </button>
                </div>
              </div>

              {/* Canvas Area */}
              <div className="flex items-center justify-center">
                <div
                  className={`relative aspect-[9/16] w-full max-w-md rounded-2xl overflow-hidden border-2 ${
                    selectedTemplate
                      ? templates.find((t) => t.id === selectedTemplate)?.preview
                      : isDark
                      ? "bg-white/5 border-white/10"
                      : "bg-slate-100 border-slate-200"
                  }`}
                >
                  {!selectedTemplate ? (
                    <div className="h-full flex flex-col items-center justify-center p-8 text-center">
                      <Plus className={`w-16 h-16 mb-4 ${isDark ? "text-white/40" : "text-slate-400"}`} />
                      <p className={`text-lg font-semibold mb-2 ${isDark ? "text-white/80" : "text-slate-700"}`}>
                        Začněte tvořit
                      </p>
                      <p className={`text-sm ${isDark ? "text-white/60" : "text-slate-500"}`}>
                        Vyberte šablonu nebo nahrajte vlastní obrázek
                      </p>
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center p-8">
                      <div className="text-center space-y-4">
                        <h3 className="text-2xl font-bold text-white">Váš nadpis zde</h3>
                        <p className="text-white/80">Váš popisek zde</p>
                        <button className="px-6 py-3 bg-white text-slate-900 rounded-full font-semibold hover:scale-105 transition-transform">
                          CTA tlačítko
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* AI Quick Actions */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  className={`p-4 rounded-xl border transition-all hover:-translate-y-1 ${
                    isDark
                      ? "bg-white/5 border-white/10 hover:bg-white/10"
                      : "bg-white border-slate-200 hover:shadow-lg"
                  }`}
                >
                  <Sparkles className="w-5 h-5 text-indigo-500 mb-2" />
                  <p className="font-semibold text-sm mb-1">AI návrh designu</p>
                  <p className={`text-xs ${isDark ? "text-white/60" : "text-slate-500"}`}>
                    Nechte AI navrhnout celou Story
                  </p>
                </button>
                <button
                  className={`p-4 rounded-xl border transition-all hover:-translate-y-1 ${
                    isDark
                      ? "bg-white/5 border-white/10 hover:bg-white/10"
                      : "bg-white border-slate-200 hover:shadow-lg"
                  }`}
                >
                  <Type className="w-5 h-5 text-indigo-500 mb-2" />
                  <p className="font-semibold text-sm mb-1">Generovat copy</p>
                  <p className={`text-xs ${isDark ? "text-white/60" : "text-slate-500"}`}>
                    AI napíše poutavý text
                  </p>
                </button>
                <button
                  className={`p-4 rounded-xl border transition-all hover:-translate-y-1 ${
                    isDark
                      ? "bg-white/5 border-white/10 hover:bg-white/10"
                      : "bg-white border-slate-200 hover:shadow-lg"
                  }`}
                >
                  <Palette className="w-5 h-5 text-indigo-500 mb-2" />
                  <p className="font-semibold text-sm mb-1">Barevná paleta</p>
                  <p className={`text-xs ${isDark ? "text-white/60" : "text-slate-500"}`}>
                    AI navrhne barvy podle brand
                  </p>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
