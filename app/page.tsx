'use client'
import { useRouter } from 'next/navigation'
import { SiteHeader } from '@/components/SiteHeader'
import { LazyMotion, domAnimation, m } from 'framer-motion'

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
}

const item = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] } },
}

export default function WelcomePage() {
  const router = useRouter()

  return (
    <LazyMotion features={domAnimation}>
      <div className="min-h-screen flex flex-col">
        <SiteHeader />

        <main className="flex-1 flex flex-col items-center justify-center px-5 md:px-12 py-8">
          <m.div
            variants={container}
            initial="hidden"
            animate="show"
            className="flex flex-col items-center text-center"
          >
            <m.p
              variants={item}
              className="font-body text-[11px] tracking-[0.32em] uppercase text-gold"
            >
              BİR AN. BİR ÖMÜR. BİR PAKET.
            </m.p>

            <m.h1 variants={item} className="mt-8" style={{ lineHeight: '0.95' }}>
              <span
                className="block font-display font-light text-ink"
                style={{ fontSize: 'clamp(48px, 7vw, 88px)' }}
              >
                Paketinizi
              </span>
              <span
                className="block font-accent italic text-gold-dark"
                style={{ fontSize: 'clamp(48px, 7vw, 88px)' }}
              >
                birlikte tasarlayalım
              </span>
            </m.h1>

            <m.p
              variants={item}
              className="font-display italic text-ink/50 mt-6 max-w-md mx-auto text-center"
              style={{ fontSize: '17px', lineHeight: '1.6' }}
            >
              9 adımda zevkinize ve gününüze özel bir paket öneriyoruz. Süreç 5 dakika sürer.
            </m.p>

            <m.div variants={item} className="flex items-start gap-16 mt-12">
              {[
                { num: '9', label: 'ADIM' },
                { num: '5', label: 'DAKİKA' },
                { num: '∞', label: 'KOMBİNASYON' },
              ].map(({ num, label }) => (
                <div key={label} className="flex flex-col items-center gap-2">
                  <span
                    className="font-display font-light text-gold"
                    style={{ fontSize: '32px', lineHeight: '1' }}
                  >
                    {num}
                  </span>
                  <span className="font-body text-[10px] tracking-[0.3em] uppercase text-ink/40">
                    {label}
                  </span>
                </div>
              ))}
            </m.div>

            <m.div variants={item} className="mt-12">
              <m.button
                onClick={() => router.push('/configure/context')}
                whileHover={{ y: -2, filter: 'brightness(1.1)' }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                className="font-body text-[12px] tracking-[0.28em] uppercase text-cream rounded-full cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
                style={{
                  background: 'linear-gradient(135deg, #2A2520, #4A3D2A)',
                  padding: '18px 42px',
                  boxShadow: '0 8px 24px rgba(42,37,32,0.18)',
                }}
              >
                TASARIMA BAŞLA →
              </m.button>
            </m.div>
          </m.div>
        </main>

        <p className="text-center font-body text-[10px] tracking-[0.3em] uppercase text-ink/25 pb-8">
          DEMO V0.1 · STÜDYONUZ İLE ÖZELLEŞTİRİLECEK
        </p>
      </div>
    </LazyMotion>
  )
}
