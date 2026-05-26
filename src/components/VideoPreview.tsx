'use client';

import { useRef, useEffect, useState } from 'react';

export default function VideoPreview({
  videoUrl,
  onDownload
}: {
  videoUrl: string;
  onDownload: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleCanPlay = () => setIsLoading(false);
    const handleError = () => {
      setError('Error al cargar el video');
      setIsLoading(false);
    };

    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('error', handleError);

    return () => {
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('error', handleError);
    };
  }, []);

  return (
    <div className="w-full max-w-sm mx-auto p-6">
      <div className="bg-dark-secondary/50 rounded-lg overflow-hidden border border-accent/20">
        <div className="relative w-full bg-dark aspect-video flex items-center justify-center">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-dark/80 z-10">
              <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {error ? (
            <div className="text-center p-4">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          ) : (
            <video
              ref={videoRef}
              src={videoUrl}
              className="w-full h-full object-contain"
              controls
              playsInline
              preload="metadata"
            />
          )}
        </div>

        <div className="p-4 space-y-3">
          <button
            onClick={onDownload}
            disabled={isLoading || !!error}
            className="w-full px-4 py-2 bg-gradient-accent text-white font-semibold rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
          >
            📥 Descargar Video
          </button>

          <p className="text-xs text-gray-400 text-center">
            MP4 Vertical • Optimizado para TikTok, Reels, Shorts
          </p>
        </div>
      </div>
    </div>
  );
}
