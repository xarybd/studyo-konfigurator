'use client'
import { m, useReducedMotion, useMotionValue, useSpring } from 'framer-motion'
import { useState } from 'react'
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

const cardVariants = {
  rest:  { y: 0 },
  hover: { y: -6 },
}

const iconVariants = {
  rest:  { scale: 1 },
  hover: { scale: 1.06 },
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
  const [hovered, setHovered] = useState(false)
  const [ripple, setRipple] = useState<{ x: number; y: number; key: number } | null>(null)

  const rotX = useMotionValue(0)
  const rotY = useMotionValue(0)
  const springX = useSpring(rotX, { stiffness: 160, damping: 28 })
  const springY = useSpring(rotY, { stiffness: 160, damping: 28 })

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (shouldReduce || disabled) return
    const rect = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    rotX.set(-y * 8)
    rotY.set(x * 8)
  }

  function handleHoverEnd() {
    rotX.set(0)
    rotY.set(0)
    setHovered(false)
  }

  function handleClick(e: React.MouseEvent<HTMLDivElement>) {
    if (disabled) return
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    setRipple({ x, y, key: Date.now() })
    setTimeout(() => setRipple(null), 650)
    onClick?.()
  }

  const bg = selected
    ? 'rgba(255,252,245,0.65)'
    : hovered
      ? 'rgba(255,252,245,0.60)'
      : 'rgba(255,252,245,0.45)'
  const backdropBlur = hovered ? 'blur(24px) saturate(150%)' : 'blur(20px) saturate(140%)'
  const border = selected
    ? '1.5px solid rgba(184,153,104,0.75)'
    : hovered
      ? '1px solid rgba(184,153,104,0.45)'
      : '1px solid rgba(184,153,104,0.22)'
  const shadow = hovered
    ? '0 4px 16px rgba(42,37,32,0.04), 0 20px 60px rgba(154,126,79,0.14), inset 0 1px 0 rgba(255,255,255,0.55)'
    : '0 4px 16px rgba(42,37,32,0.04), 0 16px 48px rgba(154,126,79,0.08), inset 0 1px 0 rgba(255,255,255,0.55)'

  return (
    <m.div
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-pressed={selected}
      aria-disabled={disabled}
      initial="rest"
      animate="rest"
      whileHover={shouldReduce || disabled ? 'rest' : 'hover'}
      whileTap={shouldReduce || disabled ? {} : { scale: 1.02 }}
      variants={cardVariants}
      transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
      onHoverStart={() => !disabled && setHovered(true)}
      onHoverEnd={handleHoverEnd}
      onMouseMove={handleMouseMove}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (!disabled && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault()
          onClick?.()
        }
      }}
      style={{
        background: bg,
        backdropFilter: backdropBlur,
        WebkitBackdropFilter: backdropBlur,
        border,
        borderRadius: '16px',
        padding: '32px 24px',
        boxShadow: shadow,
        minHeight: '240px',
        transition: 'background 350ms cubic-bezier(0.4,0,0.2,1), border 350ms cubic-bezier(0.4,0,0.2,1), box-shadow 350ms cubic-bezier(0.4,0,0.2,1)',
        opacity: disabled ? 0.4 : 1,
        transformPerspective: 1000,
        rotateX: shouldReduce ? 0 : springX,
        rotateY: shouldReduce ? 0 : springY,
      }}
      className={cn(
        'relative cursor-pointer select-none outline-none overflow-hidden',
        'flex flex-col gap-4',
        disabled && 'pointer-events-none',
        'focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2',
        className,
      )}
    >
      {/* Check badge */}
      <span
        className={cn(
          'absolute top-4 right-4 z-10 w-[22px] h-[22px] rounded-full bg-gold',
          'flex items-center justify-center',
          'transition-opacity duration-200',
          selected ? 'opacity-100' : 'opacity-0',
        )}
      >
        <Check size={11} strokeWidth={2.5} className="text-cream" />
      </span>

      {/* Ripple */}
      {ripple && (
        <m.span
          key={ripple.key}
          initial={{ scale: 0, opacity: 0.5 }}
          animate={{ scale: 4.5, opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          style={{
            position: 'absolute',
            left: ripple.x - 20,
            top: ripple.y - 20,
            width: 40,
            height: 40,
            borderRadius: '50%',
            background: 'rgba(184,153,104,0.35)',
            pointerEvents: 'none',
            zIndex: 20,
          }}
        />
      )}

      {visual && (
        <div className="overflow-hidden -mx-6 -mt-8 rounded-t-[16px]">{visual}</div>
      )}

      {icon && (
        <m.div
          variants={iconVariants}
          transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
          className="text-gold-dark"
        >
          {icon}
        </m.div>
      )}

      <h2 className="font-display text-[22px] font-normal text-ink leading-snug">{title}</h2>

      {description && (
        <p className="font-body text-[13px] italic text-ink/55 leading-relaxed">{description}</p>
      )}

      {children}
    </m.div>
  )
}
