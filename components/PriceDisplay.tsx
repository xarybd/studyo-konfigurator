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
    <div className="pointer-events-none fixed inset-x-0 bottom-[52px] z-40 flex justify-center px-5 sm:bottom-[72px] sm:px-6">
      <div className="inline-flex max-w-[calc(100vw-40px)] items-center justify-center gap-1.5 rounded-full border border-gold/24 bg-cream/70 px-4 py-2.5 shadow-[0_18px_48px_rgba(42,37,32,0.12),inset_0_1px_0_rgba(255,255,255,0.74)] backdrop-blur-2xl sm:gap-3 sm:px-5 sm:py-3">
        <span className="hidden shrink-0 font-body text-[9px] uppercase tracking-[0.24em] text-gold-dark/62 sm:inline">
          Yatırım
        </span>
        <span className="min-w-0 break-words text-center font-display text-[clamp(16px,4.7vw,20px)] font-light leading-none text-ink sm:whitespace-nowrap sm:text-2xl">
          {formatCurrency(price.min)}
        </span>
        <span className="h-px w-3.5 shrink-0 bg-gold/34 sm:w-5" />
        <span className="min-w-0 break-words text-center font-display text-[clamp(16px,4.7vw,20px)] font-light leading-none text-ink sm:whitespace-nowrap sm:text-2xl">
          {formatCurrency(price.max)}
        </span>
      </div>
    </div>
  )
}
