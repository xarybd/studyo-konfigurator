'use client'

import { GradientMesh } from '@/components/ui/gradient-mesh'
import { cn } from '@/lib/utils'

interface BrandGradientBackdropProps {
  className?: string
  intensity?: 'hero' | 'page' | 'story'
}

const settings = {
  hero: {
    colors: ['#FAF7EF', '#E8D8B8', '#B89968'] as [string, string, string],
    mesh: 'opacity-82',
    overlay: 'bg-[radial-gradient(circle_at_50%_42%,rgba(255,252,245,0.54),rgba(247,241,230,0.28)_36%,rgba(154,126,79,0.06)_100%)]',
    scale: 1.14,
    speed: 0.26,
    waveAmp: 0.062,
    grain: 0.018,
  },
  page: {
    colors: ['#FAF7EF', '#E5D6B8', '#B89968'] as [string, string, string],
    mesh: 'opacity-45',
    overlay: 'bg-[radial-gradient(circle_at_50%_30%,rgba(255,252,245,0.64),rgba(247,241,230,0.72)_48%,rgba(247,241,230,0.9)_100%)]',
    scale: 1.36,
    speed: 0.18,
    waveAmp: 0.045,
    grain: 0.02,
  },
  story: {
    colors: ['#2A2520', '#9A7E4F', '#E8D8B8'] as [string, string, string],
    mesh: 'opacity-100',
    overlay: 'bg-[radial-gradient(circle_at_50%_18%,rgba(255,252,245,0.18),transparent_35%),linear-gradient(180deg,rgba(42,37,32,0.16),rgba(42,37,32,0.34))]',
    scale: 1.18,
    speed: 0.34,
    waveAmp: 0.065,
    grain: 0.038,
  },
} as const

const noiseStyle = {
  backgroundImage:
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 140 140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.55'/%3E%3C/svg%3E\")",
  backgroundSize: '180px 180px',
} as const

export function BrandGradientBackdrop({ className, intensity = 'page' }: BrandGradientBackdropProps) {
  const current = settings[intensity]

  return (
    <div aria-hidden="true" className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}>
      <GradientMesh
        className={cn('absolute inset-0 [&>canvas]:h-full [&>canvas]:w-full', current.mesh)}
        colors={current.colors}
        distortion={4}
        swirl={0.42}
        speed={current.speed}
        scale={current.scale}
        rotation={18}
        waveAmp={current.waveAmp}
        waveFreq={7}
        waveSpeed={0.18}
        grain={current.grain}
      />
      <div className={cn('absolute inset-0', current.overlay)} />
      <div className="absolute inset-0 opacity-[0.045] mix-blend-overlay" style={noiseStyle} />
    </div>
  )
}
