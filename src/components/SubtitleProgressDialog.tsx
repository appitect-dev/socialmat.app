"use client";

import React from 'react';
import { Mic, FileText, Video, CheckCircle, X } from 'lucide-react';

interface SubtitleProgress {
  stage: 'extracting' | 'transcribing' | 'generating' | 'complete' | 'error';
  progress: number;
  message: string;
  error?: string;
}

interface SubtitleProgressDialogProps {
  isOpen: boolean;
  progress: SubtitleProgress;
  onClose: () => void;
}

export function SubtitleProgressDialog({ isOpen, progress, onClose }: SubtitleProgressDialogProps) {
  if (!isOpen) return null;

  const stages = [
    { key: 'extracting', icon: Video, label: 'Extracting Audio', description: 'Separating audio from video...' },
    { key: 'transcribing', icon: Mic, label: 'Transcribing Speech', description: 'Converting speech to text with OpenAI Whisper...' },
    { key: 'generating', icon: FileText, label: 'Generating Subtitles', description: 'Creating subtitle files...' },
    { key: 'complete', icon: CheckCircle, label: 'Complete', description: 'Subtitles generated successfully!' }
  ];

  const currentStageIndex = stages.findIndex(s => s.key === progress.stage);
  const isError = progress.stage === 'error';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            🎙️ Generating Subtitles
          </h3>
          {progress.stage === 'complete' || progress.stage === 'error' ? (
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-1"
            >
              <X className="h-5 w-5" />
            </button>
          ) : null}
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>{progress.message}</span>
            <span>{Math.round(progress.progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${
                isError ? 'bg-red-500' : 
                progress.stage === 'complete' ? 'bg-green-500' : 'bg-blue-500'
              }`}
              style={{ width: `${progress.progress}%` }}
            />
          </div>
        </div>

        {/* Stage Indicators */}
        <div className="space-y-4 mb-6">
          {stages.map((stage, index) => {
            const Icon = stage.icon;
            const isActive = index === currentStageIndex;
            const isCompleted = index < currentStageIndex || progress.stage === 'complete';
            const isFuture = index > currentStageIndex && progress.stage !== 'complete';

            return (
              <div key={stage.key} className={`flex items-start gap-3 ${
                isFuture ? 'opacity-50' : ''
              }`}>
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  isCompleted ? 'bg-green-100 text-green-600' :
                  isActive ? 'bg-blue-100 text-blue-600' :
                  'bg-gray-100 text-gray-400'
                }`}>
                  {isCompleted ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <Icon className="h-4 w-4" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium ${
                    isActive ? 'text-blue-900' : 
                    isCompleted ? 'text-green-900' : 
                    'text-gray-900'
                  }`}>
                    {stage.label}
                    {isActive && (
                      <span className="ml-2 inline-flex items-center">
                        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600" />
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {stage.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Error Message */}
        {isError && progress.error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-800">
              <strong>Error:</strong> {progress.error}
            </p>
          </div>
        )}

        {/* Success Message */}
        {progress.stage === 'complete' && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
            <p className="text-sm text-green-800">
              ✅ <strong>Subtitles generated successfully!</strong> Check the temp/videos directory for your subtitle files.
            </p>
          </div>
        )}

        {/* Actions */}
        {progress.stage === 'complete' || progress.stage === 'error' ? (
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Close
            </button>
          </div>
        ) : (
          <div className="flex justify-center">
            <p className="text-xs text-gray-500">
              Please wait while we process your video...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
