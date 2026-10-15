function Lightbox({ photo, onClose }) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={photo.title}
      onClick={onClose}
      className="fixed inset-0 z-20 flex items-center justify-center bg-canvas/95 p-4"
    >
      <figure
        onClick={(event) => event.stopPropagation()}
        className="max-h-full max-w-4xl"
      >
        <img
          src={photo.src}
          alt={photo.alt}
          className="max-h-[80vh] w-auto max-w-full rounded-md object-contain"
        />
        <figcaption className="mt-3 flex items-baseline justify-between gap-4">
          <span className="font-heading text-lg">{photo.title}</span>
          <span className="text-sm text-accent">{photo.category}</span>
        </figcaption>
      </figure>
      <button
        type="button"
        onClick={onClose}
        className="absolute right-4 top-4 rounded-full bg-surface px-4 py-2 text-sm hover:text-accent"
      >
        Close ✕
      </button>
    </div>
  )
}

export default Lightbox