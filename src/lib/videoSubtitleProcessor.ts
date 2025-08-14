import { spawn } from 'child_process';
import fs from 'fs/promises';

export interface SubtitleStyle {
  fontName?: string;
  fontSize?: number;
  fontColor?: string;
  backgroundColor?: string;
  outlineColor?: string;
  outlineWidth?: number;
  position?: 'bottom' | 'top' | 'center';
  marginVertical?: number;
  marginHorizontal?: number;
}

export interface VideoSubtitleOptions {
  inputVideoPath: string;
  outputVideoPath: string;
  subtitlePath: string;
  style?: SubtitleStyle;
  onProgress?: (progress: number) => void;
}

export class VideoSubtitleProcessor {
  private static readonly DEFAULT_STYLE: SubtitleStyle = {
    fontName: 'Arial Bold',
    fontSize: 32,
    fontColor: 'white',
    backgroundColor: 'black@0.8',
    outlineColor: 'black',
    outlineWidth: 3,
    position: 'bottom',
    marginVertical: 60,
    marginHorizontal: 40
  };

  /**
   * Add subtitles to a video using FFmpeg
   */
  static async addSubtitlesToVideo(options: VideoSubtitleOptions): Promise<string> {
    const {
      inputVideoPath,
      outputVideoPath,
      subtitlePath,
      style = {},
      onProgress
    } = options;

    // Merge default style with provided style
    const finalStyle = { ...this.DEFAULT_STYLE, ...style };

    // Check if input files exist
    await this.validateInputFiles(inputVideoPath, subtitlePath);

    // Build FFmpeg command
    const command = this.buildFFmpegCommand(
      inputVideoPath,
      outputVideoPath,
      subtitlePath,
      finalStyle
    );

    console.log('Starting subtitle processing with command:', command.join(' '));

    return new Promise((resolve, reject) => {
      console.log('FFmpeg command:', command);
      const ffmpeg = spawn('ffmpeg', command);

      let stderr = '';
      let stdout = '';
      let duration: number | null = null;

      ffmpeg.stdout.on('data', (data) => {
        stdout += data.toString();
      });

      ffmpeg.stderr.on('data', (data) => {
        const output = data.toString();
        stderr += output;
        console.log('FFmpeg stderr:', output);

        // Extract duration from FFmpeg output
        if (!duration) {
          const durationMatch = output.match(/Duration: (\d+):(\d+):(\d+\.\d+)/);
          if (durationMatch) {
            const hours = parseInt(durationMatch[1]);
            const minutes = parseInt(durationMatch[2]);
            const seconds = parseFloat(durationMatch[3]);
            duration = hours * 3600 + minutes * 60 + seconds;
            console.log('Detected video duration:', duration, 'seconds');
          }
        }

        // Extract progress from FFmpeg output
        if (duration && onProgress) {
          const timeMatch = output.match(/time=(\d+):(\d+):(\d+\.\d+)/);
          if (timeMatch) {
            const hours = parseInt(timeMatch[1]);
            const minutes = parseInt(timeMatch[2]);
            const seconds = parseFloat(timeMatch[3]);
            const currentTime = hours * 3600 + minutes * 60 + seconds;
            const progress = Math.min((currentTime / duration) * 100, 100);
            onProgress(Math.round(progress));
          }
        }
      });

      ffmpeg.on('close', (code) => {
        console.log(`FFmpeg process exited with code ${code}`);
        if (code === 0) {
          console.log('✅ Subtitle processing completed successfully');
          console.log('Output file should be at:', outputVideoPath);
          resolve(outputVideoPath);
        } else {
          console.error('❌ FFmpeg failed with code:', code);
          console.error('FFmpeg stderr:', stderr);
          console.error('FFmpeg stdout:', stdout);
          reject(new Error(`FFmpeg process exited with code ${code}. Error: ${stderr}`));
        }
      });

      ffmpeg.on('error', (error) => {
        console.error('❌ Failed to start FFmpeg process:', error);
        reject(new Error(`Failed to start FFmpeg: ${error.message}`));
      });
    });
  }

