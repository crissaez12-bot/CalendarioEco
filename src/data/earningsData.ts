// Datos ilustrativos — pendiente de conectar a feeds en vivo (earnings calendar API, CoinGlass/Token Unlocks, etc).

export interface EarningsEvent {
  time: 'BMO' | 'AMC'
  ticker: string
  name: string
  epsEst: string
  epsActual: string
  revEst: string
  revActual: string
}

export interface EarningsDay {
  date: string
  label: string
  events: EarningsEvent[]
}

export const EARNINGS_SOURCE = {
  provider: 'Earnings calendar (manual)',
  weekLabel: 'Semana actual',
  capturedAt: '2026-07-20',
}

export const EARNINGS_WEEK: EarningsDay[] = [
  {
    date: '2026-07-21',
    label: 'Martes, 21 de julio de 2026',
    events: [
      { time: 'BMO', ticker: 'GE', name: 'General Electric', epsEst: '1.24', epsActual: '-', revEst: '9.1B', revActual: '-' },
      { time: 'AMC', ticker: 'MSFT', name: 'Microsoft', epsEst: '3.12', epsActual: '-', revEst: '68.4B', revActual: '-' },
    ],
  },
  {
    date: '2026-07-22',
    label: 'Miércoles, 22 de julio de 2026',
    events: [
      { time: 'BMO', ticker: 'BA', name: 'Boeing', epsEst: '-0.35', epsActual: '-', revEst: '17.8B', revActual: '-' },
      { time: 'AMC', ticker: 'GOOGL', name: 'Alphabet', epsEst: '2.09', epsActual: '-', revEst: '85.3B', revActual: '-' },
      { time: 'AMC', ticker: 'TSLA', name: 'Tesla', epsEst: '0.68', epsActual: '-', revEst: '26.1B', revActual: '-' },
    ],
  },
  {
    date: '2026-07-23',
    label: 'Jueves, 23 de julio de 2026',
    events: [
      { time: 'BMO', ticker: 'AAPL', name: 'Apple', epsEst: '1.62', epsActual: '-', revEst: '92.7B', revActual: '-' },
      { time: 'AMC', ticker: 'AMZN', name: 'Amazon', epsEst: '1.15', epsActual: '-', revEst: '167.2B', revActual: '-' },
      { time: 'AMC', ticker: 'META', name: 'Meta Platforms', epsEst: '5.84', epsActual: '-', revEst: '43.6B', revActual: '-' },
    ],
  },
  {
    date: '2026-07-24',
    label: 'Viernes, 24 de julio de 2026',
    events: [
      { time: 'BMO', ticker: 'XOM', name: 'Exxon Mobil', epsEst: '1.98', epsActual: '-', revEst: '89.5B', revActual: '-' },
      { time: 'BMO', ticker: 'CVX', name: 'Chevron', epsEst: '2.71', epsActual: '-', revEst: '48.3B', revActual: '-' },
    ],
  },
]

export type UnlockType = 'Cliff' | 'Lineal' | 'Team / Investors' | 'Staking rewards'

export interface TokenUnlockEvent {
  ticker: string
  name: string
  type: UnlockType
  unlockTokens: number
  unlockUsd: number
  pctSupply: number
}

export interface TokenUnlockDay {
  date: string
  label: string
  events: TokenUnlockEvent[]
}

export const UNLOCKS_SOURCE = {
  provider: 'Token unlock calendar (manual, top 100 mkt cap)',
  weekLabel: 'Semana actual',
  capturedAt: '2026-07-20',
}

export const TOKEN_UNLOCKS_WEEK: TokenUnlockDay[] = [
  {
    date: '2026-07-21',
    label: 'Martes, 21 de julio de 2026',
    events: [
      { ticker: 'ARB', name: 'Arbitrum', type: 'Team / Investors', unlockTokens: 92_650_000, unlockUsd: 41_700_000, pctSupply: 1.9 },
      { ticker: 'APT', name: 'Aptos', type: 'Lineal', unlockTokens: 11_310_000, unlockUsd: 58_200_000, pctSupply: 1.1 },
    ],
  },
  {
    date: '2026-07-23',
    label: 'Jueves, 23 de julio de 2026',
    events: [
      { ticker: 'OP', name: 'Optimism', type: 'Team / Investors', unlockTokens: 31_280_000, unlockUsd: 24_900_000, pctSupply: 2.4 },
      { ticker: 'STRK', name: 'Starknet', type: 'Cliff', unlockTokens: 127_000_000, unlockUsd: 19_800_000, pctSupply: 6.3 },
      { ticker: 'TIA', name: 'Celestia', type: 'Lineal', unlockTokens: 8_640_000, unlockUsd: 22_100_000, pctSupply: 3.2 },
    ],
  },
  {
    date: '2026-07-25',
    label: 'Sábado, 25 de julio de 2026',
    events: [
      { ticker: 'SUI', name: 'Sui', type: 'Cliff', unlockTokens: 64_200_000, unlockUsd: 89_500_000, pctSupply: 1.8 },
      { ticker: 'DYDX', name: 'dYdX', type: 'Staking rewards', unlockTokens: 4_120_000, unlockUsd: 3_600_000, pctSupply: 0.6 },
      { ticker: 'W', name: 'Wormhole', type: 'Team / Investors', unlockTokens: 417_000_000, unlockUsd: 71_300_000, pctSupply: 4.7 },
    ],
  },
]
