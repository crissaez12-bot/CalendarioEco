import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { ASSET_DETAIL, ASSET_ICON, DATA, estimateRR, type Timeframe } from '../data/monteCarloData'

interface AssetDrawerProps {
  ticker: string | null
  timeframe: Timeframe
  onClose: () => void
}

export default function AssetDrawer({ ticker, timeframe, onClose }: AssetDrawerProps) {
  const closeBtnRef = useRef<HTMLButtonElement>(null)
  const isOpen = ticker !== null

  useEffect(() => {
    if (isOpen) {
      closeBtnRef.current?.focus()
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape' && isOpen) onClose()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [isOpen, onClose])

  const detail = ticker ? ASSET_DETAIL[ticker] : null
  const asset = ticker ? DATA[timeframe].find((r) => r.ticker === ticker) : null

  const { ratio, avgTrade } = detail ? estimateRR(detail.stats) : { ratio: 0, avgTrade: 0 }

  return createPortal(
    <>
      <div
        className={`fixed inset-0 z-40 bg-navy/70 transition-opacity ${
          isOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={onClose}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-title"
        className={`liquid-glass fixed right-0 top-0 z-50 flex h-full w-full max-w-[440px] flex-col border-l border-beige/20 text-ivory transition-transform duration-200 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {detail && asset && (
          <>
            <div className="flex items-start justify-between gap-3 border-b border-beige/10 px-6 py-5">
              <div className="flex items-center gap-3">
                <img
                  src={ASSET_ICON[asset.ticker]}
                  alt=""
                  className="h-10 w-10 flex-shrink-0 rounded-full bg-beige/5 object-cover"
                />
                <div>
                  <h2 id="drawer-title" className="mb-1 text-xl font-medium" style={{ letterSpacing: '-0.02em' }}>
                    {asset.name}
                  </h2>
                  <div className="font-mono text-xs text-beige/50">
                    {asset.ticker} &middot; Nivel {asset.tier} &middot; backtest 1h
                  </div>
                </div>
              </div>
              <button
                ref={closeBtnRef}
                type="button"
                onClick={onClose}
                aria-label="Cerrar"
                className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg border border-beige/15 text-beige hover:text-ivory"
              >
                &times;
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6">
              <section className="mb-7">
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-beige/50">Cómo operar</h3>
                <ol className="flex flex-col gap-3">
                  {detail.instructions.map((text, i) => (
                    <li key={i} className="flex gap-3 text-sm leading-relaxed text-beige">
                      <span className="mt-0.5 flex h-[18px] w-[18px] flex-shrink-0 items-center justify-center rounded bg-beige/15 font-mono text-[10px] font-semibold text-ivory">
                        {i + 1}
                      </span>
                      <span>{text}</span>
                    </li>
                  ))}
                </ol>
              </section>

              <section className="mb-7">
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-beige/50">Pros y contras</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-moss">Pros</div>
                    <ul className="flex flex-col gap-2">
                      {detail.pros.map((text, i) => (
                        <li key={i} className="flex gap-2 text-xs leading-relaxed text-beige">
                          <span className="flex-shrink-0 font-semibold text-moss">+</span>
                          <span>{text}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <div className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-clay">Contras</div>
                    <ul className="flex flex-col gap-2">
                      {detail.cons.map((text, i) => (
                        <li key={i} className="flex gap-2 text-xs leading-relaxed text-beige">
                          <span className="flex-shrink-0 font-semibold text-clay">&minus;</span>
                          <span>{text}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </section>

              <section>
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-beige/50">R:R estimado</h3>
                <div className="flex items-center gap-4 rounded-lg border border-beige/10 bg-beige/5 px-4 py-4">
                  <div className="font-mono text-2xl font-bold tabular-nums text-ivory">{ratio.toFixed(1)} : 1</div>
                  <div className="text-xs leading-relaxed text-beige/70">
                    reward : risk, estimado a partir del backtest
                    <span className="mt-1 block text-[10px] text-beige/40">
                      Estimado asumiendo TP≈1.5% — el SL real es dinámico (ATR/banda), pendiente de medirlo trade a trade.
                    </span>
                  </div>
                </div>
                <div className="mt-3 flex gap-3">
                  <div className="flex-1 rounded-lg border border-beige/10 bg-beige/5 px-3 py-2">
                    <div className="text-[10px] uppercase tracking-wider text-beige/40">Win rate</div>
                    <div className="font-mono text-sm font-semibold tabular-nums text-ivory">{detail.stats.wr.toFixed(1)}%</div>
                  </div>
                  <div className="flex-1 rounded-lg border border-beige/10 bg-beige/5 px-3 py-2">
                    <div className="text-[10px] uppercase tracking-wider text-beige/40">Trades (n)</div>
                    <div className="font-mono text-sm font-semibold tabular-nums text-ivory">{detail.stats.n}</div>
                  </div>
                  <div className="flex-1 rounded-lg border border-beige/10 bg-beige/5 px-3 py-2">
                    <div className="text-[10px] uppercase tracking-wider text-beige/40">Prom. / trade</div>
                    <div className="font-mono text-sm font-semibold tabular-nums text-ivory">
                      {avgTrade >= 0 ? '+' : ''}
                      {avgTrade.toFixed(2)}%
                    </div>
                  </div>
                </div>
              </section>
            </div>

            <div className="border-t border-beige/10 bg-beige/5 px-6 py-3 text-[11px] text-beige/40">
              Ficha fija por activo, definida en el backtesting al detalle — no cambia con el timeframe ni se recalcula en vivo.
            </div>
          </>
        )}
      </aside>
    </>,
    document.body,
  )
}
