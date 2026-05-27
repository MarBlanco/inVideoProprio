import axios from 'axios';
import { promises as fs } from 'fs';
import path from 'path';
import { AudioData } from '@/types';
import { CONSTANTS } from '@/utils/constants';
import { generateAudioWithOpenAI } from '@/lib/openai-service';
import { ensureDirectory, generateUniqueFilename, getTempDirectory } from '@/utils/file-utils';
import { ValidationError } from '@/utils/validators';

const ELEVENLABS_API_URL = 'https://api.elevenlabs.io/v1';

export async function generateAudio(text: string): Promise<AudioData> {
  const cleanText = text.replace(/[^a-zA-Z0-9\s.,!?¿¡'-]/g, ' ').trim();

  if (cleanText.length === 0) {
    throw new ValidationError('El texto está vacío');
  }

  try {
    const apiKey = process.env.ELEVENLABS_API_KEY;
    if (!apiKey) {
      throw new ValidationError('ELEVENLABS_API_KEY no configurada');
    }

    const voiceId = process.env.ELEVENLABS_VOICE_ID || CONSTANTS.ELEVENLABS.VOICE_ID;
    const modelId = process.env.ELEVENLABS_MODEL_ID || CONSTANTS.ELEVENLABS.MODEL_ID;

    if (!voiceId) {
      throw new ValidationError('ELEVENLABS_VOICE_ID no configurada');
    }

    const response = await axios.post(
      `${ELEVENLABS_API_URL}/text-to-speech/${voiceId}`,
      {
        text: cleanText,
        model_id: modelId,
        voice_settings: {
          stability: CONSTANTS.ELEVENLABS.STABILITY,
          similarity_boost: CONSTANTS.ELEVENLABS.SIMILARITY_BOOST
        }
      },
      {
        headers: {
          'xi-api-key': apiKey,
          'Content-Type': 'application/json'
        },
        responseType: 'arraybuffer',
        timeout: CONSTANTS.TIMEOUT
      }
    );

    const tempDir = getTempDirectory();
    await ensureDirectory(tempDir);

    const filename = generateUniqueFilename('mp3');
    const filePath = path.join(tempDir, filename);

    await fs.writeFile(filePath, response.data);

    const duration = estimateAudioDuration(cleanText);

    return {
      filePath,
      duration,
      format: 'mp3'
    };
  } catch (error: unknown) {
    console.error('Error generating audio:', error);
    if (error instanceof ValidationError) throw error;

    if (
      axios.isAxiosError(error) &&
      error.response &&
      typeof error.response.status === 'number'
    ) {
      const status = error.response.status;
      const responseBody = error.response.data;
      const responseText = typeof responseBody === 'string' ? responseBody : JSON.stringify(responseBody || {});

      console.error('ElevenLabs response status:', status);
      console.error('ElevenLabs response data:', responseBody);

      if (status === 401 || status === 403) {
        throw new ValidationError('Clave de ElevenLabs inválida o sin permisos. Verifica tu API key.');
      }

      const fallbackTriggers = [
        'model_not_found',
        'payment_required',
        'subscription_required',
        'voice_not_found',
        'invalid_voice',
        'invalid voice',
        'unsupported model',
        'model_id',
        'voice_id',
        'not found',
        'voice does not exist',
        'voice is not allowed'
      ];

      const shouldFallback =
        status === 400 ||
        status === 402 ||
        status === 404 ||
        status === 422 ||
        fallbackTriggers.some(trigger => responseText.toLowerCase().includes(trigger));

      if (shouldFallback) {
        console.warn('ElevenLabs no está disponible; generando audio con OpenAI como respaldo.');
        return await generateAudioWithOpenAI(cleanText);
      }

      throw new ValidationError(
        `Error de ElevenLabs (${status}). Verifica tu clave y voz.`
      );
    }

    throw new ValidationError('Error al generar audio. Verifica tu clave de ElevenLabs.');
  }
}

function estimateAudioDuration(text: string): number {
  const wordCount = text.split(/\s+/).length;
  return Math.ceil((wordCount / CONSTANTS.SCRIPT.WORDS_PER_SECOND) * 1000) / 1000;
}
