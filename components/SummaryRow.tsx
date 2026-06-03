interface SummaryRowProps {
  label: string
  value: string
}

export function SummaryRow({ label, value }: SummaryRowProps) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-gold-soft/30">
      <span className="font-body text-sm text-ink/60 tracking-widest uppercase text-[11px]">
        {label}
      </span>
      <span className="font-display text-base font-medium text-ink">{value}</span>
    </div>
  )
}
