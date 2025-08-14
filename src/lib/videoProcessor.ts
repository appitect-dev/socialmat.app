import ffmpeg, { FfmpegCommand } from 'fluent-ffmpeg';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

// Use system FFmpeg - more reliable than bundled versions
ffmpeg.setFfmpegPath('ffmpeg');

const writeFile = promisify(fs.writeFile);
const mkdir = promisify(fs.mkdir);

export interface VideoProcessingOptions {
  subtitles?: {
    enabled: boolean;
    style: string;
    position: string;
    fontSize: number;
    color: string;
    backgroundColor: string;
  };
  animations?: {
    enabled: boolean;
    transitions: string[];
    effects: string[];
    intensity: number;
  };
  soundEffects?: {
    enabled: boolean;
    backgroundMusic: boolean;
    musicVolume: number;
  };
  filters?: {
    brightness: number;
    contrast: number;
    saturation: number;
  };
}

// Add VideoMetadata interface after other interfaces
export interface VideoMetadata {
  duration: number;
  width: number;
  height: number;
  fps: number;
  bitrate: number;
  codec: string;
  size: number;
}

export class VideoProcessor {
  private tempDir: string;

  constructor() {
    this.tempDir = path.join(process.cwd(), 'temp', 'videos');
    this.ensureTempDir();
  }

  private async ensureTempDir() {
    try {
      await mkdir(this.tempDir, { recursive: true });
    } catch (error) {
      console.error('Error creating temp directory:', error);
    }
  }

  async processVideo(
    inputBuffer: Buffer,
    filename: string,
    options: VideoProcessingOptions
  ): Promise<{ outputPath: string; metadata: VideoMetadata }> {
    const inputPath = path.join(this.tempDir, `input_${Date.now()}_${filename}`);
    const outputPath = path.join(this.tempDir, `output_${Date.now()}_${filename}`);

    try {
      // Save input buffer to file
      await writeFile(inputPath, inputBuffer);

      // Get video metadata
      const metadata = await this.getVideoMetadata(inputPath);

      // Build FFmpeg command
      let command = ffmpeg(inputPath);

      // Apply video filters
      const filters = this.buildVideoFilters(options);
      if (filters.length > 0) {
        command = command.videoFilters(filters);
      }

      // Apply audio processing
      if (options.soundEffects?.enabled) {
        command = this.applyAudioProcessing(command, options.soundEffects);
      }

      // Apply subtitle processing
      if (options.subtitles?.enabled) {
        command = await this.applySubtitles(command, inputPath, options.subtitles);
      }

      // Execute processing
      await new Promise<void>((resolve, reject) => {
        command
          .output(outputPath)
          .videoCodec('libx264')
          .audioCodec('aac')
          .format('mp4')
          .on('start', (commandLine) => {
            console.log('FFmpeg command:', commandLine);
          })
          .on('progress', (progress) => {
            console.log(`Processing: ${progress.percent?.toFixed(2)}% done`);
          })
          .on('end', () => {
            console.log('Video processing completed');
            resolve();
          })
          .on('error', (err) => {
            console.error('FFmpeg error:', err);
            reject(err);
          })
          .run();
      });

      // Clean up input file
      fs.unlinkSync(inputPath);

      return { outputPath, metadata };
    } catch (error) {
      // Clean up files on error
      if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
      if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
      throw error;
    }
  }

  private async getVideoMetadata(inputPath: string): Promise<VideoMetadata> {
    return new Promise((resolve, reject) => {
      ffmpeg.ffprobe(inputPath, (err, metadata) => {
        if (err) {
          reject(err);
        } else {
          const videoStream = metadata.streams.find(stream => stream.codec_type === 'video');
          const formatData = metadata.format;
          
          if (!videoStream || !formatData) {
            reject(new Error('No video stream found'));
            return;
          }

          const processedMetadata: VideoMetadata = {
            duration: formatData.duration || 0,
            width: videoStream.width || 0,
            height: videoStream.height || 0,
            fps: this.parseFps(videoStream.r_frame_rate || '25/1'),
            bitrate: typeof formatData.bit_rate === 'string' ? parseInt(formatData.bit_rate) : (formatData.bit_rate || 0),
            codec: videoStream.codec_name || 'unknown',
            size: typeof formatData.size === 'string' ? parseInt(formatData.size) : (formatData.size || 0)
          };
          
          resolve(processedMetadata);
        }
      });
    });
  }

  private parseFps(frameRate: string): number {
    const [numerator, denominator] = frameRate.split('/').map(Number);
    return denominator ? Math.round(numerator / denominator) : numerator || 25;
  }

