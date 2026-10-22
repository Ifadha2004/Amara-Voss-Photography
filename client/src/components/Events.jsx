import { useEffect, useState } from "react"
import { fetchJson } from "../lib/api"
import CategoryFilter from "./CategoryFilter"
import EventCard from "./EventCard"
import BookingSummary from "./BookingSummary"

function Events() {
  // data from the API
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [attempt, setAttempt] = useState(0)

  // UI state (bookings move to the server in Phase 7)
  const [eventType, setEventType] = useState("All")
  const [bookings, setBookings] = useState({})

  useEffect(() => {
    let ignore = false
    fetchJson("/api/events")
      .then((data) => {
        if (!ignore) setEvents(data)
      })
      .catch((err) => {
        if (!ignore) setError(err.message)
      })
      .finally(() => {
        if (!ignore) setLoading(false)
      })
    return () => {
      ignore = true
    }
  }, [attempt])

  function retry() {
    setError("")
    setLoading(true)
    setAttempt(attempt + 1)
  }

  const eventTypes = ["All", ...new Set(events.map((event) => event.type))]

  const visibleEvents =
    eventType === "All"
      ? events
      : events.filter((event) => event.type === eventType)

  const bookedItems = events
    .filter((event) => bookings[event.id])
    .map((event) => ({ event, seats: bookings[event.id] }))

  const total = bookedItems.reduce(
    (sum, item) => sum + item.seats * item.event.price,
    0
  )

  function bookEvent(id, seats) {
    setBookings({ ...bookings, [id]: seats })
  }

  function cancelBooking(id) {
    const remaining = { ...bookings }
    delete remaining[id]
    setBookings(remaining)
  }

  return (
    <section id="events" className="mx-auto max-w-6xl px-6 py-16 lg:py-24">
      <h2 className="mb-2 font-heading text-3xl font-bold lg:text-4xl">Upcoming events</h2>
      <p className="mb-6 max-w-[52ch] text-muted">
        Photo walks and workshops around Dubai. Small groups, so everyone gets time with
        the camera and with me.
      </p>

      {loading ? (
        <p className="rounded-md bg-surface p-6 text-muted" role="status">Loading events…</p>
      ) : error ? (
        <div className="rounded-md bg-surface p-6" role="alert">
          <p className="text-muted">Couldn't load the events ({error}).</p>
          <button type="button" onClick={retry} className="mt-2 text-accent hover:underline">
            Try again
          </button>
        </div>
      ) : (
        <>
          <div className="mb-8">
            <CategoryFilter
              categories={eventTypes}
              selected={eventType}
              onSelect={setEventType}
            />
          </div>

          <div className="flex flex-col gap-4">
            {visibleEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                mySeats={bookings[event.id] ?? 0}
                onBook={bookEvent}
                onCancel={cancelBooking}
              />
            ))}
          </div>

          {bookedItems.length > 0 && (
            <BookingSummary items={bookedItems} total={total} onCancel={cancelBooking} />
          )}
        </>
      )}
    </section>
  )
}

export default Events