# 🏗️ Arquitectura de InVideoProprio MVP

## Visión General

InVideoProprio es una aplicación full-stack que automatiza la creación de videos virales cortos desde artículos web. La arquitectura está diseñada para ser modular, escalable y fácil de mantener.

```
┌─────────────────┐
│   Frontend      │
│   (Next.js 15)  │
└────────┬────────┘
         │ HTTP
         ↓
┌─────────────────────────────────────┐
│   Next.js API Routes                │
├─────────────────────────────────────┤
│ POST /api/generate-video            │
└────────┬────────────────────────────┘
         │
    ┌────┴────┐
    ↓         ↓
┌──────────┐  ┌──────────────┐
│ Services │  │ External     │
│ Backend  │  │ APIs         │
└──────────┘  └──────────────┘
    │              │
    ├─► OpenAI ◄───┤
    ├─► ElevenLabs ◄
    └─► @extractus/article-extractor
         │
    ┌────┴─────┐
    ↓          ↓
┌────────┐ ┌──────────┐
│ FFmpeg │ │ File     │
│        │ │ System   │
└────────┘ └──────────┘
```

## Componentes Principales

### 1. Frontend (React)

**Archivos:**
- `src/app/page.tsx` - Landing page
- `src/components/VideoGenerator.tsx` - Orquestador principal
- `src/components/URLInput.tsx` - Input de URL
- `src/components/LoadingIndicator.tsx` - Indicador de progreso
- `src/components/VideoPreview.tsx` - Preview y descarga

**Características:**
- UI moderna y responsive
- Estado centralizado con React hooks
- Indicador de progreso visual
- Manejo de errores con mensajes claros
- Descarga de videos directa

### 2. Backend (Next.js API Routes)

**Archivos:**
- `src/app/api/generate-video/route.ts` - Endpoint principal

**Responsabilidades:**
- Orquestar el flujo completo de generación
- Validar inputs
- Coordinar llamadas a servicios externos
- Gestionar errores
- Retornar resultados al cliente

### 3. Servicios de Backend

#### Article Extractor (`src/lib/article-extractor.ts`)
```
URL → @extractus/article-extractor → HTML limpio
       ↓
     Limpieza de HTML
       ↓
   ExtractedArticle {
     title,
     content,
     description,
     image,
     author,
     publishedAt
   }
```

#### OpenAI Service (`src/lib/openai-service.ts`)
```
ArticleContent → GPT-4o-mini → JSON parsed → VideoScript {
                                                hook,
                                                scenes[],
                                                cta,
                                                duration,
                                                fullText
                                              }

Prompt Engineering:
- Hook inicial (3s): Captura atención
- Scenes: 5-6 escenas cortas
- CTA: Llamada a acción (2s)
- Total: 20-30 segundos
```

#### ElevenLabs Service (`src/lib/elevenlabs-service.ts`)
```
FullText → ElevenLabs API → Audio Buffer → MP3 file
                ↓
         Estimación de duración
         (palabras ÷ 2.5 = segundos)
```

#### Subtitle Generator (`src/lib/subtitle-generator.ts`)
```
VideoScript + Audio Duration → SubtitleSegments
                                      ↓
                                  SRT Format
                                      ↓
                                  SRT File

SRT Format:
1
00:00:00,000 --> 00:00:03,000
Texto del hook

2
00:00:03,000 --> 00:00:07,000
Texto de escena 1
...
```

#### FFmpeg Renderer (`src/lib/ffmpeg-renderer.ts`)
```
Audio + Subtítulos → FFmpeg → Video MP4
                          ↓
       Filter Complex:
       - Color fondo: #1a1f3a
       - Resolución: 1080x1920 (vertical)
       - Codec: libx264 (H.264)
       - Bitrate: 8000 kbps
       - FPS: 30
       - Audio: AAC 192kbps
       - Subtítulos: Quemados en blanco
```

## Flujo de Datos Paso a Paso

### 1. Usuario envía URL
```
Cliente → POST /api/generate-video
         {url: "https://example.com/article"}
```

### 2. Backend recibe y valida
```javascript
// Validación
- URL válida (http/https)
- API keys configuradas
- Tamaño URL < 2048 caracteres
```

### 3. Extracción de contenido
```javascript
const article = await extractArticleContent(url);
// Retorna: {title, content, description, image, author, publishedAt}
```

### 4. Generación de guion con IA
```javascript
const script = await generateVideoScript(article.content, article.title);
// Retorna: {hook, scenes, cta, duration, fullText}
```

### 5. Síntesis de voz
```javascript
const audio = await generateAudio(script.fullText);
// Retorna: {filePath, duration, format}
```

### 6. Generación de subtítulos
```javascript
const subtitles = await generateSubtitles(script, audio.duration);
// Retorna: {filePath, srt, segments}
```

### 7. Renderización de video
```javascript
const {videoPath, videoUrl} = await renderVideo(
  audio.filePath,
  subtitles.filePath,
  duration
);
// Retorna: {videoPath: "/path/to/video.mp4", videoUrl: "/outputs/uuid.mp4"}
```

