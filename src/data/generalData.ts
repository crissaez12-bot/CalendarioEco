// Datos ilustrativos — pendiente de conectar a feeds en vivo (Alternative.me, CoinGlass, etc).

export const FEAR_GREED = {
  traditional: { value: 64, label: 'Greed' },
  crypto: { value: 72, label: 'Extreme Greed' },
  capturedAt: '2026-07-20',
}

export interface NewsHeadline {
  title: string
  source: string
  timeAgo: string
  tag: 'Política' | 'Bolsa' | 'Cripto'
}

export const NEWS_HEADLINES: NewsHeadline[] = [
  { title: 'La Fed mantiene tasas sin cambios, señala posible recorte en Q4', source: 'Reuters', timeAgo: 'hace 2h', tag: 'Bolsa' },
  { title: 'BTC rompe resistencia de $118K con volumen institucional al alza', source: 'The Block', timeAgo: 'hace 3h', tag: 'Cripto' },
  { title: 'Nuevas tarifas comerciales entran en revisión en el Congreso', source: 'Bloomberg', timeAgo: 'hace 5h', tag: 'Política' },
  { title: 'ETH supera $4,100 impulsado por entradas netas en ETFs spot', source: 'CoinDesk', timeAgo: 'hace 6h', tag: 'Cripto' },
]

export interface EtfFlow {
  asset: 'BTC' | 'ETH'
  netFlow: number
  updated: string
}

export const ETF_FLOWS: EtfFlow[] = [
  { asset: 'BTC', netFlow: 240_000_000, updated: '2026-07-20' },
  { asset: 'ETH', netFlow: -12_000_000, updated: '2026-07-20' },
]
