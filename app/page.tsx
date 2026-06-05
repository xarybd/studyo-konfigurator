'use client'
import { useRouter } from 'next/navigation'
import { SiteHeader } from '@/components/SiteHeader'

const STATS = [
  { num: '9', label: 'ADIM' },
  { num: '5', label: 'DAKİKA' },
  { num: '∞', label: 'KOMBİNASYON' },
] as const

export default function WelcomePage() {
  const router = useRouter()

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      <main className="flex-1 flex flex-col items-center justify-center px-6 md:px-12 py-10">
        <div className="flex flex-col items-center text-center w-full max-w-[740px] mx-auto gap-7 md:gap-9">

          {/* Badge pill */}
          <div
            className="inline-flex items-center px-5 py-[7px] rounded-full font-body text-[9px] tracking-[0.26em] uppercase"
            style={{
              background: 'rgba(255,252,245,0.78)',
              backdropFilter: 'blur(14px)',
              WebkitBackdropFilter: 'blur(14px)',
              border: '1px solid rgba(184,153,104,0.2)',
              boxShadow: '0 2px 10px rgba(42,37,32,0.04), inset 0 1px 0 rgba(255,255,255,0.75)',
              color: '#635749',
            }}
          >
            DEMO · STÜDYONUZ İÇİN ÖZELLEŞTİRİLECEK
          </div>

          {/* Heading */}
          <div style={{ lineHeight: '0.93' }}>
            <h1
              className="block font-display font-light text-ink"
              style={{ fontSize: 'clamp(48px, 8vw, 94px)' }}
            >
              Paketinizi
            </h1>
            <p
              className="block font-accent italic text-gold-dark"
              style={{ fontSize: 'clamp(44px, 7.5vw, 88px)', lineHeight: '1.05' }}
            >
              birlikte tasarlayalım
            </p>
          </div>

          {/* Subtitle */}
          <p
            className="font-display italic text-ink/45 max-w-[440px]"
            style={{ fontSize: 'clamp(14px, 1.65vw, 17px)', lineHeight: '1.72' }}
          >
            9 adımda zevkinize, hikayenize ve gününüze özel bir paket öneriyoruz. Süreç 5 dakika sürer.
          </p>

          {/* Stats */}
          <div className="flex items-start gap-10 md:gap-16">
            {STATS.map(({ num, label }) => (
              <div key={label} className="flex flex-col items-center gap-2">
                <span
                  className="font-display font-light text-gold"
                  style={{ fontSize: 'clamp(28px, 3.5vw, 42px)', lineHeight: '1' }}
                >
                  {num}
                </span>
                <span className="font-body text-[9px] tracking-[0.34em] uppercase text-ink/35">
                  {label}
                </span>
              </div>
            ))}
          </div>

          {/* CTA */}
          <button
            onClick={() => router.push('/configure/context')}
            className="font-body text-[11px] tracking-[0.28em] uppercase text-ink rounded-full cursor-pointer transition-all duration-300 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
            style={{
              background: 'rgba(255,252,245,0.88)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: '1px solid rgba(184,153,104,0.42)',
              padding: '17px 46px',
              boxShadow: '0 4px 20px rgba(42,37,32,0.07), 0 1px 0 rgba(255,255,255,0.9) inset',
            }}
          >
            TASARIMA BAŞLA →
          </button>

        </div>
      </main>

      {/* Marquee placeholder — will be replaced in next step */}
      <div className="h-14" />
    </div>
  )
}
