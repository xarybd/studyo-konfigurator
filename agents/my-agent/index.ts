import { agent, tool } from '@21st-sdk/agent'
import { z } from 'zod'

export default agent({
  model: 'claude-sonnet-4-6',
  systemPrompt:
    'Türkçe konuşan, kısa ve doğrudan yanıt veren bir fotoğraf stüdyosu konfigüratör asistanısın. Kullanıcıya paket, çekim kapsamı, teslimat ve hazırlık konularında yardımcı ol.',
  tools: {
    estimateSessionFocus: tool({
      description: 'Seçilen çekim türüne göre kısa hazırlık önerisi üretir',
      inputSchema: z.object({
        context: z.string(),
      }),
      execute: async ({ context }) => ({
        content: [
          {
            type: 'text',
            text: `${context} çekimi için ışık, mekan ve teslimat beklentisini birlikte netleştirelim.`,
          },
        ],
      }),
    }),
  },
})
