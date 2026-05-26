# 🚀 GUÍA DE EJECUCIÓN PASO A PASO

Esta guía te mostrará exactamente cómo ejecutar InVideoProprio localmente desde cero.

## ⏱️ Tiempo total estimado: 15-20 minutos

---

## PASO 1: Requisitos Previos

Verifica que tengas instalado:

### Node.js (LTS recomendado)

```bash
node --version
# Debe mostrar v18+ o v20+

npm --version
# Debe mostrar 9+
```

Si no tienes Node.js:
- Descarga desde https://nodejs.org (LTS)
- Instala (sigue instrucciones del instalador)
- Reinicia terminal/cmd
- Verifica con `node --version`

### Git (opcional pero recomendado)

```bash
git --version
```

Si no tienes Git, descarga desde https://git-scm.com

---

## PASO 2: Preparar el Proyecto

### 2.1 Navega al directorio

**Windows (CMD):**
```cmd
cd "e:\Muawallace\02- Programacion\Proyectos propios\InVideoPropio"
```

**Windows (PowerShell):**
```powershell
cd "e:\Muawallace\02- Programacion\Proyectos propios\InVideoPropio"
```

**macOS/Linux:**
```bash
cd "e/Muawallace/02- Programacion/Proyectos propios/InVideoPropio"
```

### 2.2 Verifica que ves los archivos

```bash
ls -la
# o en Windows
dir
```

Deberías ver:
```
package.json
tsconfig.json
next.config.js
tailwind.config.ts
...
```

---

## PASO 3: Instalar FFmpeg

FFmpeg es **OBLIGATORIO** para renderizar videos.

### 3.1 Verifica si ya lo tienes

```bash
ffmpeg -version
```

Si ves información de versión, ¡ya lo tienes! Salta al Paso 4.

### 3.2 Instalación por Sistema Operativo

**Windows (opción A - Chocolatey):**
```bash
choco install ffmpeg
```

Si no tienes Chocolatey:
- Abre PowerShell **como Administrador**
- Pega esto:
```powershell
Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
```
- Luego: `choco install ffmpeg`

**Windows (opción B - Manual):**
1. Ve a https://ffmpeg.org/download.html
2. Descarga versión Windows
3. Extrae en `C:\ffmpeg\`
4. Añade `C:\ffmpeg\bin\` a PATH:
   - Abre "Variables de entorno"
   - Edita `Path`
   - Añade línea: `C:\ffmpeg\bin\`

**macOS:**
```bash
brew install ffmpeg
```

Si no tienes Homebrew:
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt-get update
sudo apt-get install ffmpeg
```

**Linux (Fedora/RedHat):**
```bash
sudo dnf install ffmpeg
```

### 3.3 Verifica que funciona

```bash
ffmpeg -version
```

Deberías ver:
```
ffmpeg version X.X...
```

---

## PASO 4: Instalar Dependencias de Node.js

Desde el directorio del proyecto:

```bash
npm install
```

Esto tardará 2-3 minutos. Espera a que termine completamente.

Deberías ver:
```
added XXX packages in XXs
```

---

## PASO 5: Crear Directorios Necesarios

```bash
mkdir -p public/temp public/outputs
```

En Windows (CMD):
```cmd
mkdir public\temp
mkdir public\outputs
```

---

## PASO 6: Configurar Variables de Entorno

### 6.1 Crear archivo .env.local

Desde la raíz del proyecto, crea un archivo llamado `.env.local`:

**Opción A: Desde terminal**
```bash
cp .env.example .env.local
```

**Opción B: Manual**
1. Copia el contenido de `.env.example`
2. Crea nuevo archivo `.env.local`
3. Pega el contenido
4. Guarda

### 6.2 Configurar claves API

Edita `.env.local` con un editor de texto (VS Code, Notepad++, etc):

