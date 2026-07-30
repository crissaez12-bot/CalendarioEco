// Bar chart minimo, sin dependencias externas -- mismo criterio que EquityChart
// (SVG a mano, viewBox logico que se estira via CSS). Usado para comparar los
// 3 grupos de capitalizacion (win rate, SL) en la pagina Market Cap.

export interface BarDatum {
  label: string
  value: number
  color: string
  sublabel?: string
  range?: [number, number]
}

interface GroupBarChartProps {
  data: BarDatum[]
  max: number
  gridSteps: number[]
  format: (v: number) => string
  height?: number
}

const WIDTH = 420

export default function GroupBarChart({ data, max, gridSteps, format, height = 240 }: GroupBarChartProps) {
  const padL = 34
  const padR = 10
  const padT = 24
  const padB = 30
  const plotW = WIDTH - padL - padR
  const plotH = height - padT - padB
  const gap = plotW / data.length
  const barW = gap * 0.44

  const yFor = (v: number) => padT + plotH * (1 - v / max)

  return (
    <svg viewBox={`0 0 ${WIDTH} ${height}`} className="h-full w-full" preserveAspectRatio="none">
      {gridSteps.map((g) => {
        const y = yFor(g)
        return (
          <g key={g}>
            <line x1={padL} x2={WIDTH - padR} y1={y} y2={y} stroke="#7FA396" strokeOpacity="0.15" strokeWidth="1" />
            <text x={padL - 6} y={y + 3} fontSize="9" fill="#7FA396" textAnchor="end" fontFamily="ui-monospace, monospace">
              {format(g)}
            </text>
          </g>
        )
      })}
      <line x1={padL} x2={WIDTH - padR} y1={padT + plotH} y2={padT + plotH} stroke="#7FA396" strokeOpacity="0.35" strokeWidth="1" />

      {data.map((d, i) => {
        const cx = padL + gap * i + gap / 2
        const barTop = yFor(d.value)
        const barH = padT + plotH - barTop

        return (
          <g key={d.label}>
            <rect x={cx - barW / 2} y={barTop} width={barW} height={Math.max(1, barH)} fill={d.color} rx="3" />
            {d.range && (
              <>
                <line
                  x1={cx}
                  x2={cx}
                  y1={yFor(d.range[0])}
                  y2={yFor(d.range[1])}
                  stroke="#F2FBF7"
                  strokeOpacity="0.55"
                  strokeWidth="1.4"
                />
                <line x1={cx - 5} x2={cx + 5} y1={yFor(d.range[0])} y2={yFor(d.range[0])} stroke="#F2FBF7" strokeOpacity="0.55" strokeWidth="1.4" />
                <line x1={cx - 5} x2={cx + 5} y1={yFor(d.range[1])} y2={yFor(d.range[1])} stroke="#F2FBF7" strokeOpacity="0.55" strokeWidth="1.4" />
              </>
            )}
            {d.sublabel && (
              <text x={cx} y={barTop - 20} fontSize="9.5" fontWeight="700" fill={d.color} textAnchor="middle">
                {d.sublabel}
              </text>
            )}
            <text
              x={cx}
              y={barTop - 7}
              fontSize="12.5"
              fontWeight="700"
              fill="#F2FBF7"
              textAnchor="middle"
              fontFamily="ui-monospace, monospace"
            >
              {format(d.value)}
            </text>
            <text x={cx} y={padT + plotH + 17} fontSize="10.5" fontWeight="600" fill="#7FA396" textAnchor="middle">
              {d.label}
            </text>
          </g>
        )
      })}
    </svg>
  )
}
