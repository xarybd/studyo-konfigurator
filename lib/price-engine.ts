import { studioConfig } from '@/studio.config'
import type { ContextKey, StyleKey, DurationKey, TeamKey, DeliveryKey, ExtrasKey } from '@/studio.config'
import { roundToNearest } from '@/lib/utils'

export interface WizardSelections {
  context?: ContextKey
  style?: StyleKey
  duration?: DurationKey
  team?: TeamKey
  delivery?: DeliveryKey
  extras?: ExtrasKey[]
}

export interface PriceRange {
  total: number
  min: number
  max: number
}

export function calculatePrice(s: WizardSelections): PriceRange | null {
  if (!s.context) return null

  const base = studioConfig.BASE[s.context]
  const styleMult = s.style ? studioConfig.STYLE_MULT[s.style] : 1.0
  const durationMult = s.duration ? studioConfig.DURATION_MULT[s.duration] : 1.0
  const teamMult = s.team ? studioConfig.TEAM_MULT[s.team] : 1.0
  const deliveryAdd = s.delivery ? studioConfig.DELIVERY_ADD[s.delivery] : 0
  const extrasAdd = (s.extras ?? []).reduce(
    (sum, key) => sum + (studioConfig.EXTRAS_ADD[key] ?? 0),
    0,
  )

  const total = base * styleMult * durationMult * teamMult + deliveryAdd + extrasAdd
  const { low, high } = studioConfig.PRICE_RANGE
  const r = studioConfig.PRICE_ROUNDING

  return {
    total,
    min: roundToNearest(total * low, r),
    max: roundToNearest(total * high, r),
  }
}
