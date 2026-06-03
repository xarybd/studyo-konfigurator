'use client'
import { useState } from 'react'
import { m, AnimatePresence, useReducedMotion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

const WEEKDAYS = ['P', 'S', 'Ç', 'P', 'C', 'C', 'P']

const MONTH_NAMES = [
  '', 'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
  'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık',
]

interface MonthData {
  year: number
  month: number
}

interface CalendarGridProps {
  months: MonthData[]
  busyDays: string[]
  selectedDate?: string
  onSelectDate: (date: string) => void
}

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate()
}

function getFirstDayOfWeek(year: number, month: number): number {
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
      <h3 className="font-display text-[22px] italic font-light text-ink text-center mb-5">
        {MONTH_NAMES[month]}
      </h3>

      <div className="grid grid-cols-7 mb-2">
        {WEEKDAYS.map((d, i) => (
          <div
            key={i}
            className="font-body text-[10px] text-[#8A7F70] tracking-[2px] text-center py-1"
          >
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7">
        {cells.map((day, idx) => {
          if (!day) return <div key={`e-${idx}`} className="w-[44px] h-[44px]" />

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
              aria-label={`${day} ${MONTH_NAMES[month]} ${year}${isBusy ? ' — Dolu' : ''}`}
              aria-pressed={isSelected}
              className={cn(
                'w-[44px] h-[44px] flex items-center justify-center mx-auto',
                'font-body text-[13px] rounded-full',
                'transition-all duration-200',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-1',
                isSelected && 'bg-[#2A2520] text-[#F7F1E6] font-medium',
                isToday && !isSelected && 'border border-[#B89968] font-semibold text-ink',
                !isSelected && !isToday && !isUnavailable && [
                  'text-[#4A413A]',
                  'bg-[#D9C39A]/40',
                  'hover:bg-[#D9C39A]/70',
                  'hover:scale-[1.08]',
                  'cursor-pointer',
                ],
                isUnavailable && 'text-[#8A7F70] line-through cursor-not-allowed',
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

function Legend({ hasSelected }: { hasSelected: boolean }) {
  return (
    <div className="flex items-center gap-6 mt-6">
      <span className="flex items-center gap-2 font-body text-[11px] text-[#8A7F70]">
        <span className="w-3 h-3 rounded-full bg-[#D9C39A] inline-block" />
        Müsait
      </span>
      <span className="flex items-center gap-2 font-body text-[11px] text-[#8A7F70]">
        <span className="font-body text-[11px] text-[#8A7F70] line-through">15</span>
        Dolu
      </span>
      {hasSelected && (
        <span className="flex items-center gap-2 font-body text-[11px] text-[#8A7F70]">
          <span className="w-3 h-3 rounded-full bg-[#2A2520] inline-block" />
          Seçili
        </span>
      )}
    </div>
  )
}

function MobileCalendar({ months, busySet, selectedDate, today, onSelectDate }: {
  months: MonthData[]
  busySet: Set<string>
  selectedDate?: string
  today: string
  onSelectDate: (date: string) => void
}) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [direction, setDirection] = useState(0)
  const shouldReduce = useReducedMotion()

  function goTo(index: number) {
    if (index < 0 || index >= months.length) return
    setDirection(index > activeIndex ? 1 : -1)
    setActiveIndex(index)
  }

  const swipeThreshold = 50

  const m_ = months[activeIndex]

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => goTo(activeIndex - 1)}
          disabled={activeIndex === 0}
          aria-label="Önceki ay"
          className="w-10 h-10 flex items-center justify-center text-ink/40 hover:text-ink disabled:opacity-20 transition-colors cursor-pointer disabled:cursor-default"
        >
          <ChevronLeft size={18} strokeWidth={1.5} />
        </button>

        <h3 className="font-display text-[22px] italic font-light text-ink">
          {MONTH_NAMES[m_.month]}
        </h3>

        <button
          onClick={() => goTo(activeIndex + 1)}
          disabled={activeIndex === months.length - 1}
          aria-label="Sonraki ay"
          className="w-10 h-10 flex items-center justify-center text-ink/40 hover:text-ink disabled:opacity-20 transition-colors cursor-pointer disabled:cursor-default"
        >
          <ChevronRight size={18} strokeWidth={1.5} />
        </button>
      </div>

      <m.div
        drag={shouldReduce ? false : 'x'}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.1}
        onDragEnd={(_, { offset, velocity }) => {
          const swipe = Math.abs(offset.x) + Math.abs(velocity.x) * 10
          if (offset.x < -swipeThreshold && swipe > swipeThreshold) goTo(activeIndex + 1)
          else if (offset.x > swipeThreshold && swipe > swipeThreshold) goTo(activeIndex - 1)
        }}
      >
        <AnimatePresence mode="wait" initial={false}>
          <m.div
            key={activeIndex}
            initial={shouldReduce ? { opacity: 0 } : { opacity: 0, x: direction * 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={shouldReduce ? { opacity: 0 } : { opacity: 0, x: -direction * 40 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
          >
            <MonthGrid
              year={m_.year}
              month={m_.month}
              busySet={busySet}
              selectedDate={selectedDate}
              today={today}
              onSelectDate={onSelectDate}
            />
          </m.div>
        </AnimatePresence>
      </m.div>

      <div className="flex items-center justify-center gap-2 mt-4">
        {months.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`${MONTH_NAMES[months[i].month]} ayına git`}
            className={cn(
              'rounded-full transition-all duration-200 cursor-pointer',
              i === activeIndex
                ? 'w-2 h-2 bg-gold'
                : 'w-1.5 h-1.5 bg-gold-soft/60 hover:bg-gold/60'
            )}
          />
        ))}
      </div>

      <Legend hasSelected={!!selectedDate} />
    </div>
  )
}

export function CalendarGrid({ months, busyDays, selectedDate, onSelectDate }: CalendarGridProps) {
  const busySet = new Set(busyDays)
  const today = new Date().toISOString().split('T')[0]

  return (
    <>
      <div className="hidden md:grid md:grid-cols-3 md:gap-8">
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
        <div className="md:col-span-3">
          <Legend hasSelected={!!selectedDate} />
        </div>
      </div>

      <div className="md:hidden">
        <MobileCalendar
          months={months}
          busySet={busySet}
          selectedDate={selectedDate}
          today={today}
          onSelectDate={onSelectDate}
        />
      </div>
    </>
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
