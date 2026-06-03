import { NextRequest, NextResponse } from 'next/server'
import { unstable_cache } from 'next/cache'
import { getBusyDays, SEASON_MONTHS } from '@/lib/google-calendar'

const getCachedBusyDays = unstable_cache(
  async (season: string, calendarId: string) => getBusyDays(season, calendarId),
  ['freebusy'],
  { revalidate: 3600 },
)

export async function GET(request: NextRequest) {
  const season = request.nextUrl.searchParams.get('season') ?? 'spring'

  if (!SEASON_MONTHS[season]) {
    return NextResponse.json({ error: 'Invalid season' }, { status: 400 })
  }

  const calendarId = process.env.GOOGLE_CALENDAR_ID
  if (!calendarId) {
    // Dev mode: return empty array so UI works without Calendar setup
    return NextResponse.json({ busyDays: [] })
  }

  try {
    const busyDays = await getCachedBusyDays(season, calendarId)
    return NextResponse.json({ busyDays })
  } catch (err) {
    console.error('[availability]', err)
    return NextResponse.json({ busyDays: [] })
  }
}
