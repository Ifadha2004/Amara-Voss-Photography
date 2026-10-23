function Hero() {
  return (
    <section
      id="home"
      className="flex min-h-[70vh] items-center bg-cover bg-center px-6 py-16"
      style={{
        backgroundImage:
          "linear-gradient(to right, rgba(17,17,17,0.92), rgba(17,17,17,0.45)), url('/images/hero.webp')",
      }}
    >
      <div className="mx-auto w-full max-w-6xl">
        <h1 className="max-w-[14ch] font-heading text-5xl font-bold leading-tight sm:text-6xl lg:text-7xl">
          Amara Voss Photography
        </h1>
        <p className="mb-8 mt-4 max-w-[34ch] text-lg text-muted">
          Portraits and landscapes shaped by patient light.
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <a href="#work" className="inline-block rounded-md bg-accent px-6 py-3 font-medium text-canvas hover:brightness-110">
            View my work
          </a>
          <a href="#events" className="inline-block rounded-md border border-white/25 px-6 py-3 font-medium text-ink transition-colors hover:border-accent hover:text-accent">
            Upcoming events
          </a>
        </div>
      </div>
    </section>
  )
}

export default Hero