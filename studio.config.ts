export const studioConfig = {
  name: 'Stüdyo',
  tagline: 'Fine Wedding Photography',

  // --- Fiyat Motoru ---
  BASE: {
    wedding: 45000,
    engagement: 12000,
    family: 8000,
  },
  STYLE_MULT: {
    classic: 1.0,
    modern: 1.0,
    natural: 1.0,
    vintage: 1.08,
  },
  DURATION_MULT: {
    ceremony: 0.55,
    half: 1.0,
    full: 1.55,
    multi: 2.30,
  },
  TEAM_MULT: {
    solo: 1.0,
    duo: 1.30,
    trio: 1.50,
  },
  DELIVERY_ADD: {
    digital: 0,
    album: 8500,
    video: 14000,
    complete: 28000,
  },
  EXTRAS_ADD: {
    drone: 6000,
    fullVideo: 22000,
    photobook: 9000,
    engagement: 11000,
    preparation: 7000,
  },
  PRICE_RANGE: { low: 0.88, high: 1.12 },
  PRICE_ROUNDING: 500,

  // --- Görsel ---
  backgroundTexture: 'none' as 'none' | 'film-grain',

  // --- İletişim ---
  whatsappNumber: '905XXXXXXXXX',
  studioEmail: 'info@studyo.com',
} as const

export type StudioConfig = typeof studioConfig
export type ContextKey = keyof typeof studioConfig.BASE
export type StyleKey = keyof typeof studioConfig.STYLE_MULT
export type DurationKey = keyof typeof studioConfig.DURATION_MULT
export type TeamKey = keyof typeof studioConfig.TEAM_MULT
export type DeliveryKey = keyof typeof studioConfig.DELIVERY_ADD
export type ExtrasKey = keyof typeof studioConfig.EXTRAS_ADD
