'use client'

import { ArrowRight, UserRound } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Button } from '@/components/Button'
import { useWizardState } from '@/hooks/useWizardState'
import { buildWizardUrl } from '@/lib/wizard-url'

const FIELDS = [
  { id: 'info-name', key: 'name', label: 'Ad Soyad', placeholder: 'Adınız', type: 'text', required: true },
  { id: 'info-phone', key: 'phone', label: 'Telefon', placeholder: '+90 5xx xxx xx xx', type: 'tel', required: true },
  { id: 'info-email', key: 'email', label: 'E-posta', placeholder: 'ornek@mail.com', type: 'email', required: false },
] as const

export default function InfoPage() {
  const router = useRouter()
  const [state, setState] = useWizardState()
  const [values, setValues] = useState({
    name: state.name ?? '',
    phone: state.phone ?? '',
    email: state.email ?? '',
  })
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const name = values.name.trim()
    const phone = values.phone.trim()
    const email = values.email.trim()

    if (name.length < 2 || phone.length < 8) {
      setError('Devam etmek için adınızı ve telefon numaranızı yazın.')
      return
    }

    setError('')
    const nextState = { ...state, name, phone, email }
    await setState({ name, phone, email })
    router.push(buildWizardUrl('/configure/context', nextState))
  }

  return (
    <section className="flex-1 px-4 pb-24 pt-5 sm:px-6 lg:px-14">
      <div className="mx-auto flex min-h-[calc(100svh-156px)] w-full max-w-[390px] flex-col justify-center py-7 sm:max-w-[430px] md:max-w-[760px] md:py-10">
        <div className="mx-auto w-full text-center">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-gold/20 bg-cream/55 px-3 py-1.5 font-body text-[8px] uppercase tracking-[0.18em] text-gold-dark/70 shadow-[inset_0_1px_0_rgba(255,255,255,0.72)] md:mb-5 md:px-4 md:py-2 md:text-[9px] md:tracking-[0.28em]">
            <UserRound size={13} strokeWidth={1.6} />
            Kısa tanışma
          </div>
          <h1 className="mx-auto max-w-[11ch] font-display text-[clamp(32px,9vw,56px)] font-light leading-[1.02] text-ink md:max-w-none md:text-[clamp(42px,6vw,76px)]">
            Önce sizi <em className="font-accent italic text-gold-dark">tanıyalım</em>
          </h1>
          <p className="mx-auto mt-3 max-w-[32ch] font-display text-[13px] italic leading-6 text-ink/52 md:mt-4 md:max-w-xl md:text-[16px] md:leading-7">
            Son adımda tekrar form doldurmanıza gerek kalmadan teklif mesajınızı hazırlayalım.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="panel-shine relative mx-auto mt-7 w-full overflow-hidden rounded-[22px] border border-gold/20 bg-cream/58 p-4 shadow-[0_28px_90px_rgba(42,37,32,0.09),inset_0_1px_0_rgba(255,255,255,0.76)] backdrop-blur-2xl md:mt-10 md:rounded-[14px] md:p-6"
        >
          <div className="relative grid grid-cols-1 gap-3.5 md:grid-cols-2 md:gap-4">
            {FIELDS.map((field) => (
              <div key={field.id} className={field.key === 'name' ? 'md:col-span-2' : undefined}>
                <label
                  htmlFor={field.id}
                  className="mb-2 block font-body text-[8px] uppercase tracking-[0.2em] text-gold-dark/68 md:text-[9px] md:tracking-[0.24em]"
                >
                  {field.label}
                </label>
                <input
                  id={field.id}
                  type={field.type}
                  required={field.required}
                  value={values[field.key]}
                  onChange={(e) => setValues((current) => ({ ...current, [field.key]: e.target.value }))}
                  placeholder={field.placeholder}
                  className="h-12 w-full rounded-[16px] border border-gold/20 bg-cream/58 px-4 font-body text-sm text-ink outline-none transition duration-200 placeholder:text-ink/32 focus:border-gold focus:shadow-[0_0_0_3px_rgba(184,153,104,0.1)] md:h-13 md:rounded-[10px]"
                />
              </div>
            ))}

            {error ? (
              <p className="rounded-[16px] border border-error/20 bg-error/5 p-3 font-body text-xs leading-5 text-error md:col-span-2 md:rounded-[10px]">
                {error}
              </p>
            ) : null}

            <div className="pt-1 md:col-span-2">
              <Button type="submit" className="w-full">
                Seçimlere geç
                <ArrowRight size={16} strokeWidth={1.7} />
              </Button>
            </div>
          </div>
        </form>
      </div>
    </section>
  )
}
