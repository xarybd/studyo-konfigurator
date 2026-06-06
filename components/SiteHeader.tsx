'use client'

import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const STEP_ROUTES = [
  '/configure/context',
  '/configure/season',
  '/configure/date',
  '/configure/style',
  '/configure/location',
  '/configure/duration',
  '/configure/team',
  '/configure/delivery',
  '/configure/extras',
]

export function SiteHeader() {
  const pathname = usePathname()
  const isResult = pathname.startsWith('/configure/result')
  const isWelcome = !pathname.startsWith('/configure')
  const idx = STEP_ROUTES.findIndex((route) => pathname.startsWith(route))
  const currentStep = isResult ? 9 : idx + 1

  return (
    <header className="sticky top-0 z-30 flex shrink-0 items-start justify-between px-5 py-4 md:px-10 md:py-6">
      <div className="rounded-full border border-gold/14 bg-cream/42 px-4 py-3 backdrop-blur-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.62)]">
        <p className="font-accent text-[15px] tracking-[0.18em] text-gold-dark">
          STÜDYO
        </p>
        <p className="mt-1 font-body text-[8px] uppercase tracking-[0.24em] text-ink/45 md:text-[9px]">
          Fine Wedding Photography
        </p>
      </div>

      {isWelcome ? (
        <div className="rounded-full border border-gold/14 bg-cream/42 px-4 py-3 font-body text-[10px] uppercase tracking-[0.24em] text-ink/45 backdrop-blur-xl">
          00 / 09
        </div>
      ) : (
        <div className="mt-3 hidden items-center gap-2 rounded-full border border-gold/14 bg-cream/42 px-4 py-3 backdrop-blur-xl sm:flex">
          {Array.from({ length: 9 }, (_, i) => {
            const step = i + 1
            const isActive = step === currentStep
            const isCompleted = currentStep > 0 && step < currentStep

            return (
              <span
                key={step}
                className={cn(
                  'rounded-full transition-all duration-300',
                  isActive && 'h-2 w-5 bg-gold',
                  isCompleted && 'h-1.5 w-1.5 bg-gold/55',
                  !isActive && !isCompleted && 'h-1.5 w-1.5 bg-gold/18',
                )}
              />
            )
          })}
        </div>
      )}
    </header>
  )
}
