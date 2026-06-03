'use client'
import { useRef } from 'react'
import { m, useMotionValue, useReducedMotion, useTransform } from 'framer-motion'
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

const shadowRest = '0 8px 32px rgba(42,37,32,0.08), 0 24px 48px rgba(154,126,79,0.06), inset 0 1px 0 rgba(255,255,255,0.55)'
const shadowHover = '0 20px 60px rgba(42,37,32,0.13), 0 40px 80px rgba(154,126,79,0.11), inset 0 1px 0 rgba(255,255,255,0.75)'
const shadowSelected = '0 12px 40px rgba(42,37,32,0.1), 0 32px 64px rgba(154,126,79,0.12), inset 0 1px 0 rgba(255,255,255,0.65)'

const cardVariants = {
  rest: { y: 0, boxShadow: shadowRest },
  hover: { y: -8, boxShadow: shadowHover },
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
  const cardRef = useRef<HTMLDivElement>(null)
  const shouldReduce = useReducedMotion()

  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotateY = useTransform(x, [-150, 150], [-6, 6])
  const rotateX = useTransform(y, [-150, 150], [6, -6])

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
    shouldReduce || isTouchDevice
      ? {}
      : { rotateX, rotateY, transformPerspective: 1200 }

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
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      style={{
        ...motionStyle,
        boxShadow: selected ? shadowSelected : undefined,
      }}
      className={cn(
        'relative cursor-pointer select-none outline-none overflow-hidden',
        'flex flex-col',
        'rounded-[20px]',
        'backdrop-blur-[12px] md:backdrop-blur-[20px] backdrop-saturate-[1.3]',
        'transition-[background-color,border-color] duration-300',
        !selected && !disabled && [
          'bg-[rgba(255,252,245,0.45)]',
          'border border-[rgba(184,153,104,0.28)]',
          'hover:bg-[rgba(255,252,245,0.65)]',
          'hover:border-[rgba(184,153,104,0.6)]',
        ],
        selected && [
          'bg-[rgba(255,252,245,0.72)]',
          'border-[1.5px] border-[rgba(184,153,104,0.82)]',
        ],
        disabled && 'opacity-40 cursor-not-allowed pointer-events-none',
        'focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2',
        className,
      )}
    >
      {/* Inner top edge highlight */}
      <div
        className="absolute inset-x-0 top-0 h-px pointer-events-none"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.65) 40%, rgba(255,255,255,0.65) 60%, transparent)' }}
      />

      {/* Radial gold glow on hover */}
      <m.div
        className="absolute inset-0 rounded-[20px] pointer-events-none"
        variants={{
          rest: { opacity: 0 },
          hover: { opacity: 1 },
        }}
        transition={{ duration: 0.4 }}
        style={{ background: 'radial-gradient(circle at 50% 60%, rgba(184,153,104,0.14) 0%, transparent 70%)' }}
      />

      {/* Selected glow */}
      {selected && (
        <div
          className="absolute inset-0 rounded-[20px] pointer-events-none"
          style={{ background: 'radial-gradient(circle at 50% 60%, rgba(184,153,104,0.12) 0%, transparent 70%)' }}
        />
      )}

      {/* Check badge */}
      <span
        className={cn(
          'absolute top-3 right-3 z-10',
          'w-6 h-6 rounded-full bg-gold',
          'flex items-center justify-center',
          'transition-opacity duration-200',
          selected ? 'opacity-100' : 'opacity-0',
        )}
      >
        <Check size={12} strokeWidth={3} className="text-cream" />
      </span>

      {/* Visual area */}
      {visual && (
        <m.div
          className="w-full overflow-hidden"
          variants={{ rest: { scale: 1 }, hover: { scale: 1.04 } }}
          transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
        >
          {visual}
        </m.div>
      )}

      {/* Content */}
      <div className="px-5 py-5 flex flex-col gap-2">
        {icon && (
          <m.div
            className="text-gold-dark mb-1"
            variants={{ rest: { scale: 1 }, hover: { scale: 1.08 } }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
          >
            {icon}
          </m.div>
        )}

        <h2 className="font-display text-[20px] font-normal text-ink leading-snug">{title}</h2>

        {description && (
          <p className="font-body text-[13px] text-[#8A7F70] leading-relaxed">{description}</p>
        )}

        {children}
      </div>
    </m.div>
  )
}
