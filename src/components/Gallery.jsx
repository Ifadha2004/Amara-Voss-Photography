import { useState } from "react"
import { photos, categories } from "../data/photos"
import CategoryFilter from "./CategoryFilter"
import PhotoCard from "./PhotoCard"

function Gallery() {
  const [category, setCategory] = useState("All")
  const [favourites, setFavourites] = useState([])

  const visiblePhotos =
    category === "All"
      ? photos
      : photos.filter((photo) => photo.category === category)

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

      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <CategoryFilter
          categories={categories}
          selected={category}
          onSelect={setCategory}
        />
        <div className="flex items-center gap-3 text-sm text-muted" aria-live="polite">
          <span>Saved: {favourites.length}</span>
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

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
        {visiblePhotos.map((photo) => (
          <PhotoCard
            key={photo.id}
            photo={photo}
            isFavourite={favourites.includes(photo.id)}
            onToggleFavourite={() => toggleFavourite(photo.id)}
          />
        ))}
      </div>
    </section>
  )
}

export default Gallery