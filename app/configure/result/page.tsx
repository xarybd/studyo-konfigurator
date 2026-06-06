'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ChevronLeft, MessageCircle, Send, Sparkles } from 'lucide-react'
import { Button } from '@/components/Button'
import { ResultReveal } from '@/components/ResultReveal'
import { SummaryRow } from '@/components/SummaryRow'
import { useWizardState } from '@/hooks/useWizardState'
import { calculatePrice } from '@/lib/price-engine'
import { buildWhatsAppMessage, buildWhatsAppURL, LABELS } from '@/lib/whatsapp'
import { formatCurrency } from '@/lib/utils'
import { studioConfig } from '@/studio.config'

const schema = z.object({
  name: z.string().min(2, 'En az 2 karakter'),
  email: z.string().email('Geçerli bir e-posta giriniz'),
  phone: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

const FORM_FIELDS = [
  { id: 'result-name', name: 'name' as const, label: 'Ad Soyad', placeholder: 'Adınız', type: 'text' },
  { id: 'result-email', name: 'email' as const, label: 'E-posta', placeholder: 'ornek@mail.com', type: 'email' },
  { id: 'result-phone', name: 'phone' as const, label: 'Telefon', placeholder: '+90 5xx xxx xx xx', type: 'tel' },
] as const

function lbl<T extends Record<string, string>>(map: T, key: string | null | undefined) {
  if (!key) return 'Belirtilmedi'
  return map[key] ?? key
}

export default function ResultPage() {
  const router = useRouter()
  const [state] = useWizardState()
  const [emailSent, setEmailSent] = useState(false)
  const [emailLoading, setEmailLoading] = useState(false)
  const [emailError, setEmailError] = useState('')
  const [focusedField, setFocusedField] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  })

  const price = calculatePrice({
    context: state.context as never,
    style: state.style as never,
    duration: state.duration as never,
    team: state.team as never,
    delivery: state.delivery as never,
    extras: (state.extras ?? []) as never,
  })

  const extrasList =
    (state.extras ?? []).length > 0
      ? (state.extras ?? []).map((extra) => lbl(LABELS.extras, extra)).join(', ')
      : 'Yok'

  const revealItems = [
    { label: 'Etkinlik', value: lbl(LABELS.context, state.context) },
    { label: 'Mevsim', value: lbl(LABELS.season, state.season) },
    { label: 'Tarih', value: state.date ?? 'Belirtilmedi' },
    { label: 'Stil', value: lbl(LABELS.style, state.style) },
    { label: 'Lokasyon', value: lbl(LABELS.location, state.location) },
    { label: 'Süre', value: lbl(LABELS.duration, state.duration) },
    { label: 'Ekip', value: lbl(LABELS.team, state.team) },
    { label: 'Teslimat', value: lbl(LABELS.delivery, state.delivery) },
    { label: 'Ekstralar', value: extrasList },
  ]

  const nameVal = watch('name') ?? ''
  const emailVal = watch('email') ?? ''

  function getMessageData(data?: Partial<FormValues>) {
    if (!price) return null

    return {
      name: data?.name || nameVal || 'Misafir',
      email: data?.email || emailVal || 'Belirtilmedi',
      phone: data?.phone,
      context: state.context ?? undefined,
      season: state.season ?? undefined,
      date: state.date ?? undefined,
      style: state.style ?? undefined,
      location: state.location ?? undefined,
      duration: state.duration ?? undefined,
      team: state.team ?? undefined,
      delivery: state.delivery ?? undefined,
      extras: (state.extras ?? []) as string[],
      price,
    }
  }

  function buildWAUrl() {
    const messageData = getMessageData()
    if (!messageData) return '#'
    return buildWhatsAppURL(studioConfig.whatsappNumber, messageData)
  }

  async function onEmailSubmit(data: FormValues) {
    const messageData = getMessageData(data)
    if (!messageData) return

    setEmailLoading(true)
    setEmailError('')

    try {
      const summary = buildWhatsAppMessage(messageData)
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, packageSummary: summary }),
      })

      if (!response.ok) {
        setEmailError('Mesaj gönderilemedi. WhatsApp üzerinden hızlıca devam edebilirsiniz.')
        return
      }

      setEmailSent(true)
    } catch {
      setEmailError('Bağlantı kurulamadı. WhatsApp üzerinden hızlıca devam edebilirsiniz.')
    } finally {
      setEmailLoading(false)
    }
  }

  return (
    <section className="flex-1 overflow-visible px-4 pb-24 pt-5 sm:px-8 lg:px-12">
      <ResultReveal min={price?.min} max={price?.max} items={revealItems} whatsappUrl={buildWAUrl()} />
      <div className="mx-auto flex w-full max-w-[390px] flex-col gap-5 sm:max-w-[430px] md:max-w-[1180px] md:gap-8">
        <div className="mx-auto max-w-[390px] text-center md:max-w-4xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-gold/22 bg-cream/68 px-3 py-1.5 font-body text-[8px] uppercase tracking-[0.22em] text-gold-dark shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] backdrop-blur-xl md:mb-5 md:px-4 md:py-2 md:text-[9px] md:tracking-[0.28em]">
            <Sparkles size={13} strokeWidth={1.5} />
            Paketiniz hazır
          </div>
          <h1 className="mx-auto max-w-[10ch] font-display text-[clamp(33px,9.5vw,54px)] font-light leading-[1.03] text-ink md:max-w-none md:text-[clamp(40px,6vw,76px)] md:leading-[0.98]">
            Sizin için <em className="font-accent italic text-gold-dark">tasarlanan</em> teklif
          </h1>
          <p className="mx-auto mt-3 max-w-[31ch] font-display text-[13px] italic leading-6 text-ink/48 md:mt-4 md:max-w-2xl md:text-[16px] md:leading-7">
            Seçimlerinize göre ön yatırım aralığını hazırladık. Son dokunuşu kısa bir görüşmede netleştiririz.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-6">
          <div className="panel-shine relative overflow-hidden rounded-[22px] border border-gold/20 bg-cream/60 p-4 shadow-[0_24px_80px_rgba(42,37,32,0.08),inset_0_1px_0_rgba(255,255,255,0.74)] backdrop-blur-2xl md:rounded-[14px] md:p-8">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_0%,rgba(184,153,104,0.16),transparent_34%),linear-gradient(145deg,rgba(255,255,255,0.28),transparent_56%)]" />
            <div className="relative space-y-2">
              <p className="mb-3 font-body text-[8px] uppercase tracking-[0.18em] text-gold-dark/68 md:mb-5 md:text-[9px] md:tracking-[0.3em]">
                Paket özeti
              </p>
              <SummaryRow label="Etkinlik" value={lbl(LABELS.context, state.context)} />
              <SummaryRow label="Mevsim" value={lbl(LABELS.season, state.season)} />
              <SummaryRow label="Tarih" value={state.date ?? 'Belirtilmedi'} />
              <SummaryRow label="Stil" value={lbl(LABELS.style, state.style)} />
              <SummaryRow label="Lokasyon" value={lbl(LABELS.location, state.location)} />
              <SummaryRow label="Süre" value={lbl(LABELS.duration, state.duration)} />
              <SummaryRow label="Ekip" value={lbl(LABELS.team, state.team)} />
              <SummaryRow label="Teslimat" value={lbl(LABELS.delivery, state.delivery)} />
              <SummaryRow label="Ekstralar" value={extrasList} />
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[22px] border border-gold/22 bg-cream/62 p-4 shadow-[0_28px_90px_rgba(42,37,32,0.1),inset_0_1px_0_rgba(255,255,255,0.76)] backdrop-blur-2xl md:rounded-[14px] md:p-8">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_78%_8%,rgba(184,153,104,0.2),transparent_34%),linear-gradient(150deg,rgba(255,255,255,0.32),rgba(247,241,230,0.06)_48%,rgba(154,126,79,0.1))]" />
            <div className="relative flex flex-col">
              <div className="rounded-[20px] border border-gold/18 bg-[linear-gradient(150deg,rgba(42,37,32,0.94),rgba(154,126,79,0.72)_48%,rgba(247,241,230,0.62))] p-5 text-cream shadow-[0_18px_50px_rgba(42,37,32,0.12),inset_0_1px_0_rgba(255,255,255,0.2)] md:rounded-[14px] md:p-7">
                <p className="mb-3 font-body text-[8px] uppercase tracking-[0.24em] text-cream/68 md:text-[9px] md:tracking-[0.3em]">
                  Yatırım aralığı
                </p>
                {price ? (
                  <div className="flex flex-col gap-4">
                    <p className="break-words font-display text-[clamp(26px,7.5vw,52px)] italic leading-[1.08] text-cream">
                      {formatCurrency(price.min)} - {formatCurrency(price.max)}
                    </p>
                    <p className="max-w-[42ch] font-body text-[12px] leading-5 text-cream/72 md:text-sm md:leading-6">
                      Bu aralık seçtiğiniz kapsam için ön teklif niteliğindedir.
                    </p>
                  </div>
                ) : (
                  <p className="font-body text-sm leading-6 text-cream/74">
                    Fiyat aralığı için en az etkinlik türünü seçmeniz gerekiyor.
                  </p>
                )}
              </div>

              <a
                href={buildWAUrl()}
                target="_blank"
                rel="noopener noreferrer"
                aria-disabled={!price}
                className="mt-4 inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-ink px-6 font-body text-[10px] font-medium uppercase tracking-[0.14em] text-cream shadow-[0_18px_44px_rgba(42,37,32,0.18)] transition duration-300 hover:-translate-y-0.5 hover:bg-gold-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-cream aria-disabled:pointer-events-none aria-disabled:opacity-45 md:mt-5 md:min-h-13 md:px-7 md:text-[11px] md:tracking-[0.2em]"
              >
                <MessageCircle size={17} strokeWidth={1.7} />
                WhatsApp ile devam et
              </a>

              <div className="my-6 h-px bg-gold/18 md:my-7" />

              <div>
                <p className="mb-4 font-accent text-[19px] italic text-gold-dark md:mb-5 md:text-[20px]">
                  Sizinle tanışalım
                </p>

                {emailSent ? (
                  <div className="rounded-[18px] border border-gold/20 bg-cream/55 p-4 font-body text-sm leading-6 text-ink/60 md:rounded-[14px] md:p-5">
                    Mesajınız iletildi. En kısa sürede size dönüş yapacağız.
                  </div>
                ) : (
                  <form onSubmit={handleSubmit(onEmailSubmit)} className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 sm:gap-4">
                    {FORM_FIELDS.map(({ id, name, label, placeholder, type }) => (
                      <div key={id} className={name === 'name' ? 'sm:col-span-2' : undefined}>
                        <label
                          htmlFor={id}
                          className="mb-2 block font-body text-[8px] uppercase tracking-[0.2em] text-gold-dark/68 md:text-[9px] md:tracking-[0.24em]"
                        >
                          {label}
                        </label>
                        <input
                          id={id}
                          type={type}
                          placeholder={placeholder}
                          {...register(name)}
                          onFocus={() => setFocusedField(id)}
                          className="h-12 w-full rounded-[16px] border border-gold/20 bg-cream/56 px-4 font-body text-sm text-ink outline-none transition duration-200 placeholder:text-ink/32 focus:border-gold md:h-13 md:rounded-[8px]"
                          style={
                            focusedField === id
                              ? { boxShadow: '0 0 0 3px rgba(184,153,104,0.1)' }
                              : undefined
                          }
                        />
                        {errors[name] ? (
                          <p className="mt-2 font-body text-xs text-error">{errors[name]?.message}</p>
                        ) : null}
                      </div>
                    ))}

                    {emailError ? (
                      <p className="rounded-[16px] border border-error/20 bg-error/5 p-3 font-body text-xs leading-5 text-error sm:col-span-2 md:rounded-[8px]">
                        {emailError}
                      </p>
                    ) : null}

                    <div className="sm:col-span-2">
                      <Button
                        type="submit"
                        variant="outline"
                        disabled={emailLoading || !price}
                        className="w-full"
                      >
                        <Send size={15} strokeWidth={1.7} />
                        {emailLoading ? 'Gönderiliyor' : 'Teklif iste'}
                      </Button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => router.back()}
          className="mx-auto inline-flex items-center gap-2 rounded-full px-4 py-3 font-body text-[10px] uppercase tracking-[0.22em] text-ink/46 transition duration-200 hover:bg-cream/55 hover:text-ink/72 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
        >
          <ChevronLeft size={14} strokeWidth={1.6} />
          Geri dön
        </button>
      </div>
    </section>
  )
}
