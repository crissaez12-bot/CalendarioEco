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
  large: ['SL1 · 0.6%', 'SL2 · 1.0%', 'SL3 · 1.5%'],
  mid: ['SL1 · 0.8%', 'SL2 · 1.4%', 'SL3 · 2.0%'],
  small: ['SL1 · 0.8%', 'SL2 · 1.5%', 'SL3 · 2.2%'],
}

export const SL_TYPE_ROWS: Record<CapKey, AssetSlRow[]> = {
  large: [
    { ticker: 'ETH', sl1: { n: 204, wr: 73.5, total: 60.8 }, sl2: { n: 204, wr: 80.9, total: 65.6 }, sl3: { n: 204, wr: 85.3, total: 65.0 } },
    { ticker: 'BNB', sl1: { n: 42, wr: 78.6, total: 20.0 }, sl2: { n: 42, wr: 92.9, total: 26.8 }, sl3: { n: 42, wr: 95.2, total: 30.2 } },
    { ticker: 'XRP', sl1: { n: 43, wr: 72.1, total: 18.5 }, sl2: { n: 43, wr: 90.7, total: 28.9 }, sl3: { n: 43, wr: 93.0, total: 28.7 } },
    { ticker: 'SOL', sl1: { n: 119, wr: 66.4, total: 42.4 }, sl2: { n: 119, wr: 85.7, total: 69.6 }, sl3: { n: 119, wr: 87.4, total: 65.2 } },
    { ticker: 'TRX', sl1: { n: 93, wr: 71.0, total: 23.1 }, sl2: { n: 93, wr: 78.5, total: 24.0 }, sl3: { n: 93, wr: 82.8, total: 22.0 } },
    { ticker: 'HYPE', sl1: { n: 78, wr: 65.4, total: 36.9 }, sl2: { n: 78, wr: 80.8, total: 47.5 }, sl3: { n: 78, wr: 88.5, total: 57.9 } },
    { ticker: 'DOGE', sl1: { n: 102, wr: 66.7, total: 48.8 }, sl2: { n: 102, wr: 85.3, total: 75.4 }, sl3: { n: 102, wr: 92.2, total: 87.3 } },
  ],
  mid: [
    { ticker: 'ADA', sl1: { n: 78, wr: 75.6, total: 41.8 }, sl2: { n: 78, wr: 80.8, total: 38.5 }, sl3: { n: 78, wr: 83.3, total: 37.0 } },
    { ticker: 'LINK', sl1: { n: 106, wr: 74.5, total: 53.2 }, sl2: { n: 106, wr: 89.6, total: 78.5 }, sl3: { n: 106, wr: 90.6, total: 76.1 } },
    { ticker: 'XLM', sl1: { n: 88, wr: 79.5, total: 50.2 }, sl2: { n: 88, wr: 89.8, total: 62.9 }, sl3: { n: 88, wr: 93.2, total: 66.1 } },
    { ticker: 'TON', sl1: { n: 66, wr: 63.6, total: 18.6 }, sl2: { n: 66, wr: 78.8, total: 28.5 }, sl3: { n: 66, wr: 84.8, total: 33.6 } },
    { ticker: 'AVAX', sl1: { n: 90, wr: 67.8, total: 40.2 }, sl2: { n: 90, wr: 83.3, total: 57.8 }, sl3: { n: 90, wr: 87.8, total: 59.6 } },
    { ticker: 'UNI', sl1: { n: 120, wr: 74.2, total: 70.2 }, sl2: { n: 120, wr: 90.0, total: 96.2 }, sl3: { n: 120, wr: 95.8, total: 107.4 } },
    { ticker: 'ONDO', sl1: { n: 136, wr: 69.9, total: 57.9 }, sl2: { n: 136, wr: 89.0, total: 96.1 }, sl3: { n: 136, wr: 91.2, total: 97.1 } },
    { ticker: 'TAO', sl1: { n: 80, wr: 71.2, total: 40.2 }, sl2: { n: 80, wr: 90.0, total: 65.3 }, sl3: { n: 80, wr: 92.5, total: 67.5 } },
    { ticker: 'AAVE', sl1: { n: 143, wr: 69.9, total: 57.2 }, sl2: { n: 143, wr: 92.3, total: 109.5 }, sl3: { n: 143, wr: 95.8, total: 118.9 } },
    { ticker: 'DOT', sl1: { n: 81, wr: 71.6, total: 40.7 }, sl2: { n: 81, wr: 85.2, total: 54.6 }, sl3: { n: 81, wr: 86.4, total: 50.2 } },
    { ticker: 'PEPE', sl1: { n: 159, wr: 76.1, total: 78.6 }, sl2: { n: 159, wr: 88.7, total: 104.5 }, sl3: { n: 159, wr: 94.3, total: 120.9 } },
    { ticker: 'ETC', sl1: { n: 184, wr: 75.5, total: 61.1 }, sl2: { n: 184, wr: 85.3, total: 73.0 }, sl3: { n: 184, wr: 87.0, total: 68.9 } },
  ],
  small: [
    { ticker: 'ENA', sl1: { n: 96, wr: 68.8, total: 60.1 }, sl2: { n: 96, wr: 85.4, total: 83.7 }, sl3: { n: 96, wr: 88.5, total: 87.3 } },
    { ticker: 'POL', sl1: { n: 151, wr: 70.9, total: 64.0 }, sl2: { n: 151, wr: 82.8, total: 77.1 }, sl3: { n: 151, wr: 87.4, total: 84.5 } },
    { ticker: 'KAS', sl1: { n: 131, wr: 77.1, total: 88.0 }, sl2: { n: 131, wr: 88.5, total: 106.6 }, sl3: { n: 131, wr: 90.8, total: 111.8 } },
    { ticker: 'RENDER', sl1: { n: 161, wr: 72.7, total: 91.0 }, sl2: { n: 161, wr: 87.6, total: 122.0 }, sl3: { n: 161, wr: 90.1, total: 119.0 } },
    { ticker: 'ALGO', sl1: { n: 111, wr: 72.1, total: 70.1 }, sl2: { n: 111, wr: 85.6, total: 85.0 }, sl3: { n: 111, wr: 91.0, total: 97.7 } },
    { ticker: 'ATOM', sl1: { n: 81, wr: 75.3, total: 53.9 }, sl2: { n: 81, wr: 87.7, total: 63.5 }, sl3: { n: 81, wr: 88.9, total: 61.1 } },
    { ticker: 'JUP', sl1: { n: 116, wr: 71.6, total: 69.4 }, sl2: { n: 116, wr: 86.2, total: 92.0 }, sl3: { n: 116, wr: 92.2, total: 102.3 } },
    { ticker: 'FIL', sl1: { n: 114, wr: 64.0, total: 46.7 }, sl2: { n: 114, wr: 80.7, total: 67.5 }, sl3: { n: 114, wr: 86.0, total: 71.1 } },
    { ticker: 'ARB', sl1: { n: 102, wr: 71.6, total: 53.5 }, sl2: { n: 102, wr: 88.2, total: 77.9 }, sl3: { n: 102, wr: 89.2, total: 73.2 } },
    { ticker: 'APT', sl1: { n: 110, wr: 70.9, total: 57.1 }, sl2: { n: 110, wr: 81.8, total: 67.9 }, sl3: { n: 110, wr: 86.4, total: 72.1 } },
    { ticker: 'CAKE', sl1: { n: 53, wr: 71.7, total: 25.8 }, sl2: { n: 53, wr: 92.5, total: 44.8 }, sl3: { n: 53, wr: 92.5, total: 42.0 } },
    { ticker: 'AERO', sl1: { n: 147, wr: 63.9, total: 62.4 }, sl2: { n: 147, wr: 81.0, total: 93.0 }, sl3: { n: 147, wr: 87.1, total: 100.7 } },
    { ticker: 'VET', sl1: { n: 87, wr: 71.3, total: 55.2 }, sl2: { n: 87, wr: 86.2, total: 68.5 }, sl3: { n: 87, wr: 88.5, total: 65.2 } },
    { ticker: 'DASH', sl1: { n: 103, wr: 70.9, total: 51.4 }, sl2: { n: 103, wr: 85.4, total: 66.8 }, sl3: { n: 103, wr: 94.2, total: 85.4 } },
    { ticker: 'PENGU', sl1: { n: 183, wr: 62.3, total: 79.9 }, sl2: { n: 183, wr: 84.2, total: 136.5 }, sl3: { n: 183, wr: 88.0, total: 138.0 } },
    { ticker: 'LDO', sl1: { n: 159, wr: 73.0, total: 92.4 }, sl2: { n: 159, wr: 87.4, total: 122.5 }, sl3: { n: 159, wr: 91.2, total: 127.4 } },
    { ticker: 'TIA', sl1: { n: 96, wr: 66.7, total: 46.5 }, sl2: { n: 96, wr: 86.5, total: 74.4 }, sl3: { n: 96, wr: 91.7, total: 83.0 } },
    { ticker: 'SEI', sl1: { n: 135, wr: 72.6, total: 71.0 }, sl2: { n: 135, wr: 83.7, total: 85.4 }, sl3: { n: 135, wr: 89.6, total: 98.2 } },
  ],
}

