'use client'

import { ChevronLeft, Flower, HelpCircle, Leaf, Snowflake, Sun } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/Button'
import { Card } from '@/components/Card'
import { StepContainer } from '@/components/StepContainer'
import { useWizardState } from '@/hooks/useWizardState'
import { buildWizardUrl } from '@/lib/wizard-url'

const OPTIONS = [
  { key: 'spring', title: 'İlkbahar', description: 'Yumuşak ışık, çiçekli zemin', icon: <Flower size={36} strokeWidth={1.5} /> },
  { key: 'summer', title: 'Yaz', description: 'Altın saat, uzun günler', icon: <Sun size={36} strokeWidth={1.5} /> },
  { key: 'autumn', title: 'Sonbahar', description: 'Sıcak tonlar ve güçlü doku', icon: <Leaf size={36} strokeWidth={1.5} /> },
  { key: 'winter', title: 'Kış', description: 'Berrak, dramatik ve sade', icon: <Snowflake size={36} strokeWidth={1.5} /> },
  { key: 'unknown', title: 'Henüz net değil', description: 'Tarih oluşunca birlikte netleştiririz', icon: <HelpCircle size={36} strokeWidth={1.5} /> },
] as const

export default function SeasonPage() {
  const router = useRouter()
  const [state, setState] = useWizardState()

  async function handleSelect(key: string) {
    await setState({ season: key })
    const next = key === 'unknown' ? '/configure/style' : '/configure/date'
    window.setTimeout(() => router.push(buildWizardUrl(next, { ...state, season: key })), 320)
  }

  return (
    <StepContainer
      step={2}
      title={<>Hangi <em className="font-accent italic text-gold-dark">mevsimde?</em></>}
      subtitle="Işık, renk paleti ve mekan seçimi mevsime göre daha doğru çalışır."
      footer={
        <Button variant="ghost" onClick={() => router.push(buildWizardUrl('/configure/context', state))}>
          <ChevronLeft size={16} />
          Geri
        </Button>
      }
    >
      <div className="mx-auto grid w-full max-w-[430px] grid-cols-1 gap-3 sm:max-w-5xl sm:grid-cols-2 sm:gap-4 lg:grid-cols-5">
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
