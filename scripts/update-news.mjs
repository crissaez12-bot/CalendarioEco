// Corre cada hora (Render Cron Job). Segun la hora (Chile), hace distintas cosas:
//   - SIEMPRE (cada hora): src/data/tickerData.json — precio + variacion 24h de
//     indices/acciones (NASDAQ), para el ticker de la portada y demas paginas.
//   - Solo a las 8/12/16: scrapea titulares de CNBC/Cointelegraph, los traduce
//     al espanol y los acumula en src/data/newsData.json durante el dia (se
//     vacia solo al detectar un dia nuevo, asi nunca crece sin limite).
//   - Solo a las 8am: ademas actualiza (reusando este mismo cron, sin pagar
//     servicios extra en Render):
//       - src/data/etfFlowsData.json  — flujo neto semanal ETF spot BTC/ETH/SOL (Farside)
//       - src/data/earningsData.json  — calendario de resultados corporativos (NASDAQ)
//       - src/data/tokenUnlocksData.json — desbloqueos de tokens top 100 mkt cap (DefiLlama)
// Si GITHUB_TOKEN esta seteado, commitea y pushea para que Render redespliegue el sitio.

import { execSync } from 'node:child_process'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUTPUT_PATH = join(__dirname, '..', 'src', 'data', 'newsData.json')
const ETF_OUTPUT_PATH = join(__dirname, '..', 'src', 'data', 'etfFlowsData.json')
const EARNINGS_OUTPUT_PATH = join(__dirname, '..', 'src', 'data', 'earningsData.json')
const UNLOCKS_OUTPUT_PATH = join(__dirname, '..', 'src', 'data', 'tokenUnlocksData.json')
const TICKER_OUTPUT_PATH = join(__dirname, '..', 'src', 'data', 'tickerData.json')
const ETF_FLOW_HOUR = 8
const ETF_WINDOW_DAYS = 5
const EARNINGS_BUSINESS_DAYS = 5
const EARNINGS_MIN_MARKETCAP = 5_000_000_000 // solo empresas grandes/mid-cap, no toda la lista de NASDAQ
const EARNINGS_MAX_PER_DAY = 8
const UNLOCKS_TOP_N_MCAP = 100
const UNLOCKS_WINDOW_DAYS = 10
const UNLOCKS_MAX_EVENTS = 30

const TARGET_HOURS = [8, 12, 16]
const MAX_ITEMS_PER_CATEGORY = 24
const ITEMS_PER_FETCH = 10
const TRANSLATE_EMAIL = 'cris.saez12@gmail.com' // sube el limite gratis de MyMemory

const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36'
const FETCH_HEADERS = {
  'User-Agent': UA,
  Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.9',
}

function decodeEntities(str) {
  return str
    .replace(/&amp;/g, '&')
    .replace(/&#x27;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&#x2019;/g, '’')
    .replace(/&#8217;/g, '’')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
    .trim()
}

function parseCnbc(html) {
  const re = /<a href="([^"]+)" class="Card-title" target="">([^<]+)/g
  const items = []
  const seen = new Set()
  let m
  while ((m = re.exec(html))) {
    const url = m[1]
    const title = decodeEntities(m[2])
    if (seen.has(url)) continue
    seen.add(url)
    items.push({ title, url })
    if (items.length >= ITEMS_PER_FETCH) break
  }
  return items
}

function parseCointelegraph(html) {
  const re =
    /href="(\/news\/[^"]+)"[\s\S]{0,400}?data-testid="post-latest-card__title"[^>]*><!--\[-->([^<]+)<!--\]-->/g
  const items = []
  const seen = new Set()
  let m
  while ((m = re.exec(html))) {
    const url = `https://cointelegraph.com${m[1]}`
    const title = decodeEntities(m[2])
    if (seen.has(url)) continue
    seen.add(url)
    items.push({ title, url })
    if (items.length >= ITEMS_PER_FETCH) break
  }
  return items
}

