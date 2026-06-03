'use client'
import { m, useReducedMotion } from 'framer-motion'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CardProps {
  title: string
  description?: string
  icon?: React.ReactNode
  visual?: React.ReactNode
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
  visual,
  selected,
  disabled,
  onClick,
  className,
  children,
}: CardProps) {
  const shouldReduce = useReducedMotion()

  return (
    <m.div
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
      whileHover={shouldReduce || disabled ? {} : { y: -4 }}
      transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
      className={cn(
        'relative cursor-pointer select-none outline-none overflow-hidden',
        'flex flex-col rounded-lg',
        'bg-cream border transition-all duration-200',
        !selected && !disabled && 'border-gold-soft/50 hover:border-gold hover:shadow-md',
        selected && 'border-gold shadow-md bg-gold/5',
        disabled && 'opacity-40 cursor-not-allowed pointer-events-none',
        'focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2',
        className,
      )}
    >
      <span
        className={cn(
          'absolute top-3 right-3 z-10 w-5 h-5 rounded-full bg-gold',
          'flex items-center justify-center transition-opacity duration-200',
          selected ? 'opacity-100' : 'opacity-0',
        )}
      >
        <Check size={10} strokeWidth={3} className="text-cream" />
      </span>

      {visual && <div className="w-full overflow-hidden">{visual}</div>}

      <div className="px-5 py-4 flex flex-col gap-2">
        {icon && <div className="text-gold-dark mb-1">{icon}</div>}
        <h2 className="font-display text-xl font-normal text-ink leading-snug">{title}</h2>
        {description && (
          <p className="font-body text-sm text-ink/60 leading-relaxed">{description}</p>
        )}
        {children}
      </div>
    </m.div>
  )
}
