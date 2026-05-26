import { promises as fs } from 'fs';
import path from 'path';
import { SubtitleData, SubtitleSegment, VideoScript, Scene } from '@/types';
import { ensureDirectory, generateUniqueFilename, getTempDirectory } from '@/utils/file-utils';
import { ValidationError } from '@/utils/validators';

export async function generateSubtitles(script: VideoScript, audioDuration: number): Promise<SubtitleData> {
  try {
    const segments = createSubtitleSegments(script, audioDuration);
    const srt = generateSRTContent(segments);

    const tempDir = getTempDirectory();
    await ensureDirectory(tempDir);

    const filename = generateUniqueFilename('srt');
    const filePath = path.join(tempDir, filename);

    await fs.writeFile(filePath, srt, 'utf-8');

    return {
      filePath,
      srt,
      segments
    };
  } catch (error) {
    console.error('Error generating subtitles:', error);
    throw new ValidationError('Error al generar subtítulos');
  }
}

function createSubtitleSegments(script: VideoScript, audioDuration: number): SubtitleSegment[] {
  const segments: SubtitleSegment[] = [];
  let currentTime = 0;
  let index = 1;

  const hookDuration = 3;
  segments.push({
    index: index++,
    startTime: timeToSRT(currentTime),
    endTime: timeToSRT(currentTime + hookDuration),
    text: script.hook
  });
  currentTime += hookDuration;

  for (const scene of script.scenes) {
    const sceneDuration = scene.duration;
    segments.push({
      index: index++,
      startTime: timeToSRT(currentTime),
      endTime: timeToSRT(currentTime + sceneDuration),
      text: scene.text
    });
    currentTime += sceneDuration;
  }

  const ctaDuration = 2;
  segments.push({
    index: index++,
    startTime: timeToSRT(currentTime),
    endTime: timeToSRT(Math.min(currentTime + ctaDuration, audioDuration)),
    text: script.cta
  });

  return segments;
}

function timeToSRT(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  const ms = Math.floor((seconds % 1) * 1000);

  return `${pad(hours)}:${pad(minutes)}:${pad(secs)},${pad(ms, 3)}`;
}

function pad(num: number, length = 2): string {
  return String(num).padStart(length, '0');
}

function generateSRTContent(segments: SubtitleSegment[]): string {
  return segments
    .map(
      segment =>
        `${segment.index}\n${segment.startTime} --> ${segment.endTime}\n${segment.text}\n`
    )
    .join('\n');
}
