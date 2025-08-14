"use client";

import React, { useEffect, useState } from 'react';

interface ProcessingStatus {
  phase: 'uploading' | 'extracting' | 'processing' | 'rendering' | 'completed' | 'error';
  progress: number;
  message: string;
  details?: string;
}

interface VideoProcessingProgressProps {
  isProcessing: boolean;
  progress: number;
  onComplete?: () => void;
  onError?: (error: string) => void;
}

export function VideoProcessingProgress({ 
  isProcessing, 
  progress, 
  onComplete, 
  onError 
}: VideoProcessingProgressProps) {
  const [status, setStatus] = useState<ProcessingStatus>({
    phase: 'uploading',
    progress: 0,
    message: 'Preparing video...',
  });

  useEffect(() => {
    if (!isProcessing) return;

    // Simulate different processing phases
    const updateStatus = () => {
      if (progress < 20) {
        setStatus({
          phase: 'extracting',
          progress,
          message: 'Extracting audio for subtitle generation...',
          details: 'Analyzing speech patterns'
        });
      } else if (progress < 50) {
        setStatus({
          phase: 'processing',
          progress,
          message: 'Applying AI enhancements...',
          details: 'Adding animations and effects'
        });
      } else if (progress < 80) {
        setStatus({
          phase: 'processing',
          progress,
          message: 'Generating subtitles...',
          details: 'Using AI speech recognition'
        });
      } else if (progress < 95) {
        setStatus({
          phase: 'rendering',
          progress,
          message: 'Rendering final video...',
          details: 'Combining all elements'
        });
      } else if (progress >= 100) {
        setStatus({
          phase: 'completed',
          progress: 100,
          message: 'Video processing complete!',
          details: 'Your enhanced video is ready'
        });
        onComplete?.();
      }
    };

    updateStatus();
  }, [progress, isProcessing, onComplete]);

  if (!isProcessing) return null;

  const getPhaseIcon = (phase: ProcessingStatus['phase']) => {
    switch (phase) {
      case 'extracting': return '🎵';
      case 'processing': return '⚡';
      case 'rendering': return '🎬';
      case 'completed': return '✅';
      case 'error': return '❌';
      default: return '📤';
    }
  };

  const getPhaseColor = (phase: ProcessingStatus['phase']) => {
    switch (phase) {
      case 'completed': return 'text-green-600';
      case 'error': return 'text-red-600';
      case 'processing': return 'text-blue-600';
      case 'rendering': return 'text-purple-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="text-2xl">{getPhaseIcon(status.phase)}</div>
          <div>
            <h3 className={`font-semibold ${getPhaseColor(status.phase)}`}>
              {status.message}
            </h3>
            {status.details && (
              <p className="text-sm text-gray-500">{status.details}</p>
            )}
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-900">{Math.round(progress)}%</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
        <div 
          className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        >
          <div className="h-full bg-white/30 rounded-full animate-pulse"></div>
        </div>
      </div>

      {/* Processing Steps */}
      <div className="grid grid-cols-4 gap-2 text-xs">
        {[
          { name: 'Extract', phase: 'extracting', icon: '🎵' },
          { name: 'Enhance', phase: 'processing', icon: '⚡' },
          { name: 'Subtitles', phase: 'processing', icon: '📝' },
          { name: 'Render', phase: 'rendering', icon: '🎬' },
        ].map((step, index) => {
          const stepProgress = (index + 1) * 25;
          const isActive = progress >= stepProgress - 25 && progress < stepProgress;
          const isCompleted = progress >= stepProgress;
          
          return (
            <div 
              key={step.name}
              className={`text-center py-2 px-1 rounded ${
                isActive ? 'bg-blue-50 text-blue-600' :
                isCompleted ? 'bg-green-50 text-green-600' :
                'bg-gray-50 text-gray-400'
              }`}
            >
              <div className="text-sm mb-1">{step.icon}</div>
              <div className="font-medium">{step.name}</div>
            </div>
          );
        })}
      </div>

      {/* Estimated Time */}
      <div className="mt-4 text-center text-sm text-gray-500">
        {progress < 100 ? (
          <p>Estimated time remaining: {Math.max(1, Math.ceil((100 - progress) / 10))} minutes</p>
        ) : (
          <p>Processing completed in {Math.ceil(progress / 10)} minutes</p>
        )}
      </div>
    </div>
  );
}
