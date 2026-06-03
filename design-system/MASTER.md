# MASTER Design System
## Stüdyo Konfigüratör — Düğün & Özel Gün Fotoğrafçılığı

> **Global Kaynak.** Sayfa bazlı overridelar için `design-system/pages/<sayfa>.md` dosyalarına bakın.
> Çakışma durumunda sayfa dosyası kazanır; yoksa bu dosya geçerlidir.

---

## 1. Design Pattern — 9 Adımlı Lineer Akış

### Konsept
Photography + Booking endüstrilerinin kesişiminde, çiftlerin kendi paketlerini adım adım inşa ettiği **lineer wizard akışı**. Her adım bir karar noktasıdır; ilerleme hissi ve anlık fiyat görünümü satın alma motivasyonunu artırır.

### Adım Haritası

| # | Adım | Slug | Bağlam |
|---|------|------|--------|
| 1 | Bağlam | `/context` | Düğün mü, nişan mı, özel gün mü? |
| 2 | Tarih | `/date` | Takvim seçimi, müsaitlik kontrolü |
| 3 | Stil | `/style` | Görsel estetik: klasik, fine art, belgesel, modern |
| 4 | Lokasyon | `/location` | İç mekan, dış mekan, stüdyo, doğa, şehir |
| 5 | Süre | `/duration` | Çekim saati: 2h / 4h / 6h / tam gün |
| 6 | Ekip | `/team` | Fotoğrafçı sayısı, asistan, video |
| 7 | Teslimat | `/delivery` | Dijital / albüm / canvas, teslim süresi |
| 8 | Ekstralar | `/extras` | Drone, photo booth, baskı, video clip |
| 9 | Sonuç | `/result` | Paket özeti, fiyat aralığı, WhatsApp CTA |

### Akış Kuralları

- **Tek odak ilkesi:** Her adımda sadece bir karar. Karmaşık form yok.
- **Otomatik ilerleme:** Kart seçimi → 300ms bekleme → fade-out → sonraki adım fade-in.
- **Geri navigasyon:** Her zaman erişilebilir; ProgressBar tıklanabilir (tamamlanan adımlar).
- **Fiyat kuşağı:** Adım 4'ten itibaren sağ alt köşede kalıcı `PriceDisplay` görünür.
- **Result screen:** WhatsApp butonuyla stüdyoya seçim özetini ileten deep-link mesaj.

### Sayfa Yapısı

```
┌─────────────────────────────────────────┐
│  Logo          ProgressBar (1/9)        │
├─────────────────────────────────────────┤
│                                         │
│   StepContainer                         │
│     StepTitle (Cormorant Garamond)      │
│     StepSubtitle (Inter, muted)         │
│                                         │
│     ┌──────┐  ┌──────┐  ┌──────┐       │
│     │ Card │  │ Card │  │ Card │       │
│     └──────┘  └──────┘  └──────┘       │
│                                         │
├─────────────────────────────────────────┤
│  ← Geri        [Fiyat: ₺X–₺Y]         │
└─────────────────────────────────────────┘
```

---

## 2. Renk Paleti

### Zorunlu Renkler

| Token | Hex | Kullanım |
|-------|-----|---------|
| `cream` | `#F7F1E6` | Sayfa arkaplanı |
| `gold` | `#B89968` | Primary CTA, seçili kart border, ProgressBar dolu |
| `gold-dark` | `#9A7E4F` | Hover state, vurgu ikonlar |
| `ink` | `#2A2520` | Ana metin, başlıklar |
| `gold-soft` | `#D9C39A` | Disabled state, ince ayırıcılar, placeholder |

### Tailwind CSS v4 Config

```ts
// tailwind.config.ts
import type { Config } from 'tailwindcss'

export default {
  theme: {
    extend: {
      colors: {
        cream:     '#F7F1E6',
        gold: {
          DEFAULT: '#B89968',
          dark:    '#9A7E4F',
          soft:    '#D9C39A',
        },
        ink:       '#2A2520',
      },
    },
  },
} satisfies Config
```

### CSS Değişkenleri (globals.css)

```css
:root {
  --color-cream:     #F7F1E6;
  --color-gold:      #B89968;
  --color-gold-dark: #9A7E4F;
  --color-ink:       #2A2520;
  --color-gold-soft: #D9C39A;
}
```

### Renk Kullanım Kuralları

