import tickerData from '../data/tickerData.json'

const money = (n: number) => `$${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

export default function TickerBar() {
  const items = tickerData.items
  if (items.length === 0) return null

  // Se duplica la lista para que la animacion (translate -50%) loopee sin corte.
  const doubled = [...items, ...items]

  return (
    <div className="liquid-glass overflow-hidden rounded-xl py-2">
      <div className="ticker-track flex w-max items-center whitespace-nowrap">
        {doubled.map((it, i) => {
          const positive = it.changePct >= 0
          return (
            <span key={i} className="flex items-center gap-2 px-4 font-mono text-xs">
              <span className="font-semibold text-ivory">{it.symbol}</span>
              <span className="text-beige/50">{money(it.price)}</span>
              <span className={positive ? 'text-moss' : 'text-clay'}>
                {positive ? '+' : ''}
                {it.changePct.toFixed(2)}%
              </span>
            </span>
          )
        })}
      </div>
    </div>
  )
}
