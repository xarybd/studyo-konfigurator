'use client'

import { BookOpen, ChevronLeft, Package, Smartphone, Video } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/Button'
import { Card } from '@/components/Card'
import { StepContainer } from '@/components/StepContainer'
import { useWizardState } from '@/hooks/useWizardState'
import { getPriceImpact } from '@/lib/price-impact'
import { buildWizardUrl } from '@/lib/wizard-url'

const OPTIONS = [
  { key: 'digital', title: 'Dijital', description: 'Tüm fotoğraflar online galeri', icon: <Smartphone size={36} strokeWidth={1.5} /> },
  { key: 'album', title: 'Dijital + Albüm', description: 'Tutulabilir, baskılı bir hatıra', icon: <BookOpen size={36} strokeWidth={1.5} /> },
  { key: 'video', title: 'Dijital + Video', description: 'Sinematik highlight filmi', icon: <Video size={36} strokeWidth={1.5} /> },
  { key: 'complete', title: 'Komple Paket', description: 'Albüm, video ve dijital galeri', icon: <Package size={36} strokeWidth={1.5} /> },
] as const

export default function DeliveryPage() {
  const router = useRouter()
  const [state, setState] = useWizardState()

  async function handleSelect(key: string) {
    await setState({ delivery: key })
    window.setTimeout(() => router.push(buildWizardUrl('/configure/extras', { ...state, delivery: key })), 320)
  }

  return (
    <StepContainer
      step={8}
      title={<>Nasıl <em className="font-accent italic text-gold-dark">teslim alalım?</em></>}
      subtitle="Teslimat, paketin algılanan değerini iki katına çıkarır."
      hasPriceBar
      footer={
        <Button variant="ghost" onClick={() => router.push(buildWizardUrl('/configure/team', state))}>
          <ChevronLeft size={16} />
          Geri
        </Button>
      }
    >
      <div className="mx-auto grid w-full max-w-[390px] grid-cols-1 gap-3 sm:max-w-5xl sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
        {OPTIONS.map((opt) => (
          <Card
            key={opt.key}
            title={opt.title}
            description={opt.description}
            priceNote={getPriceImpact(state, { ...state, delivery: opt.key })}
            icon={opt.icon}
            selected={state.delivery === opt.key}
            onClick={() => handleSelect(opt.key)}
          />
        ))}
      </div>
    </StepContainer>
  )
}
