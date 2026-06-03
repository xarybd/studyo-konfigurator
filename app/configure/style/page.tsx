'use client'
import { useRouter } from 'next/navigation'
import { StepContainer } from '@/components/StepContainer'
import { Card } from '@/components/Card'
import { Button } from '@/components/Button'
import { useWizardState } from '@/hooks/useWizardState'
import { ChevronLeft } from 'lucide-react'

const OPTIONS = [
  { key: 'classic', title: 'Klasik & Romantik', description: 'Zamansız pozlar, sıcak ışık' },
  { key: 'modern', title: 'Modern & Editöryal', description: 'Mimari hatlar, dramatik kontrast' },
  { key: 'natural', title: 'Doğal & Belgesel', description: 'Pozsuz, akışkan, anı yakalayan' },
  { key: 'vintage', title: 'Vintage & Sinematik', description: 'Film grain, nostaljik palet' },
] as const

export default function StylePage() {
  const router = useRouter()
  const [state, setState] = useWizardState()

  async function handleSelect(key: string) {
    await setState({ style: key })
    setTimeout(() => router.push('/configure/location'), 300)
  }

  const prevStep = state.season === 'unknown' ? '/configure/season' : '/configure/date'

  return (
    <StepContainer
      step={4}
      title={<><em className="font-accent not-italic text-gold-dark italic">Stiliniz</em> hangisi?</>}
      subtitle="Bu adım, paketin estetik DNA'sıdır."
      hasPriceBar
      footer={
        <Button variant="ghost" onClick={() => router.push(prevStep)}>
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
            selected={state.style === opt.key}
            onClick={() => handleSelect(opt.key)}
          />
        ))}
      </div>
    </StepContainer>
  )
}
