'use client'
import { PageTransition } from '@/components/PageTransition'
import { PriceDisplay } from '@/components/PriceDisplay'
import { SiteHeader } from '@/components/SiteHeader'
import { useWizardState } from '@/hooks/useWizardState'
import { calculatePrice } from '@/lib/price-engine'
import { usePathname } from 'next/navigation'

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
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <PageTransition className="flex-1 flex flex-col">{children}</PageTransition>
      <PriceDisplay price={price} visible={showPrice} />
    </div>
  )
}
