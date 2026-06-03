# İç Araştırma: Design System Pattern'ları

**Tarih:** 2026-06-03
**Kaynak:** design-system/MASTER.md + design-system/VISUAL-DIRECTION.md

---

## Component Adlandırma Kuralları

MASTER.md'den çıkarılan kesin component isimleri (Pascal Case, değiştirilemez):

| Component | Dosya Konumu (Beklenen) | Açıklama |
|-----------|------------------------|---------|
| `Card` | `components/Card.tsx` | Seçim kartı, konfigüratörün temel birimi |
| `ProgressBar` | `components/ProgressBar.tsx` | 9-segment ince çizgi (2px) |
| `StepContainer` | `components/StepContainer.tsx` | Sayfa çerçevesi (header + main + footer) |
| `Button` | `components/Button.tsx` | primary / ghost / outline varyantları |
| `FormField` | `components/FormField.tsx` | Input wrapper (tarih adımı + sonuç formu) |
| `CalendarGrid` | `components/CalendarGrid.tsx` | 7-sütun takvim, müsaitlik görünümü |
| `SummaryRow` | `components/SummaryRow.tsx` | Sonuç ekranı satırı |
| `PriceDisplay` | `components/PriceDisplay.tsx` | Alt bar fiyat kuşağı |

## Renk Token Sistemi

Tüm renkler CSS custom properties olarak tanımlanmalı, Tailwind extend ile eşleştirilmeli:

```
cream       = #F7F1E6   (sayfa arkaplanı — asla beyaz)
gold        = #B89968   (primary CTA, seçili kart)
gold-dark   = #9A7E4F   (hover, vurgu)
ink         = #2A2520   (metin, başlık)
gold-soft   = #D9C39A   (disabled, placeholder, ayırıcı)
```

**Önemli kurallar:**
- `cream` arkaplan, beyaz kullanılmaz
- `gold` büyük metin (18px+) için — kontrast 3.8:1 (küçük metinde kullanılmaz)
- `ink` üzerinde `cream` metin: onaylı kombinasyon
- Hata rengi: `#B04A2F` (krem üzerinde 4.5:1 kontrast)

## Tipografi Pattern'ları

### Font Rol Dağılımı

```
font-display → Cormorant Garamond
  Kullanım: h1, h2, h3, kart başlıkları, SummaryRow değerleri, PriceDisplay rakamları

font-accent → Italiana (italic)
  Kullanım: fiyat ₺ sembolü, özel etiketler, vurgu kelimeleri, alıntılar
  KURAL: Uzun metin bloklarında asla kullanılmaz

font-body → Inter
  Kullanım: açıklama metni, buton etiketi, label, form input, hata mesajı, caption
```

### Boyut Kısıtları

- Minimum body: 16px (mobil dahil)
- Caption/UI etiketi: 14px (sınır)
- Başlıklarda: `font-light` veya `font-normal` (ağır weight yasak)

## Kart Pattern'ı (Bağlayıcı Spesifikasyon)

### MASTER.md'den (CSS sınıfları)

```tsx
const base     = "relative rounded-sm border border-gold-soft/40 bg-cream p-6 cursor-pointer transition-all duration-200 ease-out"
const idle     = "hover:-translate-y-1 hover:border-gold hover:shadow-[0_4px_16px_rgba(184,153,104,0.15)]"
const selected = "border-gold bg-gold/5 -translate-y-1 shadow-[0_4px_16px_rgba(184,153,104,0.2)]"
const disabled = "opacity-40 cursor-not-allowed pointer-events-none"
```

### VISUAL-DIRECTION.md'den (Override — Bu Dosya Kazanır)

```
Arka plan: #FFFCF5 @ 92% opacity (yarı şeffaf krem)
Backdrop-filter: blur(4px)
Border: 1px solid #B89968 → hover 1.5px
Border-radius: 10px (MASTER.md'deki rounded-sm=2px'i override eder)
Box-shadow: yumuşak çok katmanlı
Parallax hover: mouse pozisyonuna göre 4-6 derece rotateY/rotateX
Kart içi görsel zoom: 1.0 → 1.08
Transition: 300ms cubic-bezier(0.4, 0, 0.2, 1)
```

