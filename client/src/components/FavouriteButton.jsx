function FavouriteButton({ title, isFavourite, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={isFavourite}
      aria-label={`${isFavourite ? "Remove" : "Save"} ${title}`}
      className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-canvas/60 text-lg backdrop-blur-sm transition-colors hover:bg-canvas/80"
    >
      <span className={isFavourite ? "text-accent" : "text-ink"}>
        {isFavourite ? "♥" : "♡"}
      </span>
    </button>
  )
}

export default FavouriteButton