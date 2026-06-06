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
        'flex-1 overflow-visible px-5 pb-24 pt-4 sm:px-8 lg:px-14',
        hasPriceBar && 'pb-40',
      )}
    >
      <div className="mx-auto flex min-h-[calc(100svh-172px)] w-full max-w-[430px] flex-col justify-center overflow-visible py-6 md:max-w-[1120px] md:py-10 lg:py-12">
        <div className="mx-auto w-full max-w-3xl text-center">
          {step > 0 && (
            <div className="mb-4 inline-flex items-center rounded-full border border-gold/20 bg-cream/55 px-3 py-1.5 font-body text-[8px] uppercase tracking-[0.22em] text-gold-dark/70 shadow-[inset_0_1px_0_rgba(255,255,255,0.72)] md:mb-5 md:px-4 md:py-2 md:text-[9px] md:tracking-[0.28em]">
              ADIM {String(step).padStart(2, '0')} / 09
            </div>
          )}

          <h1 className="font-display text-[clamp(32px,10vw,64px)] font-light leading-[1] text-ink md:text-[clamp(38px,6vw,76px)] md:leading-[0.98]">
            {title}
          </h1>

          {subtitle ? (
            <p className="mx-auto mt-3 max-w-[32ch] font-display text-[14px] italic leading-6 text-ink/50 md:mt-4 md:max-w-xl md:text-[16px] md:leading-7">
              {subtitle}
            </p>
          ) : null}
        </div>

        <div className="mx-auto mt-6 w-full max-w-[430px] overflow-visible md:mt-12 md:max-w-[1080px]">
          {children}
        </div>

        {footer ? (
          <div className="mx-auto mt-6 flex w-full max-w-[430px] items-center md:mt-8 md:max-w-[1080px]">
            {footer}
          </div>
        ) : null}
      </div>
    </section>
  )
}
