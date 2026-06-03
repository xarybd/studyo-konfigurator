'use client'
import { useRouter } from 'next/navigation'
import { StepContainer } from '@/components/StepContainer'
import { Card } from '@/components/Card'
import { useWizardState } from '@/hooks/useWizardState'

function WeddingVisual() {
  return (
    <svg viewBox="0 0 200 148" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-[148px]">
      <rect width="200" height="148" fill="rgba(247,241,230,0.3)" />
      <path d="M56 140 L56 82 Q56 44 100 36 Q144 44 144 82 L144 140" stroke="rgba(184,153,104,0.55)" strokeWidth="1.2" fill="none" />
      <path d="M72 140 L72 86 Q72 58 100 52 Q128 58 128 86 L128 140" stroke="rgba(217,195,154,0.45)" strokeWidth="0.9" fill="none" />
      <line x1="100" y1="4" x2="100" y2="30" stroke="rgba(184,153,104,0.5)" strokeWidth="1" />
      <line x1="87" y1="7" x2="93" y2="28" stroke="rgba(184,153,104,0.35)" strokeWidth="0.7" />
      <line x1="113" y1="7" x2="107" y2="28" stroke="rgba(184,153,104,0.35)" strokeWidth="0.7" />
      <line x1="74" y1="13" x2="83" y2="32" stroke="rgba(217,195,154,0.28)" strokeWidth="0.6" />
      <line x1="126" y1="13" x2="117" y2="32" stroke="rgba(217,195,154,0.28)" strokeWidth="0.6" />
      <line x1="100" y1="140" x2="100" y2="80" stroke="rgba(217,195,154,0.35)" strokeWidth="0.8" strokeDasharray="3 5" />
      <circle cx="60" cy="96" r="4.5" fill="rgba(217,195,154,0.22)" stroke="rgba(184,153,104,0.35)" strokeWidth="0.7" />
      <circle cx="140" cy="96" r="4.5" fill="rgba(217,195,154,0.22)" stroke="rgba(184,153,104,0.35)" strokeWidth="0.7" />
      <circle cx="57" cy="107" r="3" fill="rgba(217,195,154,0.18)" stroke="rgba(184,153,104,0.28)" strokeWidth="0.6" />
      <circle cx="143" cy="107" r="3" fill="rgba(217,195,154,0.18)" stroke="rgba(184,153,104,0.28)" strokeWidth="0.6" />
      <circle cx="55" cy="116" r="2" fill="rgba(217,195,154,0.15)" stroke="rgba(184,153,104,0.22)" strokeWidth="0.5" />
      <circle cx="145" cy="116" r="2" fill="rgba(217,195,154,0.15)" stroke="rgba(184,153,104,0.22)" strokeWidth="0.5" />
    </svg>
  )
}

function EngagementVisual() {
  return (
    <svg viewBox="0 0 200 148" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-[148px]">
      <rect width="200" height="148" fill="rgba(247,241,230,0.3)" />
      <ellipse cx="100" cy="110" rx="34" ry="11" stroke="rgba(184,153,104,0.5)" strokeWidth="1.2" fill="none" />
      <line x1="66" y1="110" x2="66" y2="88" stroke="rgba(184,153,104,0.42)" strokeWidth="1.2" />
      <line x1="134" y1="110" x2="134" y2="88" stroke="rgba(184,153,104,0.42)" strokeWidth="1.2" />
      <ellipse cx="100" cy="88" rx="34" ry="11" stroke="rgba(184,153,104,0.5)" strokeWidth="1.2" fill="none" />
      <polygon points="100,36 120,64 100,76 80,64" stroke="rgba(184,153,104,0.62)" strokeWidth="1.1" fill="rgba(217,195,154,0.12)" />
      <line x1="100" y1="36" x2="100" y2="56" stroke="rgba(217,195,154,0.45)" strokeWidth="0.7" />
      <line x1="100" y1="36" x2="116" y2="58" stroke="rgba(217,195,154,0.35)" strokeWidth="0.5" />
      <line x1="100" y1="36" x2="84" y2="58" stroke="rgba(217,195,154,0.35)" strokeWidth="0.5" />
      <line x1="134" y1="28" x2="134" y2="20" stroke="rgba(184,153,104,0.52)" strokeWidth="1" />
      <line x1="130" y1="24" x2="138" y2="24" stroke="rgba(184,153,104,0.52)" strokeWidth="1" />
      <line x1="63" y1="44" x2="63" y2="38" stroke="rgba(217,195,154,0.5)" strokeWidth="0.8" />
      <line x1="60" y1="41" x2="66" y2="41" stroke="rgba(217,195,154,0.5)" strokeWidth="0.8" />
      <line x1="155" y1="66" x2="155" y2="62" stroke="rgba(184,153,104,0.4)" strokeWidth="0.7" />
      <line x1="153" y1="64" x2="157" y2="64" stroke="rgba(184,153,104,0.4)" strokeWidth="0.7" />
      <circle cx="48" cy="88" r="2" fill="rgba(217,195,154,0.3)" />
      <circle cx="170" cy="40" r="1.5" fill="rgba(184,153,104,0.28)" />
    </svg>
  )
}

