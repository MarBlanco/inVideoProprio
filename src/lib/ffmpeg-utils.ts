import ffmpeg from 'fluent-ffmpeg';
import ffmpegStatic from 'ffmpeg-static';
import { CONSTANTS } from '@/utils/constants';

if (ffmpegStatic) {
  ffmpeg.setFfmpegPath(ffmpegStatic);
}

export function initializeFFmpeg(): void {
  if (process.env.FFMPEG_PATH) {
    ffmpeg.setFfmpegPath(process.env.FFMPEG_PATH);
  }

  if (process.env.FFPROBE_PATH) {
    ffmpeg.setFfprobePath(process.env.FFPROBE_PATH);
  }
}

export interface FFmpegOptions {
  width: number;
  height: number;
  fps: number;
  bitrate: string;
  crf: number;
  preset: 'ultrafast' | 'superfast' | 'veryfast' | 'faster' | 'fast' | 'medium' | 'slow';
}

export const defaultVideoOptions: FFmpegOptions = {
  width: CONSTANTS.VIDEO.WIDTH,
  height: CONSTANTS.VIDEO.HEIGHT,
  fps: CONSTANTS.VIDEO.FPS,
  bitrate: CONSTANTS.VIDEO.BITRATE,
  crf: CONSTANTS.VIDEO.CRF,
  preset: 'fast'
};

export function validateFFmpeg(): Promise<boolean> {
  return new Promise((resolve) => {
    ffmpeg.ffprobe('-version', (err) => {
      resolve(!err);
    });
  });
}
