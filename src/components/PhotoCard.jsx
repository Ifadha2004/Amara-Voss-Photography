import FavouriteButton from "./FavouriteButton"

function PhotoCard({ photo, isFavourite, onToggleFavourite }) {
  return (
    <figure className="group relative aspect-[4/5] overflow-hidden rounded-md bg-surface">
      <img
        src={photo.src}
        alt={photo.alt}
        loading="lazy"
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <figcaption className="absolute inset-x-0 bottom-0 flex flex-col bg-linear-to-t from-canvas/90 to-transparent px-4 pb-4 pt-10 opacity-100 transition-opacity duration-300 sm:opacity-0 sm:group-hover:opacity-100">
        <span className="font-heading text-lg">{photo.title}</span>
        <small className="text-accent">{photo.category}</small>
      </figcaption>
      <FavouriteButton
        title={photo.title}
        isFavourite={isFavourite}
        onToggle={onToggleFavourite}
      />
    </figure>
  )
}

export default PhotoCard