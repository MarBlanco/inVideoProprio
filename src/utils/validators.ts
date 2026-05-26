import { CONSTANTS } from './constants';

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export function validateURL(url: string): boolean {
  if (!url || url.length > CONSTANTS.TIMEOUT) {
    throw new ValidationError('URL inválida o demasiado larga');
  }

  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    throw new ValidationError('URL no válida. Debe ser http:// o https://');
  }
}

export function validateAPIKeys(): void {
  if (!process.env.OPENAI_API_KEY) {
    throw new ValidationError('OPENAI_API_KEY no configurada');
  }
  if (!process.env.ELEVENLABS_API_KEY) {
    throw new ValidationError('ELEVENLABS_API_KEY no configurada');
  }
}

export function validateJSON(data: unknown): boolean {
  return typeof data === 'object' && data !== null;
}
