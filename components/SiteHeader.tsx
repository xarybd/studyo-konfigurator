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
  const isIntro = pathname.startsWith('/configure/info')
  const idx = STEP_ROUTES.findIndex((route) => pathname.startsWith(route))
  const currentStep = isResult ? 9 : idx + 1

  return (
    <header className="sticky top-0 z-30 shrink-0 px-4 py-3 sm:px-6 md:px-10 md:py-6">
      <div className="mx-auto flex w-full max-w-[1180px] items-start justify-between gap-3">
        <div className="max-w-[230px] rounded-full border border-gold/14 bg-cream/48 px-3.5 py-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.62)] backdrop-blur-xl md:max-w-[280px] md:px-4 md:py-3">
          <p className="font-accent text-[14px] tracking-[0.14em] text-gold-dark md:text-[15px] md:tracking-[0.18em]">
            STÜDYO
          </p>
          <p className="mt-1 whitespace-nowrap font-body text-[7px] uppercase tracking-[0.18em] text-ink/45 md:text-[9px] md:tracking-[0.24em]">
            Fine Wedding Photography
          </p>
        </div>

        {isWelcome || isIntro ? (
          <div className="rounded-full border border-gold/14 bg-cream/48 px-3 py-2.5 font-body text-[9px] uppercase tracking-[0.18em] text-ink/45 backdrop-blur-xl md:px-4 md:py-3 md:text-[10px] md:tracking-[0.24em]">
            00 / 09
          </div>
        ) : (
          <div className="mt-2 flex items-center gap-2 rounded-full border border-gold/14 bg-cream/48 px-3 py-2.5 backdrop-blur-xl md:mt-3 md:px-4 md:py-3">
            <span className="font-body text-[9px] uppercase tracking-[0.18em] text-ink/42 sm:hidden">
              {String(currentStep).padStart(2, '0')} / 09
            </span>
            <div className="hidden items-center gap-2 sm:flex">
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
          </div>
        )}
      </div>
    </header>
  )
}
