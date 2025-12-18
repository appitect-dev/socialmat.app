"use client";

import React, { useState, useEffect } from "react";
import { VideoUploader } from "@/components/VideoUploader";
import { VideoPlayer } from "@/components/VideoPlayer";
import { VideoInfo } from "@/components/VideoInfo";
import { SubtitleGenerator } from "@/components/SubtitleGenerator";
import { useDashboardTheme } from "./dashboard-theme";
import { LargeNumberLike } from "crypto";

// Typ pro video data

interface IgInsights {
  name: string;
  values: {
    value: number;
    end_time?: string;
  }[];
}
interface VideoData {
  file: File;
  url: string;
  uploadDate: Date;
  duration: number;
  resolution?: string;
}
const IG_METRIC_LABELS: Record<string, string> = {
  reach: "Reach",
  profile_views: "Profile views",
  accounts_engaged: "Accounts engaged",
  follower_count: "Followers",
};

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

  const [igConnected, setIgConnected] = useState<boolean>(false);

  const [igInsights, setIgInsights] = useState<IgInsights[] | null>(null);
  const [igLoading, setIgLoading] = useState(false);
  const [igError, setIgError] = useState<string | null>(null);

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

  useEffect(() => {
    const raw = localStorage.getItem("ig_auth");
    if (!raw) {
      setIgConnected(false);
      return;
    }

    try {
      const ig = JSON.parse(raw);
      const isValid =
        typeof ig.expiresAt === "number" && Date.now() < ig.expiresAt;
      setIgConnected(isValid);

      if (!isValid) localStorage.removeItem("ig_auth");
    } catch {
      localStorage.removeItem("ig_auth");
      setIgConnected(false);
    }
  }, []);

  useEffect(() => {
    if (!igConnected) return;

    setIgLoading(true);
    setIgError(null);

    fetch("/api/instagram/insights")
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to load insights");
        return res.json();
      })
      .then((data) => {
        setIgInsights(data.data);
      })
      .catch((err) => {
        console.error(err);
        setIgError("Failed to load Instagram insights");
      })
      .finally(() => {
        setIgLoading(false);
      });
  }, [igConnected]);

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

  const pageClass = isDark
    ? "bg-black text-white"
    : "bg-gradient-to-b from-white via-slate-50 to-white text-slate-900";

  return (
    <div
      className={`relative overflow-hidden min-h-screen ${pageClass} transition-colors`}
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
      <div
        className="absolute -top-1/2 left-1/2 -translate-x-1/2 w-[140%] h-[120%] rounded-full blur-[160px] opacity-70 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 50% 40%, rgba(79,70,229,0.22), rgba(14,165,233,0.08), transparent 60%)",
        }}
      />
      <div style={{ marginBottom: 12 }}>
        Instagram: <b>{igConnected ? "Connected" : "Not connected"}</b>
      </div>
      <button
        onClick={() => {
          window.location.href = "/api/instagram/login";
        }}
      >
        {igConnected ? "Reconnect Instagram" : "Connect Instagram"}
      </button>
      {igConnected && (
        <div className="mt-4 space-y-2">
          {igLoading && <div>Loading Instagram insights…</div>}

          {igError && <div className="text-red-500">{igError}</div>}

          {igInsights && (
            <div className="grid grid-cols-2 gap-4">
              {igInsights.map((metric) => (
                <div key={metric.name} className="p-3 rounded-lg border">
                  <div className="text-sm opacity-70">
                    {IG_METRIC_LABELS[metric.name] ?? metric.name}
                  </div>
                  <div className="text-xl font-semibold">
                    {metric.values.at(-1)?.value ?? "—"}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

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
