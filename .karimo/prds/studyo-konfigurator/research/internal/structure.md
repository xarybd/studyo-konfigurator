# İç Araştırma: Proje Yapısı

**Tarih:** 2026-06-03
**Kapsam:** Greenfield proje — mevcut kaynak dosyaları analizi

---

## Mevcut Dosya Ağacı

```
studyo-konfigurator/
├── .claude/
│   └── settings.local.json
├── .karimo/
│   └── prds/
│       └── studyo-konfigurator/
│           ├── assets/
│           │   ├── StüdyoKonfigüratör.pdf        ← UI akış PDF'i
│           │   ├── ref-01-origin-typography-INSPIRATION.png
│           │   ├── ref-02-origin-cards-PARTIAL-only-floating-feel.png
│           │   └── REFERENCES.md
│           └── status.json
├── design-system/
│   ├── MASTER.md                                 ← Global design kaynak (HAZIR)
│   ├── VISUAL-DIRECTION.md                       ← Kart efekti + parallax spec (HAZIR)
│   └── pages/
│       └── _template.md                          ← Page override şablonu (HAZIR)
├── prompt.txt                                    ← Orijinal kullanıcı brief
└── research-brief.txt                            ← Araştırma soruları özeti
```

## Mevcut Olmayan Dosyalar (Oluşturulacak)

```
studyo-konfigurator/               ← Next.js projesi henüz scaffold edilmemiş
├── src/
│   └── app/
│       └── configure/
│           └── [step]/
│               └── page.tsx
├── studio.config.ts               ← Fiyat + texture config (belgelenmiş, yazılmamış)
├── tailwind.config.ts
├── components/
│   └── ui/                        ← shadcn bileşenleri buraya gelecek
└── ...
```

## Greenfield Durumu Analizi

Proje tamamen greenfield'dır. Mevcut kod tabanı yoktur. Şu an yalnızca:
1. **Design system belgesi** (MASTER.md, VISUAL-DIRECTION.md) — kapsamlı, bağlayıcı
2. **Asset dosyaları** (PDF, referans görseller)
3. **Brief dosyaları** (prompt.txt, research-brief.txt)
4. **Page override şablonu** (_template.md)

## Design System Sayfaları (Planlanmış, Henüz Yazılmamış)

MASTER.md'nin §9 bölümünde tanımlanan 9 sayfa override dosyası henüz oluşturulmamıştır:

| Dosya | Adım | Durum |
|-------|------|-------|
| `pages/step-context.md` | Adım 1: Bağlam | YAZILMADI |
| `pages/step-date.md` | Adım 2: Takvim | YAZILMADI |
| `pages/step-style.md` | Adım 3: Stil | YAZILMADI |
| `pages/step-location.md` | Adım 4: Lokasyon | YAZILMADI |
| `pages/step-duration.md` | Adım 5: Süre | YAZILMADI |
| `pages/step-team.md` | Adım 6: Ekip | YAZILMADI |
| `pages/step-delivery.md` | Adım 7: Teslimat | YAZILMADI |
| `pages/step-extras.md` | Adım 8: Ekstralar | YAZILMADI |
| `pages/step-result.md` | Adım 9: Sonuç | YAZILMADI |

## Önemli Bağlamsal Bilgi

- **Platform:** Vercel deployment
- **Node ortamı:** Next.js 15 App Router
- **CSS yaklaşımı:** Tailwind CSS v4 (CSS-first config, `@theme` direktifi)
- **Component kütüphanesi:** shadcn/ui (seçici kullanım)
- **Animasyon:** Framer Motion
- **Form:** react-hook-form + zod
- **E-posta:** Resend
- **Takvim API:** Google Calendar (service account)
