import { useEffect, useState } from "react"
import { authClient } from "../lib/auth-client"
import { fetchJson, sendJson } from "../lib/api"
import CategoryFilter from "./CategoryFilter"
import PhotoCard from "./PhotoCard"
import Lightbox from "./Lightbox"

function Gallery() {
  const { data: session } = authClient.useSession()
  const userId = session?.user?.id

  // data from the API
  const [photos, setPhotos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [attempt, setAttempt] = useState(0)

  // UI state
  const [category, setCategory] = useState("All")
  const [favourites, setFavourites] = useState([])
  const [showSavedOnly, setShowSavedOnly] = useState(false)
  const [selectedPhoto, setSelectedPhoto] = useState(null)
  const [notice, setNotice] = useState("")

  useEffect(() => {
    let ignore = false
    fetchJson("/api/photos")
      .then((data) => {
        if (!ignore) setPhotos(data)
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

  // When a user is signed in, load THEIR saved photos from the database.
  useEffect(() => {
    if (!userId) return
    let ignore = false
    fetchJson("/api/favourites")
      .then((ids) => {
        if (!ignore) setFavourites(ids)
      })
      .catch(() => {
        if (!ignore) setNotice("Couldn't load your saved photos.")
      })
    return () => {
      ignore = true
    }
  }, [userId])

  function retry() {
    setError("")
    setLoading(true)
    setAttempt(attempt + 1)
  }

  // Signed out means nothing is saved, whatever is left in state
  const myFavourites = userId ? favourites : []

  const categories = ["All", ...new Set(photos.map((photo) => photo.category))]

  const categoryPhotos =
    category === "All"
      ? photos
      : photos.filter((photo) => photo.category === category)

  const visiblePhotos = showSavedOnly
    ? categoryPhotos.filter((photo) => myFavourites.includes(photo.id))
    : categoryPhotos

  async function toggleFavourite(id) {
    if (!userId) {
      setNotice("Sign in (top right) to save photos.")
      return
    }
    setNotice("")
    const previous = favourites
    const isSaved = favourites.includes(id)

    // 1. update the screen straight away
    setFavourites(isSaved ? favourites.filter((favId) => favId !== id) : [...favourites, id])

    // 2. save it in the database; undo the screen change if that fails
    try {
      await sendJson(`/api/favourites/${id}`, isSaved ? "DELETE" : "PUT")
    } catch {
      setFavourites(previous)
      setNotice("Couldn't save that change. Please try again.")
    }
  }

  async function clearFavourites() {
    const previous = favourites
    setFavourites([])
    try {
      await sendJson("/api/favourites", "DELETE")
    } catch {
      setFavourites(previous)
      setNotice("Couldn't clear your saved photos. Please try again.")
    }
  }

  return (
    <section id="work" className="mx-auto max-w-6xl px-6 py-16 lg:py-24">
      <h2 className="mb-6 font-heading text-3xl font-bold lg:text-4xl">Selected work</h2>

      {loading ? (
        <p className="rounded-md bg-surface p-6 text-muted" role="status">Loading photos…</p>
      ) : error ? (
        <div className="rounded-md bg-surface p-6" role="alert">
          <p className="text-muted">Couldn't load the photos ({error}).</p>
          <button type="button" onClick={retry} className="mt-2 text-accent hover:underline">
            Try again
          </button>
        </div>
      ) : (
        <>
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CategoryFilter
              categories={categories}
              selected={category}
              onSelect={setCategory}
            />
            <div className="flex flex-wrap items-center gap-3 text-sm text-muted">
              <span aria-live="polite">Saved: {myFavourites.length}</span>
              <button
                type="button"
                onClick={() => setShowSavedOnly(!showSavedOnly)}
                aria-pressed={showSavedOnly}
                className={`rounded-full border px-4 py-1.5 transition-colors ${
                  showSavedOnly
                    ? "border-accent text-accent"
                    : "border-white/15 text-muted hover:text-ink"
                }`}
              >
                Saved only
              </button>
              {myFavourites.length > 0 && (
                <button
                  type="button"
                  onClick={clearFavourites}
                  className="text-accent hover:underline"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {notice && (
            <p className="mb-4 text-sm text-accent" role="status">{notice}</p>
          )}

          {visiblePhotos.length === 0 ? (
            <p className="rounded-md bg-surface p-6 text-muted">
              {showSavedOnly
                ? "No saved photos here yet. Tap the heart on a photo to save it."
                : "No photos in this category."}
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
              {visiblePhotos.map((photo) => (
                <PhotoCard
                  key={photo.id}
                  photo={photo}
                  isFavourite={myFavourites.includes(photo.id)}
                  onToggleFavourite={() => toggleFavourite(photo.id)}
                  onOpen={() => setSelectedPhoto(photo)}
                />
              ))}
            </div>
          )}
        </>
      )}

      {selectedPhoto && (
        <Lightbox photo={selectedPhoto} onClose={() => setSelectedPhoto(null)} />
      )}
    </section>
  )
}

export default Gallery