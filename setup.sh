#!/bin/bash

echo "🚀 InVideoProprio - Setup Inicial"
echo "=================================="
echo ""

# Verificar Node.js
echo "✓ Verificando Node.js..."
if ! command -v node &> /dev/null; then
    echo "✗ Node.js no está instalado"
    echo "Descarga desde: https://nodejs.org (LTS recomendado)"
    exit 1
fi

NODE_VERSION=$(node -v)
echo "  Version encontrada: $NODE_VERSION"
echo ""

# Verificar FFmpeg
echo "✓ Verificando FFmpeg..."
if ! command -v ffmpeg &> /dev/null; then
    echo "⚠ FFmpeg no está instalado"
    echo "Instala con:"
    echo "  macOS:   brew install ffmpeg"
    echo "  Windows: choco install ffmpeg"
    echo "  Linux:   sudo apt-get install ffmpeg"
    echo ""
else
    FFMPEG_VERSION=$(ffmpeg -version | head -1)
    echo "  Version encontrada: $FFMPEG_VERSION"
fi
echo ""

# Instalar dependencias npm
echo "✓ Instalando dependencias npm..."
npm install

if [ $? -eq 0 ]; then
    echo "  ✓ Dependencias instaladas"
else
    echo "  ✗ Error al instalar dependencias"
    exit 1
fi
echo ""

# Crear directorios
echo "✓ Creando directorios..."
mkdir -p public/temp
mkdir -p public/outputs
echo "  ✓ Directorios creados"
echo ""

# Crear .env.local
echo "✓ Configurando variables de entorno..."
if [ ! -f .env.local ]; then
    cp .env.example .env.local
    echo "  ✓ Archivo .env.local creado"
    echo "  ⚠ IMPORTANTE: Edita .env.local con tus claves API"
else
    echo "  ✓ .env.local ya existe"
fi
echo ""

echo "=================================="
echo "✅ Setup completado!"
echo ""
echo "📝 Próximos pasos:"
echo "  1. Edita .env.local con tus claves API"
echo "  2. npm run dev"
echo "  3. Abre http://localhost:3000"
echo ""
echo "🔑 Obtén tus claves en:"
echo "  - OpenAI: https://platform.openai.com/account/api-keys"
echo "  - ElevenLabs: https://www.elevenlabs.io/account"
