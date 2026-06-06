'use client'

import type { ButtonHTMLAttributes } from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cn } from '@/lib/utils'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'outline' | 'whatsapp'
  asChild?: boolean
}

export function Button({
  variant = 'primary',
  className,
  asChild,
  children,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : 'button'

  return (
    <Comp
      className={cn(
        'inline-flex min-h-11 min-w-11 cursor-pointer items-center justify-center gap-2 rounded-full font-body text-sm transition duration-300 md:min-h-12 md:min-w-12',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-cream',
        'disabled:cursor-not-allowed disabled:opacity-55',
        variant === 'primary' && [
          'min-w-[136px] px-7 py-3.5 text-[10px] font-medium uppercase tracking-[0.16em] text-cream shadow-[0_16px_34px_rgba(42,37,32,0.18)] md:min-w-[158px] md:px-10 md:py-4 md:text-[11px] md:tracking-[0.22em]',
          'hover:-translate-y-0.5 hover:shadow-[0_22px_44px_rgba(42,37,32,0.2)]',
          '[&>svg:last-child]:transition-transform [&>svg:last-child]:duration-300 hover:[&>svg:last-child]:translate-x-0.5',
        ],
        variant === 'ghost' && [
          'min-w-[96px] px-3.5 py-2.5 text-[10px] font-medium uppercase tracking-[0.14em] text-ink/52 md:min-w-[118px] md:px-4 md:py-3 md:text-[11px] md:tracking-[0.16em]',
          'hover:bg-cream/55 hover:text-ink/76',
        ],
        variant === 'outline' && [
          'border border-gold/34 bg-cream/42 px-5 py-3 text-[10px] uppercase tracking-[0.16em] text-ink backdrop-blur-md md:px-7 md:text-[11px] md:tracking-[0.2em]',
          'hover:-translate-y-0.5 hover:border-gold/60 hover:bg-cream/70',
        ],
        variant === 'whatsapp' && [
          'w-full px-8 py-3.5 text-[11px] font-medium uppercase tracking-[0.2em] text-cream shadow-[0_16px_34px_rgba(154,126,79,0.22)]',
          'hover:-translate-y-0.5 hover:shadow-[0_22px_44px_rgba(154,126,79,0.24)]',
        ],
        className,
      )}
      style={
        variant === 'primary'
          ? { background: 'linear-gradient(135deg, #2A2520, #4A3D2A)' }
          : variant === 'whatsapp'
            ? { background: 'linear-gradient(135deg, #B89968, #9A7E4F)' }
            : undefined
      }
      {...props}
    >
      {children}
    </Comp>
  )
}
