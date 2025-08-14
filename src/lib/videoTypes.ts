export interface FFmpegMetadata {
  format: {
    duration: string;
    bit_rate: string;
    size: string;
  };
  streams: Array<{
    codec_type: string;
    width?: number;
    height?: number;
    duration?: string;
  }>;
}

export interface FFmpegCommand {
  output: (path: string) => FFmpegCommand;
  videoCodec: (codec: string) => FFmpegCommand;
  audioCodec: (codec: string) => FFmpegCommand;
  format: (format: string) => FFmpegCommand;
  videoFilters: (filters: string | string[]) => FFmpegCommand;
  audioFilters: (filters: string | string[]) => FFmpegCommand;
  noVideo: () => FFmpegCommand;
  screenshots: (options: any) => FFmpegCommand;
  on: (event: string, callback: (data?: any) => void) => FFmpegCommand;
  run: () => void;
}

export interface SoundEffectsOptions {
  backgroundMusic: boolean;
  musicVolume: number;
}

export interface SubtitleOptions {
  style: string;
  position: string;
  fontSize: number;
  color: string;
  backgroundColor: string;
}
