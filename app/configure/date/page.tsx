'use client'

import { useEffect, useState } from 'react'
import { ChevronLeft, RefreshCw } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/Button'
import { CalendarGrid, getSeasonMonths } from '@/components/CalendarGrid'
import { StepContainer } from '@/components/StepContainer'
import { useWizardState } from '@/hooks/useWizardState'
import { buildWizardUrl } from '@/lib/wizard-url'

const glassPanelStyle = {
  background: 'rgba(255,252,245,0.46)',
  backdropFilter: 'blur(26px) saturate(155%)',
  WebkitBackdropFilter: 'blur(26px) saturate(155%)',
  border: '1px solid rgba(184,153,104,0.22)',
  borderRadius: '20px',
  boxShadow: '0 28px 90px rgba(42,37,32,0.09), inset 0 1px 0 rgba(255,255,255,0.78)',
} as const

export default function DatePage() {
  const router = useRouter()
  const [state, setState] = useWizardState()
  const [busyDays, setBusyDays] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const season = state.season ?? 'spring'
  const months = getSeasonMonths(season)

  useEffect(() => {
    setLoading(true)
    fetch(`/api/availability?season=${season}`)
      .then((response) => response.json())
      .then((data) => setBusyDays(data.busyDays ?? []))
      .catch(() => setBusyDays([]))
      .finally(() => setLoading(false))
  }, [season])

  async function handleSelectDate(date: string) {
    await setState({ date })
    window.setTimeout(() => router.push(buildWizardUrl('/configure/style', { ...state, date })), 320)
  }

  return (
    <StepContainer
      step={3}
      title={<>Müsait bir <em className="font-accent italic text-gold-dark">gününüzü</em> seçin</>}
      subtitle="Dolu günler otomatik işaretlenir. Tarih net değilse bu adımı geçebilirsiniz."
      footer={
        <div className="flex w-full flex-col items-stretch gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Button variant="ghost" onClick={() => router.push(buildWizardUrl('/configure/season', state))}>
            <ChevronLeft size={16} />
            Geri
          </Button>
          <Button variant="ghost" onClick={() => router.push(buildWizardUrl('/configure/style', state))}>
            Tarihi sonra belirle
          </Button>
        </div>
      }
    >
      {loading ? (
        <div className="mt-8 flex items-center justify-center gap-3 text-ink/45">
          <RefreshCw size={16} className="animate-spin" />
          <span className="font-body text-sm">Takvim yükleniyor</span>
        </div>
      ) : (
        <div className="mx-auto w-full max-w-[430px] p-2.5 sm:max-w-5xl sm:p-5 md:p-6" style={glassPanelStyle}>
          <CalendarGrid
            months={months}
            busyDays={busyDays}
            selectedDate={state.date ?? undefined}
            onSelectDate={handleSelectDate}
          />
        </div>
      )}
    </StepContainer>
  )
}