const CATEGORY_CONFIG = [
  { key: 'finanzas', label: 'Finanzas', source: 'CNBC', url: 'https://www.cnbc.com/finance/', parse: parseCnbc },
  { key: 'economia', label: 'Economía', source: 'CNBC', url: 'https://www.cnbc.com/economy/', parse: parseCnbc },
  { key: 'tecnologia', label: 'Tecnología', source: 'CNBC', url: 'https://www.cnbc.com/technology/', parse: parseCnbc },
  { key: 'politica', label: 'Política', source: 'CNBC', url: 'https://www.cnbc.com/politics/', parse: parseCnbc },
  { key: 'crypto', label: 'Crypto', source: 'Cointelegraph', url: 'https://cointelegraph.com/', parse: parseCointelegraph },
]

async function translate(text) {
  try {
    const q = encodeURIComponent(text)
    const res = await fetch(`https://api.mymemory.translated.net/get?q=${q}&langpair=en|es&de=${TRANSLATE_EMAIL}`)
    const json = await res.json()
    const translated = json?.responseData?.translatedText
    if (!translated || json?.responseStatus !== 200) return text
    return decodeEntities(translated)
  } catch {
    return text
  }
}

// Farside solo trackea ETF spot de BTC, ETH y SOL por ahora — es la lista
// completa de "top 10 crypto" con ETF spot aprobado que tienen datos reales
// disponibles (XRP, DOGE, ADA, etc. no tienen ETF spot trackeado aca todavia).
const FARSIDE_ASSETS = [
  { asset: 'BTC', url: 'https://farside.co.uk/btc/' },
  { asset: 'ETH', url: 'https://farside.co.uk/eth/' },
  { asset: 'SOL', url: 'https://farside.co.uk/sol/' },
]

function parseFarsideCell(raw) {
  const isNegative = raw.includes('(')
  const cleaned = raw
    .replace(/<[^>]+>/g, '')
    .replace(/[(),]/g, '')
    .trim()
  if (cleaned === '' || cleaned === '-') return null
  const num = Number(cleaned)
  if (Number.isNaN(num)) return null
  return isNegative ? -num : num
}

function parseFarsideTable(html) {
  const table = html.match(/<table[^>]*>[\s\S]*?<\/table>/)?.[0]
  if (!table) return []
  const rows = table.match(/<tr[\s\S]*?<\/tr>/g) ?? []
  const days = []
  for (const row of rows) {
    const cells = [...row.matchAll(/<span class="tabletext">([\s\S]*?)<\/span>/g)].map((m) => m[1])
    if (cells.length < 2) continue
    const dateLabel = cells[0].replace(/&nbsp;/g, '').trim()
    if (!/^\d{1,2} \w{3} \d{4}$/.test(dateLabel)) continue // salta Total/Average/Maximum/Minimum y headers
    const total = parseFarsideCell(cells[cells.length - 1])
    if (total === null) continue // dia sin dato publicado todavia ("-")
    days.push({ date: dateLabel, total })
  }
  return days
}

function curlFetch(url) {
  // Farside esta detras de Cloudflare y bloquea el fetch nativo de Node por su
  // huella TLS/HTTP2 (403 consistente), pero curl pasa sin problema con los
  // mismos headers — probado empiricamente. Se usa curl como subproceso solo
  // para este dominio.
  return execSync(
    `curl -sL -A "${UA}" -H "Accept: text/html" -H "Accept-Language: en-US,en;q=0.9" "${url}"`,
    { encoding: 'utf8', maxBuffer: 1024 * 1024 * 10 },
  )
}

async function fetchWeeklyEtfFlow(asset, url) {
  const html = curlFetch(url)
  if (!html || html.length < 1000) throw new Error('respuesta vacia o demasiado corta (posible bloqueo)')
  const days = parseFarsideTable(html)
  const lastDays = days.slice(-ETF_WINDOW_DAYS)
  if (lastDays.length === 0) throw new Error('tabla sin filas validas (posible challenge de Cloudflare)')
  const netFlow = Math.round(lastDays.reduce((sum, d) => sum + d.total, 0) * 1_000_000) // Farside reporta en millones USD
  return { asset, netFlow, days: lastDays.length, through: lastDays.at(-1)?.date ?? null }
}

