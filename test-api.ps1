# Test manual del API de InVideoProprio (PowerShell)
# Uso: PowerShell -ExecutionPolicy Bypass -File test-api.ps1 -Url "https://example.com/article"

param(
    [string]$Url = ""
)

if ([string]::IsNullOrEmpty($Url)) {
    Write-Host "❌ Error: Debes proporcionar una URL" -ForegroundColor Red
    Write-Host "Uso: PowerShell -ExecutionPolicy Bypass -File test-api.ps1 -Url 'https://example.com/article'" -ForegroundColor Yellow
    exit 1
}

Write-Host "🧪 Test de API - InVideoProprio" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "URL: $Url"
Write-Host ""
Write-Host "Enviando request a http://localhost:3000/api/generate-video..." -ForegroundColor Yellow
Write-Host ""

# Crear JSON body
$body = @{
    url = $Url
} | ConvertTo-Json

# Hacer request
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000/api/generate-video" `
        -Method POST `
        -Headers @{"Content-Type" = "application/json"} `
        -Body $body `
        -Verbose

    Write-Host ""
    Write-Host "✅ Response Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host ""
    Write-Host "Response Body:" -ForegroundColor Cyan
    Write-Host $response.Content | ConvertFrom-Json | ConvertTo-Json -Depth 10
}
catch {
    Write-Host ""
    Write-Host "❌ Error: $_" -ForegroundColor Red
    Write-Host ""
    Write-Host "Verifica que:" -ForegroundColor Yellow
    Write-Host "  1. El servidor esté corriendo (npm run dev)"
    Write-Host "  2. Las claves API estén configuradas en .env.local"
    Write-Host "  3. La URL sea válida"
}

Write-Host ""
Write-Host "================================" -ForegroundColor Cyan
Write-Host "Test completado"
