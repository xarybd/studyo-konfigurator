'use client'
import { m, LazyMotion, domAnimation, useReducedMotion } from 'framer-motion'
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
  const shouldReduce = useReducedMotion()

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: shouldReduce ? 0 : 0.08, delayChildren: 0.05 } },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: shouldReduce ? 0 : 12 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
    },
  }

  return (
    <LazyMotion features={domAnimation}>
      <section className={`min-h-[calc(100dvh-60px)] flex flex-col ${hasPriceBar ? 'pb-24' : ''}`}>
        <m.div
          className="w-full max-w-[1100px] mx-auto px-6 md:px-12 pt-3 pb-2"
          variants={itemVariants}
          initial="hidden"
          animate="visible"
        >
          <ProgressBar current={step} />
        </m.div>

        <m.div
          className="flex-1 flex flex-col justify-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="w-full max-w-[1100px] mx-auto px-6 md:px-12 py-8 md:py-10">
            <m.h1
              variants={itemVariants}
              className="font-display font-light text-ink leading-[1.05]"
              style={{ fontSize: 'clamp(36px, 8vw, 72px)' }}
            >
              {title}
            </m.h1>

            {subtitle && (
              <m.p
                variants={itemVariants}
                className="font-body text-[#8A7F70] mt-4 max-w-[540px] leading-relaxed"
                style={{ fontSize: 'clamp(15px, 2vw, 18px)' }}
              >
                {subtitle}
              </m.p>
            )}

            <m.div variants={itemVariants} className="mt-10 md:mt-12">
              {children}
            </m.div>
          </div>
        </m.div>

        {footer && (
          <m.div
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            className="w-full max-w-[1100px] mx-auto px-6 md:px-12 pb-8"
          >
            {footer}
          </m.div>
        )}
      </section>
    </LazyMotion>
  )
}
