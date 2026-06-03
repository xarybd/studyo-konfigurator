'use client'
import { useRouter } from 'next/navigation'
import { StepContainer } from '@/components/StepContainer'
import { Card } from '@/components/Card'
import { Button } from '@/components/Button'
import { useWizardState } from '@/hooks/useWizardState'
import { ChevronLeft, Building2, Frame, TreePine, MapPin, Layers } from 'lucide-react'

const ALL_OPTIONS = [
  { key: 'studio', title: 'Stüdyo', description: 'Kontrollü ışık, sade arka plan', icon: <Building2 size={24} strokeWidth={1.5} />, contexts: ['wedding', 'engagement', 'family'] },
  { key: 'plato', title: 'Plato', description: 'Stüdyonun özel dekor platosu', icon: <Frame size={24} strokeWidth={1.5} />, contexts: ['wedding', 'engagement', 'family'] },
  { key: 'outdoor', title: 'Dış Mekan', description: 'Doğa, gün ışığı, açık alan', icon: <TreePine size={24} strokeWidth={1.5} />, contexts: ['wedding', 'engagement', 'family'] },
  { key: 'venue', title: 'Venue / Mekan', description: 'Etkinlik salonu, otel, tarihi mekan', icon: <MapPin size={24} strokeWidth={1.5} />, contexts: ['wedding', 'engagement'] },
  { key: 'mixed', title: 'Karma', description: 'Birden fazla lokasyon', icon: <Layers size={24} strokeWidth={1.5} />, contexts: ['wedding', 'engagement'] },
] as const

export default function LocationPage() {
  const router = useRouter()
  const [state, setState] = useWizardState()

  const options = ALL_OPTIONS.filter(
    (o) => !state.context || o.contexts.includes(state.context as never),
  )

  async function handleSelect(key: string) {
    await setState({ location: key })
    setTimeout(() => router.push('/configure/duration'), 300)
  }

  return (
    <StepContainer
      step={5}
      title={<>Nerede <em className="font-accent not-italic text-gold-dark italic">buluşalım?</em></>}
      hasPriceBar
      footer={
        <Button variant="ghost" onClick={() => router.push('/configure/style')}>
          <ChevronLeft size={16} />
          Geri
        </Button>
      }
    >
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mt-2">
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
