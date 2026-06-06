'use client'

import { Baby, Diamond, Sparkles } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/Card'
import { StepContainer } from '@/components/StepContainer'
import { useWizardState } from '@/hooks/useWizardState'
import { getPriceImpact } from '@/lib/price-impact'
import { buildWizardUrl } from '@/lib/wizard-url'

const OPTIONS = [
  {
    key: 'wedding',
    title: 'Düğün',
    description: 'En özel günün eksiksiz hikayesi',
    icon: <Sparkles size={36} strokeWidth={1.5} />,
  },
  {
    key: 'engagement',
    title: 'Nişan / Söz',
    description: 'Yolculuğun ilk büyük adımı',
    icon: <Diamond size={36} strokeWidth={1.5} />,
  },
  {
    key: 'family',
    title: 'Bebek & Aile',
    description: 'Büyüyen aile, kalan anılar',
    icon: <Baby size={36} strokeWidth={1.5} />,
  },
] as const

export default function ContextPage() {
  const router = useRouter()
  const [state, setState] = useWizardState()

  async function handleSelect(key: string) {
    await setState({ context: key })
    window.setTimeout(() => router.push(buildWizardUrl('/configure/season', { ...state, context: key })), 320)
  }

  return (
    <StepContainer
      step={1}
      title={<>Sizi <em className="font-accent italic text-gold-dark">buluşturalım</em></>}
      subtitle="Bağlam, ilerleyen tüm adımların tonunu ve kapsamını belirler."
    >
      <div className="mx-auto grid w-full max-w-[430px] grid-cols-1 gap-3 sm:max-w-4xl sm:grid-cols-3 sm:gap-5">
        {OPTIONS.map((opt) => (
          <Card
            key={opt.key}
            title={opt.title}
            description={opt.description}
            priceNote={getPriceImpact(state, { ...state, context: opt.key })}
            icon={opt.icon}
            selected={state.context === opt.key}
            onClick={() => handleSelect(opt.key)}
          />
        ))}
      </div>
    </StepContainer>
  )
}
