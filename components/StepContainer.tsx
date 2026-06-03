import { ProgressBar } from '@/components/ProgressBar'

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
    <section className="flex flex-col">
      <header className="px-6 pt-4 pb-6 md:px-12">
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
