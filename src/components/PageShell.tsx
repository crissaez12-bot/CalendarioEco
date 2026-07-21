import type { ReactNode } from 'react'
import Navbar from './Navbar'
import TickerBar from './TickerBar'

interface PageShellProps {
  children: ReactNode
}

export default function PageShell({ children }: PageShellProps) {
  return (
    <div className="min-h-screen bg-bgApp text-ivory">
      <div className="flex flex-col gap-3 px-6 pt-6 md:px-12 lg:px-16">
        <Navbar />
        <TickerBar />
      </div>
      <main className="px-6 py-10 md:px-12 lg:px-16">{children}</main>
    </div>
  )
}
