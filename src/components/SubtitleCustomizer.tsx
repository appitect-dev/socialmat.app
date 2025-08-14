"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { SubtitleStyle } from "@/lib/videoSubtitleProcessor";
import { VideoProject } from "@/types";
import { SubtitleSettingsManager, SubtitleSettings } from "@/lib/subtitleSettings";

export interface SubtitleCustomizerProps {
  onStyleChange?: (style: SubtitleStyle) => void;
  currentProject?: VideoProject | null;
}

export function SubtitleCustomizer({ onStyleChange }: SubtitleCustomizerProps) {
  const [settings, setSettings] = useState<SubtitleSettings>(SubtitleSettingsManager.load());
  const [previewText, setPreviewText] = useState("Upload a video to see your subtitles here");
  
  // Video processing states
  const [uploadedVideo, setUploadedVideo] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStage, setProcessingStage] = useState<'upload' | 'transcribe' | 'ready' | 'generating' | 'complete'>('upload');
  const [processedVideoUrl, setProcessedVideoUrl] = useState<string | null>(null);
  const [transcribedText, setTranscribedText] = useState<string>('');
  const [subtitleSegments, setSubtitleSegments] = useState<Array<{ start: number; end: number; text: string }>>([]);
  const [error, setError] = useState<string | null>(null);
  const [showLivePreview, setShowLivePreview] = useState(true);
  const [currentSubtitleIndex, setCurrentSubtitleIndex] = useState<number>(-1);
  const [videoCurrentTime, setVideoCurrentTime] = useState<number>(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (onStyleChange) {
      onStyleChange(settings);
    }
  }, [settings, onStyleChange]);

  const updateSettings = (updates: Partial<SubtitleSettings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  };

  // Find current subtitle based on video time
  const getCurrentSubtitle = useCallback((currentTime: number) => {
    const found = subtitleSegments.find(segment => 
      currentTime >= segment.start && currentTime <= segment.end
    );
    return found;
  }, [subtitleSegments]);

  // Handle video time updates
  const handleTimeUpdate = useCallback((currentTime: number) => {
    setVideoCurrentTime(currentTime);
    const currentSub = getCurrentSubtitle(currentTime);
    const newIndex = currentSub ? subtitleSegments.findIndex(seg => seg === currentSub) : -1;
    setCurrentSubtitleIndex(newIndex);
    
    // Always log for debugging
    console.log('Video time:', currentTime.toFixed(2), 'Segments:', subtitleSegments.length, 'Current sub:', currentSub?.text || 'NONE');
  }, [subtitleSegments, getCurrentSubtitle]);

  // Backup timer to poll video time (in case onTimeUpdate doesn't fire)
  useEffect(() => {
    const interval = setInterval(() => {
      if (videoRef.current) {
        const currentTime = videoRef.current.currentTime;
        const isPlaying = !videoRef.current.paused;
        
        if (isPlaying || Math.abs(currentTime - videoCurrentTime) > 0.1) {
          handleTimeUpdate(currentTime);
        }
      }
    }, 50); // Poll every 50ms for smoother updates

    return () => clearInterval(interval);
  }, [handleTimeUpdate, videoCurrentTime]);

  // Handle video upload and transcription only
  const handleVideoUpload = async (file: File) => {
    setError(null);
    setUploadedVideo(file);
    
    // Create video preview URL
    const url = URL.createObjectURL(file);
    setVideoUrl(url);
    
    // Start processing
    setIsProcessing(true);
    setProcessingStage('upload');
    
    try {
      // Upload video to temp directory
      const formData = new FormData();
      formData.append('video', file);
      
      setPreviewText("Transcribing audio...");
      setProcessingStage('transcribe');
      const uploadResponse = await fetch('/api/upload-temp-video', {
        method: 'POST',
        body: formData
      });
      
      if (!uploadResponse.ok) {
        throw new Error('Failed to upload video');
      }
      
      // Get transcription only (no subtitle processing yet)
      const transcriptionResponse = await fetch('/api/test-transcription', {
        method: 'POST',
        body: formData
      });      if (!transcriptionResponse.ok) {
        const errorData = await transcriptionResponse.json();
        throw new Error(errorData.error || 'Failed to transcribe video');
      }
      
      const transcriptionResult = await transcriptionResponse.json();
      
      // Extract the transcribed segments (they're in results.segments based on the API)
      const segments = transcriptionResult.results?.segments || transcriptionResult.subtitleSegments || [];
      setSubtitleSegments(segments);
      console.log('Loaded subtitle segments:', segments); // Debug logging
      const fullText = segments?.map((seg: { text: string }) => seg.text).join(' ') || '';
      setTranscribedText(fullText);
      
      // Update preview text with actual transcription
      if (fullText) {
        setPreviewText(fullText);
      }
      
      setProcessingStage('ready');
      setIsProcessing(false);
      
    } catch (error) {
      console.error('Processing error:', error);
      setError(error instanceof Error ? error.message : 'Processing failed');
      setIsProcessing(false);
    }
  };

  // Generate final video with current settings
  const generateFinalVideo = async () => {
    if (!uploadedVideo || !subtitleSegments.length) return;
    
    setError(null);
    setIsProcessing(true);
    setProcessingStage('generating');
    
    try {
      // Create form data with the original video file
      const formData = new FormData();
      formData.append('video', uploadedVideo);
      
      // Use the transcribed segments directly
      formData.append('segments', JSON.stringify(subtitleSegments));
      
      // Add current style settings
      formData.append('settings', JSON.stringify(settings));
      
      const subtitleResponse = await fetch('/api/add-subtitles', {
        method: 'POST',
        body: formData
      });
      
      if (!subtitleResponse.ok) {
        const errorData = await subtitleResponse.json();
        throw new Error(errorData.error || 'Failed to process subtitles');
      }
      
      const subtitleResult = await subtitleResponse.json();
      setProcessedVideoUrl(subtitleResult.videoUrl);
      setProcessingStage('complete');
      
    } catch (error) {
      console.error('Generation error:', error);
      setError(error instanceof Error ? error.message : 'Generation failed');
      setProcessingStage('ready'); // Go back to ready state on error
    } finally {
      setIsProcessing(false);
    }
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
        <p className="text-gray-600">Upload, customize, and download your subtitled videos</p>
      </div>

      {/* Video Upload Section */}
      {!uploadedVideo && (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200 p-8">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-4">
              📹
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Upload Your Video</h3>
            <p className="text-gray-600 mb-6">Upload a video to add AI-generated subtitles</p>
            
            <label className="cursor-pointer">
              <input
                type="file"
                accept="video/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleVideoUpload(file);
                }}
                className="hidden"
              />
              <div className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                Choose Video File
              </div>
            </label>
            
            <p className="text-sm text-gray-500 mt-3">
              Supports MP4, MOV, AVI • Max 100MB • Perfect for TikTok & Instagram Reels
            </p>
          </div>
        </div>
      )}

      {/* Processing Status */}
      {isProcessing && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-4 animate-pulse">
              ⚡
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Processing Your Video</h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-center space-x-4">
                <div className={`w-3 h-3 rounded-full ${processingStage === 'upload' ? 'bg-blue-500 animate-pulse' : processingStage === 'transcribe' || processingStage === 'ready' || processingStage === 'generating' || processingStage === 'complete' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                <span className="text-sm">Uploading</span>
                
                <div className={`w-3 h-3 rounded-full ${processingStage === 'transcribe' ? 'bg-blue-500 animate-pulse' : processingStage === 'ready' || processingStage === 'generating' || processingStage === 'complete' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                <span className="text-sm">Transcribing</span>
                
                <div className={`w-3 h-3 rounded-full ${processingStage === 'ready' ? 'bg-green-500' : processingStage === 'generating' ? 'bg-blue-500 animate-pulse' : processingStage === 'complete' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                <span className="text-sm">Ready</span>
              </div>
              
              <p className="text-sm text-gray-600">
                {processingStage === 'upload' && 'Uploading your video...'}
                {processingStage === 'transcribe' && 'Extracting audio and transcribing with AI...'}
                {processingStage === 'ready' && 'Ready! Customize your subtitles below.'}
                {processingStage === 'generating' && 'Generating final video with your style...'}
                {processingStage === 'complete' && 'Final video ready for download!'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <span className="text-red-400">⚠️</span>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Processing Error</h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
              <button
                onClick={() => setError(null)}
                className="mt-2 text-sm text-red-600 hover:text-red-500 underline"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content - Only show when video is uploaded */}
      {uploadedVideo && (
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

        {/* Video Preview - Takes up 1 column */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              📱 {processedVideoUrl ? 'Final Video' : 'Original Video'}
            </h3>
            
            {/* Video preview */}
            <div className="mx-auto bg-black rounded-lg overflow-hidden relative" style={{ width: '200px', height: '356px' }}>
              {videoUrl && (
                <>
                  <video
                    ref={videoRef}
                    src={videoUrl}
                    controls
                    className="w-full h-full object-cover"
                    style={{ objectFit: 'cover' }}
                    onTimeUpdate={(e) => {
                      const video = e.target as HTMLVideoElement;
                      handleTimeUpdate(video.currentTime);
                    }}
                    onLoadedMetadata={(e) => {
                      const video = e.target as HTMLVideoElement;
                      console.log('Video loaded, duration:', video.duration);
                      console.log('Total subtitle segments:', subtitleSegments.length);
                      if (subtitleSegments.length > 0) {
                        console.log('First segment timing:', subtitleSegments[0].start, '-', subtitleSegments[0].end);
                      }
                    }}
                    onPlay={() => console.log('Video started playing')}
                    onPause={() => console.log('Video paused')}
                  />
                  
                  {/* Live Subtitle Preview Overlay */}
                  {showLivePreview && (processingStage === 'ready' || processingStage === 'generating' || processingStage === 'complete') && (
                    <div 
                      className={`absolute left-0 right-0 flex justify-center px-2 pointer-events-none ${
                        settings.position === 'top' ? 'top-0' :
                        settings.position === 'center' ? 'top-1/2 -translate-y-1/2' :
                        'bottom-0'
                      }`}
                      style={{ 
                        [settings.position === 'top' ? 'paddingTop' : 'paddingBottom']: `${Math.max(20, settings.marginVertical! * 0.6)}px`,
                        paddingLeft: `${Math.max(12, settings.marginHorizontal! * 0.3)}px`,
                        paddingRight: `${Math.max(12, settings.marginHorizontal! * 0.3)}px`
                      }}
                    >
                      {(() => {
                        // Get current subtitle based on video time - recalculate each render
                        const currentTime = videoCurrentTime;
                        const currentSubtitle = subtitleSegments.find(segment => 
                          currentTime >= segment.start && currentTime <= segment.end
                        );
                        let displayText = currentSubtitle?.text || '';
                        
                        // If no current subtitle (video paused or between segments), show first subtitle as preview
                        if (!displayText && subtitleSegments.length > 0) {
                          displayText = subtitleSegments[0].text;
                        }
                        
                        // Apply word chunking to the current subtitle
                        const words = displayText.split(' ');
                        const chunkedText = words.slice(0, settings.wordsPerChunk).join(' ');
                        
                        // Always show something for debugging - include time info
                        const finalText = chunkedText || `Time: ${currentTime.toFixed(1)}s`;
                        
                        return (
                          <div
                            className="text-center px-2 py-1 rounded max-w-full transition-all duration-200"
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
                                `0 0 ${Math.max(2, settings.outlineWidth * 1)}px ${settings.outlineColor === 'black' ? '#000000' : '#ffffff'}, 
                                 1px 1px ${Math.max(2, settings.outlineWidth * 1)}px ${settings.outlineColor === 'black' ? '#000000' : '#ffffff'},
                                 -1px -1px ${Math.max(2, settings.outlineWidth * 1)}px ${settings.outlineColor === 'black' ? '#000000' : '#ffffff'},
                                 -1px 1px ${Math.max(2, settings.outlineWidth * 1)}px ${settings.outlineColor === 'black' ? '#000000' : '#ffffff'},
                                 1px -1px ${Math.max(2, settings.outlineWidth * 1)}px ${settings.outlineColor === 'black' ? '#000000' : '#ffffff'}` : 
                                '2px 2px 4px rgba(0,0,0,0.8), -1px -1px 2px rgba(0,0,0,0.8)',
                              backgroundColor: settings.backgroundColor?.includes('@') ? 
                                (settings.backgroundColor.includes('black') ? 'rgba(0,0,0,0.8)' :
                                 settings.backgroundColor.includes('white') ? 'rgba(255,255,255,0.8)' :
                                 settings.backgroundColor.includes('gray') ? 'rgba(128,128,128,0.7)' : 'rgba(0,0,0,0.6)') :
                                'rgba(0,0,0,0.6)',
                              lineHeight: 1.3,
                              wordBreak: 'break-word' as const,
                              borderRadius: '6px',
                              minHeight: '20px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              border: '1px solid rgba(255,255,255,0.3)'
                            }}
                          >
                            {finalText}
                          </div>
                        );
                      })()}
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Video Status and Controls */}
            <div className="mt-4 text-center space-y-3">
              {/* Debug info - remove this later */}
              <div className="text-xs text-gray-400 border p-2 rounded space-y-1">
                <div>Stage: {processingStage} | Preview: {showLivePreview ? 'ON' : 'OFF'} | Segments: {subtitleSegments.length}</div>
                <div>Time: {videoCurrentTime.toFixed(1)}s | Current: {getCurrentSubtitle(videoCurrentTime)?.text || 'none'}</div>
                {subtitleSegments.length > 0 && (
                  <div className="text-xs">
                    First segment: {subtitleSegments[0].start}s-{subtitleSegments[0].end}s: &ldquo;{subtitleSegments[0].text}&rdquo;
                  </div>
                )}
              </div>
              
              {processingStage === 'ready' ? (
                <div className="space-y-3">
                  <div className="bg-green-50 px-3 py-2 rounded text-sm text-green-700">
                    ✅ Video transcribed! Customize subtitles below.
                  </div>
                  
                  {/* Live Preview Toggle */}
                  <div className="flex items-center justify-center space-x-2 text-sm">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={showLivePreview}
                        onChange={(e) => setShowLivePreview(e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-gray-700">Live Preview</span>
                    </label>
                  </div>
                  
                  <div className="space-y-2">
                    {/* Instant Preview Notice */}
                    <div className="bg-blue-50 px-3 py-2 rounded text-xs text-blue-700">
                      🎨 Style changes appear instantly above
                    </div>
                    
                    <button
                      onClick={generateFinalVideo}
                      disabled={isProcessing}
                      className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
                    >
                      {isProcessing ? 'Processing...' : '🎬 Generate Final Video'}
                    </button>
                  </div>
                </div>
              ) : processingStage === 'complete' ? (
                <div className="space-y-3">
                  <div className="bg-green-50 px-3 py-2 rounded text-sm text-green-700">
                    🎉 Final video ready!
                  </div>
                  
                  <div className="space-y-2">
                    {processedVideoUrl && (
                      <a
                        href={`http://localhost:3000${processedVideoUrl}`}
                        download
                        className="block w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-center text-sm"
                      >
                        📥 Download Final Video
                      </a>
                    )}
                    
                    <button
                      onClick={generateFinalVideo}
                      disabled={isProcessing}
                      className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
                    >
                      🔄 Regenerate with New Style
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-yellow-50 px-3 py-2 rounded text-sm text-yellow-700">
                  ⏳ Processing in progress...
                </div>
              )}
            </div>

            {/* Preview Text Editor */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preview Text
              </label>
              <textarea
                value={previewText}
                onChange={(e) => setPreviewText(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter text to preview subtitle styling..."
              />
              <p className="text-xs text-gray-500 mt-1">
                💡 Changes appear instantly in the video preview above
              </p>
            </div>

            {/* Current Settings Summary */}
            <div className="mt-4 space-y-2">
              <div className="bg-blue-50 px-3 py-1 rounded text-xs text-blue-700">
                {settings.fontName} • {settings.fontSize}px
              </div>
              <div className="bg-green-50 px-3 py-1 rounded text-xs text-green-700">
                {settings.position} • {settings.wordsPerChunk} words
              </div>
              {showLivePreview && processingStage === 'complete' && (
                <div className="bg-purple-50 px-3 py-1 rounded text-xs text-purple-700 animate-pulse">
                  🔴 Live Preview Active
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      )} {/* Close the uploadedVideo conditional */}

      {/* Action Buttons - Only show when video is processed */}
      {processingStage === 'complete' && (
        <div className="flex justify-center space-x-4 pt-6">
          <button 
            onClick={() => {
              // Reset and start over
              setUploadedVideo(null);
              setVideoUrl(null);
              setProcessedVideoUrl(null);
              setProcessingStage('upload');
              setError(null);
              const defaultSettings = SubtitleSettingsManager.reset();
              setSettings(defaultSettings);
            }}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Upload New Video
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
      )}
      
    </div>
  );
}
