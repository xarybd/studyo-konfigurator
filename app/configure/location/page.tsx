'use client'
import { useRouter } from 'next/navigation'
import { StepContainer } from '@/components/StepContainer'
import { Card } from '@/components/Card'
import { Button } from '@/components/Button'
import { useWizardState } from '@/hooks/useWizardState'
import { ChevronLeft, Building, ImageIcon, Trees, Landmark, Layers } from 'lucide-react'

const ALL_OPTIONS = [
  { key: 'studio', title: 'Stüdyo', description: 'Kontrollü ışık, sade arka plan', icon: <Building size={36} strokeWidth={1.5} />, contexts: ['wedding', 'engagement', 'family'] },
  { key: 'plato', title: 'Plato', description: 'Stüdyonun özel dekor platosu', icon: <ImageIcon size={36} strokeWidth={1.5} />, contexts: ['wedding', 'engagement', 'family'] },
  { key: 'outdoor', title: 'Dış Mekan', description: 'Doğa, gün ışığı, açık alan', icon: <Trees size={36} strokeWidth={1.5} />, contexts: ['wedding', 'engagement', 'family'] },
  { key: 'venue', title: 'Venue / Mekan', description: 'Etkinlik salonu, otel, tarihi mekan', icon: <Landmark size={36} strokeWidth={1.5} />, contexts: ['wedding', 'engagement'] },
  { key: 'mixed', title: 'Karma', description: 'Birden fazla lokasyon', icon: <Layers size={36} strokeWidth={1.5} />, contexts: ['wedding', 'engagement'] },
] as const

export default function LocationPage() {
  const router = useRouter()
  const [state, setState] = useWizardState()

  const options = ALL_OPTIONS.filter(
    (o) => !state.context || o.contexts.includes(state.context as never),
  )

  async function handleSelect(key: string) {
    await setState({ location: key })
    setTimeout(() => router.push('/configure/duration'), 350)
  }

  return (
    <StepContainer
      step={5}
      title={<>Nerede <em className="font-accent not-italic italic text-gold-dark">buluşalım?</em></>}
      hasPriceBar
      footer={
        <Button variant="ghost" onClick={() => router.push('/configure/style')}>
          <ChevronLeft size={16} />
          Geri
        </Button>
      }
    >
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 max-w-[1000px] mx-auto">
        {options.map((opt) => (
          <Card
            key={opt.key}
            title={opt.title}
            description={opt.description}
            icon={opt.icon}
            selected={state.location === opt.key}
            onClick={() => handleSelect(opt.key)}
          />
        ))}
      </div>
    </StepContainer>
  )
}
