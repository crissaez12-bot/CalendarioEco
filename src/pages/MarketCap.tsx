import { Fragment } from 'react'
import PageShell from '../components/PageShell'
import GroupBarChart from '../components/GroupBarChart'
import { GROUPS, SL_TYPE_LABELS, SL_TYPE_ROWS, BTC_SOLO, bestSlIndex, type CapKey } from '../data/marketCapData'

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
          SL adaptativo banda+ATR, protección a mitad de banda, TP único (óptimo de cada grupo).
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
          <div className="mb-3 text-[11px] text-beige/40">TP óptimo de cada grupo &middot; motor v2 completo</div>
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
                sublabel: `TP ${g.tp.toFixed(2)}%`,
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
              <th className="px-4 py-3 text-right">TP</th>
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
                <td className="px-4 py-3 text-right font-mono tabular-nums text-ivory">{g.tp.toFixed(2)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-beige/50">
        Backtest de 3 tipos de SL, activo por activo
      </h2>
      <p className="mb-3 max-w-3xl text-[11.5px] text-beige/50">
        Para cada grupo, 3 niveles de SL fijo, redondos y pensados para ejecución manual (Large 0.6% / 1.0% /
        1.5% · Mid 0.8% / 1.4% / 2.0% · Small 0.8% / 1.5% / 2.2%), cruzados con el TP óptimo del grupo.
        Corrido activo por activo — todos los 37 activos son rentables en los 3 niveles, sin excepción, y
        estos números redondos rinden igual o mejor que el rango estadístico P25–P75 del que salieron.
      </p>
      <div className="liquid-glass mb-8 overflow-x-auto rounded-xl">
        <table className="w-full min-w-[760px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-beige/10 bg-beige/5 text-left text-[10px] uppercase tracking-wider text-beige/50">
              <th className="px-4 py-2.5">Activo</th>
              <th className="px-4 py-2.5 text-right">SL1</th>
              <th className="px-4 py-2.5 text-right">SL2</th>
              <th className="px-4 py-2.5 text-right">SL3</th>
              <th className="px-4 py-2.5 text-right">Mejor SL</th>
            </tr>
          </thead>
          <tbody>
            {GROUPS.map((g) => {
              const rows = SL_TYPE_ROWS[g.key]
              const labels = SL_TYPE_LABELS[g.key]
              const maxTotal = Math.max(...rows.flatMap((r) => [r.sl1.total, r.sl2.total, r.sl3.total]))
              return (
                <Fragment key={g.key}>
                  <tr>
                    <td
                      colSpan={5}
                      className="px-4 py-1.5 text-[10.5px] font-bold uppercase tracking-wider text-moss"
                      style={{ background: 'rgba(95,230,174,0.08)' }}
                    >
                      {g.label} &middot; {labels.join(' · ')}
                    </td>
                  </tr>
                  {rows.map((row) => {
                    const results = [row.sl1, row.sl2, row.sl3]
                    const best = bestSlIndex(row)
                    return (
                      <tr key={row.ticker} className="border-b border-beige/5 last:border-b-0 hover:bg-beige/5">
                        <td className="px-4 py-2.5">
                          <span className="flex items-center gap-2 font-medium text-ivory">
                            <span className={`h-2 w-2 rounded-sm ${GROUP_DOT_CLASS[g.key]}`} />
                            {row.ticker}
                          </span>
                        </td>
                        {results.map((r, i) => (
                          <td
                            key={i}
                            className="px-4 py-2.5 text-right font-mono text-xs tabular-nums text-beige/70"
                            style={{ background: heatBg(r.total, maxTotal) }}
                          >
                            n={r.n} &middot; WR {r.wr.toFixed(1)}% &middot;{' '}
                            <span className="font-semibold text-ivory">
                              {r.total >= 0 ? '+' : ''}
                              {r.total.toFixed(1)}%
                            </span>
                          </td>
                        ))}
                        <td className="px-4 py-2.5 text-right font-mono text-xs font-semibold tabular-nums text-moss">
                          {labels[best].split(' · ')[0]}
                        </td>
                      </tr>
                    )
                  })}
                </Fragment>
              )
            })}
          </tbody>
        </table>
      </div>

      <p className="max-w-3xl text-[11px] leading-relaxed text-beige/40">
        <span className="font-semibold text-beige/60">Metodología:</span> motor v2 (entrada tuneada por
        activo vía barrido oscMain/%B/ATR, SL = min/max(vela, banda) ± 0.1×ATR, protección a mitad de banda
        antes del TP, TP único de cierre completo) sobre datos reales de PunkAlgo Signals+Oscillator en 1h.
        El TP de cada grupo es el que maximiza la suma total dentro de ese grupo, barriendo 0.6%–2.0%. El SL
        "mediana" es el SL real que produce la fórmula banda+ATR en cada entrada — varía trade a trade según
        el ancho de banda en ese momento; el rango P25–P75 muestra la variación dentro del grupo. Lectura: a
        menor capitalización, el SL estándar es más ancho y el win rate/rentabilidad por trade también suben,
        a costa de mayor drawdown máximo.
      </p>
    </PageShell>
  )
}
