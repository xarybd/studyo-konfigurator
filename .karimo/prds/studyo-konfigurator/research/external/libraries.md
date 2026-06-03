# Dış Araştırma: Kütüphane Değerlendirmeleri

**Tarih:** 2026-06-03
**Faz:** Phase 2 — External Research

---

## 1. nuqs (URL State Management)

**npm:** `nuqs`
**Versiyon:** 2.x
**GitHub:** github.com/47ng/nuqs

### Değerlendirme

| Kriter | Puan | Notlar |
|--------|------|--------|
| Kullanım kolaylığı | 5/5 | useState gibi API |
| Next.js 15 uyumu | 5/5 | Resmi App Router adaptörü var |
| Bundle boyutu | 5/5 | ~3kb gzip |
| Type safety | 5/5 | End-to-end TypeScript |
| History kontrolü | 5/5 | push/replace seçeneği |
| Server Component | 5/5 | RSC'den okuma desteği |

### Öneri: KULLAN

Bu proje için ideal. 9 adımlı wizard'da tüm seçimleri URL'de tutmak:
- Sayfayı yenilemede state kaybolmaz
- WhatsApp mesajına link eklenebilir (deep link)
- Tarayıcı geri butonu wizard adımlarını geri alır

```tsx
// Kullanım örneği
const [wizardState, setWizardState] = useQueryStates({
  context: parseAsString,
  season: parseAsString,
  style: parseAsString,
  // ...
}, { history: 'push' })
```

---

## 2. Framer Motion

**npm:** `framer-motion` (veya yeni adıyla `motion`)
**Versiyon:** 11.x
**Docs:** motion.dev

### Değerlendirme

| Kriter | Puan | Notlar |
|--------|------|--------|
| Animasyon kapasitesi | 5/5 | Tam özellikli |
| Next.js uyumu | 4/5 | App Router'da setup gerektirir |
| Bundle boyutu | 3/5 | 34kb — LazyMotion ile 20kb'a düşer |
| prefers-reduced-motion | 5/5 | `useReducedMotion` hook |
| Parallax support | 5/5 | `useMotionValue`, `useTransform` |
| Learning curve | 3/5 | Orta düzey öğrenme |

### Öneri: KULLAN — LazyMotion ile

Parallax hover için `useMotionValue` + `useTransform` kullanılacak:

```tsx
import { m, useMotionValue, useTransform, LazyMotion, domAnimation } from 'framer-motion'

function ParallaxCard({ children }) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotateY = useTransform(x, [-100, 100], [-5, 5])
  const rotateX = useTransform(y, [-100, 100], [5, -5])
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    x.set(e.clientX - rect.left - rect.width / 2)
    y.set(e.clientY - rect.top - rect.height / 2)
  }
  
  return (
    <m.div
      style={{ rotateY, rotateX, perspective: 1000 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => { x.set(0); y.set(0) }}
    >
      {children}
    </m.div>
  )
}
```

**Kritik:** `LazyMotion` wrapper zorunlu (bundle boyutu için), `motion.div` yerine `m.div` kullan.

---

## 3. react-hook-form + zod

**npm:** `react-hook-form`, `zod`, `@hookform/resolvers`
**Versiyon:** RHF 7.x, zod 3.x

### Değerlendirme

| Kriter | Puan | Notlar |
|--------|------|--------|
| Bundle boyutu | 5/5 | RHF ~9kb gzip |
| TypeScript | 5/5 | Tam type safe |
| Validasyon | 5/5 | zod schema ile güçlü |
| shadcn/ui uyumu | 5/5 | Resmi shadcn Form bileşeni RHF kullanır |
| Re-render optimizasyonu | 5/5 | Uncontrolled inputs |

### Öneri: KULLAN (Sonuç ekranı email formu için)

```tsx
// Sonuç ekranı email formu schema
const contactSchema = z.object({
  name: z.string().min(2, 'En az 2 karakter'),
  email: z.string().email('Geçerli bir e-posta adresi giriniz'),
  phone: z.string().optional(),
})
```

---

## 4. googleapis + google-auth-library

**npm:** `googleapis`, `google-auth-library`
**Versiyon:** googleapis 144.x

### Değerlendirme

