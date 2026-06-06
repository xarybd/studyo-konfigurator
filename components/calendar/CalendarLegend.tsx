export function CalendarLegend({ hasSelected }: { hasSelected: boolean }) {
  return (
    <div className="mt-3 flex flex-wrap items-center justify-center gap-3 sm:mt-5 sm:gap-4">
      <span className="flex items-center gap-1.5 font-body text-[10px] text-ink/50 sm:gap-2 sm:text-[11px]">
        <span className="inline-block h-2.5 w-2.5 rounded-full bg-gold/30 sm:h-3 sm:w-3" />
        Müsait
      </span>
      <span className="flex items-center gap-1.5 font-body text-[10px] text-ink/50 sm:gap-2 sm:text-[11px]">
        <span className="font-body text-[10px] text-ink/30 line-through sm:text-[11px]">15</span>
        Dolu
      </span>
      {hasSelected ? (
        <span className="flex items-center gap-1.5 font-body text-[10px] text-ink/50 sm:gap-2 sm:text-[11px]">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-ink sm:h-3 sm:w-3" />
          Seçili
        </span>
      ) : null}
    </div>
  )
}
