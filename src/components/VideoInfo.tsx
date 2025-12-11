"use client";

import React from "react";
import { useDashboardTheme } from "./dashboard-theme";

// Props pro VideoInfo komponentu
interface VideoInfoProps {
  fileName: string; // Název souboru
  fileSize: number; // Velikost v bytech
  duration: number; // Délka v sekundách
  resolution?: string; // Rozlišení videa (volitelné)
  uploadDate: Date; // Datum nahrání
  status: "uploaded" | "processing" | "ready"; // Stav zpracování
}

export function VideoInfo({
  fileName,
  fileSize,
  duration,
  resolution,
  uploadDate,
  status,
}: VideoInfoProps) {
  const { isDark, palette } = useDashboardTheme();
  // Funkce pro formátování velikosti souboru
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  };

  // Funkce pro formátování času (sekundy -> mm:ss)
  const formatDuration = (seconds: number) => {
    if (isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Funkce pro formátování data
  const formatDate = (date: Date) => {
    return date.toLocaleString("cs-CZ", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Funkce pro zobrazení stavu
  const getStatusInfo = () => {
    switch (status) {
      case "uploaded":
        return {
          text: "Nahráno",
          color: isDark
            ? "bg-indigo-500/20 text-indigo-200"
            : "bg-indigo-50 text-indigo-700 border border-indigo-200",
          icon: "📤",
        };
      case "processing":
        return {
          text: "Zpracovává se",
          color: isDark
            ? "bg-indigo-500/20 text-indigo-200"
            : "bg-indigo-50 text-indigo-700 border border-indigo-200",
          icon: "⚙️",
        };
      case "ready":
        return {
          text: "Připraveno",
          color: isDark
            ? "bg-green-900/40 text-green-200"
            : "bg-green-50 text-green-700 border border-green-200",
          icon: "✅",
        };
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <div className={`${palette.card} rounded-2xl p-6`}>
      {/* Nadpis */}
      <h3
        className={`text-lg font-bold ${
          isDark ? "text-white" : "text-slate-900"
        } mb-4`}
      >
        Informace o videu
      </h3>

      {/* Status indikátor */}
      <div className="mb-4">
        <span
          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${statusInfo.color}`}
        >
          <span>{statusInfo.icon}</span>
          <span>{statusInfo.text}</span>
        </span>
      </div>

      {/* Metadata */}
      <div className="space-y-3">
        {/* Název souboru */}
        <div className={`pb-3 border-b ${palette.border}`}>
          <p className={`text-xs ${isDark ? "text-white/50" : "text-slate-500"} mb-1`}>
            Název souboru
          </p>
          <p
            className={`text-sm font-medium break-all ${
              isDark ? "text-white" : "text-slate-900"
            }`}
          >
            {fileName}
          </p>
        </div>

        {/* Velikost */}
        <div className={`pb-3 border-b ${palette.border}`}>
          <p className={`text-xs ${isDark ? "text-white/50" : "text-slate-500"} mb-1`}>
            Velikost
          </p>
          <p
            className={`text-sm font-medium ${
              isDark ? "text-white" : "text-slate-900"
            }`}
          >
            {formatFileSize(fileSize)}
          </p>
        </div>

        {/* Délka */}
        <div className={`pb-3 border-b ${palette.border}`}>
          <p className={`text-xs ${isDark ? "text-white/50" : "text-slate-500"} mb-1`}>
            Délka
          </p>
          <p
            className={`text-sm font-medium ${
              isDark ? "text-white" : "text-slate-900"
            }`}
          >
            {formatDuration(duration)}
          </p>
        </div>

        {/* Rozlišení (pokud je k dispozici) */}
        {resolution && (
          <div className={`pb-3 border-b ${palette.border}`}>
            <p className={`text-xs ${isDark ? "text-white/50" : "text-slate-500"} mb-1`}>
              Rozlišení
            </p>
            <p
              className={`text-sm font-medium ${
                isDark ? "text-white" : "text-slate-900"
              }`}
            >
              {resolution}
            </p>
          </div>
        )}

        {/* Datum nahrání */}
        <div className="pb-3">
          <p className={`text-xs ${isDark ? "text-white/50" : "text-slate-500"} mb-1`}>
            Datum nahrání
          </p>
          <p
            className={`text-sm font-medium ${
              isDark ? "text-white" : "text-slate-900"
            }`}
          >
            {formatDate(uploadDate)}
          </p>
        </div>
      </div>
    </div>
  );
}
