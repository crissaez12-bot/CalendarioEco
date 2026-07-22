import { useEffect, useState } from 'react'
import type { Signal, Timeframe } from './monteCarloData'

export interface McLiveRow {
  close: number
  basis: number
  upper: number
  lower: number
  atr_pct: number
  signal: Signal
  oscConfirm: boolean
  updated: number | null
}

export interface McHistoryEntry {
  ticker: string
  tf: Timeframe
  signal: Signal
  ts: number
}

export type McLiveData = Record<Timeframe, Record<string, McLiveRow>> & { history?: McHistoryEntry[] }

const API_URL = 'https://signal-desk-j209.onrender.com/mc-data'

// Piloto Monte Carlo (1h: Nivel 1 · 15m: los que pasan WR>=60% en esa temporalidad):
// Bollinger/ATR se calculan en signal-desk desde klines publicos (no dependen de
// TradingView); signal/oscConfirm vienen de alertas reales de PunkAlgo Signals/
// Oscillator via webhook. Ver mc_feed.py y AGENTS.md.
export function useMcLive() {
  const [data, setData] = useState<McLiveData | null>(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const res = await fetch(API_URL)
        const json = await res.json()
        if (!cancelled && json && typeof json === 'object') {
          setData(json)
        }
      } catch {
        // se mantiene el ultimo valor conocido
      }
    }

    load()
    const id = setInterval(load, 60_000)
    return () => {
      cancelled = true
      clearInterval(id)
    }
  }, [])

  return data
}

export function formatMcUpdated(ts: number | null): string {
  if (!ts) return 'sin señales aún'
  const diffMin = Math.max(0, Math.round((Date.now() / 1000 - ts) / 60))
  if (diffMin < 1) return 'hace instantes'
  if (diffMin < 60) return `hace ${diffMin} min`
  const diffH = Math.round(diffMin / 60)
  return `hace ${diffH} h`
}
