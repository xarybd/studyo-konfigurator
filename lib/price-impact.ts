import { calculatePrice, type WizardSelections } from '@/lib/price-engine'
import { formatCurrency } from '@/lib/utils'

type LooseSelections = Record<string, unknown>

function normalizeSelections(selections: LooseSelections): WizardSelections {
  return {
    context: typeof selections.context === 'string' ? selections.context as never : undefined,
    style: typeof selections.style === 'string' ? selections.style as never : undefined,
    duration: typeof selections.duration === 'string' ? selections.duration as never : undefined,
    team: typeof selections.team === 'string' ? selections.team as never : undefined,
    delivery: typeof selections.delivery === 'string' ? selections.delivery as never : undefined,
    extras: Array.isArray(selections.extras) ? selections.extras as never : undefined,
  }
}

export function getPriceImpact(current: LooseSelections, next: LooseSelections): string {
  const currentPrice = calculatePrice(normalizeSelections(current))
  const nextPrice = calculatePrice(normalizeSelections(next))

  if (!nextPrice) return 'Fiyat için önce etkinlik seçin'

  if (!currentPrice) {
    return `${formatCurrency(nextPrice.min)} - ${formatCurrency(nextPrice.max)}`
  }

  const minDelta = nextPrice.min - currentPrice.min
  const maxDelta = nextPrice.max - currentPrice.max

  if (minDelta === 0 && maxDelta === 0) return ''

  const prefix = minDelta > 0 ? '+' : ''
  return `${prefix}${formatCurrency(minDelta)} - ${prefix}${formatCurrency(maxDelta)}`
}
