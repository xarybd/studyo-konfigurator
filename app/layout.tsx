import type { Metadata } from 'next'
import { Cormorant_Garamond, Italiana, DM_Sans } from 'next/font/google'
import { NuqsAdapter } from 'nuqs/adapters/next/app'
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
  'radial-gradient(circle at 15% 25%, #D9C39A 0%, transparent 45%), ' +
  'radial-gradient(circle at 85% 35%, #FAEAD8 0%, transparent 50%), ' +
  'radial-gradient(circle at 50% 85%, #FFF5E6 0%, transparent 45%), ' +
  'radial-gradient(circle at 25% 65%, #E8D4A8 0%, transparent 40%)'

const NOISE_SVG =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.6'/%3E%3C/svg%3E\")"

const PARTICLES = [
  { left: '36%', bottom: '4%',  w: '1.5px', dur: '19s', delay: '0s',    drift: '-16px' },
  { left: '43%', bottom: '8%',  w: '1px',   dur: '24s', delay: '4.5s',  drift: '14px'  },
  { left: '50%', bottom: '3%',  w: '2px',   dur: '21s', delay: '9s',    drift: '-6px'  },
  { left: '57%', bottom: '10%', w: '1.5px', dur: '26s', delay: '2s',    drift: '20px'  },
  { left: '63%', bottom: '6%',  w: '1px',   dur: '17s', delay: '13s',   drift: '-22px' },
  { left: '40%', bottom: '12%', w: '1.5px', dur: '22s', delay: '7s',    drift: '8px'   },
  { left: '54%', bottom: '5%',  w: '1px',   dur: '20s', delay: '16.5s', drift: '-10px' },
]

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="tr"
      className={`${cormorant.variable} ${italiana.variable} ${dmSans.variable}`}
    >
      <body>
        {/* Katman A — animasyonlu gradient mesh */}
        <div
          aria-hidden="true"
          className="mesh-drift-layer"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: -2,
            pointerEvents: 'none',
            background: MESH_GRADIENT,
            filter: 'blur(100px) saturate(125%)',
            opacity: 0.75,
          }}
        />

        {/* Katman B — grain noise */}
        <div
          aria-hidden="true"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: -1,
            pointerEvents: 'none',
            backgroundImage: NOISE_SVG,
            backgroundSize: '200px 200px',
            opacity: 0.05,
            mixBlendMode: 'overlay' as const,
          }}
        />

        {/* Katman C — altın toz partiküller */}
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

        {/* Sayfa içeriği — partiküllerin üstünde */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <NuqsAdapter>{children}</NuqsAdapter>
        </div>
      </body>
    </html>
  )
}
