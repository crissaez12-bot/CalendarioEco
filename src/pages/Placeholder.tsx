import PageShell from '../components/PageShell'

interface PlaceholderProps {
  title: string
  description: string
}

export default function Placeholder({ title, description }: PlaceholderProps) {
  return (
    <PageShell>
      <div className="liquid-glass flex min-h-[50vh] flex-col items-start justify-center rounded-xl border border-beige/20 px-8 py-12">
        <span className="mb-3 text-xs font-medium uppercase tracking-widest text-beige/60">
          Próximamente
        </span>
        <h1 className="mb-3 text-3xl font-normal md:text-4xl" style={{ letterSpacing: '-0.03em' }}>
          {title}
        </h1>
        <p className="max-w-xl text-base text-beige">{description}</p>
      </div>
    </PageShell>
  )
}