```env
NEXT_PUBLIC_API_URL=http://localhost:3000

OPENAI_API_KEY=sk-YOUR-OPENAI-KEY-HERE
ELEVENLABS_API_KEY=YOUR-ELEVENLABS-KEY-HERE

NODE_ENV=development

FFMPEG_PATH=/usr/bin/ffmpeg
FFPROBE_PATH=/usr/bin/ffprobe

TEMP_UPLOAD_DIR=/tmp/in-video
MAX_URL_SIZE=2048
REQUEST_TIMEOUT=30000
```

**⚠️ IMPORTANTE: Reemplaza las claves ficticias con las REALES**

### 6.3 Obtener las claves

**OpenAI:**
1. Ve a https://platform.openai.com/account/api-keys
2. Haz clic en "Create new secret key"
3. Copia la clave (empieza con "sk-")
4. Pega en: `OPENAI_API_KEY=sk-...`

**ElevenLabs:**
1. Ve a https://www.elevenlabs.io/account
2. Copia tu API Key (en la sección API Key)
3. Pega en: `ELEVENLABS_API_KEY=...`

**Nota sobre ffmpeg:**
- Puedes dejar `FFMPEG_PATH` como está si instalaste FFmpeg correctamente
- O especifica la ruta completa donde instalaste FFmpeg

**Archivo final .env.local:**
```env
NEXT_PUBLIC_API_URL=http://localhost:3000

OPENAI_API_KEY=sk-proj-abc123def456xyz789
ELEVENLABS_API_KEY=88d82e63f1234567890abcdef1234567

NODE_ENV=development

FFMPEG_PATH=/usr/bin/ffmpeg
FFPROBE_PATH=/usr/bin/ffprobe

TEMP_UPLOAD_DIR=/tmp/in-video
MAX_URL_SIZE=2048
REQUEST_TIMEOUT=30000
```

**Guarda el archivo.**

---

## PASO 7: Ejecutar el Servidor

Desde la raíz del proyecto:

```bash
npm run dev
```

Deberías ver:

```
> in-video-proprio@0.1.0 dev
> next dev

  ▲ Next.js 15.0.0
  - Local:        http://localhost:3000

✓ Ready in 1234ms
```

**El servidor está ahora corriendo** 🎉

---

## PASO 8: Abrir en el Navegador

### Opción A: Click manual
1. Abre tu navegador (Chrome, Firefox, Edge, etc)
2. Ve a **http://localhost:3000**

### Opción B: Desde terminal
```bash
# macOS
open http://localhost:3000

# Windows
start http://localhost:3000

# Linux
xdg-open http://localhost:3000
```

Deberías ver:
- Título **"InVideoProprio"** en grande
- Input para pegar URL
- Botón **"🎬 Generar Video"**

---

## PASO 9: Probar la Aplicación

### 9.1 Pega una URL de ejemplo

En el input, pega uno de estos links:

```
https://www.bbc.com/news
https://www.bbc.com/mundo/noticias
https://www.cnn.com/americas
https://www.eluniversal.com.mx/
```

### 9.2 Haz clic en "🎬 Generar Video"

Verás un indicador de progreso mostrando:
- ⬜ Extrayendo contenido
- ⬜ Generando guion
- ⬜ Creando audio
- ⬜ Generando subtítulos
- ⬜ Renderizando video

### 9.3 Espera a que termine

Tiempo esperado: **30-60 segundos**

Durante este tiempo el sistema:
1. Descarga el artículo
2. Extrae el contenido
3. Genera guion con IA
4. Crea audio con IA
5. Genera subtítulos
6. Renderiza video con FFmpeg

### 9.4 Descarga el video

Cuando termine:
1. Verás un preview del video
2. Haz clic en **"📥 Descargar Video"**
3. Se descargará `video-TIMESTAMP.mp4`

---

## PASO 10: Verificar que Funciona

### Checklist:

- ✅ Servidor corriendo en `http://localhost:3000`
- ✅ Input de URL visible
- ✅ Botón "Generar Video" funciona
- ✅ Video se genera sin errores
- ✅ Video se puede descargar
- ✅ Video está en formato MP4 vertical (1080x1920)

