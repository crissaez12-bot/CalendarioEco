import { useMemo, useState } from 'react'
import PageShell from '../components/PageShell'
import { ASSET_ICON, DATA, type Timeframe } from '../data/monteCarloData'
import { useMcLive } from '../data/mcLive'

const TICKER_NAME = new Map([...DATA['1h'], ...DATA['15m']].map((r) => [r.ticker, r.name]))

type SignalFilter = 'all' | 'bull' | 'bear'
type TfFilter = 'all' | Timeframe

function formatDateTime(ts: number) {
  return new Date(ts * 1000).toLocaleString('es-CL', {
    timeZone: 'America/Santiago',
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function MonteCarloHistorial() {
  const mcLive = useMcLive()
  const [ticker, setTicker] = useState('all')
  const [signal, setSignal] = useState<SignalFilter>('all')
  const [tf, setTf] = useState<TfFilter>('all')

  const history = useMemo(() => [...(mcLive?.history ?? [])].reverse(), [mcLive])

  const tickers = useMemo(() => [...new Set(history.map((h) => h.ticker))].sort(), [history])

  const filtered = history.filter(
    (h) => (ticker === 'all' || h.ticker === ticker) && (signal === 'all' || h.signal === signal) && (tf === 'all' || h.tf === tf),
  )

  return (
    <PageShell>
      <div className="mb-6">
        <h1 className="text-2xl font-normal md:text-3xl" style={{ letterSpacing: '-0.03em' }}>
          Historial Monte Carlo
        </h1>
        <p className="mt-1 text-sm text-beige/70">
          Todas las confluencias LISTO reales de los últimos 7 días &middot; se arma solo con eventos de las alertas
          conectadas, sin límite de cantidad dentro de la ventana.
        </p>
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <select
          value={ticker}
          onChange={(e) => setTicker(e.target.value)}
          className="liquid-glass rounded-lg px-3 py-2 text-sm text-ivory outline-none"
        >
          <option value="all">Todos los activos</option>
          {tickers.map((t) => (
            <option key={t} value={t}>
              {TICKER_NAME.get(t) ?? t} ({t})
            </option>
          ))}
        </select>

        <div className="liquid-glass flex rounded-lg p-1">
          {(['all', 'bull', 'bear'] as SignalFilter[]).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSignal(s)}
              className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${
                signal === s ? 'bg-ivory text-navy' : 'text-beige/60 hover:text-ivory'
              }`}
            >
              {s === 'all' ? 'Todas' : s === 'bull' ? 'TouchBull' : 'TouchBear'}
            </button>
          ))}
        </div>

        <div className="liquid-glass flex rounded-lg p-1">
          {(['all', '1h', '15m'] as TfFilter[]).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTf(t)}
              className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${
                tf === t ? 'bg-ivory text-navy' : 'text-beige/60 hover:text-ivory'
              }`}
            >
              {t === 'all' ? 'Todas' : t.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="liquid-glass rounded-xl px-4 py-3">
        <div className="mb-3 text-[11px] uppercase tracking-wider text-beige/50">
          {filtered.length} señal{filtered.length === 1 ? '' : 'es'}
        </div>

        {filtered.length === 0 ? (
          <p className="py-6 text-center text-sm text-beige/50">No hay señales que coincidan con el filtro.</p>
        ) : (
          <div className="flex flex-col gap-1">
            {filtered.map((h, i) => {
              const bull = h.signal === 'bull'
              const dotColor = bull ? '#5FE6AE' : '#FF6B6B'
              return (
                <div
                  key={`${h.ticker}-${h.tf}-${h.ts}-${i}`}
                  className="flex items-center justify-between gap-3 rounded-lg bg-bgCard px-2.5 py-2"
                >
                  <div className="flex items-center gap-2.5">
                    <img
                      src={ASSET_ICON[h.ticker]}
                      alt=""
                      loading="lazy"
                      className="h-6 w-6 flex-shrink-0 rounded-full bg-beige/5 object-cover"
                    />
                    <span className="text-sm font-semibold text-ivory">{TICKER_NAME.get(h.ticker) ?? h.ticker}</span>
                    <span className="font-mono text-[11px] text-beige/40">{h.ticker}</span>
                    <span className="rounded border border-beige/20 px-1.5 py-px font-mono text-[9px] font-bold uppercase text-beige/50">
                      {h.tf}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-[11px] text-beige/40">{formatDateTime(h.ts)}</span>
                    <span
                      className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-md px-2.5 py-1 text-xs font-semibold"
                      style={{ background: bull ? 'rgba(95,230,174,0.18)' : 'rgba(255,107,107,0.15)', color: dotColor }}
                    >
                      <span className="h-1.5 w-1.5 rounded-full" style={{ background: dotColor }} />
                      {bull ? 'TouchBull' : 'TouchBear'}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </PageShell>
  )
}
