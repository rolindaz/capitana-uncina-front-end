// In questo file creo uno strato intermedio di supporto per le chiamate API

// Creo una variabile per la base della URL API (cioè il server backend)
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

// Creo una funzione che costruisce l'URL API completa (url base + percorso risorsa)
export function buildApiUrl(pathname) {
  return `${API_BASE_URL}${pathname}`
}

// Creo un wrapper per il fetch, che effettua alcune operazioni che altrimenti andrebbero effettuate ogni volta in maniera ridondante

export async function fetchJson(pathname, options = {}) {
  // Costruisce la URL completa (base API + risorsa)
  const url = buildApiUrl(pathname)

  /* Esegue la richiesta HTTP con fetch e nello specifico:
  - imposta l'header Accept per richiedere JSON
  - unisce eventuali header custom passati in options.headers
  - permette di passare tutte le altre opzioni fetch (method, body, credentials, ecc.) */
  const response = await fetch(url, {
    headers: {
      Accept: 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  })


  /* Decide come parsare la risposta in base al Content-Type:
  - se è JSON prova response.json()
  - altrimenti legge testo (response.text())
  In caso di parsing fallito ritorna null invece di lanciare eccezioni di parsing. */
  const contentType = response.headers.get('content-type') || ''
  const isJson = contentType.includes('application/json')
  const body = isJson
  ? await response.json().catch(() => null)
  : await response.text().catch(() => null)

  /* Se lo status HTTP non è OK:
  - costruisce un messaggio di errore
  - lancia un Error arricchito con status, url e body per debuggare */
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

  // Se ok, ritorna il body già parsato (oggetto JSON o stringa)
  return body
}