- Arkaplan her zaman `cream`. Beyaz kullanılmaz.
- Seçili/aktif durum: `gold` border + hafif `gold-soft/20` fill.
- Metin hiyerarşisi: `ink` (birincil) → `ink/70` (ikincil) → `gold-soft` (placeholder).
- CTA butonları: `gold` bg + `cream` metin; hover → `gold-dark`.
- Hata durumu: `#B04A2F` (krem üzerinde 4.5:1 oranı karşılar, `gold` tonuyla uyumlu).

---

## 3. Tipografi Skalası

### Font Ailesi

| Rol | Font | Kullanım |
|-----|------|---------|
| `display` | Cormorant Garamond | H1, H2, kart başlıkları, adım başlıkları |
| `accent` | Italiana | İtalik vurgular, özel etiketler, alıntılar |
| `body` | Inter | Body text, UI etiketleri, form alanları, fiyatlar |

### Google Fonts Import

```css
/* app/layout.tsx veya globals.css */
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Italiana&family=Inter:wght@300;400;500;600&display=swap');
```

### Tailwind Font Config

```ts
fontFamily: {
  display: ['Cormorant Garamond', 'Georgia', 'serif'],
  accent:  ['Italiana', 'Georgia', 'serif'],
  body:    ['Inter', 'system-ui', 'sans-serif'],
},
```

### Tipografi Skalası

| Token | Sınıf | Font | Boyut | Ağırlık | Satır Aralığı | Kullanım |
|-------|-------|------|-------|---------|---------------|---------|
| `h1` | `font-display text-4xl md:text-5xl lg:text-6xl font-light` | Cormorant | 36–60px | 300 | 1.1 | Adım başlığı |
| `h2` | `font-display text-2xl md:text-3xl font-normal` | Cormorant | 24–30px | 400 | 1.2 | Kart başlığı |
| `h3` | `font-display text-xl font-medium` | Cormorant | 20px | 500 | 1.3 | Alt başlık |
| `accent` | `font-accent italic text-lg` | Italiana | 18px | 400 | 1.4 | Özel etiket, fiyat vurgusu |
| `body` | `font-body text-base leading-relaxed` | Inter | 16px | 400 | 1.6 | Açıklama metni |
| `ui` | `font-body text-sm font-medium` | Inter | 14px | 500 | 1.4 | Buton, label |
| `caption` | `font-body text-xs text-ink/60` | Inter | 12px | 400 | 1.5 | Dipnot, yardımcı metin |

### Tipografi Kuralları

- Minimum body font: **16px** (mobil dahil). 14px sadece caption ve UI etiketleri için.
- Satır uzunluğu: **65–75 karakter** (`max-w-prose` veya `max-w-[68ch]`).
- Başlıklarda `font-light` veya `font-normal` — fine art matbaa hissi için ağır ağırlıktan kaçın.
- Italiana sadece vurgu için; uzun metin bloklarında kullanılmaz.

---

## 4. Spacing Skalası

Tailwind'in varsayılan 4px tabanını koruyoruz; projeye özel sabit değerler:

| Token | Değer | Kullanım |
|-------|-------|---------|
| `space-xs` | `4px` (1) | İkon ile metin arası |
| `space-sm` | `8px` (2) | Kart içi tight boşluk |
| `space-md` | `16px` (4) | Kart padding, input |
| `space-lg` | `24px` (6) | Kartlar arası gap |
| `space-xl` | `40px` (10) | Adım başlığı ile kart grid arası |
| `space-2xl` | `64px` (16) | Dikey section boşluğu |
| `step-gutter` | `24px / 48px` | Mobile/Desktop StepContainer yatay padding |

### Container Genişlikleri

```
375px  → px-6  (24px)
768px  → px-8  (32px)  max-w-2xl
1024px → px-12 (48px)  max-w-3xl
1440px → px-16 (64px)  max-w-4xl
```

---

## 5. Component Checklist

### Card

Seçim kartı — konfigüratörün temel birimi.

```tsx
// Durum sınıfları
const base    = "relative rounded-sm border border-gold-soft/40 bg-cream p-6 cursor-pointer transition-all duration-200 ease-out"
const idle    = "hover:-translate-y-1 hover:border-gold hover:shadow-[0_4px_16px_rgba(184,153,104,0.15)]"
const selected = "border-gold bg-gold/5 -translate-y-1 shadow-[0_4px_16px_rgba(184,153,104,0.2)]"
const disabled = "opacity-40 cursor-not-allowed pointer-events-none"
```

- Köşe yarıçapı: `rounded-sm` (2px) — keskin, editorial.
- İçerik: İkon (SVG, Lucide) + H2 başlık + body açıklama + isteğe bağlı fiyat delta.
- Seçim göstergesi: Sağ üst köşede `gold` renk checkmark (SVG, `opacity-0 → opacity-100`).

