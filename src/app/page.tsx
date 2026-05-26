import VideoGenerator from '@/components/VideoGenerator';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-5xl sm:text-6xl font-bold">
            <span className="gradient-text">InVideoProprio</span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto">
            Convierte artículos en videos virales para TikTok, Instagram Reels y YouTube Shorts
          </p>

          <div className="flex flex-wrap justify-center gap-3 pt-4">
            <span className="px-3 py-1 bg-accent/20 text-accent text-sm rounded-full">
              ✨ Powered by IA
            </span>
            <span className="px-3 py-1 bg-accent/20 text-accent text-sm rounded-full">
              🚀 Generación Automática
            </span>
            <span className="px-3 py-1 bg-accent/20 text-accent text-sm rounded-full">
              📱 Formato Vertical
            </span>
          </div>
        </div>

        <VideoGenerator />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8">
          <div className="bg-dark-secondary/50 border border-accent/20 rounded-lg p-4">
            <h3 className="font-semibold text-accent mb-2">🔗 Pega URL</h3>
            <p className="text-sm text-gray-400">Cualquier artículo o noticia</p>
          </div>
          <div className="bg-dark-secondary/50 border border-accent/20 rounded-lg p-4">
            <h3 className="font-semibold text-accent mb-2">✨ IA Genera Guion</h3>
            <p className="text-sm text-gray-400">Contenido viral optimizado</p>
          </div>
          <div className="bg-dark-secondary/50 border border-accent/20 rounded-lg p-4">
            <h3 className="font-semibold text-accent mb-2">📥 Descarga MP4</h3>
            <p className="text-sm text-gray-400">Listo para redes sociales</p>
          </div>
        </div>
      </div>

      <footer className="fixed bottom-4 right-4 text-xs text-gray-500">
        <p>© 2024 InVideoProprio • MVP v0.1</p>
      </footer>
    </div>
  );
}
