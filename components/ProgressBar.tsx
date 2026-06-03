'use client'
import { useRouter } from 'next/navigation'
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

interface ProgressBarProps {
  current: number
}

export function ProgressBar({ current }: ProgressBarProps) {
  const router = useRouter()
  const total = STEP_ROUTES.length
  const pct = (current / total) * 100

  return (
    <div
      className="flex items-center gap-4 w-full"
      role="progressbar"
      aria-valuenow={current}
      aria-valuemin={1}
      aria-valuemax={total}
    >
      <div className="relative flex-1 h-2">
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px bg-[#E8DEC9]" />
        <div
          className="absolute left-0 top-1/2 -translate-y-1/2 h-px bg-gold transition-all duration-300 ease-out"
          style={{ width: `${pct}%` }}
        />
        <div
          className="absolute top-1/2 w-2 h-2 rounded-full bg-gold -translate-y-1/2 -translate-x-1/2 transition-all duration-300 ease-out"
          style={{ left: `${pct}%` }}
        />
        <div className="absolute inset-0 flex" aria-hidden="true">
          {STEP_ROUTES.map((route, i) => {
            const step = i + 1
            const isCompleted = step < current
            return (
              <button
                key={route}
                onClick={() => isCompleted && router.push(route)}
                tabIndex={-1}
                className={cn(
                  'flex-1 h-full',
                  isCompleted ? 'cursor-pointer' : 'cursor-default',
                )}
              />
            )
          })}
        </div>
      </div>

      <span className="font-body text-[11px] text-ink/40 tracking-widest whitespace-nowrap shrink-0">
        Adım {String(current).padStart(2, '0')} / 09
      </span>
    </div>
  )
}
