GÖRSEL YÖN — KESINLEŞMIŞ KARAR

Bu dosya, MASTER.md'yi tamamlar. Çakışma durumunda bu dosya öncelikli.

KART EFEKTI (Frosted Parchment):
- Kart arka planı: krem renk #FFFCF5'in %92 opaklıkta hali (yarı şeffaf)
- Backdrop-filter: blur(4px) — çok hafif cam etkisi, glassmorphism DEĞİL
- Border: 1px solid #B89968 (altın), hover'da 1.5px daha belirgin
- Border-radius: 10px
- Box-shadow: yumuşak, çoklu katmanlı (yakın + uzak gölge), hover'da büyür
- His: kağıt parçası fotoğrafın üzerine konmuş gibi, modern cam değil

KART HOVER ETKILEŞIMI:
- Mouse takip parallax: kart, mouse pozisyonuna göre 4-6 derece dönüş (CSS perspective + rotateY/rotateX)
- Kart içi görsel: 1.0 → 1.08 yumuşak zoom, kenburns hissi
- Translate Y: -4px
- Transition: 300ms cubic-bezier(0.4, 0, 0.2, 1)
- Tüm hareket prefers-reduced-motion ile devre dışı

ARKA PLAN:
- Birincil: düz krem (#F7F1E6)
- Opsiyonel texture overlay: çok hafif film grain veya kum/gökyüzü dokusu, %5-10 opaklıkta
- Texture studio.config.ts üzerinden ayarlanabilir olmalı:
    backgroundTexture: 'none' | 'film-grain' | 'sky' | 'sand' | 'paper'
- Default: 'film-grain'
- Stüdyo deploy aşamasında kendi atmosferik fotoğraflarını koyabilir

TİPOGRAFİ VURGUSU:
- Italik display (Cormorant Italic veya Italiana) altın renkte (#9A7E4F)
- Düz display (Cormorant Garamond Regular) mürekkep renkte (#2A2520)
- Aynı başlıkta iki stilin birleşimi tercih edilir: "Sizi *buluşturalım*"

AVOID — bu sektör için yasak:
- Tam glassmorphism (apple liquid glass tarzı kalın blur)
- Neon, gradient pink/purple
- Bento Grid asimetrik layout
- Aggressive video arka plan
- Dark mode (V1'de yok)
- Skeuomorphic ikonlar
- Drop shadow abartısı

REFERANS NOTU:
Kullanıcı Origin Financial sitesinin italik tipografisini ve "yüzen kart" hissini seviyor, 
fakat glassmorphism efektinin kendisini değil. Hareket ve etkileşim arzusu var ama 
yönlendirilmesi lazım — editorial fine art çerçevesinde modern hareket dili.

GIRDI: bu kartlar üzerinde abartısız fakat his uyandıran mikro etkileşimler. 
Apple ya da Linear web sitesi seviyesinde polish — gerekirse az ama temiz.