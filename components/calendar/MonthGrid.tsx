import { cn } from '@/lib/utils'
import { formatDate, getDaysInMonth, getFirstDayOfWeek, MONTH_NAMES, WEEKDAYS } from './calendar-utils'

interface MonthGridProps {
  year: number
  month: number
  busySet: Set<string>
  selectedDate?: string
  today: string
  showTitle?: boolean
  onSelectDate: (date: string) => void
}

export function MonthGrid({ year, month, busySet, selectedDate, today, showTitle = true, onSelectDate }: MonthGridProps) {
  const daysInMonth = getDaysInMonth(year, month)
  const firstDay = getFirstDayOfWeek(year, month)
  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]

  return (
    <div className="rounded-[18px] border border-gold/14 bg-cream/32 p-3.5 backdrop-blur-xl sm:rounded-[14px] sm:p-5">
      {showTitle ? (
        <h3 className="mb-4 text-center font-accent text-[20px] italic uppercase tracking-[0.12em] text-gold-dark">
          {MONTH_NAMES[month]}
        </h3>
      ) : null}

      <div className="mb-2 grid grid-cols-7">
        {WEEKDAYS.map((day, i) => (
          <div key={`${day}-${i}`} className="py-1 text-center font-body text-[10px] tracking-[0.12em] text-ink/40">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, idx) => {
          if (!day) return <div key={`empty-${idx}`} className="aspect-square" />

          const dateStr = formatDate(year, month, day)
          const isBusy = busySet.has(dateStr)
          const isPast = dateStr < today
          const isUnavailable = isBusy || isPast
          const isSelected = dateStr === selectedDate
          const isToday = dateStr === today

          return (
            <button
              key={dateStr}
              onClick={() => !isUnavailable && onSelectDate(dateStr)}
              disabled={isUnavailable}
              aria-label={`${day} ${MONTH_NAMES[month]} ${year}${isBusy ? ' dolu' : ''}`}
              aria-pressed={isSelected}
              className={cn(
                'mx-auto flex aspect-square w-full max-w-10 items-center justify-center rounded-full font-body text-[13px] transition duration-200 sm:max-w-11 sm:text-sm',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-cream',
                isSelected && 'bg-ink text-cream shadow-[0_10px_22px_rgba(42,37,32,0.18)]',
                isToday && !isSelected && 'border border-gold text-ink',
                !isSelected && !isToday && !isUnavailable && 'cursor-pointer text-ink/78 hover:bg-gold/16 hover:scale-105',
                isUnavailable && 'cursor-not-allowed text-ink/25 line-through',
              )}
            >
              {day}
            </button>
          )
        })}
      </div>
    </div>
  )
}
