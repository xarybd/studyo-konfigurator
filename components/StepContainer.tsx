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
        'flex-1 flex flex-col items-center justify-center px-5 md:px-12',
        'py-8',
        hasPriceBar && 'pb-24',
      )}
    >
      <div className="w-full max-w-5xl text-center">
        {step > 0 && (
          <p className="font-body text-[11px] tracking-[0.32em] uppercase text-gold mb-6">
            ADIM {String(step).padStart(2, '0')} / 09
          </p>
        )}

        <h1
          className="font-display font-light text-ink"
          style={{ fontSize: 'clamp(40px, 6vw, 72px)', lineHeight: '1.0' }}
        >
          {title}
        </h1>

        {subtitle && (
          <p
            className="font-display italic text-ink/50 mx-auto max-w-lg mt-4"
            style={{ fontSize: '16px', lineHeight: '1.6' }}
          >
            {subtitle}
          </p>
        )}

        <div className={cn('mt-14', !subtitle && 'mt-14')}>
          {children}
        </div>

        {footer && (
          <div className="mt-8">
            {footer}
          </div>
        )}
      </div>
    </section>
  )
}
