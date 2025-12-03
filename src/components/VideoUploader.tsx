"use client";

import React, { useState } from "react";
import { useDropzone } from "react-dropzone";

// Props pro VideoUploader komponentu
interface VideoUploaderProps {
  onVideoUploaded?: (videoData: { file: File; url: string }) => void;
}

export function VideoUploader({ onVideoUploaded }: VideoUploaderProps) {
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
    <div className="max-w-2xl mx-auto text-white">
      {/* Dropzone oblast */}
      {!uploadedVideo && (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-colors bg-transparent ${
            isDragActive
              ? "border-yellow-400 bg-yellow-400/5"
              : "border-white/15 hover:border-yellow-400/70"
          }`}
        >
          <input {...getInputProps()} />
          <div className="space-y-4">
            <div className="text-6xl">🎬</div>
            {isDragActive ? (
              <p className="text-lg text-yellow-400">Přetáhněte video sem...</p>
            ) : (
              <>
                <p className="text-lg text-white font-medium">
                  Přetáhněte video sem nebo klikněte pro výběr
                </p>
                <p className="text-sm text-white/60">
                  Podporova2né formáty: MP4, MOV, AVI (max. 100MB)
                </p>
              </>
            )}
          </div>
        </div>
      )}

      {/* Chybová hláška */}
      {error && (
        <div className="mt-4 p-4 bg-red-900/30 border border-red-500/40 rounded-lg">
          <p className="text-red-200">⚠️ {error}</p>
        </div>
      )}

      {/* Progress bar během nahrávání */}
      {uploadedVideo && uploadProgress < 100 && (
        <div className="mt-6 space-y-2">
          <p className="text-sm text-white/70">Nahrávání videa...</p>
          <div className="w-full bg-white/10 rounded-full h-3">
            <div
              className="bg-yellow-400 h-3 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
          <p className="text-sm text-white/70 text-right">{uploadProgress}%</p>
        </div>
      )}

      {/* Náhled nahraného videa */}
      {uploadedVideo && uploadProgress === 100 && (
        <div className="mt-6 space-y-4">
          <div className="p-4 bg-green-900/30 border border-green-500/40 rounded-lg">
            <p className="text-green-200">✅ Video úspěšně nahráno!</p>
          </div>

          {/* Video náhled */}
          <div className="bg-[#0f0f14] border border-white/10 rounded-lg shadow-md p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-white">{uploadedVideo.name}</p>
                <p className="text-sm text-white/60">
                  {(uploadedVideo.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
              <button
                onClick={handleReset}
                className="px-4 py-2 text-sm text-red-200 hover:bg-red-900/40 rounded-lg transition-colors"
              >
                Smazat
              </button>
            </div>

            {/* Video přehrávač */}
            <video src={videoPreviewUrl} controls className="w-full rounded-lg">
              Váš prohlížeč nepodporuje video tag.
            </video>
          </div>
        </div>
      )}
    </div>
  );
}
