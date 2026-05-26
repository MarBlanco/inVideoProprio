export const CONSTANTS = {
  VIDEO: {
    WIDTH: 1080,
    HEIGHT: 1920,
    FPS: 30,
    BITRATE: '8000k',
    CODEC: 'libx264',
    FORMAT: 'mp4',
    CRF: 23
  },
  AUDIO: {
    SAMPLE_RATE: 44100,
    CHANNELS: 2,
    BITRATE: '192k'
  },
  SCRIPT: {
    MIN_DURATION: 15,
    MAX_DURATION: 60,
    WORDS_PER_SECOND: 2.5,
    HOOK_DURATION: 3,
    CTA_DURATION: 2
  },
  ELEVENLABS: {
    MODEL_ID: 'eleven_monolingual_v1',
    VOICE_ID: '21m00Tcm4TlvDq8ikWAM',
    STABILITY: 0.5,
    SIMILARITY_BOOST: 0.75
  },
  TIMEOUT: 30000,
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000
};

export const MIME_TYPES = {
  VIDEO: 'video/mp4',
  AUDIO: 'audio/mpeg',
  SUBTITLE: 'text/plain'
};
