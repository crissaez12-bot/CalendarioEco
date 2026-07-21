import { useMemo, useRef, useState } from 'react'
import type { EquityPoint } from '../data/operacionesData'
import { formatFecha } from '../data/operacionesData'

interface EquityChartProps {
  points: EquityPoint[]
  height?: number
}

const MOSS = '#5FE6AE'
const CLAY = '#FF6B6B'
const PAD_X = 12
const PAD_Y = 20

// Catmull-Rom -> Bezier: linea suave sin dependencias externas.
function smoothPath(xs: number[], ys: number[]): string {
  if (xs.length < 2) return ''
  let d = `M ${xs[0]},${ys[0]}`
  for (let i = 0; i < xs.length - 1; i++) {
    const p0x = xs[Math.max(0, i - 1)]
    const p0y = ys[Math.max(0, i - 1)]
    const p1x = xs[i]
    const p1y = ys[i]
    const p2x = xs[i + 1]
    const p2y = ys[i + 1]
    const p3x = xs[Math.min(xs.length - 1, i + 2)]
    const p3y = ys[Math.min(xs.length - 1, i + 2)]
    const c1x = p1x + (p2x - p0x) / 6
    const c1y = p1y + (p2y - p0y) / 6
    const c2x = p2x - (p3x - p1x) / 6
    const c2y = p2y - (p3y - p1y) / 6
    d += ` C ${c1x},${c1y} ${c2x},${c2y} ${p2x},${p2y}`
  }
  return d
}

export default function EquityChart({ points, height = 380 }: EquityChartProps) {
  const [hoverIdx, setHoverIdx] = useState<number | null>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const width = 1000 // viewBox logico; se estira 100% via CSS

  const { linePath, areaPath, xs, ys, zeroY, minV, maxV } = useMemo(() => {
    if (points.length === 0) {
      return { linePath: '', areaPath: '', xs: [] as number[], ys: [] as number[], zeroY: 0, minV: 0, maxV: 0 }
    }
    const values = points.map((p) => p.acumulado)
    const minV = Math.min(0, ...values)
    const maxV = Math.max(0, ...values)
    const span = maxV - minV || 1
    const innerH = height - PAD_Y * 2
    const innerW = width - PAD_X * 2
    const yFor = (v: number) => PAD_Y + innerH - ((v - minV) / span) * innerH
    const xs = points.map((_, i) => (points.length === 1 ? width / 2 : PAD_X + (i / (points.length - 1)) * innerW))
    const ys = values.map(yFor)
    const zeroY = yFor(0)
    const linePath = smoothPath(xs, ys)
    const areaPath = `${linePath} L ${xs[xs.length - 1]},${zeroY} L ${xs[0]},${zeroY} Z`
    return { linePath, areaPath, xs, ys, zeroY, minV, maxV }
  }, [points, height])

  function handleMove(e: React.MouseEvent<SVGSVGElement>) {
    if (!svgRef.current || xs.length === 0) return
    const rect = svgRef.current.getBoundingClientRect()
    const relX = ((e.clientX - rect.left) / rect.width) * width
    let nearest = 0
    let best = Infinity
    for (let i = 0; i < xs.length; i++) {
      const dist = Math.abs(xs[i] - relX)
      if (dist < best) {
        best = dist
        nearest = i
      }
    }
    setHoverIdx(nearest)
  }

  if (points.length === 0) {
    return (
      <div
        className="flex items-center justify-center rounded-xl border border-beige/10 bg-beige/[0.03] text-sm text-beige/40"
        style={{ height }}
      >
        Todavía no hay operaciones cargadas en la bitácora.
      </div>
    )
  }

  const last = points[points.length - 1].acumulado
  const lineColor = last >= 0 ? MOSS : CLAY

  return (
    <div className="relative animate-[fadeIn_300ms_ease]" style={{ height }}>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
        className="h-full w-full"
        onMouseMove={handleMove}
        onMouseLeave={() => setHoverIdx(null)}
      >
        <defs>
          <linearGradient id="equityFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={lineColor} stopOpacity="0.28" />
            <stop offset="100%" stopColor={lineColor} stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* linea base (cero) */}
        <line x1={PAD_X} y1={zeroY} x2={width - PAD_X} y2={zeroY} stroke="#7FA396" strokeOpacity="0.25" strokeWidth="1" strokeDasharray="4 4" />

        <path d={areaPath} fill="url(#equityFill)" style={{ transition: 'd 300ms ease' }} />
        <path d={linePath} fill="none" stroke={lineColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transition: 'd 300ms ease' }} />

        {hoverIdx !== null && (
          <>
            <line x1={xs[hoverIdx]} y1={PAD_Y} x2={xs[hoverIdx]} y2={height - PAD_Y} stroke="#F2FBF7" strokeOpacity="0.2" strokeWidth="1" />
            <circle cx={xs[hoverIdx]} cy={ys[hoverIdx]} r="4" fill={lineColor} stroke="#0B1F1A" strokeWidth="2" />
          </>
        )}
      </svg>

      <div className="pointer-events-none absolute left-3 top-3 text-[11px] text-beige/40">
        max +{maxV.toFixed(0)} USDT
      </div>
      <div className="pointer-events-none absolute bottom-3 left-3 text-[11px] text-beige/40">
        min {minV.toFixed(0)} USDT
      </div>

      {hoverIdx !== null && (
        <div
          className="liquid-glass pointer-events-none absolute -translate-x-1/2 -translate-y-full rounded-lg px-3 py-2 text-xs"
          style={{
            left: `${(xs[hoverIdx] / width) * 100}%`,
            top: `${(ys[hoverIdx] / height) * 100}%`,
            marginTop: '-10px',
          }}
        >
          <div className="text-beige/50">{formatFecha(points[hoverIdx].fecha)}</div>
          <div className="font-mono font-semibold tabular-nums text-ivory">
            {points[hoverIdx].acumulado >= 0 ? '+' : ''}
            {points[hoverIdx].acumulado.toFixed(2)} USDT
          </div>
        </div>
      )}
    </div>
  )
}
