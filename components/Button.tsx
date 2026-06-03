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
        'font-body font-medium text-sm',
        'min-h-[44px] min-w-[44px]',
        'transition-colors duration-200',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2',
        'disabled:opacity-60 disabled:cursor-not-allowed',
        variant === 'primary' && 'bg-gold text-cream px-8 py-3.5 rounded-md hover:bg-gold-dark',
        variant === 'ghost' && 'text-ink/60 hover:text-ink px-0 py-0 min-w-0',
        variant === 'outline' && 'border border-gold text-ink px-6 py-3 rounded-md hover:bg-gold/5',
        variant === 'whatsapp' && [
          'bg-gradient-to-br from-gold to-gold-dark text-cream',
          'px-8 py-3.5 rounded-md w-full md:w-auto',
          'uppercase tracking-[0.18em] text-[13px]',
          'hover:brightness-105 hover:shadow-md',
        ],
        className,
      )}
      {...props}
    >
      {children}
    </Comp>
  )
}
