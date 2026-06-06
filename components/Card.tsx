'use client'

import { Check } from 'lucide-react'
import { m, useMotionValue, useReducedMotion, useSpring } from 'framer-motion'
import { useState } from 'react'
import { cn } from '@/lib/utils'

interface CardProps {
  title: string
  description?: string
  priceNote?: string
  icon?: React.ReactNode
  visual?: React.ReactNode
  selected?: boolean
  disabled?: boolean
  onClick?: () => void
  className?: string
  children?: React.ReactNode
}

const cardVariants = {
  rest: { y: 0 },
  hover: { y: -7 },
}

const iconVariants = {
  rest: { scale: 1, rotate: 0 },
  hover: { scale: 1.08, rotate: -2 },
}

export function Card({
  title,
  description,
  priceNote,
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
  const springX = useSpring(rotX, { stiffness: 150, damping: 30 })
  const springY = useSpring(rotY, { stiffness: 150, damping: 30 })

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (shouldReduce || disabled) return

    const rect = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5

    rotX.set(-y * 5)
    rotY.set(x * 5)
  }

  function handleHoverEnd() {
    rotX.set(0)
    rotY.set(0)
    setHovered(false)
  }

  function handleClick(e: React.MouseEvent<HTMLDivElement>) {
    if (disabled) return

    const rect = e.currentTarget.getBoundingClientRect()
    setRipple({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      key: Date.now(),
    })
    window.setTimeout(() => setRipple(null), 620)
    onClick?.()
  }

  const background = selected
    ? 'linear-gradient(145deg, rgba(255,252,245,0.88), rgba(232,216,184,0.48) 58%, rgba(247,241,230,0.72))'
    : hovered
      ? 'linear-gradient(145deg, rgba(255,252,245,0.78), rgba(232,216,184,0.34) 54%, rgba(247,241,230,0.58))'
      : 'linear-gradient(145deg, rgba(255,252,245,0.62), rgba(247,241,230,0.42))'

  const border = selected
    ? '1px solid rgba(154,126,79,0.76)'
    : hovered
      ? '1px solid rgba(184,153,104,0.46)'
      : '1px solid rgba(184,153,104,0.22)'

  const shadow = hovered || selected
    ? '0 32px 90px rgba(42,37,32,0.13), 0 0 0 1px rgba(255,255,255,0.42) inset, inset 0 1px 0 rgba(255,255,255,0.78)'
    : '0 18px 56px rgba(42,37,32,0.075), 0 0 0 1px rgba(255,255,255,0.28) inset, inset 0 1px 0 rgba(255,255,255,0.64)'

  return (
    <m.div
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-pressed={selected}
      aria-disabled={disabled}
      initial="rest"
      animate="rest"
      whileHover={shouldReduce || disabled ? 'rest' : 'hover'}
      whileTap={shouldReduce || disabled ? {} : { scale: 0.992 }}
      variants={cardVariants}
      transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
      onHoverStart={() => !disabled && setHovered(true)}
      onHoverEnd={handleHoverEnd}
      onMouseMove={handleMouseMove}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (disabled) return
        if (e.key !== 'Enter' && e.key !== ' ') return

        e.preventDefault()
        onClick?.()
      }}
      style={{
        background,
        border,
        boxShadow: shadow,
        backdropFilter: hovered ? 'blur(24px) saturate(150%)' : 'blur(18px) saturate(140%)',
        WebkitBackdropFilter: hovered ? 'blur(24px) saturate(150%)' : 'blur(18px) saturate(140%)',
        opacity: disabled ? 0.42 : 1,
        transformPerspective: 1000,
        rotateX: shouldReduce ? 0 : springX,
        rotateY: shouldReduce ? 0 : springY,
      }}
      className={cn(
        'panel-shine relative flex min-h-[142px] cursor-pointer select-none flex-col overflow-hidden rounded-[18px] p-4 outline-none transition-[background,border,box-shadow,opacity] duration-300 sm:min-h-[168px] sm:p-5 md:min-h-[236px] md:rounded-[14px] md:p-8',
        'focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-cream',
        disabled && 'pointer-events-none',
        className,
      )}
    >
      <span
        className={cn(
          'absolute right-3 top-3 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-gold text-cream shadow-[0_8px_20px_rgba(154,126,79,0.24)] transition duration-200 md:right-4 md:top-4 md:h-6 md:w-6',
          selected ? 'scale-100 opacity-100' : 'scale-75 opacity-0',
        )}
      >
        <Check size={12} strokeWidth={2.5} />
      </span>

      {ripple ? (
        <m.span
          key={ripple.key}
          initial={{ scale: 0, opacity: 0.36 }}
          animate={{ scale: 5, opacity: 0 }}
          transition={{ duration: 0.62, ease: 'easeOut' }}
          style={{
            position: 'absolute',
            left: ripple.x - 20,
            top: ripple.y - 20,
            width: 40,
            height: 40,
            borderRadius: 9999,
            background: 'rgba(184,153,104,0.34)',
            pointerEvents: 'none',
            zIndex: 20,
          }}
        />
      ) : null}

      {visual ? (
        <div className="-mx-4 -mt-4 mb-4 overflow-hidden rounded-t-[18px] sm:-mx-5 sm:-mt-5 md:-mx-7 md:-mt-7 md:rounded-t-[14px]">
          {visual}
        </div>
      ) : null}

      <div className="flex flex-1 flex-col">
        {icon ? (
          <m.div
            variants={iconVariants}
            transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            className="mb-4 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-gold/24 bg-cream/54 text-gold-dark shadow-[0_14px_32px_rgba(154,126,79,0.12),inset_0_1px_0_rgba(255,255,255,0.72)] md:mb-6 md:h-14 md:w-14 [&>svg]:h-6 [&>svg]:w-6 md:[&>svg]:h-8 md:[&>svg]:w-8"
          >
            {icon}
          </m.div>
        ) : null}

        <h2 className="break-words font-display text-[20px] font-normal leading-tight text-ink md:text-[25px]">
          {title}
        </h2>

        {description ? (
          <p className="mt-2 max-w-full font-body text-[12px] italic leading-5 text-ink/56 md:mt-3 md:max-w-[28ch] md:text-[13px] md:leading-6">
            {description}
          </p>
        ) : null}

        {priceNote ? (
          <div className="mt-auto pt-4 md:pt-6">
            <div className="inline-flex max-w-full flex-wrap justify-center rounded-full border border-gold/20 bg-cream/58 px-2.5 py-1.5 text-center font-body text-[9px] font-medium uppercase leading-4 tracking-[0.08em] text-gold-dark shadow-[inset_0_1px_0_rgba(255,255,255,0.72)] md:px-3 md:py-2 md:text-[10px] md:tracking-[0.12em]">
              {priceNote}
            </div>
          </div>
        ) : null}

        {children ? <div className="mt-4 md:mt-5">{children}</div> : null}
      </div>
    </m.div>
  )
}
