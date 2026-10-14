function About() {
  return (
    <section id="about" className="mx-auto max-w-6xl px-6 py-16 lg:py-24">
      <div className="flex flex-col gap-8 sm:flex-row sm:items-center">
        <img
          src="/images/about.jpg"
          alt="Portrait of photographer Amara Voss holding a camera"
          className="aspect-square w-full rounded-md object-cover sm:w-[45%]"
        />
        <div>
          <h2 className="mb-4 font-heading text-3xl font-bold lg:text-4xl">About</h2>
          <p className="mb-4 max-w-[52ch] text-muted">
            I'm Amara, a portrait and landscape photographer based in Dubai. I chase soft light,
            quiet moments and places that feel unhurried.
          </p>
          <p className="max-w-[52ch] text-muted">
            Available for portrait sessions, family shoots and commissioned landscape work.
          </p>
        </div>
      </div>
    </section>
  )
}

export default About