"use client";

import React, { useState } from "react";
import {
  VideoProject,
  SubtitleSettings,
  AnimationSettings,
  SoundEffectSettings,
  FilterSettings,
} from "@/types";
import { VideoProcessingProgress } from "./VideoProcessingProgress";

interface VideoEditorProps {
  project: VideoProject;
  onUpdateProject: (updates: Partial<VideoProject>) => void;
  onProcessVideo: (project: VideoProject) => void;
}

export function VideoEditor({ project, onUpdateProject, onProcessVideo }: VideoEditorProps) {
  const [activeTab, setActiveTab] = useState<
    "subtitles" | "animations" | "sound" | "filters"
  >("subtitles");

  const updateSettings = (
    key: keyof VideoProject["settings"],
    value:
      | SubtitleSettings
      | AnimationSettings
      | SoundEffectSettings
      | FilterSettings
  ) => {
    onUpdateProject({
      settings: {
        ...project.settings,
        [key]: value,
      },
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          {project.name}
        </h2>
        <div className="flex items-center space-x-4 text-sm text-gray-500">
          <span>Duration: {Math.round(project.duration)}s</span>
          <span>Size: {(project.size / (1024 * 1024)).toFixed(2)} MB</span>
          <span>
            Resolution: {project.width}x{project.height}
          </span>
        </div>
      </div>

      <div className="flex">
        {/* Video Preview */}
        <div className="flex-1 p-6">
          <div className="aspect-video bg-black rounded-lg overflow-hidden relative">
            {project.outputUrl ? (
              <video
                src={project.outputUrl}
                controls
                className="w-full h-full object-contain"
                poster={project.outputUrl.replace('.mp4', '_thumb.jpg')}
              >
                Your browser does not support the video tag.
              </video>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-white text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-700 rounded-lg flex items-center justify-center">
                    📹
                  </div>
                  <p>Video Preview</p>
                  <p className="text-sm text-gray-400 mt-1">
                    {project.status === 'processing' ? 'Processing video...' : 'Original video loaded'}
                  </p>
                </div>
              </div>
            )}
          </div>

          {project.status === "processing" && (
            <div className="mt-4">
              <VideoProcessingProgress 
                isProcessing={true}
                progress={project.progress}
                onComplete={() => {
                  // This will be handled by the parent component
                }}
              />
            </div>
          )}
        </div>

        {/* Settings Panel */}
        <div className="w-80 border-l border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
              {(["subtitles", "animations", "sound", "filters"] as const).map(
                (tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 px-3 py-2 text-xs font-medium rounded-md capitalize transition-colors ${
                      activeTab === tab
                        ? "bg-white text-gray-900 shadow-sm"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    {tab}
                  </button>
                )
              )}
            </div>
          </div>

          <div className="p-4 space-y-6 max-h-96 overflow-y-auto">
            {activeTab === "subtitles" && (
              <SubtitlePanel
                settings={project.settings.subtitles}
                onUpdate={(settings) => updateSettings("subtitles", settings)}
              />
            )}
            {activeTab === "animations" && (
              <AnimationPanel
                settings={project.settings.animations}
                onUpdate={(settings) => updateSettings("animations", settings)}
              />
            )}
            {activeTab === "sound" && (
              <SoundPanel
                settings={project.settings.soundEffects}
                onUpdate={(settings) =>
                  updateSettings("soundEffects", settings)
                }
              />
            )}
            {activeTab === "filters" && (
              <FilterPanel
                settings={project.settings.filters}
                onUpdate={(settings) => updateSettings("filters", settings)}
              />
            )}
          </div>

          <div className="p-4 border-t border-gray-200">
            <button
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={project.status === "processing"}
              onClick={() => onProcessVideo(project)}
            >
              {project.status === "processing"
                ? "Processing..."
                : "Generate Video"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SubtitlePanel({
  settings,
  onUpdate,
}: {
  settings: SubtitleSettings;
  onUpdate: (settings: SubtitleSettings) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">
          Enable Subtitles
        </label>
        <input
          type="checkbox"
          checked={settings.enabled}
          onChange={(e) => onUpdate({ ...settings, enabled: e.target.checked })}
          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
      </div>

      {settings.enabled && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Style
            </label>
            <select
              value={settings.style}
              onChange={(e) =>
                onUpdate({
                  ...settings,
                  style: e.target.value as SubtitleSettings["style"],
                })
              }
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="modern">Modern</option>
              <option value="classic">Classic</option>
              <option value="bold">Bold</option>
              <option value="minimal">Minimal</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Position
            </label>
            <select
              value={settings.position}
              onChange={(e) =>
                onUpdate({
                  ...settings,
                  position: e.target.value as SubtitleSettings["position"],
                })
              }
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="bottom">Bottom</option>
              <option value="center">Center</option>
              <option value="top">Top</option>
            </select>
          </div>
        </>
      )}
    </div>
  );
}

function AnimationPanel({
  settings,
  onUpdate,
}: {
  settings: AnimationSettings;
  onUpdate: (settings: AnimationSettings) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">
          Enable Animations
        </label>
        <input
          type="checkbox"
          checked={settings.enabled}
          onChange={(e) => onUpdate({ ...settings, enabled: e.target.checked })}
          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
      </div>

      {settings.enabled && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Intensity
          </label>
          <input
            type="range"
            min="1"
            max="10"
            value={settings.intensity}
            onChange={(e) =>
              onUpdate({ ...settings, intensity: parseInt(e.target.value) })
            }
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Subtle</span>
            <span>Dramatic</span>
          </div>
        </div>
      )}
    </div>
  );
}

function SoundPanel({
  settings,
  onUpdate,
}: {
  settings: SoundEffectSettings;
  onUpdate: (settings: SoundEffectSettings) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">
          Enable Sound Effects
        </label>
        <input
          type="checkbox"
          checked={settings.enabled}
          onChange={(e) => onUpdate({ ...settings, enabled: e.target.checked })}
          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
      </div>

      {settings.enabled && (
        <>
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">
              Background Music
            </label>
            <input
              type="checkbox"
              checked={settings.backgroundMusic}
              onChange={(e) =>
                onUpdate({ ...settings, backgroundMusic: e.target.checked })
              }
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </div>

          {settings.backgroundMusic && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Music Volume
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={settings.musicVolume}
                onChange={(e) =>
                  onUpdate({
                    ...settings,
                    musicVolume: parseInt(e.target.value),
                  })
                }
                className="w-full"
              />
              <div className="text-center text-xs text-gray-500 mt-1">
                {settings.musicVolume}%
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function FilterPanel({
  settings,
  onUpdate,
}: {
  settings: FilterSettings;
  onUpdate: (settings: FilterSettings) => void;
}) {
  const filters = [
    {
      key: "brightness" as keyof FilterSettings,
      label: "Brightness",
      min: -100,
      max: 100,
    },
    {
      key: "contrast" as keyof FilterSettings,
      label: "Contrast",
      min: -100,
      max: 100,
    },
    {
      key: "saturation" as keyof FilterSettings,
      label: "Saturation",
      min: -100,
      max: 100,
    },
  ];

  return (
    <div className="space-y-4">
      {filters.map((filter) => (
        <div key={filter.key}>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {filter.label}
          </label>
          <input
            type="range"
            min={filter.min}
            max={filter.max}
            value={settings[filter.key] as number}
            onChange={(e) =>
              onUpdate({
                ...settings,
                [filter.key]: parseInt(e.target.value),
              })
            }
            className="w-full"
          />
          <div className="text-center text-xs text-gray-500 mt-1">
            {settings[filter.key]}
          </div>
        </div>
      ))}
    </div>
  );
}
