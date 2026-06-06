import type { Metadata } from 'next'
import { Cormorant_Garamond, Italiana, DM_Sans } from 'next/font/google'
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import '@21st-sdk/react/styles.css'
import './globals.css'

const cormorant = Cormorant_Garamond({
  subsets: ['latin', 'latin-ext'],
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
  preload: true,
})

const italiana = Italiana({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-italiana',
  display: 'swap',
  preload: false,
})

const dmSans = DM_Sans({
  subsets: ['latin', 'latin-ext'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-dm-sans',
  display: 'swap',
  preload: true,
})

export const metadata: Metadata = {
  title: 'Paket Konfigüratörü',
  description: 'Kendi fotoğraf paketinizi tasarlayın',
}

const MESH_GRADIENT =
  'radial-gradient(circle at 14% 18%, rgba(217,195,154,0.74) 0%, transparent 36%), ' +
  'radial-gradient(circle at 88% 28%, rgba(250,234,216,0.82) 0%, transparent 42%), ' +
  'radial-gradient(circle at 48% 84%, rgba(255,245,230,0.9) 0%, transparent 40%), ' +
  'radial-gradient(circle at 24% 68%, rgba(184,153,104,0.34) 0%, transparent 34%)'

const NOISE_SVG =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.55'/%3E%3C/svg%3E\")"

const PARTICLES = [
  { left: '18%', bottom: '8%', w: '1px', dur: '22s', delay: '0s', drift: '-18px' },
  { left: '31%', bottom: '4%', w: '1.5px', dur: '25s', delay: '5s', drift: '14px' },
  { left: '44%', bottom: '11%', w: '2px', dur: '20s', delay: '9s', drift: '-8px' },
  { left: '57%', bottom: '5%', w: '1.5px', dur: '27s', delay: '2s', drift: '22px' },
  { left: '70%', bottom: '13%', w: '1px', dur: '18s', delay: '13s', drift: '-20px' },
  { left: '82%', bottom: '7%', w: '1.5px', dur: '24s', delay: '7s', drift: '10px' },
]

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" className={`${cormorant.variable} ${italiana.variable} ${dmSans.variable}`}>
      <body>
        <div
          aria-hidden="true"
          className="mesh-drift-layer"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: -3,
            pointerEvents: 'none',
            background: MESH_GRADIENT,
            filter: 'blur(96px) saturate(126%)',
            opacity: 0.86,
          }}
        />
        <div
          aria-hidden="true"
          className="aurora-sweep"
          style={{
            position: 'fixed',
            inset: '8% -12% auto -12%',
            height: '44vh',
            zIndex: -2,
            pointerEvents: 'none',
            background:
              'linear-gradient(105deg, transparent 8%, rgba(184,153,104,0.12) 32%, rgba(255,252,245,0.36) 50%, rgba(154,126,79,0.12) 68%, transparent 92%)',
            filter: 'blur(18px)',
          }}
        />
        <div
          aria-hidden="true"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: -1,
            pointerEvents: 'none',
            backgroundImage: NOISE_SVG,
            backgroundSize: '180px 180px',
            opacity: 0.048,
            mixBlendMode: 'overlay' as const,
          }}
        />
        <div
          aria-hidden="true"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 0,
            pointerEvents: 'none',
            overflow: 'hidden',
          }}
        >
          {PARTICLES.map((p, i) => (
            <div
              key={i}
              className="gold-particle"
              style={{
                left: p.left,
                bottom: p.bottom,
                width: p.w,
                height: p.w,
                '--dur': p.dur,
                '--delay': p.delay,
                '--drift': p.drift,
              } as React.CSSProperties}
            />
          ))}
        </div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <NuqsAdapter>{children}</NuqsAdapter>
        </div>
      </body>
    </html>
  )
}
