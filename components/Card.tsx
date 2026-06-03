'use client'
import { useRef } from 'react'
import { m, useMotionValue, useReducedMotion, useTransform } from 'framer-motion'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CardProps {
  title: string
  description?: string
  icon?: React.ReactNode
  selected?: boolean
  disabled?: boolean
  onClick?: () => void
  className?: string
  children?: React.ReactNode
}

export function Card({
  title,
  description,
  icon,
  selected,
  disabled,
  onClick,
  className,
  children,
}: CardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const shouldReduce = useReducedMotion()

  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotateY = useTransform(x, [-100, 100], [-5, 5])
  const rotateX = useTransform(y, [-100, 100], [5, -5])

  const isTouchDevice =
    typeof window !== 'undefined' && 'ontouchstart' in window

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (shouldReduce || isTouchDevice || !cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    x.set(e.clientX - rect.left - rect.width / 2)
    y.set(e.clientY - rect.top - rect.height / 2)
  }

  function handleMouseLeave() {
    x.set(0)
    y.set(0)
  }

  return (
    <m.div
      ref={cardRef}
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-pressed={selected}
      aria-disabled={disabled}
      onClick={!disabled ? onClick : undefined}
      onKeyDown={(e) => {
        if (!disabled && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault()
          onClick?.()
        }
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={shouldReduce || isTouchDevice ? {} : { rotateX, rotateY, transformPerspective: 1000 }}
      whileHover={
        shouldReduce || disabled
          ? {}
          : { y: -4, transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] } }
      }
      className={cn(
        'relative cursor-pointer select-none outline-none',
        'p-6 flex flex-col gap-3',
        'border transition-all duration-300',
        'rounded-[10px]',
        /* Frosted Parchment */
        'bg-[#FFFCF5]/[0.92] backdrop-blur-[4px]',
        /* Idle */
        !selected && !disabled && 'border-gold-soft/60 shadow-[0_2px_8px_rgba(42,37,32,0.06),0_8px_24px_rgba(42,37,32,0.04)]',
        /* Hover border (CSS only for non-motion devices) */
        !selected && !disabled && 'hover:border-gold hover:shadow-[0_4px_20px_rgba(184,153,104,0.18),0_8px_32px_rgba(42,37,32,0.08)]',
        /* Selected */
        selected &&
          'border-gold shadow-[0_4px_20px_rgba(184,153,104,0.22),0_8px_32px_rgba(42,37,32,0.08)] bg-gold/5',
        /* Disabled */
        disabled && 'opacity-40 cursor-not-allowed pointer-events-none',
        /* Focus ring */
        'focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2',
        className,
      )}
    >
      {/* Checkmark */}
      <span
        className={cn(
          'absolute top-3 right-3 w-5 h-5 rounded-full bg-gold flex items-center justify-center',
          'transition-opacity duration-200',
          selected ? 'opacity-100' : 'opacity-0',
        )}
      >
        <Check size={11} strokeWidth={3} className="text-cream" />
      </span>

      {icon && <div className="text-gold-dark mb-1">{icon}</div>}

      <h2 className="font-display text-xl font-normal text-ink leading-snug">{title}</h2>

      {description && (
        <p className="font-body text-sm text-ink/60 leading-relaxed">{description}</p>
      )}

      {children}
    </m.div>
  )
}
