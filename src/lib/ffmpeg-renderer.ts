import ffmpeg from 'fluent-ffmpeg';
import ffmpegStatic from 'ffmpeg-static';
import { promises as fs } from 'fs';
import path from 'path';
import { SubtitleData, VideoRenderConfig } from '@/types';
import { CONSTANTS } from '@/utils/constants';
import { ensureDirectory, generateUniqueFilename, getOutputDirectory } from '@/utils/file-utils';
import { ValidationError } from '@/utils/validators';

if (ffmpegStatic) {
  ffmpeg.setFfmpegPath(ffmpegStatic);
}

export async function renderVideo(
  audioPath: string,
  subtitlePath: string,
  duration: number
): Promise<{ videoPath: string; videoUrl: string }> {
  return new Promise(async (resolve, reject) => {
    try {
      const config = getVideoRenderConfig();
      const outputDir = getOutputDirectory();
      await ensureDirectory(outputDir);

      const filename = generateUniqueFilename('mp4');
      const videoPath = path.join(outputDir, filename);

      const filterComplex = createFilterComplex(duration, subtitlePath);

      ffmpeg()
        .input('color=c=0x1a1f3a:s=1080x1920:d=' + duration)
        .inputFormat('lavfi')
        .input(audioPath)
        .outputOptions([
          `-filter_complex "${filterComplex}"`,
          `-c:v ${config.codec}`,
          `-preset fast`,
          `-crf ${config.crf}`,
          `-b:v ${config.bitrate}`,
          `-c:a aac`,
          `-b:a 192k`,
          `-pix_fmt yuv420p`,
          `-r ${config.fps}`
        ])
        .output(videoPath)
        .on('start', (cmd) => {
          console.log('FFmpeg command:', cmd);
        })
        .on('progress', (progress) => {
          console.log('FFmpeg progress:', progress.percent + '% done');
        })
        .on('end', () => {
          console.log('Video rendering complete');
          const videoUrl = `/outputs/${filename}`;
          resolve({ videoPath, videoUrl });
        })
        .on('error', (err) => {
          console.error('FFmpeg error:', err);
          reject(new ValidationError('Error al renderizar video'));
        })
        .run();
    } catch (error) {
      console.error('Error in video rendering:', error);
      reject(new ValidationError('Error al renderizar video'));
    }
  });
}

function getVideoRenderConfig(): VideoRenderConfig {
  return {
    width: CONSTANTS.VIDEO.WIDTH,
    height: CONSTANTS.VIDEO.HEIGHT,
    fps: CONSTANTS.VIDEO.FPS,
    bitrate: CONSTANTS.VIDEO.BITRATE,
    codec: CONSTANTS.VIDEO.CODEC,
    crf: CONSTANTS.VIDEO.CRF,
    backgroundColor: '#1a1f3a'
  };
}

function createFilterComplex(duration: number, subtitlePath: string): string {
  const bgColor = '0x1a1f3a';

  const scaleFilter = `scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920`;

  const subtitleFilter = subtitlePath
    ? `,subtitles='${subtitlePath.replace(/\\/g, '\\\\')}':force_style='FontName=Arial,FontSize=24,PrimaryColour=&H00FFFFFF,OutlineColour=&H00000000,Outline=2,Shadow=2'`
    : '';

  const overlayFilter = `[0:v]${scaleFilter}${subtitleFilter}[v]`;

  return overlayFilter;
}
