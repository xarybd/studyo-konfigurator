interface SummaryRowProps {
  label: string
  value: string
}

export function SummaryRow({ label, value }: SummaryRowProps) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-b border-gold/15 py-3 md:gap-4 md:py-[13px]">
      <span className="shrink-0 font-body text-[8px] uppercase tracking-[0.2em] text-gold-dark/65 md:text-[9px] md:tracking-[0.26em]">
        {label}
      </span>
      <span className="min-w-0 break-words text-right font-display text-[14px] italic leading-[1.35] text-ink md:text-[15px] md:leading-[1.3]">
        {value}
      </span>
    </div>
  )
}
