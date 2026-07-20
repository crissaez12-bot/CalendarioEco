import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import PageShell from '../components/PageShell'
import { ASSET_ICON, DATA, isReady } from '../data/monteCarloData'
import { CALENDAR_SOURCE, CALENDAR_WEEK } from '../data/calendarData'
import { ETF_FLOWS, FEAR_GREED, NEWS_HEADLINES } from '../data/generalData'

interface SessionDef {
  code: string
  label: string
  tz: string
  openUTC: number
  closeUTC: number
}

const SESSIONS: SessionDef[] = [
  { code: 'NY', label: 'Nueva York', tz: 'America/New_York', openUTC: 13, closeUTC: 21 },
  { code: 'LDN', label: 'Londres', tz: 'Europe/London', openUTC: 8, closeUTC: 16 },
  { code: 'ASIA', label: 'Tokio', tz: 'Asia/Tokyo', openUTC: 0, closeUTC: 9 },
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

const TAG_STYLES: Record<string, string> = {
  Política: 'border-beige/25 text-beige/70',
  Bolsa: 'border-ivory/25 text-ivory/80',
  Cripto: 'border-moss/40 text-moss',
}

export default function General() {
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  const activeSignals = DATA['1h']
    .filter((r) => r.signal !== 'none')
    .sort((a, b) => Number(isReady(b)) - Number(isReady(a)))
    .slice(0, 5)

  const agendaDay = CALENDAR_WEEK[0]

  return (
    <PageShell>
      {/* Barra de sesiones + sentimiento */}
      <div className="liquid-glass mb-6 flex flex-wrap items-center gap-x-8 gap-y-3 rounded-xl px-5 py-3">
        <div className="flex flex-wrap items-center gap-5">
          {SESSIONS.map((s) => {
            const open = isSessionOpen(now, s)
            return (
              <div key={s.code} className="flex items-center gap-2">
                <span
                  className="h-2 w-2 flex-shrink-0 rounded-full"
                  style={{
                    background: open ? '#5FE6AE' : '#4B5A54',
                    boxShadow: open ? '0 0 6px 1px rgba(95,230,174,0.7)' : 'none',
                  }}
                />
                <span className="font-mono text-xs font-semibold uppercase tracking-wide text-ivory">{s.code}</span>
                <span className="font-mono text-xs tabular-nums text-beige/60">
                  {now.toLocaleTimeString('es-CL', { timeZone: s.tz, hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            )
          })}
        </div>

        <div className="ml-auto flex flex-wrap items-center gap-5 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="uppercase tracking-wide text-beige/50">Trad:</span>
            <span className="font-mono font-semibold text-ivory">{FEAR_GREED.traditional.value}</span>
            <span className="text-beige/60">{FEAR_GREED.traditional.label}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="uppercase tracking-wide text-beige/50">Cripto:</span>
            <span className="font-mono font-semibold text-moss">{FEAR_GREED.crypto.value}</span>
            <span className="text-beige/60">{FEAR_GREED.crypto.label}</span>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h1 className="text-2xl font-normal md:text-3xl" style={{ letterSpacing: '-0.03em' }}>
          General
        </h1>
        <p className="mt-1 text-sm text-beige/70">Resumen del mercado &middot; sesiones, señales, agenda y flujos en un solo vistazo</p>
      </div>

      {/* Zona central: Monte Carlo (70%) + Hoy (30%) */}
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
              {activeSignals.map((row) => {
                const ready = isReady(row)
                const dotColor = row.signal === 'bull' ? '#5FE6AE' : '#FF6B6B'
                const sigLabel = row.signal === 'bull' ? 'TouchBull' : 'TouchBear'
                return (
                  <div
                    key={row.ticker}
                    className={`flex items-center justify-between gap-3 rounded-lg px-2.5 py-2 ${ready ? 'bg-moss/[0.08]' : ''}`}
                  >
                    <div className="flex items-center gap-2.5">
                      <img
                        src={ASSET_ICON[row.ticker]}
                        alt=""
                        loading="lazy"
                        className="h-6 w-6 flex-shrink-0 rounded-full bg-beige/5 object-cover"
                      />
                      <span className="text-sm font-semibold text-ivory">{row.name}</span>
                      <span className="font-mono text-[11px] text-beige/40">{row.ticker}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      {ready && (
                        <span className="rounded border border-moss/40 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-moss">
                          Listo
                        </span>
                      )}
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
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-logo text-sm uppercase text-ivory" style={{ letterSpacing: '0.12em' }}>
              Agenda macro
            </h2>
            <Link to="/calendario" className="text-xs font-medium text-beige/60 transition-colors hover:text-ivory">
              Ver todo &rarr;
            </Link>
          </div>
          <p className="mb-3 text-[11px] text-beige/40">{agendaDay.label}</p>
          <div className="flex flex-col gap-3">
            {agendaDay.events.slice(0, 5).map((event, i) => (
              <div key={i} className="flex items-start justify-between gap-3 border-b border-beige/5 pb-3 last:border-b-0 last:pb-0">
                <div className="flex items-start gap-2">
                  <span className="mt-0.5 font-mono text-[11px] text-beige/50">{event.time}</span>
                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-medium text-ivory">
                      <span>{event.countryFlag}</span>
                      {event.name}
                    </div>
                  </div>
                </div>
                <span className="whitespace-nowrap font-mono text-[11px] text-beige/40">prev {event.previous}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Zona inferior: Noticias (50%) + ETF Flows (50%) */}
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
            {NEWS_HEADLINES.map((n, i) => (
              <div key={i} className="border-b border-beige/5 pb-3 last:border-b-0 last:pb-0">
                <div className="flex items-center gap-2">
                  <span className={`rounded border px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide ${TAG_STYLES[n.tag]}`}>
                    {n.tag}
                  </span>
                  <span className="text-[11px] text-beige/40">
                    {n.source} &middot; {n.timeAgo}
                  </span>
                </div>
                <p className="mt-1 text-sm font-medium text-ivory">{n.title}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="liquid-glass rounded-xl px-5 py-4">
          <h2 className="mb-4 font-logo text-sm uppercase text-ivory" style={{ letterSpacing: '0.12em' }}>
            ETF Flows &middot; BTC / ETH
          </h2>
          <div className="flex flex-col gap-4">
            {ETF_FLOWS.map((f) => {
              const positive = f.netFlow >= 0
              const width = Math.min(100, (Math.abs(f.netFlow) / 300_000_000) * 100)
              return (
                <div key={f.asset}>
                  <div className="mb-1.5 flex items-center justify-between">
                    <span className="text-sm font-semibold text-ivory">{f.asset}</span>
                    <span className={`font-mono text-sm font-semibold tabular-nums ${positive ? 'text-moss' : 'text-clay'}`}>
                      {moneyShort(f.netFlow)}
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-beige/10">
                    <div
                      className="h-1.5 rounded-full"
                      style={{ width: `${width}%`, background: positive ? '#5FE6AE' : '#FF6B6B' }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
          <p className="mt-4 text-[11px] text-beige/40">Flujo neto diario &middot; datos ilustrativos al {ETF_FLOWS[0].updated}</p>
        </div>
      </div>

      <p className="mt-6 text-[11px] text-beige/40">
        Sesiones calculadas en tiempo real &middot; Fear &amp; Greed, noticias y ETF flows son datos ilustrativos capturados el{' '}
        {FEAR_GREED.capturedAt} &middot; agenda macro con fuente {CALENDAR_SOURCE.provider}
      </p>
    </PageShell>
  )
}
