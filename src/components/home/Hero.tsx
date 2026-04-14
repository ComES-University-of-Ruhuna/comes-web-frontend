import HeroWave from './HeroWave'

const Hero = () => {
  return (
    <section className="relative flex w-full flex-col items-center justify-center overflow-hidden px-5 sm:px-10 md:px-20 min-h-[100dvh] bg-[#1F2246]">
      {/* Background layer */}
      <div className="absolute inset-0 z-0">
        <HeroWave />
      </div>

      {/* Hero content container */}
      <div className="relative z-10 flex w-full flex-col items-start justify-center gap-2 py-12 md:py-8">
        <div className="flex w-full flex-col items-start justify-center gap-4">
          
          {/* Top badge / link */}
          <a href="#" className="group inline-flex items-center justify-start gap-1 py-1 cursor-pointer">
            <span className="justify-center text-left text-sm font-medium text-white/80 hover:text-white underline underline-offset-4 transition-colors">
              Registration Open for Membership
            </span>
            <svg className="h-4 w-4 text-white/80 group-hover:text-white transition-transform group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="m9 18 6-6-6-6"/>
            </svg>
          </a>

          {/* Headings */}
          <div className="flex w-full max-w-[900px] flex-col items-start justify-center gap-6 text-left">
            <h1 className="w-full text-4xl md:text-5xl lg:text-[64px] font-semibold leading-[1.1] tracking-tight text-white">
              The official student society for Computer Engineering at the Faculty of Engineering, University of Ruhuna.
            </h1>
            <p className="w-full text-lg md:text-xl font-normal leading-relaxed text-white/80 max-w-[700px]">
              Empowering students, fostering innovation, and building a vibrant tech community.
            </p>
          </div>

          {/* CTA */}
          <button className="group mt-4 inline-flex items-center justify-start gap-2 rounded-md bg-indigo-600 px-6 py-3.5 transition-colors hover:bg-[#5851e5] cursor-pointer shadow-lg shadow-[#635BFF]/20">
            <span className="justify-center text-sm md:text-base font-medium text-white">
              Learn More
            </span>
            <svg className="h-4 w-4 text-white transition-transform group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="m9 18 6-6-6-6"/>
            </svg>
          </button>
          
        </div>
      </div>
    </section>
  )
}

export default Hero
