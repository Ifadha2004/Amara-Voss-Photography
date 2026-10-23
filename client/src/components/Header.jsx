// import { useState } from "react"
// import { authClient } from "../lib/auth-client"
// import AuthModal from "./AuthModal"

// const navLinks = [
//   { label: "Work", href: "#work" },
//   { label: "Events", href: "#events" },
//   { label: "About", href: "#about" },
// ]

// const linkClass = "text-sm text-muted transition-colors hover:text-ink"
// const ctaClass =
//   "rounded-full bg-accent px-4 py-2 text-sm font-medium text-canvas hover:brightness-110"

// function Header() {
//   const [isOpen, setIsOpen] = useState(false)
//   const [authOpen, setAuthOpen] = useState(false)

//   // Reads the logged-in user from the session cookie. Re-renders by itself
//   // after sign in or sign out. `data` is null when nobody is signed in.
//   const { data: session, isPending } = authClient.useSession()
//   const firstName = session?.user?.name?.split(" ")[0]

//   function closeMenu() {
//     setIsOpen(false)
//   }

//   function openSignIn() {
//     setIsOpen(false)
//     setAuthOpen(true)
//   }

//   async function handleSignOut() {
//     setIsOpen(false)
//     await authClient.signOut()
//   }

//   return (
//     <>
//       <header className="sticky top-0 z-10 border-b border-white/5 bg-canvas/75 backdrop-blur-md">
//         <div className="flex h-16 items-center justify-between px-6">
//           <a href="#home" className="font-heading text-lg font-bold text-ink">
//             Amara<span className="text-accent">.</span>Voss
//           </a>

//           <nav aria-label="Main" className="hidden items-center gap-6 sm:flex lg:gap-8">
//             <ul className="flex gap-6 lg:gap-8">
//               {navLinks.map((link) => (
//                 <li key={link.href}>
//                   <a href={link.href} className={linkClass}>
//                     {link.label}
//                   </a>
//                 </li>
//               ))}
//             </ul>

//             {!isPending &&
//               (session ? (
//                 <>
//                   <span className="hidden text-sm text-ink lg:inline">Hi, {firstName}</span>
//                   <button type="button" onClick={handleSignOut} className={linkClass}>
//                     Sign out
//                   </button>
//                 </>
//               ) : (
//                 <button type="button" onClick={openSignIn} className={linkClass}>
//                   Sign in
//                 </button>
//               ))}

//             <a href="#contact" className={ctaClass}>
//               Contact
//             </a>
//           </nav>

//           <button
//             type="button"
//             onClick={() => setIsOpen(!isOpen)}
//             aria-expanded={isOpen}
//             aria-controls="mobile-menu"
//             aria-label={isOpen ? "Close menu" : "Open menu"}
//             className="text-ink sm:hidden"
//           >
//             <svg
//               viewBox="0 0 24 24"
//               className="h-6 w-6"
//               fill="none"
//               stroke="currentColor"
//               strokeWidth="1.5"
//               strokeLinecap="round"
//               aria-hidden="true"
//             >
//               {isOpen ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
//             </svg>
//           </button>
//         </div>

//         {isOpen && (
//           <nav
//             id="mobile-menu"
//             aria-label="Mobile"
//             className="border-t border-white/5 px-6 py-4 sm:hidden"
//           >
//             <ul className="flex flex-col items-start gap-4">
//               {navLinks.map((link) => (
//                 <li key={link.href}>
//                   <a href={link.href} onClick={closeMenu} className={linkClass}>
//                     {link.label}
//                   </a>
//                 </li>
//               ))}

//               {!isPending && (
//                 <li>
//                   {session ? (
//                     <div className="flex flex-col items-start gap-4">
//                       <span className="text-sm text-ink">Hi, {firstName}</span>
//                       <button type="button" onClick={handleSignOut} className={linkClass}>
//                         Sign out
//                       </button>
//                     </div>
//                   ) : (
//                     <button type="button" onClick={openSignIn} className={linkClass}>
//                       Sign in
//                     </button>
//                   )}
//                 </li>
//               )}

//               <li>
//                 <a href="#contact" onClick={closeMenu} className={`${ctaClass} inline-block`}>
//                   Contact
//                 </a>
//               </li>
//             </ul>
//           </nav>
//         )}
//       </header>

//       {/* Outside <header> on purpose: the header's backdrop-blur would trap a
//           fixed-position modal inside the header's box instead of the full screen. */}
//       {authOpen && <AuthModal onClose={() => setAuthOpen(false)} />}
//     </>
//   )
// }

// export default Header

import { useState } from "react"
import { authClient } from "../lib/auth-client"
import AuthModal from "./AuthModal"
import AccountMenu from "./AccountMenu"

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
  const [authOpen, setAuthOpen] = useState(false)

  const { data: session, isPending } = authClient.useSession()

  function closeMenu() {
    setIsOpen(false)
  }

  function openSignIn() {
    setIsOpen(false)
    setAuthOpen(true)
  }

  async function handleSignOut() {
    setIsOpen(false)
    await authClient.signOut()
  }

  return (
    <>
      <header className="sticky top-0 z-10 border-b border-white/5 bg-canvas/75 backdrop-blur-md">
        <div className="flex h-16 items-center justify-between px-6">
          <a href="#home" className="font-heading text-lg font-bold text-ink">
            Amara<span className="text-accent">.</span>Voss
          </a>

          <nav aria-label="Main" className="hidden items-center gap-6 sm:flex lg:gap-8">
            <ul className="flex gap-6 lg:gap-8">
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

            {!isPending &&
              (session ? (
                <AccountMenu user={session.user} onSignOut={handleSignOut} />
              ) : (
                <button type="button" onClick={openSignIn} className={linkClass}>
                  Sign in
                </button>
              ))}
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

              {!isPending && (
                <li className="w-full border-t border-white/5 pt-4">
                  {session ? (
                    <div className="flex flex-col items-start gap-3">
                      <div>
                        <p className="text-sm text-ink">{session.user.name}</p>
                        <p className="text-xs text-muted">{session.user.email}</p>
                      </div>
                      <button type="button" onClick={handleSignOut} className={linkClass}>
                        Sign out
                      </button>
                    </div>
                  ) : (
                    <button type="button" onClick={openSignIn} className={linkClass}>
                      Sign in
                    </button>
                  )}
                </li>
              )}
            </ul>
          </nav>
        )}
      </header>

      {/* Outside <header> on purpose: the header's backdrop-blur would trap a
          fixed-position modal inside the header's box instead of the full screen. */}
      {authOpen && <AuthModal onClose={() => setAuthOpen(false)} />}
    </>
  )
}

export default Header