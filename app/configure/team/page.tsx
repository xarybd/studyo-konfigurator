'use client'

import { ChevronLeft, User, UserPlus, Users } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/Button'
import { Card } from '@/components/Card'
import { StepContainer } from '@/components/StepContainer'
import { useWizardState } from '@/hooks/useWizardState'
import { getPriceImpact } from '@/lib/price-impact'
import { buildWizardUrl } from '@/lib/wizard-url'

const OPTIONS = [
  { key: 'solo', title: 'Tek Fotoğrafçı', description: 'Tek vizyon, samimi yaklaşım', icon: <User size={36} strokeWidth={1.5} /> },
  { key: 'duo', title: 'İki Fotoğrafçı', description: 'Aynı anda iki farklı bakış', icon: <Users size={36} strokeWidth={1.5} /> },
  { key: 'trio', title: 'İki + Asistan', description: 'Hiçbir an kaçmasın diye', icon: <UserPlus size={36} strokeWidth={1.5} /> },
] as const

export default function TeamPage() {
  const router = useRouter()
  const [state, setState] = useWizardState()

  async function handleSelect(key: string) {
    await setState({ team: key })
    window.setTimeout(() => router.push(buildWizardUrl('/configure/delivery', { ...state, team: key })), 320)
  }

  return (
    <StepContainer
      step={7}
      title={<>Kaç kişilik <em className="font-accent italic text-gold-dark">ekip?</em></>}
      subtitle="Ekip büyüklüğü, yakalanan açı ve an sayısını belirler."
      hasPriceBar
      footer={
        <Button variant="ghost" onClick={() => router.push(buildWizardUrl('/configure/duration', state))}>
          <ChevronLeft size={16} />
          Geri
        </Button>
      }
    >
      <div className="mx-auto grid w-full max-w-[430px] grid-cols-1 gap-3 sm:max-w-4xl sm:grid-cols-3 sm:gap-5">
        {OPTIONS.map((opt) => (
          <Card
            key={opt.key}
            title={opt.title}
            description={opt.description}
            priceNote={getPriceImpact(state, { ...state, team: opt.key })}
            icon={opt.icon}
            selected={state.team === opt.key}
            onClick={() => handleSelect(opt.key)}
          />
        ))}
      </div>
    </StepContainer>
  )
}
