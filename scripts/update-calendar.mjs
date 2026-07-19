// Corre semanalmente como Render Cron Job. Trae el calendario economico
// desde el feed publico no-oficial de ForexFactory, filtra por impacto Alto
// y por los paises "potencia" configurados, y sobreescribe
// src/data/calendarData.ts con los resultados. Si GITHUB_TOKEN esta seteado,
// commitea y pushea el cambio para que Render redespliegue el sitio estatico.

import { execSync } from 'node:child_process'
import { writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUTPUT_PATH = join(__dirname, '..', 'src', 'data', 'calendarData.ts')

const FEED_URL = 'https://nfs.faireconomy.media/ff_calendar_thisweek.json'

// Moneda -> pais que mostramos. Chile queda afuera a proposito: ningun feed
// de forex trackea CLP, se sigue cargando manual aparte.
const COUNTRY_MAP = {
  USD: { code: 'USA', flag: '🇺🇸', label: 'Estados Unidos' },
  EUR: { code: 'EUR', flag: '🇪🇺', label: 'Eurozona / Alemania' },
  GBP: { code: 'GBR', flag: '🇬🇧', label: 'Reino Unido' },
  JPY: { code: 'JPN', flag: '🇯🇵', label: 'Japón' },
  CNY: { code: 'CHN', flag: '🇨🇳', label: 'China' },
}

const WEEKDAY_LABEL = new Intl.DateTimeFormat('es-AR', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
})

function fmtTime(iso) {
  const d = new Date(iso)
  return d.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'UTC' })
}

function fmtDayLabel(iso) {
  const d = new Date(iso)
  const label = WEEKDAY_LABEL.format(d)
  return label.charAt(0).toUpperCase() + label.slice(1)
}

function esc(str) {
  return String(str).replace(/\\/g, '\\\\').replace(/'/g, "\\'")
}

async function main() {
  const res = await fetch(FEED_URL, { headers: { Accept: 'application/json' } })
  if (!res.ok) {
    throw new Error(`Feed respondio ${res.status} — probablemente rate limit. No se actualiza esta corrida.`)
  }
  const raw = await res.json()

  const filtered = raw.filter(
    (e) => e.impact === 'High' && COUNTRY_MAP[e.country] && e.date,
  )

  const byDay = new Map()
  for (const e of filtered) {
    const dayKey = e.date.slice(0, 10)
    if (!byDay.has(dayKey)) byDay.set(dayKey, [])
    const c = COUNTRY_MAP[e.country]
    byDay.get(dayKey).push({
      time: fmtTime(e.date),
      countryCode: c.code,
      countryFlag: c.flag,
      countryLabel: c.label,
      name: e.title,
      actual: e.actual || '-',
      forecast: e.forecast || '-',
      previous: e.previous || '-',
      _sortTime: e.date,
    })
  }

  const days = [...byDay.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([dayKey, events]) => ({
      date: dayKey,
      label: fmtDayLabel(dayKey + 'T00:00:00Z'),
      events: events.sort((a, b) => a._sortTime.localeCompare(b._sortTime)),
    }))

  const totalEvents = days.reduce((sum, d) => sum + d.events.length, 0)
  console.log(`Encontrados ${totalEvents} eventos de impacto alto en ${days.length} dias.`)

  const eventsTs = (events) =>
    events
      .map(
        (e) => `      {
        time: '${esc(e.time)}',
        countryCode: '${esc(e.countryCode)}',
        countryFlag: '${e.countryFlag}',
        countryLabel: '${esc(e.countryLabel)}',
        name: '${esc(e.name)}',
        actual: '${esc(e.actual)}',
        forecast: '${esc(e.forecast)}',
        previous: '${esc(e.previous)}',
      },`,
      )
      .join('\n')

  const daysTs = days
    .map(
      (d) => `  {
    date: '${d.date}',
    label: '${esc(d.label)}',
    events: [
${eventsTs(d.events)}
    ],
  },`,
    )
    .join('\n')

  const today = new Date().toISOString().slice(0, 10)

  const fileContent = `// Archivo generado automaticamente por scripts/update-calendar.mjs
// No editar a mano — se sobreescribe en cada corrida del cron job semanal.
// Fuente: ForexFactory (feed publico no oficial) · Chile no incluido, ningun
// feed de forex trackea CLP — se sigue cargando manual aparte si hace falta.

export interface MacroEvent {
  time: string
  countryCode: string
  countryFlag: string
  countryLabel: string
  name: string
  actual: string
  forecast: string
  previous: string
}

export interface MacroDay {
  date: string
  label: string
  events: MacroEvent[]
}

export const CALENDAR_SOURCE = {
  provider: 'ForexFactory',
  weekLabel: 'Semana actual',
  capturedAt: '${today}',
  impactFilter: 'Alto',
  countries: ['Estados Unidos', 'China', 'Eurozona / Alemania', 'Reino Unido', 'Japón'],
}

export const CALENDAR_WEEK: MacroDay[] = [
${daysTs}
]
`

  writeFileSync(OUTPUT_PATH, fileContent, 'utf8')
  console.log('Escrito:', OUTPUT_PATH)

  if (process.env.GITHUB_TOKEN && process.env.GIT_REPO) {
    const repo = process.env.GIT_REPO.replace('https://', '')
    const remote = `https://x-access-token:${process.env.GITHUB_TOKEN}@${repo}`
    execSync(`git config user.email "cron@empire-session.local"`, { stdio: 'inherit' })
    execSync(`git config user.name "Empire Session Cron"`, { stdio: 'inherit' })
    execSync(`git add src/data/calendarData.ts`, { stdio: 'inherit' })
    try {
      execSync(`git commit -m "chore: actualizar calendario economico semanal (${today})"`, { stdio: 'inherit' })
      execSync(`git push ${remote} HEAD:main`, { stdio: 'inherit' })
      console.log('Commit y push OK.')
    } catch (e) {
      console.log('Nada nuevo para commitear, o el push fallo:', e.message)
    }
  } else {
    console.log('GITHUB_TOKEN / GIT_REPO no seteados — solo se actualizo el archivo local, sin commit.')
  }
}

main().catch((err) => {
  console.error('ERROR en update-calendar:', err.message)
  process.exit(1)
})
