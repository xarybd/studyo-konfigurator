'use client'

import { CalendarLegend } from './calendar/CalendarLegend'
import type { MonthData } from './calendar/calendar-types'
import { MobileCalendar } from './calendar/MobileCalendar'
import { MonthGrid } from './calendar/MonthGrid'

interface CalendarGridProps {
  months: MonthData[]
  busyDays: string[]
  selectedDate?: string
  onSelectDate: (date: string) => void
}

export function CalendarGrid({ months, busyDays, selectedDate, onSelectDate }: CalendarGridProps) {
  const busySet = new Set(busyDays)
  const today = new Date().toISOString().split('T')[0]

  return (
    <>
      <div className="hidden md:grid md:grid-cols-3 md:gap-5 lg:gap-7">
        {months.map((month) => (
          <MonthGrid
            key={`${month.year}-${month.month}`}
            year={month.year}
            month={month.month}
            busySet={busySet}
            selectedDate={selectedDate}
            today={today}
            onSelectDate={onSelectDate}
          />
        ))}
        <div className="md:col-span-3">
          <CalendarLegend hasSelected={!!selectedDate} />
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

  if (season === 'winter') {
    return months.map((month) => ({
      year: month === 12 ? year : year + 1,
      month,
    }))
  }

  return months.map((month) => ({
    year: month < now.getMonth() + 1 ? year + 1 : year,
    month,
  }))
}
