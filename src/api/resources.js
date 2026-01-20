// Qui utilizzo il parser del file http.js per "pulire" il risultato delle chiamate API e restituire direttamente l'array rilevante (senza 'success' = true)

// Importo il parser
import { fetchJson } from './http'

// Ritorno l'array dell'API corrispondente alla lista di istanze della risorsa richiesta
export async function fetchResourceList(resourcePath) {
  const payload = await fetchJson(resourcePath)
  return Array.isArray(payload?.data) ? payload.data : []
}

// Ritorno l'oggetto corrispondente al dettaglio della risorsa richiesta tramite API
export async function fetchResourceDetail(resourcePath, slug) {
  const payload = await fetchJson(`${resourcePath}/${slug}`)
  return payload?.data ?? null
}
