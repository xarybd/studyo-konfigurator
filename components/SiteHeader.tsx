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
  const idx = STEP_ROUTES.findIndex(r => pathname.startsWith(r))
  const currentStep = isResult ? 10 : idx + 1

  return (
    <header className="flex items-start justify-between px-6 py-5 md:px-12 md:py-8 shrink-0">
      <div>
        <p
          className="font-accent text-[14px] tracking-[0.2em]"
          style={{ color: '#9A7E4F' }}
        >
          STÜDYO
        </p>
        <p
          className="font-body text-[9px] tracking-[0.3em] uppercase mt-1"
          style={{ color: '#8A7F70' }}
        >
          Fine Wedding Photography
        </p>
      </div>

      {isWelcome ? (
        <p
          className="font-body text-[11px] tracking-[0.3em] uppercase pt-1"
          style={{ color: '#8A7F70' }}
        >
          00 / 09
        </p>
      ) : (
        <div className="relative flex items-center gap-2 mt-1.5" aria-hidden="true">
          {/* Hairline path — completed → active */}
          {currentStep > 1 && (
            <div
              className="absolute top-1/2 left-0 h-px pointer-events-none transition-all duration-500"
              style={{
                width: `calc(${currentStep - 1} * 13px + 3.5px)`,
                background: 'linear-gradient(to right, rgba(184,153,104,0.55), rgba(184,153,104,0.25))',
                transform: 'translateY(-50%)',
              }}
            />
          )}

          {Array.from({ length: 9 }, (_, i) => {
            const step = i + 1
            const isActive = step === currentStep
            const isCompleted = currentStep > 0 && step < currentStep
            return (
              <div
                key={step}
                className={cn(
                  'rounded-full transition-all duration-300',
                  isActive    && 'w-[7px] h-[7px] bg-gold',
                  isCompleted && 'w-[5px] h-[5px] bg-gold/50',
                  !isActive && !isCompleted && 'w-[5px] h-[5px] bg-gold/[0.18]',
                )}
              />
            )
          })}
        </div>
      )}
    </header>
  )
}