export function bestSlIndex(row: AssetSlRow): 0 | 1 | 2 {
  const totals = [row.sl1.total, row.sl2.total, row.sl3.total]
  const best = Math.max(...totals)
  return totals.indexOf(best) as 0 | 1 | 2
}

// BTC evaluado SOLO (no se agrupa con Large-cap): ademas de distorsionar
// cualquier promedio por su tamano, genera muchisimas menos senales que el
// resto (n=38 en ~18.5 meses vs 681 pooled de los otros 7 large-caps juntos) --
// mezclarlo hubiera diluido el analisis Y su propia muestra es chica para
// sacar una conclusion firme aparte. Misma metodologia (entrada tuneada, motor
// v2, proteccion a mitad de banda).
export interface BtcSoloCombo {
  sl: number
  tp: number
  wr: number
  avg: number
  total: number
  note: string
}

export const BTC_SOLO = {
  n: 38,
  slMedian: 0.89,
  slMean: 1.07,
  slP25: 0.6,
  slP75: 1.17,
  slMax: 4.85,
  recommended: { sl: 1.5, tp: 1.5, wr: 81.6, avg: 0.496, total: 18.8 },
  combos: [
    { sl: 0.6, tp: 0.9, wr: 63.2, avg: 0.27, total: 10.2, note: 'El más flojo probado' },
    { sl: 1.0, tp: 0.9, wr: 76.3, avg: 0.369, total: 14.0, note: 'TP del grupo Large-cap' },
    { sl: 1.5, tp: 0.9, wr: 84.2, avg: 0.423, total: 16.1, note: '' },
    { sl: 1.0, tp: 1.0, wr: 76.3, avg: 0.415, total: 15.8, note: 'Redondo, fácil de operar' },
    { sl: 1.5, tp: 1.5, wr: 81.6, avg: 0.496, total: 18.8, note: 'Recomendado' },
    { sl: 2.0, tp: 2.0, wr: 84.2, avg: 0.563, total: 21.4, note: 'Óptimo técnico — borde de la grilla probada, sospechoso de sobreajuste con n=38' },
  ] as BtcSoloCombo[],
}
