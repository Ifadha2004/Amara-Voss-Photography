function Header() {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-white/5 bg-canvas/75 px-6 backdrop-blur-md">
      <a href="#home" className="font-heading text-lg font-bold text-ink">
        Amara<span className="text-accent">.</span>Voss
      </a>
      <nav aria-label="Main" className="flex items-center gap-3 sm:gap-6">
        <ul className="flex gap-3 sm:gap-8">
          <li><a href="#work" className="text-sm text-muted transition-colors hover:text-ink">Work</a></li>
          <li><a href="#about" className="text-sm text-muted transition-colors hover:text-ink">About</a></li>
        </ul>
        <a href="#contact" className="whitespace-nowrap rounded-full bg-accent px-4 py-2 text-sm font-medium text-canvas hover:brightness-110">
          Book<span className="hidden sm:inline"> a shoot</span>
        </a>
      </nav>
    </header>
  )
}

export default Header