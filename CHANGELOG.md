# Changelog

## Unreleased

- chore: actualizar dependencias para corregir vulnerabilidades (Next, eslint-config-next, postcss, uuid)
- fix: eliminar `swcMinify` en `next.config.js`
- fix: corregir tipos TypeScript (`publishedAt` rename, `crf` en `VideoRenderConfig`, añadir `@types/fluent-ffmpeg`)
- feat: inicialización perezosa del cliente OpenAI para evitar fallos en build
- style: añadir `eslint.config.js` y ajustar script `lint` a `eslint src --ext .ts,.tsx`

> Nota: Las variables de entorno `OPENAI_API_KEY` y `ELEVENLABS_API_KEY` siguen siendo requeridas en tiempo de ejecución para los endpoints que llaman a esos servicios.
