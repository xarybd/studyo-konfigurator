'use client'
import { cn } from '@/lib/utils'

const WEEKDAYS = ['P', 'S', 'Ç', 'P', 'C', 'C', 'P']

const MONTH_NAMES = [
  '', 'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
  'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık',
]

interface MonthData {
  year: number
  month: number // 1-12
}

interface CalendarGridProps {
  months: MonthData[]
  busyDays: string[] // YYYY-MM-DD
  selectedDate?: string // YYYY-MM-DD
  onSelectDate: (date: string) => void
}

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate()
}

function getFirstDayOfWeek(year: number, month: number): number {
  // 0=Sun → convert to Mon-first (0=Mon)
  const day = new Date(year, month - 1, 1).getDay()
  return day === 0 ? 6 : day - 1
}

function formatDate(year: number, month: number, day: number): string {
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

interface MonthGridProps {
  year: number
  month: number
  busySet: Set<string>
  selectedDate?: string
  today: string
  onSelectDate: (date: string) => void
}

function MonthGrid({ year, month, busySet, selectedDate, today, onSelectDate }: MonthGridProps) {
  const daysInMonth = getDaysInMonth(year, month)
  const firstDay = getFirstDayOfWeek(year, month)
  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]

  return (
    <div>
      <h3 className="font-display text-lg font-light text-ink text-center mb-4 tracking-widest uppercase text-sm">
        {MONTH_NAMES[month]}
      </h3>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 mb-2">
        {WEEKDAYS.map((d, i) => (
          <div
            key={i}
            className="font-body text-[10px] text-ink/40 uppercase tracking-wide text-center py-1"
          >
            {d}
          </div>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7">
        {cells.map((day, idx) => {
          if (!day) return <div key={`empty-${idx}`} />

          const dateStr = formatDate(year, month, day)
          const isBusy = busySet.has(dateStr)
          const isPast = dateStr < today
          const isUnavailable = isBusy || isPast
          const isSelected = dateStr === selectedDate

          return (
            <button
              key={dateStr}
              onClick={() => !isUnavailable && onSelectDate(dateStr)}
              disabled={isUnavailable}
              aria-label={`${day} ${MONTH_NAMES[month]} ${year}${isBusy ? ' - Dolu' : ''}`}
              className={cn(
                'aspect-square min-h-[40px] flex items-center justify-center',
                'font-body text-sm transition-colors duration-150',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold',
                isSelected && 'rounded-full bg-gold text-cream font-medium',
                !isSelected && !isUnavailable && 'text-ink hover:bg-gold/10 rounded-sm cursor-pointer',
                isUnavailable && 'text-ink/30 line-through cursor-not-allowed',
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

export function CalendarGrid({ months, busyDays, selectedDate, onSelectDate }: CalendarGridProps) {
  const busySet = new Set(busyDays)
  const today = new Date().toISOString().split('T')[0]

  return (
    <div className="grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-8">
      {months.map((m) => (
        <MonthGrid
          key={`${m.year}-${m.month}`}
          year={m.year}
          month={m.month}
          busySet={busySet}
          selectedDate={selectedDate}
          today={today}
          onSelectDate={onSelectDate}
        />
      ))}
    </div>
  )
}

export function getSeasonMonths(season: string): MonthData[] {
  const seasonMap: Record<string, number[]> = {
    spring: [3, 4, 5],
    summer: [6, 7, 8],
    autumn: [9, 10, 11],
    winter: [12, 1, 2],
  }
  const months = seasonMap[season] ?? seasonMap.spring
  const now = new Date()
  const year = now.getFullYear()

  return months.map((m) => ({
    year: m < now.getMonth() + 1 && season !== 'winter' ? year + 1 : year,
    month: m,
  }))
}
