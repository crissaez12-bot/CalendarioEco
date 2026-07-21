export type Timeframe = '1h' | '15m'
export type Signal = 'bull' | 'bear' | 'none'

export interface AssetRow {
  name: string
  ticker: string
  tier: 1 | 2 | 3
  price: number
  basis: number
  upper: number
  lower: number
  signal: Signal
  osc: number
  oscConfirm: boolean
  atr: number
  updated: string
}

export interface AssetDetail {
  instructions: string[]
  pros: string[]
  cons: string[]
  stats: { wr: number; n: number; sumaPct: number }
}

// La tendencia de BTC (1D/4H/1H) ahora es en vivo -- ver src/data/btcTrend.ts (useBtcTrend()),
// que consulta GET /btc-trend en signal-desk (klines de Bybit/OKX, sin TradingView).

export const ASSET_ICON: Record<string, string> = {
  HYPE: 'https://coin-images.coingecko.com/coins/images/50882/large/hyperliquid.jpg?1729431300',
  ONDO: 'https://coin-images.coingecko.com/coins/images/26580/large/ONDO.png?1696525656',
  LDO: 'https://coin-images.coingecko.com/coins/images/13573/large/Lido_DAO.png?1696513326',
  SOL: 'https://coin-images.coingecko.com/coins/images/4128/large/solana.png?1718769756',
  LINK: 'https://coin-images.coingecko.com/coins/images/877/large/Chainlink_Logo_500.png?1760023405',
  BTC: 'https://coin-images.coingecko.com/coins/images/1/large/bitcoin.png?1696501400',
  ETH: 'https://coin-images.coingecko.com/coins/images/279/large/ethereum.png?1696501628',
  UNI: 'https://coin-images.coingecko.com/coins/images/12504/large/uniswap-logo.png?1720676669',
  SEI: 'https://coin-images.coingecko.com/coins/images/28205/large/Sei_Logo_-_Transparent.png?1696527207',
  XLM: 'https://coin-images.coingecko.com/coins/images/100/large/fmpFRHHQ_400x400.jpg?1735231350',
  DOGE: 'https://coin-images.coingecko.com/coins/images/5/large/dogecoin.png?1696501409',
  XRP: 'https://coin-images.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png?1696501442',
  BNB: 'https://coin-images.coingecko.com/coins/images/825/large/bnb-icon2_2x.png?1696501970',
  ADA: 'https://coin-images.coingecko.com/coins/images/975/large/cardano.png?1696502090',
  TRX: 'https://coin-images.coingecko.com/coins/images/1094/large/photo_2026-04-13_09-59-16.png?1776048311',
  AVAX: 'https://coin-images.coingecko.com/coins/images/12559/large/Avalanche_Circle_RedWhite_Trans.png?1696512369',
  TAO: 'https://coin-images.coingecko.com/coins/images/28452/large/ARUsPeNQ_400x400.jpeg?1696527447',
  DOT: 'https://coin-images.coingecko.com/coins/images/12171/large/polkadot.jpg?1766533446',
  AAVE: 'https://coin-images.coingecko.com/coins/images/12645/large/aave-token-round.png?1720472354',
  PEPE: 'https://coin-images.coingecko.com/coins/images/29850/large/pepe-token.jpeg?1696528776',
  ETC: 'https://coin-images.coingecko.com/coins/images/453/large/ethereum-classic-logo.png?1696501717',
  POL: 'https://coin-images.coingecko.com/coins/images/32440/large/pol.png?1759114181',
  ENA: 'https://coin-images.coingecko.com/coins/images/36530/large/ethena.png?1711701436',
  RENDER: 'https://coin-images.coingecko.com/coins/images/11636/large/rndr.png?1696511529',
  KAS: 'https://coin-images.coingecko.com/coins/images/25751/large/kaspa-icon-exchanges.png?1696524837',
  ATOM: 'https://coin-images.coingecko.com/coins/images/1481/large/cosmos_hub.png?1696502525',
  ALGO: 'https://coin-images.coingecko.com/coins/images/4380/large/download.png?1696504978',
  JUP: 'https://coin-images.coingecko.com/coins/images/34188/large/jup.png?1704266489',
  ARB: 'https://coin-images.coingecko.com/coins/images/16547/large/arb.jpg?1721358242',
  APT: 'https://coin-images.coingecko.com/coins/images/26455/large/Aptos-Network-Symbol-Black-RGB-1x.png?1761789140',
  CAKE: 'https://coin-images.coingecko.com/coins/images/12632/large/pancakeswap-cake-logo_%281%29.png?1696512440',
  AERO: 'https://coin-images.coingecko.com/coins/images/31745/large/token.png?1696530564',
  PENGU: 'https://coin-images.coingecko.com/coins/images/52622/large/PUDGY_PENGUINS_PENGU_PFP.png?1733809110',
  VET: 'https://coin-images.coingecko.com/coins/images/1167/large/VET.png?1742383283',
  TIA: 'https://coin-images.coingecko.com/coins/images/31967/large/tia.jpg?1696530772',
}

export const ATR_THRESHOLD = 0.35

