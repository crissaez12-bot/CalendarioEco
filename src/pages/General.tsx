import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import PageShell from '../components/PageShell'
import { ASSET_ICON, DATA } from '../data/monteCarloData'
import { useMcLive } from '../data/mcLive'
import { CALENDAR_SOURCE, CALENDAR_WEEK } from '../data/calendarData'
import { FEAR_GREED } from '../data/generalData'
import newsData from '../data/newsData.json'
import etfFlowsData from '../data/etfFlowsData.json'
import earningsData from '../data/earningsData.json'
import { isMag7 } from '../data/mag7'

const TICKER_NAME = new Map([...DATA['1h'], ...DATA['15m']].map((r) => [r.ticker, r.name]))

function formatSignalTime(ts: number) {
  return new Date(ts * 1000).toLocaleTimeString('es-CL', {
    timeZone: 'America/Santiago',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const GOLD = '#D4AF37'

interface SessionDef {
  countryCode: string
  label: string
  tz: string
  openUTC: number
  closeUTC: number
}

const SESSIONS: SessionDef[] = [
  { countryCode: 'us', label: 'Nueva York', tz: 'America/New_York', openUTC: 13, closeUTC: 21 },
  { countryCode: 'gb', label: 'Londres', tz: 'Europe/London', openUTC: 8, closeUTC: 16 },
  { countryCode: 'cn', label: 'China', tz: 'Asia/Shanghai', openUTC: 0, closeUTC: 9 },
]

function isSessionOpen(now: Date, s: SessionDef) {
  const h = now.getUTCHours() + now.getUTCMinutes() / 60
  return h >= s.openUTC && h < s.closeUTC
}

const moneyShort = (n: number) => {
  const abs = Math.abs(n)
  const val = abs >= 1e9 ? `${(abs / 1e9).toFixed(2)}B` : `${(abs / 1e6).toFixed(0)}M`
  return `${n >= 0 ? '+' : '-'}$${val}`
}

interface LiveSentiment {
  value: number
  label: string
}

function classifyFng(label: string) {
  const map: Record<string, string> = {
    'Extreme Fear': 'Extreme Fear',
    Fear: 'Fear',
    Neutral: 'Neutral',
    Greed: 'Greed',
    'Extreme Greed': 'Extreme Greed',
  }
  return map[label] ?? label
}

function useCryptoFearGreed(fallback: LiveSentiment) {
  const [data, setData] = useState<LiveSentiment>(fallback)
  const [live, setLive] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const res = await fetch('https://api.alternative.me/fng/?limit=1')
        const json = await res.json()
        const entry = json?.data?.[0]
        if (!cancelled && entry) {
          setData({ value: Number(entry.value), label: classifyFng(entry.value_classification) })
          setLive(true)
        }
      } catch {
        // se mantiene el ultimo valor conocido (fallback ilustrativo si nunca cargó)
      }
    }

    load()
    const id = setInterval(load, 15 * 60 * 1000)
    return () => {
      cancelled = true
      clearInterval(id)
    }
  }, [])

  return { data, live }
}

function scoreToLabel(score: number) {
  if (score >= 80) return 'Extreme Greed'
  if (score >= 60) return 'Greed'
  if (score >= 40) return 'Neutral'
  if (score >= 20) return 'Fear'
  return 'Extreme Fear'
}

const TWELVEDATA_API_KEY = import.meta.env.VITE_TWELVEDATA_API_KEY as string | undefined

