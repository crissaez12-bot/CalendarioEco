// Segmentacion de los 39 activos del backtest v2 por capitalizacion de mercado
// real (CoinGecko, 2026-07-30). BTC excluido (outlier de cap que distorsiona
// cualquier grupo), XAU excluido (no es cripto, sin market cap comparable).
// Datos generados en signal-desk (ver skill Monte Carlo) corriendo el motor v2
// (entrada tuneada por activo, SL banda+ATR, proteccion a mitad de banda, TP
// unico sin split) por separado en cada grupo sobre datos reales 1h (~18.5 meses).

export type CapKey = 'large' | 'mid' | 'small'

export interface GroupAsset {
  ticker: string
  mcap: string
}

export interface GroupStats {
  key: CapKey
  label: string
  range: string
  n: number
  wr: number
  avg: number
  total: number
  dd: number
  streak: number
  slMedian: number
  slMean: number
  slP25: number
  slP75: number
  tp: number
  assets: GroupAsset[]
}

export const GROUPS: GroupStats[] = [
  {
    key: 'large',
    label: 'Large-cap',
    range: '≥ $10B',
    n: 681,
    wr: 84.6,
    avg: 0.553,
    total: 376.7,
    dd: 10.6,
    streak: 8,
    slMedian: 0.98,
    slMean: 1.26,
    slP25: 0.58,
    slP75: 1.56,
    tp: 0.9,
    assets: [
      { ticker: 'ETH', mcap: '$232B' },
      { ticker: 'BNB', mcap: '$79B' },
      { ticker: 'XRP', mcap: '$68B' },
      { ticker: 'SOL', mcap: '$43B' },
      { ticker: 'TRX', mcap: '$31B' },
      { ticker: 'HYPE', mcap: '$12.2B' },
      { ticker: 'DOGE', mcap: '$11.0B' },
    ],
  },
  {
    key: 'mid',
    label: 'Mid-cap',
    range: '$1B – $10B',
    n: 1331,
    wr: 88.1,
    avg: 0.7,
    total: 931.3,
    dd: 8.8,
    streak: 5,
    slMedian: 1.24,
    slMean: 1.53,
    slP25: 0.76,
    slP75: 1.98,
    tp: 0.8,
    assets: [
      { ticker: 'ADA', mcap: '$6.4B' },
      { ticker: 'LINK', mcap: '$6.3B' },
      { ticker: 'XLM', mcap: '$5.9B' },
      { ticker: 'TON', mcap: '$3.9B' },
      { ticker: 'AVAX', mcap: '$2.8B' },
      { ticker: 'UNI', mcap: '$2.8B' },
      { ticker: 'ONDO', mcap: '$2.0B' },
      { ticker: 'TAO', mcap: '$1.9B' },
      { ticker: 'AAVE', mcap: '$1.5B' },
      { ticker: 'DOT', mcap: '$1.3B' },
      { ticker: 'PEPE', mcap: '$1.2B' },
      { ticker: 'ETC', mcap: '$1.1B' },
    ],
  },
  {
    key: 'small',
    label: 'Small-cap',
    range: '< $1B',
    n: 2136,
    wr: 85.7,
    avg: 0.774,
    total: 1653.0,
    dd: 18.9,
    streak: 8,
    slMedian: 1.29,
    slMean: 1.64,
    slP25: 0.78,
    slP75: 2.14,
    tp: 1.0,
    assets: [
      { ticker: 'ENA', mcap: '$782M' },
      { ticker: 'POL', mcap: '$764M' },
      { ticker: 'KAS', mcap: '$759M' },
      { ticker: 'RENDER', mcap: '$739M' },
      { ticker: 'ALGO', mcap: '$708M' },
      { ticker: 'ATOM', mcap: '$675M' },
      { ticker: 'JUP', mcap: '$656M' },
      { ticker: 'FIL', mcap: '$582M' },
      { ticker: 'ARB', mcap: '$520M' },
      { ticker: 'APT', mcap: '$489M' },
      { ticker: 'CAKE', mcap: '$473M' },
      { ticker: 'AERO', mcap: '$424M' },
      { ticker: 'VET', mcap: '$411M' },
      { ticker: 'DASH', mcap: '$387M' },
      { ticker: 'PENGU', mcap: '$369M' },
      { ticker: 'LDO', mcap: '$316M' },
      { ticker: 'TIA', mcap: '$312M' },
      { ticker: 'SEI', mcap: '$289M' },
    ],
  },
]

// Backtest de 3 tipos de SL fijo (P25 / punto medio / P75 del rango de cada
// grupo) cruzado con el TP optimo de ese grupo, corrido activo por activo.
export interface SlTypeResult {
  n: number
  wr: number
  total: number
}

export interface AssetSlRow {
  ticker: string
  sl1: SlTypeResult
  sl2: SlTypeResult
  sl3: SlTypeResult
}

