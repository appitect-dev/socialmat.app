"use client";

import React, { useEffect, useState } from "react";
import { VideoUploader } from "@/components/VideoUploader";
import { VideoPlayer } from "@/components/VideoPlayer";
import { VideoInfo } from "@/components/VideoInfo";
import { SubtitleGenerator } from "@/components/SubtitleGenerator";
import { ProjectsPanel } from "@/components/ProjectsPanel";
import { useDashboardTheme } from "@/components/dashboard-theme";

type VideoData = {
  file: File;
  url: string;
  uploadDate: Date;
  duration: number;
  resolution?: string;
};

export default function TitulkyPage() {
  const { isDark, palette } = useDashboardTheme();
  const [videoData, setVideoData] = useState<VideoData | null>(null);
  const [videoDuration, setVideoDuration] = useState(0);
  const [processingStatus, setProcessingStatus] = useState<
    "uploaded" | "processing" | "ready"
  >("uploaded");

  const handleVideoUploaded = (data: { file: File; url: string }) => {
    setVideoData({
      file: data.file,
      url: data.url,
      uploadDate: new Date(),
      duration: 0,
    });
    setProcessingStatus("uploaded");
  };

  const handleReset = () => {
    if (videoData?.url) {
      URL.revokeObjectURL(videoData.url);
    }
    setVideoData(null);
    setVideoDuration(0);
    setProcessingStatus("uploaded");
  };

  const handleSubtitlesSuccess = () => setProcessingStatus("ready");
  const handleSubtitlesError = () => setProcessingStatus("uploaded");

  useEffect(() => {
    if (videoData?.url) {
      const video = document.createElement("video");
      video.src = videoData.url;
      video.onloadedmetadata = () => {
        const resolution = `${video.videoWidth} × ${video.videoHeight}`;
        setVideoDuration(video.duration);
        setVideoData((prev) =>
          prev ? { ...prev, duration: video.duration, resolution } : null
        );
      };
      return () => {
        video.src = "";
        video.load();
        URL.revokeObjectURL(videoData.url);
      };
    }
  }, [videoData?.url]);

  return (
    <div
      className={`relative min-h-screen ${
        isDark
          ? "bg-black text-white"
          : "bg-gradient-to-b from-white via-slate-50 to-white text-slate-900"
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

      <div
        className="absolute -top-1/2 left-1/2 -translate-x-1/2 w-[140%] h-[120%] rounded-full blur-[160px] opacity-70 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 50% 40%, rgba(79,70,229,0.22), rgba(14,165,233,0.08), transparent 60%)",
        }}
      />

      <div className="relative max-w-6xl mx-auto px-4 py-12 space-y-12">
        <div className="text-center space-y-2">
          <h2
            className={`text-3xl font-bold ${
              isDark ? "text-white" : "text-slate-900"
            }`}
          >
            Titulky management
          </h2>
          <p className={isDark ? "text-white/70" : "text-slate-600"}>
            Tvorte, zobrazte a spravujte své titulky a jejich zpracování.
          </p>
        </div>
        <div className="space-y-6">
          {!videoData && (
            <VideoUploader onVideoUploaded={handleVideoUploaded} />
          )}

          {videoData && (
            <div className="space-y-6">
              <div className="flex justify-end">
                <button
                  onClick={handleReset}
                  className={`px-4 py-2 text-sm rounded-full transition-all border ${palette.border} ${palette.accentButton} ${palette.accentButtonHover}`}
                >
                  ← Nahrát nové video
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <VideoPlayer src={videoData.url} />
                </div>

                <div className="space-y-6">
                  <VideoInfo
                    fileName={videoData.file.name}
                    fileSize={videoData.file.size}
                    duration={videoDuration}
                    resolution={videoData.resolution}
                    uploadDate={videoData.uploadDate}
                    status={processingStatus}
                  />
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

        <div className="space-y-4">
          <ProjectsPanel />
        </div>
      </div>
    </div>
  );
}
