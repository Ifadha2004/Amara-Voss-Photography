const exploreLinks = [
  { label: "Work", href: "#work" },
  { label: "Events", href: "#events" },
  { label: "About", href: "#about" },
  { label: "Book a shoot", href: "#contact" },
]

const socialLinks = [
  { label: "Instagram", href: "https://instagram.com" },
  { label: "Behance", href: "https://behance.net" },
  { label: "Pinterest", href: "https://pinterest.com" },
]

function Footer() {
  return (
    <footer className="bg-surface text-sm text-muted">
      <div className="mx-auto grid max-w-6xl gap-8 px-6 pb-10 pt-14 sm:grid-cols-[2fr_1fr_1fr]">
        <div>
          <a href="#home" className="font-heading text-lg font-bold text-ink">
            Amara<span className="text-accent">.</span>Voss
          </a>
          <p className="mt-3 max-w-[32ch]">
            Portrait and landscape photography. Based in Dubai, available worldwide.
          </p>
        </div>
        <nav aria-label="Footer">
          <p className="mb-3 text-xs uppercase tracking-widest text-ink">Explore</p>
          <ul className="space-y-2">
            {exploreLinks.map((link) => (
              <li key={link.label}>
                <a href={link.href} className="transition-colors hover:text-accent">{link.label}</a>
              </li>
            ))}
          </ul>
        </nav>
        <div>
          <p className="mb-3 text-xs uppercase tracking-widest text-ink">Follow</p>
          <ul className="space-y-2">
            {socialLinks.map((link) => (
              <li key={link.label}>
                <a href={link.href} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-accent">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-2 border-t border-white/10 px-6 py-5 sm:flex-row sm:justify-between">
        <p>&copy; 2026 Amara Voss Photography</p>
        <a href="#home" className="hover:text-accent">Back to top &uarr;</a>
      </div>
    </footer>
  )
}

export default Footer