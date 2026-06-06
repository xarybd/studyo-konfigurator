'use client'

import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, m, useReducedMotion } from 'framer-motion'
import { MessageCircle, RotateCcw, Sparkles, X } from 'lucide-react'
import { BackgroundGradientAnimation } from '@/components/BackgroundGradientAnimation'

interface RevealItem {
  label: string
  value: string
}

interface ResultRevealProps {
  min?: number
  max?: number
  items: RevealItem[]
  whatsappUrl: string
}

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1]

function pick(items: RevealItem[], label: string) {
  return items.find((item) => item.label === label)?.value ?? 'Belirtilmedi'
}

function buildStorySlides(items: RevealItem[]) {
  const context = pick(items, 'Etkinlik')
  const season = pick(items, 'Mevsim')
  const style = pick(items, 'Stil')
  const location = pick(items, 'Lokasyon')
  const duration = pick(items, 'Süre')
  const team = pick(items, 'Ekip')
  const delivery = pick(items, 'Teslimat')
  const extras = pick(items, 'Ekstralar')

  return [
    {
      eyebrow: 'Hikayenizin tonu',
      title: `${context} için ${style}`,
      text: `${season} ışığıyla, çekiminizin estetik dili baştan kuruluyor.`,
    },
    {
      eyebrow: 'Sahne ve akış',
      title: `${location} / ${duration}`,
      text: `${team} ile günün ritmi kaçmadan, ana anlar zarif bir akışa dönüşüyor.`,
    },
    {
      eyebrow: 'Paylaşılabilir taslak',
      title: delivery,
      text: extras === 'Yok' ? 'Minimal, temiz ve sosyal medyada paylaşmaya hazır bir çekim hikayesi.' : `${extras} dokunuşuyla sosyal medyada paylaşmaya hazır bir çekim hikayesi.`,
    },
  ]
}

