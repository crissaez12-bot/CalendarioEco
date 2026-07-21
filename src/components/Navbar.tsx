import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import logo from '../assets/logo.png'

const NAV_LINKS = [
  { label: 'General', to: '/general' },
  { label: 'Monte Carlo', to: '/monte-carlo' },
  { label: 'News', to: '/news' },
  { label: 'Calendario', to: '/calendario' },
  { label: 'Earnings', to: '/earnings' },
]

// Horas en ET (America/New_York), formato decimal 0-24. Ciclo continuo de
// sesiones globales — el ultimo tramo (China) cruza medianoche.
interface SessionWindow {
  startHour: number
  endHour: number
  countryCode?: string
  label: string
}

const SESSION_WINDOWS: SessionWindow[] = [
  { startHour: 16, endHour: 17, countryCode: 'us', label: 'After-Market' },
  { startHour: 17, endHour: 18, label: 'Close Market' },
  { startHour: 18, endHour: 20, countryCode: 'nz', label: 'Open' },
  { startHour: 20, endHour: 21.5, countryCode: 'jp', label: 'Open' },
  { startHour: 21.5, endHour: 4, countryCode: 'cn', label: 'Open' },
  { startHour: 4, endHour: 9.5, countryCode: 'gb', label: 'Open' },
  { startHour: 9.5, endHour: 16, countryCode: 'us', label: 'Open' },
]

function getEtHourDecimal(now: Date) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(now)
  const hour = Number(parts.find((p) => p.type === 'hour')?.value)
  const minute = Number(parts.find((p) => p.type === 'minute')?.value)
  return hour + minute / 60
}

function getCurrentSession(etHour: number): SessionWindow {
  return (
    SESSION_WINDOWS.find((w) =>
      w.startHour < w.endHour ? etHour >= w.startHour && etHour < w.endHour : etHour >= w.startHour || etHour < w.endHour,
    ) ?? SESSION_WINDOWS[0]
  )
}

function SessionCycleClock() {
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30_000)
    return () => clearInterval(id)
  }, [])

  const session = getCurrentSession(getEtHourDecimal(now))

  return (
    <div className="flex items-center gap-2">
      <span
        className="h-2 w-2 flex-shrink-0 rounded-full"
        style={{ background: '#5FE6AE', boxShadow: '0 0 6px 1px rgba(95,230,174,0.7)' }}
      />
      {session.countryCode ? (
        <img
          src={`https://flagcdn.com/w40/${session.countryCode}.png`}
          alt=""
          className="h-3.5 w-5 flex-shrink-0 rounded-[2px] object-cover"
        />
      ) : (
        <span className="text-sm leading-none">🔴</span>
      )}
      <span className="whitespace-nowrap text-xs font-medium text-ivory">{session.label}</span>
    </div>
  )
}

type VolLevel = 'Low' | 'Mid' | 'High'

const VOL_STYLES: Record<VolLevel, { text: string; bg: string }> = {
  Low: { text: '#5FE6AE', bg: 'rgba(95,230,174,0.14)' },
  Mid: { text: '#F2FBF7', bg: 'rgba(127,163,150,0.14)' },
  High: { text: '#FF6B6B', bg: 'rgba(255,107,107,0.14)' },
}

function classifyAtrPct(atrPct: number): VolLevel {
  if (atrPct < 0.5) return 'Low'
  if (atrPct < 1.2) return 'Mid'
  return 'High'
}

function MarketVolBadge() {
  const [level, setLevel] = useState<VolLevel | null>(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        // Alerta de TradingView en CRYPTOCAP:TOTAL (1h, indicador ATR) -> webhook a
        // signal-desk (/total-atr), que guarda el ultimo valor. Se actualiza sola
        // cada vez que cierra una vela de 1h (via el cron de la alerta en TV).
        const res = await fetch('https://signal-desk-j209.onrender.com/total-atr')
        const data = await res.json()
        if (!cancelled && typeof data?.atr_pct === 'number') {
          setLevel(classifyAtrPct(data.atr_pct))
        }
      } catch {
        // se mantiene el ultimo valor conocido (sin badge si nunca cargó)
      }
    }

    load()
    const id = setInterval(load, 10 * 60 * 1000)
    return () => {
      cancelled = true
      clearInterval(id)
    }
  }, [])

  if (!level) return null
  const style = VOL_STYLES[level]

  return (
    <span
      className="whitespace-nowrap rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide"
      style={{ background: style.bg, color: style.text }}
      title="Volatilidad del mercado crypto — ATR(14) real de CRYPTOCAP:TOTAL, 1h, via alerta de TradingView"
    >
      Vol {level}
    </span>
  )
}

export default function Navbar() {
  return (
    <nav className="liquid-glass grid grid-cols-[1fr_auto_1fr] items-center rounded-xl px-4 py-2">
      <Link to="/" className="flex items-center justify-self-start gap-2.5">
        <img src={logo} alt="" className="h-12 w-auto flex-shrink-0 md:h-14" />
        <span className="whitespace-nowrap font-logo text-lg font-medium tracking-tight text-ivory md:text-2xl">
          The Empire Session
        </span>
      </Link>

      <div className="hidden items-center gap-8 text-sm md:flex">
        {NAV_LINKS.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `transition-colors ${isActive ? 'text-ivory' : 'text-ivory/70 hover:text-ivory'}`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </div>

      <div className="hidden items-center justify-self-end gap-3 md:flex">
        <SessionCycleClock />
        <MarketVolBadge />
      </div>
    </nav>
  )
}
