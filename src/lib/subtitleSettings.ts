// Subtitle settings management
import { SubtitleStyle } from "@/lib/videoSubtitleProcessor";

export interface SubtitleSettings extends SubtitleStyle {
  wordsPerChunk: number;
}

const DEFAULT_SUBTITLE_SETTINGS: SubtitleSettings = {
  fontName: 'Arial Bold',
  fontSize: 32,
  fontColor: 'white',
  backgroundColor: 'black@0.8',
  outlineColor: 'black',
  outlineWidth: 3,
  position: 'bottom',
  marginVertical: 60,
  marginHorizontal: 40,
  wordsPerChunk: 4
};

export class SubtitleSettingsManager {
  private static STORAGE_KEY = 'socialmat_subtitle_settings';

  static save(settings: SubtitleSettings): void {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(settings));
      }
    } catch (error) {
      console.warn('Failed to save subtitle settings:', error);
    }
  }

  static load(): SubtitleSettings {
    try {
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem(this.STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          return { ...DEFAULT_SUBTITLE_SETTINGS, ...parsed };
        }
      }
    } catch (error) {
      console.warn('Failed to load subtitle settings:', error);
    }
    return DEFAULT_SUBTITLE_SETTINGS;
  }

  static reset(): SubtitleSettings {
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(this.STORAGE_KEY);
      }
    } catch (error) {
      console.warn('Failed to reset subtitle settings:', error);
    }
    return DEFAULT_SUBTITLE_SETTINGS;
  }

  static applyToVideoProcessing(settings: SubtitleSettings) {
    return {
      style: {
        fontName: settings.fontName,
        fontSize: settings.fontSize,
        fontColor: settings.fontColor,
        backgroundColor: settings.backgroundColor,
        outlineColor: settings.outlineColor,
        outlineWidth: settings.outlineWidth,
        position: settings.position,
        marginVertical: settings.marginVertical,
        marginHorizontal: settings.marginHorizontal,
      },
      maxWordsPerChunk: settings.wordsPerChunk
    };
  }
}
