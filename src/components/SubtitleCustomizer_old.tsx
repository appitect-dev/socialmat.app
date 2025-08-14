"use client";

import React, { useState, useEffect } from "react";
import { SubtitleStyle } from "@/lib/videoSubtitleProcessor";
import { VideoProject } from "@/types";
import {
  SubtitleSettingsManager,
  SubtitleSettings,
} from "@/lib/subtitleSettings";

export interface SubtitleCustomizerProps {
  onStyleChange?: (style: SubtitleStyle) => void;
  currentProject?: VideoProject | null;
}

export function SubtitleCustomizer({ onStyleChange }: SubtitleCustomizerProps) {
  const [settings, setSettings] = useState<SubtitleSettings>(
    SubtitleSettingsManager.load()
  );
  const [previewText, setPreviewText] = useState(
    "Sample subtitle text for preview"
  );

  useEffect(() => {
    if (onStyleChange) {
      onStyleChange(settings);
    }
  }, [settings, onStyleChange]);

  const updateSettings = (updates: Partial<SubtitleSettings>) => {
    setSettings((prev) => ({ ...prev, ...updates }));
  };

  const fontOptions = [
    "Arial Bold",
    "Arial",
    "Helvetica Bold",
    "Helvetica",
    "Times New Roman Bold",
    "Times New Roman",
    "Impact",
    "Trebuchet MS Bold",
    "Verdana Bold",
  ];

  const colorOptions = [
    { name: "White", value: "white", hex: "#ffffff" },
    { name: "Black", value: "black", hex: "#000000" },
    { name: "Red", value: "red", hex: "#ff0000" },
    { name: "Blue", value: "blue", hex: "#0000ff" },
    { name: "Green", value: "green", hex: "#00ff00" },
    { name: "Yellow", value: "yellow", hex: "#ffff00" },
    { name: "Orange", value: "orange", hex: "#ffa500" },
    { name: "Purple", value: "purple", hex: "#800080" },
  ];

  const backgroundOptions = [
    { name: "Semi-transparent Black", value: "black@0.8" },
    { name: "Semi-transparent White", value: "white@0.8" },
    { name: "Semi-transparent Gray", value: "gray@0.7" },
    { name: "Transparent", value: "transparent" },
    { name: "Solid Black", value: "black@1.0" },
    { name: "Solid White", value: "white@1.0" },
  ];

  const positionOptions = [
    { name: "Bottom", value: "bottom" as const },
    { name: "Top", value: "top" as const },
    { name: "Center", value: "center" as const },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          🎨 Subtitle Customizer
        </h2>
        <p className="text-gray-600">
          Customize the appearance of your video subtitles
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Style Controls - Takes up 2 columns */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">
            Style Settings
          </h3>

          <div className="space-y-6">
            {/* Font Settings */}
            <div className="space-y-4">
              <h4 className="text-lg font-medium text-gray-800">Font</h4>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Font Family
                </label>
                <select
                  value={settings.fontName}
                  onChange={(e) => updateSettings({ fontName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  {fontOptions.map((font) => (
                    <option key={font} value={font}>
                      {font}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Font Size: {settings.fontSize}px
                </label>
                <input
                  type="range"
                  min="16"
                  max="72"
                  value={settings.fontSize}
                  onChange={(e) =>
                    updateSettings({ fontSize: parseInt(e.target.value) })
                  }
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>16px</span>
                  <span>72px</span>
                </div>
              </div>
            </div>

            {/* Color Settings */}
            <div className="space-y-4">
              <h4 className="text-lg font-medium text-gray-800">Colors</h4>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Text Color
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {colorOptions.map((color) => (
                    <button
                      key={color.value}
                      onClick={() => updateSettings({ fontColor: color.value })}
                      className={`w-12 h-12 rounded-lg border-2 flex items-center justify-center text-xs font-medium ${
                        settings.fontColor === color.value
                          ? "border-blue-500 ring-2 ring-blue-200"
                          : "border-gray-300 hover:border-gray-400"
                      }`}
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                    >
                      {settings.fontColor === color.value && "✓"}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Outline Color
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {colorOptions.map((color) => (
                    <button
                      key={color.value}
                      onClick={() =>
                        updateSettings({ outlineColor: color.value })
                      }
                      className={`w-12 h-12 rounded-lg border-2 flex items-center justify-center text-xs font-medium ${
                        settings.outlineColor === color.value
                          ? "border-blue-500 ring-2 ring-blue-200"
                          : "border-gray-300 hover:border-gray-400"
                      }`}
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                    >
                      {settings.outlineColor === color.value && "✓"}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Outline Width: {settings.outlineWidth}px
                </label>
                <input
                  type="range"
                  min="0"
                  max="6"
                  value={settings.outlineWidth}
                  onChange={(e) =>
                    updateSettings({ outlineWidth: parseInt(e.target.value) })
                  }
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>None</span>
                  <span>Thick</span>
                </div>
              </div>
            </div>

            {/* Background */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Background
              </label>
              <select
                value={settings.backgroundColor}
                onChange={(e) =>
                  updateSettings({ backgroundColor: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                {backgroundOptions.map((bg) => (
                  <option key={bg.value} value={bg.value}>
                    {bg.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Position & Layout */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">
            Position & Layout
          </h3>

          <div className="space-y-6">
            {/* Position */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Position
              </label>
              <div className="grid grid-cols-3 gap-2">
                {positionOptions.map((pos) => (
                  <button
                    key={pos.value}
                    onClick={() => updateSettings({ position: pos.value })}
                    className={`px-4 py-3 text-sm font-medium rounded-lg border transition-all ${
                      settings.position === pos.value
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    {pos.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Margins */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vertical Margin: {settings.marginVertical}px
                </label>
                <input
                  type="range"
                  min="20"
                  max="120"
                  value={settings.marginVertical}
                  onChange={(e) =>
                    updateSettings({ marginVertical: parseInt(e.target.value) })
                  }
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Close</span>
                  <span>Far</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Horizontal Margin: {settings.marginHorizontal}px
                </label>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={settings.marginHorizontal}
                  onChange={(e) =>
                    updateSettings({
                      marginHorizontal: parseInt(e.target.value),
                    })
                  }
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Narrow</span>
                  <span>Wide</span>
                </div>
              </div>
            </div>

            {/* Words Per Chunk */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Words Per Subtitle: {settings.wordsPerChunk}
              </label>
              <input
                type="range"
                min="2"
                max="6"
                value={settings.wordsPerChunk}
                onChange={(e) =>
                  updateSettings({ wordsPerChunk: parseInt(e.target.value) })
                }
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>2 words</span>
                <span>6 words</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Shorter chunks are easier to read but appear more frequently
              </p>
            </div>

            {/* Preview Text Editor */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preview Text
              </label>
              <textarea
                value={previewText}
                onChange={(e) => setPreviewText(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter text to preview..."
              />
            </div>
          </div>
        </div>
      </div>

      {/* Live Preview */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Live Preview
        </h3>

        <div
          className="relative bg-gray-900 rounded-lg overflow-hidden"
          style={{ aspectRatio: "16/9", minHeight: "300px" }}
        >
          {/* Simulated video background */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 opacity-80"></div>
          <div className="absolute inset-0 bg-black opacity-30"></div>

          {/* Preview text positioned according to settings */}
          <div
            className={`absolute left-0 right-0 flex justify-center px-4 ${
              settings.position === "top"
                ? "top-0"
                : settings.position === "center"
                ? "top-1/2 -translate-y-1/2"
                : "bottom-0"
            }`}
            style={{
              [settings.position === "top"
                ? "paddingTop"
                : "paddingBottom"]: `${settings.marginVertical}px`,
              paddingLeft: `${settings.marginHorizontal}px`,
              paddingRight: `${settings.marginHorizontal}px`,
            }}
          >
            <div
              className="text-center px-2 py-1 rounded"
              style={{
                fontSize: `${Math.max(16, settings.fontSize! * 0.4)}px`, // Scale down for preview
                color:
                  settings.fontColor === "white"
                    ? "#ffffff"
                    : settings.fontColor === "black"
                    ? "#000000"
                    : settings.fontColor === "red"
                    ? "#ff0000"
                    : settings.fontColor === "blue"
                    ? "#0000ff"
                    : settings.fontColor === "green"
                    ? "#00ff00"
                    : settings.fontColor === "yellow"
                    ? "#ffff00"
                    : settings.fontColor === "orange"
                    ? "#ffa500"
                    : settings.fontColor === "purple"
                    ? "#800080"
                    : "#ffffff",
                fontFamily: settings.fontName?.includes("Bold")
                  ? "Arial, sans-serif"
                  : "Arial, sans-serif",
                fontWeight: settings.fontName?.includes("Bold")
                  ? "bold"
                  : "normal",
                textShadow:
                  settings.outlineWidth && settings.outlineWidth > 0
                    ? `0 0 ${settings.outlineWidth}px ${
                        settings.outlineColor === "black"
                          ? "#000000"
                          : "#ffffff"
                      }`
                    : "none",
                backgroundColor: settings.backgroundColor?.includes("@")
                  ? settings.backgroundColor.includes("black")
                    ? "rgba(0,0,0,0.8)"
                    : settings.backgroundColor.includes("white")
                    ? "rgba(255,255,255,0.8)"
                    : settings.backgroundColor.includes("gray")
                    ? "rgba(128,128,128,0.7)"
                    : "transparent"
                  : "transparent",
                lineHeight: 1.2,
                maxWidth: "90%",
              }}
            >
              {previewText}
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-4 justify-center">
          <div className="bg-blue-50 px-3 py-1 rounded-full text-sm text-blue-700">
            Font: {settings.fontName} • {settings.fontSize}px
          </div>
          <div className="bg-green-50 px-3 py-1 rounded-full text-sm text-green-700">
            Position: {settings.position} • {settings.marginVertical}px margin
          </div>
          <div className="bg-purple-50 px-3 py-1 rounded-full text-sm text-purple-700">
            Chunks: {settings.wordsPerChunk} words
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => {
              // Reset to defaults
              const defaultSettings = SubtitleSettingsManager.reset();
              setSettings(defaultSettings);
            }}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Reset to Default
          </button>

          <button
            onClick={() => {
              // Save settings
              SubtitleSettingsManager.save(settings);
              alert(
                "Subtitle style saved! These settings will be used for future videos."
              );
            }}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}
