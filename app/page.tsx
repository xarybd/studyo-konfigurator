'use client'

import { ArrowRight, Sparkles } from 'lucide-react'
import { LazyMotion, domAnimation, m, useReducedMotion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { BrandGradientBackdrop } from '@/components/BrandGradientBackdrop'
import { Marquee } from '@/components/Marquee'
import { SiteHeader } from '@/components/SiteHeader'

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1]

const pageVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.04,
    },
  },
}

const clusterVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.06 },
  },
}

export default function WelcomePage() {
  const router = useRouter()
  const shouldReduce = useReducedMotion()

  const item = shouldReduce
    ? {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { duration: 0.36 } },
      }
    : {
        hidden: { opacity: 0, y: 12, filter: 'blur(8px)' },
        show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.62, ease } },
      }

  return (
    <LazyMotion features={domAnimation}>
      <m.div
        className="flex min-h-screen flex-col"
        variants={pageVariants}
        initial="hidden"
        animate="show"
      >
        <m.div variants={item}>
          <SiteHeader />
        </m.div>

        <main className="relative isolate flex flex-1 items-center justify-center overflow-hidden px-4 pb-9 pt-4 sm:px-8 sm:pb-14 sm:pt-8 xl:px-16">
          <BrandGradientBackdrop intensity="hero" />
          <div className="relative z-10 mx-auto flex w-full max-w-[390px] flex-col items-center sm:max-w-[430px] md:max-w-[900px]">
            <div className="panel-shine relative w-full overflow-hidden rounded-[24px] border border-cream/42 bg-cream/46 px-5 py-7 text-center shadow-[0_34px_120px_rgba(42,37,32,0.14),inset_0_1px_0_rgba(255,255,255,0.82)] backdrop-blur-2xl sm:px-8 sm:py-10 md:rounded-[18px] lg:px-14 lg:py-12">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,252,245,0.32),transparent_34%),linear-gradient(145deg,rgba(255,255,255,0.26),rgba(255,255,255,0.08)_48%,rgba(154,126,79,0.1))]" />
              <div className="relative">
                <m.div variants={item}>
                  <div className="mb-4 inline-flex max-w-full items-center gap-2 rounded-full border border-gold/20 bg-cream/58 px-3 py-1.5 font-body text-[8px] uppercase tracking-[0.16em] text-gold-dark/70 shadow-[inset_0_1px_0_rgba(255,255,255,0.72)] backdrop-blur-xl sm:mb-6 sm:px-4 sm:py-2 sm:text-[9px] sm:tracking-[0.26em]">
                    <Sparkles size={13} strokeWidth={1.6} />
                    Stüdyonuz için özelleştirilecek demo
                  </div>
                </m.div>

                <m.div variants={clusterVariants} className="mx-auto flex max-w-[13ch] flex-col items-center text-center leading-[0.94] md:max-w-none">
                  <m.h1 variants={item} className="w-full text-center font-display text-[clamp(39px,11vw,60px)] font-light text-ink md:text-[clamp(42px,7vw,92px)]">
                    Çekiminizi
                  </m.h1>
                  <m.p variants={item} className="flex w-full flex-col items-center text-center font-accent text-[clamp(33px,10vw,54px)] italic leading-[1.02] text-gold-dark md:block md:text-[clamp(36px,6.4vw,82px)]">
                    <span className="block w-full text-center">birlikte</span>
                    <span className="block w-full text-center">tasarlayalım</span>
                  </m.p>
                </m.div>

                <m.p
                  variants={item}
                  className="mx-auto mt-5 max-w-[30ch] font-display text-[14px] italic leading-7 text-ink/54 sm:mt-6 sm:max-w-2xl sm:text-[17px] sm:leading-8"
                >
                  Zevkinize, hikayenize ve gününüze göre özel bir fotoğraf paketi öneriyoruz.
                  Süreç kısa, sonuç net ve paylaşmaya hazır.
                </m.p>

                <m.div variants={item} className="mt-7 flex flex-col items-center justify-center gap-3.5 sm:mt-8 sm:flex-row sm:gap-4">
                  <m.button
                    onClick={() => router.push('/configure/info')}
                    whileHover={shouldReduce ? {} : { y: -3 }}
                    whileTap={{ scale: 0.985 }}
                    transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
                    className="inline-flex min-h-13 w-auto min-w-[220px] max-w-full items-center justify-center gap-3 rounded-full bg-ink px-7 font-body text-[10px] font-medium uppercase tracking-[0.16em] text-cream shadow-[0_18px_44px_rgba(42,37,32,0.18)] transition hover:bg-gold-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-cream sm:min-h-14 sm:min-w-[220px] sm:px-8 sm:text-[11px] sm:tracking-[0.22em]"
                  >
                    Tasarıma başla
                    <ArrowRight size={16} strokeWidth={1.7} />
                  </m.button>
                  <span className="font-body text-[10px] uppercase tracking-[0.18em] text-ink/38 sm:text-[11px] sm:tracking-[0.22em]">
                    5 dakikalık akış
                  </span>
                </m.div>
              </div>
            </div>
          </div>
        </main>

        <m.div variants={item}>
          <Marquee />
        </m.div>
      </m.div>
    </LazyMotion>
  )
}
