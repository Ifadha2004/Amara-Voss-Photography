import { useState } from "react"
import { events, eventTypes } from "../data/events"
import CategoryFilter from "./CategoryFilter"
import EventCard from "./EventCard"
import BookingSummary from "./BookingSummary"

function Events() {
  const [eventType, setEventType] = useState("All")
  const [bookings, setBookings] = useState({})

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
    </section>
  )
}

export default Events