### ProgressBar

```tsx
// 9 adım için segmented bar
<div className="flex gap-1 w-full">
  {steps.map((_, i) => (
    <div key={i} className={cn(
      "h-0.5 flex-1 transition-colors duration-300 ease-out",
      i < current ? "bg-gold" : i === current ? "bg-gold/60" : "bg-gold-soft/40"
    )} />
  ))}
</div>
```

- Yükseklik: `2px` — zarif, ince.
- Tamamlanan adımlar tıklanabilir (geri navigasyon).
- Adım numarası: `font-body text-xs text-ink/50` ile yanında gösterilir.

### StepContainer

```tsx
<section className="min-h-screen flex flex-col">
  <header className="px-6 pt-8 pb-6 md:px-12 md:pt-12">
    <ProgressBar current={step} total={9} />
    <h1 className="font-display text-4xl md:text-5xl font-light text-ink mt-8">
      {title}
    </h1>
    <p className="font-body text-base text-ink/60 mt-3 max-w-prose">
      {subtitle}
    </p>
  </header>
  <main className="flex-1 px-6 pb-24 md:px-12">
    {children}
  </main>
  <footer className="fixed bottom-0 inset-x-0 ...">
    {/* Geri butonu + PriceDisplay */}
  </footer>
</section>
```

### Button

| Varyant | Sınıf | Kullanım |
|---------|-------|---------|
| `primary` | `bg-gold text-cream font-body font-medium text-sm px-8 py-3.5 hover:bg-gold-dark transition-colors duration-200` | WhatsApp CTA, İleri |
| `ghost` | `text-ink/60 font-body text-sm hover:text-ink transition-colors duration-200` | Geri navigasyon |
| `outline` | `border border-gold text-ink font-body text-sm px-6 py-3 hover:bg-gold/5` | İkincil aksiyon |

- Min touch target: `min-h-[44px] min-w-[44px]`
- Loading state: spinner + `disabled:opacity-60 disabled:cursor-not-allowed`

### FormField (Tarih adımı için)

```tsx
<div className="space-y-1.5">
  <label className="font-body text-sm font-medium text-ink">
    {label}
  </label>
  <input
    className="w-full border border-gold-soft/60 bg-cream px-4 py-3 font-body text-base text-ink
               placeholder:text-gold-soft focus:outline-none focus:border-gold
               transition-colors duration-200 rounded-sm"
  />
  {error && <p className="font-body text-xs text-[#B04A2F]">{error}</p>}
</div>
```

### CalendarGrid (Adım 2 — Tarih)

- **Grid:** 7 sütun, haftanın günleri `font-body text-xs text-ink/40 uppercase tracking-wide`.
- **Gün hücresi:** `44x44px` min touch target, `rounded-sm`.
- **Müsait:** Tıklanabilir, hover → `bg-gold/10 border-gold`.
- **Seçili:** `bg-gold text-cream`.
- **Dolu/geçmiş:** `opacity-30 cursor-not-allowed line-through`.
- Ay navigasyonu: `< >` chevron ikonları (Lucide), ghost buton.

### SummaryRow (Adım 9 — Sonuç)

```tsx
<div className="flex items-center justify-between py-3 border-b border-gold-soft/30">
  <span className="font-body text-sm text-ink/60">{label}</span>
  <span className="font-display text-base font-medium text-ink">{value}</span>
</div>
```

### PriceDisplay

```tsx
<div className="flex items-baseline gap-1">
  <span className="font-accent italic text-gold text-lg">₺</span>
  <span className="font-display text-2xl font-light text-ink">{min.toLocaleString('tr-TR')}</span>
  <span className="font-body text-sm text-ink/40 mx-1">–</span>
  <span className="font-display text-2xl font-light text-ink">{max.toLocaleString('tr-TR')}</span>
</div>
```

- Alt bar: `fixed bottom-0` overlay, `bg-cream/95 backdrop-blur-sm border-t border-gold-soft/40`.
- Adım 4'ten itibaren görünür; öncesinde gizli.

---

## 6. Animation Token'ları

### Süreler

| Token | Değer | Kullanım |
|-------|-------|---------|
| `duration-fast` | `150ms` | Renk geçişleri, focus |
| `duration-base` | `200ms` | Kart hover, buton hover |
| `duration-slow` | `300ms` | Adım geçişi fade, card seçim sonrası ilerleme |
| `duration-enter` | `250ms` | Yeni adım fade-in |

### Easing

