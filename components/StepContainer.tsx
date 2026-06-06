import { cn } from '@/lib/utils'

interface StepContainerProps {
  step: number
  title: React.ReactNode
  subtitle?: string
  children: React.ReactNode
  footer?: React.ReactNode
  hasPriceBar?: boolean
}

export function StepContainer({ step, title, subtitle, children, footer, hasPriceBar }: StepContainerProps) {
  return (
    <section
      className={cn(
        'flex-1 overflow-visible px-4 pb-24 pt-5 sm:px-6 lg:px-14',
        hasPriceBar && 'pb-36',
      )}
    >
      <div className="mx-auto flex min-h-[calc(100svh-156px)] w-full max-w-[390px] flex-col justify-start overflow-visible py-7 sm:max-w-[430px] md:max-w-[1120px] md:justify-center md:py-10 lg:py-12">
        <div className="mx-auto w-full max-w-[390px] text-center md:max-w-3xl">
          {step > 0 && (
            <div className="mb-3 inline-flex items-center rounded-full border border-gold/20 bg-cream/55 px-3 py-1.5 font-body text-[8px] uppercase tracking-[0.18em] text-gold-dark/70 shadow-[inset_0_1px_0_rgba(255,255,255,0.72)] md:mb-5 md:px-4 md:py-2 md:text-[9px] md:tracking-[0.28em]">
              ADIM {String(step).padStart(2, '0')} / 09
            </div>
          )}

          <h1 className="mx-auto max-w-[10ch] font-display text-[clamp(31px,9.2vw,54px)] font-light leading-[1.04] text-ink md:max-w-none md:text-[clamp(38px,6vw,76px)] md:leading-[0.98]">
            {title}
          </h1>

          {subtitle ? (
            <p className="mx-auto mt-3 max-w-[31ch] font-display text-[13px] italic leading-6 text-ink/50 md:mt-4 md:max-w-xl md:text-[16px] md:leading-7">
              {subtitle}
            </p>
          ) : null}
        </div>

        <div className="mx-auto mt-5 w-full max-w-[390px] overflow-visible sm:max-w-[430px] md:mt-12 md:max-w-[1080px]">
          {children}
        </div>

        {footer ? (
          <div className="mx-auto mt-5 flex w-full max-w-[390px] items-center sm:max-w-[430px] md:mt-8 md:max-w-[1080px]">
            {footer}
          </div>
        ) : null}
      </div>
    </section>
  )
}