function loadExistingEtfFlows() {
  if (!existsSync(ETF_OUTPUT_PATH)) return null
  try {
    return JSON.parse(readFileSync(ETF_OUTPUT_PATH, 'utf8'))
  } catch {
    return null
  }
}

async function updateEtfFlows(now) {
  const existing = loadExistingEtfFlows()
  const previousByAsset = new Map((existing?.flows ?? []).map((f) => [f.asset, f]))

  const flows = []
  let anyFresh = false
  for (const cfg of FARSIDE_ASSETS) {
    try {
      console.log(`Scrapeando ETF flows ${cfg.asset} (${cfg.url})...`)
      flows.push(await fetchWeeklyEtfFlow(cfg.asset, cfg.url))
      anyFresh = true
    } catch (err) {
      console.log(`  Fallo el fetch de ETF flows ${cfg.asset}: ${err.message}`)
      const prev = previousByAsset.get(cfg.asset)
      if (prev) {
        console.log(`  Se mantiene el ultimo valor conocido de ${cfg.asset} (${prev.through ?? 'sin fecha'}).`)
        flows.push(prev)
      }
    }
  }
  if (!anyFresh) {
    console.log('No se pudo obtener ningun ETF flow nuevo — se mantiene el archivo anterior tal cual.')
    return
  }
  const output = { updatedAt: now.date, windowDays: ETF_WINDOW_DAYS, flows }
  writeFileSync(ETF_OUTPUT_PATH, JSON.stringify(output, null, 2) + '\n', 'utf8')
  console.log('Escrito:', ETF_OUTPUT_PATH)
}

// Ticker de portada: indices (via ETF proxy) + acciones. SPCX = SpaceX (lista en
// NASDAQ). Se actualiza TODAS las corridas del cron (cada hora), a diferencia
// de las demas secciones que solo corren a horas fijas.
const TICKERS = [
  { symbol: 'SPY', label: 'S&P 500', assetClass: 'etf' },
  { symbol: 'QQQ', label: 'Nasdaq 100', assetClass: 'etf' },
  { symbol: 'DIA', label: 'Dow Jones', assetClass: 'etf' },
  { symbol: 'AAPL', label: 'Apple', assetClass: 'stocks' },
  { symbol: 'MSFT', label: 'Microsoft', assetClass: 'stocks' },
  { symbol: 'GOOGL', label: 'Alphabet', assetClass: 'stocks' },
  { symbol: 'AMZN', label: 'Amazon', assetClass: 'stocks' },
  { symbol: 'NVDA', label: 'Nvidia', assetClass: 'stocks' },
  { symbol: 'META', label: 'Meta', assetClass: 'stocks' },
  { symbol: 'TSLA', label: 'Tesla', assetClass: 'stocks' },
  { symbol: 'SPCX', label: 'SpaceX', assetClass: 'stocks' },
  { symbol: 'ORCL', label: 'Oracle', assetClass: 'stocks' },
  { symbol: 'PLTR', label: 'Palantir', assetClass: 'stocks' },
  { symbol: 'IBM', label: 'IBM', assetClass: 'stocks' },
  { symbol: 'MSTR', label: 'Strategy', assetClass: 'stocks' },
  { symbol: 'COIN', label: 'Coinbase', assetClass: 'stocks' },
  { symbol: 'CRCL', label: 'Circle', assetClass: 'stocks' },
  { symbol: 'HOOD', label: 'Robinhood', assetClass: 'stocks' },
]

