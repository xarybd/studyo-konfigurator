'use client'

import { Building, ChevronLeft, ImageIcon, Landmark, Layers, Trees } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/Button'
import { Card } from '@/components/Card'
import { StepContainer } from '@/components/StepContainer'
import { useWizardState } from '@/hooks/useWizardState'
import { buildWizardUrl } from '@/lib/wizard-url'

const ALL_OPTIONS = [
  { key: 'studio', title: 'Stüdyo', description: 'Kontrollü ışık, sade arka plan', icon: <Building size={36} strokeWidth={1.5} />, contexts: ['wedding', 'engagement', 'family'] },
  { key: 'plato', title: 'Plato', description: 'Özel dekor ve konsept alanı', icon: <ImageIcon size={36} strokeWidth={1.5} />, contexts: ['wedding', 'engagement', 'family'] },
  { key: 'outdoor', title: 'Dış Mekan', description: 'Doğa, gün ışığı, açık alan', icon: <Trees size={36} strokeWidth={1.5} />, contexts: ['wedding', 'engagement', 'family'] },
  { key: 'venue', title: 'Venue / Mekan', description: 'Otel, salon veya tarihi mekan', icon: <Landmark size={36} strokeWidth={1.5} />, contexts: ['wedding', 'engagement'] },
  { key: 'mixed', title: 'Karma', description: 'Birden fazla lokasyon', icon: <Layers size={36} strokeWidth={1.5} />, contexts: ['wedding', 'engagement'] },
] as const

export default function LocationPage() {
  const router = useRouter()
  const [state, setState] = useWizardState()
  const options = ALL_OPTIONS.filter((o) => !state.context || o.contexts.includes(state.context as never))

  async function handleSelect(key: string) {
    await setState({ location: key })
    window.setTimeout(() => router.push(buildWizardUrl('/configure/duration', { ...state, location: key })), 320)
  }

  return (
    <StepContainer
      step={5}
      title={<>Nerede <em className="font-accent italic text-gold-dark">buluşalım?</em></>}
      subtitle="Mekan, ışık planını ve ekip akışını doğrudan etkiler."
      hasPriceBar
      footer={
        <Button variant="ghost" onClick={() => router.push(buildWizardUrl('/configure/style', state))}>
          <ChevronLeft size={16} />
          Geri
        </Button>
      }
    >
      <div className="mx-auto grid w-full max-w-[390px] grid-cols-1 gap-3 sm:max-w-5xl sm:grid-cols-2 sm:gap-4 lg:grid-cols-5">
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
