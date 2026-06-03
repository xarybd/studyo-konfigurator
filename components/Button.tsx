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
        'min-h-[44px] min-w-[44px] px-8 py-3.5',
        'transition-colors duration-200',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2',
        'disabled:opacity-60 disabled:cursor-not-allowed',
        variant === 'primary' && 'bg-gold text-cream hover:bg-gold-dark',
        variant === 'ghost' && 'text-ink/60 hover:text-ink px-0 py-0 min-w-0',
        variant === 'outline' &&
          'border border-gold text-ink hover:bg-gold/5 px-6',
        variant === 'whatsapp' && [
          'bg-gradient-to-br from-[#B89968] to-[#9A7E4F]',
          'text-cream',
          'w-full md:w-auto',
          'uppercase tracking-[0.18em] text-[14px]',
          'hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(154,126,79,0.3)]',
          'transition-[transform,box-shadow,background] duration-200',
        ],
        className,
      )}
      {...props}
    >
      {children}
    </Comp>
  )
}
