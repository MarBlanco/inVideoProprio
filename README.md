# InVideoProprio - MVP

Aplicación web para automatizar la creación de videos cortos virales desde artículos y noticias web. Genera videos optimizados para TikTok, Instagram Reels y YouTube Shorts.

## 🚀 Stack Técnico

- **Frontend:** Next.js 15 App Router, React 19, TailwindCSS, TypeScript
- **Backend:** Next.js API Routes, Node.js
- **IA:** OpenAI GPT-4o-mini para generación de guiones
- **Voz:** ElevenLabs para síntesis de voz
- **Video:** FFmpeg para renderización
- **Extracción:** @extractus/article-extractor

## 📋 Requisitos Previos

- Node.js 18+ (recomendado 20 LTS)
- npm o yarn
- FFmpeg instalado en el sistema
- Claves API de:
  - OpenAI (GPT-4o-mini)
  - ElevenLabs (Text-to-Speech)

## 🔧 Instalación Paso a Paso

### 1. Clonar y preparar el proyecto

```bash
cd "e:\Muawallace\02- Programacion\Proyectos propios\InVideoPropio"
```

### 2. Instalar FFmpeg

#### En Windows (usando Chocolatey):

```bash
choco install ffmpeg
```

O descárgalo desde: https://ffmpeg.org/download.html

Verifica la instalación:

```bash
ffmpeg -version
```

#### En macOS:

```bash
brew install ffmpeg
```

#### En Linux:

```bash
sudo apt-get install ffmpeg
```

### 3. Instalar dependencias de Node.js

```bash
npm install
```

O si usas yarn:

```bash
yarn install
```

### 4. Configurar variables de entorno

Copia el archivo `.env.example` a `.env.local`:

```bash
cp .env.example .env.local
```

Edita `.env.local` con tus claves:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000

OPENAI_API_KEY=sk-your-openai-key-here
ELEVENLABS_API_KEY=your-elevenlabs-key-here

NODE_ENV=development

FFMPEG_PATH=/usr/bin/ffmpeg
FFPROBE_PATH=/usr/bin/ffprobe

TEMP_UPLOAD_DIR=/tmp/in-video
MAX_URL_SIZE=2048
REQUEST_TIMEOUT=30000
```

#### Obtener las claves API:

**OpenAI:**
1. Ve a https://platform.openai.com/account/api-keys
2. Crea una nueva API key
3. Cópiala en `OPENAI_API_KEY`

**ElevenLabs:**
1. Ve a https://www.elevenlabs.io/
2. Regístrate y ve a tu dashboard
3. Copia tu API key en `ELEVENLABS_API_KEY`

### 5. Crear directorios necesarios

```bash
mkdir -p public/temp public/outputs
```

### 6. Ejecutar el servidor de desarrollo

```bash
npm run dev
```

La aplicación estará disponible en: **http://localhost:3000**

## 📝 Estructura del Proyecto

```
src/
├── app/
│   ├── api/
│   │   └── generate-video/
│   │       └── route.ts              # API endpoint principal
│   ├── globals.css                   # Estilos globales
│   ├── layout.tsx                    # Layout raíz
│   └── page.tsx                      # Página principal
├── components/
│   ├── VideoGenerator.tsx            # Orquestador principal
│   ├── URLInput.tsx                  # Input para URL
│   ├── LoadingIndicator.tsx          # Indicador de progreso
│   └── VideoPreview.tsx              # Vista previa y descarga
├── lib/
│   ├── article-extractor.ts          # Extracción de contenido
│   ├── openai-service.ts             # Generación de guion
│   ├── elevenlabs-service.ts         # Síntesis de voz
│   ├── subtitle-generator.ts         # Generación de subtítulos
│   └── ffmpeg-renderer.ts            # Renderización de video
├── types/
│   └── index.ts                      # Tipos TypeScript
└── utils/
    ├── constants.ts                  # Constantes
    ├── validators.ts                 # Validaciones
    └── file-utils.ts                 # Utilidades de archivo
