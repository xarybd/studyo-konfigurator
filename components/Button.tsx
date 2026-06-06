'use client'
import { cn } from '@/lib/utils'
import { Slot } from '@radix-ui/react-slot'
import type { ButtonHTMLAttributes } from 'react'

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
        'inline-flex items-center justify-center gap-2 cursor-pointer',
        'font-body text-sm',
        'min-h-[44px] min-w-[44px]',
        'transition-all duration-200',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2',
        'disabled:opacity-60 disabled:cursor-not-allowed',
        variant === 'primary' && [
          'text-cream rounded-full px-10 py-[14px]',
          'text-[12px] tracking-[0.28em] uppercase font-medium',
          'hover:-translate-y-0.5 hover:brightness-110',
          '[&>svg:last-child]:transition-transform [&>svg:last-child]:duration-200',
          'hover:[&>svg:last-child]:translate-x-0.5',
        ],
        variant === 'ghost' && 'text-ink/50 hover:text-ink px-0 py-0 min-w-0 font-medium',
        variant === 'outline' && [
          'border border-gold text-ink px-8 py-3 rounded-full',
          'text-[12px] tracking-[0.2em] uppercase',
          'hover:bg-gold/5',
        ],
        variant === 'whatsapp' && [
          'text-cream rounded-full w-full',
          'px-8 py-[14px]',
          'text-[12px] tracking-[0.22em] uppercase font-medium',
          'hover:-translate-y-0.5 hover:brightness-105',
        ],
        className,
      )}
      style={
        variant === 'primary'
          ? { background: 'linear-gradient(135deg, #2A2520, #4A3D2A)', boxShadow: '0 8px 24px rgba(42,37,32,0.18)' }
          : variant === 'whatsapp'
            ? { background: 'linear-gradient(135deg, #B89968, #9A7E4F)', boxShadow: '0 6px 20px rgba(154,126,79,0.22)' }
            : undefined
      }
      {...props}
    >
      {children}
    </Comp>
  )
}
