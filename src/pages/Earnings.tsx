import { useMemo, useState } from 'react'
import PageShell from '../components/PageShell'
import earningsData from '../data/earningsData.json'
import tokenUnlocksData from '../data/tokenUnlocksData.json'
import { isMag7 } from '../data/mag7'

type Tab = 'earnings' | 'unlocks'
type UnlockType = 'Cliff' | 'Lineal' | 'Team / Investors' | 'Staking rewards'
const GOLD = '#D4AF37'

const money = (n: number) => {
  const abs = Math.abs(n)
  if (abs >= 1e9) return `$${(n / 1e9).toFixed(2)}B`
  if (abs >= 1e6) return `$${(n / 1e6).toFixed(1)}M`
  if (abs >= 1e3) return `$${(n / 1e3).toFixed(0)}K`
  return `$${n.toFixed(0)}`
}

const tokenCount = (n: number) => {
  if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M`
  if (n >= 1e3) return `${(n / 1e3).toFixed(0)}K`
  return n.toFixed(0)
}

const UNLOCK_TYPE_STYLES: Record<UnlockType, string> = {
  Cliff: 'border-clay/40 text-clay',
  Lineal: 'border-beige/25 text-beige/70',
  'Team / Investors': 'border-ivory/25 text-ivory/80',
  'Staking rewards': 'border-moss/40 text-moss',
}

export default function Earnings() {
  const [tab, setTab] = useState<Tab>('earnings')

  const earningsStats = useMemo(() => {
    const all = earningsData.days.flatMap((d) => d.events)
    return {
      total: all.length,
      bmo: all.filter((e) => e.time === 'BMO').length,
      amc: all.filter((e) => e.time === 'AMC').length,
    }
  }, [])

  const unlockStats = useMemo(() => {
    const all = tokenUnlocksData.days.flatMap((d) => d.events)
    return {
      totalUsd: all.reduce((sum, e) => sum + e.unlockUsd, 0),
      highImpact: all.filter((e) => e.pctSupply >= 3).length,
      total: all.length,
    }
  }, [])

  return (
    <PageShell>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-normal md:text-3xl" style={{ letterSpacing: '-0.03em' }}>
            Earnings
          </h1>
          <p className="mt-1 text-sm text-beige/70">
            Resultados corporativos y desbloqueo de tokens del top 100 crypto &middot; datos reales, actualizados
            automáticamente cada día a las 8:00 (Chile).
          </p>
        </div>

        <div className="liquid-glass flex rounded-lg p-1">
          <button
            type="button"
            onClick={() => setTab('earnings')}
            className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${
              tab === 'earnings' ? 'bg-ivory text-navy' : 'text-beige/60 hover:text-ivory'
            }`}
          >
            Acciones
          </button>
          <button
            type="button"
            onClick={() => setTab('unlocks')}
            className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${
              tab === 'unlocks' ? 'bg-ivory text-navy' : 'text-beige/60 hover:text-ivory'
            }`}
          >
            Tokens
          </button>
        </div>
      </div>

      {tab === 'earnings' ? (
        <>
          <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-3">
            <div className="liquid-glass rounded-xl px-4 py-3">
              <div className="text-[11px] uppercase tracking-wider text-beige/50">Reportan esta semana</div>
              <div className="font-mono text-xl font-semibold tabular-nums text-ivory">{earningsStats.total}</div>
            </div>
            <div className="liquid-glass rounded-xl px-4 py-3">
              <div className="text-[11px] uppercase tracking-wider text-beige/50">Antes de apertura (BMO)</div>
              <div className="font-mono text-xl font-semibold tabular-nums text-ivory">{earningsStats.bmo}</div>
            </div>
            <div className="liquid-glass rounded-xl px-4 py-3">
              <div className="text-[11px] uppercase tracking-wider text-beige/50">Después de cierre (AMC)</div>
              <div className="font-mono text-xl font-semibold tabular-nums text-ivory">{earningsStats.amc}</div>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            {earningsData.days.map((day) => (
              <section key={day.date}>
                <h2 className="mb-2 text-sm font-semibold text-ivory">{day.label}</h2>
                <div className="liquid-glass overflow-x-auto rounded-xl">
                  <table className="w-full min-w-[720px] border-collapse">
                    <thead>
                      <tr className="border-b border-beige/10 bg-beige/5">
                        <th className="whitespace-nowrap px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-beige/50">
                          Hora
                        </th>
                        <th className="whitespace-nowrap px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-beige/50">
                          Empresa
                        </th>
                        <th className="whitespace-nowrap px-4 py-2.5 text-right text-[11px] font-semibold uppercase tracking-wider text-beige/50">
                          Cap. mercado
                        </th>
                        <th className="whitespace-nowrap px-4 py-2.5 text-right text-[11px] font-semibold uppercase tracking-wider text-beige/50">
                          EPS est.
                        </th>
                        <th className="whitespace-nowrap px-4 py-2.5 text-right text-[11px] font-semibold uppercase tracking-wider text-beige/50">
                          EPS año anterior
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {day.events.map((e, i) => {
                        const mag7 = isMag7(e.ticker)
                        return (
                          <tr
                            key={i}
                            className="border-b border-borderSubtle last:border-b-0 hover:bg-beige/5"
                            style={mag7 ? { background: 'rgba(212,175,55,0.08)' } : undefined}
                          >
                            <td className="px-4 py-3">
                              <span
                                className={`rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                                  e.time === 'BMO'
                                    ? 'bg-moss/15 text-moss'
                                    : e.time === 'AMC'
                                      ? 'bg-beige/10 text-beige/70'
                                      : 'bg-beige/5 text-beige/40'
                                }`}
                              >
                                {e.time}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-semibold" style={{ color: mag7 ? GOLD : '#F2FBF7' }}>
                                  {e.name}
                                </span>
                                {mag7 && (
                                  <span
                                    className="rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide"
                                    style={{ background: 'rgba(212,175,55,0.18)', color: GOLD }}
                                  >
                                    Mag 7
                                  </span>
                                )}
                              </div>
                              <div className="font-mono text-[11px] text-beige/50">{e.ticker}</div>
                            </td>
                            <td className="px-4 py-3 text-right font-mono text-sm tabular-nums text-beige/60">
                              {money(e.marketCap)}
                            </td>
                            <td
                              className="px-4 py-3 text-right font-mono text-sm font-semibold tabular-nums"
                              style={{ color: mag7 ? GOLD : '#F2FBF7' }}
                            >
                              {e.epsEst}
                            </td>
                            <td className="px-4 py-3 text-right font-mono text-sm tabular-nums text-beige/60">
                              {e.epsLastYear}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </section>
            ))}
          </div>

          <p className="mt-6 text-[11px] text-beige/40">
            BMO = Before Market Open &middot; AMC = After Market Close &middot; N/D = horario no informado &middot;
            EPS estimado = consenso de analistas &middot; fuente: {earningsData.source}, actualizado{' '}
            {earningsData.capturedAt}
          </p>
        </>
      ) : (
        <>
          <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-3">
            <div className="liquid-glass rounded-xl px-4 py-3">
              <div className="text-[11px] uppercase tracking-wider text-beige/50">Desbloqueos esta semana</div>
              <div className="font-mono text-xl font-semibold tabular-nums text-ivory">{unlockStats.total}</div>
            </div>
            <div className="liquid-glass rounded-xl px-4 py-3">
              <div className="text-[11px] uppercase tracking-wider text-beige/50">Valor total liberado</div>
              <div className="font-mono text-xl font-semibold tabular-nums text-ivory">{money(unlockStats.totalUsd)}</div>
            </div>
            <div className="liquid-glass rounded-xl px-4 py-3">
              <div className="text-[11px] uppercase tracking-wider text-beige/50">Alto impacto (&ge;3% supply)</div>
              <div className="font-mono text-xl font-semibold tabular-nums text-clay">{unlockStats.highImpact}</div>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            {tokenUnlocksData.days.map((day) => (
              <section key={day.date}>
                <h2 className="mb-2 text-sm font-semibold text-ivory">{day.label}</h2>
                <div className="liquid-glass overflow-x-auto rounded-xl">
                  <table className="w-full min-w-[720px] border-collapse">
                    <thead>
                      <tr className="border-b border-beige/10 bg-beige/5">
                        <th className="whitespace-nowrap px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-beige/50">
                          Token
                        </th>
                        <th className="whitespace-nowrap px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-beige/50">
                          Tipo
                        </th>
                        <th className="whitespace-nowrap px-4 py-2.5 text-right text-[11px] font-semibold uppercase tracking-wider text-beige/50">
                          Tokens liberados
                        </th>
                        <th className="whitespace-nowrap px-4 py-2.5 text-right text-[11px] font-semibold uppercase tracking-wider text-beige/50">
                          Valor est.
                        </th>
                        <th className="whitespace-nowrap px-4 py-2.5 text-right text-[11px] font-semibold uppercase tracking-wider text-beige/50">
                          % supply
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {day.events.map((e, i) => (
                        <tr key={i} className="border-b border-borderSubtle last:border-b-0 hover:bg-beige/5">
                          <td className="px-4 py-3">
                            <div className="text-sm font-semibold text-ivory">{e.name}</div>
                            <div className="font-mono text-[11px] text-beige/50">{e.ticker}</div>
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`rounded border px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                                UNLOCK_TYPE_STYLES[e.type as UnlockType] ?? 'border-beige/25 text-beige/70'
                              }`}
                            >
                              {e.type}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right font-mono text-sm tabular-nums text-beige/60">
                            {tokenCount(e.unlockTokens)}
                          </td>
                          <td className="px-4 py-3 text-right font-mono text-sm font-semibold tabular-nums text-ivory">
                            {money(e.unlockUsd)}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <span
                              className={`font-mono text-sm font-semibold tabular-nums ${
                                e.pctSupply >= 3 ? 'text-clay' : 'text-ivory'
                              }`}
                            >
                              {e.pctSupply.toFixed(1)}%
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            ))}
          </div>

          <p className="mt-6 text-[11px] text-beige/40">
            % supply = porcentaje del supply circulante liberado en ese evento &middot; ventana de los próximos 10 días
            &middot; fuente: {tokenUnlocksData.source}, actualizado {tokenUnlocksData.capturedAt}
          </p>
        </>
      )}
    </PageShell>
  )
}
