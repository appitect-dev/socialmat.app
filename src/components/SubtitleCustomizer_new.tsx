"use client";

import React, { useState, useEffect } from "react";
import { SubtitleStyle } from "@/lib/videoSubtitleProcessor";
import { VideoProject } from "@/types";
import { SubtitleSettingsManager, SubtitleSettings } from "@/lib/subtitleSettings";

export interface SubtitleCustomizerProps {
  onStyleChange?: (style: SubtitleStyle) => void;
  currentProject?: VideoProject | null;
}

export function SubtitleCustomizer({ onStyleChange }: SubtitleCustomizerProps) {
  const [settings, setSettings] = useState<SubtitleSettings>(SubtitleSettingsManager.load());
  const [previewText, setPreviewText] = useState("Sample subtitle text for mobile video");

  useEffect(() => {
    if (onStyleChange) {
      onStyleChange(settings);
    }
  }, [settings, onStyleChange]);

  const updateSettings = (updates: Partial<SubtitleSettings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  };

  const fontOptions = [
    'Arial Bold',
    'Arial',
    'Helvetica Bold',
    'Helvetica',
    'Times New Roman Bold',
    'Times New Roman',
    'Impact',
    'Trebuchet MS Bold',
    'Verdana Bold'
  ];

  const colorOptions = [
    { name: 'White', value: 'white', hex: '#ffffff' },
    { name: 'Black', value: 'black', hex: '#000000' },
    { name: 'Red', value: 'red', hex: '#ff0000' },
    { name: 'Blue', value: 'blue', hex: '#0000ff' },
    { name: 'Green', value: 'green', hex: '#00ff00' },
    { name: 'Yellow', value: 'yellow', hex: '#ffff00' },
    { name: 'Orange', value: 'orange', hex: '#ffa500' },
    { name: 'Purple', value: 'purple', hex: '#800080' }
  ];

  const backgroundOptions = [
    { name: 'Semi-transparent Black', value: 'black@0.8' },
    { name: 'Semi-transparent White', value: 'white@0.8' },
    { name: 'Semi-transparent Gray', value: 'gray@0.7' },
    { name: 'Transparent', value: 'transparent' },
    { name: 'Solid Black', value: 'black@1.0' },
    { name: 'Solid White', value: 'white@1.0' }
  ];

  const positionOptions = [
    { name: 'Bottom', value: 'bottom' as const },
    { name: 'Top', value: 'top' as const },
    { name: 'Center', value: 'center' as const }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">🎨 Subtitle Customizer</h2>
        <p className="text-gray-600">Customize subtitles for Instagram Reels and TikTok</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Style Controls - Takes up 2 columns */}
        <div className="lg:col-span-2 space-y-6">
          {/* Font Settings */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Font Settings</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Font Family
                </label>
                <select
                  value={settings.fontName}
                  onChange={(e) => updateSettings({ fontName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  {fontOptions.map(font => (
                    <option key={font} value={font}>{font}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Font Size: {settings.fontSize}px
                </label>
                <input
                  type="range"
                  min="20"
                  max="48"
                  value={settings.fontSize}
                  onChange={(e) => updateSettings({ fontSize: parseInt(e.target.value) })}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>20px (Small)</span>
                  <span>48px (Large)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Color Settings */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Colors & Style</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Text Color
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {colorOptions.map(color => (
                    <button
                      key={color.value}
                      onClick={() => updateSettings({ fontColor: color.value })}
                      className={`w-12 h-12 rounded-lg border-2 flex items-center justify-center text-xs font-medium ${
                        settings.fontColor === color.value 
                          ? 'border-blue-500 ring-2 ring-blue-200' 
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                    >
                      {settings.fontColor === color.value && '✓'}
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
                  onChange={(e) => updateSettings({ outlineWidth: parseInt(e.target.value) })}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>None</span>
                  <span>Thick</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Background
                </label>
                <select
                  value={settings.backgroundColor}
                  onChange={(e) => updateSettings({ backgroundColor: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  {backgroundOptions.map(bg => (
                    <option key={bg.value} value={bg.value}>{bg.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Position & Layout */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Position & Timing</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Position
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {positionOptions.map(pos => (
                    <button
                      key={pos.value}
                      onClick={() => updateSettings({ position: pos.value })}
                      className={`px-4 py-3 text-sm font-medium rounded-lg border transition-all ${
                        settings.position === pos.value
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      {pos.name}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vertical Margin: {settings.marginVertical}px
                </label>
                <input
                  type="range"
                  min="20"
                  max="100"
                  value={settings.marginVertical}
                  onChange={(e) => updateSettings({ marginVertical: parseInt(e.target.value) })}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Close</span>
                  <span>Far</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Words Per Subtitle: {settings.wordsPerChunk}
                </label>
                <input
                  type="range"
                  min="2"
                  max="6"
                  value={settings.wordsPerChunk}
                  onChange={(e) => updateSettings({ wordsPerChunk: parseInt(e.target.value) })}
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
            </div>
          </div>
        </div>

        {/* Mobile Preview - Takes up 1 column */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">📱 Mobile Preview</h3>
            
            {/* Mobile format preview (9:16 aspect ratio) */}
            <div className="mx-auto bg-black rounded-lg overflow-hidden" style={{ width: '200px', height: '356px' }}>
              {/* Simulated mobile video background */}
              <div className="relative w-full h-full bg-gradient-to-b from-purple-600 via-pink-600 to-blue-600">
                <div className="absolute inset-0 bg-black opacity-20"></div>
                
                {/* Sample content area */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-white text-center">
                    <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full mx-auto mb-4 flex items-center justify-center">
                      🎬
                    </div>
                    <p className="text-xs opacity-75">Your video content here</p>
                  </div>
                </div>
                
                {/* Preview subtitles positioned according to style */}
                <div 
                  className={`absolute left-0 right-0 flex justify-center px-4 ${
                    settings.position === 'top' ? 'top-0' :
                    settings.position === 'center' ? 'top-1/2 -translate-y-1/2' :
                    'bottom-0'
                  }`}
                  style={{ 
                    [settings.position === 'top' ? 'paddingTop' : 'paddingBottom']: `${Math.max(20, settings.marginVertical! * 0.5)}px`,
                    paddingLeft: `${Math.max(16, settings.marginHorizontal! * 0.4)}px`,
                    paddingRight: `${Math.max(16, settings.marginHorizontal! * 0.4)}px`
                  }}
                >
                  <div
                    className="text-center px-2 py-1 rounded max-w-full"
                    style={{
                      fontSize: `${Math.max(12, settings.fontSize! * 0.3)}px`,
                      color: settings.fontColor === 'white' ? '#ffffff' : 
                             settings.fontColor === 'black' ? '#000000' :
                             settings.fontColor === 'red' ? '#ff0000' :
                             settings.fontColor === 'blue' ? '#0000ff' :
                             settings.fontColor === 'green' ? '#00ff00' :
                             settings.fontColor === 'yellow' ? '#ffff00' :
                             settings.fontColor === 'orange' ? '#ffa500' :
                             settings.fontColor === 'purple' ? '#800080' : '#ffffff',
                      fontFamily: settings.fontName?.includes('Bold') ? 'Arial, sans-serif' : 'Arial, sans-serif',
                      fontWeight: settings.fontName?.includes('Bold') ? 'bold' : 'normal',
                      textShadow: settings.outlineWidth && settings.outlineWidth > 0 ? 
                        `0 0 ${Math.max(1, settings.outlineWidth * 0.8)}px ${settings.outlineColor === 'black' ? '#000000' : '#ffffff'}` : 
                        'none',
                      backgroundColor: settings.backgroundColor?.includes('@') ? 
                        (settings.backgroundColor.includes('black') ? 'rgba(0,0,0,0.8)' :
                         settings.backgroundColor.includes('white') ? 'rgba(255,255,255,0.8)' :
                         settings.backgroundColor.includes('gray') ? 'rgba(128,128,128,0.7)' : 'transparent') :
                        'transparent',
                      lineHeight: 1.2,
                      wordBreak: 'break-word' as const
                    }}
                  >
                    {previewText.split(' ').slice(0, settings.wordsPerChunk).join(' ')}
                  </div>
                </div>
              </div>
            </div>

            {/* Preview Settings */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preview Text
              </label>
              <textarea
                value={previewText}
                onChange={(e) => setPreviewText(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter text to preview..."
              />
            </div>

            {/* Current Settings Summary */}
            <div className="mt-4 space-y-2">
              <div className="bg-blue-50 px-3 py-1 rounded text-xs text-blue-700">
                {settings.fontName} • {settings.fontSize}px
              </div>
              <div className="bg-green-50 px-3 py-1 rounded text-xs text-green-700">
                {settings.position} • {settings.wordsPerChunk} words
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center space-x-4 pt-6">
        <button 
          onClick={() => {
            const defaultSettings = SubtitleSettingsManager.reset();
            setSettings(defaultSettings);
          }}
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Reset to Default
        </button>
        
        <button 
          onClick={() => {
            SubtitleSettingsManager.save(settings);
            alert('Subtitle style saved! These settings will be used for future videos.');
          }}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Save Settings
        </button>
      </div>
    </div>
  );
}
