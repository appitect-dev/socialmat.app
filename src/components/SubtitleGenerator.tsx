"use client";

import React, { useState } from "react";
import {
  createProject,
  uploadVideo,
  getProjectStatus,
  getProjectSubtitles,
  type SubtitleDTO,
} from "@/lib/api";

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
  // State pro sledování stavu generování
  const [isGenerating, setIsGenerating] = useState(false);
  // State pro zobrazení výsledku
  const [result, setResult] = useState<"success" | "error" | null>(null);
  // State pro chybovou zprávu
  const [errorMessage, setErrorMessage] = useState("");

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
      let status =
        (statusResponse.data as { status?: string })?.status ?? "";

      while (status === "UPLOADING" || status === "PROCESSING") {
        // Čekáme 3 sekundy před dalším kontrolováním
        await new Promise((resolve) => setTimeout(resolve, 3000));
        statusResponse = await getProjectStatus(projectId);
        status =
          (statusResponse.data as { status?: string })?.status ?? "";
      }

      // Kontrola, zda zpracování proběhlo úspěšně
      if (status === "ERROR" || status === "FAILED") {
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

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Nadpis */}
      <h3 className="text-lg font-bold text-gray-900 mb-4">
        Generování titulků
      </h3>

      {/* Popis */}
      <p className="text-sm text-gray-600 mb-6">
        Automaticky vygenerujte titulky pro vaše video pomocí AI technologie.
      </p>

      {/* Tlačítko pro generování */}
      <button
        onClick={handleGenerateSubtitles}
        disabled={isGenerating}
        className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
          isGenerating
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-blue-600 text-white hover:bg-blue-700"
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
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-start gap-3">
            <span className="text-2xl">✅</span>
            <div>
              <p className="text-green-800 font-medium">
                Titulky úspěšně vygenerovány!
              </p>
              <p className="text-sm text-green-600 mt-1">
                Titulky jsou připraveny k použití.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Chybová zpráva */}
      {result === "error" && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start gap-3">
            <span className="text-2xl">⚠️</span>
            <div>
              <p className="text-red-800 font-medium">Chyba při generování</p>
              <p className="text-sm text-red-600 mt-1">{errorMessage}</p>
            </div>
          </div>
        </div>
      )}

      {/* Loading progress indicator */}
      {isGenerating && (
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <p className="text-sm text-blue-800 mb-2">
                Zpracovávám video a generuji titulky...
              </p>
              <div className="w-full bg-blue-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full animate-pulse w-3/4"></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Informace o souboru */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <p className="text-xs text-gray-500 mb-2">Video k zpracování:</p>
        <p className="text-sm text-gray-900 font-medium truncate">
          {videoFile.name}
        </p>
        <p className="text-xs text-gray-500 mt-1">
          {(videoFile.size / (1024 * 1024)).toFixed(2)} MB
        </p>
      </div>
    </div>
  );
}
