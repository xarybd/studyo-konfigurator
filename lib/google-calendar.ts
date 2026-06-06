import 'server-only'
import { calendar } from '@googleapis/calendar'
import type { calendar_v3 } from '@googleapis/calendar'
import { JWT } from 'google-auth-library'

type CalendarClient = calendar_v3.Calendar

function getCalendarClient(): CalendarClient {
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_KEY
  if (!raw) throw new Error('GOOGLE_SERVICE_ACCOUNT_KEY env var is missing')

  const credentials = JSON.parse(raw) as {
    client_email: string
    private_key: string
  }

  const privateKey = credentials.private_key.replace(/\\n/g, '\n')

  const auth = new JWT({
    email: credentials.client_email,
    key: privateKey,
    scopes: ['https://www.googleapis.com/auth/calendar.readonly'],
  })

  return calendar({ version: 'v3', auth })
}

export const SEASON_MONTHS: Record<string, number[]> = {
  spring: [3, 4, 5],
  summer: [6, 7, 8],
  autumn: [9, 10, 11],
  winter: [12, 1, 2],
}

function getSeasonWindow(season: string) {
  const months = SEASON_MONTHS[season] ?? SEASON_MONTHS.spring
  const now = new Date()
  const year = now.getFullYear()
  const startMonth = months[0]
  const endMonth = months[2]
  const startYear = season === 'winter' || startMonth >= now.getMonth() + 1 ? year : year + 1
  const endYear = season === 'winter' || endMonth < startMonth ? startYear + 1 : startYear
  const timeMin = new Date(startYear, startMonth - 1, 1).toISOString()
  const timeMax = new Date(endYear, endMonth, 0, 23, 59, 59).toISOString()

  return { timeMin, timeMax }
}

export async function getBusyDays(season: string, calendarId: string): Promise<string[]> {
  const { timeMin, timeMax } = getSeasonWindow(season)
  const calendarClient = getCalendarClient()

  const response = await calendarClient.freebusy.query({
    requestBody: {
      timeMin,
      timeMax,
      timeZone: 'Europe/Istanbul',
      items: [{ id: calendarId }],
    },
  })

  const busySlots = response.data.calendars?.[calendarId]?.busy ?? []
  const busyDays = new Set<string>()

  for (const slot of busySlots) {
    if (!slot.start || !slot.end) continue

    const start = new Date(slot.start)
    const end = new Date(slot.end)
    const current = new Date(start)

    while (current <= end) {
      busyDays.add(current.toISOString().split('T')[0])
      current.setDate(current.getDate() + 1)
    }
  }

  return Array.from(busyDays)
}
