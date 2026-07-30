// Segmentacion de los 39 activos del backtest v2 por capitalizacion de mercado
// real (CoinGecko, 2026-07-30). BTC excluido (outlier de cap que distorsiona
// cualquier grupo), XAU excluido (no es cripto, sin market cap comparable).
// Datos generados en signal-desk (ver skill Monte Carlo) corriendo el motor v2
// (entrada tuneada por activo, SL banda+ATR, proteccion a mitad de banda) por
// separado en cada grupo sobre datos reales 1h (~18.5 meses).
//
// El TP dejo de ser un numero unico por grupo (2026-07-30): ahora es optimo
// por ACTIVO y por DIRECCION (long/short) -- ver LONG_SHORT_TP mas abajo, que
// es la fuente real usada en el mensaje de Telegram (mc_feed.ASSET_TP). Los
// n/wr/avg/total/dd/streak de GROUPS ya reflejan ese TP por direccion (no el
// TP unico viejo) -- son los numeros vigentes.

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
  assets: GroupAsset[]
}

export const GROUPS: GroupStats[] = [
  {
    key: 'large',
    label: 'Large-cap',
    range: '≥ $10B',
    n: 681,
    wr: 89.0,
    avg: 0.571,
    total: 388.9,
    dd: 10.8,
    streak: 7,
    slMedian: 0.98,
    slMean: 1.26,
    slP25: 0.58,
    slP75: 1.56,
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
    wr: 90.5,
    avg: 0.733,
    total: 975.7,
    dd: 17.4,
    streak: 5,
    slMedian: 1.24,
    slMean: 1.53,
    slP25: 0.76,
    slP75: 1.98,
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
    wr: 91.3,
    avg: 0.815,
    total: 1741.8,
    dd: 23.4,
    streak: 8,
    slMedian: 1.29,
    slMean: 1.64,
    slP25: 0.78,
    slP75: 2.14,
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

// TP optimo POR ACTIVO y POR DIRECCION (long/short) -- reemplaza al TP unico
// por grupo (2026-07-30). Barrido real 0.6%-4.0%, SL fijo del grupo (sin
// cambios), maximizando la rentabilidad TOTAL de cada lado por separado -- no
// el win rate. Es la misma fuente que usa el mensaje de Telegram
// (mc_feed.ASSET_TP). totalOld = el mismo activo con el TP unico anterior,
// para poder mostrar la mejora real que trajo separar por direccion.
export interface DirectionResult {
  tp: number
  n: number
  wr: number
  total: number
}

export interface AssetDirectionRow {
  ticker: string
  sl: number
  totalOld: number
  long: DirectionResult
  short: DirectionResult
  totalNew: number
  delta: number
  deltaPct: number
}

export const LONG_SHORT_TP: Record<CapKey, AssetDirectionRow[]> = {
  large: [
    { ticker: 'HYPE', sl: 1.5, totalOld: 57.9, long: { tp: 1.5, n: 60, wr: 80.0, total: 43.6 }, short: { tp: 1.5, n: 18, wr: 100.0, total: 28.0 }, totalNew: 71.6, delta: 13.7, deltaPct: 23.7 },
    { ticker: 'TRX', sl: 1.5, totalOld: 22.0, long: { tp: 0.8, n: 82, wr: 85.4, total: 19.9 }, short: { tp: 0.6, n: 11, wr: 90.9, total: 5.4 }, totalNew: 25.3, delta: 3.3, deltaPct: 15.0 },
    { ticker: 'ETH', sl: 1.5, totalOld: 65.0, long: { tp: 0.8, n: 161, wr: 88.2, total: 58.7 }, short: { tp: 0.8, n: 43, wr: 86.0, total: 13.8 }, totalNew: 72.5, delta: 7.5, deltaPct: 11.5 },
    { ticker: 'SOL', sl: 1.5, totalOld: 65.2, long: { tp: 0.6, n: 94, wr: 92.6, total: 52.3 }, short: { tp: 1.25, n: 25, wr: 84.0, total: 17.7 }, totalNew: 70.0, delta: 4.8, deltaPct: 7.4 },
    { ticker: 'BNB', sl: 1.5, totalOld: 30.2, long: { tp: 1.5, n: 25, wr: 96.0, total: 20.4 }, short: { tp: 0.9, n: 17, wr: 94.1, total: 11.6 }, totalNew: 32.0, delta: 1.8, deltaPct: 6.0 },
    { ticker: 'DOGE', sl: 1.5, totalOld: 87.3, long: { tp: 0.9, n: 81, wr: 92.6, total: 68.8 }, short: { tp: 1.25, n: 21, wr: 85.7, total: 19.8 }, totalNew: 88.6, delta: 1.3, deltaPct: 1.5 },
    { ticker: 'XRP', sl: 1.5, totalOld: 28.8, long: { tp: 0.9, n: 36, wr: 91.7, total: 20.5 }, short: { tp: 0.9, n: 7, wr: 100.0, total: 8.3 }, totalNew: 28.8, delta: 0.0, deltaPct: 0.0 },
  ],
  mid: [
    { ticker: 'ADA', sl: 2.0, totalOld: 37.0, long: { tp: 0.6, n: 55, wr: 96.4, total: 40.5 }, short: { tp: 0.6, n: 23, wr: 82.6, total: 8.2 }, totalNew: 48.7, delta: 11.7, deltaPct: 31.6 },
    { ticker: 'TON', sl: 2.0, totalOld: 33.7, long: { tp: 2.5, n: 41, wr: 80.5, total: 25.1 }, short: { tp: 2.0, n: 25, wr: 84.0, total: 16.7 }, totalNew: 41.8, delta: 8.1, deltaPct: 24.0 },
    { ticker: 'ETC', sl: 2.0, totalOld: 68.9, long: { tp: 0.9, n: 145, wr: 86.9, total: 50.2 }, short: { tp: 0.6, n: 39, wr: 97.4, total: 29.2 }, totalNew: 79.4, delta: 10.5, deltaPct: 15.2 },
    { ticker: 'ONDO', sl: 2.0, totalOld: 97.1, long: { tp: 1.25, n: 91, wr: 86.8, total: 70.5 }, short: { tp: 1.5, n: 45, wr: 88.9, total: 39.5 }, totalNew: 110.0, delta: 12.9, deltaPct: 13.3 },
    { ticker: 'TAO', sl: 2.0, totalOld: 67.5, long: { tp: 0.9, n: 42, wr: 92.9, total: 36.3 }, short: { tp: 1.1, n: 38, wr: 92.1, total: 38.5 }, totalNew: 74.8, delta: 7.3, deltaPct: 10.8 },
    { ticker: 'XLM', sl: 2.0, totalOld: 66.1, long: { tp: 0.8, n: 67, wr: 95.5, total: 53.3 }, short: { tp: 1.5, n: 21, wr: 85.7, total: 18.2 }, totalNew: 71.5, delta: 5.4, deltaPct: 8.2 },
    { ticker: 'AVAX', sl: 2.0, totalOld: 59.6, long: { tp: 1.0, n: 63, wr: 85.7, total: 38.4 }, short: { tp: 0.7, n: 27, wr: 92.6, total: 25.9 }, totalNew: 64.3, delta: 4.7, deltaPct: 7.9 },
    { ticker: 'AAVE', sl: 2.0, totalOld: 118.9, long: { tp: 1.1, n: 102, wr: 92.2, total: 82.9 }, short: { tp: 1.1, n: 41, wr: 92.7, total: 42.6 }, totalNew: 125.5, delta: 6.6, deltaPct: 5.6 },
    { ticker: 'LINK', sl: 2.0, totalOld: 76.1, long: { tp: 1.0, n: 76, wr: 86.8, total: 53.5 }, short: { tp: 1.0, n: 30, wr: 90.0, total: 24.4 }, totalNew: 77.9, delta: 1.8, deltaPct: 2.4 },
    { ticker: 'DOT', sl: 2.0, totalOld: 50.2, long: { tp: 0.8, n: 65, wr: 87.7, total: 38.4 }, short: { tp: 2.0, n: 16, wr: 81.2, total: 13.0 }, totalNew: 51.4, delta: 1.2, deltaPct: 2.4 },
    { ticker: 'PEPE', sl: 2.0, totalOld: 120.8, long: { tp: 0.8, n: 126, wr: 93.7, total: 82.8 }, short: { tp: 1.0, n: 33, wr: 97.0, total: 40.1 }, totalNew: 122.9, delta: 2.1, deltaPct: 1.7 },
    { ticker: 'UNI', sl: 2.0, totalOld: 107.4, long: { tp: 0.8, n: 81, wr: 98.8, total: 77.9 }, short: { tp: 0.8, n: 39, wr: 89.7, total: 29.5 }, totalNew: 107.4, delta: 0.0, deltaPct: 0.0 },
  ],
  small: [
    { ticker: 'APT', sl: 2.2, totalOld: 72.1, long: { tp: 0.6, n: 71, wr: 98.6, total: 58.5 }, short: { tp: 1.1, n: 39, wr: 87.2, total: 30.5 }, totalNew: 89.0, delta: 16.9, deltaPct: 23.4 },
    { ticker: 'JUP', sl: 2.2, totalOld: 102.2, long: { tp: 2.0, n: 80, wr: 87.5, total: 81.4 }, short: { tp: 1.5, n: 36, wr: 88.9, total: 35.1 }, totalNew: 116.5, delta: 14.3, deltaPct: 14.0 },
    { ticker: 'PENGU', sl: 2.2, totalOld: 138.0, long: { tp: 0.7, n: 117, wr: 95.7, total: 90.0 }, short: { tp: 0.8, n: 66, wr: 95.5, total: 63.4 }, totalNew: 153.4, delta: 15.4, deltaPct: 11.2 },
    { ticker: 'ALGO', sl: 2.2, totalOld: 97.7, long: { tp: 1.25, n: 78, wr: 91.0, total: 69.3 }, short: { tp: 1.25, n: 33, wr: 90.9, total: 38.7 }, totalNew: 108.0, delta: 10.3, deltaPct: 10.5 },
    { ticker: 'ATOM', sl: 2.2, totalOld: 61.1, long: { tp: 0.8, n: 53, wr: 90.6, total: 35.0 }, short: { tp: 1.1, n: 28, wr: 100.0, total: 31.4 }, totalNew: 66.4, delta: 5.3, deltaPct: 8.7 },
    { ticker: 'SEI', sl: 2.2, totalOld: 98.3, long: { tp: 0.7, n: 105, wr: 96.2, total: 80.6 }, short: { tp: 0.7, n: 30, wr: 96.7, total: 25.8 }, totalNew: 106.4, delta: 8.1, deltaPct: 8.2 },
    { ticker: 'LDO', sl: 2.2, totalOld: 127.4, long: { tp: 1.25, n: 108, wr: 88.9, total: 89.8 }, short: { tp: 1.5, n: 51, wr: 86.3, total: 47.1 }, totalNew: 136.9, delta: 9.5, deltaPct: 7.5 },
    { ticker: 'AERO', sl: 2.2, totalOld: 100.7, long: { tp: 0.7, n: 87, wr: 90.8, total: 51.1 }, short: { tp: 1.1, n: 60, wr: 90.0, total: 57.0 }, totalNew: 108.1, delta: 7.4, deltaPct: 7.3 },
    { ticker: 'DASH', sl: 2.2, totalOld: 85.4, long: { tp: 1.1, n: 70, wr: 91.4, total: 47.9 }, short: { tp: 1.5, n: 33, wr: 97.0, total: 43.6 }, totalNew: 91.5, delta: 6.1, deltaPct: 7.1 },
    { ticker: 'FIL', sl: 2.2, totalOld: 71.0, long: { tp: 0.9, n: 85, wr: 85.9, total: 45.9 }, short: { tp: 1.25, n: 29, wr: 89.7, total: 29.1 }, totalNew: 75.0, delta: 4.0, deltaPct: 5.6 },
    { ticker: 'TIA', sl: 2.2, totalOld: 83.1, long: { tp: 1.25, n: 65, wr: 87.7, total: 53.0 }, short: { tp: 1.1, n: 31, wr: 93.5, total: 34.4 }, totalNew: 87.4, delta: 4.3, deltaPct: 5.2 },
    { ticker: 'ENA', sl: 2.2, totalOld: 87.2, long: { tp: 1.25, n: 66, wr: 86.4, total: 58.9 }, short: { tp: 1.75, n: 30, wr: 80.0, total: 32.5 }, totalNew: 91.4, delta: 4.2, deltaPct: 4.8 },
    { ticker: 'VET', sl: 2.2, totalOld: 65.2, long: { tp: 0.9, n: 62, wr: 88.7, total: 40.0 }, short: { tp: 1.5, n: 25, wr: 88.0, total: 27.9 }, totalNew: 67.9, delta: 2.7, deltaPct: 4.1 },
    { ticker: 'KAS', sl: 2.2, totalOld: 111.8, long: { tp: 0.8, n: 92, wr: 93.5, total: 77.0 }, short: { tp: 1.0, n: 39, wr: 94.9, total: 39.1 }, totalNew: 116.1, delta: 4.3, deltaPct: 3.8 },
    { ticker: 'RENDER', sl: 2.2, totalOld: 118.9, long: { tp: 0.9, n: 133, wr: 91.0, total: 93.8 }, short: { tp: 1.25, n: 28, wr: 92.9, total: 29.3 }, totalNew: 123.1, delta: 4.2, deltaPct: 3.5 },
    { ticker: 'ARB', sl: 2.2, totalOld: 73.2, long: { tp: 0.9, n: 73, wr: 91.8, total: 54.5 }, short: { tp: 0.9, n: 29, wr: 89.7, total: 21.2 }, totalNew: 75.7, delta: 2.5, deltaPct: 3.4 },
    { ticker: 'POL', sl: 2.2, totalOld: 84.5, long: { tp: 0.6, n: 105, wr: 91.4, total: 47.3 }, short: { tp: 1.25, n: 46, wr: 91.3, total: 39.4 }, totalNew: 86.7, delta: 2.2, deltaPct: 2.6 },
    { ticker: 'CAKE', sl: 2.2, totalOld: 41.9, long: { tp: 1.0, n: 36, wr: 94.4, total: 29.8 }, short: { tp: 1.0, n: 17, wr: 88.2, total: 12.1 }, totalNew: 41.9, delta: 0.0, deltaPct: 0.0 },
  ],
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
