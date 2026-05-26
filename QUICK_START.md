# ⚡ Quick Start - Ejecutar en 5 minutos

## 1️⃣ Instalar dependencias

```bash
cd "e:\Muawallace\02- Programacion\Proyectos propios\InVideoPropio"
npm install
```

## 2️⃣ Instalar FFmpeg

### Windows (Chocolatey):
```bash
choco install ffmpeg
```

### macOS:
```bash
brew install ffmpeg
```

### Linux:
```bash
sudo apt-get install ffmpeg
```

Verifica:
```bash
ffmpeg -version
```

## 3️⃣ Configurar claves API

Copia `.env.example` a `.env.local`:
```bash
cp .env.example .env.local
```

Edita `.env.local` y añade:

```env
OPENAI_API_KEY=sk-tu-clave-openai
ELEVENLABS_API_KEY=tu-clave-elevenlabs
```

**Obtener claves:**
- OpenAI: https://platform.openai.com/account/api-keys
- ElevenLabs: https://www.elevenlabs.io/account

## 4️⃣ Crear directorios

```bash
mkdir -p public/temp public/outputs
```

## 5️⃣ Ejecutar

```bash
npm run dev
```

Abre: **http://localhost:3000**

## 🎬 Uso

1. Pega un URL de artículo
2. Haz clic en "🎬 Generar Video"
3. Espera ~ 30-60 segundos
4. Descarga el MP4

¡Listo! 🚀

---

## 🆘 Problemas Comunes

| Problema | Solución |
|----------|----------|
| FFmpeg no encontrado | Instala FFmpeg, verifica `ffmpeg -version` |
| API Key inválida | Comprueba `.env.local` tiene las claves correctas |
| Puerto 3000 en uso | Cambia en `.env.local`: `NEXT_PUBLIC_API_URL=http://localhost:3001` |
| Video no se crea | Verifica `public/temp` y `public/outputs` existen |

## 📱 URLs para Probar

Prueba con estos artículos:
- https://www.bbc.com/news
- https://www.bbc.com/mundo
- https://www.cnn.com
- https://www.eluniversal.com.mx/

## 🔨 Desarrollo

```bash
npm run dev     # Modo desarrollo
npm run build   # Compilar
npm start       # Ejecutar build
npm run lint    # Verificar código
```

---

Consola: http://localhost:3000/  
API: http://localhost:3000/api/generate-video (POST)
