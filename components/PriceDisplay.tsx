'use client'
import type { PriceRange } from '@/lib/price-engine'

interface PriceDisplayProps {
  price: PriceRange | null
  visible: boolean
}

export function PriceDisplay({ price, visible }: PriceDisplayProps) {
  if (!visible || !price) return null

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 bg-cream/95 backdrop-blur-sm border-t border-gold-soft/40 px-6 py-3 flex items-center justify-end pointer-events-none">
      <div className="flex items-baseline gap-1">
        <span className="font-accent italic text-gold text-lg leading-none">₺</span>
        <span className="font-display text-2xl font-light text-ink">
          {price.min.toLocaleString('tr-TR')}
        </span>
        <span className="font-body text-sm text-ink/40 mx-1">—</span>
        <span className="font-display text-2xl font-light text-ink">
          {price.max.toLocaleString('tr-TR')}
        </span>
        <span className="font-accent italic text-gold text-lg leading-none ml-0.5">₺</span>
      </div>
    </div>
  )
}
