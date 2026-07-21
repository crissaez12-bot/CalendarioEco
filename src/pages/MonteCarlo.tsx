import { useMemo, useState } from 'react'
import PageShell from '../components/PageShell'
import AssetDrawer from '../components/AssetDrawer'
import { ASSET_ICON, ATR_THRESHOLD, DATA, isReady, pctB, type AssetRow, type Timeframe } from '../data/monteCarloData'
import { useBtcTrend, formatUpdated } from '../data/btcTrend'

type SortKey = 'name' | 'signal' | 'osc' | 'atr'
type TierFilter = 'all' | '1' | '2' | '3'

const money = (n: number) => (n >= 100 ? n.toFixed(0) : n.toFixed(4))

const TIER_STYLES: Record<AssetRow['tier'], string> = {
  1: 'bg-moss/20 text-moss',
  2: 'border border-beige/15 text-beige/60',
  3: 'bg-clay/25 text-clay',
}

export default function MonteCarlo() {
  const [tf, setTf] = useState<Timeframe>('1h')
  const [tier, setTier] = useState<TierFilter>('all')
  const [sortKey, setSortKey] = useState<SortKey>('name')
  const [sortDir, setSortDir] = useState<1 | -1>(1)
  const [selectedTicker, setSelectedTicker] = useState<string | null>(null)
  const { trend: btcTrend, updated: btcTrendUpdated } = useBtcTrend()

  const rows = useMemo(() => {
    let list = DATA[tf].filter((r) => tier === 'all' || String(r.tier) === tier)
    list = [...list].sort((a, b) => {
      let av: string | number = a.name
      let bv: string | number = b.name
      if (sortKey === 'signal') {
        av = a.signal
        bv = b.signal
      } else if (sortKey === 'osc') {
        av = a.osc
        bv = b.osc
      } else if (sortKey === 'atr') {
        av = a.atr
        bv = b.atr
      }
      if (av < bv) return -1 * sortDir
      if (av > bv) return 1 * sortDir
      return 0
    })
    return list
  }, [tf, tier, sortKey, sortDir])

  const readyRows = rows.filter(isReady)
  const signalOnly = rows.filter((r) => r.signal !== 'none' && !isReady(r))
  const lowAtr = rows.filter((r) => r.atr < ATR_THRESHOLD)

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === 1 ? -1 : 1))
    } else {
      setSortKey(key)
      setSortDir(1)
    }
  }

  return (
    <PageShell>
      <div className="mb-6">
        <h1 className="text-2xl font-normal md:text-3xl" style={{ letterSpacing: '-0.03em' }}>
          Monte Carlo Strategy V2
        </h1>
        <p className="mt-1 text-sm text-beige/70">
          BB + PunkAlgo + Oscilador + ATR &middot; v2: salida con protección a mitad de banda &middot; solo
          activos con win rate &ge;70% (distinto en 1H y 15M, cada uno con su propia ficha) &middot; tabla
          con datos ilustrativos (aún no conectada al motor CDP/exchange), fichas basadas en backtest real.
        </p>
      </div>

      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="liquid-glass flex items-center gap-3 rounded-xl px-4 py-2.5">
          <img src={ASSET_ICON.BTC} alt="" className="h-6 w-6 flex-shrink-0 rounded-full bg-beige/5 object-cover" />
          <div>
            <div className="text-[10px] uppercase tracking-wider text-beige/50">Tendencia BTC</div>
            <div className="text-[10px] text-beige/30">
              media (SMA20) 3 velas &middot; {btcTrend ? formatUpdated(btcTrendUpdated) : 'cargando…'}
            </div>
          </div>
          <div className="flex gap-1.5">
            {(['1D', '4H', '1H'] as const).map((tf) => {
              const value = btcTrend?.[tf] ?? null
              return (
                <div
                  key={tf}
                  title={
                    value === null
                      ? 'Sin datos todavía'
                      : value === 'bull'
                        ? 'Media subiendo — contexto alcista'
                        : 'Media bajando — contexto bajista'
                  }
                  className={`rounded-md px-2.5 py-1 text-xs font-bold ${
                    value === null
                      ? 'bg-beige/10 text-beige/40'
                      : value === 'bull'
                        ? 'bg-moss/20 text-moss'
                        : 'bg-clay/25 text-clay'
                  }`}
                >
                  {tf}
                </div>
              )
            })}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="liquid-glass flex rounded-lg p-1">
            {(['1h', '15m'] as Timeframe[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTf(t)}
                className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${
                  tf === t ? 'bg-ivory text-navy' : 'text-beige/60 hover:text-ivory'
                }`}
              >
                {t.toUpperCase()}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            {(['all', '1', '2', '3'] as TierFilter[]).map((tOpt) => (
              <button
                key={tOpt}
                type="button"
                onClick={() => setTier(tOpt)}
                className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                  tier === tOpt
                    ? 'border-beige/50 bg-beige/10 text-ivory'
                    : 'border-beige/15 text-beige/50 hover:text-beige'
                }`}
              >
                {tOpt === 'all' ? 'Todos' : `Nivel ${tOpt}`}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4">
        <div className="liquid-glass rounded-xl px-4 py-3">
          <div className="text-[11px] uppercase tracking-wider text-beige/50">Confluencia completa</div>
          <div className="font-mono text-xl font-semibold tabular-nums text-moss">{readyRows.length}</div>
        </div>
        <div className="liquid-glass rounded-xl px-4 py-3">
          <div className="text-[11px] uppercase tracking-wider text-beige/50">Señal activa (sin confirmar)</div>
          <div className="font-mono text-xl font-semibold tabular-nums text-ivory">{signalOnly.length}</div>
        </div>
        <div className="liquid-glass rounded-xl px-4 py-3">
          <div className="text-[11px] uppercase tracking-wider text-beige/50">ATR insuficiente</div>
          <div className="font-mono text-xl font-semibold tabular-nums text-ivory">{lowAtr.length}</div>
        </div>
        <div className="liquid-glass rounded-xl px-4 py-3">
          <div className="text-[11px] uppercase tracking-wider text-beige/50">Activos monitoreados</div>
          <div className="font-mono text-xl font-semibold tabular-nums text-ivory">{rows.length}</div>
        </div>
      </div>

      <div className="liquid-glass overflow-x-auto rounded-xl">
        <table className="w-full min-w-[860px] border-collapse">
          <thead>
            <tr className="border-b border-beige/10 bg-beige/5">
              <Th label="Activo" sortKey="name" active={sortKey === 'name'} dir={sortDir} onClick={toggleSort} />
              <th className="whitespace-nowrap px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-beige/50">
                Bollinger Bands
              </th>
              <Th label="Señal PunkAlgo" sortKey="signal" active={sortKey === 'signal'} dir={sortDir} onClick={toggleSort} />
              <Th label="Oscilador" sortKey="osc" active={sortKey === 'osc'} dir={sortDir} onClick={toggleSort} />
              <Th label="ATR" sortKey="atr" active={sortKey === 'atr'} dir={sortDir} onClick={toggleSort} />
              <th className="whitespace-nowrap px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-beige/50">
                Actualizado
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const ready = isReady(row)
              const p = Math.max(0, Math.min(1, pctB(row)))
              const atrOk = row.atr >= ATR_THRESHOLD
              const dotColor = row.signal === 'bull' ? '#5FE6AE' : row.signal === 'bear' ? '#FF6B6B' : '#7FA396'
              const sigLabel = row.signal === 'bull' ? 'TouchBull' : row.signal === 'bear' ? 'TouchBear' : 'Sin señal'

              return (
                <tr
                  key={row.ticker}
                  tabIndex={0}
                  role="button"
                  onClick={() => setSelectedTicker(row.ticker)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      setSelectedTicker(row.ticker)
                    }
                  }}
                  className={`cursor-pointer border-b border-borderSubtle last:border-b-0 hover:bg-beige/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-beige/60 ${
                    ready ? 'bg-moss/[0.08]' : ''
                  }`}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={ASSET_ICON[row.ticker]}
                        alt=""
                        loading="lazy"
                        className="h-7 w-7 flex-shrink-0 rounded-full bg-beige/5 object-cover"
                      />
                      <div>
                        <div className="flex items-center gap-2 text-sm font-semibold text-ivory">
                          {row.name}
                          {ready && (
                            <span className="rounded border border-moss/40 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-moss">
                              Listo
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5 font-mono text-[11px] text-beige/50">
                          {row.ticker}
                          <span
                            className={`rounded px-1.5 py-px text-[10px] font-bold ${TIER_STYLES[row.tier]}`}
                          >
                            Nivel {row.tier}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex min-w-[150px] flex-col gap-1.5">
                      <div className="flex flex-col font-mono text-[11.5px] leading-relaxed text-beige/60">
                        <span>{money(row.upper)}</span>
                        <span className="font-semibold text-ivory">{money(row.basis)}</span>
                        <span>{money(row.lower)}</span>
                      </div>
                      <div className="relative h-[5px] rounded-full bg-beige/10">
                        <div
                          className="absolute top-1/2 h-2 w-2 -translate-y-1/2 rounded-full border-2 border-navy"
                          style={{ left: `${(p * 100).toFixed(1)}%`, background: dotColor }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-md px-2.5 py-1 text-xs font-semibold"
                      style={{
                        background:
                          row.signal === 'bull'
                            ? 'rgba(95,230,174,0.18)'
                            : row.signal === 'bear'
                              ? 'rgba(255,107,107,0.15)'
                              : 'rgba(127,163,150,0.12)',
                        color: dotColor,
                      }}
                    >
                      <span className="h-1.5 w-1.5 rounded-full" style={{ background: dotColor }} />
                      {sigLabel}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex min-w-[108px] flex-col gap-0.5">
                      <span className="font-mono text-sm font-semibold tabular-nums text-ivory">{row.osc.toFixed(1)}</span>
                      <span className={`text-[11px] ${row.oscConfirm ? 'text-moss' : 'text-beige/40'}`}>
                        {row.oscConfirm ? '✓ confirma cruce' : 'sin confirmar'}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex min-w-[96px] flex-col gap-1.5">
                      <span className="font-mono text-sm font-semibold tabular-nums text-ivory">{row.atr.toFixed(2)}%</span>
                      <span
                        className={`w-fit rounded px-2 py-0.5 text-[10.5px] font-bold uppercase tracking-wide ${
                          atrOk ? 'bg-moss/15 text-moss' : 'bg-beige/5 text-beige/40'
                        }`}
                      >
                        {atrOk ? 'Operable' : 'Insuficiente'}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-mono text-[11px] text-beige/40">{row.updated}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-[11px] text-beige/40">
        Umbral de operabilidad: ATR(14)/precio &ge; 0.3&ndash;0.5% &middot; fila resaltada = confluencia (señal +
        confirmación de oscilador + ATR suficiente) &middot; click en un activo para ver la ficha
      </p>

      <AssetDrawer ticker={selectedTicker} timeframe={tf} onClose={() => setSelectedTicker(null)} />
    </PageShell>
  )
}

interface ThProps {
  label: string
  sortKey: SortKey
  active: boolean
  dir: 1 | -1
  onClick: (key: SortKey) => void
}

function Th({ label, sortKey, active, dir, onClick }: ThProps) {
  return (
    <th
      onClick={() => onClick(sortKey)}
      className="cursor-pointer select-none whitespace-nowrap px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-beige/50 hover:text-beige"
    >
      {label} <span className={active ? 'text-ivory' : 'opacity-40'}>{dir === 1 ? '▲' : '▼'}</span>
    </th>
  )
}
