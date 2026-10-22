import { useEffect, useState } from "react"
import { authClient } from "../lib/auth-client"
import { fetchJson, sendJson } from "../lib/api"
import CategoryFilter from "./CategoryFilter"
import EventCard from "./EventCard"
import BookingSummary from "./BookingSummary"

function Events() {
  const { data: session } = authClient.useSession()
  const userId = session?.user?.id

  // data from the API
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [version, setVersion] = useState(0)   // bump this to reload from the server

  // UI state
  const [eventType, setEventType] = useState("All")
  const [bookings, setBookings] = useState({})   // { eventId: seats } for the signed-in user
  const [notice, setNotice] = useState("")

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
  }, [version])

  useEffect(() => {
    if (!userId) return
    let ignore = false
    fetchJson("/api/bookings")
      .then((list) => {
        if (!ignore) {
          setBookings(Object.fromEntries(list.map((b) => [b.eventId, b.seats])))
        }
      })
      .catch(() => {
        if (!ignore) setNotice("Couldn't load your bookings.")
      })
    return () => {
      ignore = true
    }
  }, [userId, version])

  function retry() {
    setError("")
    setLoading(true)
    setVersion(version + 1)
  }

  const myBookings = userId ? bookings : {}

  const eventTypes = ["All", ...new Set(events.map((event) => event.type))]

  const visibleEvents =
    eventType === "All"
      ? events
      : events.filter((event) => event.type === eventType)

  const bookedItems = events
    .filter((event) => myBookings[event.id])
    .map((event) => ({ event, seats: myBookings[event.id] }))

  const total = bookedItems.reduce(
    (sum, item) => sum + item.seats * item.event.price,
    0
  )

  async function bookEvent(id, seats) {
    if (!userId) {
      setNotice("Sign in (top right) to reserve spots.")
      return
    }
    setNotice("")
    try {
      await sendJson("/api/bookings", "POST", { eventId: id, seats })
    } catch (err) {
      setNotice(err.message)   // e.g. "Only 2 spots left"
    }
    setVersion((v) => v + 1)   // reload events and bookings either way
  }

  async function cancelBooking(id) {
    setNotice("")
    try {
      await sendJson(`/api/bookings/${id}`, "DELETE")
    } catch (err) {
      setNotice(err.message)
    }
    setVersion((v) => v + 1)
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

          {notice && (
            <p className="mb-4 text-sm text-accent" role="status">{notice}</p>
          )}

          <div className="flex flex-col gap-4">
            {visibleEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                mySeats={myBookings[event.id] ?? 0}
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