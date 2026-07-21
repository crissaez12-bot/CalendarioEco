import { useEffect, useState } from 'react'

export type Trend = 'bull' | 'bear'
export interface BtcTrendState {
  '1D': Trend | null
  '4H': Trend | null
  '1H': Trend | null
}

const API_URL = 'https://signal-desk-j209.onrender.com/btc-trend'

// Tendencia real de BTC (pendiente de SMA20 en las ultimas 3 velas, 1D/4H/1H), calculada en
// signal-desk con klines publicos de Bybit/OKX -- no depende de TradingView ni de alertas.
export function useBtcTrend() {
  const [trend, setTrend] = useState<BtcTrendState | null>(null)
  const [updated, setUpdated] = useState<number | null>(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const res = await fetch(API_URL)
        const data = await res.json()
        if (cancelled) return
        if (data.ok && data.trend) {
          setTrend(data.trend)
          setUpdated(data.updated ?? null)
        }
      } catch {
        // se mantiene el ultimo valor conocido
      }
    }

    load()
    const id = setInterval(load, 10 * 60 * 1000)
    return () => {
      cancelled = true
      clearInterval(id)
    }
  }, [])

  return { trend, updated }
}

export function formatUpdated(ts: number | null): string {
  if (!ts) return '—'
  const d = new Date(ts * 1000)
  return d.toLocaleString('es', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'UTC',
  }) + ' UTC'
}
