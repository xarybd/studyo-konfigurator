# Dış Araştırma: Teknik Sorular — En İyi Pratikler

**Tarih:** 2026-06-03
**Faz:** Phase 2 — External Research

---

## Soru 1: Next.js 15 App Router — 9-Adım URL State Yönetimi

### Yaklaşım Seçimi: Segment Route vs Search Params

**Öneri: `/configure/[step]` segment route + nuqs hibrit**

İki yaklaşım karşılaştırması:

| Kriter | Segment Route (`/configure/[step]`) | Search Params (`/configure?step=3`) |
|--------|-------------------------------------|-------------------------------------|
| Tarayıcı geri butonu | Doğal çalışır | Kontrol gerekir |
| Animasyon trigger | `useSelectedLayoutSegment` ile net | `usePathname`'den okuma |
| Deep link paylaşımı | URL anlamlı | URL çirkin |
| State complexity | Her adımdaki seçimler URL'de olmaz | Tüm wizard state URL'de olabilir |
| Server component | Adım sayfaları server component kalabilir | Daha az server component |

**Karar:** Segment route yaklaşımı + nuqs ile wizard state (seçimler) URL'de tutulur.

```
/configure/context?season=spring&style=classic&...
```

Her adımın kendi sayfası (`app/configure/[step]/page.tsx`), seçimler ise search params'ta nuqs ile yönetilir.

### nuqs Kurulumu

```tsx
// app/layout.tsx
import { NuqsAdapter } from 'nuqs/adapters/next/app'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <NuqsAdapter>{children}</NuqsAdapter>
      </body>
    </html>
  )
}
```

```tsx
// hooks/useWizardState.ts
import { useQueryStates, parseAsString, parseAsArrayOf } from 'nuqs'

export function useWizardState() {
  return useQueryStates({
    context: parseAsString,
    season: parseAsString,
    date: parseAsString,
    style: parseAsString,
    location: parseAsString,
    duration: parseAsString,
    team: parseAsString,
    delivery: parseAsString,
    extras: parseAsArrayOf(parseAsString).withDefault([]),
  }, {
    history: 'push',  // Geri butonu çalışsın
  })
}
```

### Server vs Client Component Sınırı

```
app/configure/[step]/
├── page.tsx          ← Server Component (static content, SEO)
├── StepClient.tsx    ← 'use client' (interactive, useWizardState)
└── layout.tsx        ← Server Component (ProgressBar static data)
```

**Kural:** nuqs, `useQueryState`/`useQueryStates` hook'ları için `'use client'` gerektirir. State okuma logic'i client component'te olmalı.

---

## Soru 2: Google Calendar API — Service Account Auth

### JWT Auth Akışı (OAuth Değil)

```typescript
// lib/google-calendar.ts
import { google } from 'googleapis'

function getCalendarClient() {
  const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY!)
  
  const auth = new google.auth.JWT({
    email: credentials.client_email,
    key: credentials.private_key,
    scopes: ['https://www.googleapis.com/auth/calendar.readonly'],
  })
  
  return google.calendar({ version: 'v3', auth })
}
```

### Vercel'de JSON Key Saklama

**Problem:** Private key içindeki `\n` karakterleri Vercel env'de bozulabilir.

**Çözüm A (Önerilen):** JSON'u tek satıra sıkıştır, Vercel'e yapıştır:
```bash
cat service-account.json | jq -c .
```

Parse ederken private key düzelt:
```typescript
const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY!)
// Vercel bazen \n'i \\n olarak saklar, düzelt:
const privateKey = credentials.private_key.replace(/\\n/g, '\n')
```

**Çözüm B:** Base64 encode edip saklama:
```bash
base64 -w 0 service-account.json
```
```typescript
const credentials = JSON.parse(
  Buffer.from(process.env.GOOGLE_SERVICE_ACCOUNT_KEY_B64!, 'base64').toString()
)
```

### Service Account'a Calendar Erişimi Verme

