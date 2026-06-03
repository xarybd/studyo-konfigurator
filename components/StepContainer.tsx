import { ProgressBar } from '@/components/ProgressBar'
import { studioConfig } from '@/studio.config'

interface StepContainerProps {
  step: number
  title: React.ReactNode
  subtitle?: string
  children: React.ReactNode
  footer?: React.ReactNode
  hasPriceBar?: boolean
}

export function StepContainer({
  step,
  title,
  subtitle,
  children,
  footer,
  hasPriceBar,
}: StepContainerProps) {
  return (
    <section className="min-h-screen flex flex-col">
      <header className="px-6 pt-6 pb-4 md:px-12">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="font-body text-[10px] tracking-[0.25em] uppercase text-ink/40">
              {studioConfig.name}
            </p>
            <p className="font-body text-[10px] tracking-[0.2em] uppercase text-gold-soft">
              {studioConfig.tagline}
            </p>
          </div>
        </div>
        <ProgressBar current={step} />
        <h1 className="font-display text-4xl md:text-5xl font-light text-ink mt-8 leading-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="font-body text-base text-ink/60 mt-3 max-w-prose leading-relaxed">
            {subtitle}
          </p>
        )}
      </header>

      <main className={`flex-1 px-6 md:px-12 ${hasPriceBar ? 'pb-24' : 'pb-16'}`}>
        {children}
      </main>

      {footer && (
        <footer className="px-6 pb-8 md:px-12">{footer}</footer>
      )}
    </section>
  )
}
