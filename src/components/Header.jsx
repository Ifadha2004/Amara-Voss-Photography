// function Header() {
//   return (
//     <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-white/5 bg-canvas/75 px-6 backdrop-blur-md">
//       <a href="#home" className="font-heading text-lg font-bold text-ink">
//         Amara<span className="text-accent">.</span>Voss
//       </a>
//       <nav aria-label="Main" className="flex items-center gap-3 sm:gap-6">
//         <ul className="flex gap-3 sm:gap-8">
//           <li><a href="#work" className="text-sm text-muted transition-colors hover:text-ink">Work</a></li>
//           <li><a href="#about" className="text-sm text-muted transition-colors hover:text-ink">About</a></li>
//         </ul>
//         <a href="#contact" className="whitespace-nowrap rounded-full bg-accent px-4 py-2 text-sm font-medium text-canvas hover:brightness-110">
//           Book<span className="hidden sm:inline"> a shoot</span>
//         </a>
//       </nav>
//     </header>
//   )
// }

// export default Header

import { useState } from "react"

const navLinks = [
  { label: "Work", href: "#work" },
  { label: "Events", href: "#events" },
  { label: "About", href: "#about" },
]

const linkClass = "text-sm text-muted transition-colors hover:text-ink"
const ctaClass =
  "rounded-full bg-accent px-4 py-2 text-sm font-medium text-canvas hover:brightness-110"

function Header() {
  const [isOpen, setIsOpen] = useState(false)

  function closeMenu() {
    setIsOpen(false)
  }

  return (
    <header className="sticky top-0 z-10 border-b border-white/5 bg-canvas/75 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between px-6">
        <a href="#home" className="font-heading text-lg font-bold text-ink">
          Amara<span className="text-accent">.</span>Voss
        </a>

        <nav aria-label="Main" className="hidden items-center gap-8 sm:flex">
          <ul className="flex gap-8">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a href={link.href} className={linkClass}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <a href="#contact" className={ctaClass}>
            Contact
          </a>
        </nav>

        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-controls="mobile-menu"
          aria-label={isOpen ? "Close menu" : "Open menu"}
          className="text-ink sm:hidden"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            aria-hidden="true"
          >
            {isOpen ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </div>

      {isOpen && (
        <nav
          id="mobile-menu"
          aria-label="Mobile"
          className="border-t border-white/5 px-6 py-4 sm:hidden"
        >
          <ul className="flex flex-col items-start gap-4">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a href={link.href} onClick={closeMenu} className={linkClass}>
                  {link.label}
                </a>
              </li>
            ))}
            <li>
              <a href="#contact" onClick={closeMenu} className={`${ctaClass} inline-block`}>
                Contact
              </a>
            </li>
          </ul>
        </nav>
      )}
    </header>
  )
}

export default Header