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
  current: number // 1-9
}

export function ProgressBar({ current }: ProgressBarProps) {
  const router = useRouter()

  return (
    <div className="flex items-center gap-1 w-full" role="progressbar" aria-valuenow={current} aria-valuemin={1} aria-valuemax={9}>
      {STEP_ROUTES.map((route, i) => {
        const step = i + 1
        const isCompleted = step < current
        const isActive = step === current

        return (
          <button
            key={route}
            onClick={() => isCompleted && router.push(route)}
            disabled={!isCompleted}
            aria-label={`Adım ${step}`}
            className={cn(
              'h-0.5 flex-1 transition-colors duration-300 ease-out',
              'disabled:cursor-default',
              isCompleted && 'bg-gold cursor-pointer',
              isActive && 'bg-gold/60 cursor-default',
              !isCompleted && !isActive && 'bg-gold-soft/40 cursor-default',
            )}
          />
        )
      })}
    </div>
  )
}
