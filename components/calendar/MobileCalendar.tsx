'use client'

import { useState } from 'react'
import { AnimatePresence, m } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { CalendarLegend } from './CalendarLegend'
import { MONTH_NAMES } from './calendar-utils'
import type { MonthData } from './calendar-types'
import { MonthGrid } from './MonthGrid'

interface MobileCalendarProps {
  months: MonthData[]
  busySet: Set<string>
  selectedDate?: string
  today: string
  onSelectDate: (date: string) => void
}

export function MobileCalendar({ months, busySet, selectedDate, today, onSelectDate }: MobileCalendarProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [direction, setDirection] = useState(0)

  function goTo(index: number) {
    if (index < 0 || index >= months.length) return
    setDirection(index > activeIndex ? 1 : -1)
    setActiveIndex(index)
  }

  const current = months[activeIndex]

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <button
          onClick={() => goTo(activeIndex - 1)}
          disabled={activeIndex === 0}
          aria-label="Önceki ay"
          className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-ink/42 transition hover:bg-cream/55 hover:text-ink disabled:cursor-default disabled:opacity-20"
        >
          <ChevronLeft size={18} strokeWidth={1.5} />
        </button>

        <h3 className="font-accent text-[19px] italic uppercase tracking-[0.1em] text-gold-dark">
          {MONTH_NAMES[current.month]}
        </h3>

        <button
          onClick={() => goTo(activeIndex + 1)}
          disabled={activeIndex === months.length - 1}
          aria-label="Sonraki ay"
          className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-ink/42 transition hover:bg-cream/55 hover:text-ink disabled:cursor-default disabled:opacity-20"
        >
          <ChevronRight size={18} strokeWidth={1.5} />
        </button>
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <m.div
          key={activeIndex}
          initial={{ opacity: 0, x: direction * 18 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -direction * 18 }}
          transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
        >
          <MonthGrid
            year={current.year}
            month={current.month}
          busySet={busySet}
          selectedDate={selectedDate}
          today={today}
          showTitle={false}
          onSelectDate={onSelectDate}
        />
        </m.div>
      </AnimatePresence>

      <div className="mt-3 flex items-center justify-center gap-2">
        {months.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`${MONTH_NAMES[months[i].month]} ayına git`}
            className={cn(
              'cursor-pointer rounded-full transition duration-200',
              i === activeIndex ? 'h-2 w-5 bg-gold' : 'h-1.5 w-1.5 bg-gold-soft/60 hover:bg-gold/60',
            )}
          />
        ))}
      </div>

      <CalendarLegend hasSelected={!!selectedDate} />
    </div>
  )
}
