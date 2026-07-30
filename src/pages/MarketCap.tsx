import { Fragment } from 'react'
import PageShell from '../components/PageShell'
import GroupBarChart from '../components/GroupBarChart'
import { GROUPS, LONG_SHORT_TP, BTC_SOLO, type CapKey } from '../data/marketCapData'

const GROUP_COLOR: Record<CapKey, string> = {
  large: 'rgba(95,230,174,0.45)', // moss/45
  mid: 'rgba(95,230,174,0.72)', // moss/72
  small: '#5FE6AE', // moss lleno
}

const GROUP_DOT_CLASS: Record<CapKey, string> = {
  large: 'bg-moss/45',
  mid: 'bg-moss/70',
  small: 'bg-moss',
}

function heatBg(total: number, maxTotal: number) {
  const t = Math.max(0, Math.min(1, total / maxTotal))
  return `rgba(95,230,174,${(t * 0.32).toFixed(3)})`
}

export default function MarketCap() {
  const totalTrades = GROUPS.reduce((s, g) => s + g.n, 0)
  const allDirectionRows = Object.values(LONG_SHORT_TP).flat()
  const totalOld = allDirectionRows.reduce((s, r) => s + r.totalOld, 0)
  const totalNew = allDirectionRows.reduce((s, r) => s + r.totalNew, 0)

  return (
    <PageShell>
      <div className="mb-6">
        <h1 className="text-2xl font-normal md:text-3xl" style={{ letterSpacing: '-0.03em' }}>
          Market Cap
        </h1>
        <p className="mt-1 max-w-3xl text-sm text-beige/70">
          Los 37 activos del piloto segmentados por capitalización de mercado real (CoinGecko) en 3 tramos.
          BTC queda fuera por ser un outlier de capitalización que distorsionaría cualquier grupo; XAU queda
          fuera por no ser un activo cripto. Misma mecánica en los tres grupos: entrada tuneada por activo,
          SL adaptativo banda+ATR (fijo por grupo), protección a mitad de banda, y desde el 30/07 un{' '}
          <b className="text-ivory">TP óptimo por activo y por dirección</b> (long y short ya no comparten el
          mismo TP) — la fuente real que usa el mensaje de Telegram.
        </p>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4">
        <div className="liquid-glass rounded-xl px-4 py-3">
          <div className="text-[11px] uppercase tracking-wider text-beige/50">Activos</div>
          <div className="font-mono text-xl font-semibold tabular-nums text-ivory">37</div>
          <div className="text-[10px] text-beige/40">BTC y XAU fuera</div>
        </div>
        <div className="liquid-glass rounded-xl px-4 py-3">
          <div className="text-[11px] uppercase tracking-wider text-beige/50">Trades totales</div>
          <div className="font-mono text-xl font-semibold tabular-nums text-ivory">{totalTrades.toLocaleString()}</div>
        </div>
        <div className="liquid-glass rounded-xl px-4 py-3">
          <div className="text-[11px] uppercase tracking-wider text-beige/50">Timeframe</div>
          <div className="font-mono text-xl font-semibold tabular-nums text-ivory">1h</div>
          <div className="text-[10px] text-beige/40">~18.5 meses</div>
        </div>
        <div className="liquid-glass rounded-xl px-4 py-3">
          <div className="text-[11px] uppercase tracking-wider text-beige/50">Fuente</div>
          <div className="text-sm font-semibold text-ivory">PunkAlgo real + BB(20,2σ)</div>
        </div>
      </div>

      <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-beige/50">Composición de los grupos</h2>
      <div className="mb-8 grid grid-cols-1 gap-3 md:grid-cols-3">
        {GROUPS.map((g) => (
          <div key={g.key} className="liquid-glass rounded-xl px-4 py-4">
            <div className="mb-1 flex items-center gap-2">
              <span className={`h-2.5 w-2.5 rounded-sm ${GROUP_DOT_CLASS[g.key]}`} />
              <span className="text-sm font-semibold text-ivory">{g.label}</span>
              <span className="text-xs text-beige/40">{g.range}</span>
            </div>
            <div className="mb-2.5 text-[11px] text-beige/40">
              {g.assets.length} activos &middot; {g.n.toLocaleString()} trades
            </div>
            <div className="flex flex-wrap gap-1.5">
              {g.assets.map((a) => (
                <span
                  key={a.ticker}
                  className="rounded-md border border-beige/10 bg-beige/5 px-2 py-0.5 text-[10.5px] font-medium text-beige/70"
                >
                  {a.ticker} <span className="text-beige/40">· {a.mcap}</span>
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-beige/50">
        BTC — por qué queda fuera de los grupos
      </h2>
      <div className="liquid-glass mb-8 rounded-xl px-5 py-4">
        <p className="mb-4 max-w-3xl text-[12px] leading-relaxed text-beige/60">
          No es solo su capitalización — BTC genera muchas menos señales que el resto: solo{' '}
          <span className="font-mono font-semibold text-ivory">{BTC_SOLO.n}</span> entradas en ~18.5 meses,
          contra 681 de los otros 7 large-cap juntos. Mezclarlo hubiera diluido el análisis del grupo, y su
          propia muestra es chica para sacar una conclusión firme aparte — igual se evaluó por separado con
          la misma metodología (entrada tuneada, motor v2, protección a mitad de banda).
        </p>

        <div className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-5">
          <div className="rounded-lg border border-beige/10 bg-beige/5 px-3 py-2.5">
            <div className="text-[10px] uppercase tracking-wider text-beige/50">Trades</div>
            <div className="font-mono text-lg font-semibold tabular-nums text-ivory">{BTC_SOLO.n}</div>
          </div>
          <div className="rounded-lg border border-beige/10 bg-beige/5 px-3 py-2.5">
            <div className="text-[10px] uppercase tracking-wider text-beige/50">SL mediana</div>
            <div className="font-mono text-lg font-semibold tabular-nums text-ivory">{BTC_SOLO.slMedian}%</div>
          </div>
          <div className="rounded-lg border border-beige/10 bg-beige/5 px-3 py-2.5">
            <div className="text-[10px] uppercase tracking-wider text-beige/50">SL P25–P75</div>
            <div className="font-mono text-sm font-semibold tabular-nums text-ivory">
              {BTC_SOLO.slP25}% – {BTC_SOLO.slP75}%
            </div>
          </div>
          <div className="rounded-lg border border-beige/10 bg-beige/5 px-3 py-2.5">
            <div className="text-[10px] uppercase tracking-wider text-beige/50">SL máximo visto</div>
            <div className="font-mono text-lg font-semibold tabular-nums text-ivory">{BTC_SOLO.slMax}%</div>
          </div>
          <div className="rounded-lg border border-moss/30 bg-moss/10 px-3 py-2.5">
            <div className="text-[10px] uppercase tracking-wider text-moss/80">Recomendado</div>
            <div className="font-mono text-lg font-semibold tabular-nums text-moss">
              SL {BTC_SOLO.recommended.sl}% / TP {BTC_SOLO.recommended.tp}%
            </div>
          </div>
        </div>

        <div className="overflow-x-auto rounded-lg border border-beige/10">
          <table className="w-full min-w-[560px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-beige/10 bg-beige/5 text-left text-[10px] uppercase tracking-wider text-beige/50">
                <th className="px-3 py-2">SL</th>
                <th className="px-3 py-2">TP</th>
                <th className="px-3 py-2 text-right">Win rate</th>
                <th className="px-3 py-2 text-right">Prom/trade</th>
                <th className="px-3 py-2 text-right">Suma total</th>
                <th className="px-3 py-2">Nota</th>
              </tr>
            </thead>
            <tbody>
              {BTC_SOLO.combos.map((c) => {
                const isRecommended = c.note === 'Recomendado'
                return (
                  <tr
                    key={`${c.sl}-${c.tp}`}
                    className={`border-b border-beige/5 last:border-b-0 ${isRecommended ? 'bg-moss/[0.08]' : ''}`}
                  >
                    <td className="px-3 py-2 font-mono tabular-nums text-ivory">{c.sl.toFixed(1)}%</td>
                    <td className="px-3 py-2 font-mono tabular-nums text-ivory">{c.tp.toFixed(1)}%</td>
                    <td className="px-3 py-2 text-right font-mono tabular-nums text-beige/70">{c.wr.toFixed(1)}%</td>
                    <td className="px-3 py-2 text-right font-mono tabular-nums text-beige/70">+{c.avg.toFixed(3)}%</td>
                    <td
                      className={`px-3 py-2 text-right font-mono font-semibold tabular-nums ${isRecommended ? 'text-moss' : 'text-ivory'}`}
                    >
                      +{c.total.toFixed(1)}%
                    </td>
                    <td className="px-3 py-2 text-[11px] text-beige/50">{c.note}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-beige/50">Win rate y SL por grupo</h2>
      <div className="mb-8 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="liquid-glass rounded-xl px-5 py-4">
          <div className="mb-0.5 text-sm font-semibold text-ivory">Win rate por grupo</div>
          <div className="mb-3 text-[11px] text-beige/40">TP óptimo por activo y dirección &middot; motor v2 completo</div>
          <div style={{ height: 230 }}>
            <GroupBarChart
              height={230}
              max={100}
              gridSteps={[0, 25, 50, 75, 100]}
              format={(v) => `${v.toFixed(0)}%`}
              data={GROUPS.map((g) => ({
                label: g.label,
                value: g.wr,
                color: GROUP_COLOR[g.key],
              }))}
            />
          </div>
        </div>
        <div className="liquid-glass rounded-xl px-5 py-4">
          <div className="mb-0.5 text-sm font-semibold text-ivory">SL real por grupo</div>
          <div className="mb-3 text-[11px] text-beige/40">Barra = mediana &middot; línea = rango P25–P75</div>
          <div style={{ height: 230 }}>
            <GroupBarChart
              height={230}
              max={2.5}
              gridSteps={[0, 0.5, 1, 1.5, 2, 2.5]}
              format={(v) => `${v.toFixed(1)}%`}
              data={GROUPS.map((g) => ({
                label: g.label,
                value: g.slMedian,
                color: GROUP_COLOR[g.key],
                range: [g.slP25, g.slP75],
              }))}
            />
          </div>
        </div>
      </div>

      <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-beige/50">Resultados completos</h2>
      <div className="liquid-glass mb-8 overflow-x-auto rounded-xl">
        <table className="w-full min-w-[820px] border-collapse">
          <thead>
            <tr className="border-b border-beige/10 bg-beige/5 text-left text-[10.5px] uppercase tracking-wider text-beige/50">
              <th className="px-4 py-3">Grupo</th>
              <th className="px-4 py-3 text-right">n</th>
              <th className="px-4 py-3 text-right">Win rate</th>
              <th className="px-4 py-3 text-right">Prom/trade</th>
              <th className="px-4 py-3 text-right">Suma total</th>
              <th className="px-4 py-3 text-right">Drawdown máx</th>
              <th className="px-4 py-3 text-right">Racha perdedora</th>
              <th className="px-4 py-3 text-right">SL mediana</th>
              <th className="px-4 py-3 text-right">SL P25–P75</th>
            </tr>
          </thead>
          <tbody>
            {GROUPS.map((g) => (
              <tr key={g.key} className="border-b border-beige/5 text-sm last:border-b-0 hover:bg-beige/5">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2 font-semibold text-ivory">
                    <span className={`h-2.5 w-2.5 rounded-sm ${GROUP_DOT_CLASS[g.key]}`} />
                    {g.label}
                  </div>
                </td>
                <td className="px-4 py-3 text-right font-mono tabular-nums text-beige/70">{g.n.toLocaleString()}</td>
                <td className="px-4 py-3 text-right font-mono font-semibold tabular-nums text-moss">{g.wr.toFixed(1)}%</td>
                <td className="px-4 py-3 text-right font-mono tabular-nums text-ivory">{g.avg.toFixed(3)}%</td>
                <td className="px-4 py-3 text-right font-mono font-semibold tabular-nums text-moss">+{g.total.toFixed(1)}%</td>
                <td className="px-4 py-3 text-right font-mono tabular-nums text-beige/70">{g.dd.toFixed(1)} pts</td>
                <td className="px-4 py-3 text-right font-mono tabular-nums text-beige/70">{g.streak}</td>
                <td className="px-4 py-3 text-right font-mono tabular-nums text-ivory">{g.slMedian.toFixed(2)}%</td>
                <td className="px-4 py-3 text-right font-mono tabular-nums text-beige/60">
                  {g.slP25.toFixed(2)}% – {g.slP75.toFixed(2)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-beige/50">
        TP por dirección (Long/Short) — activo por activo
      </h2>
      <p className="mb-4 max-w-3xl text-[11.5px] text-beige/50">
        El TP dejó de ser un número único por grupo: cada activo tiene su propio TP para long y para short
        (barrido real 0.6%–4.0%, SL fijo del grupo sin cambios, maximizando rentabilidad total de cada lado
        por separado — no win rate). Es la fuente que usa hoy el mensaje de Telegram. Comparado contra el TP
        único anterior, ningún activo empeora.
      </p>

      <div className="mb-6 grid grid-cols-1 gap-3 md:grid-cols-3">
        <div className="liquid-glass rounded-xl px-5 py-4">
          <div className="text-[10.5px] uppercase tracking-wider text-beige/50">Antes — TP único (long = short)</div>
          <div className="mt-1.5 font-mono text-2xl font-semibold tabular-nums text-ivory">+{totalOld.toFixed(1)}%</div>
        </div>
        <div className="liquid-glass rounded-xl px-5 py-4">
          <div className="text-[10.5px] uppercase tracking-wider text-beige/50">Ahora — TP por dirección</div>
          <div className="mt-1.5 font-mono text-2xl font-semibold tabular-nums text-ivory">+{totalNew.toFixed(1)}%</div>
        </div>
        <div className="liquid-glass rounded-xl border border-moss/30 bg-moss/[0.06] px-5 py-4">
          <div className="text-[10.5px] uppercase tracking-wider text-moss/80">Mejora</div>
          <div className="mt-1.5 font-mono text-2xl font-semibold tabular-nums text-moss">
            +{(totalNew - totalOld).toFixed(1)} pts ({(((totalNew - totalOld) / totalOld) * 100).toFixed(1)}%)
          </div>
        </div>
      </div>

      <div className="liquid-glass mb-8 overflow-x-auto rounded-xl">
        <table className="w-full min-w-[980px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-beige/10 bg-beige/5 text-left text-[10px] uppercase tracking-wider text-beige/50">
              <th className="px-4 py-2.5">Activo</th>
              <th className="px-4 py-2.5 text-right">SL</th>
              <th className="px-4 py-2.5 text-right">Total antes</th>
              <th className="border-l border-beige/10 px-4 py-2.5 text-right">TP Long</th>
              <th className="px-4 py-2.5 text-right">WR L</th>
              <th className="px-4 py-2.5 text-right">Total L</th>
              <th className="border-l border-beige/10 px-4 py-2.5 text-right">TP Short</th>
              <th className="px-4 py-2.5 text-right">WR S</th>
              <th className="px-4 py-2.5 text-right">Total S</th>
              <th className="border-l border-beige/10 px-4 py-2.5 text-right">Total ahora</th>
              <th className="px-4 py-2.5 text-right">Mejora</th>
            </tr>
          </thead>
          <tbody>
            {GROUPS.map((g) => {
              const rows = LONG_SHORT_TP[g.key]
              return (
                <Fragment key={g.key}>
                  <tr>
                    <td
                      colSpan={11}
                      className="px-4 py-1.5 text-[10.5px] font-bold uppercase tracking-wider text-moss"
                      style={{ background: 'rgba(95,230,174,0.08)' }}
                    >
                      {g.label} · SL {rows[0].sl.toFixed(1)}%
                    </td>
                  </tr>
                  {rows.map((row) => (
                    <tr key={row.ticker} className="border-b border-beige/5 last:border-b-0 hover:bg-beige/5">
                      <td className="px-4 py-2.5">
                        <span className="flex items-center gap-2 font-medium text-ivory">
                          <span className={`h-2 w-2 rounded-sm ${GROUP_DOT_CLASS[g.key]}`} />
                          {row.ticker}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-right font-mono text-xs tabular-nums text-beige/60">{row.sl.toFixed(1)}%</td>
                      <td className="px-4 py-2.5 text-right font-mono text-xs tabular-nums text-beige/60">+{row.totalOld.toFixed(1)}%</td>
                      <td className="border-l border-beige/5 px-4 py-2.5 text-right font-mono text-xs tabular-nums text-ivory">{row.long.tp.toFixed(2)}%</td>
                      <td className="px-4 py-2.5 text-right font-mono text-xs tabular-nums text-beige/60">{row.long.wr.toFixed(1)}%</td>
                      <td className="px-4 py-2.5 text-right font-mono text-xs font-semibold tabular-nums text-ivory">+{row.long.total.toFixed(1)}%</td>
                      <td className="border-l border-beige/5 px-4 py-2.5 text-right font-mono text-xs tabular-nums text-ivory">{row.short.tp.toFixed(2)}%</td>
                      <td className="px-4 py-2.5 text-right font-mono text-xs tabular-nums text-beige/60">{row.short.wr.toFixed(1)}%</td>
                      <td className="px-4 py-2.5 text-right font-mono text-xs font-semibold tabular-nums text-ivory">+{row.short.total.toFixed(1)}%</td>
                      <td
                        className="border-l border-beige/5 px-4 py-2.5 text-right font-mono text-xs font-semibold tabular-nums text-ivory"
                        style={{ background: heatBg(row.deltaPct, 32) }}
                      >
                        +{row.totalNew.toFixed(1)}%
                      </td>
                      <td className={`px-4 py-2.5 text-right font-mono text-xs font-semibold tabular-nums ${row.deltaPct > 0 ? 'text-moss' : 'text-beige/40'}`}>
                        {row.deltaPct > 0 ? '+' : ''}
                        {row.deltaPct.toFixed(1)}%
                      </td>
                    </tr>
                  ))}
                </Fragment>
              )
            })}
          </tbody>
        </table>
      </div>

      <p className="max-w-3xl text-[11px] leading-relaxed text-beige/40">
        <span className="font-semibold text-beige/60">Metodología:</span> motor v2 (entrada tuneada por
        activo vía barrido oscMain/%B/ATR, SL fijo por grupo, protección a mitad de banda antes del TP, TP
        único de cierre completo) sobre datos reales de PunkAlgo Signals+Oscillator en 1h. El TP se barrió por
        separado en long y en short (0.6%–4.0%) por activo, maximizando la suma total de esa dirección — no
        el win rate. El SL "mediana" es el SL real que produce la fórmula banda+ATR en cada entrada (fijado
        luego al SL3 de cada grupo, ver tabla de arriba) — el rango P25–P75 muestra la variación dentro del
        grupo. Se probó liberar también el SL por activo/dirección y se descartó: el 34% de los "óptimos"
        quedaba pegado al borde de la grilla probada (sobreajuste), incompatible además con el apalancamiento
        real x20–x50 usado en Telegram. Lectura: a menor capitalización, el SL estándar es más ancho y el win
        rate/rentabilidad por trade también suben, a costa de mayor drawdown máximo.
      </p>
    </PageShell>
  )
}
