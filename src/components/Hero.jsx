function Hero() {
  return (
    <section
      id="home"
      className="flex min-h-[70vh] items-center bg-cover bg-center px-6 py-16"
      style={{
        backgroundImage:
          "linear-gradient(to right, rgba(17,17,17,0.92), rgba(17,17,17,0.45)), url('/images/hero.jpg')",
      }}
    >
      <div className="mx-auto w-full max-w-6xl">
        <h1 className="max-w-[14ch] font-heading text-5xl font-bold leading-tight sm:text-6xl lg:text-7xl">
          Amara Voss Photography
        </h1>
        <p className="mb-8 mt-4 max-w-[34ch] text-lg text-muted">
          Portraits and landscapes shaped by patient light.
        </p>
        <a href="#work" className="inline-block rounded-md bg-accent px-6 py-3 font-medium text-canvas hover:brightness-110">
          View my work
        </a>
      </div>
    </section>
  )
}

export default Hero