1. Google Cloud Console'da Service Account oluştur
2. `https://www.googleapis.com/auth/calendar.readonly` scope'unu ver
3. Google Calendar'da → Settings → Share with specific people
4. Service account e-postasını ekle (`something@project.iam.gserviceaccount.com`)
5. "See all event details" iznini ver

---

## Soru 3: Google Calendar freebusy Query — 3 Aylık Batch

### Tek API Call ile 3 Ay Sorgulama

```typescript
// app/api/availability/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { unstable_cache } from 'next/cache'
import { google } from 'googleapis'

const SEASON_MONTHS: Record<string, number[]> = {
  spring: [3, 4, 5],    // Mart, Nisan, Mayıs
  summer: [6, 7, 8],    // Haziran, Temmuz, Ağustos
  autumn: [9, 10, 11],  // Eylül, Ekim, Kasım
  winter: [12, 1, 2],   // Aralık, Ocak, Şubat
}

function getSeasonWindow(season: string, year: number) {
  const months = SEASON_MONTHS[season]
  const startMonth = months[0]
  const endMonth = months[2]
  
  // Kış mevsimi yıl geçiş durumu
  const startYear = startMonth === 12 ? year : year
  const endYear = endMonth < startMonth ? year + 1 : year
  
  const timeMin = new Date(startYear, startMonth - 1, 1).toISOString()
  const timeMax = new Date(endYear, endMonth, 0, 23, 59, 59).toISOString()
  
  return { timeMin, timeMax }
}

const getCachedAvailability = unstable_cache(
  async (season: string, calendarId: string) => {
    const { timeMin, timeMax } = getSeasonWindow(season, new Date().getFullYear())
    
    const calendar = getCalendarClient()
    const response = await calendar.freebusy.query({
      requestBody: {
        timeMin,
        timeMax,
        timeZone: 'Europe/Istanbul',
        items: [{ id: calendarId }],
      },
    })
    
    const busySlots = response.data.calendars?.[calendarId]?.busy ?? []
    
    // Dolu günleri Set'e dönüştür
    const busyDays = new Set<string>()
    for (const slot of busySlots) {
      if (slot.start && slot.end) {
        const start = new Date(slot.start)
        const end = new Date(slot.end)
        const current = new Date(start)
        while (current <= end) {
          busyDays.add(current.toISOString().split('T')[0]) // YYYY-MM-DD
          current.setDate(current.getDate() + 1)
        }
      }
    }
    
    return { busyDays: Array.from(busyDays), timeMin, timeMax }
  },
  ['freebusy'],
  { revalidate: 3600 } // 1 saat cache
)

export async function GET(request: NextRequest) {
  const season = request.nextUrl.searchParams.get('season') ?? 'spring'
  const calendarId = process.env.GOOGLE_CALENDAR_ID!
  
  const result = await getCachedAvailability(season, calendarId)
  return NextResponse.json(result)
}
```

### Cache Stratejisi

