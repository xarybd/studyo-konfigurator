'use client'

const FRAMES = [
  { label: 'Hazırlık', angle: '0deg', color: 'rgba(42,37,32,0.88)' },
  { label: 'İlk bakış', angle: '51deg', color: 'rgba(184,153,104,0.78)' },
  { label: 'Seremoni', angle: '102deg', color: 'rgba(247,241,230,0.82)' },
  { label: 'Portre', angle: '153deg', color: 'rgba(154,126,79,0.76)' },
  { label: 'Kutlama', angle: '204deg', color: 'rgba(74,61,42,0.82)' },
  { label: 'Detay', angle: '255deg', color: 'rgba(232,216,184,0.76)' },
  { label: 'Final', angle: '306deg', color: 'rgba(184,153,104,0.72)' },
] as const

export function HeroPhotoReel() {
  return (
    <div className="pointer-events-none absolute inset-0 hidden overflow-hidden md:block">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_48%,rgba(247,241,230,0.28),rgba(247,241,230,0.78)_48%,rgba(247,241,230,0.94)_100%)]" />
      <div className="hero-gallery-scene absolute left-1/2 top-1/2 h-[720px] w-[920px] -translate-x-1/2 -translate-y-1/2">
        <div className="hero-gallery-orbit">
          {FRAMES.map((frame, index) => (
            <div
              key={frame.label}
              className="hero-gallery-frame"
              style={{ '--angle': frame.angle, '--frame-color': frame.color, '--index': index } as React.CSSProperties}
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_28%_20%,rgba(255,255,255,0.42),transparent_28%),linear-gradient(132deg,rgba(255,255,255,0.16),transparent_44%,rgba(42,37,32,0.24))]" />
              <div className="absolute inset-x-6 top-6 h-px bg-cream/42" />
              <span className="absolute bottom-6 left-6 font-body text-[9px] uppercase tracking-[0.32em] text-cream/76">
                {frame.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