function useWallStreetSentiment(fallback: LiveSentiment) {
  const [data, setData] = useState<LiveSentiment>(fallback)
  const [live, setLive] = useState(false)

  useEffect(() => {
    if (!TWELVEDATA_API_KEY) return
    let cancelled = false

    async function load() {
      try {
        // VIXY (ETF de futuros VIX corto plazo) como proxy de volatilidad — la Basic plan de
        // Twelve Data no incluye el índice VIX directo. Score = posición del precio actual dentro
        // de su rango de 52 semanas (cerca del mínimo = calma/greed, cerca del máximo = pánico/fear).
        const res = await fetch(`https://api.twelvedata.com/quote?symbol=VIXY&apikey=${TWELVEDATA_API_KEY}`)
        const json = await res.json()
        const close = Number(json?.close)
        const low = Number(json?.fifty_two_week?.low)
        const high = Number(json?.fifty_two_week?.high)
        if (!cancelled && Number.isFinite(close) && Number.isFinite(low) && Number.isFinite(high) && high > low) {
          const position = (close - low) / (high - low)
          const score = Math.round(Math.max(0, Math.min(1, 1 - position)) * 100)
          setData({ value: score, label: scoreToLabel(score) })
          setLive(true)
        }
      } catch {
        // se mantiene el ultimo valor conocido (fallback ilustrativo si nunca cargó)
      }
    }

    load()
    const id = setInterval(load, 15 * 60 * 1000)
    return () => {
      cancelled = true
      clearInterval(id)
    }
  }, [])

  return { data, live }
}

function sentimentStyle(label: string) {
  if (label.includes('Extreme Greed')) return { text: '#5FE6AE', bg: 'rgba(95,230,174,0.18)', border: 'rgba(95,230,174,0.45)' }
  if (label.includes('Greed')) return { text: '#5FE6AE', bg: 'rgba(95,230,174,0.10)', border: 'rgba(95,230,174,0.28)' }
  if (label.includes('Extreme Fear')) return { text: '#FF6B6B', bg: 'rgba(255,107,107,0.18)', border: 'rgba(255,107,107,0.45)' }
  if (label.includes('Fear')) return { text: '#FF6B6B', bg: 'rgba(255,107,107,0.10)', border: 'rgba(255,107,107,0.28)' }
  return { text: '#F2FBF7', bg: 'rgba(127,163,150,0.10)', border: 'rgba(127,163,150,0.28)' }
}

const NEWS_CATEGORIES: { key: 'finanzas' | 'economia' | 'tecnologia' | 'politica' | 'crypto'; label: string; style: string }[] = [
  { key: 'finanzas', label: 'Finanzas', style: 'border-ivory/25 text-ivory/80' },
  { key: 'economia', label: 'Economía', style: 'border-beige/30 text-beige/80' },
  { key: 'tecnologia', label: 'Tecnología', style: 'border-beige/20 text-beige/60' },
  { key: 'politica', label: 'Política', style: 'border-beige/15 text-beige/45' },
  { key: 'crypto', label: 'Crypto', style: 'border-moss/40 text-moss' },
]

const latestHeadlines = NEWS_CATEGORIES.map((c) => {
  const item = (newsData.categories as Record<string, { title: string; url: string }[]>)[c.key]?.[0]
  return item ? { ...item, category: c } : null
}).filter((x): x is { title: string; url: string; category: (typeof NEWS_CATEGORIES)[number] } => x !== null)

