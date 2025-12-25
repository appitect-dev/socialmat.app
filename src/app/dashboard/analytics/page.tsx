"use client";

import { useDashboardTheme } from "@/components/dashboard-theme";
import { BarChart3, TrendingUp, Users, Eye, Heart, MessageCircle, Share2, Calendar } from "lucide-react";

export default function AnalyticsPage() {
  const { isDark } = useDashboardTheme();

  const metrics = [
    { label: "Celkový reach", value: "124.5K", change: "+23%", icon: Eye, trend: "up" },
    { label: "Engagement rate", value: "8.4%", change: "+2.1%", icon: Heart, trend: "up" },
    { label: "Nový followers", value: "2,847", change: "+15%", icon: Users, trend: "up" },
    { label: "Komentáře", value: "1,234", change: "-5%", icon: MessageCircle, trend: "down" },
  ];

  const topPosts = [
    { title: "Letní tips #1", reach: "45.2K", engagement: "12.3%", date: "20.12.2024" },
    { title: "Tutorial: Jak na Reels", reach: "38.9K", engagement: "10.8%", date: "18.12.2024" },
    { title: "Behind the scenes", reach: "32.1K", engagement: "9.5%", date: "15.12.2024" },
  ];

  const bestTimes = [
    { day: "Pondělí", time: "18:00 - 20:00", engagement: "High" },
    { day: "Středa", time: "12:00 - 14:00", engagement: "Medium" },
    { day: "Pátek", time: "19:00 - 21:00", engagement: "High" },
  ];

  return (
    <div className={`min-h-screen ${isDark ? "bg-black text-white" : "bg-white text-slate-900"}`}>
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <BarChart3 className="w-8 h-8 text-indigo-500" />
            <h1 className="text-3xl font-bold">Analýzy profilu</h1>
          </div>
          <p className={isDark ? "text-white/70" : "text-slate-600"}>
            Sledujte výkon vašeho Instagram účtu a objevte, co funguje nejlépe
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {metrics.map((metric) => {
            const Icon = metric.icon;
            return (
              <div
                key={metric.label}
                className={`p-6 rounded-2xl border transition-all duration-300 hover:-translate-y-1 ${
                  isDark
                    ? "bg-white/5 border-white/10 hover:bg-white/10"
                    : "bg-white border-slate-200 shadow-lg hover:shadow-xl"
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <Icon className={`w-6 h-6 ${isDark ? "text-indigo-400" : "text-indigo-600"}`} />
                  <span
                    className={`text-sm font-semibold ${
                      metric.trend === "up" ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {metric.change}
                  </span>
                </div>
                <p className={`text-sm mb-1 ${isDark ? "text-white/60" : "text-slate-600"}`}>
                  {metric.label}
                </p>
                <p className="text-3xl font-bold">{metric.value}</p>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Posts */}
          <div
            className={`p-6 rounded-2xl border ${
              isDark ? "bg-white/5 border-white/10" : "bg-white border-slate-200 shadow-lg"
            }`}
          >
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="w-5 h-5 text-indigo-500" />
              <h2 className="text-xl font-bold">Top příspěvky (7 dní)</h2>
            </div>
            <div className="space-y-4">
              {topPosts.map((post, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-xl ${
                    isDark ? "bg-white/5 hover:bg-white/10" : "bg-slate-50 hover:bg-slate-100"
                  } transition-colors cursor-pointer`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold">{post.title}</h3>
                    <span className={`text-xs ${isDark ? "text-white/60" : "text-slate-500"}`}>
                      {post.date}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      <span>{post.reach}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Heart className="w-4 h-4" />
                      <span>{post.engagement}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Best Times to Post */}
          <div
            className={`p-6 rounded-2xl border ${
              isDark ? "bg-white/5 border-white/10" : "bg-white border-slate-200 shadow-lg"
            }`}
          >
            <div className="flex items-center gap-2 mb-6">
              <Calendar className="w-5 h-5 text-indigo-500" />
              <h2 className="text-xl font-bold">Nejlepší časy pro publikování</h2>
            </div>
            <div className="space-y-4">
              {bestTimes.map((time, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-xl ${
                    isDark ? "bg-white/5" : "bg-slate-50"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">{time.day}</h3>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        time.engagement === "High"
                          ? "bg-green-500/20 text-green-500"
                          : "bg-yellow-500/20 text-yellow-500"
                      }`}
                    >
                      {time.engagement}
                    </span>
                  </div>
                  <p className={`text-sm ${isDark ? "text-white/60" : "text-slate-600"}`}>
                    {time.time}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* AI Insights */}
        <div
          className={`mt-6 p-6 rounded-2xl border ${
            isDark
              ? "bg-gradient-to-br from-indigo-950/50 to-purple-950/30 border-indigo-500/30"
              : "bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200"
          }`}
        >
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Share2 className="w-5 h-5" />
            AI doporučení
          </h2>
          <div className="space-y-3">
            <p className={isDark ? "text-white/80" : "text-slate-700"}>
              • Vaše Reels s humorným obsahem dosahují o 45% vyššího engagement. Zkuste tento formát častěji.
            </p>
            <p className={isDark ? "text-white/80" : "text-slate-700"}>
              • Publikujte více v pátek večer (19:00-21:00) - vaše audience je nejvíce aktivní.
            </p>
            <p className={isDark ? "text-white/80" : "text-slate-700"}>
              • Tutorial videa mají 2.5x vyšší save rate. Považte seriál tutoriálů.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
