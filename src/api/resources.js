import { fetchJson } from './http'

export async function fetchResourceList(resourcePath) {
  const payload = await fetchJson(resourcePath)
  return Array.isArray(payload?.data) ? payload.data : []
}

export async function fetchResourceDetail(resourcePath, id) {
  const payload = await fetchJson(`${resourcePath}/${id}`)
  return payload?.data ?? null
}
