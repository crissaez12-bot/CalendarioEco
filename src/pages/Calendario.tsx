import PageShell from '../components/PageShell'
import { CALENDAR_SOURCE, CALENDAR_WEEK, type MacroEvent } from '../data/calendarData'

function parseNum(raw: string): number | null {
  if (!raw || raw === '-') return null
  const mult = raw.endsWith('M') ? 1e6 : raw.endsWith('K') ? 1e3 : raw.endsWith('B') ? 1e9 : 1
  const num = parseFloat(raw.replace(/[%MKB]/g, ''))
  return Number.isNaN(num) ? null : num * mult
}

function surprise(event: MacroEvent): 'beat' | 'miss' | 'inline' | null {
  const actual = parseNum(event.actual)
  const forecast = parseNum(event.forecast)
  if (actual === null || forecast === null) return null
  if (actual > forecast) return 'beat'
  if (actual < forecast) return 'miss'
  return 'inline'
}

const SURPRISE_STYLES: Record<'beat' | 'miss' | 'inline', string> = {
  beat: 'text-moss',
  miss: 'text-clay',
  inline: 'text-beige/50',
}

const SURPRISE_ICON: Record<'beat' | 'miss' | 'inline', string> = {
  beat: '▲',
  miss: '▼',
  inline: '·',
}

export default function Calendario() {
  return (
    <PageShell>
      <div className="mb-6">
        <h1 className="text-2xl font-normal md:text-3xl" style={{ letterSpacing: '-0.03em' }}>
          Calendario
        </h1>
        <p className="mt-1 text-sm text-beige/70">
          Eventos macro de impacto alto &middot; fuente: {CALENDAR_SOURCE.provider}, semana del{' '}
          {CALENDAR_SOURCE.weekLabel.toLowerCase()}
        </p>
      </div>

      <div className="mb-8 flex flex-wrap items-center gap-2">
        <span className="rounded-full border border-moss/40 bg-moss/10 px-3 py-1 text-xs font-medium text-moss">
          Impacto: {CALENDAR_SOURCE.impactFilter}
        </span>
        {CALENDAR_SOURCE.countries.map((c) => (
          <span
            key={c}
            className="rounded-full border border-beige/15 bg-beige/5 px-3 py-1 text-xs font-medium text-beige/70"
          >
            {c}
          </span>
        ))}
      </div>

      <div className="flex flex-col gap-6">
        {CALENDAR_WEEK.map((day) => (
          <section key={day.date}>
            <h2 className="mb-2 text-sm font-semibold text-ivory">{day.label}</h2>
            <div className="liquid-glass overflow-x-auto rounded-xl">
              <table className="w-full min-w-[720px] border-collapse">
                <thead>
                  <tr className="border-b border-beige/10 bg-beige/5">
                    <th className="whitespace-nowrap px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-beige/50">
                      Hora
                    </th>
                    <th className="whitespace-nowrap px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-beige/50">
                      País
                    </th>
                    <th className="whitespace-nowrap px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-beige/50">
                      Evento
                    </th>
                    <th className="whitespace-nowrap px-4 py-2.5 text-right text-[11px] font-semibold uppercase tracking-wider text-beige/50">
                      Actual
                    </th>
                    <th className="whitespace-nowrap px-4 py-2.5 text-right text-[11px] font-semibold uppercase tracking-wider text-beige/50">
                      Previsión
                    </th>
                    <th className="whitespace-nowrap px-4 py-2.5 text-right text-[11px] font-semibold uppercase tracking-wider text-beige/50">
                      Anterior
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {day.events.map((event, i) => {
                    const s = surprise(event)
                    return (
                      <tr key={i} className="border-b border-borderSubtle last:border-b-0 hover:bg-beige/5">
                        <td className="px-4 py-3 font-mono text-xs text-beige/60">{event.time}</td>
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center gap-1.5 whitespace-nowrap text-xs font-medium text-beige">
                            <img
                              src={`https://flagcdn.com/w40/${event.countryFlagCode}.png`}
                              alt=""
                              className="h-3.5 w-5 flex-shrink-0 rounded-[2px] object-cover"
                            />
                            {event.countryCode}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm font-medium text-ivory">{event.name}</td>
                        <td className="px-4 py-3 text-right">
                          <span
                            className={`inline-flex items-center gap-1 font-mono text-sm font-semibold tabular-nums ${
                              s ? SURPRISE_STYLES[s] : 'text-ivory'
                            }`}
                          >
                            {s && <span className="text-[9px]">{SURPRISE_ICON[s]}</span>}
                            {event.actual}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right font-mono text-sm text-beige/60 tabular-nums">
                          {event.forecast}
                        </td>
                        <td className="px-4 py-3 text-right font-mono text-sm text-beige/40 tabular-nums">
                          {event.previous}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </section>
        ))}
      </div>

      <p className="mt-6 text-[11px] text-beige/40">
        Datos capturados manualmente desde {CALENDAR_SOURCE.provider} el {CALENDAR_SOURCE.capturedAt} &middot; no se
        actualiza en vivo todavía &middot; ▲ actual por encima de la previsión, ▼ por debajo
      </p>
    </PageShell>
  )
}
