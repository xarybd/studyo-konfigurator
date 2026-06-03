'use client'
import { useRouter } from 'next/navigation'
import { StepContainer } from '@/components/StepContainer'
import { Card } from '@/components/Card'
import { Button } from '@/components/Button'
import { useWizardState } from '@/hooks/useWizardState'
import { Flower, Sun, Leaf, Snowflake, HelpCircle, ChevronLeft } from 'lucide-react'

const OPTIONS = [
  { key: 'spring', title: 'İlkbahar', description: 'Yumuşak ışık, çiçekli zemin', icon: <Flower size={36} strokeWidth={1.5} /> },
  { key: 'summer', title: 'Yaz', description: 'Altın saat, uzun günler', icon: <Sun size={36} strokeWidth={1.5} /> },
  { key: 'autumn', title: 'Sonbahar', description: 'Sıcak tonlar, doku', icon: <Leaf size={36} strokeWidth={1.5} /> },
  { key: 'winter', title: 'Kış', description: 'Berrak, dramatik, sade', icon: <Snowflake size={36} strokeWidth={1.5} /> },
  { key: 'unknown', title: 'Henüz net değil', description: 'Tarih oluşunca konuşalım', icon: <HelpCircle size={36} strokeWidth={1.5} /> },
] as const

export default function SeasonPage() {
  const router = useRouter()
  const [state, setState] = useWizardState()

  async function handleSelect(key: string) {
    await setState({ season: key })
    const next = key === 'unknown' ? '/configure/style' : '/configure/date'
    setTimeout(() => router.push(next), 350)
  }

  return (
    <StepContainer
      step={2}
      title={<>Hangi <em className="font-accent not-italic italic text-gold-dark">mevsimde?</em></>}
      footer={
        <Button variant="ghost" onClick={() => router.push('/configure/context')}>
          <ChevronLeft size={16} />
          Geri
        </Button>
      }
    >
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 max-w-[1000px] mx-auto">
        {OPTIONS.map((opt) => (
          <Card
            key={opt.key}
            title={opt.title}
            description={opt.description}
            icon={opt.icon}
            selected={state.season === opt.key}
            onClick={() => handleSelect(opt.key)}
          />
        ))}
      </div>
    </StepContainer>
  )
}
