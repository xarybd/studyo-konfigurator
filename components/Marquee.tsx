'use client'

import { useMemo, useRef } from 'react'
import { studioConfig } from '@/studio.config'

const SPEED_DURATION: Record<string, number> = {
  slow: 70,
  medium: 42,
  fast: 24,
}

const DEFAULT_ITEMS = [
  'BAHAR 2026 ÖZEL TARİFE',
  'NİŞAN PAKETLERİNDE %20 İNDİRİM',
  'MART REZERVASYONLARI BAŞLADI',
  'LİMİTLİ KONTENJAN',
  'MAYIS DOLU',
  'DRONE ÇEKİMİ ÜCRETSİZ',
  'NİSAN İÇİN 2 KONTENJAN',
]

export function Marquee() {
  const trackRef = useRef<HTMLDivElement>(null)
  const marqueeConfig = studioConfig.marquee
  const items: readonly string[] = marqueeConfig?.items ?? DEFAULT_ITEMS
  const speed = SPEED_DURATION[marqueeConfig?.speed ?? 'medium'] ?? 42
  const isEnabled = marqueeConfig?.enabled as boolean
  const zigzagPoints = useMemo(
    () => Array.from({ length: 145 }, (_, i) => `${i * 10},${i % 2 === 0 ? 7 : 0}`).join(' '),
    [],
  )

  if (!isEnabled) return null

  const text = items.join('  ·  ')
  const fullText = `${text}  ·  `

  function handleMouseEnter() {
    if (trackRef.current) trackRef.current.style.animationPlayState = 'paused'
  }

  function handleMouseLeave() {
    if (trackRef.current) trackRef.current.style.animationPlayState = 'running'
  }

  return (
    <div className="shrink-0 border-y border-gold/24 bg-[linear-gradient(to_right,rgba(42,37,32,0.05),rgba(184,153,104,0.18),rgba(255,252,245,0.18),rgba(184,153,104,0.16),rgba(42,37,32,0.05))] shadow-[0_-18px_60px_rgba(42,37,32,0.055)] backdrop-blur-md">
      <svg aria-hidden="true" width="100%" height="4" viewBox="0 0 1440 7" preserveAspectRatio="none">
        <polyline
          points={zigzagPoints}
          fill="none"
          stroke="rgba(184,153,104,0.28)"
          strokeWidth="1.5"
          strokeLinejoin="miter"
        />
      </svg>

      <div
        className="overflow-hidden px-0 py-[6px] sm:py-[15px]"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div ref={trackRef} className="marquee-track" style={{ animationDuration: `${speed}s` }}>
          <span className="whitespace-nowrap pl-5 font-body text-[8px] font-medium uppercase tracking-[0.16em] text-ink/58 sm:pl-8 sm:text-[10px] sm:tracking-[0.32em] sm:text-ink/66">
            {fullText}
          </span>
          <span aria-hidden="true" className="whitespace-nowrap pl-5 font-body text-[8px] font-medium uppercase tracking-[0.16em] text-ink/58 sm:pl-8 sm:text-[10px] sm:tracking-[0.32em] sm:text-ink/66">
            {fullText}
          </span>
        </div>
      </div>
    </div>
  )
}
