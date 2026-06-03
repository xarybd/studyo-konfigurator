import type { Metadata } from 'next'
import { Cormorant_Garamond, Italiana, Inter } from 'next/font/google'
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

const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-inter',
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="tr"
      className={`${cormorant.variable} ${italiana.variable} ${inter.variable}`}
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

        <NuqsAdapter>{children}</NuqsAdapter>
      </body>
    </html>
  )
}
