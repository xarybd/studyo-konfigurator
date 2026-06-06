'use client'

import { Camera, ChevronLeft, Film, Heart, Zap } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/Button'
import { Card } from '@/components/Card'
import { StepContainer } from '@/components/StepContainer'
import { useWizardState } from '@/hooks/useWizardState'
import { getPriceImpact } from '@/lib/price-impact'
import { buildWizardUrl } from '@/lib/wizard-url'

const OPTIONS = [
  { key: 'classic', title: 'Klasik & Romantik', description: 'Zamansız pozlar, sıcak ışık', icon: <Heart size={36} strokeWidth={1.5} /> },
  { key: 'modern', title: 'Modern & Editöryal', description: 'Mimari hatlar, dramatik kontrast', icon: <Zap size={36} strokeWidth={1.5} /> },
  { key: 'natural', title: 'Doğal & Belgesel', description: 'Pozsuz, akışkan, anı yakalayan', icon: <Camera size={36} strokeWidth={1.5} /> },
  { key: 'vintage', title: 'Vintage & Sinematik', description: 'Film dokusu, nostaljik palet', icon: <Film size={36} strokeWidth={1.5} /> },
] as const

export default function StylePage() {
  const router = useRouter()
  const [state, setState] = useWizardState()
  const prevStep = state.season === 'unknown' ? '/configure/season' : '/configure/date'

  async function handleSelect(key: string) {
    await setState({ style: key })
    window.setTimeout(() => router.push(buildWizardUrl('/configure/location', { ...state, style: key })), 320)
  }

  return (
    <StepContainer
      step={4}
      title={<><em className="font-accent italic text-gold-dark">Stiliniz</em> hangisi?</>}
      subtitle="Bu seçim, paketin estetik DNA'sını belirler."
      hasPriceBar
      footer={
        <Button variant="ghost" onClick={() => router.push(buildWizardUrl(prevStep, state))}>
          <ChevronLeft size={16} />
          Geri
        </Button>
      }
    >
      <div className="mx-auto grid w-full max-w-[430px] grid-cols-1 gap-3 sm:max-w-5xl sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
        {OPTIONS.map((opt) => (
          <Card
            key={opt.key}
            title={opt.title}
            description={opt.description}
            priceNote={getPriceImpact(state, { ...state, style: opt.key })}
            icon={opt.icon}
            selected={state.style === opt.key}
            onClick={() => handleSelect(opt.key)}
          />
        ))}
      </div>
    </StepContainer>
  )
}