export const SL_TYPE_LABELS: Record<CapKey, [string, string, string]> = {
  large: ['SL1 · 0.58%', 'SL2 · 1.07%', 'SL3 · 1.56%'],
  mid: ['SL1 · 0.76%', 'SL2 · 1.37%', 'SL3 · 1.98%'],
  small: ['SL1 · 0.78%', 'SL2 · 1.46%', 'SL3 · 2.14%'],
}

export const SL_TYPE_ROWS: Record<CapKey, AssetSlRow[]> = {
  large: [
    { ticker: 'ETH', sl1: { n: 204, wr: 72.1, total: 57.7 }, sl2: { n: 204, wr: 81.9, total: 65.8 }, sl3: { n: 204, wr: 85.3, total: 63.2 } },
    { ticker: 'BNB', sl1: { n: 42, wr: 78.6, total: 20.2 }, sl2: { n: 42, wr: 92.9, total: 28.2 }, sl3: { n: 42, wr: 95.2, total: 30.2 } },
    { ticker: 'XRP', sl1: { n: 43, wr: 72.1, total: 18.8 }, sl2: { n: 43, wr: 90.7, total: 28.6 }, sl3: { n: 43, wr: 93.0, total: 28.6 } },
    { ticker: 'SOL', sl1: { n: 119, wr: 64.7, total: 39.8 }, sl2: { n: 119, wr: 86.6, total: 70.0 }, sl3: { n: 119, wr: 88.2, total: 66.7 } },
    { ticker: 'TRX', sl1: { n: 93, wr: 71.0, total: 23.6 }, sl2: { n: 93, wr: 78.5, total: 22.6 }, sl3: { n: 93, wr: 82.8, total: 21.0 } },
    { ticker: 'HYPE', sl1: { n: 78, wr: 64.1, total: 35.6 }, sl2: { n: 78, wr: 82.1, total: 48.5 }, sl3: { n: 78, wr: 91.0, total: 62.4 } },
    { ticker: 'DOGE', sl1: { n: 102, wr: 66.7, total: 49.5 }, sl2: { n: 102, wr: 86.3, total: 77.3 }, sl3: { n: 102, wr: 92.2, total: 86.8 } },
  ],
  mid: [
    { ticker: 'ADA', sl1: { n: 78, wr: 74.4, total: 41.0 }, sl2: { n: 78, wr: 80.8, total: 39.0 }, sl3: { n: 78, wr: 83.3, total: 35.6 } },
    { ticker: 'LINK', sl1: { n: 106, wr: 69.8, total: 44.1 }, sl2: { n: 106, wr: 89.6, total: 78.8 }, sl3: { n: 106, wr: 90.6, total: 76.3 } },
    { ticker: 'XLM', sl1: { n: 88, wr: 78.4, total: 49.4 }, sl2: { n: 88, wr: 88.6, total: 60.4 }, sl3: { n: 88, wr: 93.2, total: 66.3 } },
    { ticker: 'TON', sl1: { n: 66, wr: 62.1, total: 18.2 }, sl2: { n: 66, wr: 78.8, total: 28.9 }, sl3: { n: 66, wr: 84.8, total: 33.8 } },
    { ticker: 'AVAX', sl1: { n: 90, wr: 65.6, total: 38.3 }, sl2: { n: 90, wr: 83.3, total: 58.2 }, sl3: { n: 90, wr: 87.8, total: 59.8 } },
    { ticker: 'UNI', sl1: { n: 120, wr: 72.5, total: 67.1 }, sl2: { n: 120, wr: 90.0, total: 96.6 }, sl3: { n: 120, wr: 95.8, total: 107.5 } },
    { ticker: 'ONDO', sl1: { n: 136, wr: 66.9, total: 51.8 }, sl2: { n: 136, wr: 87.5, total: 90.0 }, sl3: { n: 136, wr: 91.2, total: 97.3 } },
    { ticker: 'TAO', sl1: { n: 80, wr: 70.0, total: 39.7 }, sl2: { n: 80, wr: 90.0, total: 65.5 }, sl3: { n: 80, wr: 92.5, total: 67.7 } },
    { ticker: 'AAVE', sl1: { n: 143, wr: 69.9, total: 58.9 }, sl2: { n: 143, wr: 90.9, total: 104.8 }, sl3: { n: 143, wr: 95.8, total: 119.0 } },
    { ticker: 'DOT', sl1: { n: 81, wr: 71.6, total: 41.6 }, sl2: { n: 81, wr: 85.2, total: 54.9 }, sl3: { n: 81, wr: 86.4, total: 50.4 } },
    { ticker: 'PEPE', sl1: { n: 159, wr: 73.6, total: 73.6 }, sl2: { n: 159, wr: 88.7, total: 105.0 }, sl3: { n: 159, wr: 93.7, total: 118.3 } },
    { ticker: 'ETC', sl1: { n: 184, wr: 74.5, total: 59.8 }, sl2: { n: 184, wr: 85.3, total: 73.8 }, sl3: { n: 184, wr: 87.0, total: 69.4 } },
  ],
  small: [
    { ticker: 'ENA', sl1: { n: 96, wr: 67.7, total: 56.5 }, sl2: { n: 96, wr: 85.4, total: 84.3 }, sl3: { n: 96, wr: 88.5, total: 87.9 } },
    { ticker: 'POL', sl1: { n: 151, wr: 70.2, total: 63.1 }, sl2: { n: 151, wr: 82.1, total: 75.7 }, sl3: { n: 151, wr: 87.4, total: 85.4 } },
    { ticker: 'KAS', sl1: { n: 131, wr: 76.3, total: 84.9 }, sl2: { n: 131, wr: 88.5, total: 107.2 }, sl3: { n: 131, wr: 90.8, total: 112.4 } },
    { ticker: 'RENDER', sl1: { n: 161, wr: 70.8, total: 85.6 }, sl2: { n: 161, wr: 87.0, total: 120.3 }, sl3: { n: 161, wr: 90.1, total: 119.9 } },
    { ticker: 'ALGO', sl1: { n: 111, wr: 71.2, total: 68.1 }, sl2: { n: 111, wr: 85.6, total: 85.7 }, sl3: { n: 111, wr: 91.0, total: 96.1 } },
    { ticker: 'ATOM', sl1: { n: 81, wr: 75.3, total: 54.3 }, sl2: { n: 81, wr: 85.2, total: 58.8 }, sl3: { n: 81, wr: 88.9, total: 61.6 } },
    { ticker: 'JUP', sl1: { n: 116, wr: 71.6, total: 70.0 }, sl2: { n: 116, wr: 86.2, total: 92.6 }, sl3: { n: 116, wr: 91.4, total: 99.9 } },
    { ticker: 'FIL', sl1: { n: 114, wr: 61.4, total: 41.6 }, sl2: { n: 114, wr: 80.7, total: 68.4 }, sl3: { n: 114, wr: 86.0, total: 72.0 } },
    { ticker: 'ARB', sl1: { n: 102, wr: 70.6, total: 52.2 }, sl2: { n: 102, wr: 88.2, total: 78.3 }, sl3: { n: 102, wr: 89.2, total: 73.9 } },
    { ticker: 'APT', sl1: { n: 110, wr: 70.9, total: 57.8 }, sl2: { n: 110, wr: 81.8, total: 68.7 }, sl3: { n: 110, wr: 86.4, total: 72.9 } },
    { ticker: 'CAKE', sl1: { n: 53, wr: 69.8, total: 24.3 }, sl2: { n: 53, wr: 92.5, total: 44.9 }, sl3: { n: 53, wr: 92.5, total: 42.2 } },
    { ticker: 'AERO', sl1: { n: 147, wr: 63.3, total: 61.5 }, sl2: { n: 147, wr: 81.0, total: 94.1 }, sl3: { n: 147, wr: 85.7, total: 95.6 } },
    { ticker: 'VET', sl1: { n: 87, wr: 69.0, total: 51.8 }, sl2: { n: 87, wr: 85.1, total: 67.0 }, sl3: { n: 87, wr: 88.5, total: 65.8 } },
    { ticker: 'DASH', sl1: { n: 103, wr: 69.9, total: 50.4 }, sl2: { n: 103, wr: 85.4, total: 67.4 }, sl3: { n: 103, wr: 94.2, total: 85.8 } },
    { ticker: 'PENGU', sl1: { n: 183, wr: 61.2, total: 77.1 }, sl2: { n: 183, wr: 83.6, total: 135.2 }, sl3: { n: 183, wr: 88.0, total: 139.4 } },
    { ticker: 'LDO', sl1: { n: 159, wr: 69.2, total: 81.3 }, sl2: { n: 159, wr: 86.8, total: 120.9 }, sl3: { n: 159, wr: 91.2, total: 128.3 } },
    { ticker: 'TIA', sl1: { n: 96, wr: 65.6, total: 45.3 }, sl2: { n: 96, wr: 86.5, total: 74.9 }, sl3: { n: 96, wr: 90.6, total: 78.6 } },
    { ticker: 'SEI', sl1: { n: 135, wr: 70.4, total: 64.6 }, sl2: { n: 135, wr: 83.7, total: 86.3 }, sl3: { n: 135, wr: 89.6, total: 99.1 } },
  ],
}

export function bestSlIndex(row: AssetSlRow): 0 | 1 | 2 {
  const totals = [row.sl1.total, row.sl2.total, row.sl3.total]
  const best = Math.max(...totals)
  return totals.indexOf(best) as 0 | 1 | 2
}