  private buildVideoFilters(options: VideoProcessingOptions): string[] {
    const filters: string[] = [];

    // Color correction filters
    if (options.filters) {
      const { brightness, contrast, saturation } = options.filters;
      if (brightness !== 0 || contrast !== 0 || saturation !== 0) {
        const brightnessValue = 1 + (brightness / 100);
        const contrastValue = 1 + (contrast / 100);
        const saturationValue = 1 + (saturation / 100);
        
        filters.push(`eq=brightness=${brightnessValue}:contrast=${contrastValue}:saturation=${saturationValue}`);
      }
    }

    // Animation effects
    if (options.animations?.enabled) {
      const intensity = options.animations.intensity / 10;
      
      // Add subtle zoom effect
      if (options.animations.effects.includes('zoom')) {
        filters.push(`zoompan=z='if(lte(zoom,1.0),1.5,max(1.001,zoom-0.0015))':d=125:x=iw/2-(iw/zoom/2):y=ih/2-(ih/zoom/2)`);
      }
      
      // Add shake effect
      if (options.animations.effects.includes('shake')) {
        const shakeIntensity = Math.max(1, intensity * 5);
        filters.push(`crop=in_w-${shakeIntensity}:in_h-${shakeIntensity}:${shakeIntensity}*random(0):${shakeIntensity}*random(0)`);
      }
    }

    return filters;
  }

  private applyAudioProcessing(command: FfmpegCommand, soundOptions: NonNullable<VideoProcessingOptions['soundEffects']>): FfmpegCommand {
    if (soundOptions.backgroundMusic) {
      // Adjust volume if specified
      const volume = soundOptions.musicVolume / 100;
      command = command.audioFilters(`volume=${volume}`);
    }

    // Add audio enhancements
    command = command.audioFilters([
      'highpass=f=200',  // Remove low-frequency noise
      'lowpass=f=8000',  // Remove high-frequency noise
      'compand=attacks=0.3:decays=0.8:points=-70/-70|-24/-12|-12/-6|0/-3' // Dynamic range compression
    ]);

    return command;
  }

  private async applySubtitles(command: FfmpegCommand, inputPath: string, subtitleOptions: NonNullable<VideoProcessingOptions['subtitles']>): Promise<FfmpegCommand> {
    // Note: This method applies subtitle styling to video
    // The actual subtitle text content is generated separately by SpeechToTextService
    // and saved as .srt files for use with video players
    
    const subtitleStyle = this.getSubtitleStyle(subtitleOptions);
    
    // Add a placeholder text overlay to demonstrate subtitle positioning
    // In a real implementation, you might burn-in the actual subtitles here
    const textFilter = `drawtext=text='Subtitles Generated':${subtitleStyle}:enable='between(t,1,3)'`;
    command = command.videoFilters(textFilter);

    return command;
  }

  private getSubtitleStyle(options: NonNullable<VideoProcessingOptions['subtitles']>): string {
    const { fontSize, color, position } = options;
    
    const x = 'w/2-text_w/2'; // center
    let y = 'h-text_h-50'; // bottom with padding
    
    if (position === 'top') {
      y = '50';
    } else if (position === 'center') {
      y = 'h/2-text_h/2';
    }

    return [
      `fontsize=${fontSize}`,
      `fontcolor=${color}`,
      `x=${x}`,
      `y=${y}`,
      `box=1`,
      `boxcolor=black@0.8`,
      `boxborderw=5`
    ].join(':');
  }

  async generateThumbnail(inputPath: string): Promise<string> {
    const thumbnailPath = path.join(this.tempDir, `thumb_${Date.now()}.jpg`);
    
    return new Promise((resolve, reject) => {
      ffmpeg(inputPath)
        .screenshots({
          timestamps: ['00:00:01'],
          filename: path.basename(thumbnailPath),
          folder: path.dirname(thumbnailPath),
          size: '320x240'
        })
        .on('end', () => resolve(thumbnailPath))
        .on('error', reject);
    });
  }

  async extractAudio(inputPath: string): Promise<string> {
    const audioPath = path.join(this.tempDir, `audio_${Date.now()}.wav`);
    
    return new Promise((resolve, reject) => {
      ffmpeg(inputPath)
        .output(audioPath)
        .noVideo()
        .audioCodec('pcm_s16le')
        .on('end', () => resolve(audioPath))
        .on('error', reject)
        .run();
    });
  }

  cleanup(filePath: string) {
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (error) {
      console.error('Error cleaning up file:', error);
    }
  }

  // Method to burn subtitles directly into video (optional)
  async burnSubtitles(videoPath: string, subtitlePath: string): Promise<string> {
    const outputPath = videoPath.replace('.mp4', '_with_subtitles.mp4');
    
    return new Promise((resolve, reject) => {
      ffmpeg(videoPath)
        .videoFilter(`subtitles=${subtitlePath}:force_style='FontSize=24,PrimaryColour=&Hffffff&,BackColour=&H80000000&'`)
        .output(outputPath)
        .on('end', () => resolve(outputPath))
        .on('error', reject)
        .run();
    });
  }
}
