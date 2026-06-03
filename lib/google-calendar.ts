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

  // Vercel sometimes stores \n as \\n — fix it
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
  const year = new Date().getFullYear()

  const startMonth = months[0]
  const endMonth = months[2]
  const startYear = startMonth === 12 ? year : year
  const endYear = endMonth < startMonth ? year + 1 : year

  const timeMin = new Date(startYear, startMonth - 1, 1).toISOString()
  const timeMax = new Date(endYear, endMonth, 0, 23, 59, 59).toISOString()

  return { timeMin, timeMax }
}

export async function getBusyDays(season: string, calendarId: string): Promise<string[]> {
  const { timeMin, timeMax } = getSeasonWindow(season)
  const calendar = getCalendarClient()

  const response = await calendar.freebusy.query({
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
    const cur = new Date(start)
    while (cur <= end) {
      busyDays.add(cur.toISOString().split('T')[0])
      cur.setDate(cur.getDate() + 1)
    }
  }

  return Array.from(busyDays)
}
