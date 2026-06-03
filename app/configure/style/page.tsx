'use client'
import { useRouter } from 'next/navigation'
import { StepContainer } from '@/components/StepContainer'
import { Card } from '@/components/Card'
import { Button } from '@/components/Button'
import { useWizardState } from '@/hooks/useWizardState'
import { ChevronLeft } from 'lucide-react'
import { cn } from '@/lib/utils'

const NOISE_URI = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4'/%3E%3C/filter%3E%3Crect width='120' height='120' filter='url(%23n)'/%3E%3C/svg%3E\")"

type StyleKey = 'classic' | 'modern' | 'natural' | 'vintage'

const MOODS: Record<StyleKey, { gradient: string; lines: string; label: string; labelClass: string }> = {
  classic: {
    gradient: 'linear-gradient(145deg, #F0E6D3 0%, #E2CEB0 55%, #CEAF88 100%)',
    lines: 'rgba(184,153,104,0.18)',
    label: 'ETERNAL',
    labelClass: 'text-[#8A7060]/70 border-[#B89968]/25',
  },
  modern: {
    gradient: 'linear-gradient(145deg, #2A2520 0%, #3D342C 55%, #1C1510 100%)',
    lines: 'rgba(255,252,245,0.12)',
    label: 'EDITORIAL',
    labelClass: 'text-[#F7F1E6]/55 border-[#F7F1E6]/20',
  },
  natural: {
    gradient: 'linear-gradient(145deg, #E8EDE0 0%, #D0DAC5 55%, #B8CAA8 100%)',
    lines: 'rgba(100,130,80,0.16)',
    label: 'UNPOSED',
    labelClass: 'text-[#5A7050]/65 border-[#6A8060]/22',
  },
  vintage: {
    gradient: 'linear-gradient(145deg, #D8BC98 0%, #C8A878 55%, #B89260 100%)',
    lines: 'rgba(42,37,32,0.13)',
    label: 'CELLULOID',
    labelClass: 'text-[#6A5030]/65 border-[#6A5030]/22',
  },
}

function StyleVisual({ styleKey }: { styleKey: StyleKey }) {
  const m = MOODS[styleKey]
  return (
    <div
      className="w-full h-[148px] relative overflow-hidden flex items-end justify-end"
      style={{ background: m.gradient }}
    >
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `repeating-linear-gradient(47deg, ${m.lines} 0px, ${m.lines} 0.5px, transparent 0.5px, transparent 22px)`,
        }}
      />
      <div
        className="absolute inset-0 opacity-25 mix-blend-overlay"
        style={{ backgroundImage: NOISE_URI }}
      />
      <span className={cn(
        'relative font-body text-[9px] tracking-[0.28em] uppercase m-3 px-2 py-[5px] rounded-sm border',
        m.labelClass,
      )}>
        {m.label}
      </span>
    </div>
  )
}

const OPTIONS = [
  { key: 'classic' as StyleKey, title: 'Klasik & Romantik', description: 'Zamansız pozlar, sıcak ışık' },
  { key: 'modern' as StyleKey, title: 'Modern & Editöryal', description: 'Mimari hatlar, dramatik kontrast' },
  { key: 'natural' as StyleKey, title: 'Doğal & Belgesel', description: 'Pozsuz, akışkan, anı yakalayan' },
  { key: 'vintage' as StyleKey, title: 'Vintage & Sinematik', description: 'Film grain, nostaljik palet' },
] as const

export default function StylePage() {
  const router = useRouter()
  const [state, setState] = useWizardState()

  async function handleSelect(key: string) {
    await setState({ style: key })
    setTimeout(() => router.push('/configure/location'), 300)
  }

  const prevStep = state.season === 'unknown' ? '/configure/season' : '/configure/date'

  return (
    <StepContainer
      step={4}
      title={<><em className="font-accent not-italic text-gold-dark italic">Stiliniz</em> hangisi?</>}
      subtitle="Bu adım, paketin estetik DNA'sıdır."
      hasPriceBar
      footer={
        <Button variant="ghost" onClick={() => router.push(prevStep)}>
          <ChevronLeft size={16} />
          Geri
        </Button>
      }
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-[1000px]">
        {OPTIONS.map((opt) => (
          <Card
            key={opt.key}
            title={opt.title}
            description={opt.description}
            visual={<StyleVisual styleKey={opt.key} />}
            selected={state.style === opt.key}
            onClick={() => handleSelect(opt.key)}
          />
        ))}
      </div>
    </StepContainer>
  )
}
