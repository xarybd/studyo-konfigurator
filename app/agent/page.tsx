'use client'

import { useMemo } from 'react'
import { useChat, type Chat } from '@ai-sdk/react'
import type { UIMessage } from 'ai'
import { AgentChat, createAgentChat } from '@21st-sdk/nextjs'
import theme from '@/app/theme.json'
import { SiteHeader } from '@/components/SiteHeader'

export default function AgentPage() {
  const chat = useMemo(
    () =>
      createAgentChat({
        agent: 'my-agent',
        tokenUrl: '/api/an-token',
      }),
    [],
  )

  const { messages, sendMessage, status, stop, error } = useChat({
    chat: chat as Chat<UIMessage>,
  })

  return (
    <main className="min-h-screen">
      <SiteHeader />
      <section className="mx-auto flex min-h-[calc(100vh-96px)] w-full max-w-5xl flex-col px-5 pb-8 pt-6 md:px-10">
        <div className="mb-6 text-center">
          <p className="mb-3 font-body text-[9px] uppercase tracking-[0.3em] text-gold-dark/65">
            21st Agent
          </p>
          <h1 className="font-display text-[clamp(34px,5vw,64px)] font-light leading-none text-ink">
            Stüdyo asistanı
          </h1>
          <p className="mx-auto mt-4 max-w-lg font-display text-[15px] italic leading-7 text-ink/45">
            Paket, çekim kapsamı ve teslimat süreci için hızlıca konuşun.
          </p>
        </div>
        <div className="min-h-0 flex-1 rounded-[8px] border border-gold/20 bg-cream/65 p-2 shadow-[0_24px_70px_rgba(42,37,32,0.08)]">
          <AgentChat
            messages={messages}
            onSend={(msg) => sendMessage({ parts: [{ type: 'text', text: msg.content }] })}
            status={status}
            onStop={stop}
            error={error ?? undefined}
            colorMode="light"
            theme={theme}
          />
        </div>
      </section>
    </main>
  )
}