| Kriter | Puan | Notlar |
|--------|------|--------|
| Resmiyet | 5/5 | Google tarafından desteklenen |
| Service account | 5/5 | JWT auth built-in |
| Bundle boyutu | 2/5 | Büyük paket, server-only |
| TypeScript | 4/5 | Tip tanımları mevcut |
| Tree-shaking | 3/5 | Bireysel API import ile kısmi |

### Öneri: KULLAN — Server-Only (Route Handler)

```typescript
// Next.js direktifi ile server-only zorla
import 'server-only'
import { google } from 'googleapis'
```

**Alternatif değerlendirme:** `@googleapis/calendar` (tree-shakeable versiyon)

```bash
npm install @googleapis/calendar
# Sadece Calendar API kodu gelir, tüm googleapis değil
```

Bu alternatif daha küçük bundle üretir.

---

## 5. Resend

**npm:** `resend`
**Versiyon:** 4.x
**Docs:** resend.com/docs

### Değerlendirme

| Kriter | Puan | Notlar |
|--------|------|--------|
| Setup kolaylığı | 5/5 | 3 satır kod |
| Next.js uyumu | 5/5 | Route Handler örneği dokümantasyonda |
| Ücretsiz plan | 4/5 | 3000/ay yeterli (MVP için) |
| React Email | 5/5 | JSX ile email şablonu |
| Türkiye deliverability | 4/5 | Global altyapı, iyi |

### Öneri: KULLAN

```typescript
// app/api/contact/route.ts
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  const { name, email, message } = await request.json()
  
  await resend.emails.send({
    from: 'konfigüratör@stüdyo.com',
    to: process.env.STUDIO_EMAIL!,
    subject: `Yeni paket isteği — ${name}`,
    text: message,
  })
  
  return Response.json({ success: true })
}
```

---

## 6. shadcn/ui

**Tür:** Component kopyalama sistemi (npm paketi değil)
**Kurulum:** `npx shadcn@latest add [component]`
**Versiyon:** 0.9+ (Tailwind v4 desteği)

### Kullanılacak Bileşenler

| Bileşen | Neden | Not |
|---------|-------|-----|
| `form` + `input` + `label` | A11y, RHF wrapper | Özelleştirme gerekiyor |
| `button` | Radix primitive base | Tamamen override edilecek |
| `badge` | Ekstralar seçili state | Minimal override |
| `dialog` | Focus trap, ARIA | Animate override |
| `popover` | Radix primitive | İsteğe bağlı |

### Kullanılmayacaklar (Elle Yazılacak)

- `card` → Frosted Parchment efekti özel
- `calendar` → react-day-picker bağımlılığı + tasarım uyumsuzluğu
- `progress` → 2px çizgi, segment tasarımı özel
- `separator` → tek satır CSS ile yapılır

---

## 7. react-day-picker

**npm:** `react-day-picker`

### Değerlendirme

| Kriter | Puan | Notlar |
|--------|------|--------|
| Özelleştirme | 3/5 | classNames API var ama sınırlı |
| Bundle boyutu | 3/5 | ~50kb |
| A11y | 5/5 | Kapsamlı ARIA |
| Türkçe locale | 5/5 | `tr` locale built-in |
| 3 ay layout | 2/5 | `numberOfMonths` var ama mobile layout özel gerektirir |
| Frosted Parchment uyumu | 1/5 | Tamamen override gerekir |

### Öneri: KULLANMA

Sıfırdan `CalendarGrid.tsx` yaz. Tasarım ihtiyaçları (3 ay, freebusy state, Frosted Parchment hücre stili, parallax hover) react-day-picker'ın sağladığından çok daha özel. Override maliyeti sıfırdan yazmaktan yüksek.

---

## Sonuç: Onaylanan Paket Listesi

```json
{
  "dependencies": {
    "next": "^15.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "nuqs": "^2.0.0",
    "framer-motion": "^11.0.0",
    "react-hook-form": "^7.0.0",
    "zod": "^3.0.0",
    "@hookform/resolvers": "^3.0.0",
    "@googleapis/calendar": "^9.0.0",
    "google-auth-library": "^9.0.0",
    "resend": "^4.0.0"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "@types/react": "^19.0.0",
    "@types/node": "^20.0.0",
    "tailwindcss": "^4.0.0",
    "@tailwindcss/typography": "^0.5.0"
  }
}
```

**shadcn/ui bileşenleri** (CLI ile eklenir, pakete yazılmaz):
`button form input label badge dialog popover`