export const DATA: Record<Timeframe, AssetRow[]> = {
  '1h': [
    { name: 'Hyperliquid', ticker: 'HYPE', tier: 1, price: 41.86, basis: 41.2, upper: 43.55, lower: 38.85, signal: 'bull', osc: 61.4, oscConfirm: true, atr: 0.71, updated: '08:14:02' },
    { name: 'Ondo', ticker: 'ONDO', tier: 1, price: 0.9142, basis: 0.931, upper: 0.978, lower: 0.884, signal: 'none', osc: 47.2, oscConfirm: false, atr: 0.42, updated: '08:14:05' },
    { name: 'Lido DAO', ticker: 'LDO', tier: 1, price: 1.284, basis: 1.301, upper: 1.362, lower: 1.24, signal: 'bear', osc: 58.9, oscConfirm: true, atr: 0.55, updated: '08:14:03' },
    { name: 'Solana', ticker: 'SOL', tier: 2, price: 187.4, basis: 190.1, upper: 199.6, lower: 180.6, signal: 'bull', osc: 33.1, oscConfirm: false, atr: 0.38, updated: '08:14:01' },
    { name: 'Chainlink', ticker: 'LINK', tier: 2, price: 16.92, basis: 17.34, upper: 18.12, lower: 16.56, signal: 'bear', osc: 41.0, oscConfirm: true, atr: 0.29, updated: '08:14:07' },
    { name: 'Bitcoin', ticker: 'BTC', tier: 2, price: 117420, basis: 118650, upper: 121300, lower: 116000, signal: 'none', osc: 52.6, oscConfirm: false, atr: 0.24, updated: '08:13:58' },
    { name: 'Ethereum', ticker: 'ETH', tier: 2, price: 4128, basis: 4185, upper: 4340, lower: 4030, signal: 'bull', osc: 44.8, oscConfirm: true, atr: 0.46, updated: '08:14:04' },
    { name: 'Uniswap', ticker: 'UNI', tier: 2, price: 12.05, basis: 12.31, upper: 12.98, lower: 11.64, signal: 'none', osc: 39.5, oscConfirm: false, atr: 0.31, updated: '08:14:06' },
    { name: 'XRP', ticker: 'XRP', tier: 1, price: 1.09, basis: 1.095, upper: 1.135, lower: 1.055, signal: 'bull', osc: 49.5, oscConfirm: true, atr: 0.39, updated: '08:14:11' },
    { name: 'BNB', ticker: 'BNB', tier: 1, price: 573.12, basis: 578.4, upper: 596.2, lower: 560.3, signal: 'none', osc: 44.0, oscConfirm: false, atr: 0.33, updated: '08:14:12' },
    { name: 'Cardano', ticker: 'ADA', tier: 3, price: 0.16, basis: 0.162, upper: 0.168, lower: 0.156, signal: 'bear', osc: 57.2, oscConfirm: true, atr: 0.45, updated: '08:14:13' },
    { name: 'Sei', ticker: 'SEI', tier: 2, price: 0.3122, basis: 0.318, upper: 0.334, lower: 0.302, signal: 'bear', osc: 55.3, oscConfirm: true, atr: 0.33, updated: '08:14:09' },
    { name: 'Stellar', ticker: 'XLM', tier: 2, price: 0.4381, basis: 0.446, upper: 0.467, lower: 0.425, signal: 'bear', osc: 60.7, oscConfirm: true, atr: 0.61, updated: '08:14:08' },
    { name: 'Dogecoin', ticker: 'DOGE', tier: 2, price: 0.2214, basis: 0.2255, upper: 0.237, lower: 0.214, signal: 'bear', osc: 52.0, oscConfirm: false, atr: 0.27, updated: '08:14:10' },
    { name: 'Tron', ticker: 'TRX', tier: 2, price: 0.326680, basis: 0.329947, upper: 0.336876, lower: 0.323018, signal: 'bull', osc: 46.0, oscConfirm: false, atr: 0.23, updated: '08:14:10' },
    { name: 'Avalanche', ticker: 'AVAX', tier: 2, price: 6.5830, basis: 6.5435, upper: 6.8052, lower: 6.2818, signal: 'bear', osc: 60.0, oscConfirm: false, atr: 0.2, updated: '08:14:11' },
    { name: 'Bittensor', ticker: 'TAO', tier: 1, price: 194.96, basis: 193.79, upper: 201.74, lower: 185.84, signal: 'bear', osc: 53.0, oscConfirm: false, atr: 0.52, updated: '08:14:13' },
    { name: 'Polkadot', ticker: 'DOT', tier: 1, price: 0.827000, basis: 0.822038, upper: 0.856564, lower: 0.787512, signal: 'bear', osc: 65.0, oscConfirm: true, atr: 0.2, updated: '08:14:14' },
    { name: 'Aave', ticker: 'AAVE', tier: 3, price: 89.7100, basis: 90.0688, upper: 92.5908, lower: 87.5469, signal: 'bull', osc: 71.0, oscConfirm: true, atr: 0.72, updated: '08:14:15' },
    { name: 'Pepe', ticker: 'PEPE', tier: 2, price: 0.002918, basis: 0.002898, upper: 0.003014, lower: 0.002782, signal: 'none', osc: 59.0, oscConfirm: true, atr: 0.55, updated: '08:14:16' },
    { name: 'Ethereum Classic', ticker: 'ETC', tier: 3, price: 6.9060, basis: 6.9474, upper: 7.1836, lower: 6.7112, signal: 'bear', osc: 54.0, oscConfirm: true, atr: 0.26, updated: '08:14:17' },
    { name: 'Polygon', ticker: 'POL', tier: 3, price: 0.080400, basis: 0.080561, upper: 0.083542, lower: 0.077580, signal: 'none', osc: 53.0, oscConfirm: false, atr: 0.47, updated: '08:14:18' },
    { name: 'Ethena', ticker: 'ENA', tier: 1, price: 0.083190, basis: 0.083939, upper: 0.086541, lower: 0.081337, signal: 'bear', osc: 30.0, oscConfirm: true, atr: 0.47, updated: '08:14:19' },
    { name: 'Render', ticker: 'RENDER', tier: 2, price: 1.5180, basis: 1.5180, upper: 1.5590, lower: 1.4770, signal: 'bear', osc: 49.0, oscConfirm: true, atr: 0.24, updated: '08:14:20' },
    { name: 'Kaspa', ticker: 'KAS', tier: 1, price: 0.028340, basis: 0.028057, upper: 0.028842, lower: 0.027271, signal: 'none', osc: 33.0, oscConfirm: true, atr: 0.12, updated: '08:14:21' },
    { name: 'Cosmos', ticker: 'ATOM', tier: 3, price: 1.4950, basis: 1.4920, upper: 1.5338, lower: 1.4502, signal: 'bull', osc: 69.0, oscConfirm: true, atr: 0.59, updated: '08:14:22' },
    { name: 'Algorand', ticker: 'ALGO', tier: 2, price: 0.083200, basis: 0.083866, upper: 0.085459, lower: 0.082272, signal: 'none', osc: 36.0, oscConfirm: false, atr: 0.45, updated: '08:14:23' },
    { name: 'Jupiter', ticker: 'JUP', tier: 1, price: 0.195900, basis: 0.196096, upper: 0.204136, lower: 0.188056, signal: 'bull', osc: 58.0, oscConfirm: false, atr: 0.44, updated: '08:14:24' },
    { name: 'Arbitrum', ticker: 'ARB', tier: 2, price: 0.090250, basis: 0.089618, upper: 0.093113, lower: 0.086123, signal: 'none', osc: 34.0, oscConfirm: true, atr: 0.29, updated: '08:14:25' },
    { name: 'Aptos', ticker: 'APT', tier: 3, price: 0.604100, basis: 0.601079, upper: 0.622117, lower: 0.580042, signal: 'bull', osc: 36.0, oscConfirm: false, atr: 0.66, updated: '08:14:26' },
    { name: 'PancakeSwap', ticker: 'CAKE', tier: 3, price: 1.3962, basis: 1.4060, upper: 1.4453, lower: 1.3666, signal: 'bull', osc: 74.0, oscConfirm: true, atr: 0.36, updated: '08:14:27' },
    { name: 'Aerodrome', ticker: 'AERO', tier: 3, price: 0.430900, basis: 0.433485, upper: 0.441288, lower: 0.425683, signal: 'bear', osc: 74.0, oscConfirm: true, atr: 0.73, updated: '08:14:29' },
    { name: 'Pudgy Penguins', ticker: 'PENGU', tier: 1, price: 0.006351, basis: 0.006376, upper: 0.006606, lower: 0.006147, signal: 'bull', osc: 58.0, oscConfirm: false, atr: 0.13, updated: '08:14:30' },
    { name: 'VeChain', ticker: 'VET', tier: 3, price: 0.004717, basis: 0.004675, upper: 0.004782, lower: 0.004567, signal: 'bear', osc: 59.0, oscConfirm: false, atr: 0.76, updated: '08:14:32' },
    { name: 'Celestia', ticker: 'TIA', tier: 1, price: 0.357000, basis: 0.357357, upper: 0.364147, lower: 0.350567, signal: 'bull', osc: 57.0, oscConfirm: false, atr: 0.13, updated: '08:14:33' },
  ],
  '15m': [
    { name: 'Hyperliquid', ticker: 'HYPE', tier: 1, price: 41.9, basis: 41.78, upper: 42.3, lower: 41.26, signal: 'none', osc: 49.0, oscConfirm: false, atr: 0.18, updated: '08:14:32' },
    { name: 'Ondo', ticker: 'ONDO', tier: 1, price: 0.9138, basis: 0.9155, upper: 0.926, lower: 0.905, signal: 'bull', osc: 34.2, oscConfirm: true, atr: 0.21, updated: '08:14:31' },
    { name: 'Solana', ticker: 'SOL', tier: 2, price: 187.6, basis: 188.4, upper: 191.2, lower: 185.6, signal: 'bull', osc: 29.4, oscConfirm: true, atr: 0.34, updated: '08:14:30' },
    { name: 'Ethereum', ticker: 'ETH', tier: 2, price: 4131, basis: 4139, upper: 4188, lower: 4090, signal: 'bull', osc: 38.6, oscConfirm: true, atr: 0.29, updated: '08:14:34' },
    { name: 'Cardano', ticker: 'ADA', tier: 3, price: 0.1598, basis: 0.1601, upper: 0.1615, lower: 0.1587, signal: 'none', osc: 48.5, oscConfirm: false, atr: 0.09, updated: '08:14:43' },
    { name: 'Dogecoin', ticker: 'DOGE', tier: 2, price: 0.2211, basis: 0.2218, upper: 0.2248, lower: 0.2188, signal: 'none', osc: 48.3, oscConfirm: false, atr: 0.09, updated: '08:14:39' },
    { name: 'Aave', ticker: 'AAVE', tier: 3, price: 89.7100, basis: 89.7997, upper: 91.4161, lower: 88.1833, signal: 'bull', osc: 65.0, oscConfirm: true, atr: 0.52, updated: '08:44:10' },
    { name: 'Aerodrome', ticker: 'AERO', tier: 3, price: 0.431400, basis: 0.431831, upper: 0.448673, lower: 0.414990, signal: 'bull', osc: 68.0, oscConfirm: false, atr: 0.47, updated: '08:44:11' },
    { name: 'Polkadot', ticker: 'DOT', tier: 1, price: 0.827000, basis: 0.823692, upper: 0.849226, lower: 0.798158, signal: 'none', osc: 64.0, oscConfirm: true, atr: 0.21, updated: '08:44:13' },
    { name: 'Aptos', ticker: 'APT', tier: 3, price: 0.604400, basis: 0.603796, upper: 0.624928, lower: 0.582663, signal: 'none', osc: 70.0, oscConfirm: true, atr: 0.55, updated: '08:44:14' },
    { name: 'Kaspa', ticker: 'KAS', tier: 1, price: 0.028360, basis: 0.028076, upper: 0.028750, lower: 0.027403, signal: 'none', osc: 66.0, oscConfirm: false, atr: 0.3, updated: '08:44:15' },
    { name: 'Ethereum Classic', ticker: 'ETC', tier: 3, price: 6.9080, basis: 6.8735, upper: 7.0041, lower: 6.7429, signal: 'bull', osc: 64.0, oscConfirm: false, atr: 0.18, updated: '08:44:16' },
  ],
}