Si todo está ✅, **¡Felicidades! El MVP funciona correctamente** 🎉

---

## 🆘 Solución de Problemas

### Error: "Cannot find module 'ffmpeg-static'"

```bash
npm install
```

Luego reinicia el servidor:
```bash
npm run dev
```

### Error: "OPENAI_API_KEY not configured"

**Solución:**
1. Verifica que `.env.local` exista
2. Verifica que tenga `OPENAI_API_KEY=sk-...` (con tu clave real)
3. Reinicia terminal/cmd
4. Ejecuta `npm run dev` nuevamente

### Error: "FFmpeg not found"

**Solución:**
1. Verifica que FFmpeg esté instalado: `ffmpeg -version`
2. Si ves un error, instala FFmpeg nuevamente (Paso 3)
3. Si en Windows, verifica que está en PATH:
   - Abre PowerShell como Admin
   - Pega: `[Environment]::SetEnvironmentVariable("Path", "$env:Path;C:\ffmpeg\bin", "User")`
   - Reinicia terminal

### Error: "Port 3000 already in use"

El puerto 3000 está siendo usado por otro proceso.

**Solución A: Usar puerto diferente**
```bash
PORT=3001 npm run dev
```

Luego abre: `http://localhost:3001`

**Solución B: Matar el proceso**
```bash
# Linux/macOS
lsof -i :3000
kill -9 <PID>

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Error: "Video no se genera"

1. Verifica que FFmpeg esté instalado
2. Verifica que `public/temp` y `public/outputs` existan
3. Verifica que haya espacio en disco (mínimo 100MB)
4. Mira los logs en la consola del servidor

### Error: "Invalid URL"

La URL debe:
- Empezar con `http://` o `https://`
- Ser un artículo/noticia válido
- Estar accesible (sin blocking)

Ejemplos válidos:
```
https://www.bbc.com/news
https://www.wikipedia.org
https://www.medium.com/posts
```

---

## 📋 Comandos Útiles

```bash
# Desarrollar
npm run dev              # Modo desarrollo (hot reload)

# Compilar
npm run build            # Compilar para producción
npm start                # Ejecutar versión compilada

# Linting
npm run lint             # Verificar código

# Limpiar
rm -rf .next            # Limpiar build cache (Linux/macOS)
rmdir /s .next          # Limpiar build cache (Windows)

# Debugging
npm run dev -- -p 3001  # Ejecutar en puerto 3001
```

---

## 📂 Estructura de Archivos Generados

Después de ejecutar:

```
project/
├── .next/              # Build compilado (generado)
├── node_modules/       # Dependencias (generado)
├── public/
│   ├── temp/          # Archivos temporales (generado)
│   └── outputs/       # Videos finales (generado)
├── src/               # Tu código
├── .env.local         # Tus claves (NO commits)
└── ...

Videos descargados:    # Tu PC
├── video-1716xxx.mp4
├── video-1716yyy.mp4
└── ...
```

---

## ✅ Verificación Final

```bash
# Terminal 1: Ejecuta servidor
cd "e:\...\InVideoPropio"
npm run dev

# Terminal 2 (cuando termina instalación):
# Abre http://localhost:3000
# Pega URL de artículo
# Haz clic en "Generar Video"
# Espera y descarga
```

---

## 🎬 Próximos Pasos Después del MVP

Una vez que funciona:

1. **Prueba múltiples URLs** de diferentes sitios
2. **Verifica la calidad** del audio y video
3. **Sube a redes sociales** (TikTok, Reels, Shorts)
4. **Itera** basado en feedback

---

## 📞 Resumen Rápido

```
1. Node.js instalado ✓
2. FFmpeg instalado ✓
3. npm install ✓
4. .env.local configurado ✓
5. npm run dev ✓
6. http://localhost:3000 ✓
7. Pega URL + Generar ✓
8. Descarga MP4 ✓
9. ¡Éxito! 🎉
```

---

¡Disfruta creando videos! 🚀
