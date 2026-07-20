import { Link, NavLink } from 'react-router-dom'
import logo from '../assets/logo.png'

const NAV_LINKS = [
  { label: 'General', to: '/general' },
  { label: 'Monte Carlo', to: '/monte-carlo' },
  { label: 'News', to: '/news' },
  { label: 'Calendario', to: '/calendario' },
  { label: 'Earnings', to: '/earnings' },
]

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

      <div />
    </nav>
  )
}
