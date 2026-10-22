// Small helper: fetch a URL and return its JSON, or throw an Error if the server says no.
export async function fetchJson(url) {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Request failed (${response.status})`)
  }
  return response.json()
}