- `unstable_cache` ile 1 saat TTL (mevsim bazında cache key)
- Alternatif: ISR ile `revalidate = 3600` (Route Handler'da)
- API quota: Calendar API günlük 1,000,000 request — yeterli

---

## Soru 4: WhatsApp Deep Link — URL Encoding

### Temel Format

```
https://wa.me/{ülke kodu + numara}?text={encodeURIComponent(mesaj)}
```

Türkiye için: `https://wa.me/905XXXXXXXXX?text=...`

### Türkçe Karakter Encoding

`encodeURIComponent()` tüm Türkçe karakterleri doğru encode eder:

| Karakter | Unicode | URL Encoded |
|---------|---------|-------------|
| ğ | ğ | %C4%9F |
| ü | ü | %C3%BC |
| ş | ş | %C5%9F |
| ı | ı | %C4%B1 |
| ö | ö | %C3%B6 |
| ç | ç | %C3%A7 |

### Mesaj Uzunluk Sınırları

- WhatsApp session mesajları: 4096 karakter
- wa.me URL parametresi: tarayıcı URL uzunluk limiti (~2000 karakter önerilir)
- Proje için tahmini mesaj: ~300-400 karakter (8 alan + fiyat)

### Proje Mesaj Şablonu (PDF slide 16)

```typescript
function buildWhatsAppMessage(state: WizardState, price: PriceRange): string {
  const lines = [
    'Merhaba, web sitesi konfigüratörü üzerinden paket tasarladım.',
    `Ad: ${state.name}`,
    `Mail: ${state.email}`,
    '— Paket Özeti —',
    `Etkinlik: ${LABELS.context[state.context]}`,
    `Tarih: ${state.date ?? 'Belirtilmedi'}`,
    `Stil: ${LABELS.style[state.style]}`,
    `Lokasyon: ${LABELS.location[state.location]}`,
    `Süre: ${LABELS.duration[state.duration]}`,
    `Ekip: ${LABELS.team[state.team]}`,
    `Teslimat: ${LABELS.delivery[state.delivery]}`,
    `Ekstralar: ${state.extras.map(e => LABELS.extras[e]).join(', ') || 'Yok'}`,
    `Yatırım: ${price.min.toLocaleString('tr-TR')}₺ — ${price.max.toLocaleString('tr-TR')}₺`,
    'Görüşme için uygun olduğunuzda dönebilir misiniz?',
  ]
  
  return lines.join('\n')
}

function buildWhatsAppURL(phone: string, message: string): string {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
}
```

### iOS vs Android Farkı

- iOS: `whatsapp://send?phone=90...&text=...` deep link uygulamayı doğrudan açar
- Android: `https://wa.me/...` evrensel link (hem web hem uygulama)
- **Öneri:** `wa.me` formatını kullan — her ikisinde de çalışır, web fallback var

---

## Soru 5: shadcn/ui — Tailwind v4 Uyumu

### @theme Inline Yaklaşımı (Önerilen)

shadcn/ui Tailwind v4 ile CSS-first config kullanır:

```css
/* globals.css */
@import "tailwindcss";

:root {
  /* Ham değerler */
  --background: #F7F1E6;
  --foreground: #2A2520;
  --primary: #B89968;
  --primary-dark: #9A7E4F;
  --primary-soft: #D9C39A;
}

@theme inline {
  /* Tailwind utility class → CSS variable bağlantısı */
  --color-cream: var(--background);
  --color-ink: var(--foreground);
  --color-gold: var(--primary);
  --color-gold-dark: var(--primary-dark);
  --color-gold-soft: var(--primary-soft);
  
  --font-display: 'Cormorant Garamond', Georgia, serif;
  --font-accent: 'Italiana', Georgia, serif;
  --font-body: 'Inter', system-ui, sans-serif;
}
```

### shadcn/ui Kurulum (Tailwind v4 ile)

```bash
npx shadcn@latest init
# Tailwind v4 tespit edilir, otomatik olarak CSS-first config kullanılır
```

### Önemli Değişiklikler (v3'ten farklı)

1. `tailwind.config.ts` yoktur — tüm config `globals.css` içinde
2. Renkler HSL yerine HEX/OKLCH olabilir
3. `size-*` utility: `w-* h-*` kombinasyonunu değiştirir
4. `forwardRef` bileşenleri `data-slot` attribute kullanır
5. Toast bileşeni → Sonner ile değiştirildi

### Hangi shadcn Bileşenleri Kullanılacak

```bash
npx shadcn@latest add button form input label badge dialog popover
```

---

## Soru 6: Framer Motion — Route Transition vs Step Transition

### App Router'da Önerilen Pattern

**FrozenRouter + LayoutTransition** yaklaşımı:

```tsx
// components/PageTransition.tsx
'use client'
import { useContext, useRef } from 'react'
import { AnimatePresence, LazyMotion, domAnimation, m } from 'framer-motion'
import { useSelectedLayoutSegment } from 'next/navigation'
import { LayoutRouterContext } from 'next/dist/shared/lib/app-router-context.shared-runtime'

function usePreviousValue<T>(value: T) {
  const prevRef = useRef(value)
  const currentRef = useRef(value)
  if (currentRef.current !== value) {
    prevRef.current = currentRef.current
    currentRef.current = value
  }
  return prevRef.current
}

function FrozenRouter({ children }: { children: React.ReactNode }) {
  const context = useContext(LayoutRouterContext)
  const segment = useSelectedLayoutSegment()
  const prevSegment = usePreviousValue(segment)
  const frozen = segment !== prevSegment
  return (
    <LayoutRouterContext.Provider value={frozen ? context : context}>
      {children}
    </LayoutRouterContext.Provider>
  )
}

export function PageTransition({ children }: { children: React.ReactNode }) {
  const segment = useSelectedLayoutSegment()
  
  return (
    <LazyMotion features={domAnimation}>
      <AnimatePresence mode="wait">
        <m.div
          key={segment}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        >
          <FrozenRouter>{children}</FrozenRouter>
        </m.div>
      </AnimatePresence>
    </LazyMotion>
  )
}
```

```tsx
// app/configure/layout.tsx
import { PageTransition } from '@/components/PageTransition'

export default function ConfigureLayout({ children }) {
  return <PageTransition>{children}</PageTransition>
}
```

### LazyMotion ile Bundle Optimizasyonu

```tsx
// Tam framer-motion import: ~34kb
import { motion, AnimatePresence } from 'framer-motion'

// Optimized: initial ~4.6kb + domAnimation 15kb = ~20kb
import { LazyMotion, domAnimation, m, AnimatePresence } from 'framer-motion'
```

**Kural:** `motion.div` yerine `m.div` kullan + `LazyMotion` wrapper ekle.

### prefers-reduced-motion

```tsx
import { useReducedMotion } from 'framer-motion'

export function AnimatedCard({ children }) {
  const shouldReduce = useReducedMotion()
  
  return (
    <m.div
      whileHover={shouldReduce ? {} : {
        y: -4,
        rotateY: 3,
        rotateX: 2,
        transition: { duration: 0.3 }
      }}
    >
      {children}
    </m.div>
  )
}
```

---

## Soru 7: Türkçe Font Subset Stratejisi

### next/font/google ile Kurulum

```tsx
// app/layout.tsx
import { Cormorant_Garamond, Italiana, Inter } from 'next/font/google'

const cormorant = Cormorant_Garamond({
  subsets: ['latin', 'latin-ext'],  // latin-ext Türkçe karakterleri içerir
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-display',
  display: 'swap',
  preload: true,  // LCP için kritik
})

const italiana = Italiana({
  subsets: ['latin'],  // Italiana sadece Latin kullanır (Türkçe kelimelerde kullanılmaz)
  weight: ['400'],
  variable: '--font-accent',
  display: 'swap',
  preload: false,  // Accent font — kritik değil
})

const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-body',
  display: 'swap',
  preload: true,  // Body text — kritik
})

export default function RootLayout({ children }) {
  return (
    <html lang="tr" className={`${cormorant.variable} ${italiana.variable} ${inter.variable}`}>
      <body>{children}</body>
    </html>
  )
}
```

### Türkçe Karakterler ve latin-ext

- **latin** subset: A-Z, temel noktalama
- **latin-ext** subset: ğ, ü, ş, ı, ö, ç ve diğer genişletilmiş Latin karakterler
- **Sonuç:** `subsets: ['latin', 'latin-ext']` hem Cormorant Garamond hem Inter için zorunlu

### Cormorant Garamond — Variable Font

- Weights 300-700 arası variable font olarak mevcut
- `next/font/google` otomatik olarak variable font dosyasını tercih eder
- Birden fazla weight belirtmek gerekli (variable range belirtmek için)

### Font Boyut Tahmini

| Font | Subset | Weights | Tahmini Boyut |
|------|--------|---------|---------------|
| Cormorant Garamond | latin + latin-ext | 300,400,500,600 + italic | ~80-100kb |
| Italiana | latin | 400 | ~20-30kb |
| Inter | latin + latin-ext | (variable) | ~150-180kb |
| **Toplam** | | | **~250-310kb** |

`next/font` bu dosyaları Vercel CDN üzerinden serve eder, preload ile kritik fontlar önce yüklenir.

### display: 'swap' vs 'optional'

- `display: 'swap'` → Fallback göster, font yüklenince değiştir (görsel flash olabilir)
- `display: 'optional'` → Yavaş bağlantıda fallback kullanmaya devam eder, flash yok
- **Öneri:** `display: 'swap'` Cormorant ve Inter için — editöryal his için font doğruluğu önemli

---

## Soru 8: Mobil CalendarGrid — 375px'de 3 Ay Stratejisi

### Önerilen Yaklaşım: Dikey Stack (Mobil) + 3 Sütun (Masaüstü)

**Neden dikey stack:**
- 375px - 48px padding = 327px / 7 sütun = ~46.7px/hücre
- 44px minimum touch target sınırında — tek ay için bile sıkışık
- 3 ay yatayda: imkânsız

```tsx
// CalendarGrid.tsx
export function CalendarGrid({ months }: { months: MonthData[] }) {
  return (
    <div className="
      grid grid-cols-1 gap-8         /* Mobil: dikey stack */
      md:grid-cols-3 md:gap-6        /* Masaüstü: 3 sütun */
    ">
      {months.map(month => (
        <MonthGrid key={month.key} month={month} />
      ))}
    </div>
  )
}
```

### Türkçe Haftanın Günleri (Tek Harf)

```typescript
const WEEKDAYS_TR = ['P', 'S', 'Ç', 'P', 'C', 'C', 'P']
// Pazartesi, Salı, Çarşamba, Perşembe, Cuma, Cumartesi, Pazar
```

**Not:** Cuma ve Cumartesi için 'C' tekrarlanıyor — yeterli (takvim konvansiyonu olarak kabul edilir, bağlamdan anlaşılır).

### Hücre Boyutu

```tsx
// MonthGrid içinde gün hücresi
<button
  className="
    w-full aspect-square                    /* Kare hücre */
    min-h-[44px] min-w-[44px]              /* Touch target */
    flex items-center justify-center
    font-body text-sm
    rounded-sm                              /* Editorial köşe */
    transition-colors duration-150
    disabled:opacity-30 disabled:cursor-not-allowed disabled:line-through
    hover:bg-gold/10 hover:border hover:border-gold
    data-[selected=true]:bg-gold data-[selected=true]:text-cream
    data-[selected=true]:rounded-full       /* Seçili gün: daire */
  "
>
  {day}
</button>
```

### "Henüz Net Değil" Mevsim Durumu

Kullanıcı "henüz net değil" seçerse:
- Seçenek A: Takvim adımını atla (recommended for MVP)
- Seçenek B: Tüm yılı göster (karmaşık, 12 ay)
- **Öneri:** Takvim adımını atla, tarih bilgisi "Belirtilmedi" olarak geçsin

### react-day-picker Değerlendirmesi

| Kriter | react-day-picker | Sıfırdan Yazma |
|--------|-----------------|----------------|
| A11y | Kapsamlı ARIA | Manuel eklemek gerekir |
| Özelleştirme | CSS classNames ile override | Tam kontrol |
| Bağımlılık | +1 paket (~50kb) | 0 |
| Türkçe locale | `tr` locale var | Manuel |
| Bu proje için | Gereksiz — tasarım çok özel | Tercih edilir |

**Karar:** Sıfırdan yaz. Tasarım ihtiyaçları (Frosted Parchment, freebusy entegrasyonu, 3 ay layout) özel component gerektiriyor. react-day-picker'ın sağladığı kazanım az, override maliyeti yüksek.
