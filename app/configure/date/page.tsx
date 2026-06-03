'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { StepContainer } from '@/components/StepContainer'
import { CalendarGrid, getSeasonMonths } from '@/components/CalendarGrid'
import { Button } from '@/components/Button'
import { useWizardState } from '@/hooks/useWizardState'
import { ChevronLeft, RefreshCw } from 'lucide-react'

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
      .then((r) => r.json())
      .then((data) => setBusyDays(data.busyDays ?? []))
      .catch(() => setBusyDays([]))
      .finally(() => setLoading(false))
  }, [season])

  async function handleSelectDate(date: string) {
    await setState({ date })
    setTimeout(() => router.push('/configure/style'), 300)
  }

  return (
    <StepContainer
      step={3}
      title={<>Müsait bir <em className="font-accent not-italic text-gold-dark italic">günü</em> seçin</>}
      subtitle="Dolu günler otomatik olarak işaretlidir."
      footer={
        <div className="flex items-center gap-6">
          <Button variant="ghost" onClick={() => router.push('/configure/season')}>
            <ChevronLeft size={16} />
            Geri
          </Button>
          <Button variant="ghost" onClick={() => router.push('/configure/style')}>
            Tarihi sonra belirle →
          </Button>
        </div>
      }
    >
      {loading ? (
        <div className="flex items-center gap-2 text-ink/40 mt-8">
          <RefreshCw size={16} className="animate-spin" />
          <span className="font-body text-sm">Takvim yükleniyor…</span>
        </div>
      ) : (
        <div className="mt-4">
          <CalendarGrid
            months={months}
            busyDays={busyDays}
            selectedDate={state.date ?? undefined}
            onSelectDate={handleSelectDate}
          />
          <div className="flex items-center gap-6 mt-6">
            <span className="flex items-center gap-2 font-body text-xs text-ink/50">
              <span className="w-3 h-3 rounded-full bg-cream border border-gold-soft/60 inline-block" />
              Müsait
            </span>
            <span className="flex items-center gap-2 font-body text-xs text-ink/50">
              <span className="w-3 h-3 rounded-full bg-ink/20 inline-block" />
              Dolu
            </span>
            {state.date && (
              <span className="flex items-center gap-2 font-body text-xs text-ink/50">
                <span className="w-3 h-3 rounded-full bg-gold inline-block" />
                Seçili
              </span>
            )}
          </div>
        </div>
      )}
    </StepContainer>
  )
}