```css
/* globals.css */
:root {
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);   /* Enter animasyonları */
  --ease-in:  cubic-bezier(0.4, 0, 1, 1);        /* Exit animasyonları */
}
```

### Tailwind Extend

```ts
transitionTimingFunction: {
  'ease-out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
  'ease-in-expo':  'cubic-bezier(0.4, 0, 1, 1)',
},
transitionDuration: {
  '150': '150ms',
  '200': '200ms',
  '250': '250ms',
  '300': '300ms',
},
```

### Kurallar

- Kart hover: `transition-all duration-200 ease-out` — `translateY(-4px)` + border renk değişimi.
- Adım geçişi: seçim → 300ms bekle → fade-out (`opacity-0`) → mount yeni adım → fade-in (`opacity-100`).
- **Transform ve opacity kullan**, asla `width`/`height`/`margin` animasyonu yapma (reflow).
- Sürekli / döngüsel animasyonlar sadece yükleme indikatöründe (`animate-spin`).
- `@media (prefers-reduced-motion: reduce)` içinde tüm geçişler `duration-0` veya `transition-none`.

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 7. Sektöre Özel Anti-Pattern Listesi

### Tasarım Anti-Patternları

| Anti-Pattern | Problem | Doğru Yaklaşım |
|---|---|---|
| Beyaz arka plan kullanımı | Soğuk, steril his; lüks hissini yok eder | Her zaman `#F7F1E6` krem |
| Soft shadow / glassmorphism | Editorial değil, "SaaS" hissi verir | Düz border, ince shadow (`rgba`) |
| Gradient CTA butonlar | Fine art estetiğiyle çakışır | Solid `gold` → hover `gold-dark` |
| Emoji kullanımı | Kitap basım hissini bozar | Lucide SVG ikonları |
| Yuvarlak köşeler (`rounded-xl+`) | Lüks değil, çocuksu | `rounded-sm` (2px) maksimum |
| Sans-serif başlıklar | Sektör kodu: fotoğrafçılık = serif display | Cormorant Garamond zorunlu |
| Çok sayıda renk | Konsantrasyon kaybı | 5 token paleti; renkten sapma yok |
| Progress'i gizlemek | Kullanıcı nerede olduğunu bilemez | ProgressBar daima görünür |

### UX / Akış Anti-Patternları

| Anti-Pattern | Problem | Doğru Yaklaşım |
|---|---|---|
| Bir sayfada birden fazla adım | Karar yorgunluğu; dönüşüm düşer | Tek adım = tek karar |
| Fiyatı sadece sonda göstermek | Güvensizlik; erken terk | Adım 4'ten itibaren sürekli göster |
| Geri butonu olmadan ilerleme | Hapsolma hissi; terk oranı artar | Her adımda geri navigasyon |
| Otomatik ilerlemeyi çok hızlı yapmak | Seçimi fark etmeden sayfa değişir | 300ms gecikme zorunlu |
| Form alanlarını konfigüratöre karıştırmak | Modal hissini bozar | Formlar sadece tarih ve iletişim adımında |
| WhatsApp butonunda yalnızca "İletişim" yazmak | Bağlam kaybı | Seçim özetini deep-link ile ilet |
| Mobilde yatay scroll kartlar | Kartın kesildiği fark edilmez | Dikey kart stack, mobilde tam genişlik |

### Fotoğrafçılık Sektörü Özel

| Anti-Pattern | Problem |
|---|---|
| Stok fotoğraf kullanımı | Güvensizlik; stüdyo özgünlüğünü yok eder |
| Aşırı filtreli preview görseller | Gerçek kaliteyi temsil etmez |
| Paket isimleri: "Bronz / Gümüş / Altın" | Klişe; çiftlerde değer algısı yaratmaz |
| Fiyatı tamamen gizlemek | Türkiye pazarında en büyük terk nedeni |
| Video autoplay | Pil tüketimi, veri kullanımı; mobile'da devre dışı |

---

## 8. Pre-Delivery Checklist

### WCAG AA Erişilebilirlik

- [ ] Tüm metin/arkaplan kombinasyonları **4.5:1** kontrast oranı (ink üzerinde cream: ✓)
- [ ] Altın `#B89968` üzerinde `cream` metin: kontrast 3.8:1 → **büyük metin (18px+) için kullan**
- [ ] Tüm görsellerde anlamlı `alt` metni var
- [ ] Form inputlarında `<label for>` bağlantısı var
- [ ] Hata mesajları sadece renge dayanmıyor (ikon + metin eşliğinde)
- [ ] ARIA: modal/dialog `role="dialog" aria-modal="true"`, adım başlıkları `aria-live="polite"`

