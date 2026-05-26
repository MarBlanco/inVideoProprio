import axios from 'axios';
import { promises as fs } from 'fs';
import path from 'path';
import { AudioData } from '@/types';
import { CONSTANTS } from '@/utils/constants';
import { ensureDirectory, generateUniqueFilename, getTempDirectory } from '@/utils/file-utils';
import { ValidationError } from '@/utils/validators';

const ELEVENLABS_API_URL = 'https://api.elevenlabs.io/v1';

export async function generateAudio(text: string): Promise<AudioData> {
  try {
    const apiKey = process.env.ELEVENLABS_API_KEY;
    if (!apiKey) {
      throw new ValidationError('ELEVENLABS_API_KEY no configurada');
    }

    const cleanText = text.replace(/[^a-zA-Z0-9\s.,!?¿¡'-]/g, ' ').trim();

    if (cleanText.length === 0) {
      throw new ValidationError('El texto está vacío');
    }

    const voiceId = CONSTANTS.ELEVENLABS.VOICE_ID;

    const response = await axios.post(
      `${ELEVENLABS_API_URL}/text-to-speech/${voiceId}`,
      {
        text: cleanText,
        model_id: CONSTANTS.ELEVENLABS.MODEL_ID,
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
  } catch (error) {
    console.error('Error generating audio:', error);
    if (error instanceof ValidationError) throw error;
    throw new ValidationError('Error al generar audio. Verifica tu clave de ElevenLabs.');
  }
}

function estimateAudioDuration(text: string): number {
  const wordCount = text.split(/\s+/).length;
  return Math.ceil((wordCount / CONSTANTS.SCRIPT.WORDS_PER_SECOND) * 1000) / 1000;
}
