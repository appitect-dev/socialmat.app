// Simple types for subtitle functionality only

export interface VideoProject {
  id: string
  name: string
  originalFile: File
  duration: number
  width: number
  height: number
  size: number
  createdAt: Date
  status: 'pending' | 'processing' | 'complete' | 'ready' | 'error'
  hasSubtitles?: boolean
  outputFile?: string | null
  subtitleFile?: string
  progress: {
    uploading: boolean
    processing: boolean
    complete: boolean
    error: string | null
  }
}

export interface SubtitleSegment {
  start: number
  end: number
  text: string
}
