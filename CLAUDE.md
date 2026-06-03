# CLAUDE.md — Stüdyo Konfigüratör

## İletişim
- Türkçe, kısa, doğrudan
- Özet/onay isteme; doğrudan uygula
- "Yapıyorum...", "Bakayım..." yazma
- Hata yoksa sessizce ilerle

## Stack
- Next.js 15 App Router, Tailwind CSS v4, TypeScript, shadcn/ui
- Tüm UI copy Türkçe
- Tipografi: Cormorant Garamond + Italiana + Inter
- Renk: design-system/MASTER.md

## Kod
- 1 bileşen 1 dosya; >300 satır parçala
- Comment yazma; kod kendini anlatsın
- console.log temizle
- Erken return; nested try yok

## Karar Referansları (öncelik sırası)
1. design-system/VISUAL-DIRECTION.md (override eder)
2. design-system/pages/*.md (sayfa override)
3. design-system/MASTER.md (taban)
4. studio.config.ts (değerler)

## Token Disiplini
- Büyük dosya analizi: ctx_execute ile script
- 50+ dosya taraması: ctx_search
- view_range kullan, full file çekme
- Aynı bilgiyi tekrar sorma

## YAPMA
- Glassmorphism (frosted parchment var)
- Dark mode
- Emoji ikon (Lucide kullan)
- Bento Grid
- Ödeme / login / database (V1'de yok)
- Multi-tenancy (V2'de)
