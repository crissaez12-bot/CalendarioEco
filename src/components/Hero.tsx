import FadeIn from './FadeIn'
import AnimatedHeading from './AnimatedHeading'
import Navbar from './Navbar'

const VIDEO_URL =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260403_050628_c4e32401-fab4-4a27-b7a8-6e9291cd5959.mp4'

// Duracion de un ciclo completo amanecer -> mediodia -> tarde -> atardecer -> noche.
const DAY_NIGHT_CYCLE_SECONDS = 90

export default function Hero() {
  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-black">
      <video
        className="day-night-video-filter absolute inset-0 z-0 h-full w-full object-cover"
        style={{ animationDuration: `${DAY_NIGHT_CYCLE_SECONDS}s` }}
        src={VIDEO_URL}
        autoPlay
        loop
        muted
        playsInline
      />
      <div
        className="day-night-tint pointer-events-none absolute inset-0 z-[1]"
        style={{ animationDuration: `${DAY_NIGHT_CYCLE_SECONDS}s` }}
      />

      <div className="relative z-10 flex min-h-screen flex-col text-ivory">
        <div className="px-6 pt-6 md:px-12 lg:px-16">
          <Navbar />
        </div>

        <div className="flex flex-1 flex-col justify-end px-6 pb-12 md:px-12 lg:grid lg:grid-cols-2 lg:items-end lg:px-16 lg:pb-16">
          <div>
            <AnimatedHeading
              text={'Mastering Markets\nwith Uncompromising Precision.'}
              className="mb-4 text-4xl font-normal md:text-5xl lg:text-6xl xl:text-7xl"
              style={{ letterSpacing: '-0.04em' }}
              initialDelay={200}
            />

            <FadeIn delay={800} duration={1000}>
              <p className="mb-5 text-base text-beige md:text-lg">
                Advanced analytics, quantitative edge, and market structure tailored for high-performance execution.
              </p>
            </FadeIn>

            <FadeIn delay={1200} duration={1000}>
              <div className="flex flex-wrap gap-4">
                <button
                  type="button"
                  className="rounded-lg bg-ivory px-8 py-3 font-medium text-navy transition-colors hover:bg-beige"
                >
                  Start a Chat
                </button>
                <button
                  type="button"
                  className="liquid-glass rounded-lg border border-beige/30 px-8 py-3 font-medium text-ivory transition-colors hover:bg-ivory hover:text-navy"
                >
                  Explore Now
                </button>
              </div>
            </FadeIn>
          </div>

          <div className="mt-10 flex items-end justify-start lg:mt-0 lg:justify-end">
            <FadeIn delay={1400} duration={1000}>
              <div className="liquid-glass rounded-xl border border-beige/30 px-6 py-3">
                <span className="text-lg font-light text-ivory md:text-xl lg:text-2xl">
                  Monte Carlo. News. Calendario.
                </span>
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  )
}
