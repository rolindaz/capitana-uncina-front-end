// In questo file creo uno strato intermedio di supporto per le chiamate API

// Creo una variabile per la base della URL API (cioè il server backend)
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

// Creo una funzione che costruisce l'URL API completa (url base + percorso risorsa)
export function buildApiUrl(pathname) {
  return `${API_BASE_URL}${pathname}`
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
  if (!payload || typeof payload !== 'object') return []
  return Array.isArray(payload.data) ? payload.data : []
}

export function normalizeDetailPayload(payload) {
  if (!payload || typeof payload !== 'object') return null
  return payload.data && typeof payload.data === 'object' ? payload.data : null
}
