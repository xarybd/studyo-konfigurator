'use client'
import { useRouter } from 'next/navigation'
import { StepContainer } from '@/components/StepContainer'
import { Card } from '@/components/Card'
import { useWizardState } from '@/hooks/useWizardState'
import { Sparkles, Diamond, Baby } from 'lucide-react'

const OPTIONS = [
  {
    key: 'wedding',
    title: 'Düğün',
    description: 'En özel günün eksiksiz hikâyesi',
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
    setTimeout(() => router.push('/configure/season'), 350)
  }

  return (
    <StepContainer
      step={1}
      title={<>Sizi <em className="font-accent not-italic italic text-gold-dark">buluşturalım</em></>}
      subtitle="Bağlam, ilerleyen tüm adımları şekillendirir."
    >
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-[900px] mx-auto">
        {OPTIONS.map((opt) => (
          <Card
            key={opt.key}
            title={opt.title}
            description={opt.description}
            icon={opt.icon}
            selected={state.context === opt.key}
            onClick={() => handleSelect(opt.key)}
          />
        ))}
      </div>
    </StepContainer>
  )
}
