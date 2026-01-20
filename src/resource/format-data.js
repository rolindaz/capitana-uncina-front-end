import { API_BASE_URL } from "../api/http"

// Creo una funzione per formattare la data al formato europeo (dd/mm/yyyy)
export function formatDate(value) {
  if (!value) return '—'
  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return String(value)
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = String(date.getFullYear())
  return `${day}/${month}/${year}`
}

export function formatHours(value) {
  if (value == null || value === '') return '—'
  const number = typeof value === 'number' ? value : Number(value)
  if (Number.isNaN(number)) return String(value)
  return `${number} h`
}

export function formatInteger(value) {
  if (value == null || value === '') return '—'
  const number = typeof value === 'number' ? value : Number(value)
  if (Number.isNaN(number)) return String(value)
  return String(Math.trunc(number))
}

export function toNumberOrNull(value) {
  if (value == null || value === '') return null
  const number = typeof value === 'number' ? value : Number(value)
  return Number.isNaN(number) ? null : number
}

// Una per avere facilmente l'url completa dell'immagine della risorsa
export function buildMediaUrl(path) {
  if (!path) return null
  const base = API_BASE_URL
  return `${base}/storage/${path}`
}
