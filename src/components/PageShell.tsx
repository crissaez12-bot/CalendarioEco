import type { ReactNode } from 'react'
import Navbar from './Navbar'

interface PageShellProps {
  children: ReactNode
}

export default function PageShell({ children }: PageShellProps) {
  return (
    <div className="min-h-screen bg-bgApp text-ivory">
      <div className="px-6 pt-6 md:px-12 lg:px-16">
        <Navbar />
      </div>
      <main className="px-6 py-10 md:px-12 lg:px-16">{children}</main>
    </div>
  )
}
