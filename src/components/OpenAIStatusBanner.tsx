"use client";

import { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';

interface OpenAIStatus {
  configured: boolean;
  working: boolean;
  message: string;
}

interface FFmpegStatus {
  available: boolean;
  message: string;
}

interface SystemStatus {
  openai: OpenAIStatus;
  ffmpeg: FFmpegStatus;
}

export function OpenAIStatusBanner() {
  const [status, setStatus] = useState<SystemStatus | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  const checkSystemStatus = async () => {
    setIsChecking(true);
    try {
      // Test OpenAI
      const openaiResponse = await fetch('/api/test-whisper', { method: 'POST' });
      const openaiResult = await openaiResponse.json();
      
      // Test FFmpeg
      const ffmpegResponse = await fetch('/api/test-ffmpeg');
      const ffmpegResult = await ffmpegResponse.json();
      
      setStatus({
        openai: {
          configured: !!openaiResult.apiKeyConfigured,
          working: openaiResult.success,
          message: openaiResult.success ? openaiResult.message : openaiResult.error
        },
        ffmpeg: {
          available: ffmpegResult.success,
          message: ffmpegResult.success ? ffmpegResult.message : ffmpegResult.error
        }
      });
    } catch {
      setStatus({
        openai: {
          configured: false,
          working: false,
          message: 'Failed to test OpenAI connection'
        },
        ffmpeg: {
          available: false,
          message: 'Failed to test FFmpeg'
        }
      });
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    checkSystemStatus();
  }, []);

  if (!status) return null;

  return (
    <div className="space-y-4 mb-6">
      {/* OpenAI Status */}
      <div className={`rounded-lg border p-4 ${
        status.openai.working 
          ? 'bg-green-50 border-green-200' 
          : 'bg-yellow-50 border-yellow-200'
      }`}>
        <div className="flex items-start gap-3">
          {status.openai.working ? (
            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
          ) : (
            <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
          )}
          
          <div className="flex-1">
            <h3 className={`text-sm font-medium ${
              status.openai.working ? 'text-green-800' : 'text-yellow-800'
            }`}>
              {status.openai.working ? '✨ OpenAI Whisper Ready!' : '⚠️ OpenAI Setup Required'}
            </h3>
            
            <p className={`text-sm mt-1 ${
              status.openai.working ? 'text-green-700' : 'text-yellow-700'
            }`}>
              {status.openai.message}
            </p>
            
            {!status.openai.configured && (
              <div className="mt-3 text-xs text-yellow-700">
                <p><strong>To enable real subtitle generation:</strong></p>
                <ol className="list-decimal list-inside mt-1 space-y-1">
                  <li>Get an API key from <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="underline">OpenAI Platform</a></li>
                  <li>Add it to your <code className="bg-yellow-100 px-1 rounded">.env.local</code> file as <code className="bg-yellow-100 px-1 rounded">OPENAI_API_KEY=your_key</code></li>
                  <li>Restart the development server</li>
                </ol>
                <p className="mt-2 font-medium">💡 Without an API key, mock subtitles will be generated for testing.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* FFmpeg Status */}
      <div className={`rounded-lg border p-4 ${
        status.ffmpeg.available 
          ? 'bg-green-50 border-green-200' 
          : 'bg-red-50 border-red-200'
      }`}>
        <div className="flex items-start gap-3">
          {status.ffmpeg.available ? (
            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
          ) : (
            <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
          )}
          
          <div className="flex-1">
            <h3 className={`text-sm font-medium ${
              status.ffmpeg.available ? 'text-green-800' : 'text-red-800'
            }`}>
              {status.ffmpeg.available ? '🎬 FFmpeg Ready!' : '❌ FFmpeg Required'}
            </h3>
            
            <p className={`text-sm mt-1 ${
              status.ffmpeg.available ? 'text-green-700' : 'text-red-700'
            }`}>
              {status.ffmpeg.message}
            </p>
            
            {!status.ffmpeg.available && (
              <div className="mt-3 text-xs text-red-700">
                <p><strong>FFmpeg is required for video processing:</strong></p>
                <div className="mt-1 space-y-1">
                  <p>• <strong>macOS:</strong> <code className="bg-red-100 px-1 rounded">brew install ffmpeg</code></p>
                  <p>• <strong>Ubuntu:</strong> <code className="bg-red-100 px-1 rounded">sudo apt install ffmpeg</code></p>
                  <p>• <strong>Windows:</strong> Download from <a href="https://ffmpeg.org/download.html" target="_blank" rel="noopener noreferrer" className="underline">ffmpeg.org</a></p>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={checkSystemStatus}
            disabled={isChecking}
            className="text-xs px-2 py-1 rounded border bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            {isChecking ? '...' : 'Test'}
          </button>
        </div>
      </div>
    </div>
  );
}
