'use client'
import { useRouter } from 'next/navigation'
import { LazyMotion, domAnimation, m, useReducedMotion } from 'framer-motion'
import { SiteHeader } from '@/components/SiteHeader'
import { Marquee } from '@/components/Marquee'

const STATS = [
  { num: '9', label: 'ADIM' },
  { num: '5', label: 'DAKİKA' },
  { num: '∞', label: 'KOMBİNASYON' },
] as const

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1]

const pageVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.09,
      delayChildren: 0.06,
    },
  },
}

const headingVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.06 },
  },
}

const statsVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.07 },
  },
}

export default function WelcomePage() {
  const router = useRouter()
  const shouldReduce = useReducedMotion()

  const item = shouldReduce
    ? {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { duration: 0.45 } },
      }
    : {
        hidden: { opacity: 0, y: 10 },
        show: { opacity: 1, y: 0, transition: { duration: 0.62, ease } },
      }

  return (
    <LazyMotion features={domAnimation}>
      <m.div
        className="min-h-screen flex flex-col"
        variants={pageVariants}
        initial="hidden"
        animate="show"
      >
        {/* Header */}
        <m.div variants={item}>
          <SiteHeader />
        </m.div>

        {/* Hero */}
        <main className="flex-1 flex flex-col items-center justify-center px-6 md:px-12 py-10">
          <div className="flex flex-col items-center text-center w-full max-w-[740px] mx-auto gap-7 md:gap-9">

            {/* Badge pill */}
            <m.div variants={item}>
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
            </m.div>

            {/* Heading — two lines stagger independently */}
            <m.div variants={headingVariants} style={{ lineHeight: '0.93' }}>
              <m.h1
                variants={item}
                className="block font-display font-light text-ink"
                style={{ fontSize: 'clamp(48px, 8vw, 94px)' }}
              >
                Paketinizi
              </m.h1>
              <m.p
                variants={item}
                className="block font-accent italic text-gold-dark"
                style={{ fontSize: 'clamp(44px, 7.5vw, 88px)', lineHeight: '1.05' }}
              >
                birlikte tasarlayalım
              </m.p>
            </m.div>

            {/* Subtitle */}
            <m.p
              variants={item}
              className="font-display italic text-ink/45 max-w-[440px]"
              style={{ fontSize: 'clamp(14px, 1.65vw, 17px)', lineHeight: '1.72' }}
            >
              9 adımda zevkinize, hikayenize ve gününüze özel bir paket öneriyoruz. Süreç 5 dakika sürer.
            </m.p>

            {/* Stats */}
            <m.div variants={statsVariants} className="flex items-start gap-10 md:gap-16">
              {STATS.map(({ num, label }) => (
                <m.div key={label} variants={item} className="flex flex-col items-center gap-2">
                  <span
                    className="font-display font-light text-gold"
                    style={{ fontSize: 'clamp(28px, 3.5vw, 42px)', lineHeight: '1' }}
                  >
                    {num}
                  </span>
                  <span className="font-body text-[9px] tracking-[0.34em] uppercase text-ink/35">
                    {label}
                  </span>
                </m.div>
              ))}
            </m.div>

            {/* CTA */}
            <m.div variants={item}>
              <m.button
                onClick={() => router.push('/configure/context')}
                whileHover={shouldReduce ? {} : { y: -2 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
                className="font-body text-[11px] tracking-[0.28em] uppercase text-ink rounded-full cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
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
              </m.button>
            </m.div>

          </div>
        </main>

        {/* Marquee */}
        <m.div variants={item}>
          <Marquee />
        </m.div>
      </m.div>
    </LazyMotion>
  )
}
