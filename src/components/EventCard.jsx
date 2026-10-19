import { useState } from "react"
import SpotStepper from "./SpotStepper"

function EventCard({ event, mySeats, onBook, onCancel }) {
  const [quantity, setQuantity] = useState(1)

  const spotsLeft = event.capacity - event.booked - mySeats
  const isBooked = mySeats > 0
  const isSoldOut = spotsLeft === 0 && !isBooked
  const filledPercent = Math.round(((event.capacity - spotsLeft) / event.capacity) * 100)
  const seats = Math.min(quantity, spotsLeft)

  const spotsLabel =
    spotsLeft === 0
      ? "Fully booked"
      : `${spotsLeft} ${spotsLeft === 1 ? "spot" : "spots"} left`

  function handleCancel() {
    setQuantity(1)
    onCancel(event.id)
  }

  return (
    <article className="flex flex-col gap-5 rounded-md bg-surface p-4 lg:flex-row lg:items-center lg:gap-6 lg:p-5">
      <div className="flex items-baseline gap-2 lg:w-16 lg:shrink-0 lg:flex-col lg:items-center lg:gap-0">
        <span className="text-sm text-muted">{event.weekday}</span>
        <span className="font-heading text-4xl font-bold leading-none">{event.day}</span>
        <span className="text-sm text-accent">{event.month}</span>
      </div>

      <img
        src={event.image}
        alt=""
        loading="lazy"
        className="aspect-[16/9] w-full rounded-md object-cover lg:aspect-[4/3] lg:w-56 lg:shrink-0"
      />

      <div className="flex-1">
        <p className="text-sm text-accent">
          {event.type}
          <span className="text-muted"> / {event.duration}</span>
        </p>
        <h3 className="mt-1 font-heading text-xl font-bold lg:text-2xl">{event.title}</h3>
        <p className="mt-1 text-sm text-muted">
          {event.location}, {event.time}
        </p>
        <p className="mt-3 max-w-[52ch] text-sm text-muted">{event.description}</p>
      </div>

      <div className="flex flex-col gap-3 lg:w-64 lg:shrink-0">
        <p>
          <span className="text-xl font-medium">AED {event.price}</span>
          <span className="text-sm text-muted"> per person</span>
        </p>

        <div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-accent transition-[width] duration-300"
              style={{ width: `${filledPercent}%` }}
            />
          </div>
          <p className={`mt-1.5 text-sm ${spotsLeft <= 3 ? "text-accent" : "text-muted"}`}>
            {spotsLabel}
          </p>
        </div>

        {isBooked ? (
          <div role="status">
            <p className="text-sm">
              You booked {mySeats} {mySeats === 1 ? "spot" : "spots"} for AED{" "}
              {mySeats * event.price}.
            </p>
            <button
              type="button"
              onClick={handleCancel}
              className="mt-1 text-sm text-accent hover:underline"
            >
              Cancel booking
            </button>
          </div>
        ) : isSoldOut ? (
          <button
            type="button"
            disabled
            className="cursor-not-allowed rounded-md border border-white/15 px-4 py-2.5 text-sm text-muted"
          >
            Sold out
          </button>
        ) : (
          <div className="flex flex-wrap items-center gap-3">
            <SpotStepper
              value={seats}
              onChange={setQuantity}
              max={spotsLeft}
              label={`Spots for ${event.title}`}
            />
            <button
              type="button"
              onClick={() => onBook(event.id, seats)}
              className="rounded-md bg-accent px-4 py-2.5 text-sm font-medium text-canvas hover:brightness-110"
            >
              Reserve, AED {seats * event.price}
            </button>
          </div>
        )}
      </div>
    </article>
  )
}

export default EventCard