'use client'
import { useContext, useRef } from 'react'
import { AnimatePresence, LazyMotion, domAnimation, m } from 'framer-motion'
import { useSelectedLayoutSegment } from 'next/navigation'
import { LayoutRouterContext } from 'next/dist/shared/lib/app-router-context.shared-runtime'

function usePreviousValue<T>(value: T): T {
  const prevRef = useRef(value)
  const curRef = useRef(value)
  if (curRef.current !== value) {
    prevRef.current = curRef.current
    curRef.current = value
  }
  return prevRef.current
}

function FrozenRouter({ children }: { children: React.ReactNode }) {
  const context = useContext(LayoutRouterContext)
  const segment = useSelectedLayoutSegment()
  const prevSegment = usePreviousValue(segment)
  const isFrozen = segment !== prevSegment
  return (
    <LayoutRouterContext.Provider value={isFrozen ? context : context}>
      {children}
    </LayoutRouterContext.Provider>
  )
}

export function PageTransition({ children }: { children: React.ReactNode }) {
  const segment = useSelectedLayoutSegment()

  return (
    <LazyMotion features={domAnimation}>
      <AnimatePresence mode="wait">
        <m.div
          key={segment ?? 'root'}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        >
          <FrozenRouter>{children}</FrozenRouter>
        </m.div>
      </AnimatePresence>
    </LazyMotion>
  )
}
