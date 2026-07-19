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
}

export const ATR_THRESHOLD = 0.35

export const DATA: Record<Timeframe, AssetRow[]> = {
  '1h': [
    { name: 'Hyperliquid', ticker: 'HYPE', tier: 1, price: 41.86, basis: 41.2, upper: 43.55, lower: 38.85, signal: 'bull', osc: 61.4, oscConfirm: true, atr: 0.71, updated: '08:14:02' },
    { name: 'Ondo', ticker: 'ONDO', tier: 1, price: 0.9142, basis: 0.931, upper: 0.978, lower: 0.884, signal: 'none', osc: 47.2, oscConfirm: false, atr: 0.42, updated: '08:14:05' },
    { name: 'Lido DAO', ticker: 'LDO', tier: 1, price: 1.284, basis: 1.301, upper: 1.362, lower: 1.24, signal: 'bear', osc: 58.9, oscConfirm: true, atr: 0.55, updated: '08:14:03' },
    { name: 'Solana', ticker: 'SOL', tier: 1, price: 187.4, basis: 190.1, upper: 199.6, lower: 180.6, signal: 'bull', osc: 33.1, oscConfirm: false, atr: 0.38, updated: '08:14:01' },
    { name: 'Chainlink', ticker: 'LINK', tier: 2, price: 16.92, basis: 17.34, upper: 18.12, lower: 16.56, signal: 'bear', osc: 41.0, oscConfirm: true, atr: 0.29, updated: '08:14:07' },
    { name: 'Bitcoin', ticker: 'BTC', tier: 2, price: 117420, basis: 118650, upper: 121300, lower: 116000, signal: 'none', osc: 52.6, oscConfirm: false, atr: 0.24, updated: '08:13:58' },
    { name: 'Ethereum', ticker: 'ETH', tier: 2, price: 4128, basis: 4185, upper: 4340, lower: 4030, signal: 'bull', osc: 44.8, oscConfirm: true, atr: 0.46, updated: '08:14:04' },
    { name: 'Uniswap', ticker: 'UNI', tier: 2, price: 12.05, basis: 12.31, upper: 12.98, lower: 11.64, signal: 'none', osc: 39.5, oscConfirm: false, atr: 0.31, updated: '08:14:06' },
    { name: 'Sei', ticker: 'SEI', tier: 3, price: 0.3122, basis: 0.318, upper: 0.334, lower: 0.302, signal: 'bear', osc: 55.3, oscConfirm: true, atr: 0.33, updated: '08:14:09' },
    { name: 'Stellar', ticker: 'XLM', tier: 3, price: 0.4381, basis: 0.446, upper: 0.467, lower: 0.425, signal: 'bear', osc: 60.7, oscConfirm: true, atr: 0.61, updated: '08:14:08' },
    { name: 'Dogecoin', ticker: 'DOGE', tier: 3, price: 0.2214, basis: 0.2255, upper: 0.237, lower: 0.214, signal: 'bear', osc: 52.0, oscConfirm: false, atr: 0.27, updated: '08:14:10' },
  ],
  '15m': [
    { name: 'Hyperliquid', ticker: 'HYPE', tier: 1, price: 41.9, basis: 41.78, upper: 42.3, lower: 41.26, signal: 'none', osc: 49.0, oscConfirm: false, atr: 0.18, updated: '08:14:32' },
    { name: 'Ondo', ticker: 'ONDO', tier: 1, price: 0.9138, basis: 0.9155, upper: 0.926, lower: 0.905, signal: 'bull', osc: 34.2, oscConfirm: true, atr: 0.21, updated: '08:14:31' },
    { name: 'Lido DAO', ticker: 'LDO', tier: 1, price: 1.286, basis: 1.29, upper: 1.308, lower: 1.272, signal: 'none', osc: 51.5, oscConfirm: false, atr: 0.12, updated: '08:14:33' },
    { name: 'Solana', ticker: 'SOL', tier: 1, price: 187.6, basis: 188.4, upper: 191.2, lower: 185.6, signal: 'bull', osc: 29.4, oscConfirm: true, atr: 0.34, updated: '08:14:30' },
    { name: 'Chainlink', ticker: 'LINK', tier: 2, price: 16.94, basis: 16.98, upper: 17.14, lower: 16.82, signal: 'bear', osc: 62.1, oscConfirm: false, atr: 0.14, updated: '08:14:35' },
    { name: 'Bitcoin', ticker: 'BTC', tier: 2, price: 117460, basis: 117610, upper: 118400, lower: 116820, signal: 'none', osc: 55.8, oscConfirm: false, atr: 0.11, updated: '08:14:28' },
    { name: 'Ethereum', ticker: 'ETH', tier: 2, price: 4131, basis: 4139, upper: 4188, lower: 4090, signal: 'bull', osc: 38.6, oscConfirm: true, atr: 0.29, updated: '08:14:34' },
    { name: 'Uniswap', ticker: 'UNI', tier: 2, price: 12.07, basis: 12.1, upper: 12.28, lower: 11.92, signal: 'none', osc: 44.1, oscConfirm: false, atr: 0.15, updated: '08:14:36' },
    { name: 'Sei', ticker: 'SEI', tier: 3, price: 0.3119, basis: 0.3128, upper: 0.3172, lower: 0.3084, signal: 'bear', osc: 59.0, oscConfirm: true, atr: 0.24, updated: '08:14:38' },
    { name: 'Stellar', ticker: 'XLM', tier: 3, price: 0.4378, basis: 0.439, upper: 0.4442, lower: 0.4338, signal: 'bear', osc: 63.4, oscConfirm: true, atr: 0.19, updated: '08:14:37' },
    { name: 'Dogecoin', ticker: 'DOGE', tier: 3, price: 0.2211, basis: 0.2218, upper: 0.2248, lower: 0.2188, signal: 'none', osc: 48.3, oscConfirm: false, atr: 0.09, updated: '08:14:39' },
  ],
}

