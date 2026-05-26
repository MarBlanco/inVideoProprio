# 🔐 Guía de Configuración de APIs

## OpenAI API Setup

### 1. Crear cuenta OpenAI

1. Ve a https://platform.openai.com
2. Haz clic en "Sign up" 
3. Completa el registro (email + contraseña)
4. Verifica tu email

### 2. Añadir método de pago

1. Ve a https://platform.openai.com/account/billing/overview
2. Haz clic en "Set up paid account"
3. Añade tarjeta de crédito
4. Activa el pago automático

### 3. Generar API Key

1. Ve a https://platform.openai.com/account/api-keys
2. Haz clic en "Create new secret key"
3. Dale un nombre: "InVideoProprio" (opcional)
4. Copia la clave completa (empieza con "sk-")
5. **Guárdala en un lugar seguro - no se mostrará nuevamente**

### 4. Configurar en .env.local

```env
OPENAI_API_KEY=sk-tu-clave-aqui
```

### 5. Verificar que funciona

```bash
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer sk-tu-clave-aqui"
```

Deberías ver una lista de modelos.

---

## ElevenLabs API Setup

### 1. Crear cuenta ElevenLabs

1. Ve a https://www.elevenlabs.io
2. Haz clic en "Sign up for free"
3. Completa el registro
4. Verifica tu email

### 2. Obtener API Key

1. Una vez logueado, ve a https://www.elevenlabs.io/account
2. En la sección "API Key", haz clic en el icono de copiar
3. Copia la clave

### 3. Configurar en .env.local

```env
ELEVENLABS_API_KEY=tu-clave-aqui
```

### 4. Créditos disponibles

- Cuentas gratuitas: 10,000 caracteres/mes
- Cada palabra ≈ 5 caracteres
- Un video típico = 100-200 palabras = 500-1000 caracteres

Para usar más, actualiza a plan de pago.

---

## Verificar que todo funciona

### Prueba 1: Verificar .env.local

```bash
# Linux/macOS
echo $OPENAI_API_KEY

# Windows PowerShell
$env:OPENAI_API_KEY
```

Deberías ver tu clave (empieza con "sk-" para OpenAI).

### Prueba 2: Ejecutar servidor

```bash
npm run dev
```

Deberías ver:
```
> Ready in 1234ms
> Local: http://localhost:3000
```

### Prueba 3: Test rápido

1. Abre http://localhost:3000
2. Pega una URL: https://www.bbc.com/news/
3. Haz clic en "🎬 Generar Video"
4. Espera ~30 segundos

Deberías ver un video generado.

---

## Costos Estimados

### OpenAI GPT-4o-mini
- Entrada: $0.00015 por 1K tokens
- Salida: $0.0006 por 1K tokens
- **Estimado por video: $0.001 - $0.005**

### ElevenLabs
- Plan gratuito: 10,000 caracteres/mes
- Plan Pro: $99/mes (1,000,000 caracteres)
- **Estimado por video: 1-2 caracteres**

---

## Troubleshooting

### Error: "Invalid API Key"

✗ **Problema:** Clave incorrecta en `.env.local`

✓ **Solución:**
1. Verifica que copiaste la clave completa
2. No dejes espacios al inicio o final
3. Reinicia el servidor después de cambiar `.env.local`

### Error: "Quota exceeded"

✗ **Problema:** Se acabaron los créditos

✓ **Solución:**
- OpenAI: Añade método de pago https://platform.openai.com/account/billing/overview
- ElevenLabs: Recarga créditos o espera al próximo período

### Error: "Rate limit exceeded"

✗ **Problema:** Demasiados requests muy rápido

✓ **Solución:**
- Espera 1 minuto
- Si persiste, downgrade el modelo en `src/lib/openai-service.ts`:
  ```ts
  model: 'gpt-3.5-turbo'  // Más barato y más rápido
  ```

---

## URLs importantes

| Servicio | URL |
|----------|-----|
| OpenAI Dashboard | https://platform.openai.com |
| OpenAI API Keys | https://platform.openai.com/account/api-keys |
| OpenAI Billing | https://platform.openai.com/account/billing/overview |
| ElevenLabs Dashboard | https://www.elevenlabs.io |
| ElevenLabs Account | https://www.elevenlabs.io/account |

---

## Seguridad

⚠️ **IMPORTANTE:**

1. **Nunca** commits `.env.local` a Git
2. **Nunca** compartas tus claves API
3. Las claves solo funcionan en el servidor (backend)
4. Si expones accidentalmente una clave, regenera inmediatamente

Para regenerar:
- OpenAI: https://platform.openai.com/account/api-keys (delete + create new)
- ElevenLabs: https://www.elevenlabs.io/account (regenerate)

---

Esto debería ser todo lo que necesitas. ¡Happy video generation! 🚀
