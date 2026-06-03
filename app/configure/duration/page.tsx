'use client'
import { useRouter } from 'next/navigation'
import { StepContainer } from '@/components/StepContainer'
import { Card } from '@/components/Card'
import { Button } from '@/components/Button'
import { useWizardState } from '@/hooks/useWizardState'
import { ChevronLeft } from 'lucide-react'

const ALL_OPTIONS = [
  { key: 'ceremony', title: 'Sadece Tören', description: '2–3 saat, sadece anlar', contexts: ['wedding', 'engagement', 'family'] },
  { key: 'half', title: 'Yarım Gün', description: '5–6 saat, hazırlık + tören', contexts: ['wedding', 'engagement'] },
  { key: 'full', title: 'Tam Gün', description: '10–12 saat, başından sonuna', contexts: ['wedding', 'engagement'] },
  { key: 'multi', title: 'Çok Günlü', description: 'Kına + düğün, ya da fazlası', contexts: ['wedding'] },
] as const

export default function DurationPage() {
  const router = useRouter()
  const [state, setState] = useWizardState()

  const options = ALL_OPTIONS.filter(
    (o) => !state.context || o.contexts.includes(state.context as never),
  )

  async function handleSelect(key: string) {
    await setState({ duration: key })
    setTimeout(() => router.push('/configure/team'), 300)
  }

  return (
    <StepContainer
      step={6}
      title={<>Ne <em className="font-accent not-italic text-gold-dark italic">kadar</em> sizinleyiz?</>}
      subtitle="Süre, fiyat motorunun en güçlü değişkeni."
      hasPriceBar
      footer={
        <Button variant="ghost" onClick={() => router.push('/configure/location')}>
          <ChevronLeft size={16} />
          Geri
        </Button>
      }
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-2">
        {options.map((opt) => (
          <Card
            key={opt.key}
            title={opt.title}
            description={opt.description}
            selected={state.duration === opt.key}
            onClick={() => handleSelect(opt.key)}
          />
        ))}
      </div>
    </StepContainer>
  )
}
