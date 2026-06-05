'use client'
import { useRef } from 'react'
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

function ZigzagBorder() {
  const steps = 145
  const points = Array.from({ length: steps }, (_, i) =>
    `${i * 10},${i % 2 === 0 ? 7 : 0}`
  ).join(' ')

  return (
    <svg
      aria-hidden="true"
      width="100%"
      height="7"
      viewBox="0 0 1440 7"
      preserveAspectRatio="none"
      style={{ display: 'block' }}
    >
      <polyline
        points={points}
        fill="none"
        stroke="rgba(184,153,104,0.28)"
        strokeWidth="1.5"
        strokeLinejoin="miter"
      />
    </svg>
  )
}

export function Marquee() {
  const trackRef = useRef<HTMLDivElement>(null)
  const marqueeConfig = studioConfig.marquee
  const items = (marqueeConfig?.items as string[] | undefined) ?? DEFAULT_ITEMS
  const speed = SPEED_DURATION[marqueeConfig?.speed ?? 'medium'] ?? 42

  if (marqueeConfig?.enabled === false) return null

  const text = items.join('  ·  ')
  const fullText = text + '  ·  '

  function handleMouseEnter() {
    if (trackRef.current) trackRef.current.style.animationPlayState = 'paused'
  }
  function handleMouseLeave() {
    if (trackRef.current) trackRef.current.style.animationPlayState = 'running'
  }

  return (
    <div
      style={{
        background: 'linear-gradient(to right, rgba(184,153,104,0.06) 0%, rgba(184,153,104,0.1) 50%, rgba(184,153,104,0.06) 100%)',
        borderTop: '0px',
      }}
    >
      <ZigzagBorder />

      <div
        className="overflow-hidden py-[13px] px-0"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div
          ref={trackRef}
          className="marquee-track"
          style={{ animationDuration: `${speed}s` }}
        >
          <span
            className="whitespace-nowrap font-body text-[10px] tracking-[0.3em] uppercase pl-8"
            style={{ color: 'rgba(90,80,72,0.6)' }}
          >
            {fullText}
          </span>
          <span
            aria-hidden="true"
            className="whitespace-nowrap font-body text-[10px] tracking-[0.3em] uppercase pl-8"
            style={{ color: 'rgba(90,80,72,0.6)' }}
          >
            {fullText}
          </span>
        </div>
      </div>
    </div>
  )
}
