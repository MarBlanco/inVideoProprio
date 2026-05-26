#!/bin/bash

# Test manual del API de InVideoProprio
# Uso: bash test-api.sh "https://example.com/article"

if [ -z "$1" ]; then
    echo "❌ Error: Debes proporcionar una URL"
    echo "Uso: bash test-api.sh \"https://example.com/article\""
    exit 1
fi

URL="$1"

echo "🧪 Test de API - InVideoProprio"
echo "================================"
echo ""
echo "URL: $URL"
echo ""
echo "Enviando request a http://localhost:3000/api/generate-video..."
echo ""

# Fazer request
curl -X POST http://localhost:3000/api/generate-video \
  -H "Content-Type: application/json" \
  -d "{\"url\": \"$URL\"}" \
  -w "\n\nStatus: %{http_code}\n" \
  -v

echo ""
echo "================================"
echo "Test completado"
