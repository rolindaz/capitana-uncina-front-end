import { API_BASE_URL } from "../api/http"

// Una per avere facilmente l'url completa dell'immagine della risorsa
export function buildMediaUrl(path) {
  if (!path) return null
  const base = API_BASE_URL
  return `${base}/storage/${path}`
}

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

export function formatMinMax(minValue, maxValue) {
  const minPresent = minValue != null && String(minValue).trim() !== ''
  const maxPresent = maxValue != null && String(maxValue).trim() !== ''

  if (!minPresent && !maxPresent) return '—'
  if (minPresent && !maxPresent) return String(minValue)
  if (!minPresent && maxPresent) return String(maxValue)

  const minText = String(minValue)
  const maxText = String(maxValue)
  if (minText === maxText) return minText
  return `${minText} – ${maxText}`
}


