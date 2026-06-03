# İç Araştırma: Potansiyel Riskler ve Tuzaklar

**Tarih:** 2026-06-03
**Kaynak:** MASTER.md + VISUAL-DIRECTION.md + research-brief.txt iç analizi

---

## Kritik Design System Çakışmaları

### Çakışma 1: border-radius — MASTER.md vs VISUAL-DIRECTION.md

- **MASTER.md:** `rounded-sm` (2px) — "keskin, editorial"
- **VISUAL-DIRECTION.md:** `border-radius: 10px` — "kağıt parçası hissi"
- **Çözüm:** VISUAL-DIRECTION.md öncelikli (üst dosya bunu açıkça belirtiyor). Kartlar `rounded-[10px]` kullanacak. Input/buton için `rounded-sm` devam eder.

### Çakışma 2: Tailwind Config Syntax — v3 vs v4

- **MASTER.md:** `tailwind.config.ts` ile JavaScript objesi config (v3 syntax)
- **Gerçek durum:** Tailwind CSS v4 CSS-first config kullanır (`@theme` direktifi)
- **Risk:** MASTER.md'deki config kodu olduğu gibi kopyalanırsa çalışmaz
- **Çözüm:** `globals.css` içinde `@theme` bloğu ile tüm tokenları tanımla

### Çakışma 3: Google Fonts Import Yöntemi

- **MASTER.md:** `@import url('https://fonts.googleapis.com/...')` CSS import
- **Doğru yöntem:** `next/font/google` (performans, LCP, no-flash)
- **Risk:** CSS import, font flash (FOUT) ve LCP sorununa yol açar
- **Çözüm:** `app/layout.tsx` içinde `next/font/google` ile yükle

---

## Teknik Risk Listesi

### Risk 1: Google Calendar Service Account Setup

**Seviye:** Yüksek
**Problem:** Service account kimlik bilgileri JSON formatında — Vercel'e tek satır olarak yazılmalı
**Tuzak:** JSON'un içindeki `\n` karakterleri (private key PEM formatında) Vercel env'de bozulabilir
**Çözüm:**
```bash
# Vercel'e eklerken JSON'u tek satıra dönüştür:
cat service-account.json | jq -c . | pbcopy
# Ardından Vercel dashboard'a yapıştır
```
Parse ederken:
```typescript
const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY!)
```

### Risk 2: CalendarGrid — 3 Ay, 375px

**Seviye:** Yüksek
**Problem:** 3 ayı aynı anda gösterme (yatay 3 sütun) 375px'de imkânsız
**Math:** 375px - 48px padding = 327px / 7 = 46.7px / hücre — tek ay için bile minimum
**Tuzak:** 3 sütunlu grid masaüstünde olduğu gibi mobilde kullanılmaya çalışılırsa layout bozulur
**Çözüm:** Responsive strateji — mobilde dikey stack (3 ay alt alta), masaüstünde 3 sütun

### Risk 3: AnimatePresence — App Router Uyumu

**Seviye:** Orta-Yüksek
**Problem:** Next.js 15 App Router, React 18+ concurrent features ile `AnimatePresence` çakışabilir
**Tuzak:** `layout.tsx` içine koyulan AnimatePresence, server component boundary'sini ihlal eder
**Çözüm:**
```tsx
// layout.tsx — server component kalabilir
// Bunun yerine bir client wrapper oluştur:
// components/PageTransition.tsx
'use client'
import { AnimatePresence, motion } from 'framer-motion'
import { usePathname } from 'next/navigation'

export function PageTransition({ children }) {
  const pathname = usePathname()
  return (
    <AnimatePresence mode="wait">
      <motion.div key={pathname}>{children}</motion.div>
    </AnimatePresence>
  )
}
```

### Risk 4: Wizard State — Tarayıcı Geri Butonu

**Seviye:** Orta
**Problem:** URL search params yaklaşımında, tarayıcı geri butonu state'i geri alır ama geçiş animasyonu tetiklenmeyebilir
**Tuzak:** `useRouter.back()` vs `useRouter.push()` arasındaki fark — history stack yönetimi
**Çözüm:**
- Segment route yaklaşımı: `/configure/[step]` — her adım ayrı URL, tarayıcı geri butonu doğal çalışır
- nuqs kütüphanesi: URL search params'ı type-safe yönetir, history push/replace desteği var

### Risk 5: WhatsApp Mesaj Uzunluğu

