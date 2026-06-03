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
        'font-body font-medium text-[13px]',
        'min-h-[44px] min-w-[44px]',
        'transition-all duration-200',
        'rounded-full',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2',
        'disabled:opacity-60 disabled:cursor-not-allowed',

        variant === 'primary' && [
          'bg-gold text-cream',
          'px-8 py-[14px]',
          'hover:bg-gold-dark hover:-translate-y-0.5',
          'hover:shadow-[0_6px_20px_rgba(154,126,79,0.35)]',
        ],

        variant === 'ghost' && [
          'text-[#4A413A] border border-[rgba(184,153,104,0.35)]',
          'px-6 py-3',
          'hover:bg-[rgba(184,153,104,0.1)] hover:border-[rgba(184,153,104,0.65)]',
          'min-w-0',
        ],

        variant === 'outline' && [
          'border border-[rgba(184,153,104,0.4)] text-[#4A413A]',
          'px-7 py-3',
          'hover:bg-[rgba(184,153,104,0.1)] hover:border-[rgba(184,153,104,0.65)]',
        ],

        variant === 'whatsapp' && [
          'bg-gradient-to-br from-[#B89968] to-[#9A7E4F]',
          'text-cream',
          'px-9 py-[16px]',
          'w-full md:w-auto',
          'uppercase tracking-[0.24em] text-[13px]',
          'shadow-[0_4px_16px_rgba(154,126,79,0.3)]',
          'hover:-translate-y-[2px]',
          'hover:shadow-[0_8px_28px_rgba(154,126,79,0.42)]',
          'hover:brightness-[1.05]',
        ],

        className,
      )}
      {...props}
    >
      {children}
    </Comp>
  )
}
