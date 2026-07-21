import { useEffect, useMemo, useState } from 'react'
import PageShell from '../components/PageShell'
import EquityChart from '../components/EquityChart'
import {
  buildEquityCurve,
  computeStats,
  formatFecha,
  formatMonth,
  groupByMonth,
  useOperaciones,
  type Trade,
} from '../data/operacionesData'

type DirFilter = 'all' | 'long' | 'short'

const SKELETON_MS = 200

function useDebouncedFlag(deps: unknown[], ms: number) {
  const [flag, setFlag] = useState(false)
  useEffect(() => {
    setFlag(true)
    const id = setTimeout(() => setFlag(false), ms)
    return () => clearTimeout(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
  return flag
}

function StatCard({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="liquid-glass rounded-xl px-5 py-4">
      <div className="text-[11px] uppercase tracking-wider text-beige/50">{label}</div>
      <div className="mt-1.5">{children}</div>
    </div>
  )
}

function SkeletonBlock({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse rounded-lg bg-beige/10 ${className}`} />
}

export default function Operaciones() {
  const { trades: allTrades, loading, error } = useOperaciones()
  const [simbolo, setSimbolo] = useState('all')
  const [direccion, setDireccion] = useState<DirFilter>('all')
  const [desde, setDesde] = useState('')
  const [hasta, setHasta] = useState('')

  const filtering = useDebouncedFlag([simbolo, direccion, desde, hasta], SKELETON_MS)

  const simbolos = useMemo(() => {
    if (!allTrades) return []
    return [...new Set(allTrades.map((t) => t.simbolo))].sort()
  }, [allTrades])

  const trades = useMemo<Trade[]>(() => {
    if (!allTrades) return []
    return allTrades.filter((t) => {
      if (simbolo !== 'all' && t.simbolo !== simbolo) return false
      if (direccion !== 'all' && t.direccion !== direccion) return false
      if (desde && t.fecha < desde) return false
      if (hasta && t.fecha > hasta) return false
      return true
    })
  }, [allTrades, simbolo, direccion, desde, hasta])

  const stats = useMemo(() => computeStats(trades), [trades])
  const equity = useMemo(() => buildEquityCurve(trades), [trades])
  const months = useMemo(() => groupByMonth(trades), [trades])
  const recentTrades = useMemo(() => [...trades].sort((a, b) => b.fecha.localeCompare(a.fecha)), [trades])

  const showSkeleton = loading || filtering
  const hasData = !loading && (allTrades?.length ?? 0) > 0

  return (
    <PageShell>
      <div className="mb-6">
        <h1 className="text-2xl font-normal md:text-3xl" style={{ letterSpacing: '-0.03em' }}>
          Operaciones
        </h1>
        <p className="mt-1 text-sm text-beige/70">
          Bitácora de trades reales &middot; se alimenta de tu Google Sheet, se actualiza sola cada vez que
          cargás una operación.
        </p>
      </div>

      {/* Nivel 1 — filtros globales, sticky */}
      <div className="liquid-glass sticky top-3 z-20 mb-6 flex flex-wrap items-center gap-4 rounded-xl px-4 py-3">
        <FilterSelect
          label="Activo"
          value={simbolo}
          onChange={setSimbolo}
          options={[{ value: 'all', label: 'Todos' }, ...simbolos.map((s) => ({ value: s, label: s }))]}
        />
        <FilterSelect
          label="Dirección"
          value={direccion}
          onChange={(v) => setDireccion(v as DirFilter)}
          options={[
            { value: 'all', label: 'Todas' },
            { value: 'long', label: 'Long' },
            { value: 'short', label: 'Short' },
          ]}
        />
        <div className="flex items-center gap-2">
          <span className="text-[11px] uppercase tracking-wider text-beige/50">Desde</span>
          <input
            type="date"
            value={desde}
            onChange={(e) => setDesde(e.target.value)}
            className="rounded-md border border-beige/15 bg-transparent px-2 py-1 text-xs text-ivory outline-none focus:border-beige/40"
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] uppercase tracking-wider text-beige/50">Hasta</span>
          <input
            type="date"
            value={hasta}
            onChange={(e) => setHasta(e.target.value)}
            className="rounded-md border border-beige/15 bg-transparent px-2 py-1 text-xs text-ivory outline-none focus:border-beige/40"
          />
        </div>
        {(simbolo !== 'all' || direccion !== 'all' || desde || hasta) && (
          <button
            type="button"
            onClick={() => {
              setSimbolo('all')
              setDireccion('all')
              setDesde('')
              setHasta('')
            }}
            className="ml-auto text-xs text-beige/50 underline decoration-beige/30 underline-offset-2 hover:text-beige"
          >
            Limpiar filtros
          </button>
        )}
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-clay/30 bg-clay/10 px-4 py-3 text-sm text-clay">{error}</div>
      )}

      {!loading && !hasData && !error && (
        <div className="liquid-glass mb-6 rounded-xl px-6 py-10 text-center">
          <div className="text-sm text-beige/60">
            Todavía no hay operaciones cargadas. Agregá filas en tu bitácora de Google Sheets y esta página se
            actualiza sola (revisa cada 5 minutos).
          </div>
        </div>
      )}

      {/* Nivel 2 — tarjetas de estado */}
      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Acumulado">
          {showSkeleton ? (
            <SkeletonBlock className="h-9 w-32" />
          ) : (
            <div
              className="font-mono text-3xl font-semibold tabular-nums"
              style={{ color: stats.acumulado > 0 ? '#5FE6AE' : stats.acumulado < 0 ? '#FF6B6B' : '#F2FBF7' }}
            >
              {stats.acumulado >= 0 ? '+' : ''}
              {stats.acumulado.toFixed(2)} <span className="text-base text-beige/50">USDT</span>
            </div>
          )}
        </StatCard>

        <StatCard label="Actividad diaria">
          {showSkeleton ? (
            <SkeletonBlock className="h-9 w-20" />
          ) : (
            <div className="font-mono text-3xl font-semibold tabular-nums text-ivory">
              {stats.tradesPerDay.toFixed(1)} <span className="text-base text-beige/50">/ día</span>
            </div>
          )}
        </StatCard>

        <StatCard label="Récord de rendimiento">
          {showSkeleton ? (
            <SkeletonBlock className="h-9 w-28" />
          ) : (
            <div className="flex flex-col gap-1">
              <div className="flex items-baseline gap-1.5">
                <span className="font-mono text-lg font-semibold tabular-nums text-moss">
                  {stats.mejorDia ? `${stats.mejorDia.neto >= 0 ? '+' : ''}${stats.mejorDia.neto.toFixed(2)}` : '—'}
                </span>
                <span className="text-[11px] text-beige/40">mejor día</span>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="font-mono text-sm font-semibold tabular-nums text-beige/70">
                  {stats.mejorSemana ? `${stats.mejorSemana.neto >= 0 ? '+' : ''}${stats.mejorSemana.neto.toFixed(2)}` : '—'}
                </span>
                <span className="text-[11px] text-beige/40">mejor semana</span>
              </div>
            </div>
          )}
        </StatCard>

        <StatCard label="Récord de consistencia">
          {showSkeleton ? (
            <SkeletonBlock className="h-9 w-16" />
          ) : (
            <div className="font-mono text-3xl font-semibold tabular-nums text-ivory">
              {stats.maxGanadosEnUnDia ? stats.maxGanadosEnUnDia.n : '—'}
              <span className="text-base text-beige/50"> ganados/día</span>
            </div>
          )}
        </StatCard>
      </div>

      {/* Nivel 3 — curva de equity */}
      <div className="mb-10">
        {showSkeleton ? <SkeletonBlock className="h-[380px] w-full" /> : <EquityChart points={equity} height={380} />}
      </div>

      {/* Nivel 4 — resumen mensual + tabla de trades */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-beige/50">Resumen por mes</h2>
          {showSkeleton ? (
            <div className="flex flex-col gap-2">
              {[0, 1, 2].map((i) => (
                <SkeletonBlock key={i} className="h-14 w-full" />
              ))}
            </div>
          ) : months.length === 0 ? (
            <div className="rounded-lg border border-beige/10 px-4 py-6 text-center text-xs text-beige/40">
              Sin datos todavía.
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {months.map((m) => (
                <div
                  key={m.month}
                  className="liquid-glass flex items-center justify-between rounded-lg px-4 py-3"
                >
                  <div>
                    <div className="text-sm font-medium capitalize text-ivory">{formatMonth(m.month)}</div>
                    <div className="text-[11px] text-beige/40">{m.n} trades</div>
                  </div>
                  <div
                    className="font-mono text-sm font-semibold tabular-nums"
                    style={{ color: m.neto >= 0 ? '#5FE6AE' : '#FF6B6B' }}
                  >
                    {m.neto >= 0 ? '+' : ''}
                    {m.neto.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="lg:col-span-2">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-beige/50">Historial de trades</h2>
          {showSkeleton ? (
            <div className="flex flex-col gap-2">
              {[0, 1, 2, 3, 4].map((i) => (
                <SkeletonBlock key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : recentTrades.length === 0 ? (
            <div className="liquid-glass rounded-lg px-4 py-6 text-center text-xs text-beige/40">
              Sin datos todavía.
            </div>
          ) : (
            <div className="liquid-glass overflow-x-auto rounded-xl">
              <table className="w-full min-w-[640px] border-collapse">
                <thead>
                  <tr className="border-b border-beige/10 bg-beige/5 text-left text-[10.5px] uppercase tracking-wider text-beige/50">
                    <th className="px-3 py-2.5">Fecha</th>
                    <th className="px-3 py-2.5">Activo</th>
                    <th className="px-3 py-2.5">Dir.</th>
                    <th className="px-3 py-2.5">Resultado</th>
                    <th className="px-3 py-2.5">PnL neto</th>
                    <th className="px-3 py-2.5">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {recentTrades.map((t, i) => {
                    const win = (t.pnlNeto ?? 0) > 0
                    return (
                      <tr key={i} className="border-b border-beige/5 text-sm last:border-b-0 hover:bg-beige/5">
                        <td className="whitespace-nowrap px-3 py-2.5 font-mono text-xs text-beige/60">
                          {formatFecha(t.fecha)}
                        </td>
                        <td className="px-3 py-2.5 font-medium text-ivory">{t.simbolo}</td>
                        <td className="px-3 py-2.5">
                          <span
                            className={`rounded px-1.5 py-0.5 text-[10px] font-bold uppercase ${
                              t.direccion === 'long' ? 'bg-moss/15 text-moss' : 'bg-clay/15 text-clay'
                            }`}
                          >
                            {t.direccion}
                          </span>
                        </td>
                        <td className="px-3 py-2.5 font-mono text-xs tabular-nums text-beige/70">
                          {t.resultadoPct !== null ? `${t.resultadoPct >= 0 ? '+' : ''}${t.resultadoPct.toFixed(2)}%` : '—'}
                        </td>
                        <td
                          className="px-3 py-2.5 font-mono text-xs font-semibold tabular-nums"
                          style={{ color: win ? '#5FE6AE' : '#FF6B6B' }}
                        >
                          {t.pnlNeto !== null ? `${t.pnlNeto >= 0 ? '+' : ''}${t.pnlNeto.toFixed(2)}` : '—'}
                        </td>
                        <td className="px-3 py-2.5">
                          <span
                            className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                              win ? 'bg-moss/15 text-moss' : 'bg-clay/15 text-clay'
                            }`}
                          >
                            {win ? 'Win' : 'Loss'}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </PageShell>
  )
}

interface FilterSelectProps {
  label: string
  value: string
  onChange: (v: string) => void
  options: { value: string; label: string }[]
}

function FilterSelect({ label, value, onChange, options }: FilterSelectProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[11px] uppercase tracking-wider text-beige/50">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-md border border-beige/15 bg-navy px-2 py-1 text-xs text-ivory outline-none focus:border-beige/40"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  )
}
