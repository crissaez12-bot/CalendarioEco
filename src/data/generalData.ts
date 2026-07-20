// Datos ilustrativos — pendiente de conectar a feeds en vivo (Alternative.me, CoinGlass, etc).

export const FEAR_GREED = {
  traditional: { value: 64, label: 'Greed' },
  crypto: { value: 72, label: 'Extreme Greed' },
  capturedAt: '2026-07-20',
}

export interface EtfFlow {
  asset: 'BTC' | 'ETH'
  netFlow: number
  updated: string
}

export const ETF_FLOWS: EtfFlow[] = [
  { asset: 'BTC', netFlow: 240_000_000, updated: '2026-07-20' },
  { asset: 'ETH', netFlow: -12_000_000, updated: '2026-07-20' },
]
