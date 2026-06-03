import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: number): string {
  return value.toLocaleString('tr-TR') + ' ₺'
}

export function roundToNearest(value: number, nearest: number): number {
  return Math.round(value / nearest) * nearest
}