// v2 (2026-07): mecanica de salida con proteccion a mitad de banda (SMA20). Si el precio, ANTES de
// tocar el primer TP (+1%), llega a favor hasta la media y despues se devuelve cruzandola en contra,
// la posicion se cierra ahi en vez de correr hasta el SL original. Una vez tocado el TP1, sigue la
// mecanica de siempre (TP2 en +2% o banda opuesta). Reemplaza a v1 (solo TP fijo + SL banda opuesta,
// archivado en signal-desk/data/archive_v1_baseline) porque mejora el win rate en los 39 activos
// backtesteados, en ambos timeframes, sin excepcion.
export const ASSET_DETAIL: Record<string, AssetDetail> = {
  HYPE_1h: {
    instructions: [
      'Banda de oscMain: normal (25-70).',
      'Filtro de volatilidad: ATR(14)/precio ≥ 1.0%.',
      'En 15m: WR 75.0% (n=20) — operable pero con muestra chica, tratar como confirmación.',
    ],
    pros: [
      'Win rate más alto de Nivel 1 (83.3%) con drawdown muy bajo (1.7%) y racha de pérdidas corta (3).',
      'El short es excepcional (WR 94.4%, n=18) — priorizarlo cuando aparezca.',
    ],
    cons: [
      'El filtro ATR≥1.0% deja pocas señales por mes (78 en 18.6 meses).',
      'En 15m el short es débil (WR 42.9%) — en esa temporalidad, priorizar el long.',
    ],
    stats: { wr: 83.3, n: 78, sumaPct: 65.8 },
  },
  ONDO_1h: {
    instructions: [
      'Banda de oscMain: extra ancha (15-85).',
      'Filtro de volatilidad: ATR(14)/precio ≥ 1.0%.',
      'En 15m: WR 71.0% (n=100) — funciona bien y con muestra grande.',
    ],
    pros: [
      'Segundo mejor retorno total de Nivel 1 (+100.4%) con muestra grande (136 trades).',
      'El short es el lado más fuerte (WR 82.2%) pero el long también rinde (WR 76.9%) — ambos lados operables.',
    ],
    cons: [
      'Drawdown moderado (3.6%) — sin ser alto, es de los más marcados del grupo.',
      'En 15m el long es más débil (WR 67.7%) que el short (WR 76.3%).',
    ],
    stats: { wr: 78.7, n: 136, sumaPct: 100.4 },
  },
  LDO_1h: {
    instructions: [
      'Banda de oscMain: ancha (20-80).',
      'Filtro de volatilidad: ATR(14)/precio ≥ 1.0%.',
      'En 15m: WR 60.7% (n=84) — funciona, aunque más ajustado que en 1h.',
    ],
    pros: [
      'El mejor retorno total de todo el backtest en 1h (+122.8%) sobre la muestra más grande de Nivel 1 (159 trades).',
      'Long (WR 81.5%) y short (WR 76.5%) ambos sólidos — no depende de un solo lado.',
    ],
    cons: [
      'Drawdown el más alto de Nivel 1 (5.9%) — dimensionar posición acorde.',
      'En 15m el margen es más ajustado (WR 60.7%, justo arriba del piso de 60%).',
    ],
    stats: { wr: 79.9, n: 159, sumaPct: 122.8 },
  },
  SOL_1h: {
    instructions: [
      'Banda de oscMain: angosta (30-70) — cambia respecto a la ancha documentada antes; bajo el motor v2 rinde mejor.',
      '%B: short más exigente (≥0.7).',
      'Sin filtro de volatilidad adicional. En 15m: WR 76.9% (n=78) — de los pocos activos donde 15m rinde igual o mejor que 1h.',
    ],
    pros: [
      'Win rate sensibilizado sólido (75.6%) con drawdown muy bajo (4.0%).',
      '15m es una opción real acá (WR 76.9%, n=78, drawdown 0.8%) — no es solo un complemento menor.',
    ],
    cons: [
      'El retorno total (+55.4%) es el más bajo de Nivel 1.',
      'El short tiene menos muestra que el long (25 vs 94 trades) — el edge del short es real pero con menos casos.',
    ],
    stats: { wr: 75.6, n: 119, sumaPct: 55.4 },
  },
  UNI_1h: {
    instructions: [
      'Banda de oscMain: normal (25-70).',
      'Filtro de volatilidad: ATR(14)/precio ≥ 1.0%.',
      'En 15m: WR 61.1% (n=54) — funciona pero al límite.',
    ],
    pros: [
      'Win rate sensibilizado sube a 76.7% con buen retorno total (+72.5%).',
      'El long sigue siendo el lado más fuerte (WR 79.0%) pero el short ya no es ruido (WR 71.8%).',
    ],
    cons: [
      'Drawdown el más alto del grupo Nivel 2 (9.2%).',
      'En 15m el margen es ajustado — no es de los activos más fuertes en esa temporalidad.',
    ],
    stats: { wr: 76.7, n: 120, sumaPct: 72.5 },
  },
  BTC_1h: {
    instructions: [
      'Banda de oscMain: ancha (20-80).',
      'Filtro de volatilidad: ATR(14)/precio ≥ 0.7%.',
      'En 15m: WR 64.4% (n=45) — con protección de media, 15m deja de ser "evitar por completo" (antes 26.9%).',
    ],
    pros: [
      'Con protección de media el win rate salta de 66.7% (v1) a 76.3%, con drawdown bajo (1.9%) y racha corta (2).',
      '15m se vuelve operable por primera vez en todo el backtest — cambio importante frente a v1.',
    ],
    cons: [
      'El short es débil (WR 44.4%, n=9) — priorizar el long (WR 86.2%).',
      'Sigue siendo el activo con menos señales por mes de Nivel 2 (38 trades en 18.4 meses).',
    ],
    stats: { wr: 76.3, n: 38, sumaPct: 16.6 },
  },
  LINK_1h: {
    instructions: [
      'Banda de oscMain: extra ancha (15-85).',
      'Filtro de volatilidad: ATR(14)/precio ≥ 1.0%.',
      'En 15m: WR 68.8% (n=112) — funciona bien con muestra grande.',
    ],
    pros: [
      'Win rate sensibilizado (76.4%) sobre muestra sólida (106 trades), con drawdown bajo (4.9%).',
      'Long y short balanceados (WR 75.0% / 80.0%).',
    ],
    cons: [
      'El retorno promedio por trade sigue siendo de los más finos de Nivel 2.',
      'Requiere el filtro de ATR más exigente (1.0%) para rendir bien.',
    ],
    stats: { wr: 76.4, n: 106, sumaPct: 64.0 },
  },
  XRP_1h: {
    instructions: [
      'Banda de oscMain: extra ancha (15-85).',
      'Filtro de volatilidad: ATR(14)/precio ≥ 1.0%.',
      'En 15m: WR 64.6% (n=48) — funciona, mejora fuerte frente a v1 (antes 33.0%).',
    ],
    pros: [
      'Win rate sensibilizado sube a 79.1% con drawdown muy bajo (1.3%) y racha corta (2).',
      'El long es muy fuerte (WR 83.3%) — mejor lado del activo con clara ventaja.',
    ],
    cons: [
      'Muestra más chica que el resto de Nivel 2 (43 trades en 18.5 meses).',
      'El short tiene poca muestra (n=7) — no hay tanta confianza estadística ahí todavía.',
    ],
    stats: { wr: 79.1, n: 43, sumaPct: 22.1 },
  },
  ETH_1h: {
    instructions: [
      'Banda de oscMain: extra ancha (15-85).',
      'Sin filtro de volatilidad adicional — el genérico ya alcanza.',
      'En 15m: WR 71.4% (n=105) — gran mejora frente a v1 (antes 38.3%), ahora operable con muestra grande.',
    ],
    pros: [
      'Con protección de media, el win rate salta de 52.9% (v1) a 77.5% — de las mejoras más grandes de todo el backtest.',
      'Muestra enorme incluso tuneado (204 trades en 1h, 105 en 15m) — resultado muy robusto.',
    ],
    cons: [
      'El short es más débil (WR 67.4%) que el long (WR 80.1%) — priorizar el long.',
      'El retorno promedio por trade sigue siendo modesto en términos absolutos.',
    ],
    stats: { wr: 77.5, n: 204, sumaPct: 61.7 },
  },
  BNB_1h: {
    instructions: [
      'Banda de oscMain: extra ancha (15-85).',
      'Filtro de volatilidad: ATR(14)/precio ≥ 0.7%.',
      'En 15m: WR 61.5% (n=104) — mejora fuerte frente a v1 (antes 25.7%, expectancy negativa).',
    ],
    pros: [
      'El win rate más alto de Nivel 2 (85.7%), con drawdown mínimo (0.9%) y racha de solo 2.',
      'Long (WR 88.0%) y short (WR 82.4%) ambos excelentes.',
    ],
    cons: [
      'Muestra chica en 1h (42 trades en 18.5 meses) — pocas oportunidades.',
      'En 15m el margen es más ajustado que en 1h.',
    ],
    stats: { wr: 85.7, n: 42, sumaPct: 23.2 },
  },
  ADA_1h: {
    instructions: [
      'Banda de oscMain: extra ancha (15-85).',
      'Filtro de volatilidad: ATR(14)/precio ≥ 1.0%.',
      'En 15m: WR 70.5% (n=88) — operable, buena muestra.',
    ],
    pros: [
      'Win rate sensibilizado sube a 71.8%, con el long como lado dominante (WR 78.2%).',
      '15m funciona bien también (WR 70.5%) — de los pocos activos consistentes en ambos timeframes.',
    ],
    cons: [
      'El short es más débil (WR 56.5%) — priorizar el long si hay que elegir.',
      'Drawdown moderado (6.5%) frente al resto de Nivel 2.',
    ],
    stats: { wr: 71.8, n: 78, sumaPct: 34.5 },
  },
  XLM_1h: {
    instructions: [
      'Banda de oscMain: extra ancha (15-85).',
      'Filtro de volatilidad: ATR(14)/precio ≥ 1.0%.',
      'En 15m: WR 62.1% (n=29) — funciona, muestra chica.',
    ],
    pros: [
      'Long (WR 76.1%) y short (WR 76.2%) prácticamente idénticos — el más balanceado del grupo.',
      'Drawdown bajo (4.8%) y racha de pérdidas corta (3).',
    ],
    cons: [
      'Sigue con menos retorno total que otros de su nivel de win rate.',
      'En 15m la muestra es chica (n=29) — tratar con algo de cautela.',
    ],
    stats: { wr: 76.1, n: 88, sumaPct: 52.6 },
  },
  SEI_1h: {
    instructions: [
      'Banda de oscMain: ancha (20-80).',
      '%B: short más exigente (≥0.75).',
      'Sin filtro de volatilidad adicional. En 15m: WR 67.2% (n=128) — buena muestra, operable.',
    ],
    pros: [
      'Retorno total muy fuerte (+88.6%) sobre muestra grande (135 trades), con drawdown bajo (3.2%).',
      'Long (WR 78.1%) y short (WR 76.7%) parejos.',
    ],
    cons: [
      'En 15m el short es más débil (WR 56.8%) que el long (WR 72.6%).',
      'Sigue exigiendo el corte de %B específico en el short (≥0.75).',
    ],
    stats: { wr: 77.8, n: 135, sumaPct: 88.6 },
  },
  DOGE_1h: {
    instructions: [
      'Banda de oscMain: extra ancha (15-85).',
      'Filtro de volatilidad: ATR(14)/precio ≥ 1.0%.',
      'En 15m: WR 70.8% (n=72) — buena mejora frente a v1 (antes 26.4%, sin edge).',
    ],
    pros: [
      'El long sigue siendo el lado dominante (WR 81.5%, total +56.8%).',
      'Drawdown muy bajo (4.0%) y racha de pérdidas corta (3) para el retorno que entrega.',
    ],
    cons: [
      'El short es más débil en 1h (WR 57.1%) — priorizar el long.',
      'Sigue siendo de los activos con expectancy más fina en términos absolutos.',
    ],
    stats: { wr: 76.5, n: 102, sumaPct: 63.4 },
  },

  // --- Activos nuevos (backtesteados 2026-07, agregados a la ficha con el motor v2) ---
  JUP_1h: {
    instructions: [
      'Banda de oscMain: ancha (20-80).',
      'Filtro de volatilidad: ATR(14)/precio ≥ 1.0%.',
      'En 15m: WR 68.6% (n=140) — muy buena muestra, operable.',
    ],
    pros: [
      'Segundo mejor win rate de todo el backtest (84.5%) con retorno total sobresaliente (+103.7%).',
      'Long (WR 83.8%) y short (WR 86.1%) ambos excelentes, con muestra grande en ambos timeframes.',
    ],
    cons: [
      'Drawdown moderado (6.6%) — el más alto entre los mejores win rate del backtest.',
      'Token relativamente nuevo — menos historia acumulada que activos más establecidos.',
    ],
    stats: { wr: 84.5, n: 116, sumaPct: 103.7 },
  },
  KAS_1h: {
    instructions: [
      'Banda de oscMain: extra ancha (15-85).',
      'Filtro de volatilidad: ATR(14)/precio ≥ 0.7%.',
      'En 15m: WR 70.2% (n=171) — la muestra más grande de 15m de todo el backtest, muy confiable.',
    ],
    pros: [
      'Retorno total altísimo (+104.4%) con muestra grande (131 trades) y win rate top 3 (84.0%).',
      'Short excepcional (WR 87.2%) y 15m con la muestra más sólida de todo el lote (171 trades).',
    ],
    cons: [
      'Drawdown moderado (4.3%).',
      'Depende de un filtro de ATR relativamente estricto (0.7%) para rendir así de bien.',
    ],
    stats: { wr: 84.0, n: 131, sumaPct: 104.4 },
  },
  TIA_1h: {
    instructions: [
      'Banda de oscMain: angosta (30-70).',
      '%B: short más exigente (≥0.7).',
      'Sin filtro de volatilidad adicional. En 15m: WR 64.6% (n=79) — operable.',
    ],
    pros: [
      'Retorno total muy alto (+85.9%) con win rate top 5 (80.2%) y drawdown bajo (3.1%).',
      'Long (WR 83.1%) particularmente fuerte.',
    ],
    cons: [
      'El short exige el corte de %B más estricto (≥0.7) para rendir bien.',
      'Token relativamente nuevo — historia más corta que activos establecidos.',
    ],
    stats: { wr: 80.2, n: 96, sumaPct: 85.9 },
  },
  TAO_1h: {
    instructions: [
      'Banda de oscMain: angosta (30-70).',
      'Filtro de volatilidad: ATR(14)/precio ≥ 1.0%.',
      'En 15m: WR 68.7% (n=83) — operable, buena muestra.',
    ],
    pros: [
      'Win rate alto (80.0%) con el mejor balance long/short del lote nuevo (WR 81.0% / 78.9%, casi idénticos).',
      'Drawdown muy bajo (2.4%) y racha de pérdidas corta (2).',
    ],
    cons: [
      'Precio alto y volátil (activo de IA/infraestructura) — requiere sizing cuidadoso.',
      'Retorno total (+66.2%) bueno pero no de los más altos del lote.',
    ],
    stats: { wr: 80.0, n: 80, sumaPct: 66.2 },
  },
  DOT_1h: {
    instructions: [
      'Banda de oscMain: extra ancha (15-85).',
      'Filtro de volatilidad: ATR(14)/precio ≥ 1.0%.',
      'En 15m: WR 73.3% (n=30) — buen resultado, justo al piso de muestra mínima.',
    ],
    pros: [
      'Win rate alto (79.0%) con drawdown bajo (5.1%) y racha corta (3).',
      'El short es muy fuerte (WR 81.2%) aunque con menos señales que el long.',
    ],
    cons: [
      'En 15m la muestra es chica (n=30) — tratar con cautela hasta acumular más historia.',
      'El short tiene poca muestra en 1h también (n=16).',
    ],
    stats: { wr: 79.0, n: 81, sumaPct: 52.2 },
  },
  AAVE_1h: {
    instructions: [
      'Banda de oscMain: extra ancha (15-85).',
      'Filtro de volatilidad: ATR(14)/precio ≥ 1.0%.',
      'En 15m: WR 78.6% (n=56) — de los mejores resultados de 15m de todo el backtest.',
    ],
    pros: [
      'Muestra grande (143 trades) con buen win rate (73.4%) y retorno total sólido (+93.3%).',
      '15m rinde casi igual que 1h (WR 78.6%) — de los pocos activos donde no hace falta elegir timeframe.',
    ],
    cons: [
      'Drawdown moderado (4.5%).',
      'El retorno promedio por trade es más fino que en otros activos con win rate similar.',
    ],
    stats: { wr: 73.4, n: 143, sumaPct: 93.3 },
  },
  PEPE_1h: {
    instructions: [
      'Banda de oscMain: extra ancha (15-85).',
      'Sin filtro de volatilidad adicional en 1h.',
      'Evitar 15m: expectancy negativa (WR 52.8%, total -1.2%) — el edge de este activo está solo en 1h.',
    ],
    pros: [
      'Win rate alto en 1h (78.0%) con retorno total fuerte (+93.6%) y muestra grande (159 trades).',
      'El short es excelente (WR 84.8%, prom +1.03%/trade) — de los mejores promedios por trade del backtest.',
    ],
    cons: [
      'En 15m no hay edge — no operar esta temporalidad en PEPE, incluso con protección de media.',
      'Precio muy chico (fracciones de centavo) — verificar que el bróker/exchange maneje bien la precisión al operar.',
    ],
    stats: { wr: 78.0, n: 159, sumaPct: 93.6 },
  },
  RENDER_1h: {
    instructions: [
      'Banda de oscMain: extra ancha (15-85).',
      'Filtro de volatilidad: ATR(14)/precio ≥ 1.0%.',
      'En 15m: WR 62.2% (n=37) — funciona, muestra moderada.',
    ],
    pros: [
      'Retorno total muy alto (+108.9%) con muestra grande (161 trades) y win rate sólido (77.6%).',
      'El short es excelente (WR 85.7%, prom +0.95%/trade).',
    ],
    cons: [
      'Drawdown moderado (6.1%) frente al resto del grupo.',
      'En 15m el long queda parejo con la moneda (WR 50.0%, prácticamente sin edge) — priorizar el short en esa temporalidad.',
    ],
    stats: { wr: 77.6, n: 161, sumaPct: 108.9 },
  },
  ETC_1h: {
    instructions: [
      'Banda de oscMain: ancha (20-80).',
      '%B: short más exigente (≥0.75).',
      'Sin filtro de volatilidad adicional. En 15m: WR 70.9% (n=110) — buena muestra, operable.',
    ],
    pros: [
      'Muestra muy grande (184 trades) con win rate sólido (73.4%) y buen retorno (+52.7%).',
      'Consistente entre timeframes: WR similar en 1h y 15m (73.4% / 70.9%).',
    ],
    cons: [
      'Drawdown el más alto del lote nuevo con este nivel de win rate (10.9%).',
      'El retorno promedio por trade es más fino que otros activos con muestra similar.',
    ],
    stats: { wr: 73.4, n: 184, sumaPct: 52.7 },
  },
  POL_1h: {
    instructions: [
      'Banda de oscMain: extra ancha (15-85).',
      'Filtro de volatilidad: ATR(14)/precio ≥ 0.7%.',
      'En 15m: WR 65.9% (n=88) — operable.',
    ],
    pros: [
      'Muestra grande (151 trades) con buen retorno total (+56.7%).',
      'Long (WR 69.5%) y short (WR 71.7%) parejos.',
    ],
    cons: [
      'Drawdown el más alto de todo el backtest en su categoría (11.6%) — dimensionar posición con cuidado.',
      'Win rate más bajo que la mayoría del lote nuevo (70.2%).',
    ],
    stats: { wr: 70.2, n: 151, sumaPct: 56.7 },
  },
  ENA_1h: {
    instructions: [
      'Banda de oscMain: angosta (30-70).',
      '%B: short más exigente (≥0.75).',
      'Sin filtro de volatilidad adicional. En 15m: WR 65.6% (n=122) — buena muestra, operable.',
    ],
    pros: [
      'Retorno total muy alto (+86.2%) con win rate fuerte (78.1%) y drawdown bajo (3.8%).',
      'Long (WR 78.8%) y short (WR 76.7%) ambos sólidos.',
    ],
    cons: [
      'En 15m el long es más débil (WR 60.2%) que el short (WR 79.4%) — priorizar el short en esa temporalidad.',
      'Token relativamente nuevo — menos historia que activos establecidos.',
    ],
    stats: { wr: 78.1, n: 96, sumaPct: 86.2 },
  },
  ALGO_1h: {
    instructions: [
      'Banda de oscMain: angosta (30-70).',
      'Filtro de volatilidad: ATR(14)/precio ≥ 0.7%.',
      'En 15m: WR 61.0% (n=159) — funciona, muestra enorme.',
    ],
    pros: [
      'Retorno total muy alto (+84.8%) con win rate fuerte (77.5%).',
      'El short es excelente (WR 84.8%, prom +1.15%/trade) — de los mejores promedios del backtest.',
    ],
    cons: [
      'Drawdown moderado (4.9%) en 1h, más alto en 15m (10.8%).',
      'En 15m el margen es más ajustado (WR 61.0%, justo arriba del piso).',
    ],
    stats: { wr: 77.5, n: 111, sumaPct: 84.8 },
  },
  ARB_1h: {
    instructions: [
      'Banda de oscMain: angosta (30-70).',
      'Filtro de volatilidad: ATR(14)/precio ≥ 1.0%.',
      'Evitar 15m: WR 58.7% (n=138), justo debajo del piso de 60% — no prioritario en esa temporalidad.',
    ],
    pros: [
      'Win rate alto en 1h (77.5%) con drawdown bajo (5.3%) y racha corta (2).',
      'El long es fuerte (WR 79.5%) con buena muestra (73 trades).',
    ],
    cons: [
      'En 15m no llega al umbral de 60% (58.7%) — usar 1h como referencia principal.',
      'El short tiene menos muestra que el long en 1h (29 vs 73 trades).',
    ],
    stats: { wr: 77.5, n: 102, sumaPct: 55.3 },
  },
  FIL_1h: {
    instructions: [
      'Banda de oscMain: extra ancha (15-85).',
      'Filtro de volatilidad: ATR(14)/precio ≥ 1.0%.',
      'En 15m: WR 68.8% (n=80) — operable, buena muestra.',
    ],
    pros: [
      'Muestra grande (114 trades) con buen retorno total (+58.3%).',
      'El short es fuerte (WR 75.9%) con buen promedio por trade (+0.78%).',
    ],
    cons: [
      'Drawdown moderado (8.7%) — de los más altos del lote nuevo.',
      'Win rate más bajo que la mayoría de sus pares (69.3%).',
    ],
    stats: { wr: 69.3, n: 114, sumaPct: 58.3 },
  },
  APT_1h: {
    instructions: [
      'Banda de oscMain: ancha (20-80).',
      'Filtro de volatilidad: ATR(14)/precio ≥ 1.0% (0.7% en 15m).',
      'En 15m: WR 73.3% (n=30) — de los mejores resultados de 15m del backtest, aunque justo al piso de muestra.',
    ],
    pros: [
      'Buen retorno total (+63.5%) con win rate sólido (73.6%).',
      'El short es fuerte (WR 79.5%) y 15m rinde muy bien también (WR 73.3%).',
    ],
    cons: [
      'En 15m la muestra es chica (n=30) — tratar con cautela.',
      'El long es más débil (WR 70.4%) que el short en 1h.',
    ],
    stats: { wr: 73.6, n: 110, sumaPct: 63.5 },
  },
  CAKE_1h: {
    instructions: [
      'Banda de oscMain: angosta (30-70).',
      'Filtro de volatilidad: ATR(14)/precio ≥ 1.0%.',
      'En 15m: WR 60.2% (n=88) — funciona, justo arriba del piso.',
    ],
    pros: [
      'Win rate sólido (71.7%) con drawdown bajo (3.3%) y racha corta (2).',
      'El long es fuerte (WR 77.8%).',
    ],
    cons: [
      'El retorno total (+33.5%) es de los más bajos del lote nuevo.',
      'El short es más débil (WR 58.8%) — priorizar el long.',
    ],
    stats: { wr: 71.7, n: 53, sumaPct: 33.5 },
  },
  AERO_1h: {
    instructions: [
      'Banda de oscMain: extra ancha (15-85).',
      'Filtro de volatilidad: ATR(14)/precio ≥ 1.0%.',
      'En 15m: WR 75.2% (n=101) — uno de los mejores resultados de 15m de todo el backtest.',
    ],
    pros: [
      'Retorno total muy alto (+92.4%) con muestra grande (147 trades) y buen balance long/short (WR 73.6% / 71.7%).',
      '15m es una opción real y sólida acá (WR 75.2%, n=101) — no es solo un complemento.',
    ],
    cons: [
      'Token relativamente nuevo (15.5 meses de historia en 1h, menos que la mayoría).',
      'Drawdown moderado (7.9%) — el más alto entre los que rinden bien en ambos timeframes.',
    ],
    stats: { wr: 72.8, n: 147, sumaPct: 92.4 },
  },
  PENGU_1h: {
    instructions: [
      'Banda de oscMain: ancha (20-80).',
      'Sin filtro de volatilidad adicional.',
      'En 15m: WR 69.8% (n=43) — operable.',
    ],
    pros: [
      'El mejor retorno total de todo el backtest (+139.6%) con la muestra más grande (183 trades) y win rate alto (78.7%).',
      'Long (WR 78.6%) y short (WR 78.8%) prácticamente idénticos — muy consistente.',
    ],
    cons: [
      'Drawdown moderado (6.8%).',
      'Precio muy chico (fracciones de centavo) — verificar precisión del bróker/exchange al operar.',
    ],
    stats: { wr: 78.7, n: 183, sumaPct: 139.6 },
  },
  VET_1h: {
    instructions: [
      'Banda de oscMain: ancha (20-80).',
      'Filtro de volatilidad: ATR(14)/precio ≥ 1.0%.',
      'Evitar 15m: WR 53.7% (n=95), no llega al piso de 60% — el edge de este activo está solo en 1h.',
    ],
    pros: [
      'Buen win rate en 1h (72.4%) con drawdown bajo (2.9%).',
      'El short es muy fuerte (WR 84.0%, prom +1.24%/trade) — de los mejores promedios del backtest.',
    ],
    cons: [
      'En 15m no hay edge real (WR 53.7%, casi coinflip) — no operar esa temporalidad.',
      'El long es bastante más débil que el short (WR 67.7% vs 84.0%).',
    ],
    stats: { wr: 72.4, n: 87, sumaPct: 61.7 },
  },
  ATOM_1h: {
    instructions: [
      'Banda de oscMain: ancha (20-80).',
      'Filtro de volatilidad: ATR(14)/precio ≥ 1.0%.',
      'En 15m: WR 63.6% (n=22) — funciona, muestra chica.',
    ],
    pros: [
      'Win rate sólido (71.6%) con buen retorno (+47.5%).',
      'El short es fuerte (WR 78.6%, prom +0.83%/trade).',
    ],
    cons: [
      'En 15m la muestra es chica (n=22) — tratar con cautela.',
      'El long es más débil que el short (WR 67.9% vs 78.6%).',
    ],
    stats: { wr: 71.6, n: 81, sumaPct: 47.5 },
  },
  TRX_1h: {
    instructions: [
      'Banda de oscMain: extra ancha (15-85).',
      'Filtro de volatilidad: ATR(14)/precio ≥ 0.5%.',
      'En 15m: WR 66.8% (n=193) — la muestra más grande de 15m de todo el backtest.',
    ],
    pros: [
      'Buen win rate (74.2%) con drawdown bajo (2.4%) y muestra grande en ambos timeframes.',
      '15m funciona muy bien acá (WR 66.8%, n=193) — de los mejores resultados de esa temporalidad.',
    ],
    cons: [
      'El short tiene poca muestra (n=11 en 1h) — el long carga casi todo el volumen.',
      'Retorno promedio por trade bajo en relación al win rate (activo de baja volatilidad relativa).',
    ],
    stats: { wr: 74.2, n: 93, sumaPct: 23.3 },
  },
  AVAX_1h: {
    instructions: [
      'Banda de oscMain: extra ancha (15-85).',
      '%B: short más exigente (≥0.7).',
      'Filtro de volatilidad: ATR(14)/precio ≥ 1.0%. En 15m: WR 64.7% (n=34) — operable.',
    ],
    pros: [
      'Buen retorno total (+55.3%) con win rate sólido (75.6%).',
      'Long (WR 77.8%) y short (WR 70.4%) ambos sólidos.',
    ],
    cons: [
      'Drawdown el más alto entre los activos de win rate similar (8.8%).',
      'En 15m la muestra es chica (n=34) y el short casi no tiene señales (n=5).',
    ],
    stats: { wr: 75.6, n: 90, sumaPct: 55.3 },
  },

  // --- Fichas de 15m (solo activos con WR≥70% en esa temporalidad — R:R y pros/contras propios) ---
  HYPE_15m: {
    instructions: [
      'Banda de oscMain: angosta (30-70).',
      'Filtro de volatilidad: ATR(14)/precio ≥ 0.7%.',
      'Priorizar el long: el short en 15m es débil (WR 42.9%, total negativo).',
    ],
    pros: [
      'El long es excepcional (WR 92.3%, n=13).',
      'Drawdown muy bajo (1.3%) y racha de pérdidas corta (2).',
    ],
    cons: [
      'Muestra chica (n=20) — de las más ajustadas de esta lista.',
      'El short no tiene edge en esta temporalidad — evitarlo acá (sí funciona en 1h).',
    ],
    stats: { wr: 75.0, n: 20, sumaPct: 8.8 },
  },
  ONDO_15m: {
    instructions: [
      'Banda de oscMain: ancha (20-80).',
      'Filtro de volatilidad: ATR(14)/precio ≥ 0.3%.',
      'El short es el lado más fuerte acá (WR 76.3% vs 67.7% del long).',
    ],
    pros: [
      'Muestra grande (100 trades) con buen retorno (+37.4%) — de los mejores resultados de 15m de todo el backtest.',
      'Drawdown bajo (3.5%).',
    ],
    cons: [
      'El long es más débil que el short — priorizar el short si hay que elegir.',
      'Requiere un ATR mínimo distinto (0.3%) al de su ficha de 1h (1.0%) — no mezclar los filtros entre timeframes.',
    ],
    stats: { wr: 71.0, n: 100, sumaPct: 37.4 },
  },
  SOL_15m: {
    instructions: [
      'Banda de oscMain: ancha (20-80).',
      'Filtro de volatilidad: ATR(14)/precio ≥ 0.3%.',
      'Long y short ambos fuertes (WR 75.0% / 85.7%).',
    ],
    pros: [
      'Drawdown el más bajo de toda esta lista (0.8%).',
      'Win rate más alto que su propia ficha de 1h (76.9% vs 75.6%) — de los pocos activos donde 15m rinde igual o mejor.',
    ],
    cons: [
      'El short tiene poca muestra (n=14) frente al long (n=64).',
      'Retorno total (+24.8%) modesto frente a otros de esta lista con muestra similar.',
    ],
    stats: { wr: 76.9, n: 78, sumaPct: 24.8 },
  },
  ETH_15m: {
    instructions: [
      'Banda de oscMain: angosta (30-70).',
      'Sin filtro de volatilidad adicional.',
      'Priorizar el long (WR 70.0%, n=90) — el short tiene poca muestra (n=15).',
    ],
    pros: [
      'Muestra muy grande (105 trades) — resultado confiable.',
      'Mejora enorme frente a v1 (antes 38.3%, sin edge) — ahora sólido en 15m.',
    ],
    cons: [
      'Retorno promedio por trade fino (+0.08%) — expectancy más chica que en su ficha de 1h.',
      'El short casi no tiene señales en esta temporalidad (n=15).',
    ],
    stats: { wr: 71.4, n: 105, sumaPct: 8.8 },
  },
  ADA_15m: {
    instructions: [
      'Banda de oscMain: angosta (30-70).',
      'Filtro de volatilidad: ATR(14)/precio ≥ 0.3%.',
      'Long (WR 68.3%) y short (WR 75.0%) ambos con edge, short algo más fuerte.',
    ],
    pros: [
      'Drawdown muy bajo (1.4%).',
      'Buena muestra (88 trades) con retorno sólido (+18.7%).',
    ],
    cons: [
      'El long carga la mayoría del volumen (60 de 88 trades) pese a ser el lado más débil.',
      'Retorno por trade modesto frente a otros activos de esta lista.',
    ],
    stats: { wr: 70.5, n: 88, sumaPct: 18.7 },
  },
  DOGE_15m: {
    instructions: [
      'Banda de oscMain: angosta (30-70).',
      'Sin filtro de volatilidad adicional.',
      'El short es notablemente más fuerte (WR 84.6% vs 63.0% del long).',
    ],
    pros: [
      'Drawdown muy bajo (1.0%) y racha de pérdidas corta (3).',
      'El short es excelente acá (WR 84.6%) — mejor que en su propia ficha de 1h.',
    ],
    cons: [
      'El long es bastante más débil (WR 63.0%) — priorizar el short si hay que elegir.',
      'Retorno total modesto (+10.6%) frente a otros de esta lista.',
    ],
    stats: { wr: 70.8, n: 72, sumaPct: 10.6 },
  },
  AAVE_15m: {
    instructions: [
      'Banda de oscMain: angosta (30-70).',
      'Filtro de volatilidad: ATR(14)/precio ≥ 0.5%.',
      'Long y short prácticamente idénticos (WR 78.6% ambos) — el más parejo de toda la lista de 15m.',
    ],
    pros: [
      'Win rate más alto de la lista de 15m junto con AERO (78.6%), con drawdown muy bajo (1.2%) y racha de 2.',
      'Rinde casi igual que su ficha de 1h (73.4%) — de los pocos activos consistentes en ambos timeframes.',
    ],
    cons: [
      'Muestra más chica que en 1h (56 vs 143 trades).',
      'El short tiene menos señales que el long (14 vs 42).',
    ],
    stats: { wr: 78.6, n: 56, sumaPct: 26.4 },
  },
  AERO_15m: {
    instructions: [
      'Banda de oscMain: normal (25-70).',
      'Filtro de volatilidad: ATR(14)/precio ≥ 0.5%.',
      'Long (WR 73.8%) y short (WR 77.8%) ambos sólidos.',
    ],
    pros: [
      'El mejor retorno total de toda la lista de 15m (+40.0%) con muestra grande (101 trades).',
      'Consistente con su ficha de 1h — de los activos donde no hace falta elegir timeframe.',
    ],
    cons: [
      'Drawdown el más alto de esta lista (6.5%).',
      'Token relativamente nuevo — menos historia acumulada que otros activos.',
    ],
    stats: { wr: 75.2, n: 101, sumaPct: 40.0 },
  },
  DOT_15m: {
    instructions: [
      'Banda de oscMain: angosta (30-70).',
      'Filtro de volatilidad: ATR(14)/precio ≥ 0.5%.',
      'Priorizar el long (WR 80.0%) — el short tiene poca muestra y es débil (n=5, WR 40.0%).',
    ],
    pros: [
      'Buen win rate (73.3%) con drawdown bajo (1.4%) y racha corta (3).',
      'El long es muy sólido (WR 80.0%, n=25).',
    ],
    cons: [
      'Muestra justo en el piso mínimo (n=30) — tratar con algo de cautela.',
      'El short casi no aporta en esta temporalidad (n=5).',
    ],
    stats: { wr: 73.3, n: 30, sumaPct: 11.5 },
  },
  APT_15m: {
    instructions: [
      'Banda de oscMain: extra ancha (15-85).',
      'Filtro de volatilidad: ATR(14)/precio ≥ 0.7%.',
      'Priorizar el long (WR 80.0%) — el short es más débil acá (WR 60.0%).',
    ],
    pros: [
      'Buen retorno total (+17.2%) con win rate sólido (73.3%), igual que su ficha de 1h.',
      'El long es fuerte (WR 80.0%, n=20).',
    ],
    cons: [
      'Muestra justo en el piso mínimo (n=30).',
      'El short es más débil que en 1h — priorizar el long específicamente en esta temporalidad.',
    ],
    stats: { wr: 73.3, n: 30, sumaPct: 17.2 },
  },
  KAS_15m: {
    instructions: [
      'Banda de oscMain: angosta (30-70).',
      'Sin filtro de volatilidad adicional.',
      'Short algo más fuerte (WR 73.5%) que long (WR 68.9%), ambos con edge.',
    ],
    pros: [
      'La muestra más grande de toda la lista de 15m (171 trades) — resultado muy confiable.',
      'Buen retorno total (+26.9%) con drawdown bajo (1.9%).',
    ],
    cons: [
      'Retorno promedio por trade más fino que en su ficha de 1h.',
      'Racha de pérdidas algo más larga (5) que otros activos de esta lista.',
    ],
    stats: { wr: 70.2, n: 171, sumaPct: 26.9 },
  },
  ETC_15m: {
    instructions: [
      'Banda de oscMain: extra ancha (15-85).',
      'Filtro de volatilidad: ATR(14)/precio ≥ 0.3%.',
      'El short es más fuerte (WR 77.8%) que el long (WR 67.6%).',
    ],
    pros: [
      'Muestra grande (110 trades) con buen retorno (+20.0%).',
      'Drawdown muy bajo (1.3%).',
    ],
    cons: [
      'El long, aun con edge, es bastante más débil que el short.',
      'Retorno promedio por trade modesto frente a otros de esta lista.',
    ],
    stats: { wr: 70.9, n: 110, sumaPct: 20.0 },
  },
}

export function estimateRR(stats: AssetDetail['stats']) {
  const TP_ASSUMED = 1.5
  const wr = stats.wr / 100
  const avgTrade = stats.sumaPct / stats.n
  const avgLoss = (wr * TP_ASSUMED - avgTrade) / (1 - wr)
  const ratio = TP_ASSUMED / avgLoss
  return { ratio, avgTrade }
}

export function isReady(row: AssetRow): boolean {
  return row.signal !== 'none' && row.oscConfirm && row.atr >= ATR_THRESHOLD
}

export function pctB(row: AssetRow): number {
  return (row.price - row.lower) / (row.upper - row.lower)
}
