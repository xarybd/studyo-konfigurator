'use client'
import { useRouter } from 'next/navigation'
import { StepContainer } from '@/components/StepContainer'
import { Card } from '@/components/Card'
import { Button } from '@/components/Button'
import { useWizardState } from '@/hooks/useWizardState'
import { ChevronLeft, Image, BookOpen, Film, Package } from 'lucide-react'

const OPTIONS = [
  { key: 'digital', title: 'Dijital', description: 'Tüm fotoğraflar online galeri', icon: <Image size={28} strokeWidth={1.5} /> },
  { key: 'album', title: 'Dijital + Albüm', description: 'Tutulabilir, baskılı bir hatıra', icon: <BookOpen size={28} strokeWidth={1.5} /> },
  { key: 'video', title: 'Dijital + Video', description: 'Sinematik highlight filmi', icon: <Film size={28} strokeWidth={1.5} /> },
  { key: 'complete', title: 'Komple Paket', description: 'Hepsi bir arada', icon: <Package size={28} strokeWidth={1.5} /> },
] as const

export default function DeliveryPage() {
  const router = useRouter()
  const [state, setState] = useWizardState()

  async function handleSelect(key: string) {
    await setState({ delivery: key })
    setTimeout(() => router.push('/configure/extras'), 300)
  }

  return (
    <StepContainer
      step={8}
      title={<>Sizi nasıl <em className="font-accent not-italic text-gold-dark italic">teslim edelim?</em></>}
      subtitle="Teslimat, paketin algılanan değerini iki katına çıkarır."
      hasPriceBar
      footer={
        <Button variant="ghost" onClick={() => router.push('/configure/team')}>
          <ChevronLeft size={16} />
          Geri
        </Button>
      }
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-2">
        {OPTIONS.map((opt) => (
          <Card
            key={opt.key}
            title={opt.title}
            description={opt.description}
            icon={opt.icon}
            selected={state.delivery === opt.key}
            onClick={() => handleSelect(opt.key)}
          />
        ))}
      </div>
    </StepContainer>
  )
}
