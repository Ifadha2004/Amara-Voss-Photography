function CategoryFilter({ categories, selected, onSelect }) {
  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Filter photos by category">
      {categories.map((category) => (
        <button
          key={category}
          type="button"
          onClick={() => onSelect(category)}
          aria-pressed={selected === category}
          className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
            selected === category
              ? "border-accent bg-accent text-canvas"
              : "border-white/15 text-muted hover:text-ink"
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  )
}

export default CategoryFilter