export default function General() {
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  const { data: cryptoFng, live: cryptoLive } = useCryptoFearGreed(FEAR_GREED.crypto)
  const { data: wsSentiment, live: wsLive } = useWallStreetSentiment(FEAR_GREED.traditional)
  const mcLive = useMcLive()

  // Historial real de las ultimas 5 confluencias LISTO (signal-desk las agrega en
  // el momento en que se disparan) -- mas reciente primero, FIFO de 5.
  const activeSignals = [...(mcLive?.history ?? [])].reverse()

  const todayChile = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Santiago' }).format(now)

  const mag7ByDate = new Map(
    earningsData.days
      .map((day) => [day.date, day.events.filter((e) => isMag7(e.ticker))] as const)
      .filter(([, events]) => events.length > 0),
  )
  const calendarByDate = new Map(CALENDAR_WEEK.map((d) => [d.date, d]))
  const earningsLabelByDate = new Map(earningsData.days.map((d) => [d.date, d.label]))

  const upcomingDates = [...new Set([...CALENDAR_WEEK.map((d) => d.date), ...mag7ByDate.keys()])]
    .filter((d) => d >= todayChile)
    .sort()
    .slice(0, 4)

  const upcomingDays = upcomingDates.map((date) => ({
    date,
    label: calendarByDate.get(date)?.label ?? earningsLabelByDate.get(date) ?? date,
    events: calendarByDate.get(date)?.events ?? [],
    mag7: mag7ByDate.get(date) ?? [],
  }))

  return (
    <PageShell>
      {/* Barra de sesiones + sentimiento */}
      <div className="liquid-glass mb-6 flex flex-wrap items-center gap-x-8 gap-y-3 rounded-xl px-5 py-3.5">
        <div className="flex flex-wrap items-center gap-5">
          {SESSIONS.map((s) => {
            const open = isSessionOpen(now, s)
            return (
              <div key={s.label} className="flex items-center gap-2">
                <span
                  className="h-2 w-2 flex-shrink-0 rounded-full"
                  style={{
                    background: open ? '#5FE6AE' : '#4B5A54',
                    boxShadow: open ? '0 0 6px 1px rgba(95,230,174,0.7)' : 'none',
                  }}
                />
                <img
                  src={`https://flagcdn.com/w40/${s.countryCode}.png`}
                  alt={s.label}
                  title={s.label}
                  className="h-3.5 w-5 flex-shrink-0 rounded-[2px] object-cover"
                />
                <span className="font-mono text-xs tabular-nums text-beige/60">
                  {now.toLocaleTimeString('es-CL', { timeZone: s.tz, hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            )
          })}
        </div>

        <div className="ml-auto flex flex-wrap items-center gap-3">
          {(
            [
              { key: 'WS', ...wsSentiment, live: wsLive },
              { key: 'Crypto', ...cryptoFng, live: cryptoLive },
            ] as const
          ).map((s) => {
            const c = sentimentStyle(s.label)
            return (
              <div
                key={s.key}
                className="flex items-center gap-2.5 rounded-lg px-4 py-2"
                style={{ background: c.bg, border: `1px solid ${c.border}` }}
              >
                <span className="flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wide text-beige/60">
                  {s.live && (
                    <span
                      className="h-1.5 w-1.5 rounded-full"
                      style={{ background: '#5FE6AE', boxShadow: '0 0 5px 1px rgba(95,230,174,0.7)' }}
                      title="Dato en vivo"
                    />
                  )}
                  {s.key}
                </span>
                <span className="font-mono text-xl font-bold tabular-nums" style={{ color: c.text }}>
                  {s.value}
                </span>
                <span className="text-xs font-semibold" style={{ color: c.text }}>
                  {s.label}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      <div className="mb-6">
        <h1 className="text-2xl font-normal md:text-3xl" style={{ letterSpacing: '-0.03em' }}>
          General
        </h1>
        <p className="mt-1 text-sm text-beige/70">Resumen del mercado &middot; sesiones, señales, agenda y flujos en un solo vistazo</p>
      </div>

      {/* Zona central: Monte Carlo (70%) + ETF Flows (30%) */}
      <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-[7fr_3fr]">
        <div className="liquid-glass rounded-xl px-5 py-4">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-logo text-sm uppercase text-ivory" style={{ letterSpacing: '0.12em' }}>
              Monte Carlo &middot; Señales activas
            </h2>
            <Link to="/monte-carlo" className="text-xs font-medium text-beige/60 transition-colors hover:text-ivory">
              Ver dashboard completo &rarr;
            </Link>
          </div>

          {activeSignals.length === 0 ? (
            <p className="py-6 text-center text-sm text-beige/50">Sin señales activas en este momento.</p>
          ) : (
            <div className="flex flex-col gap-1">
              {activeSignals.map((row, i) => {
                const dotColor = row.signal === 'bull' ? '#5FE6AE' : '#FF6B6B'
                const sigLabel = row.signal === 'bull' ? 'TouchBull' : 'TouchBear'
                return (
                  <div
                    key={`${row.ticker}-${row.tf}-${row.ts}-${i}`}
                    className="flex items-center justify-between gap-3 rounded-lg bg-moss/[0.08] px-2.5 py-2"
                  >
                    <div className="flex items-center gap-2.5">
                      <img
                        src={ASSET_ICON[row.ticker]}
                        alt=""
                        loading="lazy"
                        className="h-6 w-6 flex-shrink-0 rounded-full bg-beige/5 object-cover"
                      />
                      <span className="text-sm font-semibold text-ivory">{TICKER_NAME.get(row.ticker) ?? row.ticker}</span>
                      <span className="font-mono text-[11px] text-beige/40">{row.ticker}</span>
                      <span className="rounded border border-beige/20 px-1.5 py-px font-mono text-[9px] font-bold uppercase text-beige/50">
                        {row.tf}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-[11px] text-beige/40">{formatSignalTime(row.ts)}</span>
                      <span className="rounded border border-moss/40 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-moss">
                        Listo
                      </span>
                      <span
                        className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-md px-2.5 py-1 text-xs font-semibold"
                        style={{
                          background: row.signal === 'bull' ? 'rgba(95,230,174,0.18)' : 'rgba(255,107,107,0.15)',
                          color: dotColor,
                        }}
                      >
                        <span className="h-1.5 w-1.5 rounded-full" style={{ background: dotColor }} />
                        {sigLabel}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        <div className="liquid-glass rounded-xl px-5 py-4">
          <h2 className="mb-4 font-logo text-sm uppercase text-ivory" style={{ letterSpacing: '0.12em' }}>
            ETF Flows &middot; BTC / ETH / SOL
          </h2>
          <div className="flex flex-col gap-4">
            {etfFlowsData.flows.map((f) => {
              const positive = f.netFlow >= 0
              const capRatio = f.capRatio ?? null
              const barWidth = capRatio !== null ? Math.min(100, Math.max(0, capRatio * 100)) : 0
              const pct = f.pctChangeWeek ?? null
              return (
                <div key={f.asset}>
                  <div className="mb-1.5 flex items-center justify-between">
                    <span className="text-sm font-semibold text-ivory">{f.asset}</span>
                    <span className={`font-mono text-sm font-semibold tabular-nums ${positive ? 'text-moss' : 'text-clay'}`}>
                      {moneyShort(f.netFlow)}
                      {pct !== null && (
                        <span className="ml-1.5 text-beige/50">
                          ({pct >= 0 ? '+' : ''}
                          {pct.toFixed(1)}%)
                        </span>
                      )}
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-beige/10" title="Capitalización de mercado actual vs. máximo histórico">
                    <div
                      className="h-1.5 rounded-full"
                      style={{ width: `${barWidth}%`, background: positive ? '#5FE6AE' : '#FF6B6B' }}
                    />
                  </div>
                  {capRatio !== null && (
                    <p className="mt-1 text-[10px] text-beige/40">Cap. vs. máx. histórico: {(capRatio * 100).toFixed(0)}%</p>
                  )}
                </div>
              )
            })}
          </div>
          <p className="mt-4 text-[11px] text-beige/40">
            Flujo neto de los últimos {etfFlowsData.windowDays} días hábiles (variación % vs. hace 7 días) &middot;
            barra = capitalización actual sobre el máximo histórico &middot; actualizado {etfFlowsData.updatedAt}
          </p>
        </div>
      </div>

      {/* Zona inferior: Noticias (50%) + Agenda macro (50%) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="liquid-glass rounded-xl px-5 py-4">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-logo text-sm uppercase text-ivory" style={{ letterSpacing: '0.12em' }}>
              Noticias importantes
            </h2>
            <Link to="/news" className="text-xs font-medium text-beige/60 transition-colors hover:text-ivory">
              Ver todas &rarr;
            </Link>
          </div>
          <div className="flex flex-col gap-3">
            {latestHeadlines.map((n) => (
              <a
                key={n.category.key}
                href={n.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block border-b border-borderSubtle pb-3 transition-colors last:border-b-0 last:pb-0 hover:bg-beige/5"
              >
                <span
                  className={`rounded border px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide ${n.category.style}`}
                >
                  {n.category.label}
                </span>
                <p className="mt-1 text-sm font-medium text-ivory">{n.title}</p>
              </a>
            ))}
          </div>
        </div>

        <div className="liquid-glass rounded-xl px-5 py-4">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-logo text-sm uppercase text-ivory" style={{ letterSpacing: '0.12em' }}>
              Agenda macro
            </h2>
            <Link to="/calendario" className="text-xs font-medium text-beige/60 transition-colors hover:text-ivory">
              Ver todo &rarr;
            </Link>
          </div>
          {upcomingDays.length === 0 ? (
            <p className="py-6 text-center text-sm text-beige/50">Sin eventos de alto impacto el resto de la semana.</p>
          ) : (
            <div className="flex flex-col gap-4">
              {upcomingDays.map((day) => (
                <div key={day.date}>
                  <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-beige/40">{day.label}</p>
                  <div className="flex flex-col gap-2">
                    {day.events.slice(0, 3).map((event, i) => (
                      <div
                        key={i}
                        className="flex items-start justify-between gap-3 border-b border-borderSubtle pb-2 last:border-b-0 last:pb-0"
                      >
                        <div className="flex items-start gap-2">
                          <span className="mt-0.5 font-mono text-[11px] text-beige/50">{event.time}</span>
                          <span className="flex items-center gap-1.5 text-xs font-medium text-ivory">
                            <img
                              src={`https://flagcdn.com/w40/${event.countryFlagCode}.png`}
                              alt=""
                              className="h-3.5 w-5 flex-shrink-0 rounded-[2px] object-cover"
                            />
                            {event.name}
                          </span>
                        </div>
                        <span className="whitespace-nowrap font-mono text-[11px] text-beige/40">prev {event.previous}</span>
                      </div>
                    ))}
                    {day.mag7.map((e, i) => (
                      <div
                        key={`mag7-${i}`}
                        className="flex items-start justify-between gap-3 rounded-md px-2 py-1.5 -mx-2 border-b border-borderSubtle last:border-b-0 last:pb-0"
                        style={{ background: 'rgba(212,175,55,0.08)' }}
                      >
                        <div className="flex items-start gap-2">
                          <span
                            className="mt-0.5 rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide"
                            style={{ background: 'rgba(212,175,55,0.18)', color: GOLD }}
                          >
                            {e.time}
                          </span>
                          <span className="flex items-center gap-1.5 text-xs font-semibold" style={{ color: GOLD }}>
                            {e.name}
                            <span className="font-mono text-[10px] text-beige/50">{e.ticker}</span>
                          </span>
                        </div>
                        <span
                          className="whitespace-nowrap rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide"
                          style={{ background: 'rgba(212,175,55,0.18)', color: GOLD }}
                        >
                          Mag 7
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <p className="mt-6 text-[11px] text-beige/40">
        Sesiones, Fear &amp; Greed Crypto (alternative.me), WS (proxy VIXY vs. rango 52 semanas, Twelve Data), noticias
        (CNBC / Cointelegraph, actualizado {newsData.updatedAt} hrs Chile) y ETF flows (Farside Investors, actualizado{' '}
        {etfFlowsData.updatedAt}) en tiempo real &middot; agenda macro con fuente {CALENDAR_SOURCE.provider}
      </p>
    </PageShell>
  )
}
