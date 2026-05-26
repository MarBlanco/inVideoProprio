'use client';

import { useState, useCallback } from 'react';

export default function URLInput({
  onSubmit,
  isLoading
}: {
  onSubmit: (url: string) => void;
  isLoading: boolean;
}) {
  const [url, setUrl] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);

      const trimmedUrl = url.trim();
      if (!trimmedUrl) {
        setError('Por favor, pega una URL válida');
        return;
      }

      try {
        new URL(trimmedUrl);
        onSubmit(trimmedUrl);
      } catch {
        setError('URL inválida. Asegúrate de incluir http:// o https://');
      }
    },
    [url, onSubmit]
  );

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto p-6">
      <div className="space-y-4">
        <div className="relative">
          <label htmlFor="url" className="block text-sm font-medium text-gray-300 mb-2">
            Pega el link de la noticia o artículo
          </label>
          <input
            id="url"
            type="url"
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              setError(null);
            }}
            placeholder="https://ejemplo.com/articulo"
            disabled={isLoading}
            className="w-full px-4 py-3 bg-dark-secondary border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
            <span className="text-red-400 text-sm">{error}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading || !url.trim()}
          className="w-full px-6 py-3 bg-gradient-accent text-white font-semibold rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Generando...
            </>
          ) : (
            <>
              🎬 Generar Video
            </>
          )}
        </button>
      </div>
    </form>
  );
}
