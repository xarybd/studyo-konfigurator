'use client'
import { PageTransition } from '@/components/PageTransition'
import { PriceDisplay } from '@/components/PriceDisplay'
import { useWizardState } from '@/hooks/useWizardState'
import { calculatePrice } from '@/lib/price-engine'
import { usePathname } from 'next/navigation'
import { studioConfig } from '@/studio.config'

const PRICE_VISIBLE_STEPS = [
  '/configure/style',
  '/configure/location',
  '/configure/duration',
  '/configure/team',
  '/configure/delivery',
  '/configure/extras',
  '/configure/result',
]

export function ConfigureLayoutInner({ children }: { children: React.ReactNode }) {
  const [state] = useWizardState()
  const pathname = usePathname()

  const price = calculatePrice({
    context: state.context as never,
    style: state.style as never,
    duration: state.duration as never,
    team: state.team as never,
    delivery: state.delivery as never,
    extras: (state.extras ?? []) as never,
  })

  const showPrice = PRICE_VISIBLE_STEPS.some((s) => pathname.startsWith(s))

  return (
    <div className="min-h-screen bg-cream relative">
      <div className="px-6 pt-8 md:px-12" aria-hidden="true">
        <p className="font-body text-[10px] tracking-[0.25em] uppercase text-ink/40">
          {studioConfig.name}
        </p>
        <p className="font-body text-[10px] tracking-[0.2em] uppercase text-gold-soft">
          {studioConfig.tagline}
        </p>
      </div>
      <PageTransition>{children}</PageTransition>
      <PriceDisplay price={price} visible={showPrice} />
    </div>
  )
}
