import { useEffect, useState } from "react"
import { fetchJson } from "../lib/api"
import CategoryFilter from "./CategoryFilter"
import PhotoCard from "./PhotoCard"
import Lightbox from "./Lightbox"

function Gallery() {
  // data from the API
  const [photos, setPhotos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [attempt, setAttempt] = useState(0)

  // UI state (unchanged from Week 2)
  const [category, setCategory] = useState("All")
  const [favourites, setFavourites] = useState([])
  const [showSavedOnly, setShowSavedOnly] = useState(false)
  const [selectedPhoto, setSelectedPhoto] = useState(null)

  // Runs after the first render (and again when `attempt` changes): ask the API for photos.
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
      ignore = true // if the component disappears first, don't set state on it
    }
  }, [attempt])

  function retry() {
    setError("")
    setLoading(true)
    setAttempt(attempt + 1)
  }

  // Derived from the loaded data, not stored
  const categories = ["All", ...new Set(photos.map((photo) => photo.category))]

  const categoryPhotos =
    category === "All"
      ? photos
      : photos.filter((photo) => photo.category === category)

  const visiblePhotos = showSavedOnly
    ? categoryPhotos.filter((photo) => favourites.includes(photo.id))
    : categoryPhotos

  function toggleFavourite(id) {
    setFavourites(
      favourites.includes(id)
        ? favourites.filter((favId) => favId !== id)
        : [...favourites, id]
    )
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
              <span aria-live="polite">Saved: {favourites.length}</span>
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
              {favourites.length > 0 && (
                <button
                  type="button"
                  onClick={() => setFavourites([])}
                  className="text-accent hover:underline"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

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
                  isFavourite={favourites.includes(photo.id)}
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