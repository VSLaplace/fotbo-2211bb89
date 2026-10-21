// The ONLY place the front-end talks to the backend. Components never call
// fetch() directly — they import list/get/create/update/remove from here.
// Relative /api URLs work in every mode: dev (Vite proxy) and preview/production
// (the same Express server serves dist/ and /api on one port).

let token = null

/** Store the admin token returned by login(). Kept in memory only — never in
 *  localStorage, never bundled. */
export function setToken(value) {
  token = value
}

export function getToken() {
  return token
}

const headers = (body) => ({
  ...(body ? { 'Content-Type': 'application/json' } : {}),
  ...(token ? { Authorization: `Bearer ${token}` } : {}),
})

async function request(path, options = {}) {
  const response = await fetch(`/api${path}`, options)
  if (!response.ok) {
    const detail = await response.text().catch(() => '')
    throw new Error(`${options.method || 'GET'} /api${path} failed (${response.status}) ${detail}`)
  }
  return response.status === 204 ? null : response.json()
}

// Reads carry the token too when one exists. Without it a collection listed in
// admin.config.json `privateCollections` answers 401 to its own admin panel —
// the server guards GET on those, and a visitor simply has no token to send.
export const list = (collection) => request(`/${collection}`, { headers: headers(false) })
export const get = (collection, id) => request(`/${collection}/${id}`, { headers: headers(false) })

export const create = (collection, item) =>
  request(`/${collection}`, { method: 'POST', headers: headers(true), body: JSON.stringify(item) })

export const update = (collection, id, item) =>
  request(`/${collection}/${id}`, { method: 'PUT', headers: headers(true), body: JSON.stringify(item) })

export const patch = (collection, id, changes) =>
  request(`/${collection}/${id}`, { method: 'PATCH', headers: headers(true), body: JSON.stringify(changes) })

export const remove = (collection, id) =>
  request(`/${collection}/${id}`, { method: 'DELETE', headers: headers(false) })

/** What the admin panel manages, from admin.config.json (never the password).
 *  Admin-only, so it is called after login. */
export const adminSchema = () => request('/admin/schema', { headers: headers(false) })

/** Admin login. On success the token is stored and every mutating call carries it. */
export async function login(password) {
  const data = await request('/admin/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password }),
  })
  setToken(data.token)
  return data.token
}

// ---------------------------------------------------------------------------
// Congress content. Every page reads from here instead of fetching /api/... by
// itself, so the collection names live in one file.

/** A "singleton" collection (congress, society, venue) is stored as an array
 *  with one row; this returns that row whether the API answers with an array
 *  or with a bare object. */
export async function first(collection) {
  const data = await list(collection)
  if (Array.isArray(data)) return data[0] ?? null
  return data ?? null
}

/** Everything the shell and the first screen of a page need, in ONE request. */
export const overview = () => request('/congress/overview', { headers: headers(false) })

/** Sort rows by their `order` field (stable, missing values last). */
export const byOrder = (rows = []) =>
  [...rows].sort((a, b) => (a.order ?? 999) - (b.order ?? 999))

/** Public contact / inquiry form submission. Rejects with an Error carrying
 *  `status` and `fields` (server-side validation detail) so the form can point
 *  at the offending inputs; resolves with the created record. */
export async function submitInquiry(payload) {
  const response = await fetch('/api/inquiries', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (response.ok) return response.json()
  const detail = await response.json().catch(() => ({}))
  const error = new Error('Не вдалося надіслати запит')
  error.status = response.status
  error.fields = detail.fields || null
  throw error
}
