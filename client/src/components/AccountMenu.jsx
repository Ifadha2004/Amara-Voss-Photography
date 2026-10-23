import { useEffect, useRef, useState } from "react"

function AccountMenu({ user, onSignOut }) {
  const [open, setOpen] = useState(false)
  const menuRef = useRef(null)

  const initial = (user.name || user.email || "?").charAt(0).toUpperCase()

  // While the menu is open, close it on an outside click or the Escape key.
  useEffect(() => {
    if (!open) return

    function handleClick(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false)
      }
    }
    function handleKey(event) {
      if (event.key === "Escape") setOpen(false)
    }

    document.addEventListener("mousedown", handleClick)
    document.addEventListener("keydown", handleKey)
    return () => {
      document.removeEventListener("mousedown", handleClick)
      document.removeEventListener("keydown", handleKey)
    }
  }, [open])

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Account menu"
        className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-sm font-medium text-ink transition-colors hover:border-accent hover:text-accent"
      >
        {initial}
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-56 rounded-md border border-white/10 bg-surface p-3 shadow-lg"
        >
          <p className="truncate text-sm font-medium text-ink">{user.name}</p>
          <p className="truncate text-xs text-muted">{user.email}</p>
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setOpen(false)
              onSignOut()
            }}
            className="mt-3 w-full rounded border border-white/15 py-1.5 text-sm text-muted transition-colors hover:text-ink"
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  )
}

export default AccountMenu