@echo off
REM InVideoProprio - Setup para Windows

echo.
echo 🚀 InVideoProprio - Setup Inicial
echo ==================================
echo.

REM Verificar Node.js
echo ✓ Verificando Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo ✗ Node.js no está instalado
    echo Descarga desde: https://nodejs.org ^(LTS recomendado^)
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo   Version encontrada: %NODE_VERSION%
echo.

REM Verificar FFmpeg
echo ✓ Verificando FFmpeg...
ffmpeg -version >nul 2>&1
if errorlevel 1 (
    echo ⚠ FFmpeg no está instalado
    echo Instala con:
    echo   Option 1: choco install ffmpeg
    echo   Option 2: Descarga desde https://ffmpeg.org/download.html
    echo.
) else (
    for /f "tokens=*" %%i in ('ffmpeg -version ^| findstr /R "ffmpeg version"') do set FFMPEG_VERSION=%%i
    echo   ✓ FFmpeg instalado
)
echo.

REM Instalar dependencias npm
echo ✓ Instalando dependencias npm...
call npm install

if %errorlevel% equ 0 (
    echo   ✓ Dependencias instaladas
) else (
    echo   ✗ Error al instalar dependencias
    exit /b 1
)
echo.

REM Crear directorios
echo ✓ Creando directorios...
if not exist public\temp mkdir public\temp
if not exist public\outputs mkdir public\outputs
echo   ✓ Directorios creados
echo.

REM Crear .env.local
echo ✓ Configurando variables de entorno...
if not exist .env.local (
    copy .env.example .env.local >nul
    echo   ✓ Archivo .env.local creado
    echo   ⚠ IMPORTANTE: Edita .env.local con tus claves API
) else (
    echo   ✓ .env.local ya existe
)
echo.

echo ==================================
echo ✅ Setup completado!
echo.
echo 📝 Próximos pasos:
echo   1. Edita .env.local con tus claves API
echo   2. npm run dev
echo   3. Abre http://localhost:3000
echo.
echo 🔑 Obtén tus claves en:
echo   - OpenAI: https://platform.openai.com/account/api-keys
echo   - ElevenLabs: https://www.elevenlabs.io/account
echo.
pause
