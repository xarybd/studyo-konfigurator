'use client'
import { useRouter } from 'next/navigation'
import { StepContainer } from '@/components/StepContainer'
import { Card } from '@/components/Card'
import { Button } from '@/components/Button'
import { useWizardState } from '@/hooks/useWizardState'
import { ChevronLeft, User, Users, UserCheck } from 'lucide-react'

const OPTIONS = [
  { key: 'solo', title: 'Tek Fotoğrafçı', description: 'Tek vizyon, samimi yaklaşım', icon: <User size={28} strokeWidth={1.5} /> },
  { key: 'duo', title: 'İki Fotoğrafçı', description: 'Aynı anda iki farklı bakış', icon: <Users size={28} strokeWidth={1.5} /> },
  { key: 'trio', title: 'İki + Asistan', description: 'Hiçbir an kaçmasın diye', icon: <UserCheck size={28} strokeWidth={1.5} /> },
] as const

export default function TeamPage() {
  const router = useRouter()
  const [state, setState] = useWizardState()

  async function handleSelect(key: string) {
    await setState({ team: key })
    setTimeout(() => router.push('/configure/delivery'), 300)
  }

  return (
    <StepContainer
      step={7}
      title={<>Kaç kişilik <em className="font-accent not-italic text-gold-dark italic">ekip?</em></>}
      hasPriceBar
      footer={
        <Button variant="ghost" onClick={() => router.push('/configure/duration')}>
          <ChevronLeft size={16} />
          Geri
        </Button>
      }
    >
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-2">
        {OPTIONS.map((opt) => (
          <Card
            key={opt.key}
            title={opt.title}
            description={opt.description}
            icon={opt.icon}
            selected={state.team === opt.key}
            onClick={() => handleSelect(opt.key)}
          />
        ))}
      </div>
    </StepContainer>
  )
}
