'use client';

import { useState, useCallback } from 'react';
import URLInput from './URLInput';
import LoadingIndicator from './LoadingIndicator';
import VideoPreview from './VideoPreview';
import { GenerationProgress } from '@/types';

export default function VideoGenerator() {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState<GenerationProgress | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = useCallback(async (url: string) => {
    setIsLoading(true);
    setError(null);
    setVideoUrl(null);
    setProgress({ step: 'extracting', message: 'Extrayendo contenido...', progress: 0 });

    try {
      const response = await fetch('/api/generate-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error desconocido');
      }

      const data = await response.json();

      if (data.success) {
        setVideoUrl(data.videoUrl);
        setProgress({ step: 'complete', message: '¡Video listo!', progress: 100 });
        setTimeout(() => setProgress(null), 1000);
      } else {
        throw new Error(data.error || 'Error al generar video');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error desconocido';
      setError(message);
      setProgress(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleDownload = useCallback(async () => {
    if (!videoUrl) return;

    try {
      const response = await fetch(videoUrl);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `video-${Date.now()}.mp4`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (err) {
      console.error('Error descargando video:', err);
      setError('Error al descargar el video');
    }
  }, [videoUrl]);

  return (
    <div className="w-full max-w-4xl mx-auto">
      <URLInput onSubmit={handleGenerate} isLoading={isLoading} />

      {progress && (
        <div className="mt-6">
          <LoadingIndicator step={progress.step} message={progress.message} />
        </div>
      )}

      {error && (
        <div className="w-full max-w-2xl mx-auto p-6">
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-6">
            <h3 className="text-red-400 font-semibold mb-2">Error</h3>
            <p className="text-red-300 text-sm mb-4">{error}</p>
            <button
              onClick={() => {
                setError(null);
                setProgress(null);
              }}
              className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition-colors"
            >
              Intentar de nuevo
            </button>
          </div>
        </div>
      )}

      {videoUrl && (
        <div className="mt-6">
          <VideoPreview videoUrl={videoUrl} onDownload={handleDownload} />
        </div>
      )}
    </div>
  );
}
