"use client";

import React, { useCallback, useState } from "react";

interface VideoUploaderProps {
  onVideoUpload: (file: File) => void;
  isUploading: boolean;
}

export function VideoUploader({
  onVideoUpload,
  isUploading,
}: VideoUploaderProps) {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);

      const files = Array.from(e.dataTransfer.files);
      const file = files[0];

      if (file && file.type.startsWith("video/")) {
        onVideoUpload(file);
      }
    },
    [onVideoUpload]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file && file.type.startsWith("video/")) {
        onVideoUpload(file);
      }
    },
    [onVideoUpload]
  );

  return (
    <div className="w-full">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors
          ${
            isDragOver
              ? "border-blue-400 bg-blue-50"
              : "border-gray-300 hover:border-gray-400"
          }
          ${isUploading ? "opacity-50 cursor-not-allowed" : ""}
        `}
      >
        <input
          type="file"
          accept="video/*"
          onChange={handleFileInput}
          className="hidden"
          id="video-upload"
          disabled={isUploading}
        />
        <label htmlFor="video-upload" className="cursor-pointer">
          <div className="flex flex-col items-center space-y-4">
            {isUploading ? (
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            ) : (
              <div className="h-12 w-12 text-gray-400 flex items-center justify-center">
                📤
              </div>
            )}
            <div>
              <p className="text-lg font-medium text-gray-900 mb-2">
                {isUploading ? "Uploading..." : "Drop your video here"}
              </p>
              <p className="text-sm text-gray-500">
                {isUploading
                  ? "Please wait while we process your video"
                  : "or click to browse files (MP4, MOV, AVI, MKV, WebM)"}
              </p>
            </div>
          </div>
        </label>
      </div>

      {!isUploading && (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <FeatureCard
            icon="📹"
            title="Auto Subtitles"
            description="AI-powered subtitle generation with custom styling"
          />
          <FeatureCard
            icon="✨"
            title="Smart Animations"
            description="Dynamic transitions and effects for engaging content"
          />
          <FeatureCard
            icon="📝"
            title="Caption AI"
            description="Generate viral captions and hashtags automatically"
          />
        </div>
      )}
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div className="p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
      <div className="flex items-center space-x-3 mb-3">
        <div className="text-blue-600 text-2xl">{icon}</div>
        <h3 className="font-semibold text-gray-900">{title}</h3>
      </div>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );
}
