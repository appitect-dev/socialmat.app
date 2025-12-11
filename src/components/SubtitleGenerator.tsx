"use client";

import React, { useState } from "react";
import {
  createProject,
  uploadVideo,
  getProjectStatus,
  getProjectSubtitles,
  type SubtitleDTO,
} from "@/lib/api";
import { useDashboardTheme } from "./dashboard-theme";

// Props pro SubtitleGenerator komponentu
interface SubtitleGeneratorProps {
  videoFile: File; // Video soubor pro který se generují titulky
  onSuccess?: () => void; // Callback při úspěšném vygenerování
  onError?: (error: string) => void; // Callback při chybě
}

export function SubtitleGenerator({
  videoFile,
  onSuccess,
  onError,
}: SubtitleGeneratorProps) {
  const { isDark, palette } = useDashboardTheme();
  // State pro sledování stavu generování
  const [isGenerating, setIsGenerating] = useState(false);
  // State pro zobrazení výsledku
  const [result, setResult] = useState<"success" | "error" | null>(null);
  // State pro chybovou zprávu
  const [errorMessage, setErrorMessage] = useState("");

  const formatTimestamp = (ms: number) => {
    const date = new Date(ms);
    const hours = String(date.getUTCHours()).padStart(2, "0");
    const minutes = String(date.getUTCMinutes()).padStart(2, "0");
    const seconds = String(date.getUTCSeconds()).padStart(2, "0");
    const milliseconds = String(date.getUTCMilliseconds()).padStart(3, "0");
    return `${hours}:${minutes}:${seconds},${milliseconds}`;
  };

  const convertToSRT = (subtitles: SubtitleDTO[]) =>
    subtitles
      .map((subtitle, index) => {
        const start = formatTimestamp((subtitle.startTime ?? 0) * 1000);
        const end = formatTimestamp((subtitle.endTime ?? 0) * 1000);
        return `${index + 1}\n${start} --> ${end}\n${subtitle.text ?? ""}\n`;
      })
      .join("\n");

  // Funkce pro stažení titulků jako .srt soubor
  const downloadSubtitles = (subtitles: string) => {
    const blob = new Blob([subtitles], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${videoFile.name.replace(/\.[^/.]+$/, "")}.srt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Funkce pro generování titulků
  const handleGenerateSubtitles = async () => {
    setIsGenerating(true);
    setResult(null);
    setErrorMessage("");

    try {
      // Krok 1: Vytvoření projektu
      const project = await createProject({
        name: videoFile.name,
        description: `Video nahráno: ${new Date().toLocaleString("cs-CZ")}`,
      });

      const projectId = project.data?.id;
      if (!projectId) {
        throw new Error("Nepodařilo se vytvořit projekt");
      }

      // Krok 2: Nahrání videa
      await uploadVideo(projectId, { file: videoFile });

      // Krok 3: Čekání na zpracování (polling)
      let statusResponse = await getProjectStatus(projectId);
      let status = statusResponse.data?.status ?? "";

      while (status === "UPLOADING" || status === "PROCESSING") {
        // Čekáme 3 sekundy před dalším kontrolováním
        await new Promise((resolve) => setTimeout(resolve, 3000));
        statusResponse = await getProjectStatus(projectId);
        status = statusResponse.data?.status ?? "";
      }

      // Kontrola, zda zpracování proběhlo úspěšně
      if (status === "ERROR") {
        throw new Error("Zpracování videa selhalo");
      }

      // Krok 4: Získání titulků
      const subtitlesResponse = await getProjectSubtitles(projectId);
      const subtitles = subtitlesResponse.data ?? [];

      if (!subtitles || subtitles.length === 0) {
        throw new Error("Nebyly vygenerovány žádné titulky");
      }

      // Konverze na SRT formát a stažení
      const srtContent = convertToSRT(subtitles);
      downloadSubtitles(srtContent);

      setResult("success");
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      const error =
        err instanceof Error
          ? err.message
          : "Došlo k neočekávané chybě při generování titulků.";
      setResult("error");
      setErrorMessage(error);
      if (onError) {
        onError(error);
      }
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className={`${palette.card} rounded-2xl p-6`}>
      {/* Nadpis */}
      <h3
        className={`text-lg font-bold ${
          isDark ? "text-white" : "text-slate-900"
        } mb-4`}
      >
        Generování titulků
      </h3>

      {/* Popis */}
      <p
        className={`text-sm mb-6 ${
          isDark ? "text-white/70" : "text-slate-600"
        }`}
      >
        Automaticky vygenerujte titulky pro vaše video pomocí AI technologie.
      </p>

      {/* Tlačítko pro generování */}
      <button
        onClick={handleGenerateSubtitles}
        disabled={isGenerating}
        className={`w-full py-3 px-4 rounded-lg font-medium transition-all border ${palette.border} ${
          isGenerating
            ? isDark
              ? "bg-white/5 text-white/40 cursor-not-allowed"
              : "bg-slate-100 text-slate-400 cursor-not-allowed"
            : `${palette.accentButton} ${palette.accentButtonHover}`
        }`}
      >
        {isGenerating ? (
          <span className="flex items-center justify-center gap-2">
            {/* Loading spinner */}
            <svg
              className="animate-spin h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <span>Generuji titulky...</span>
          </span>
        ) : (
          "Generovat titulky"
        )}
      </button>

      {/* Zpráva o úspěchu */}
      {result === "success" && (
        <div
          className={`mt-4 p-4 rounded-lg border ${
            isDark
              ? "bg-green-900/30 border-green-500/40"
              : "bg-green-50 border-green-200"
          }`}
        >
          <div className="flex items-start gap-3">
            <span className="text-2xl">✅</span>
            <div>
              <p
                className={`font-medium ${
                  isDark ? "text-green-200" : "text-green-700"
                }`}
              >
                Titulky úspěšně vygenerovány!
              </p>
              <p
                className={`text-sm mt-1 ${
                  isDark ? "text-green-200/80" : "text-green-700/70"
                }`}
              >
                Titulky jsou připraveny k použití.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Chybová zpráva */}
      {result === "error" && (
        <div
          className={`mt-4 p-4 rounded-lg border ${
            isDark
              ? "bg-red-900/30 border-red-500/40"
              : "bg-red-50 border-red-200"
          }`}
        >
          <div className="flex items-start gap-3">
            <span className="text-2xl">⚠️</span>
            <div>
              <p
                className={`font-medium ${
                  isDark ? "text-red-200" : "text-red-700"
                }`}
              >
                Chyba při generování
              </p>
              <p
                className={`text-sm mt-1 ${
                  isDark ? "text-red-200/80" : "text-red-700/70"
                }`}
              >
                {errorMessage}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Loading progress indicator */}
      {isGenerating && (
        <div
          className={`mt-4 p-4 rounded-lg border ${
            isDark
              ? "bg-indigo-500/10 border-indigo-400/40"
              : "bg-indigo-50 border-indigo-200"
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <p
                className={`text-sm mb-2 ${
                  isDark ? "text-indigo-200" : "text-indigo-700"
                }`}
              >
                Zpracovávám video a generuji titulky...
              </p>
              <div
                className={`w-full rounded-full h-2 ${
                  isDark ? "bg-white/10" : "bg-slate-200"
                }`}
              >
                <div className="bg-indigo-500 h-2 rounded-full animate-pulse w-3/4"></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Informace o souboru */}
      <div className={`mt-6 pt-6 border-t ${palette.border}`}>
        <p
          className={`text-xs mb-2 ${
            isDark ? "text-white/50" : "text-slate-500"
          }`}
        >
          Video k zpracování:
        </p>
        <p
          className={`text-sm font-medium truncate ${
            isDark ? "text-white" : "text-slate-900"
          }`}
        >
          {videoFile.name}
        </p>
        <p
          className={`text-xs mt-1 ${
            isDark ? "text-white/50" : "text-slate-500"
          }`}
        >
          {(videoFile.size / (1024 * 1024)).toFixed(2)} MB
        </p>
      </div>
    </div>
  );
}
