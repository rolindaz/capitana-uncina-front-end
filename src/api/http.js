import { API_BASE_URL } from './config'

export function buildApiUrl(pathname) {
  const cleanPath = String(pathname || '').startsWith('/')
    ? String(pathname || '')
    : `/${pathname}`

  return `${API_BASE_URL}${cleanPath}`
}

export async function fetchJson(pathname, options = {}) {
  const url = buildApiUrl(pathname)

  const response = await fetch(url, {
    headers: {
      Accept: 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  })

  const contentType = response.headers.get('content-type') || ''
  const isJson = contentType.includes('application/json')
  const body = isJson ? await response.json().catch(() => null) : await response.text().catch(() => null)

  if (!response.ok) {
    const message =
      (body && typeof body === 'object' && (body.detail || body.message)) ||
      (typeof body === 'string' && body) ||
      `Request failed (${response.status})`

    const error = new Error(message)
    error.status = response.status
    error.url = url
    error.body = body
    throw error
  }

  return body
}

export function normalizeListPayload(payload) {
  if (Array.isArray(payload)) return payload
  if (!payload || typeof payload !== 'object') return []

  if (Array.isArray(payload.results)) return payload.results
  if (Array.isArray(payload.data)) return payload.data
  if (Array.isArray(payload.items)) return payload.items

  return []
}

export function normalizeDetailPayload(payload) {
  if (!payload || typeof payload !== 'object') return payload
  if (payload.data && typeof payload.data === 'object') return payload.data
  return payload
}

export function getItemId(item) {
  if (!item || typeof item !== 'object') return null
  return item.id ?? item.pk ?? item.uuid ?? item._id ?? null
}

export function getItemLabel(item) {
  if (!item || typeof item !== 'object') return 'Untitled'
  return (
    item.title ||
    item.name ||
    item.label ||
    item.slug ||
    (typeof item.id !== 'undefined' ? `Item #${item.id}` : 'Untitled')
  )
}
