import { useEffect, useState } from 'react'

export interface Trade {
  fecha: string // 'YYYY-MM-DD'
  simbolo: string
  direccion: 'long' | 'short'
  monto: number | null
  apalancamiento: number | null
  parcial: boolean
  resultadoPct: number | null
  comision: number
  pnlNeto: number | null
}

interface OperacionesResponse {
  ok: boolean
  trades: Trade[]
}

const API_URL = 'https://signal-desk-j209.onrender.com/operaciones'

export function useOperaciones() {
  const [trades, setTrades] = useState<Trade[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const res = await fetch(API_URL)
        const data: OperacionesResponse = await res.json()
        if (cancelled) return
        if (data.ok) {
          setTrades(data.trades.filter((t) => t.pnlNeto !== null))
          setError(null)
        } else {
          setError('No se pudo leer la bitácora')
        }
      } catch {
        if (!cancelled) setError('No se pudo conectar con la bitácora')
      }
    }

    load()
    const id = setInterval(load, 5 * 60 * 1000)
    return () => {
      cancelled = true
      clearInterval(id)
    }
  }, [])

  return { trades, loading: trades === null && !error, error }
}

export interface EquityPoint {
  fecha: string
  acumulado: number
}

export function buildEquityCurve(trades: Trade[]): EquityPoint[] {
  const sorted = [...trades].sort((a, b) => a.fecha.localeCompare(b.fecha))
  let running = 0
  return sorted.map((t) => {
    running += t.pnlNeto ?? 0
    return { fecha: t.fecha, acumulado: running }
  })
}

function isoWeek(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00Z')
  const dayNum = (d.getUTCDay() + 6) % 7
  d.setUTCDate(d.getUTCDate() - dayNum + 3)
  const firstThursday = new Date(Date.UTC(d.getUTCFullYear(), 0, 4))
  const week = 1 + Math.round(((d.getTime() - firstThursday.getTime()) / 86400000 - 3 + ((firstThursday.getUTCDay() + 6) % 7)) / 7)
  return `${d.getUTCFullYear()}-W${String(week).padStart(2, '0')}`
}

export interface OperacionesStats {
  acumulado: number
  tradesPerDay: number
  mejorDia: { fecha: string; neto: number } | null
  mejorSemana: { semana: string; neto: number } | null
  maxGanadosEnUnDia: { fecha: string; n: number } | null
}

export function computeStats(trades: Trade[]): OperacionesStats {
  if (trades.length === 0) {
    return { acumulado: 0, tradesPerDay: 0, mejorDia: null, mejorSemana: null, maxGanadosEnUnDia: null }
  }

  const acumulado = trades.reduce((s, t) => s + (t.pnlNeto ?? 0), 0)

  const fechas = trades.map((t) => t.fecha).sort()
  const first = new Date(fechas[0] + 'T00:00:00Z')
  const last = new Date(fechas[fechas.length - 1] + 'T00:00:00Z')
  const dias = Math.max(1, Math.round((last.getTime() - first.getTime()) / 86400000) + 1)
  const tradesPerDay = trades.length / dias

  const porDia = new Map<string, { neto: number; ganados: number }>()
  const porSemana = new Map<string, number>()
  for (const t of trades) {
    const d = porDia.get(t.fecha) ?? { neto: 0, ganados: 0 }
    d.neto += t.pnlNeto ?? 0
    if ((t.pnlNeto ?? 0) > 0) d.ganados += 1
    porDia.set(t.fecha, d)

    const w = isoWeek(t.fecha)
    porSemana.set(w, (porSemana.get(w) ?? 0) + (t.pnlNeto ?? 0))
  }

  let mejorDia: { fecha: string; neto: number } | null = null
  let maxGanadosEnUnDia: { fecha: string; n: number } | null = null
  for (const [fecha, v] of porDia) {
    if (!mejorDia || v.neto > mejorDia.neto) mejorDia = { fecha, neto: v.neto }
    if (!maxGanadosEnUnDia || v.ganados > maxGanadosEnUnDia.n) maxGanadosEnUnDia = { fecha, n: v.ganados }
  }

  let mejorSemana: { semana: string; neto: number } | null = null
  for (const [semana, neto] of porSemana) {
    if (!mejorSemana || neto > mejorSemana.neto) mejorSemana = { semana, neto }
  }

  return { acumulado, tradesPerDay, mejorDia, mejorSemana, maxGanadosEnUnDia }
}

export interface MonthSummary {
  month: string // 'YYYY-MM'
  neto: number
  n: number
}

export function groupByMonth(trades: Trade[]): MonthSummary[] {
  const map = new Map<string, MonthSummary>()
  for (const t of trades) {
    const month = t.fecha.slice(0, 7)
    const entry = map.get(month) ?? { month, neto: 0, n: 0 }
    entry.neto += t.pnlNeto ?? 0
    entry.n += 1
    map.set(month, entry)
  }
  return [...map.values()].sort((a, b) => b.month.localeCompare(a.month))
}

const MONTH_NAMES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']

export function formatMonth(month: string): string {
  const [y, m] = month.split('-')
  return `${MONTH_NAMES[Number(m) - 1]} ${y}`
}

export function formatFecha(fecha: string): string {
  const [y, m, d] = fecha.split('-')
  return `${d}/${m}/${y}`
}