export function ResultReveal({ min, max, items, whatsappUrl }: ResultRevealProps) {
  const [visible, setVisible] = useState(false)
  const [played, setPlayed] = useState(false)
  const [index, setIndex] = useState(0)
  const shouldReduce = useReducedMotion()

  const slides = useMemo(() => buildStorySlides(items), [items])

  useEffect(() => {
    if (!min || !max || played) return

    setVisible(true)
    setPlayed(true)
    setIndex(0)
  }, [min, max, played])

  useEffect(() => {
    if (!visible || shouldReduce || index >= slides.length - 1) return

    const timer = window.setTimeout(() => setIndex((current) => Math.min(current + 1, slides.length - 1)), 2300)
    return () => window.clearTimeout(timer)
  }, [index, slides.length, shouldReduce, visible])

  if (!min || !max) return null

  const current = slides[index]
  const isFinal = index === slides.length - 1

  return (
    <>
      <AnimatePresence>
        {visible ? (
          <m.div
            className="fixed inset-0 z-50 bg-ink/22 backdrop-blur-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, filter: 'blur(14px)' }}
            transition={{ duration: 0.45 }}
          >
            <BackgroundGradientAnimation className="h-[100svh] w-full">
              <button
                type="button"
                onClick={() => setVisible(false)}
                aria-label="Raporu kapat"
                className="fixed right-5 top-5 z-30 flex h-11 w-11 items-center justify-center rounded-full border border-cream/24 bg-cream/14 text-cream/82 backdrop-blur-xl transition hover:bg-cream/24 hover:text-cream sm:right-7 sm:top-7"
              >
                <X size={17} />
              </button>

              <div className="fixed left-5 right-5 top-5 z-20 grid gap-2 sm:left-8 sm:right-20" style={{ gridTemplateColumns: `repeat(${slides.length}, minmax(0, 1fr))` }}>
                {slides.map((_, step) => (
                  <span key={step} className="h-1 overflow-hidden rounded-full bg-cream/18">
                    <m.span
                      className="block h-full origin-left rounded-full bg-cream/78"
                      initial={false}
                      animate={{ scaleX: step < index ? 1 : step === index ? 1 : 0 }}
                      transition={{ duration: step === index ? 2 : 0.25, ease: 'linear' }}
                    />
                  </span>
                ))}
              </div>

              <div className="relative z-10 flex h-[100svh] select-none items-center justify-center px-5 py-16 text-cream sm:px-6">
                <AnimatePresence mode="wait">
                  <m.div
                    key={current.eyebrow}
                    className="relative flex aspect-[9/16] max-h-[82svh] w-full max-w-[390px] flex-col justify-between overflow-hidden rounded-[22px] border border-cream/22 bg-ink/18 p-5 text-center shadow-[0_46px_150px_rgba(42,37,32,0.38),inset_0_1px_0_rgba(255,255,255,0.2)] backdrop-blur-2xl sm:max-w-[430px] sm:rounded-[14px] sm:p-7"
                    initial={{ opacity: 0, y: 44, scale: 0.96, filter: 'blur(14px)' }}
                    animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, y: -24, scale: 0.98, filter: 'blur(10px)' }}
                    transition={{ duration: 0.62, ease }}
                  >
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(255,255,255,0.22),transparent_34%),linear-gradient(180deg,rgba(255,255,255,0.12),transparent_48%,rgba(42,37,32,0.2))]" />
                    <div className="relative">
                      <div className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-cream/22 bg-cream/12 px-3 py-1.5 font-body text-[8px] uppercase tracking-[0.16em] sm:mb-6 sm:px-4 sm:py-2 sm:text-[9px] sm:tracking-[0.26em]">
                        <Sparkles size={13} />
                        Çekim raporunuz
                      </div>
                      <p className="font-body text-[9px] uppercase tracking-[0.2em] text-cream/66 sm:text-[11px] sm:tracking-[0.34em]">
                        {current.eyebrow}
                      </p>
                    </div>

                    <div className="relative">
                      <h2 className="mx-auto max-w-[9ch] break-words font-display text-[clamp(32px,9vw,64px)] font-light leading-[0.96] sm:max-w-[10ch]">
                        {current.title}
                      </h2>
                      <div className="mx-auto my-6 h-px w-20 bg-cream/38 sm:my-7 sm:w-24" />
                      <p className="mx-auto max-w-[27ch] font-display text-[17px] italic leading-7 text-cream/78 sm:text-[20px] sm:leading-8">
                        {current.text}
                      </p>
                    </div>

                    <div className="relative">
                      {isFinal ? (
                        <div className="flex flex-col gap-3">
                          <a
                            href={whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex min-h-13 items-center justify-center gap-3 rounded-full bg-cream px-5 font-body text-[10px] font-medium uppercase tracking-[0.14em] text-ink shadow-[0_18px_48px_rgba(42,37,32,0.24)] transition hover:-translate-y-0.5 sm:px-6 sm:text-[11px] sm:tracking-[0.18em]"
                          >
                            <MessageCircle size={16} />
                            WhatsApp'a gönder
                          </a>
                          <p className="font-body text-[9px] uppercase tracking-[0.14em] text-cream/54 sm:text-[10px] sm:tracking-[0.18em]">
                            Paylaşım şablonunda fiyat görünmez
                          </p>
                        </div>
                      ) : (
                        <p className="font-body text-[10px] uppercase tracking-[0.24em] text-cream/54">
                          Instagram hikayesi için hazır
                        </p>
                      )}
                    </div>
                  </m.div>
                </AnimatePresence>
              </div>
            </BackgroundGradientAnimation>
          </m.div>
        ) : null}
      </AnimatePresence>

      {!visible && played ? (
        <button
          type="button"
          onClick={() => {
            setIndex(0)
            setVisible(true)
          }}
          className="fixed bottom-6 right-5 z-40 inline-flex items-center gap-2 rounded-full border border-gold/24 bg-cream/78 px-4 py-3 font-body text-[10px] font-medium uppercase tracking-[0.18em] text-ink/64 shadow-[0_18px_48px_rgba(42,37,32,0.11)] backdrop-blur-xl transition hover:-translate-y-0.5 hover:text-ink"
        >
          <RotateCcw size={14} />
          Raporu oynat
        </button>
      ) : null}
    </>
  )
}
