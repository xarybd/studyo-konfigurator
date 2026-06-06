'use client'

import { BookHeart, ChevronLeft, ChevronRight, Film, Heart, Plane, Sparkle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/Button'
import { Card } from '@/components/Card'
import { StepContainer } from '@/components/StepContainer'
import { useWizardState } from '@/hooks/useWizardState'
import { getPriceImpact } from '@/lib/price-impact'
import { buildWizardUrl } from '@/lib/wizard-url'

const ALL_OPTIONS = [
  { key: 'drone', title: 'Drone Çekimi', description: 'Havadan etkileyici kareler', icon: <Plane size={36} strokeWidth={1.5} />, contexts: ['wedding', 'engagement'] },
  { key: 'fullVideo', title: 'Tam Edit Video', description: 'Highlight değil, komple film', icon: <Film size={36} strokeWidth={1.5} />, contexts: ['wedding', 'engagement', 'family'] },
  { key: 'photobook', title: 'Lüks Anı Kitabı', description: 'Misafir defteri + fotoğraflar', icon: <BookHeart size={36} strokeWidth={1.5} />, contexts: ['wedding', 'engagement', 'family'] },
  { key: 'engagement', title: 'Engagement Çekimi', description: 'Save-the-date için ön seans', icon: <Heart size={36} strokeWidth={1.5} />, contexts: ['wedding'] },
  { key: 'preparation', title: 'Hazırlık Çekimi', description: 'Gelin/damat hazırlık anları', icon: <Sparkle size={36} strokeWidth={1.5} />, contexts: ['wedding', 'engagement'] },
] as const

export default function ExtrasPage() {
  const router = useRouter()
  const [state, setState] = useWizardState()
  const options = ALL_OPTIONS.filter((o) => !state.context || o.contexts.includes(state.context as never))
  const currentExtras = (state.extras ?? []) as string[]

  function toggleExtra(key: string) {
    const next = currentExtras.includes(key)
      ? currentExtras.filter((extra) => extra !== key)
      : [...currentExtras, key]
    setState({ extras: next })
  }

  function getNextExtras(key: string) {
    if (currentExtras.includes(key)) return currentExtras.filter((extra) => extra !== key)
    return [...currentExtras, key]
  }

  return (
    <StepContainer
      step={9}
      title={<>Bir <em className="font-accent italic text-gold-dark">dokunuş</em> daha?</>}
      subtitle="Birden fazla seçebilirsiniz. Son adımda teklif aralığını birlikte göreceğiz."
      hasPriceBar
      footer={
        <div className="flex w-full flex-col items-stretch justify-between gap-4 sm:flex-row sm:items-center">
          <Button variant="ghost" onClick={() => router.push(buildWizardUrl('/configure/delivery', state))}>
            <ChevronLeft size={16} />
            Geri
          </Button>
          <Button variant="primary" onClick={() => router.push(buildWizardUrl('/configure/result', state))}>
            Devam
            <ChevronRight size={16} />
          </Button>
        </div>
      }
    >
      <div className="mx-auto grid w-full max-w-[390px] grid-cols-1 gap-3 sm:max-w-5xl sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
        {options.map((opt) => (
          <Card
            key={opt.key}
            title={opt.title}
            description={opt.description}
            priceNote={getPriceImpact(state, { ...state, extras: getNextExtras(opt.key) as never })}
            icon={opt.icon}
            selected={currentExtras.includes(opt.key)}
            onClick={() => toggleExtra(opt.key)}
          />
        ))}
      </div>
    </StepContainer>
  )
}