  /**
   * Build FFmpeg command for adding subtitles
   */
  private static buildFFmpegCommand(
    inputPath: string,
    outputPath: string,
    subtitlePath: string,
    style: SubtitleStyle
  ): string[] {
    // Create highly visible subtitles that work on any background
    const command = [
      '-i', inputPath,
      '-vf', [
        `subtitles=${subtitlePath}:force_style='`,
        `FontName=Arial Bold,`,
        `FontSize=${style.fontSize || 32},`,
        `PrimaryColour=&Hffffff,`,      // White text
        `SecondaryColour=&Hffffff,`,    // White secondary
        `OutlineColour=&H000000,`,      // Black outline
        `BackColour=&H80000000,`,       // Semi-transparent black background
        `Bold=1,`,                      // Bold text
        `Outline=3,`,                   // Thick outline
        `Shadow=2,`,                    // Drop shadow
        `Alignment=2,`,                 // Bottom center
        `MarginV=${style.marginVertical || 60},`,  // Bottom margin
        `MarginL=${style.marginHorizontal || 40},`,
        `MarginR=${style.marginHorizontal || 40}`,
        `'`
      ].join(''),
      '-c:a', 'copy', // Copy audio without re-encoding
      '-c:v', 'libx264', // Video codec
      '-preset', 'fast', // Faster encoding
      '-crf', '23', // Quality setting
      '-avoid_negative_ts', 'make_zero', // Fix timestamp issues
      '-y', // Overwrite output file
      outputPath
    ];

    return command;
  }

  /**
   * Build the subtitle filter string for FFmpeg
   */
  private static buildSubtitleFilter(subtitlePath: string, style: SubtitleStyle): string {
    const escapedPath = subtitlePath.replace(/:/g, '\\:').replace(/\\/g, '/');
    
    let filter = `subtitles='${escapedPath}'`;
    
    // Add style parameters
    const styleParams: string[] = [];
    
    if (style.fontName) {
      styleParams.push(`FontName='${style.fontName}'`);
    }
    
    if (style.fontSize) {
      styleParams.push(`FontSize=${style.fontSize}`);
    }
    
    if (style.fontColor) {
      styleParams.push(`PrimaryColour=&H${this.colorToHex(style.fontColor)}`);
    }
    
    if (style.outlineColor && style.outlineWidth) {
      styleParams.push(`OutlineColour=&H${this.colorToHex(style.outlineColor)}`);
      styleParams.push(`Outline=${style.outlineWidth}`);
    }
    
    if (style.backgroundColor) {
      styleParams.push(`BackColour=&H${this.colorToHex(style.backgroundColor)}`);
    }

    // Position settings
    if (style.position === 'top') {
      styleParams.push('Alignment=2');
    } else if (style.position === 'center') {
      styleParams.push('Alignment=5');
    } else {
      styleParams.push('Alignment=2'); // Bottom is default
    }

    if (style.marginVertical) {
      styleParams.push(`MarginV=${style.marginVertical}`);
    }

    if (style.marginHorizontal) {
      styleParams.push(`MarginL=${style.marginHorizontal}`);
      styleParams.push(`MarginR=${style.marginHorizontal}`);
    }

    if (styleParams.length > 0) {
      filter += `:force_style='${styleParams.join(',')}'`;
    }

    return filter;
  }

  /**
   * Convert color name to hex format for FFmpeg
   */
  private static colorToHex(color: string): string {
    const colorMap: { [key: string]: string } = {
      'white': 'FFFFFF',
      'black': '000000',
      'red': 'FF0000',
      'green': '00FF00',
      'blue': '0000FF',
      'yellow': 'FFFF00',
      'cyan': '00FFFF',
      'magenta': 'FF00FF'
    };

    // If it's already a hex color, return it
    if (color.startsWith('#')) {
      return color.substring(1);
    }

    // Handle colors with opacity (e.g., "black@0.7")
    if (color.includes('@')) {
      const [colorName, opacity] = color.split('@');
      const hex = colorMap[colorName.toLowerCase()] || 'FFFFFF';
      const alpha = Math.round(parseFloat(opacity) * 255).toString(16).padStart(2, '0');
      return alpha + hex; // FFmpeg uses AABBGGRR format
    }

    return colorMap[color.toLowerCase()] || 'FFFFFF';
  }

