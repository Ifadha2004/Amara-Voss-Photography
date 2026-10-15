import { useState } from "react"

const shootTypes = ["Portrait", "Landscape commission", "Family", "Other"]
const emptyForm = { name: "", email: "", shoot: "", message: "" }

const labelClass = "text-sm text-muted"
const inputClass =
  "w-full rounded-md border border-white/15 bg-canvas px-3 py-3 text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"

function Contact() {
  const [form, setForm] = useState(emptyForm)
  const [submitted, setSubmitted] = useState(false)

  function handleChange(event) {
    const { name, value } = event.target
    setForm({ ...form, [name]: value })
  }

  function handleSubmit(event) {
    event.preventDefault()
    setSubmitted(true)
    setForm(emptyForm)
  }

  return (
    <section id="contact" className="mx-auto max-w-6xl px-6 py-16 lg:py-24">
      <h2 className="mb-6 font-heading text-3xl font-bold lg:text-4xl">Book a shoot</h2>

      {submitted ? (
        <div role="status" className="max-w-2xl rounded-md bg-surface p-6">
          <p className="mb-4 text-lg">Thanks, your message is on its way. I'll reply by email.</p>
          <button
            type="button"
            onClick={() => setSubmitted(false)}
            className="text-accent hover:underline"
          >
            Send another message
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex max-w-2xl flex-col gap-5 rounded-md bg-surface p-6">
          <div className="flex flex-col gap-5 sm:flex-row">
            <div className="flex flex-1 flex-col gap-1.5">
              <label htmlFor="name" className={labelClass}>Name</label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                value={form.name}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
            <div className="flex flex-1 flex-col gap-1.5">
              <label htmlFor="email" className={labelClass}>Email</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={form.email}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="shoot" className={labelClass}>Shoot type</label>
            <select
              id="shoot"
              name="shoot"
              required
              value={form.shoot}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="" disabled>Choose one</option>
              {shootTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="message" className={labelClass}>Message</label>
            <textarea
              id="message"
              name="message"
              rows={5}
              required
              value={form.message}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <button
            type="submit"
            className="self-start rounded-md bg-accent px-6 py-3 font-medium text-canvas hover:brightness-110"
          >
            Send message
          </button>
        </form>
      )}
    </section>
  )
}

export default Contact