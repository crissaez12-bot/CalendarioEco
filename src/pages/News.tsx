import { useState } from 'react'
import PageShell from '../components/PageShell'
import newsData from '../data/newsData.json'

interface NewsItem {
  title: string
  url: string
  source: string
}

type CategoryKey = 'finanzas' | 'economia' | 'tecnologia' | 'politica' | 'crypto'

const CATEGORIES: { key: CategoryKey; label: string }[] = [
  { key: 'finanzas', label: 'Finanzas' },
  { key: 'economia', label: 'Economía' },
  { key: 'tecnologia', label: 'Tecnología' },
  { key: 'politica', label: 'Política' },
  { key: 'crypto', label: 'Crypto' },
]

const SOURCE_STYLES: Record<string, string> = {
  CNBC: 'border-ivory/25 text-ivory/80',
  Cointelegraph: 'border-moss/40 text-moss',
}

const categories = newsData.categories as Record<CategoryKey, NewsItem[]>

export default function News() {
  const [tab, setTab] = useState<CategoryKey>('finanzas')
  const items = categories[tab] ?? []

  return (
    <PageShell>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-normal md:text-3xl" style={{ letterSpacing: '-0.03em' }}>
            News
          </h1>
          <p className="mt-1 text-sm text-beige/70">
            Titulares traducidos al español &middot; click para leer la nota original
          </p>
        </div>

        <div className="liquid-glass flex flex-wrap rounded-lg p-1">
          {CATEGORIES.map((c) => (
            <button
              key={c.key}
              type="button"
              onClick={() => setTab(c.key)}
              className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${
                tab === c.key ? 'bg-ivory text-navy' : 'text-beige/60 hover:text-ivory'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      <div className="liquid-glass rounded-xl px-2 py-2">
        {items.length === 0 ? (
          <p className="px-4 py-10 text-center text-sm text-beige/50">
            Sin noticias por ahora en esta categoría — vuelve a revisar en la próxima actualización.
          </p>
        ) : (
          <div className="flex flex-col">
            {items.map((item, i) => (
              <a
                key={item.url}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-start justify-between gap-4 rounded-lg px-3 py-3 transition-colors hover:bg-beige/5 ${
                  i !== items.length - 1 ? 'border-b border-borderSubtle' : ''
                }`}
              >
                <span className="text-sm font-medium text-ivory">{item.title}</span>
                <span
                  className={`mt-0.5 flex-shrink-0 rounded border px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide ${
                    SOURCE_STYLES[item.source] ?? 'border-beige/25 text-beige/70'
                  }`}
                >
                  {item.source}
                </span>
              </a>
            ))}
          </div>
        )}
      </div>

      <p className="mt-6 text-[11px] text-beige/40">
        Última actualización: {newsData.updatedAt} hrs (Chile), {newsData.date} &middot; se actualiza automáticamente a
        las 8:00, 12:00 y 16:00 &middot; el listado se reinicia cada día a las 8:00 &middot; traducción automática, puede
        contener imprecisiones
      </p>
    </PageShell>
  )
}