```

## 🎯 Flujo de Funcionamiento

### 1. Usuario pega URL
```
http://localhost:3000 → Input de URL
```

### 2. Extracción de contenido
```
URL → @extractus/article-extractor → Contenido limpio
```

### 3. Generación de guion
```
Contenido → OpenAI GPT-4o-mini → Guion viral (30s máximo)
```

### 4. Síntesis de voz
```
Guion → ElevenLabs API → Audio MP3
```

### 5. Generación de subtítulos
```
Guion + Timing → Generator → Archivo SRT
```

### 6. Renderización de video
```
Audio + Subtítulos → FFmpeg → Video MP4 (1080x1920)
```

### 7. Descarga
```
Video MP4 → Cliente → Descarga
```

## 🎬 Uso de la Aplicación

1. Abre http://localhost:3000
2. Pega un link a un artículo o noticia
3. Haz clic en "🎬 Generar Video"
4. Espera mientras se generan:
   - Contenido
   - Guion
   - Audio
   - Subtítulos
   - Video final
5. Descarga el MP4 con "📥 Descargar Video"
6. Sube a TikTok, Instagram Reels o YouTube Shorts

## 🔧 Configuración de FFmpeg

El proyecto usa `fluent-ffmpeg` con la siguiente configuración:

- **Resolución:** 1080x1920 (vertical)
- **Codec video:** libx264 (H.264)
- **Bitrate:** 8000 kbps
- **FPS:** 30
- **Codec audio:** AAC
- **Bitrate audio:** 192 kbps
- **Fondo:** Color sólido (#1a1f3a)
- **Subtítulos:** Quemados en blanco

## 📦 Dependencias Principales

```json
{
  "next": "15.0.0",
  "react": "19.0.0",
  "openai": "^4.56.0",
  "elevenlabs": "^0.2.26",
  "@extractus/article-extractor": "^9.2.0",
  "fluent-ffmpeg": "^2.1.3",
  "ffmpeg-static": "^5.2.0",
  "axios": "^1.7.2",
  "tailwindcss": "^3.4.1"
}
```

## ⚙️ Variables de Entorno Explicadas

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `OPENAI_API_KEY` | Clave de OpenAI | sk-... |
| `ELEVENLABS_API_KEY` | Clave de ElevenLabs | ... |
| `FFMPEG_PATH` | Ruta a FFmpeg en el sistema | /usr/bin/ffmpeg |
| `TEMP_UPLOAD_DIR` | Directorio temporal | /tmp/in-video |
| `REQUEST_TIMEOUT` | Timeout para requests | 30000 |

## 🐛 Solución de Problemas

### Error: "FFmpeg no encontrado"
```bash
# Windows - Instala FFmpeg
choco install ffmpeg

# macOS
brew install ffmpeg

# Linux
sudo apt-get install ffmpeg
```

Verifica que esté en PATH:
```bash
which ffmpeg  # Linux/macOS
where ffmpeg  # Windows
```

### Error: "OpenAI API Key inválida"
- Verifica que `OPENAI_API_KEY` esté en `.env.local`
- Asegúrate de que tiene la clave completa (incluye "sk-")
- Comprueba que tu cuenta OpenAI tiene saldo

### Error: "ElevenLabs API Key inválida"
- Verifica que `ELEVENLABS_API_KEY` esté en `.env.local`
- Comprueba en https://www.elevenlabs.io/account que la clave sea válida
- Asegúrate de tener créditos disponibles

### Video no se renderiza
- Verifica que `public/temp` y `public/outputs` existan
- Comprueba que FFmpeg esté correctamente instalado
- Revisa los logs en consola para más detalles

## 🚀 Comandos Disponibles

```bash
# Desarrollo
npm run dev              # Inicia servidor en http://localhost:3000

# Build
npm run build            # Compila para producción

# Producción
npm start                # Ejecuta build compilado

# Linting
npm run lint             # Ejecuta ESLint
```

## 📊 Limitaciones Actuales

- Máximo 30 segundos de video
- Un único formato de fuente
- Fondo simple (color sólido)
- Sin animaciones complejas
- Video vertical únicamente (1080x1920)

## 🎨 Personalización

### Cambiar colores
Edita `tailwind.config.ts`:
```ts
colors: {
  dark: '#0a0e27',
  'dark-secondary': '#1a1f3a',
  accent: '#7c3aed'  // Cambia aquí
}
```

### Cambiar voz de ElevenLabs
En `src/utils/constants.ts`:
```ts
ELEVENLABS: {
  VOICE_ID: '21m00Tcm4TlvDq8ikWAM',  // Cambiar ID de voz
  STABILITY: 0.5,
  SIMILARITY_BOOST: 0.75
}
```

### Ajustar duración máxima de video
En `src/utils/constants.ts`:
```ts
SCRIPT: {
  MAX_DURATION: 60,  // Cambiar a 60 segundos, por ejemplo
  ...
}
```

## 🔐 Consideraciones de Seguridad

- Nunca commitees `.env.local` con tus claves
- Las claves API se validan en el servidor, no en el cliente
- Todas las URLs se validan antes de procesarse
- Los archivos temporales se limpian automáticamente

## 📈 Próximas Mejoras (NO en este MVP)

- [ ] Editor de guion
- [ ] Múltiples voces
- [ ] Animaciones de texto
- [ ] Stock de imágenes/videos
- [ ] Generación de escenas con IA
- [ ] Base de datos para historial
- [ ] Sistema de usuarios
- [ ] Analytics

## 📄 Licencia

Este proyecto es MVP privado.

## 💬 Soporte

Para problemas o sugerencias:
1. Revisa los logs en consola
2. Verifica las variables de entorno
3. Comprueba que FFmpeg esté instalado
4. Asegúrate de tener créditos en las APIs

---

**Versión:** 0.1.0  
**Última actualización:** 2024
