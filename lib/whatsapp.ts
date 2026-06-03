import type { PriceRange } from '@/lib/price-engine'
import { formatCurrency } from '@/lib/utils'

const LABELS = {
  context: {
    wedding: 'Düğün',
    engagement: 'Nişan / Söz',
    family: 'Bebek & Aile',
  },
  season: {
    spring: 'İlkbahar',
    summer: 'Yaz',
    autumn: 'Sonbahar',
    winter: 'Kış',
    unknown: 'Henüz net değil',
  },
  style: {
    classic: 'Klasik & Romantik',
    modern: 'Modern & Editöryal',
    natural: 'Doğal & Belgesel',
    vintage: 'Vintage & Sinematik',
  },
  location: {
    studio: 'Stüdyo',
    plato: 'Plato',
    outdoor: 'Dış Mekan',
    venue: 'Venue / Mekan',
    mixed: 'Karma',
  },
  duration: {
    ceremony: 'Sadece Tören (2-3 saat)',
    half: 'Yarım Gün (5-6 saat)',
    full: 'Tam Gün (10-12 saat)',
    multi: 'Çok Günlü',
  },
  team: {
    solo: 'Tek Fotoğrafçı',
    duo: 'İki Fotoğrafçı',
    trio: 'İki Fotoğrafçı + Asistan',
  },
  delivery: {
    digital: 'Dijital Galeri',
    album: 'Dijital + Albüm',
    video: 'Dijital + Video',
    complete: 'Komple Paket',
  },
  extras: {
    drone: 'Drone Çekimi',
    fullVideo: 'Tam Edit Video',
    photobook: 'Lüks Anı Kitabı',
    engagement: 'Engagement Çekimi',
    preparation: 'Hazırlık Çekimi',
  },
} as const

export interface WhatsAppMessageData {
  name: string
  email: string
  context?: string
  season?: string
  date?: string
  style?: string
  location?: string
  duration?: string
  team?: string
  delivery?: string
  extras?: string[]
  price: PriceRange
}

function label<T extends Record<string, string>>(map: T, key: string | undefined): string {
  if (!key) return 'Belirtilmedi'
  return (map as Record<string, string>)[key] ?? key
}

export function buildWhatsAppMessage(data: WhatsAppMessageData): string {
  const extrasList =
    data.extras && data.extras.length > 0
      ? data.extras.map(e => label(LABELS.extras, e)).join(', ')
      : 'Yok'

  const lines = [
    'Merhaba, web sitesi konfigüratörü üzerinden paket tasarladım.',
    `Ad: ${data.name}`,
    `Mail: ${data.email}`,
    '— Paket Özeti —',
    `Etkinlik: ${label(LABELS.context, data.context)}`,
    `Tarih: ${data.date ?? 'Belirtilmedi'}`,
    `Stil: ${label(LABELS.style, data.style)}`,
    `Lokasyon: ${label(LABELS.location, data.location)}`,
    `Süre: ${label(LABELS.duration, data.duration)}`,
    `Ekip: ${label(LABELS.team, data.team)}`,
    `Teslimat: ${label(LABELS.delivery, data.delivery)}`,
    `Ekstralar: ${extrasList}`,
    `Yatırım: ${formatCurrency(data.price.min)} — ${formatCurrency(data.price.max)}`,
    'Görüşme için uygun olduğunuzda dönebilir misiniz?',
  ]

  return lines.join('\n')
}

export function buildWhatsAppURL(phone: string, data: WhatsAppMessageData): string {
  const message = buildWhatsAppMessage(data)
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
}

export { LABELS }
