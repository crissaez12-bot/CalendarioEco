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

        <div className="flex flex-1 flex-col justify-end px-6 pb-12 md:px-12 lg:px-16 lg:pb-16">
          <AnimatedHeading
            text={'Transformar la Información\nen Dominio Estratégico'}
            className="mb-4 font-display text-2xl font-bold md:text-3xl lg:text-4xl xl:text-5xl"
            style={{ letterSpacing: '-0.02em' }}
            initialDelay={200}
          />

          <FadeIn delay={800} duration={1000}>
            <p className="max-w-2xl text-base font-sans text-ivory md:text-lg">
              Herramientas cuantitativas y lectura de mercado en tiempo real para impulsar tu ejecución financiera.
            </p>
          </FadeIn>
        </div>
      </div>
    </section>
  )
}
