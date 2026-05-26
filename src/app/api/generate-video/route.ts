import { NextRequest, NextResponse } from 'next/server';
import { extractArticleContent } from '@/lib/article-extractor';
import { generateVideoScript } from '@/lib/openai-service';
import { generateAudio } from '@/lib/elevenlabs-service';
import { generateSubtitles } from '@/lib/subtitle-generator';
import { renderVideo } from '@/lib/ffmpeg-renderer';
import { validateURL, validateAPIKeys } from '@/utils/validators';
import { promises as fs } from 'fs';

export const maxDuration = 60;
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    validateAPIKeys();

    const { url } = await request.json();

    if (!url) {
      return NextResponse.json(
        { error: 'URL requerida', success: false },
        { status: 400 }
      );
    }

    validateURL(url);

    console.log(`[GENERATE VIDEO] Starting for URL: ${url}`);

    const article = await extractArticleContent(url);
    console.log(`[ARTICLE] Extracted: ${article.title}`);

    const script = await generateVideoScript(article.content, article.title);
    console.log(`[SCRIPT] Generated ${script.scenes.length} scenes, duration: ${script.duration}s`);

    const audio = await generateAudio(script.fullText);
    console.log(`[AUDIO] Generated: ${audio.filePath}, duration: ${audio.duration}s`);

    const subtitles = await generateSubtitles(script, audio.duration);
    console.log(`[SUBTITLES] Generated with ${subtitles.segments.length} segments`);

    const { videoPath, videoUrl } = await renderVideo(
      audio.filePath,
      subtitles.filePath,
      Math.ceil(audio.duration)
    );
    console.log(`[VIDEO] Rendered: ${videoPath}`);

    console.log(`[GENERATE VIDEO] Success`);

    return NextResponse.json({
      success: true,
      videoUrl,
      videoPath
    });
  } catch (error) {
    console.error('[GENERATE VIDEO] Error:', error);

    const message =
      error instanceof Error ? error.message : 'Error desconocido al generar video';

    return NextResponse.json(
      {
        error: message,
        success: false
      },
      { status: 500 }
    );
  }
}
