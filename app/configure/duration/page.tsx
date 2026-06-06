'use client'

import { CalendarRange, ChevronLeft, Clock12, Clock4, ClockArrowUp } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/Button'
import { Card } from '@/components/Card'
import { StepContainer } from '@/components/StepContainer'
import { useWizardState } from '@/hooks/useWizardState'
import { getPriceImpact } from '@/lib/price-impact'
import { buildWizardUrl } from '@/lib/wizard-url'

const ALL_OPTIONS = [
  { key: 'ceremony', title: 'Sadece Tören', description: '2-3 saat, ana anlar', icon: <Clock4 size={36} strokeWidth={1.5} />, contexts: ['wedding', 'engagement', 'family'] },
  { key: 'half', title: 'Yarım Gün', description: '5-6 saat, hazırlık + tören', icon: <ClockArrowUp size={36} strokeWidth={1.5} />, contexts: ['wedding', 'engagement'] },
  { key: 'full', title: 'Tam Gün', description: '10-12 saat, başından sonuna', icon: <Clock12 size={36} strokeWidth={1.5} />, contexts: ['wedding', 'engagement'] },
  { key: 'multi', title: 'Çok Günlü', description: 'Kına + düğün veya daha fazlası', icon: <CalendarRange size={36} strokeWidth={1.5} />, contexts: ['wedding'] },
] as const

export default function DurationPage() {
  const router = useRouter()
  const [state, setState] = useWizardState()
  const options = ALL_OPTIONS.filter((o) => !state.context || o.contexts.includes(state.context as never))

  async function handleSelect(key: string) {
    await setState({ duration: key })
    window.setTimeout(() => router.push(buildWizardUrl('/configure/team', { ...state, duration: key })), 320)
  }

  return (
    <StepContainer
      step={6}
      title={<><em className="font-accent italic text-gold-dark">Ne kadar</em> sizinleyiz?</>}
      subtitle="Süre, fiyat motorunun en güçlü değişkenidir."
      hasPriceBar
      footer={
        <Button variant="ghost" onClick={() => router.push(buildWizardUrl('/configure/location', state))}>
          <ChevronLeft size={16} />
          Geri
        </Button>
      }
    >
      <div className="mx-auto grid w-full max-w-[430px] grid-cols-1 gap-3 sm:max-w-5xl sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
        {options.map((opt) => (
          <Card
            key={opt.key}
            title={opt.title}
            description={opt.description}
            priceNote={getPriceImpact(state, { ...state, duration: opt.key })}
            icon={opt.icon}
            selected={state.duration === opt.key}
            onClick={() => handleSelect(opt.key)}
          />
        ))}
      </div>
    </StepContainer>
  )
}