**Kritik çakışma:** MASTER.md `rounded-sm` (2px) derken VISUAL-DIRECTION.md `border-radius: 10px` diyor. VISUAL-DIRECTION.md öncelikli — kartlar 10px radius kullanacak.

## Animasyon Token'ları

```
duration-fast   = 150ms  (renk geçişleri, focus)
duration-base   = 200ms  (kart hover, buton hover)
duration-slow   = 300ms  (adım geçişi fade, card seçim sonrası)
duration-enter  = 250ms  (yeni adım fade-in)

ease-out = cubic-bezier(0.16, 1, 0.3, 1)   (enter)
ease-in  = cubic-bezier(0.4, 0, 1, 1)       (exit)
```

**Adım geçiş sekansı:** seçim → 300ms bekle → fade-out → mount yeni adım → fade-in
**Otomatik ilerleme:** Ekstralar adımı hariç tüm adımlarda kart seçimi otomatik ilerler

## ProgressBar Pattern'ı

- 9 segment, `h-0.5` (2px) yükseklik
- Tamamlanan: `bg-gold`
- Aktif: `bg-gold/60`
- Bekleyen: `bg-gold-soft/40`
- Tıklanabilir: tamamlanan adımlar (geri navigasyon)

## PriceDisplay Pattern'ı

- `fixed bottom-0` overlay
- `bg-cream/95 backdrop-blur-sm border-t border-gold-soft/40`
- Adım 4'ten itibaren görünür (lokasyon adımından sonra)
- Format: `₺` (Italiana italic gold) + rakam (Cormorant Garamond, 2xl, light)

## Arka Plan Texture Sistemi

`studio.config.ts` üzerinden yapılandırılabilir:
```
backgroundTexture: 'none' | 'film-grain' | 'sky' | 'sand' | 'paper'
default: 'film-grain'
opacity: %5-10
```

## Spacing Skalası

```
step-gutter: 24px (mobil) / 48px (masaüstü)
Kart grid gap: 24px (space-lg)
Adım başlığı → kart grid: 40px (space-xl)
```

## Anti-Pattern Listesi (Design Kısıtları)

MASTER.md §7'den zorunlu kısıtlar:

1. Beyaz arka plan yasak → krem kullan
2. Glassmorphism yasak → Frosted Parchment efekti
3. Gradient CTA yasak → solid gold
4. Emoji yasak → Lucide SVG
5. `rounded-xl+` yasak → 10px (kart) veya `rounded-sm` (buton, input)
6. Sans-serif başlık yasak → Cormorant Garamond zorunlu
7. `dark mode` V1'de yok → `color-scheme: light` zorla
8. Yatay scroll kart (mobil) yasak → dikey stack
9. Otomatik ilerleme 300ms'den hızlı olamaz

## Button Sınıf Pattern'ları

```tsx
// primary
"bg-gold text-cream font-body font-medium text-sm px-8 py-3.5 hover:bg-gold-dark transition-colors duration-200"

// ghost (geri navigasyon)
"text-ink/60 font-body text-sm hover:text-ink transition-colors duration-200"

// outline
"border border-gold text-ink font-body text-sm px-6 py-3 hover:bg-gold/5"

// WhatsApp (tek renk istisnası)
"bg-[#25D366] text-white w-full md:w-auto"
```

Min touch target: `min-h-[44px] min-w-[44px]`

## CalendarGrid Spec (MASTER.md §5)

```
Grid: 7 sütun
Haftanın günleri başlığı: font-body text-xs text-ink/40 uppercase tracking-wide
Gün hücresi: 44x44px min, rounded-sm
Müsait: hover → bg-gold/10 border-gold
Seçili: bg-gold text-cream
Dolu/geçmiş: opacity-30 cursor-not-allowed line-through
```

## SummaryRow Pattern'ı

```tsx
<div className="flex items-center justify-between py-3 border-b border-gold-soft/30">
  <span className="font-body text-sm text-ink/60">{label}</span>
  <span className="font-display text-base font-medium text-ink">{value}</span>
</div>
```