  /**
   * Validate that input files exist
   */
  static async validateInputFiles(videoPath: string, subtitlePath: string): Promise<void> {
    try {
      await fs.access(videoPath);
    } catch {
      throw new Error(`Video file not found: ${videoPath}`);
    }

    try {
      await fs.access(subtitlePath);
    } catch {
      throw new Error(`Subtitle file not found: ${subtitlePath}`);
    }
  }

  /**
   * Break long subtitle segments into smaller chunks of 3-5 words
   */
  static breakIntoSmallChunks(
    segments: Array<{ start: number; end: number; text: string }>,
    maxWordsPerChunk: number = 4
  ): Array<{ start: number; end: number; text: string }> {
    const smallChunks: Array<{ start: number; end: number; text: string }> = [];
    
    segments.forEach(segment => {
      const words = segment.text.trim().split(/\s+/);
      const segmentDuration = segment.end - segment.start;
      
      if (words.length <= maxWordsPerChunk) {
        // Keep short segments as they are
        smallChunks.push(segment);
      } else {
        // Break long segments into chunks
        const chunks: string[] = [];
        for (let i = 0; i < words.length; i += maxWordsPerChunk) {
          chunks.push(words.slice(i, i + maxWordsPerChunk).join(' '));
        }
        
        // Distribute timing evenly across chunks
        const timePerChunk = segmentDuration / chunks.length;
        
        chunks.forEach((chunkText, index) => {
          const chunkStart = segment.start + (index * timePerChunk);
          const chunkEnd = chunkStart + timePerChunk;
          
          smallChunks.push({
            start: chunkStart,
            end: chunkEnd,
            text: chunkText.trim()
          });
        });
      }
    });
    
    return smallChunks;
  }

  /**
   * Convert subtitle segments with timing to SRT format
   */
  static async convertSegmentsToSRT(
    segments: Array<{ start: number; end: number; text: string }>, 
    outputPath: string,
    maxWordsPerChunk: number = 4
  ): Promise<string> {
    // Break segments into smaller chunks first
    const smallChunks = this.breakIntoSmallChunks(segments, maxWordsPerChunk);
    
    const srtContent: string[] = [];
    
    smallChunks.forEach((segment, index) => {
      srtContent.push((index + 1).toString());
      srtContent.push(`${this.formatTime(segment.start)} --> ${this.formatTime(segment.end)}`);
      srtContent.push(segment.text.trim());
      srtContent.push(''); // Empty line between subtitles
    });
    
    await fs.writeFile(outputPath, srtContent.join('\n'), 'utf-8');
    return outputPath;
  }

  /**
   * Convert plain text subtitles to SRT format
   */
  static async convertTextToSRT(
    inputText: string, 
    outputPath: string, 
    segmentDuration: number = 3
  ): Promise<string> {
    const lines = inputText.split('\n').filter(line => line.trim());
    const srtContent: string[] = [];
    
    let index = 1;
    let currentTime = 0;
    
    for (const line of lines) {
      if (line.trim()) {
        const startTime = this.formatTime(currentTime);
        const endTime = this.formatTime(currentTime + segmentDuration);
        
        srtContent.push(index.toString());
        srtContent.push(`${startTime} --> ${endTime}`);
        srtContent.push(line.trim());
        srtContent.push(''); // Empty line between subtitles
        
        index++;
        currentTime += segmentDuration;
      }
    }
    
    await fs.writeFile(outputPath, srtContent.join('\n'), 'utf-8');
    return outputPath;
  }

  /**
   * Format time in SRT format (HH:MM:SS,mmm)
   */
  private static formatTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    const milliseconds = Math.floor((seconds % 1) * 1000);

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')},${milliseconds.toString().padStart(3, '0')}`;
  }
}