**Seviye:** Düşük-Orta
**Problem:** Türkçe mesaj + 8 alan + fiyat bilgisi URL encode edildiğinde ~800-1200 karakter
**Tuzak:** Bazı Android uygulamalar ve eski WhatsApp sürümleri URL'yi truncate edebilir
**Çözüm:** Mesajı kısa tut, alanları sadece seçilen adımla sınırla, `encodeURIComponent` kullan

### Risk 6: Framer Motion Bundle Boyutu

**Seviye:** Orta
**Problem:** Framer Motion tam bundle ~120kb (gzip: ~40kb)
**Tuzak:** Tüm sayfada import edilirse ilk sayfa yükleme süresi artar
**Çözüm:**
```tsx
import { LazyMotion, domAnimation, m } from 'framer-motion'
// LazyMotion ile sadece ihtiyaç duyulan animasyon kodları yüklenir
```

### Risk 7: Türkçe Karakter — Font Subset

**Seviye:** Orta
**Problem:** Türkçe özel karakterler (ğ, ü, ş, ı, ö, ç) latin subset'inde yoktur
**Tuzak:** `subsets: ['latin']` ile bu karakterler fallback fontta render olur (görsel tutarsızlık)
**Çözüm:** `subsets: ['latin', 'latin-ext']` — latin-ext Türkçe karakterleri içerir

### Risk 8: Parallax Hover — Mobile Touch

**Seviye:** Düşük
**Problem:** Mouse-position parallax (rotateY/rotateX) dokunmatik ekranda anlamsız
**Tuzak:** `mousemove` event'i mobile'da tetiklenmez
**Çözüm:**
```typescript
const isTouchDevice = 'ontouchstart' in window
// Touch cihazlarda parallax devre dışı bırak
// Sadece -translateY(4px) hover kalsın (CSS ile yapılabilir)
```

### Risk 9: Resend — Rate Limit

**Seviye:** Düşük
**Problem:** Resend ücretsiz plan: 100 e-posta/gün, 3000/ay
**Tuzak:** Yüksek trafik döneminde (düğün sezonu) limit aşılabilir
**Çözüm:** Form gönderimini rate-limit et (60 saniyede 1 gönderim, session storage ile), Resend pro plan düşün

### Risk 10: Google Calendar API Quota

**Seviye:** Düşük
**Problem:** Calendar API: 1,000,000 request/gün (yeterli), ama freebusy query batching dikkat gerektirir
**Tuzak:** Her takvim ziyareti API call yaparsa, aynı gün için gereksiz request birikmesi
**Çözüm:** Next.js `unstable_cache` veya `revalidate` ile önbellekleme (1 saat veya daha fazla)

---

## Design System Boşlukları

### Eksik Tanımlamalar (Kodlamadan Önce Netleştirilmeli)

1. **Mevsim Adımı (Adım 2):** MASTER.md'de adım listesi farklı — "mevsim" adımı yok, direkt "tarih" var. PDF'ye göre 9 adım daha farklı sıralı (bağlam → mevsim → takvim → stil...). Hangi adım haritası doğru?

2. **Fiyat Görünümü Başlangıcı:** MASTER.md §1 "Adım 4'ten itibaren" diyor (lokasyon), ama fiyat lokasyon'dan önce de hesaplanabilir (stil adımından sonra). Netleştirme gerekiyor.

3. **Mevsim → Takvim İlişkisi:** "Seçilen mevsimin 3 ayı" gösterilecek ama "henüz net değil" seçilirse ne olacak? Tüm yıl mı gösterilsin, yoksa takvim adımı atlanabilir mi?

4. **Ekstralar — "DEVAM" Butonu:** PDF slide 8'de sağ altta `INK` renk DEVAM butonu var. MASTER.md bu ayrımı açıklamıyor. Ekstralar adımında otomatik ilerleme YOK, sadece bu adımda DEVAM butonu görünür.

5. **Sonuç Ekranı Layout (PDF slide 15):** İki kolonlu — sol özet, sağ fiyat+CTA. MASTER.md tek sütun gibi çiziyor. Masaüstünde iki kolon, mobilde tek kolon olacak.

---

## Uygulama Sırası Önerisi (Risk Sıralı)

1. `studio.config.ts` — fiyat motorunu ilk yaz, test et
2. URL/state yönetim stratejisine karar ver (segment route vs nuqs)
3. Google Calendar servisini standalone test et (Route Handler)
4. CalendarGrid — mobil first (375px) test et
5. Kart component'ini Frosted Parchment + parallax ile yaz
6. Adım adım wizard akışı
7. Sonuç ekranı + WhatsApp deep link
8. Email form (Resend)
9. Animasyonlar ve polish
