'use client'
import { useRouter } from 'next/navigation'
import { StepContainer } from '@/components/StepContainer'
import { Card } from '@/components/Card'
import { Button } from '@/components/Button'
import { useWizardState } from '@/hooks/useWizardState'
import { ChevronLeft, ChevronRight, Plane, Film, BookHeart, Heart, Sparkle } from 'lucide-react'

const ALL_OPTIONS = [
  { key: 'drone', title: 'Drone Çekimi', description: 'Havadan kareler', icon: <Plane size={36} strokeWidth={1.5} />, contexts: ['wedding', 'engagement'] },
  { key: 'fullVideo', title: 'Tam Edit Video', description: 'Highlight değil, komple film', icon: <Film size={36} strokeWidth={1.5} />, contexts: ['wedding', 'engagement', 'family'] },
  { key: 'photobook', title: 'Lüks Anı Kitabı', description: 'Misafir defteri + fotoğraflar', icon: <BookHeart size={36} strokeWidth={1.5} />, contexts: ['wedding', 'engagement', 'family'] },
  { key: 'engagement', title: 'Engagement Çekimi', description: 'Save-the-date için ön seans', icon: <Heart size={36} strokeWidth={1.5} />, contexts: ['wedding'] },
  { key: 'preparation', title: 'Hazırlık Çekimi', description: 'Gelin/damat hazırlık anları', icon: <Sparkle size={36} strokeWidth={1.5} />, contexts: ['wedding', 'engagement'] },
] as const

export default function ExtrasPage() {
  const router = useRouter()
  const [state, setState] = useWizardState()

  const options = ALL_OPTIONS.filter(
    (o) => !state.context || o.contexts.includes(state.context as never),
  )

  const currentExtras = (state.extras ?? []) as string[]

  function toggleExtra(key: string) {
    const next = currentExtras.includes(key)
      ? currentExtras.filter((e) => e !== key)
      : [...currentExtras, key]
    setState({ extras: next })
  }

  return (
    <StepContainer
      step={9}
      title={<>Bir <em className="font-accent not-italic italic text-gold-dark">dokunuş</em> daha?</>}
      subtitle="Birden fazla seçebilirsiniz."
      hasPriceBar
      footer={
        <div className="flex items-center justify-between gap-6">
          <Button variant="ghost" onClick={() => router.push('/configure/delivery')}>
            <ChevronLeft size={16} />
            Geri
          </Button>
          <Button variant="primary" onClick={() => router.push('/configure/result')}>
            Devam
            <ChevronRight size={16} />
          </Button>
        </div>
      }
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-[900px] mx-auto">
        {options.map((opt) => (
          <Card
            key={opt.key}
            title={opt.title}
            description={opt.description}
            icon={opt.icon}
            selected={currentExtras.includes(opt.key)}
            onClick={() => toggleExtra(opt.key)}
          />
        ))}
      </div>
    </StepContainer>
  )
}
