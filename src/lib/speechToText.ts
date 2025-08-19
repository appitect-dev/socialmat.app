import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

const readFile = promisify(fs.readFile);

export interface SubtitleSegment {
  start: number;
  end: number;
  text: string;
}

export interface SpeechToTextOptions {
  language?: string;
  model?: 'whisper-1';
  response_format?: 'json' | 'text' | 'srt' | 'verbose_json' | 'vtt';
  temperature?: number;
}

export class SpeechToTextService {
  private openai: OpenAI;

  constructor(apiKey?: string) {
    const finalApiKey = apiKey || process.env.OPENAI_API_KEY;
    console.log('🔑 SpeechToTextService initialized with API key:', finalApiKey ? `${finalApiKey.substring(0, 7)}...` : 'NOT FOUND');
    
    this.openai = new OpenAI({
      apiKey: finalApiKey,
    });
  }

  async transcribeVideo(videoPath: string, options: SpeechToTextOptions = {}, wordsPerChunk: number = 4): Promise<SubtitleSegment[]> {
    try {
      // Check if we have an API key
      if (!process.env.OPENAI_API_KEY) {
        console.warn('OpenAI API key not found, using mock subtitles');
        const mockSegments = this.getMockSubtitles();
        return this.splitSegmentsByWords(mockSegments, wordsPerChunk);
      }

      // Read the video file
      const videoFile = await readFile(videoPath);
      
      // Create a File object from the buffer
      const file = new File([new Uint8Array(videoFile)], path.basename(videoPath), {
        type: this.getMimeType(videoPath)
      });

      const transcription = await this.openai.audio.transcriptions.create({
        file: file,
        model: options.model || 'whisper-1',
        response_format: 'verbose_json',
        timestamp_granularities: ['segment'],
        language: options.language,
        temperature: options.temperature || 0,
      });

      // Convert OpenAI segments to our format
      if ('segments' in transcription && transcription.segments) {
        const openaiSegments = transcription.segments.map(segment => ({
          start: segment.start,
          end: segment.end,
          text: segment.text.trim()
        }));
        
        // Split segments by words per chunk
        return this.splitSegmentsByWords(openaiSegments, wordsPerChunk);
      }

      return [];
    } catch (error) {
      console.error('Error transcribing video:', error);
      const mockSegments = this.getMockSubtitles();
      return this.splitSegmentsByWords(mockSegments, wordsPerChunk);
    }
  }

  async transcribeAudio(audioBuffer: Buffer, filename: string = 'audio.wav', options: SpeechToTextOptions = {}, wordsPerChunk: number = 4): Promise<SubtitleSegment[]> {
    try {
      // Check if we have an API key
      if (!process.env.OPENAI_API_KEY) {
        console.warn('OpenAI API key not found, using mock subtitles');
        const mockSegments = this.generateDynamicMockSubtitles();
        return this.splitSegmentsByWords(mockSegments, wordsPerChunk);
      }

      // Create a File object from the buffer
      const file = new File([new Uint8Array(audioBuffer)], filename, {
        type: this.getMimeType(filename)
      });

      const transcription = await this.openai.audio.transcriptions.create({
        file: file,
        model: options.model || 'whisper-1',
        response_format: 'verbose_json',
        timestamp_granularities: ['segment'],
        language: options.language,
        temperature: options.temperature || 0,
      });

      // Convert OpenAI segments to our format
      if ('segments' in transcription && transcription.segments) {
        const openaiSegments = transcription.segments.map(segment => ({
          start: segment.start,
          end: segment.end,
          text: segment.text.trim()
        }));
        
        // Split segments by words per chunk
        return this.splitSegmentsByWords(openaiSegments, wordsPerChunk);
      }

      return [];
    } catch (error) {
      console.error('Error transcribing audio:', error);
      const mockSegments = this.generateDynamicMockSubtitles();
      return this.splitSegmentsByWords(mockSegments, wordsPerChunk);
    }
  }

  /**
   * Split long segments into smaller chunks based on word count
   */
  private splitSegmentsByWords(segments: SubtitleSegment[], wordsPerChunk: number): SubtitleSegment[] {
    const result: SubtitleSegment[] = [];

    for (const segment of segments) {
      const words = segment.text.split(/\s+/).filter(word => word.length > 0);
      
      // If segment has fewer words than requested, keep it as is
      if (words.length <= wordsPerChunk) {
        result.push(segment);
        continue;
      }

      // Split into chunks
      const segmentDuration = segment.end - segment.start;
      const chunks: string[] = [];
      
      for (let i = 0; i < words.length; i += wordsPerChunk) {
        const chunk = words.slice(i, i + wordsPerChunk).join(' ');
        chunks.push(chunk);
      }

      // Distribute time evenly across chunks
      const chunkDuration = segmentDuration / chunks.length;
      
      chunks.forEach((chunk, index) => {
        const start = segment.start + (index * chunkDuration);
        const end = segment.start + ((index + 1) * chunkDuration);
        
        result.push({
          start: Math.round(start * 100) / 100, // Round to 2 decimal places
          end: Math.round(end * 100) / 100,
          text: chunk
        });
      });
    }

    return result;
  }