### 8. Cliente descarga
```javascript
// Usuario ve preview de video
// Haz clic en "Descargar"
// Se descarga video.mp4
```

## Estructura de Carpetas

```
src/
├── app/
│   ├── api/
│   │   └── generate-video/
│   │       └── route.ts              # Endpoint principal
│   ├── globals.css                   # Estilos globales
│   ├── layout.tsx                    # Layout raíz
│   └── page.tsx                      # Landing page
├── components/
│   ├── VideoGenerator.tsx            # Componente raíz
│   ├── URLInput.tsx                  # Input URL
│   ├── LoadingIndicator.tsx          # Progreso
│   └── VideoPreview.tsx              # Preview
├── lib/
│   ├── article-extractor.ts          # Extracción
│   ├── openai-service.ts             # Generación guion
│   ├── elevenlabs-service.ts         # Síntesis voz
│   ├── subtitle-generator.ts         # Subtítulos
│   ├── ffmpeg-renderer.ts            # Renderizado
│   └── ffmpeg-utils.ts               # Helpers FFmpeg
├── types/
│   └── index.ts                      # TypeScript types
└── utils/
    ├── constants.ts                  # Constantes
    ├── validators.ts                 # Validaciones
    └── file-utils.ts                 # Manejo archivos

public/
├── temp/                             # Archivos temporales
└── outputs/                          # Videos finales
```

## Flujo de Errores

```
Validación URL
    ↓
   ✗ → Error 400: "URL inválida"

Extracción de artículo
    ↓
   ✗ → Error 500: "No se pudo extraer contenido"

Generación de guion
    ↓
   ✗ → Error 500: "Error al generar guion"

Síntesis de voz
    ↓
   ✗ → Error 500: "Error al generar audio"

Generación de subtítulos
    ↓
   ✗ → Error 500: "Error al generar subtítulos"

Renderizado de video
    ↓
   ✗ → Error 500: "Error al renderizar video"

Todo OK
    ↓
    ✓ → 200: {success: true, videoUrl}
```

## Manejo de Archivos

```
Ciclo de vida de archivos:
1. Creación: generate Audio/Subtitles → public/temp/
2. Procesamiento: FFmpeg lee archivos → Renderiza
3. Resultado: Video final → public/outputs/
4. Limpieza: Archivos temp se limpian (opcional)

Convención de nombres:
- UUID + extensión
- Ejemplo: "a1b2c3d4-e5f6-7890-abcd-ef1234567890.mp3"

Tamaños típicos:
- Audio (30s): 200-300 KB
- Subtítulos: 5-10 KB
- Video (30s): 5-15 MB
```

## Rendimiento

### Tiempos estimados por etapa:

| Etapa | Tiempo |
|-------|--------|
| Extracción de contenido | 2-3s |
| Generación de guion (OpenAI) | 3-5s |
| Síntesis de voz (ElevenLabs) | 5-10s |
| Generación de subtítulos | <1s |
| Renderizado de video (FFmpeg) | 15-30s |
| **Total** | **30-50s** |

### Optimizaciones implementadas:

1. **API calls en serie**: No se hacen llamadas paralelas (podrían mejorar, pero añade complejidad)
2. **Cache de FFmpeg**: Reutiliza buffers
3. **Compresión de video**: Preset 'fast' balancea calidad/velocidad
4. **CRF 23**: Balance entre calidad visual y tamaño

## Seguridad

### 1. Validación de Entrada
```typescript
- URL: Validada como URL válida (http/https)
- Tamaño: Limitado a 2048 caracteres
- Content: Limpieza de HTML/etiquetas maliciosas
```

### 2. API Keys
```typescript
- Solo se usan en servidor (backend)
- No se exponen al cliente
- Se validan al inicio
```

### 3. Limpieza de Archivos
```typescript
- Archivos temporales en carpeta aislada
- Se pueden limpiar después de procesamiento
- No se accede a directorios del sistema
```

## Escalabilidad

### Mejoras futuras (post-MVP):

1. **Queue de procesamiento**: Bull/RabbitMQ
2. **Base de datos**: PostgreSQL para historial
3. **Caché**: Redis para resultados frecuentes
4. **Storage**: AWS S3/Cloudinary para videos
5. **CDN**: Cloudflare para distribución
6. **Workers**: Procesamiento en background jobs
7. **Webhooks**: Notificaciones cuando termine

## Monitoreo y Logging

Logs en servidor:
```
[GENERATE VIDEO] Starting for URL: https://example.com
[ARTICLE] Extracted: "Título del Artículo"
[SCRIPT] Generated 5 scenes, duration: 28s
[AUDIO] Generated: /path/to/audio.mp3, duration: 28.5s
[SUBTITLES] Generated with 6 segments
[VIDEO] Rendered: /path/to/video.mp4
[GENERATE VIDEO] Success
```

---

Esta arquitectura es simple pero completa, lista para escalar conforme crece el MVP.
