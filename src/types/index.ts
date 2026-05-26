export interface ExtractedArticle {
  title: string;
  content: string;
  description?: string;
  image?: string;
  author?: string;
  publishedAt?: string;
}

export interface VideoScript {
  hook: string;
  scenes: Scene[];
  cta: string;
  duration: number;
  fullText: string;
}

export interface Scene {
  text: string;
  duration: number;
  order: number;
}

export interface AudioData {
  filePath: string;
  duration: number;
  format: string;
}

export interface SubtitleData {
  filePath: string;
  srt: string;
  segments: SubtitleSegment[];
}

export interface SubtitleSegment {
  index: number;
  startTime: string;
  endTime: string;
  text: string;
}

export interface VideoRenderConfig {
  width: number;
  height: number;
  fps: number;
  bitrate: string;
  codec: string;
  crf: number;
  backgroundColor: string;
}

export interface GenerationProgress {
  step: 'extracting' | 'scripting' | 'audio' | 'subtitles' | 'rendering' | 'complete' | 'error';
  message: string;
  progress: number;
}

export interface GenerationResult {
  videoPath: string;
  duration: number;
  size: number;
  success: boolean;
  error?: string;
}