  private getMockSubtitles(): SubtitleSegment[] {
    return [
      { start: 0, end: 2.5, text: "Welcome to this amazing video!" },
      { start: 2.5, end: 5.0, text: "Today we're going to learn something new." },
      { start: 5.0, end: 7.5, text: "This content was enhanced by AI." },
      { start: 7.5, end: 10.0, text: "Don't forget to like and subscribe!" }
    ];
  }

  private getMimeType(filename: string): string {
    const ext = path.extname(filename).toLowerCase();
    const mimeTypes: { [key: string]: string } = {
      '.mp3': 'audio/mpeg',
      '.wav': 'audio/wav',
      '.m4a': 'audio/mp4',
      '.aac': 'audio/aac',
      '.ogg': 'audio/ogg',
      '.flac': 'audio/flac',
      '.mp4': 'video/mp4',
      '.mov': 'video/quicktime',
      '.avi': 'video/x-msvideo',
      '.mkv': 'video/x-matroska',
      '.webm': 'video/webm'
    };
    return mimeTypes[ext] || 'audio/mpeg';
  }

  private generateDynamicMockSubtitles(): SubtitleSegment[] {
    const mockPhrases = [
      "Hey everyone, welcome back to my channel!",
      "Today we're going to talk about something exciting.",
      "This is a game-changer for content creators.",
      "Let me show you how this works.",
      "The results are absolutely incredible.",
      "You won't believe what happens next.",
      "Make sure to hit that subscribe button!",
      "Drop a comment and let me know what you think."
    ];

    const segments: SubtitleSegment[] = [];
    let currentTime = 0;

    // Generate 4-6 random segments
    const numSegments = Math.floor(Math.random() * 3) + 4;
    const segmentDuration = 2.5 + Math.random() * 1.5; // 2.5-4 seconds per segment

    for (let i = 0; i < numSegments && i < mockPhrases.length; i++) {
      const duration = segmentDuration + (Math.random() - 0.5) * 0.8; // Add some variation
      segments.push({
        start: Math.round(currentTime * 10) / 10,
        end: Math.round((currentTime + duration) * 10) / 10,
        text: mockPhrases[i]
      });
      currentTime += duration + 0.3; // Small gap between segments
    }

    return segments;
  }

  private generateMockSubtitles(): SubtitleSegment[] {
    return [
      { start: 0, end: 2.5, text: "Welcome to this amazing video!" },
      { start: 2.5, end: 5.0, text: "Today we're going to learn something new." },
      { start: 5.0, end: 7.5, text: "This content was enhanced by AI." },
      { start: 7.5, end: 10.0, text: "Don't forget to like and subscribe!" }
    ];
  }

  async generateSubtitleFile(
    segments: SubtitleSegment[],
    format: 'srt' | 'vtt' = 'srt'
  ): Promise<string> {
    if (format === 'srt') {
      return this.generateSRT(segments);
    } else {
      return this.generateVTT(segments);
    }
  }

  private generateSRT(segments: SubtitleSegment[]): string {
    return segments.map((segment, index) => {
      const startTime = this.formatSRTTime(segment.start);
      const endTime = this.formatSRTTime(segment.end);
      
      return [
        index + 1,
        `${startTime} --> ${endTime}`,
        segment.text,
        ''
      ].join('\n');
    }).join('\n');
  }

  private generateVTT(segments: SubtitleSegment[]): string {
    const header = 'WEBVTT\n\n';
    const content = segments.map((segment, index) => {
      const startTime = this.formatVTTTime(segment.start);
      const endTime = this.formatVTTTime(segment.end);
      
      return [
        `${index + 1}`,
        `${startTime} --> ${endTime}`,
        segment.text,
        ''
      ].join('\n');
    }).join('\n');

    return header + content;
  }

  private formatSRTTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 1000);

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')},${ms.toString().padStart(3, '0')}`;
  }

  private formatVTTTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 1000);

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(3, '0')}`;
  }

  // Real OpenAI Whisper integration (commented for demo)
  /*
  private async transcribeWithWhisper(audioBuffer: Buffer): Promise<SubtitleSegment[]> {
    const formData = new FormData();
    formData.append('file', new Blob([audioBuffer]), 'audio.wav');
    formData.append('model', 'whisper-1');
    formData.append('response_format', 'verbose_json');
    formData.append('timestamp_granularities[]', 'segment');

    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: formData
    });

    const result = await response.json();
    
    return result.segments.map((segment: any) => ({
      start: segment.start,
      end: segment.end,
      text: segment.text.trim()
    }));
  }
  */
}