function FamilyVisual() {
  return (
    <svg viewBox="0 0 200 148" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-[148px]">
      <rect width="200" height="148" fill="rgba(247,241,230,0.3)" />
      <circle cx="100" cy="82" r="40" fill="rgba(217,195,154,0.1)" stroke="rgba(184,153,104,0.25)" strokeWidth="0.9" />
      <circle cx="76" cy="74" r="22" fill="rgba(217,195,154,0.1)" stroke="rgba(184,153,104,0.22)" strokeWidth="0.8" />
      <circle cx="124" cy="74" r="22" fill="rgba(217,195,154,0.1)" stroke="rgba(184,153,104,0.22)" strokeWidth="0.8" />
      <circle cx="100" cy="96" r="15" fill="rgba(217,195,154,0.14)" stroke="rgba(184,153,104,0.32)" strokeWidth="0.9" />
      <line x1="50" y1="32" x2="50" y2="24" stroke="rgba(184,153,104,0.48)" strokeWidth="0.9" />
      <line x1="46" y1="28" x2="54" y2="28" stroke="rgba(184,153,104,0.48)" strokeWidth="0.9" />
      <line x1="152" y1="38" x2="152" y2="32" stroke="rgba(217,195,154,0.52)" strokeWidth="0.8" />
      <line x1="149" y1="35" x2="155" y2="35" stroke="rgba(217,195,154,0.52)" strokeWidth="0.8" />
      <line x1="172" y1="78" x2="172" y2="73" stroke="rgba(184,153,104,0.4)" strokeWidth="0.7" />
      <line x1="169.5" y1="75.5" x2="174.5" y2="75.5" stroke="rgba(184,153,104,0.4)" strokeWidth="0.7" />
      <line x1="30" y1="95" x2="30" y2="91" stroke="rgba(217,195,154,0.42)" strokeWidth="0.7" />
      <line x1="28" y1="93" x2="32" y2="93" stroke="rgba(217,195,154,0.42)" strokeWidth="0.7" />
      <circle cx="158" cy="114" r="2.5" fill="rgba(217,195,154,0.3)" />
      <circle cx="43" cy="118" r="2" fill="rgba(184,153,104,0.25)" />
      <circle cx="170" cy="48" r="1.8" fill="rgba(184,153,104,0.28)" />
      <circle cx="32" cy="58" r="1.5" fill="rgba(217,195,154,0.32)" />
    </svg>
  )
}

const OPTIONS = [
  {
    key: 'wedding',
    title: 'Düğün',
    description: 'En özel günün eksiksiz hikâyesi',
    visual: <WeddingVisual />,
  },
  {
    key: 'engagement',
    title: 'Nişan / Söz',
    description: 'Yolculuğun ilk büyük adımı',
    visual: <EngagementVisual />,
  },
  {
    key: 'family',
    title: 'Bebek & Aile',
    description: 'Büyüyen aile, kalan anılar',
    visual: <FamilyVisual />,
  },
] as const

export default function ContextPage() {
  const router = useRouter()
  const [state, setState] = useWizardState()

  async function handleSelect(key: string) {
    await setState({ context: key })
    setTimeout(() => router.push('/configure/season'), 300)
  }

  return (
    <StepContainer
      step={1}
      title={<>Sizi <em className="font-accent not-italic text-gold-dark italic">buluşturalım</em></>}
      subtitle="Bağlam, ilerleyen tüm adımları şekillendirir."
    >
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-[880px]">
        {OPTIONS.map((opt) => (
          <Card
            key={opt.key}
            title={opt.title}
            description={opt.description}
            visual={opt.visual}
            selected={state.context === opt.key}
            onClick={() => handleSelect(opt.key)}
          />
        ))}
      </div>
    </StepContainer>
  )
}
