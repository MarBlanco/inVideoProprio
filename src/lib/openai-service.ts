import { OpenAI } from 'openai';
import { VideoScript, Scene } from '@/types';
import { CONSTANTS } from '@/utils/constants';
import { ValidationError } from '@/utils/validators';

function getOpenAIClient(): OpenAI {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new ValidationError('OPENAI_API_KEY no configurada');
  }

  return new OpenAI({ apiKey });
}

export async function generateVideoScript(articleContent: string, title: string): Promise<VideoScript> {
  try {
    const openai = getOpenAIClient();
    const prompt = createScriptPrompt(articleContent, title);

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `Eres un experto en contenido viral para TikTok, Instagram Reels y YouTube Shorts.
          Tu objetivo es crear guiones cortos, dinámicos, con ritmo rápido y altamente retentivos.
          Responde SIEMPRE en JSON válido.`
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1000
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new ValidationError('No se recibió respuesta de OpenAI');
    }

    return parseScriptResponse(content);
  } catch (error) {
    console.error('Error generating script:', error);
    throw new ValidationError('Error al generar el guion. Intenta de nuevo.');
  }
}

function createScriptPrompt(content: string, title: string): string {
  return `Crea un guion viral para un video corto (máximo 30 segundos) basado en este artículo:

TÍTULO: ${title}
CONTENIDO: ${content.substring(0, 1500)}

Requisitos:
- Hook inicial de 3 segundos máximo que capture atención
- Máximo 5-6 escenas cortas con texto impactante
- Cada escena máximo 5 segundos
- Lenguaje coloquial y dinámico
- CTA final de 2 segundos (llamada a la acción)
- Total: 20-30 segundos
- Frases cortas y memorables
- Emojis permitidos en el texto

Responde en JSON con esta estructura exacta:
{
  "hook": "texto del hook inicial impactante",
  "scenes": [
    {"text": "texto escena 1", "duration": 4},
    {"text": "texto escena 2", "duration": 4},
    ...
  ],
  "cta": "texto final de llamada a la acción"
}`;
}

function parseScriptResponse(content: string): VideoScript {
  try {
    let jsonStr = content;

    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      jsonStr = jsonMatch[0];
    }

    const parsed = JSON.parse(jsonStr);

    if (!parsed.hook || !Array.isArray(parsed.scenes) || !parsed.cta) {
      throw new ValidationError('Formato de respuesta inválido');
    }

    const scenes: Scene[] = parsed.scenes.map((scene: any, index: number) => ({
      text: scene.text || '',
      duration: Math.min(scene.duration || 4, 5),
      order: index
    }));

    const hookDuration = CONSTANTS.SCRIPT.HOOK_DURATION;
    const ctaDuration = CONSTANTS.SCRIPT.CTA_DURATION;
    const scenesDuration = scenes.reduce((acc, scene) => acc + scene.duration, 0);
    const totalDuration = hookDuration + scenesDuration + ctaDuration;

    const fullText = [parsed.hook, ...scenes.map(s => s.text), parsed.cta].join(' ');

    return {
      hook: parsed.hook,
      scenes,
      cta: parsed.cta,
      duration: Math.round(totalDuration),
      fullText
    };
  } catch (error) {
    console.error('Error parsing script response:', error);
    throw new ValidationError('Error al procesar la respuesta de la IA');
  }
}
