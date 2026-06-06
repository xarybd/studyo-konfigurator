'use client'

import { cn } from '@/lib/utils'

interface BackgroundGradientAnimationProps {
  className?: string
  children?: React.ReactNode
}

export function BackgroundGradientAnimation({ className, children }: BackgroundGradientAnimationProps) {
  return (
    <div className={cn('gradient-map relative overflow-hidden', className)}>
      <div className="gradient-map-orb gradient-map-orb-one" />
      <div className="gradient-map-orb gradient-map-orb-two" />
      <div className="gradient-map-orb gradient-map-orb-three" />
      <div className="gradient-map-orb gradient-map-orb-four" />
      <div className="relative z-10">{children}</div>
    </div>
  )
}
