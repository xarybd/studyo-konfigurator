# İç Araştırma: Bağımlılık Haritası

**Tarih:** 2026-06-03
**Kaynak:** research-brief.txt + prompt.txt + MASTER.md

---

## npm Bağımlılıkları ve İlişkileri

### Runtime Dependencies

| Paket | Versiyon (Hedef) | Kullanım Alanı | İlişki |
|-------|-----------------|----------------|--------|
| `next` | 15.x | Framework, App Router, Route Handlers | Merkez — tüm paketler buna bağlı |
| `react` | 19.x | UI primitifleri | next'in peer dependency |
| `react-dom` | 19.x | DOM rendering | react'ın peer dependency |
| `tailwindcss` | 4.x | Stil sistemi (CSS-first config) | next ile entegre |
| `framer-motion` | 11.x | Adım geçişleri, kart parallax, hover animasyonları | React bağımlı |
| `react-hook-form` | 7.x | Sonuç ekranı email formu + validasyon | Bağımsız |
| `zod` | 3.x | Form schema validasyonu | react-hook-form resolver'ı |
| `@hookform/resolvers` | 3.x | zod ↔ react-hook-form köprüsü | İkisine de bağlı |
| `resend` | 4.x | Server-side email gönderimi | Next.js Route Handler içinde |
| `googleapis` | 144.x | Google Calendar API (service account) | Sadece server-side |
| `google-auth-library` | 9.x | JWT service account auth | googleapis'nin peer dependency |

### Dev Dependencies

| Paket | Kullanım |
|-------|---------|
| `typescript` | Type safety |
| `@types/react` | React type definitions |
| `@types/node` | Node.js type definitions |
| `eslint` | Linting |
| `eslint-config-next` | Next.js ESLint kuralları |
| `prettier` | Code formatting |

### shadcn/ui Bileşenleri (CLI ile eklenen)

shadcn/ui kütüphane değil, component kopyalama sistemi:

| Bileşen | `npx shadcn add` komutu | Kullanım |
|---------|------------------------|---------|
| `button` | `shadcn add button` | Temel buton (override edilecek) |
| `dialog` | `shadcn add dialog` | Adım geçişi modal (ihtiyaç durumunda) |
| `form` | `shadcn add form` | Email form (react-hook-form wrapper) |
| `input` | `shadcn add input` | Form input |
| `label` | `shadcn add label` | Form label |
| `badge` | `shadcn add badge` | Ekstralar seçili state etiketi |
| `popover` | `shadcn add popover` | CalendarGrid tooltip (isteğe bağlı) |

**Elle yazılacaklar (shadcn kullanılmaz):**
- `Card` — tam özel, Frosted Parchment efekti + parallax
- `ProgressBar` — 2px ince çizgi, özel stil
- `PriceDisplay` — özel layout
- `SummaryRow` — basit flex row
- `CalendarGrid` — 3 ay, freebusy entegrasyonu
- `StepContainer` — sayfa çerçevesi

## Bağımlılık Grafiği

```
next (15)
├── react (19)
├── tailwindcss (4) → CSS custom properties → design tokens
├── framer-motion → AnimatePresence, motion.div, useReducedMotion
│   └── LazyMotion + domAnimation (bundle optimization)
├── googleapis → CalendarAPI
│   └── google-auth-library → JWT (service account)
│       └── GOOGLE_SERVICE_ACCOUNT_KEY (env var, Vercel secret)
├── react-hook-form
│   └── @hookform/resolvers → zod
│       └── zod (schema)
└── resend → Route Handler (/api/contact)

shadcn/ui (component source code)
└── @radix-ui primitives (a11y)
    ├── @radix-ui/react-dialog
    ├── @radix-ui/react-popover
    └── @radix-ui/react-label
```

## Kritik Bağımlılık Notları

### Tailwind CSS v4 — Önemli Fark

v4'te `tailwind.config.ts` yerine CSS-first config kullanılır:

```css
/* globals.css */
@import "tailwindcss";

@theme {
  --color-cream: #F7F1E6;
  --color-gold: #B89968;
  --color-gold-dark: #9A7E4F;
  --color-ink: #2A2520;
  --color-gold-soft: #D9C39A;
  
  --font-display: 'Cormorant Garamond', Georgia, serif;
  --font-accent: 'Italiana', Georgia, serif;
  --font-body: 'Inter', system-ui, sans-serif;
}
```

MASTER.md'deki `tailwind.config.ts` kodu v3 syntax — v4'e migration gerekiyor.

### shadcn/ui + Tailwind v4 Uyumu

shadcn/ui v0.9+ Tailwind v4'ü destekler. CSS variables tabanlı theming kullanır:
```css
/* shadcn convention */
--background: var(--color-cream);
--foreground: var(--color-ink);
--primary: var(--color-gold);
```

### googleapis — Server-Only Zorunluluğu

`googleapis` paketi:
- **Yalnızca** Next.js Route Handler veya Server Action içinde kullanılabilir
- Client component'e import edilemez (Node.js bağımlılıkları var)
- Environment variable: `GOOGLE_SERVICE_ACCOUNT_KEY` (Vercel'de JSON string)

### Framer Motion — App Router Uyumluluk Notu

`AnimatePresence` Next.js 15 App Router'da layout.tsx içinde kullanımı sorunlu olabilir:
- Client component olarak işaretlenmesi gerekir (`"use client"`)
- `usePathname` hook'u ile key prop gerekir
- Alternatif: CSS transitions kullanmak (Framer Motion yerine)

## studio.config.ts Bağımlılığı

Bu dosya henüz yazılmamış ama tüm bileşenler buna bağımlı olacak:

```typescript
// Beklenen yapı (araştırma önerisi)
export const studioConfig = {
  // Fiyat motoru
  BASE: { wedding: 45000, engagement: 12000, family: 8000 },
  STYLE_MULT: { classic: 1.0, modern: 1.0, natural: 1.0, vintage: 1.08 },
  DURATION_MULT: { ceremony: 0.55, half: 1.0, full: 1.55, multi: 2.30 },
  TEAM_MULT: { solo: 1.0, duo: 1.30, trio: 1.50 },
  DELIVERY_ADD: { digital: 0, album: 8500, video: 14000, complete: 28000 },
  EXTRAS_ADD: {
    drone: 6000,
    fullVideo: 22000,
    photobook: 9000,
    engagement: 11000,
    preparation: 7000,
  },
  PRICE_RANGE_FACTOR: { low: 0.88, high: 1.12 },
  PRICE_ROUNDING: 500,
  
  // Görsel
  backgroundTexture: 'film-grain' as 'none' | 'film-grain' | 'sky' | 'sand' | 'paper',
  
  // İletişim
  whatsappNumber: '905XXXXXXXXX',
  resendApiKey: process.env.RESEND_API_KEY,
}
```

## Environment Variables (Vercel)

| Değişken | Tür | Açıklama |
|---------|-----|---------|
| `GOOGLE_SERVICE_ACCOUNT_KEY` | JSON string | Service account kimlik bilgileri |
| `GOOGLE_CALENDAR_ID` | string | Stüdyo takviminin calendar ID'si |
| `RESEND_API_KEY` | string | Resend e-posta API anahtarı |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | string | WhatsApp numarası (client-side erişilebilir) |
| `NEXT_PUBLIC_STUDIO_NAME` | string | Stüdyo adı (client-side) |
