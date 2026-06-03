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
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: 'easeInOut' }}
        >
          {children}
        </m.div>
      </AnimatePresence>
    </LazyMotion>
  )
}
