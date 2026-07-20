import { Link, NavLink } from 'react-router-dom'
import logo from '../assets/logo.png'

const NAV_LINKS = [
  { label: 'Monte Carlo', to: '/monte-carlo' },
  { label: 'News', to: '/news' },
  { label: 'Calendario', to: '/calendario' },
]

export default function Navbar() {
  return (
    <nav className="liquid-glass flex items-center justify-between rounded-xl px-4 py-2">
      <Link to="/" className="flex items-center gap-2.5">
        <img src={logo} alt="" className="h-12 w-auto flex-shrink-0 md:h-14" />
        <span className="whitespace-nowrap text-lg font-semibold tracking-tight text-ivory md:text-2xl">
          The Empire <span className="italic">Session</span>
        </span>
      </Link>

      <div className="hidden items-center gap-8 text-sm md:flex">
        {NAV_LINKS.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `transition-colors ${isActive ? 'text-ivory' : 'text-beige/60 hover:text-beige'}`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </div>

      <button
        type="button"
        className="rounded-lg bg-ivory px-6 py-2 text-sm font-medium text-navy transition-colors hover:bg-beige"
      >
        Start a Chat
      </button>
    </nav>
  )
}
