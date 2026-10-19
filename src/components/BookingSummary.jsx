function BookingSummary({ items, total, onCancel }) {
  return (
    <div className="mt-8 rounded-md border border-accent/40 bg-surface p-6" aria-live="polite">
      <h3 className="mb-2 font-heading text-xl font-bold">Your bookings</h3>

      <ul className="divide-y divide-white/10">
        {items.map(({ event, seats }) => (
          <li
            key={event.id}
            className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 py-3"
          >
            <span>
              {event.title}
              <span className="text-sm text-muted">
                {" "}
                ({event.day} {event.month}, {seats} {seats === 1 ? "spot" : "spots"})
              </span>
            </span>
            <span className="flex items-center gap-4">
              <span>AED {seats * event.price}</span>
              <button
                type="button"
                onClick={() => onCancel(event.id)}
                className="text-sm text-accent hover:underline"
              >
                Remove
              </button>
            </span>
          </li>
        ))}
      </ul>

      <p className="mt-4 flex items-baseline justify-between border-t border-white/10 pt-4 text-lg font-medium">
        <span>Total</span>
        <span>AED {total}</span>
      </p>
      <p className="mt-3 text-sm text-muted">
        <a href="#contact" className="text-accent hover:underline">
          Send me a message
        </a>{" "}
        to confirm your spots.
      </p>
    </div>
  )
}

export default BookingSummary