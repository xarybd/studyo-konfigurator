interface SummaryRowProps {
  label: string
  value: string
}

export function SummaryRow({ label, value }: SummaryRowProps) {
  return (
    <div className="flex items-start justify-between gap-3 rounded-[14px] border border-gold/10 bg-cream/26 px-3 py-2.5 md:gap-4 md:px-4 md:py-3">
      <span className="shrink-0 pt-0.5 font-body text-[8px] uppercase tracking-[0.16em] text-gold-dark/62 md:text-[9px] md:tracking-[0.24em]">
        {label}
      </span>
      <span className="min-w-0 break-words text-right font-display text-[14px] italic leading-[1.35] text-ink/82 md:text-[15px] md:leading-[1.3]">
        {value}
      </span>
    </div>
  )
}
