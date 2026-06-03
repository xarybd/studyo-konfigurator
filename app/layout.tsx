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

const NOISE_SVG = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='180' height='180' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="tr"
      className={`${cormorant.variable} ${italiana.variable} ${inter.variable}`}
    >
      <body>
        {/* Layer 2: animated gradient mesh */}
        <div
          aria-hidden="true"
          style={{ position: 'fixed', inset: 0, zIndex: -2, overflow: 'hidden', opacity: 0.7 }}
        >
          <div style={{ position: 'absolute', inset: 0, filter: 'blur(80px)' }}>
            <div className="mesh-blob mesh-blob-1" />
            <div className="mesh-blob mesh-blob-2" />
            <div className="mesh-blob mesh-blob-3" />
            <div className="mesh-blob mesh-blob-4" />
          </div>
        </div>

        {/* Layer 3: SVG noise overlay */}
        <div
          aria-hidden="true"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: -1,
            opacity: 0.04,
            mixBlendMode: 'overlay' as const,
            backgroundImage: NOISE_SVG,
            backgroundSize: '180px 180px',
            pointerEvents: 'none',
          }}
        />

        <NuqsAdapter>{children}</NuqsAdapter>
      </body>
    </html>
  )
}
