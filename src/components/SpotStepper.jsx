function SpotStepper({ value, onChange, min = 1, max, label = "Number of spots" }) {
  return (
    <div
      role="group"
      aria-label={label}
      className="inline-flex items-center rounded-full border border-white/15"
    >
      <button
        type="button"
        onClick={() => onChange(value - 1)}
        disabled={value <= min}
        aria-label="Fewer spots"
        className="h-9 w-9 text-lg text-ink transition-colors hover:text-accent disabled:cursor-not-allowed disabled:text-muted/40 disabled:hover:text-muted/40"
      >
        −
      </button>
      <span className="min-w-8 text-center tabular-nums" aria-live="polite">
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        disabled={value >= max}
        aria-label="More spots"
        className="h-9 w-9 text-lg text-ink transition-colors hover:text-accent disabled:cursor-not-allowed disabled:text-muted/40 disabled:hover:text-muted/40"
      >
        +
      </button>
    </div>
  )
}

export default SpotStepper