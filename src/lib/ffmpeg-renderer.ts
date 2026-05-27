import ffmpeg from 'fluent-ffmpeg';
import { existsSync } from 'fs';
import path from 'path';
import { SubtitleData, VideoRenderConfig } from '@/types';
import { CONSTANTS } from '@/utils/constants';
import { ensureDirectory, generateUniqueFilename, getOutputDirectory } from '@/utils/file-utils';
import { ValidationError } from '@/utils/validators';

async function initializeFfmpeg(): Promise<void> {
  const envFfmpegPath = process.env.FFMPEG_PATH;
  if (envFfmpegPath) {
    if (!existsSync(envFfmpegPath)) {
      console.error('FFMPEG_PATH no existe:', envFfmpegPath);
      throw new ValidationError('La ruta de ffmpeg configurada no existe');
    }
    ffmpeg.setFfmpegPath(envFfmpegPath);
    return;
  }

  const binaryName = process.platform === 'win32' ? 'ffmpeg.exe' : 'ffmpeg';
  const projectFfmpegPath = path.join(process.cwd(), 'node_modules', 'ffmpeg-static', binaryName);

  if (!existsSync(projectFfmpegPath)) {
    console.error('No se encontró ffmpeg en:', projectFfmpegPath);
    throw new ValidationError('No se encontró el ejecutable ffmpeg. Instala ffmpeg-static o configura FFMPEG_PATH.');
  }

  console.log('Resolved ffmpeg binary path:', projectFfmpegPath);
  ffmpeg.setFfmpegPath(projectFfmpegPath);
}

export async function renderVideo(
  audioPath: string,
  subtitlePath: string,
  duration: number
): Promise<{ videoPath: string; videoUrl: string }> {
  return new Promise(async (resolve, reject) => {
    try {
      await initializeFfmpeg();

      const config = getVideoRenderConfig();
      const outputDir = getOutputDirectory();
      await ensureDirectory(outputDir);

      const filename = generateUniqueFilename('mp4');
      const videoPath = path.join(outputDir, filename);

      const videoFilters = createVideoFilters(subtitlePath);

      ffmpeg()
        .input(`color=c=0x1a1f3a:s=1080x1920:d=${duration}`)
        .inputFormat('lavfi')
        .input(audioPath)
        .videoFilters(videoFilters)
        .outputOptions([
          '-map',
          '0:v',
          '-map',
          '1:a',
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
        .on('stderr', (line) => {
          console.log('FFmpeg stderr:', line);
        })
        .on('progress', (progress) => {
          console.log('FFmpeg progress:', progress.percent + '% done');
        })
        .on('end', () => {
          console.log('Video rendering complete');
          const videoUrl = `/outputs/${filename}`;
          resolve({ videoPath, videoUrl });
        })
        .on('error', (err, stdout, stderr) => {
          console.error('FFmpeg error:', err);
          console.error('FFmpeg stdout:', stdout);
          console.error('FFmpeg stderr:', stderr);
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

function createVideoFilters(subtitlePath: string): string[] {
  const scaleFilter = 'scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920';
  const titleOverlay = "drawtext=font='Arial':text='InVideoProprio':fontsize=60:fontcolor=white:borderw=4:bordercolor=black:box=1:boxcolor=black@0.5:boxborderw=10:x=(w-text_w)/2:y=80";

  if (!subtitlePath) {
    return [scaleFilter, titleOverlay];
  }

  const safePath = getSafeSubtitlePath(subtitlePath);
  const subtitleFilter = `subtitles='${safePath}':force_style='FontName=Arial,FontSize=60,PrimaryColour=&H00FFFFFF,OutlineColour=&H00000000,Outline=4,Shadow=4,Alignment=5,MarginV=160'`;

  return [scaleFilter, titleOverlay, subtitleFilter];
}

function getSafeSubtitlePath(subtitlePath: string): string {
  const normalized = subtitlePath.replace(/\\/g, '/').replace(/'/g, "\\'");
  return normalized.replace(/^([A-Za-z]):\//, '$1\\:/');
}
