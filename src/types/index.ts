export interface VideoProject {
  id: string
  name: string
  originalFile: File
  duration: number
  width: number
  height: number
  size: number
  createdAt: Date
  updatedAt: Date
  settings: VideoSettings
  status: 'uploading' | 'processing' | 'completed' | 'error'
  progress: number
  outputUrl?: string
}

export interface VideoSettings {
  subtitles: SubtitleSettings
  animations: AnimationSettings
  soundEffects: SoundEffectSettings
  filters: FilterSettings
}

export interface SubtitleSettings {
  enabled: boolean
  style: 'modern' | 'classic' | 'bold' | 'minimal'
  position: 'bottom' | 'center' | 'top'
  fontSize: number
  color: string
  backgroundColor: string
  animation: 'none' | 'fade' | 'slide' | 'typewriter'
}

export interface AnimationSettings {
  enabled: boolean
  transitions: TransitionType[]
  effects: EffectType[]
  intensity: number
}

export interface SoundEffectSettings {
  enabled: boolean
  backgroundMusic: boolean
  musicVolume: number
  soundEffects: SoundEffect[]
}

export interface FilterSettings {
  brightness: number
  contrast: number
  saturation: number
  blur: number
  sharpen: number
}

export interface SoundEffect {
  type: 'whoosh' | 'pop' | 'ding' | 'boom' | 'swoosh'
  timing: number
  volume: number
}

export type TransitionType = 'cut' | 'fade' | 'slide' | 'zoom' | 'wipe'
export type EffectType = 'shake' | 'zoom' | 'pan' | 'rotate' | 'bounce'

export interface ContentIdea {
  id: string
  title: string
  description: string
  hashtags: string[]
  category: 'trending' | 'viral' | 'educational' | 'entertainment' | 'lifestyle'
  difficulty: 'easy' | 'medium' | 'hard'
  estimatedViews: string
  tips: string[]
}

export interface CaptionSuggestion {
  id: string
  text: string
  tone: 'casual' | 'professional' | 'funny' | 'inspirational' | 'educational'
  hashtags: string[]
  callToAction?: string
  emojis: string[]
}
