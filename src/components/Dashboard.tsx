"use client";

import React, { useState, useEffect } from "react";
import { VideoUploader } from "@/components/VideoUploader";
import { VideoPlayer } from "@/components/VideoPlayer";
import { VideoInfo } from "@/components/VideoInfo";
import { SubtitleGenerator } from "@/components/SubtitleGenerator";

// Typ pro video data
interface VideoData {
  file: File;
  url: string;
  uploadDate: Date;
  duration: number;
  resolution?: string;
}

export function Dashboard() {
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
    }
  }, [videoData?.url]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Nadpis */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            AI Subtitle Generator
          </h1>
          <p className="text-lg text-gray-600">
            Add AI-powered subtitles to your videos instantly
          </p>
        </div>

        {/* KROK 1: Video Uploader - zobrazí se když není video */}
        {!videoData && <VideoUploader onVideoUploaded={handleVideoUploaded} />}

        {/* KROK 2-4: Video Player + Info + Subtitle Generator */}
        {videoData && (
          <div className="space-y-6">
            {/* Tlačítko pro nahrání nového videa */}
            <div className="flex justify-end">
              <button
                onClick={handleReset}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-white rounded-lg transition-colors border border-gray-300"
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
