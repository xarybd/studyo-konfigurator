'use client'

import { AnimatePresence, LazyMotion, domAnimation, m, useReducedMotion } from 'framer-motion'
import { useSelectedLayoutSegment } from 'next/navigation'

interface PageTransitionProps {
  children: React.ReactNode
  className?: string
}

export function PageTransition({ children, className }: PageTransitionProps) {
  const segment = useSelectedLayoutSegment()
  const shouldReduce = useReducedMotion()

  return (
    <LazyMotion features={domAnimation}>
      <AnimatePresence mode="wait">
        <m.div
          key={segment ?? 'root'}
          className={className}
          initial={shouldReduce ? { opacity: 0 } : { opacity: 0, y: 14, scale: 0.992, filter: 'blur(8px)' }}
          animate={
            shouldReduce
              ? { opacity: 1, transition: { duration: 0.24 } }
              : {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  filter: 'blur(0px)',
                  transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
                }
          }
          exit={
            shouldReduce
              ? { opacity: 0, transition: { duration: 0.16 } }
              : {
                  opacity: 0,
                  y: -10,
                  scale: 0.996,
                  filter: 'blur(6px)',
                  transition: { duration: 0.22, ease: [0.4, 0, 1, 1] },
                }
          }
        >
          {children}
        </m.div>
      </AnimatePresence>
    </LazyMotion>
  )
}
