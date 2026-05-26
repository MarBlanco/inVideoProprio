'use client';

export default function LoadingIndicator({
  step,
  message
}: {
  step: string;
  message: string;
}) {
  const steps = ['extracting', 'scripting', 'audio', 'subtitles', 'rendering'];
  const currentIndex = steps.indexOf(step);

  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      <div className="bg-dark-secondary/50 rounded-lg p-6 border border-accent/20">
        <h3 className="text-lg font-semibold mb-4 text-white">
          Generando tu video...
        </h3>

        <div className="space-y-4">
          {steps.map((s, index) => (
            <div key={s} className="flex items-center gap-3">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                  index <= currentIndex
                    ? 'bg-accent text-white'
                    : 'bg-dark-secondary text-gray-400'
                }`}
              >
                {index < currentIndex ? '✓' : index + 1}
              </div>
              <span className={`${index <= currentIndex ? 'text-white' : 'text-gray-400'}`}>
                {formatStepName(s)}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-dark rounded-lg">
          <p className="text-sm text-gray-300 animate-pulse">{message}</p>
        </div>

        <div className="mt-4 w-full bg-dark rounded-full h-2">
          <div
            className="bg-gradient-accent h-2 rounded-full transition-all"
            style={{
              width: `${((currentIndex + 1) / steps.length) * 100}%`
            }}
          />
        </div>
      </div>
    </div>
  );
}

function formatStepName(step: string): string {
  const names: Record<string, string> = {
    extracting: 'Extrayendo contenido',
    scripting: 'Generando guion',
    audio: 'Creando audio',
    subtitles: 'Generando subtítulos',
    rendering: 'Renderizando video'
  };
  return names[step] || step;
}
