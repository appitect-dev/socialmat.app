"use client";

import React, { useState, useEffect } from "react";
import { VideoUploader } from "@/components/VideoUploader";
import { VideoPlayer } from "@/components/VideoPlayer";
import { VideoInfo } from "@/components/VideoInfo";
import { SubtitleGenerator } from "@/components/SubtitleGenerator";
import { useDashboardTheme } from "./dashboard-theme";

// Typ pro video data
interface VideoData {
  file: File;
  url: string;
  uploadDate: Date;
  duration: number;
  resolution?: string;
}

export function Dashboard() {
  const { isDark, palette, toggleTheme } = useDashboardTheme();
  // Centrální state pro nahrané video
  const [videoData, setVideoData] = useState<VideoData | null>(null);
  // State pro délku videa (získáme z video elementu)
  const [videoDuration, setVideoDuration] = useState(0);
  // State pro stav zpracování
  const [processingStatus, setProcessingStatus] = useState<
    "uploaded" | "processing" | "ready"
  >("uploaded");

  // Handler pro když je video nahráno
  const handleVideoUploaded = (data: { file: File; url: string }) => {
    setVideoData({
      file: data.file,
      url: data.url,
      uploadDate: new Date(),
      duration: 0, // Bude aktualizováno z video elementu
    });
    setProcessingStatus("uploaded");
  };

  // Handler pro reset - nahrát nové video
  const handleReset = () => {
    if (videoData?.url) {
      URL.revokeObjectURL(videoData.url);
    }
    setVideoData(null);
    setVideoDuration(0);
    setProcessingStatus("uploaded");
  };

  // Handler pro úspěšné vygenerování titulků
  const handleSubtitlesSuccess = () => {
    setProcessingStatus("ready");
  };

  // Handler pro chybu při generování titulků
  const handleSubtitlesError = (error: string) => {
    console.error("Subtitle generation error:", error);
    setProcessingStatus("uploaded");
  };

  // Effect pro získání délky videa a rozlišení
  useEffect(() => {
    if (videoData?.url) {
      const video = document.createElement("video");
      video.src = videoData.url;
      video.onloadedmetadata = () => {
        const resolution = `${video.videoWidth} × ${video.videoHeight}`;
        setVideoDuration(video.duration);
        setVideoData((prev) =>
          prev
            ? { ...prev, duration: video.duration, resolution: resolution }
            : null
        );
      };

      return () => {
        video.src = "";
        video.load();
        // Revoke the previous object URL when it changes to avoid leaks
        URL.revokeObjectURL(videoData.url);
      };
    }
  }, [videoData?.url]);

  const panelClass = `${palette.card} rounded-3xl backdrop-blur`;
  const mutedText = isDark ? "text-white/70" : "text-slate-600";
  const badgeClass = isDark
    ? "inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold border border-indigo-300/50 text-indigo-200 bg-indigo-500/10 uppercase tracking-wide"
    : "inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold border border-indigo-200/60 text-indigo-700 bg-indigo-50/80 uppercase tracking-wide";

  return (
    <div
      className={`relative overflow-hidden min-h-screen ${palette.page} transition-colors`}
    >
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(99,102,241,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.35) 1px, transparent 1px)",
          backgroundSize: "120px 120px",
        }}
      />
      <div
        className="absolute -top-1/2 left-1/2 -translate-x-1/2 w-[140%] h-[120%] rounded-full blur-[160px] opacity-70 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 50% 40%, rgba(79,70,229,0.22), rgba(14,165,233,0.08), transparent 60%)",
        }}
      />

      <div className="relative max-w-6xl mx-auto px-4 py-12 space-y-8">
        {/* KROK 1: Video Uploader - zobrazí se když není video */}
        {!videoData && <VideoUploader onVideoUploaded={handleVideoUploaded} />}

        {/* KROK 2-4: Video Player + Info + Subtitle Generator */}
        {videoData && (
          <div className="space-y-6">
            {/* Tlačítko pro nahrání nového videa */}
            <div className="flex justify-end">
              <button
                onClick={handleReset}
                className={`px-4 py-2 text-sm rounded-full transition-all border ${palette.border} ${palette.accentButton} ${palette.accentButtonHover}`}
              >
                ← Nahrát nové video
              </button>
            </div>

            {/* Grid layout pro video player a info panel */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Video Player - zabere 2 sloupce na velkých obrazovkách */}
              <div className="lg:col-span-2">
                <VideoPlayer src={videoData.url} />
              </div>

              {/* Video Info panel - 1 sloupec na velkých obrazovkách */}
              <div className="space-y-6">
                <VideoInfo
                  fileName={videoData.file.name}
                  fileSize={videoData.file.size}
                  duration={videoDuration}
                  resolution={videoData.resolution}
                  uploadDate={videoData.uploadDate}
                  status={processingStatus}
                />

                {/* Subtitle Generator */}
                <SubtitleGenerator
                  videoFile={videoData.file}
                  onSuccess={handleSubtitlesSuccess}
                  onError={handleSubtitlesError}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
