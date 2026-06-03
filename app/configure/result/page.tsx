'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { StepContainer } from '@/components/StepContainer'
import { SummaryRow } from '@/components/SummaryRow'
import { Button } from '@/components/Button'
import { useWizardState } from '@/hooks/useWizardState'
import { calculatePrice } from '@/lib/price-engine'
import { buildWhatsAppURL, buildWhatsAppMessage, LABELS } from '@/lib/whatsapp'
import { studioConfig } from '@/studio.config'
import { formatCurrency } from '@/lib/utils'
import { MessageCircle, ChevronLeft, Send } from 'lucide-react'

const schema = z.object({
  name: z.string().min(2, 'En az 2 karakter'),
  email: z.string().email('Geçerli bir e-posta giriniz'),
  phone: z.string().optional(),
})
type FormValues = z.infer<typeof schema>

function label<T extends Record<string, string>>(map: T, key: string | null | undefined): string {
  if (!key) return '—'
  return (map as Record<string, string>)[key] ?? key
}

export default function ResultPage() {
  const router = useRouter()
  const [state] = useWizardState()
  const [emailSent, setEmailSent] = useState(false)
  const [emailLoading, setEmailLoading] = useState(false)

  const { register, handleSubmit, formState: { errors }, watch } = useForm<FormValues>({
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

  const extrasList = (state.extras ?? []).length > 0
    ? (state.extras ?? []).map(e => label(LABELS.extras, e)).join(', ')
    : 'Yok'

  const nameVal = watch('name') ?? ''
  const emailVal = watch('email') ?? ''

  function buildWAUrl() {
    if (!price) return '#'
    return buildWhatsAppURL(studioConfig.whatsappNumber, {
      name: nameVal || 'Misafir',
      email: emailVal || '—',
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
    })
  }

  async function onEmailSubmit(data: FormValues) {
    if (!price) return
    setEmailLoading(true)
    try {
      const summary = buildWhatsAppMessage({
        ...data,
        context: state.context ?? undefined,
        date: state.date ?? undefined,
        style: state.style ?? undefined,
        location: state.location ?? undefined,
        duration: state.duration ?? undefined,
        team: state.team ?? undefined,
        delivery: state.delivery ?? undefined,
        extras: (state.extras ?? []) as string[],
        price,
      })
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, packageSummary: summary }),
      })
      setEmailSent(true)
    } finally {
      setEmailLoading(false)
    }
  }

  return (
    <StepContainer
      step={9}
      title={<>Sizin için <em className="font-accent not-italic text-gold-dark italic">tasarladığımız</em> paket</>}
      footer={
        <Button variant="ghost" onClick={() => router.push('/configure/extras')}>
          <ChevronLeft size={16} />
          Geri
        </Button>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-4">
        {/* Sol: Özet */}
        <div>
          <p className="font-body text-[10px] tracking-[0.2em] uppercase text-ink/40 mb-4">H A Z I R</p>
          <SummaryRow label="Etkinlik" value={label(LABELS.context, state.context)} />
          <SummaryRow label="Tarih" value={state.date ?? 'Belirtilmedi'} />
          <SummaryRow label="Stil" value={label(LABELS.style, state.style)} />
          <SummaryRow label="Lokasyon" value={label(LABELS.location, state.location)} />
          <SummaryRow label="Süre" value={label(LABELS.duration, state.duration)} />
          <SummaryRow label="Ekip" value={label(LABELS.team, state.team)} />
          <SummaryRow label="Teslimat" value={label(LABELS.delivery, state.delivery)} />
          <SummaryRow label="Ekstralar" value={extrasList} />
        </div>

        {/* Sağ: Fiyat + CTA */}
        <div className="flex flex-col gap-6">
          {price ? (
            <div className="bg-ink rounded-[10px] p-8 text-center">
              <p className="font-body text-[10px] tracking-[0.25em] uppercase text-cream/40 mb-4">
                Y A T I R I M &nbsp; A R A L I Ğ I
              </p>
              <div className="flex items-baseline justify-center gap-2">
                <span className="font-display text-3xl md:text-4xl font-light text-cream">
                  {formatCurrency(price.min)}
                </span>
                <span className="font-body text-cream/40 text-lg">—</span>
                <span className="font-display text-3xl md:text-4xl font-light text-cream">
                  {formatCurrency(price.max)}
                </span>
              </div>
              <p className="font-accent italic text-gold-soft text-sm mt-3">
                Net teklif kişisel görüşmede netleşir.
              </p>
            </div>
          ) : (
            <div className="bg-gold-soft/20 rounded-[10px] p-8 text-center">
              <p className="font-body text-sm text-ink/60">Fiyat için birkaç adım daha tamamlayın.</p>
            </div>
          )}

          {/* WhatsApp CTA */}
          <a href={buildWAUrl()} target="_blank" rel="noopener noreferrer">
            <Button variant="whatsapp" className="gap-3">
              <MessageCircle size={18} />
              WhatsApp&apos;tan Ulaş
            </Button>
          </a>

          {/* Email Form */}
          <div className="border-t border-gold-soft/30 pt-6">
            <p className="font-accent italic text-gold-dark text-base mb-4">Sizinle tanışalım</p>

            {emailSent ? (
              <p className="font-body text-sm text-ink/60">
                Mesajınız iletildi. En kısa sürede geri dönüyoruz.
              </p>
            ) : (
              <form onSubmit={handleSubmit(onEmailSubmit)} className="flex flex-col gap-4">
                <div>
                  <label htmlFor="result-name" className="block font-body text-[10px] tracking-[0.28em] uppercase text-[#8A7F70] mb-2">
                    Ad Soyad
                  </label>
                  <input
                    id="result-name"
                    {...register('name')}
                    placeholder="Adınız"
                    className="w-full border border-[#E8DEC9] bg-[#FFFCF5] px-4 py-[14px] font-body text-sm text-ink placeholder:italic placeholder:text-[#8A7F70] focus:outline-none focus:border-[#B89968] transition-colors duration-200 rounded-[6px]"
                  />
                  {errors.name && <p className="font-body text-xs text-error mt-1">{errors.name.message}</p>}
                </div>
                <div>
                  <label htmlFor="result-email" className="block font-body text-[10px] tracking-[0.28em] uppercase text-[#8A7F70] mb-2">
                    E-posta
                  </label>
                  <input
                    id="result-email"
                    {...register('email')}
                    type="email"
                    placeholder="ornek@mail.com"
                    className="w-full border border-[#E8DEC9] bg-[#FFFCF5] px-4 py-[14px] font-body text-sm text-ink placeholder:italic placeholder:text-[#8A7F70] focus:outline-none focus:border-[#B89968] transition-colors duration-200 rounded-[6px]"
                  />
                  {errors.email && <p className="font-body text-xs text-error mt-1">{errors.email.message}</p>}
                </div>
                <div>
                  <label htmlFor="result-phone" className="block font-body text-[10px] tracking-[0.28em] uppercase text-[#8A7F70] mb-2">
                    Telefon <span className="normal-case tracking-normal">(isteğe bağlı)</span>
                  </label>
                  <input
                    id="result-phone"
                    {...register('phone')}
                    type="tel"
                    placeholder="+90 5xx xxx xx xx"
                    className="w-full border border-[#E8DEC9] bg-[#FFFCF5] px-4 py-[14px] font-body text-sm text-ink placeholder:italic placeholder:text-[#8A7F70] focus:outline-none focus:border-[#B89968] transition-colors duration-200 rounded-[6px]"
                  />
                </div>
                <button
                  type="submit"
                  disabled={emailLoading}
                  className="inline-flex items-center gap-2 self-start min-h-[44px] px-8 py-[14px] rounded-[6px] font-body font-medium text-sm cursor-pointer transition-colors duration-200 bg-[#2A2520] text-[#F7F1E6] hover:bg-[#9A7E4F] disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
                >
                  <Send size={16} />
                  {emailLoading ? 'Gönderiliyor…' : 'Gönder'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </StepContainer>
  )
}