export const ASSET_DETAIL: Record<string, AssetDetail> = {
  HYPE: {
    instructions: [
      'Banda de oscMain: normal (25-70) por defecto — no tiene ensanche documentado propio.',
      'No filtrar por hora ni por régimen de BTC: es el único activo del grupo que rinde bien incluso con BTC bajista.',
      'En el short, exigir %B > 0.75 — es la entrada de mejor calidad para este activo.',
      'Dimensionar posición pensando en rachas: la peor racha observada fue de 4 pérdidas seguidas.',
    ],
    pros: [
      'Win rate más alto del grupo (77.5%) sobre 89 trades.',
      'No depende de filtro de hora ni de régimen — mecánica simple de operar.',
      'Drawdown máximo bajo (2.4%) para el retorno que entrega.',
    ],
    cons: [
      'Historia de backtest más corta (~15.6 meses) que el resto del grupo.',
      'Sin banda oscMain propia documentada — se opera con el valor por defecto, no uno tuneado.',
      'Rinde mejor con BTC bajista, un régimen que no siempre se puede elegir cuándo aparece.',
    ],
    stats: { wr: 77.5, n: 89, sumaPct: 72.4 },
  },
  ONDO: {
    instructions: [
      'Banda de oscMain: ancha (20-80).',
      'Ambos lados (long y short) tienen edge real — no hace falta forzar un solo sentido.',
      'El short es el lado más fuerte (WR 77.8%): priorizarlo si hay que elegir una sola señal en simultáneo con otro activo.',
    ],
    pros: [
      'Segundo mejor win rate del grupo (66.4%) con muestra amplia (116 trades).',
      'Long y short ambos rentables — no depende de acertar un solo sesgo direccional.',
    ],
    cons: [
      'El short domina sobre el long — si se opera long-only se pierde la mayor parte del edge.',
      'Sin filtro de hora ni de régimen documentado todavía.',
    ],
    stats: { wr: 66.4, n: 116, sumaPct: 62.3 },
  },
  LDO: {
    instructions: [
      'Banda de oscMain: normal (25-70) por defecto.',
      'Long y short rinden parejo — no hay que sesgarse a un lado.',
      'No requiere filtro de régimen ni de hora documentado.',
    ],
    pros: [
      'El más equilibrado del grupo: long (+31.5%) y short (+22.2%) aportan de forma similar.',
      'Muestra grande (131 trades) — resultado más confiable estadísticamente.',
    ],
    cons: [
      'Win rate (64.9%) y retorno total por debajo de HYPE y ONDO.',
      'Sin ajustes finos probados todavía (banda, horario, régimen).',
    ],
    stats: { wr: 64.9, n: 131, sumaPct: 53.7 },
  },
  SOL: {
    instructions: [
      'Banda de oscMain: ancha (20-80).',
      'Sin filtro de hora validado — el efecto de sesión de BTC/ETH no generaliza a SOL (probado y descartado).',
      'Operar ambos lados con las reglas estándar del framework.',
    ],
    pros: [
      'Muestra amplia (149 trades) con win rate sólido (60.4%).',
      'Nivel 1 de confianza — comportamiento consistente, sin ajustes especiales que recordar.',
    ],
    cons: [
      'Retorno total menor que HYPE/ONDO/LDO en la misma ventana.',
      'Filtro horario probado explícitamente y descartado — no hay palanca extra de mejora ahí.',
    ],
    stats: { wr: 60.4, n: 149, sumaPct: 53.4 },
  },
  LINK: {
    instructions: [
      'Banda de oscMain: normal (25-70).',
      'Chequear régimen de BTC (precio > SMA400 en 1h) antes de entrar — con BTC alcista el edge mejora.',
      'En el short, exigir %B > 0.75. La zona 0.5-0.75 es negativa (WR 31.2%, promedio -0.21%) — evitarla.',
      'Mejores horas históricas: 08:00-12:00 UTC.',
    ],
    pros: [
      'Muestra grande (157 trades) con reglas de filtrado bien identificadas.',
      'El filtro de %B>0.75 en el short convierte una zona negativa en una entrada limpia.',
    ],
    cons: [
      'Win rate más bajo (52.2%) — depende más de la disciplina en los filtros que otros activos.',
      'Requiere chequear un indicador externo (régimen BTC) antes de cada entrada, no es autónomo del propio gráfico.',
    ],
    stats: { wr: 52.2, n: 157, sumaPct: 38.7 },
  },
  BTC: {
    instructions: [
      'Banda de oscMain: ancha (20-80).',
      'Mejor sesión histórica: 01:00-05:00 UTC (heredado del framework de swing original).',
      'Win rate más ajustado — priorizar solo confluencias limpias, sin forzar entradas dudosas.',
    ],
    pros: [
      'Activo de referencia del mercado — liquidez y ejecución más predecibles.',
      'Muestra muy grande (179 trades), resultado estadísticamente sólido.',
    ],
    cons: [
      'Win rate más bajo del grupo Nivel 2 (44.1%) — expectancy por trade es fina.',
      'Depende de respetar la ventana horaria para rendir bien; fuera de ella el edge se diluye.',
    ],
    stats: { wr: 44.1, n: 179, sumaPct: 39.1 },
  },
  ETH: {
    instructions: [
      'Banda de oscMain: normal (25-70) — probado ensanchar y empeora, no tocar.',
      'Mejor sesión histórica: 01:00-05:00 UTC.',
      'Operar ambos lados con las reglas estándar.',
    ],
    pros: ['Muestra muy grande (178 trades).', 'Win rate exactamente en el punto de equilibrio (50%) con expectancy positiva neta.'],
    cons: [
      'El retorno total (+28.0%) es el más bajo del grupo Nivel 2.',
      'Ensanchar la banda (una optimización habitual en otros activos) empeora el resultado — no hay margen de ajuste ahí.',
    ],
    stats: { wr: 50.0, n: 178, sumaPct: 28.0 },
  },
  UNI: {
    instructions: [
      'Banda de oscMain: normal (25-70) por defecto.',
      'El long carga casi todo el edge (+37.0% de los +39.4% totales) — priorizarlo si hay que elegir.',
      'El short es débil (+2.4%): tratarlo como confirmación secundaria, no como señal principal.',
    ],
    pros: [
      'Win rate sólido (57.8%) sobre muestra amplia (147 trades).',
      'El sesgo long está claramente identificado — simplifica la decisión en señales ambiguas.',
    ],
    cons: [
      'El short casi no aporta — operarlo igual que el long desperdicia foco.',
      'Sin filtro de hora ni de régimen documentado todavía.',
    ],
    stats: { wr: 57.8, n: 147, sumaPct: 39.4 },
  },
  SEI: {
    instructions: [
      'Operar short-only — el long está casi plano (+0.9%) y no aporta edge real.',
      'Banda de oscMain: sin clasificar, usar normal (25-70) por defecto.',
      'Expectancy fina y muestra chica (55 trades): baja prioridad frente a Nivel 1.',
    ],
    pros: [
      'El short tiene edge real y consistente (+7.9% de los +8.7% totales).',
      'Win rate razonable (63.6%) para el lado que sí funciona.',
    ],
    cons: [
      'Muestra la más chica del grupo (55 trades) — menos confiable estadísticamente.',
      'El long no aporta nada; operarlo es puro ruido.',
      'Retorno total bajo — no es prioridad si hay señales de Nivel 1 disponibles al mismo tiempo.',
    ],
    stats: { wr: 63.6, n: 55, sumaPct: 8.7 },
  },
  XLM: {
    instructions: [
      'Operar short-only — el long es débil (+0.6%), casi todo el edge está del lado corto.',
      'Banda de oscMain: sin clasificar, usar normal (25-70) por defecto.',
      'Priorizar frente a SEI/DOGE dentro de Nivel 3 si hay que elegir una sola señal — es el de mejor retorno del grupo.',
    ],
    pros: [
      'Buen win rate (65.7%) y el mejor retorno total (+16.8%) del grupo Nivel 3.',
      'El sesgo short está claramente identificado y es consistente.',
    ],
    cons: [
      'El long prácticamente no aporta — operarlo desperdicia señales.',
      'Sin filtro de hora ni régimen probado todavía.',
    ],
    stats: { wr: 65.7, n: 70, sumaPct: 16.8 },
  },
  DOGE: {
    instructions: [
      'Operar short-only — el long es negativo (-1.9%), evitarlo por completo.',
      'Banda de oscMain: sin clasificar, usar normal (25-70) por defecto.',
      'El más débil del grupo — usar solo si no hay señales de Nivel 1 o 2 disponibles.',
    ],
    pros: ['Win rate alto (74.4%) en el lado short.', 'Señal simple de aplicar: descartar todo long directamente.'],
    cons: [
      'Retorno total más bajo de los 14 activos backtesteados (+5.0%).',
      'Muestra chica (43 trades) — menor confiabilidad estadística.',
      'El long activo (descartarlo) reduce a la mitad las oportunidades de entrada frente a otros activos.',
    ],
    stats: { wr: 74.4, n: 43, sumaPct: 5.0 },
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
