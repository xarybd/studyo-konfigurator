'use client'

import type { PriceRange } from '@/lib/price-engine'
import { formatCurrency } from '@/lib/utils'

interface PriceDisplayProps {
  price: PriceRange | null
  visible: boolean
}

export function PriceDisplay({ price, visible }: PriceDisplayProps) {
  if (!visible || !price) return null

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-[58px] z-40 flex justify-center px-4 sm:bottom-[72px] sm:px-6">
      <div className="flex w-full max-w-[calc(100vw-32px)] items-center justify-center gap-1.5 rounded-[18px] border border-gold/24 bg-cream/64 px-4 py-3 shadow-[0_18px_48px_rgba(42,37,32,0.12),inset_0_1px_0_rgba(255,255,255,0.74)] backdrop-blur-2xl sm:max-w-[420px] sm:gap-3 sm:rounded-full sm:px-5">
        <span className="hidden shrink-0 font-body text-[9px] uppercase tracking-[0.24em] text-gold-dark/62 sm:inline">
          Yatırım
        </span>
        <span className="min-w-0 break-words text-center font-display text-[clamp(17px,5vw,21px)] font-light leading-none text-ink sm:whitespace-nowrap sm:text-2xl">
          {formatCurrency(price.min)}
        </span>
        <span className="h-px w-4 shrink-0 bg-gold/34 sm:w-5" />
        <span className="min-w-0 break-words text-center font-display text-[clamp(17px,5vw,21px)] font-light leading-none text-ink sm:whitespace-nowrap sm:text-2xl">
          {formatCurrency(price.max)}
        </span>
      </div>
    </div>
  )
}
