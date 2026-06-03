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

const cardVariants = {
  rest: { y: 0 },
  hover: { y: -4 },
}

const iconVariants = {
  rest: { scale: 1 },
  hover: { scale: 1.08 },
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
  const rotateY = useTransform(x, [-100, 100], [-4, 4])
  const rotateX = useTransform(y, [-100, 100], [4, -4])

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

  const motionStyle =
    shouldReduce || isTouchDevice ? {} : { rotateX, rotateY, transformPerspective: 1000 }

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
      initial="rest"
      whileHover={shouldReduce || disabled ? 'rest' : 'hover'}
      variants={cardVariants}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      style={motionStyle}
      className={cn(
        'relative cursor-pointer select-none outline-none',
        'px-6 py-7 flex flex-col gap-3',
        'border transition-all duration-300',
        'rounded-[10px]',
        'bg-[#FFFCF5]/[0.92] backdrop-blur-[4px]',
        !selected && !disabled && [
          'border-gold-soft/60',
          'shadow-[0_1px_2px_rgba(42,37,32,0.04),0_4px_12px_rgba(154,126,79,0.08)]',
          'hover:border-gold',
          'hover:shadow-[0_12px_40px_rgba(154,126,79,0.14),0_4px_16px_rgba(42,37,32,0.06)]',
        ],
        selected && [
          'border-gold',
          'shadow-[0_4px_20px_rgba(184,153,104,0.22),0_8px_32px_rgba(42,37,32,0.08)]',
          'bg-gold/5',
        ],
        disabled && 'opacity-40 cursor-not-allowed pointer-events-none',
        'focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2',
        className,
      )}
    >
      <span
        className={cn(
          'absolute top-3 right-3 w-[18px] h-[18px] rounded-full bg-gold',
          'flex items-center justify-center',
          'transition-opacity duration-200',
          selected ? 'opacity-100' : 'opacity-0',
        )}
      >
        <Check size={10} strokeWidth={3} className="text-cream" />
      </span>

      {icon && (
        <m.div
          className="text-gold-dark mb-1"
          variants={iconVariants}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        >
          {icon}
        </m.div>
      )}

      <h2 className="font-display text-xl font-normal text-ink leading-snug">{title}</h2>

      {description && (
        <p className="font-body text-sm text-ink/60 leading-relaxed">{description}</p>
      )}

      {children}
    </m.div>
  )
}
