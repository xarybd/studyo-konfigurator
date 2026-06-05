'use client'
import { AnimatePresence, LazyMotion, domAnimation, m } from 'framer-motion'
import { useSelectedLayoutSegment } from 'next/navigation'

interface PageTransitionProps {
  children: React.ReactNode
  className?: string
}

export function PageTransition({ children, className }: PageTransitionProps) {
  const segment = useSelectedLayoutSegment()

  return (
    <LazyMotion features={domAnimation}>
      <AnimatePresence mode="wait">
        <m.div
          key={segment ?? 'root'}
          className={className}
          initial={{ opacity: 0, y: 8 }}
          animate={{
            opacity: 1,
            y: 0,
            transition: {
              duration: 0.42,
              ease: [0.16, 1, 0.3, 1],
            },
          }}
          exit={{
            opacity: 0,
            y: -6,
            transition: {
              duration: 0.22,
              ease: [0.4, 0, 1, 1],
            },
          }}
        >
          {children}
        </m.div>
      </AnimatePresence>
    </LazyMotion>
  )
}