### Klavye Navigasyonu

- [ ] Tab sırası görsel sırayla eşleşiyor
- [ ] Kartlar `tabIndex={0}` + `onKeyDown` (Enter / Space ile seçim)
- [ ] Focus ring: `focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2`
- [ ] CalendarGrid ok tuşlarıyla gezinebilir
- [ ] Modal varsa: Escape ile kapanır, focus trap aktif
- [ ] ProgressBar tıklanabilir adımlarda keyboard erişimi var

### Hareket Duyarlılığı

- [ ] `@media (prefers-reduced-motion: reduce)` → tüm geçişler kapalı
- [ ] Otomatik ilerleme animasyonu reduce-motion'da devre dışı (kullanıcı manuel ilerler)
- [ ] `animate-spin` ve benzeri döngü animasyonları kontrol edildi

### Performans

- [ ] Görseller WebP formatında, `next/image` ile (`sizes`, `priority` attribute'ları set)
- [ ] Google Fonts `display=swap` parametresiyle yükleniyor
- [ ] Kart grid'de LCP görseli `priority={true}`
- [ ] `prefers-reduced-data` için kritik olmayan görseller ertelenebilir

### Mobil Kalite

- [ ] `375px`'de yatay scroll yok
- [ ] Tüm tıklanabilir alanlar minimum **44×44px**
- [ ] `cursor-pointer` tüm interaktif elemanlarda
- [ ] BottomBar (PriceDisplay) içerik üzerine binmiyor (pb ile telafi)
- [ ] `viewport-meta`: `width=device-width, initial-scale=1`

### Görsel Kalite

- [ ] Emoji ikon yok — sadece Lucide SVG
- [ ] Hover state'ler layout shift yaratmıyor (`transform` kullanıldı)
- [ ] Krem ve altın renklerin tarayıcı rendering'i kontrol edildi (sRGB)
- [ ] Dark mode zorunlu değil; sistem dark mode'unda krem rengi korunuyor (`color-scheme: light`)

---

## 9. Klasör Yapısı

```
studyo-konfigurator/
├── design-system/
│   ├── MASTER.md                  ← Global kaynak (bu dosya)
│   └── pages/
│       ├── _template.md           ← Yeni sayfa override şablonu
│       ├── step-context.md        ← Adım 1: Bağlam seçimi
│       ├── step-date.md           ← Adım 2: Tarih / CalendarGrid
│       ├── step-style.md          ← Adım 3: Stil seçimi (görsel ağır)
│       ├── step-location.md       ← Adım 4: Lokasyon
│       ├── step-duration.md       ← Adım 5: Süre
│       ├── step-team.md           ← Adım 6: Ekip
│       ├── step-delivery.md       ← Adım 7: Teslimat
│       ├── step-extras.md         ← Adım 8: Ekstralar
│       └── step-result.md         ← Adım 9: Sonuç ekranı
```

### `_template.md` İçeriği

```md
# Page Override: [Sayfa Adı]
> Bu dosya MASTER.md'yi override eder. Yalnızca farklılıkları yaz.

## Renk Farklılıkları
(yoksa sil)

## Tipografi Farklılıkları
(yoksa sil)

## Özel Componentler
(yoksa sil)

## Bu Sayfaya Özel Anti-Patternlar
(yoksa sil)
```

### Override Örneği — `step-result.md`

```md
# Page Override: step-result (Adım 9 — Sonuç)

## Özel Componentler

### WhatsApp CTA Butonu
- Boyut: tam genişlik mobilde (`w-full`), masaüstünde `w-auto`
- Renk: `#25D366` arka plan + `white` metin (WhatsApp marka rengi — tek istisna)
- İkon: WhatsApp SVG (Simple Icons)
- Deep-link format:
  `https://wa.me/90XXXXXXXXXX?text=Merhaba!%20Paket%20seçimim:%20[özet]`

### SummaryCard
- Tüm adımların seçimlerini tek kartda listeler
- Her satır: SummaryRow komponenti
- Sağ üst: "Düzenle" ikonu (Lucide `Pencil`) → ilgili adıma gider

## Bu Sayfaya Özel Anti-Patternlar
- Fiyatı "~" ile muğlaklaştırma — net aralık ver (₺X – ₺Y)
- "Bizi arayın" CTA — sadece WhatsApp deep-link, telefon değil
```

---

*Oluşturulma: 2026-06-03 | Stack: Next.js 15 App Router + Tailwind CSS v4 + shadcn/ui*
*Skill: ui-ux-pro-max | Proje: Stüdyo Konfigüratör*
