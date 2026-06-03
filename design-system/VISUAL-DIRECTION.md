GÖRSEL YÖN v2 — GÜNCEL KARAR (eski v1'i tamamen geçersiz kılar)

Bu dosya MASTER.md dahil tüm tasarım notlarını override eder.
ÖNEMLİ: v1'deki "glassmorphism YASAK" kuralı İPTAL. Artık glassmorphism ANA stildir.

YÖN: Origin Financial / modern fintech tarzı + lüks fotoğrafçılık.
Cesur, derinlikli, yaşayan. "Ödev" değil, "premium ürün" hissi.

PALET (korunur):
- Krem bg: #F7F1E6
- Altın: #B89968
- Koyu altın: #9A7E4F
- Mürekkep: #2A2520
- Yumuşak altın: #D9C39A
- Cam yüzeyler için beyaz/krem %15-25 opaklık katmanları

ARKA PLAN (animasyonlu, yaşayan):
- Katman 1: Animasyonlu gradient mesh — krem, yumuşak altın, çok açık şeftali tonları arasında YAVAŞ geçiş (20-30s döngü, CSS @keyframes veya canvas)
- Katman 2: Film grain overlay (SVG noise, opacity 0.06, mix-blend-mode overlay)
- Katman 3 (opsiyonel, config'le): blur'lu atmosfer fotoğrafı — şimdilik kapalı, studio.config.ts'te backgroundMode: 'mesh' | 'photo' | 'grain'
- Hareket subtle olmalı, baş döndürmemeli. prefers-reduced-motion ile statik.
- Default: 'mesh' (gradient mesh + grain birlikte)

GLASSMORPHISM KARTLAR (ana stil):
- background: rgba(255, 252, 245, 0.55) — yarı şeffaf krem
- backdrop-filter: blur(16px) saturate(1.2)
- border: 1px solid rgba(184, 153, 104, 0.35) — yarı şeffaf altın
- border-radius: 16px
- box-shadow: 0 8px 32px rgba(42, 37, 32, 0.12), inset 0 1px 0 rgba(255,255,255,0.4)
- Üst kenarda hafif beyaz highlight (cam parlaması hissi)
- padding: 28px

KART HOVER (güçlü, yaşayan):
- backdrop-blur 16px → 20px
- background opaklık 0.55 → 0.68
- mouse pos parallax: rotateX/rotateY 6-8deg (perspective 1000px)
- translateY: -6px
- box-shadow büyür: 0 20px 60px rgba(154, 126, 79, 0.2)
- border altın opaklık 0.35 → 0.6
- kart içi ikon/görsel scale 1.0 → 1.1
- transition 350ms cubic-bezier(0.4, 0, 0.2, 1)
- Glow: hover'da kartın arkasında çok hafif altın radial glow

KOMPOZISYON (kritik — şu an EN BÜYÜK sorun):
- Tüm içerik max-width 1200px container içinde, YATAY ORTALANMIŞ
- Sayfada dikey de dengelenmeli — içerik dikey ortaya yakın, üst-sol köşeye yapışık DEĞİL
- Başlık + subtitle ortada veya sol-ortada, ama bütün blok ekranda merkezli
- Kartlar arası gap 20-24px
- Bol nefes alanı (whitespace), ama boşluk dengeli dağılmış olmalı — bir taraf boş bir taraf dolu OLMAZ
- Mobilde dikey ortalama, full-width kartlar, padding 16px

TİPOGRAFİ (daha cesur):
- Display başlık daha büyük: desktop 48-64px, mobile 32-40px
- Italic accent altın renkte, regular mürekkep
- Letter-spacing display'de hafif sıkı (-0.02em)
- Daha fazla kontrast: başlık büyük ve net, subtitle küçük ve muted

ANIMASYON:
- Sayfa girişinde içerik stagger fade-in (her eleman 80ms arayla)
- Kartlar enter'da alttan hafif yukarı kayar (translateY 12px → 0)
- Step geçişi: fade + hafif scale (0.98 → 1)
- Tüm hareket 60fps, GPU-accelerated (transform/opacity only)
- prefers-reduced-motion: sadece opacity

AVOID:
- İçeriğin köşeye yapışması (ŞU ANKİ EN BÜYÜK HATA)
- Flat kartlar
- Ölü/statik arka plan
- Dark mode
- Neon, mor/pembe gradient (altın/krem tonlarında kal)
- Aşırı blur (okunabilirliği bozan)

REFERANS: Origin Financial (origin.com) — yüzen cam kartlar, animasyonlu arka plan, 
büyük italik tipografi, ortalanmış premium kompozisyon. O kalite seviyesi hedef.