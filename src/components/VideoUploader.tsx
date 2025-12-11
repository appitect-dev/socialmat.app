"use client";

import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { useDashboardTheme } from "./dashboard-theme";

// Props pro VideoUploader komponentu
interface VideoUploaderProps {
  onVideoUploaded?: (videoData: { file: File; url: string }) => void;
}

export function VideoUploader({ onVideoUploaded }: VideoUploaderProps) {
  const { isDark, palette } = useDashboardTheme();
  // State pro uložení nahraného videa
  const [uploadedVideo, setUploadedVideo] = useState<File | null>(null);
  // State pro progress nahrávání (0-100)
  const [uploadProgress, setUploadProgress] = useState(0);
  // State pro chybové hlášky
  const [error, setError] = useState("");
  // State pro URL náhledu videa
  const [videoPreviewUrl, setVideoPreviewUrl] = useState("");

  // Maximální velikost souboru: 100MB
  const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB v bytech

  // Konfigurace React Dropzone
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    // Akceptujeme pouze video soubory
    accept: {
      "video/*": [".mp4", ".mov", ".avi"],
    },
    // Povolíme jen jeden soubor najednou
    multiple: false,
    // Funkce volaná při nahrání souboru
    onDrop: (acceptedFiles, rejectedFiles) => {
      // Vymažeme předchozí chyby
      setError("");

      // Kontrola zamítnutých souborů
      if (rejectedFiles.length > 0) {
        setError("Prosím nahrajte pouze video soubory (.mp4, .mov, .avi)");
        return;
      }

      const file = acceptedFiles[0];

      // Kontrola velikosti souboru
      if (file.size > MAX_FILE_SIZE) {
        setError("Soubor je příliš velký. Maximální velikost je 100MB.");
        return;
      }

      // Uložíme soubor
      setUploadedVideo(file);

      // Vytvoříme URL pro náhled videa
      const previewUrl = URL.createObjectURL(file);
      setVideoPreviewUrl(previewUrl);

      // Simulace nahrávání s progress barem
      // V reálné aplikaci by toto bylo nahrazeno skutečným API voláním
      simulateUpload(file, previewUrl);
    },
  });

  // Funkce pro simulaci nahrávání s progress barem
  const simulateUpload = (file: File, previewUrl: string) => {
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          // Když je upload hotový, zavoláme callback s daty
          // Použijeme setTimeout aby se callback zavolal až po renderování
          if (onVideoUploaded) {
            setTimeout(() => {
              onVideoUploaded({ file, url: previewUrl });
            }, 0);
          }
          return 100;
        }
        return prev + 4;
      });
    }, 100);
  };

  // Funkce pro reset/smazání nahraného videa
  const handleReset = () => {
    setUploadedVideo(null);
    setUploadProgress(0);
    setError("");
    // Uvolníme paměť od URL objektu
    if (videoPreviewUrl) {
      URL.revokeObjectURL(videoPreviewUrl);
      setVideoPreviewUrl("");
    }
  };

  return (
    <div
      className={`max-w-2xl mx-auto ${
        isDark ? "text-white" : "text-slate-900"
      }`}
    >
      {/* Dropzone oblast */}
      {!uploadedVideo && (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all ${
            isDragActive
              ? "border-indigo-400 shadow-[0_20px_60px_rgba(79,70,229,0.25)] bg-indigo-500/10"
              : isDark
              ? "border-white/15 hover:border-indigo-300/80 bg-white/5"
              : "border-slate-200 hover:border-indigo-400 bg-white shadow-[0_16px_40px_rgba(79,70,229,0.08)]"
          }`}
        >
          <input {...getInputProps()} />
          <div className="space-y-4">
            <div className="text-6xl">🎬</div>
            {isDragActive ? (
              <p className="text-lg text-indigo-500">
                Přetáhněte video sem...
              </p>
            ) : (
              <>
                <p
                  className={`text-lg font-medium ${
                    isDark ? "text-white" : "text-slate-900"
                  }`}
                >
                  Přetáhněte video sem nebo klikněte pro výběr
                </p>
                <p
                  className={`text-sm ${
                    isDark ? "text-white/60" : "text-slate-600"
                  }`}
                >
                  Podporované formáty: MP4, MOV, AVI (max. 100MB)
                </p>
              </>
            )}
          </div>
        </div>
      )}

      {/* Chybová hláška */}
      {error && (
        <div
          className={`mt-4 p-4 rounded-lg border ${
            isDark
              ? "bg-red-900/30 border-red-500/40"
              : "bg-red-50 border-red-200"
          }`}
        >
          <p className={isDark ? "text-red-200" : "text-red-700"}>
            ⚠️ {error}
          </p>
        </div>
      )}

      {/* Progress bar během nahrávání */}
      {uploadedVideo && uploadProgress < 100 && (
        <div className="mt-6 space-y-2">
          <p className={`text-sm ${isDark ? "text-white/70" : "text-slate-600"}`}>
            Nahrávání videa...
          </p>
          <div
            className={`w-full rounded-full h-3 ${
              isDark ? "bg-white/10" : "bg-slate-200"
            }`}
          >
            <div
              className="bg-indigo-500 h-3 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
          <p
            className={`text-sm text-right ${
              isDark ? "text-white/70" : "text-slate-600"
            }`}
          >
            {uploadProgress}%
          </p>
        </div>
      )}

      {/* Náhled nahraného videa */}
      {uploadedVideo && uploadProgress === 100 && (
        <div className="mt-6 space-y-4">
          <div
            className={`p-4 rounded-lg border ${
              isDark
                ? "bg-green-900/30 border-green-500/40"
                : "bg-green-50 border-green-200"
            }`}
          >
            <p className={isDark ? "text-green-200" : "text-green-700"}>
              ✅ Video úspěšně nahráno!
            </p>
          </div>

          {/* Video náhled */}
          <div className={`${palette.card} rounded-lg p-4 space-y-4`}>
            <div className="flex items-center justify-between">
              <div>
                <p
                  className={`font-medium ${
                    isDark ? "text-white" : "text-slate-900"
                  }`}
                >
                  {uploadedVideo.name}
                </p>
                <p className={`text-sm ${isDark ? "text-white/60" : "text-slate-600"}`}>
                  {(uploadedVideo.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
              <button
                onClick={handleReset}
                className={`px-4 py-2 text-sm rounded-lg transition-colors border ${
                  isDark
                    ? "text-red-200 border-red-500/30 hover:bg-red-900/30"
                    : "text-red-600 border-red-200 hover:bg-red-50"
                }`}
              >
                Smazat
              </button>
            </div>

            {/* Video přehrávač */}
            <video
              src={videoPreviewUrl}
              controls
              className="w-full rounded-lg"
            >
              Váš prohlížeč nepodporuje video tag.
            </video>
          </div>
        </div>
      )}
    </div>
  );
}