async function fetchQuote(cfg) {
  const res = await fetch(`https://api.nasdaq.com/api/quote/${cfg.symbol}/info?assetclass=${cfg.assetClass}`, {
    headers: FETCH_HEADERS,
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const json = await res.json()
  const d = json?.data?.primaryData
  if (!d) throw new Error('sin datos')
  const price = Number(String(d.lastSalePrice).replace(/[$,]/g, ''))
  const changePct = Number(String(d.percentageChange).replace(/[%,]/g, ''))
  if (Number.isNaN(price) || Number.isNaN(changePct)) throw new Error('precio/variacion invalido')
  return { symbol: cfg.symbol, label: cfg.label, price, changePct }
}

async function updateTickers(now) {
  const items = []
  for (const cfg of TICKERS) {
    try {
      items.push(await fetchQuote(cfg))
    } catch (err) {
      console.log(`  Fallo el fetch de ${cfg.symbol}: ${err.message}`)
    }
    await new Promise((r) => setTimeout(r, 200))
  }
  if (items.length === 0) {
    console.log('No se pudo obtener ningun ticker — se mantiene el archivo anterior.')
    return
  }
  const output = { updatedAt: `${now.date} ${now.time}`, items }
  writeFileSync(TICKER_OUTPUT_PATH, JSON.stringify(output, null, 2) + '\n', 'utf8')
  console.log('Escrito:', TICKER_OUTPUT_PATH)
}

const WEEKDAY_LABEL = new Intl.DateTimeFormat('es-AR', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
})

function fmtDayLabel(dateStr) {
  const d = new Date(`${dateStr}T00:00:00Z`)
  const label = WEEKDAY_LABEL.format(d)
  return label.charAt(0).toUpperCase() + label.slice(1)
}

function parseMoneyString(s) {
  if (!s) return 0
  const n = Number(String(s).replace(/[$,]/g, ''))
  return Number.isNaN(n) ? 0 : n
}

async function fetchEarningsDay(dateStr) {
  const res = await fetch(`https://api.nasdaq.com/api/calendar/earnings?date=${dateStr}`, { headers: FETCH_HEADERS })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const json = await res.json()
  const rows = json?.data?.rows ?? []
  return rows
    .map((r) => ({
      ticker: r.symbol,
      name: r.name,
      marketCap: parseMoneyString(r.marketCap),
      time: r.time === 'time-pre-market' ? 'BMO' : r.time === 'time-after-hours' ? 'AMC' : 'N/D',
      epsEst: r.epsForecast ? r.epsForecast.replace('$', '') : '-',
      epsLastYear: r.lastYearEPS ? r.lastYearEPS.replace('$', '') : '-',
    }))
    .filter((r) => r.marketCap >= EARNINGS_MIN_MARKETCAP)
    .sort((a, b) => b.marketCap - a.marketCap)
    .slice(0, EARNINGS_MAX_PER_DAY)
}

async function updateEarnings(now) {
  const days = []
  const d = new Date(`${now.date}T12:00:00Z`) // mediodia UTC — evita corrimiento de dia por DST/redondeo
  let collected = 0
  let guard = 0
  while (collected < EARNINGS_BUSINESS_DAYS && guard < 14) {
    const dow = d.getUTCDay() // 0 = domingo, 6 = sabado
    if (dow !== 0 && dow !== 6) {
      const dateStr = d.toISOString().slice(0, 10)
      try {
        console.log(`Scrapeando earnings ${dateStr}...`)
        const events = await fetchEarningsDay(dateStr)
        if (events.length > 0) days.push({ date: dateStr, label: fmtDayLabel(dateStr), events })
      } catch (err) {
        console.log(`  Fallo earnings ${dateStr}: ${err.message}`)
      }
      collected++
    }
    d.setUTCDate(d.getUTCDate() + 1)
    guard++
  }
  if (days.length === 0) {
    console.log('No se pudo obtener earnings de ningun dia — se mantiene el archivo anterior.')
    return
  }
  const output = { source: 'NASDAQ', capturedAt: now.date, days }
  writeFileSync(EARNINGS_OUTPUT_PATH, JSON.stringify(output, null, 2) + '\n', 'utf8')
  console.log('Escrito:', EARNINGS_OUTPUT_PATH)
}

function mapUnlockType(ev) {
  const cat = (ev?.category ?? '').toLowerCase()
  if (cat.includes('team') || cat.includes('investor')) return 'Team / Investors'
  if (cat.includes('staking')) return 'Staking rewards'
  return ev?.unlockType === 'cliff' ? 'Cliff' : 'Lineal'
}

async function updateTokenUnlocks(now) {
  // defillama.com esta detras del mismo tipo de proteccion que Farside — usa curl.
  // La API paga (api.llama.fi/emissions) ya no es gratis, pero la data que alimenta
  // la pagina publica /unlocks sigue viniendo embebida en el HTML (__NEXT_DATA__),
  // que es exactamente lo que ve cualquier visitante sin loguearse.
  const html = curlFetch('https://defillama.com/unlocks')
  if (!html || html.length < 100_000) throw new Error('respuesta vacia o demasiado corta (posible bloqueo)')
  const m = html.match(/<script id="__NEXT_DATA__" type="application\/json">([\s\S]*?)<\/script>/)
  if (!m) throw new Error('no se encontro __NEXT_DATA__ en la pagina de unlocks')
  const list = JSON.parse(m[1])?.props?.pageProps?.data ?? []

  const byMcap = list
    .filter((t) => t.mcap)
    .sort((a, b) => b.mcap - a.mcap)
    .slice(0, UNLOCKS_TOP_N_MCAP)

  const nowSec = Date.now() / 1000
  const windowEnd = nowSec + UNLOCKS_WINDOW_DAYS * 86400

  const events = []
  for (const t of byMcap) {
    const ev = t.nextEvent
    if (!ev?.date || ev.date <= nowSec || ev.date > windowEnd) continue
    const tokens = ev.toUnlock ?? 0
    events.push({
      date: new Date(ev.date * 1000).toISOString().slice(0, 10),
      ticker: t.tSymbol || '-',
      name: t.name,
      type: mapUnlockType(t.upcomingEvent?.[0]),
      unlockTokens: Math.round(tokens),
      unlockUsd: Math.round(tokens * (t.tPrice || 0)),
      pctSupply: Math.round((ev.proportion ?? 0) * 100 * 1000) / 1000,
    })
  }
  events.sort((a, b) => a.date.localeCompare(b.date))

  const byDay = new Map()
  for (const { date, ...e } of events.slice(0, UNLOCKS_MAX_EVENTS)) {
    if (!byDay.has(date)) byDay.set(date, [])
    byDay.get(date).push(e)
  }
  const days = [...byDay.entries()].map(([date, evs]) => ({ date, label: fmtDayLabel(date), events: evs }))

  const output = { source: 'DefiLlama (top 100 mkt cap)', capturedAt: now.date, days }
  writeFileSync(UNLOCKS_OUTPUT_PATH, JSON.stringify(output, null, 2) + '\n', 'utf8')
  console.log('Escrito:', UNLOCKS_OUTPUT_PATH)
}

function chileNow() {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Santiago',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(new Date())
  const get = (t) => parts.find((p) => p.type === t)?.value
  return {
    date: `${get('year')}-${get('month')}-${get('day')}`,
    time: `${get('hour')}:${get('minute')}`,
    hour: Number(get('hour')),
  }
}

function loadExisting() {
  if (!existsSync(OUTPUT_PATH)) return null
  try {
    return JSON.parse(readFileSync(OUTPUT_PATH, 'utf8'))
  } catch {
    return null
  }
}

async function main() {
  const now = chileNow()
  const forced = process.env.FORCE_RUN === '1'
  const updatingNews = forced || TARGET_HOURS.includes(now.hour)
  const updatingDaily = forced || now.hour === ETF_FLOW_HOUR

  console.log(`Hora Chile: ${now.hour}h — tickers: si, noticias: ${updatingNews ? 'si' : 'no'}, diario: ${updatingDaily ? 'si' : 'no'}`)

  await updateTickers(now)

  if (updatingNews) {
    const existing = loadExisting()
    const isNewDay = !existing || existing.date !== now.date

    const categories = {}
    for (const cfg of CATEGORY_CONFIG) {
      categories[cfg.key] = isNewDay ? [] : (existing?.categories?.[cfg.key] ?? [])
    }

    for (const cfg of CATEGORY_CONFIG) {
      console.log(`Scrapeando ${cfg.label} (${cfg.url})...`)
      let fresh = []
      try {
        const res = await fetch(cfg.url, { headers: FETCH_HEADERS })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const html = await res.text()
        fresh = cfg.parse(html)
      } catch (err) {
        console.log(`  Fallo el fetch de ${cfg.label}: ${err.message} — se mantiene lo que ya habia.`)
        continue
      }

      const existingUrls = new Set(categories[cfg.key].map((i) => i.url))
      const newOnes = fresh.filter((i) => !existingUrls.has(i.url))
      console.log(`  ${fresh.length} encontrados, ${newOnes.length} nuevos.`)

      for (const item of newOnes) {
        const titleEs = await translate(item.title)
        categories[cfg.key].unshift({ title: titleEs, url: item.url, source: cfg.source })
        await new Promise((r) => setTimeout(r, 250))
      }

      if (categories[cfg.key].length > MAX_ITEMS_PER_CATEGORY) {
        categories[cfg.key] = categories[cfg.key].slice(0, MAX_ITEMS_PER_CATEGORY)
      }
    }

    const output = { date: now.date, updatedAt: now.time, categories }
    writeFileSync(OUTPUT_PATH, JSON.stringify(output, null, 2) + '\n', 'utf8')
    console.log('Escrito:', OUTPUT_PATH)
  }

  if (updatingDaily) {
    await updateEtfFlows(now)
    await updateEarnings(now)
    try {
      await updateTokenUnlocks(now)
    } catch (err) {
      console.log(`Fallo token unlocks: ${err.message} — se mantiene el archivo anterior.`)
    }
  }

  if (process.env.GITHUB_TOKEN && process.env.GIT_REPO) {
    const repo = process.env.GIT_REPO.replace('https://', '')
    const remote = `https://x-access-token:${process.env.GITHUB_TOKEN}@${repo}`
    execSync(`git config user.email "cron@empire-session.local"`, { stdio: 'inherit' })
    execSync(`git config user.name "Empire Session Cron"`, { stdio: 'inherit' })
    if (existsSync(TICKER_OUTPUT_PATH)) execSync(`git add "${TICKER_OUTPUT_PATH}"`, { stdio: 'inherit' })
    if (updatingNews) execSync(`git add src/data/newsData.json`, { stdio: 'inherit' })
    if (updatingDaily) {
      for (const p of [ETF_OUTPUT_PATH, EARNINGS_OUTPUT_PATH, UNLOCKS_OUTPUT_PATH]) {
        if (existsSync(p)) execSync(`git add "${p}"`, { stdio: 'inherit' })
      }
    }
    try {
      const parts = ['tickers']
      if (updatingNews) parts.push('noticias')
      if (updatingDaily) parts.push('etf flows, earnings y unlocks')
      execSync(`git commit -m "chore: actualizar ${parts.join(', ')} (${now.date} ${now.time} CLT)"`, { stdio: 'inherit' })
      execSync(`git push ${remote} HEAD:main`, { stdio: 'inherit' })
      console.log('Commit y push OK.')
    } catch (e) {
      console.log('Nada nuevo para commitear, o el push fallo:', e.message)
    }
  } else {
    const missing = []
    if (!process.env.GITHUB_TOKEN) missing.push('GITHUB_TOKEN')
    if (!process.env.GIT_REPO) missing.push('GIT_REPO')
    console.log(`Falta(n) seteadas: ${missing.join(', ')} — solo se actualizo el archivo local, sin commit.`)
  }
}

main().catch((err) => {
  console.error('ERROR en update-news:', err.message)
  process.exit(1)
})
