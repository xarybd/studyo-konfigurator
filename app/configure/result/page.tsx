'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { SummaryRow } from '@/components/SummaryRow'
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

const glassPanelStyle = {
  background: 'rgba(255,252,245,0.55)',
  backdropFilter: 'blur(18px) saturate(1.2)',
  WebkitBackdropFilter: 'blur(18px) saturate(1.2)',
  border: '1px solid rgba(184,153,104,0.25)',
  borderRadius: '16px',
  boxShadow: '0 4px 20px rgba(42,37,32,0.04), 0 24px 56px rgba(154,126,79,0.08), inset 0 1px 0 rgba(255,255,255,0.5)',
}

const inputClass = [
  'w-full px-4 py-[14px] font-body text-sm text-ink',
  'placeholder:italic placeholder:text-ink/35',
  'focus:outline-none transition-colors duration-200',
  'rounded-[8px]',
].join(' ')

const inputStyle = {
  background: 'rgba(255,252,245,0.7)',
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  border: '1px solid rgba(184,153,104,0.3)',
}

const inputFocusStyle = {
  border: '1px solid rgba(184,153,104,0.85)',
  boxShadow: '0 0 0 3px rgba(184,153,104,0.08)',
}

export default function ResultPage() {
  const router = useRouter()
  const [state] = useWizardState()
  const [emailSent, setEmailSent] = useState(false)
  const [emailLoading, setEmailLoading] = useState(false)
  const [focusedField, setFocusedField] = useState<string | null>(null)

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
    <section className="flex-1 flex flex-col items-center justify-center px-5 md:px-12 py-8 pb-16">
      <div className="w-full max-w-4xl text-center">
        <h1
          className="font-display font-light text-ink"
          style={{ fontSize: 'clamp(40px, 6vw, 72px)', lineHeight: '1.0' }}
        >
          Sizin için{' '}
          <em className="font-accent not-italic italic text-gold-dark">tasarladığımız</em>{' '}
          paket
        </h1>
        <p
          className="font-display italic text-ink/50 mt-4 max-w-lg mx-auto"
          style={{ fontSize: '16px', lineHeight: '1.6' }}
        >
          Net teklif kişisel görüşmede netleşir.
        </p>

        <div style={glassPanelStyle} className="mt-12 text-left">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Sol: Özet */}
            <div className="p-8 md:p-10 border-b lg:border-b-0 lg:border-r border-gold/20">
              <p className="font-body text-[10px] tracking-[0.28em] uppercase text-gold/70 mb-6">
                PAKET ÖZETİ
              </p>
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
            <div className="p-8 md:p-10 flex flex-col gap-6">
              {price ? (
                <div className="text-center">
                  <p className="font-body text-[10px] tracking-[0.28em] uppercase text-gold mb-4">
                    YATIRIM ARALIĞI
                  </p>
                  <p
                    className="font-display italic text-gold-dark"
                    style={{ fontSize: 'clamp(32px, 4vw, 44px)', lineHeight: '1.1' }}
                  >
                    {formatCurrency(price.min)} — {formatCurrency(price.max)}
                  </p>
                  <p
                    className="font-display italic text-ink/40 mt-3"
                    style={{ fontSize: '14px' }}
                  >
                    Net teklif kişisel görüşmede netleşir.
                  </p>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="font-body text-sm text-ink/50">Fiyat için birkaç adım daha tamamlayın.</p>
                </div>
              )}

              {/* WhatsApp CTA */}
              <a href={buildWAUrl()} target="_blank" rel="noopener noreferrer" className="block">
                <button
                  className="w-full inline-flex items-center justify-center gap-3 text-cream rounded-full cursor-pointer font-body text-[12px] tracking-[0.22em] uppercase font-medium min-h-[52px] transition-all duration-200 hover:-translate-y-0.5 hover:brightness-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
                  style={{
                    background: 'linear-gradient(135deg, #B89968, #9A7E4F)',
                    boxShadow: '0 6px 20px rgba(154,126,79,0.28)',
                  }}
                >
                  <MessageCircle size={18} strokeWidth={1.5} />
                  WHATSAPP&apos;TAN ULAŞ →
                </button>
              </a>

              {/* Email Form */}
              <div
                className="border-t pt-6"
                style={{ borderColor: 'rgba(184,153,104,0.2)' }}
              >
                <p className="font-accent italic text-gold-dark text-base mb-5">Sizinle tanışalım</p>

                {emailSent ? (
                  <p className="font-body text-sm text-ink/55">
                    Mesajınız iletildi. En kısa sürede geri dönüyoruz.
                  </p>
                ) : (
                  <form onSubmit={handleSubmit(onEmailSubmit)} className="flex flex-col gap-4">
                    {[
                      { id: 'result-name', name: 'name' as const, label: 'Ad Soyad', placeholder: 'Adınız', type: 'text' },
                      { id: 'result-email', name: 'email' as const, label: 'E-posta', placeholder: 'ornek@mail.com', type: 'email' },
                      { id: 'result-phone', name: 'phone' as const, label: 'Telefon (isteğe bağlı)', placeholder: '+90 5xx xxx xx xx', type: 'tel' },
                    ].map(({ id, name, label: fieldLabel, placeholder, type }) => (
                      <div key={id}>
                        <label htmlFor={id} className="block font-body text-[10px] tracking-[0.28em] uppercase text-ink/40 mb-2">
                          {fieldLabel}
                        </label>
                        <input
                          id={id}
                          {...register(name)}
                          type={type}
                          placeholder={placeholder}
                          className={inputClass}
                          style={{
                            ...inputStyle,
                            ...(focusedField === id ? inputFocusStyle : {}),
                          }}
                          onFocus={() => setFocusedField(id)}
                          onBlur={() => setFocusedField(null)}
                        />
                        {name === 'name' && errors.name && (
                          <p className="font-body text-xs text-error mt-1">{errors.name.message}</p>
                        )}
                        {name === 'email' && errors.email && (
                          <p className="font-body text-xs text-error mt-1">{errors.email.message}</p>
                        )}
                      </div>
                    ))}

                    <button
                      type="submit"
                      disabled={emailLoading}
                      className="inline-flex items-center gap-2 self-start min-h-[44px] px-8 py-[13px] rounded-full font-body text-[11px] tracking-[0.2em] uppercase font-medium cursor-pointer transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
                      style={{
                        background: 'transparent',
                        border: '1px solid rgba(184,153,104,0.6)',
                        color: '#2A2520',
                      }}
                    >
                      <Send size={14} strokeWidth={1.5} />
                      {emailLoading ? 'Gönderiliyor…' : 'Bilgilerimi Gönder'}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-center">
          <button
            onClick={() => router.push('/configure/extras')}
            className="inline-flex items-center gap-2 font-body text-sm text-ink/40 hover:text-ink transition-colors cursor-pointer"
          >
            <ChevronLeft size={16} />
            Geri
          </button>
        </div>
      </div>
    </section>
  )
}
