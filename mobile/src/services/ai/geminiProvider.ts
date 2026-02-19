import type { AIProvider, AIFormData, DBContext, GeneratedPlan } from './types'
import { buildPrompt, parseGeneratedPlan } from './providerUtils'

const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent'

async function throwGeminiError(response: Response): Promise<never> {
  const errorBody = await response.json().catch(() => ({})) as { error?: { message?: string } }
  throw new Error(`Gemini API erreur ${response.status}: ${errorBody?.error?.message ?? 'Erreur inconnue'}`)
}

export function createGeminiProvider(apiKey: string): AIProvider {
  return {
    async generate(form: AIFormData, context: DBContext): Promise<GeneratedPlan> {
      const response = await fetch(GEMINI_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': apiKey,
        },
        body: JSON.stringify({
          contents: [
            { parts: [{ text: buildPrompt(form, context) }] },
          ],
          generationConfig: {
            maxOutputTokens: 2048,
            temperature: 0.7,
          },
        }),
        signal: AbortSignal.timeout(30000),
      })

      if (!response.ok) {
        return throwGeminiError(response)
      }

      const data = await response.json() as {
        candidates: Array<{ content: { parts: Array<{ text: string }> } }>
      }
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? ''
      return parseGeneratedPlan(text)
    },
  }
}

export async function testGeminiConnection(apiKey: string): Promise<void> {
  const response = await fetch(GEMINI_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': apiKey,
    },
    body: JSON.stringify({
      contents: [
        { parts: [{ text: 'Réponds uniquement "ok".' }] },
      ],
      generationConfig: {
        maxOutputTokens: 10,
        temperature: 0,
      },
    }),
    signal: AbortSignal.timeout(10000),
  })

  if (!response.ok) {
    return throwGeminiError(response)
  }
}
