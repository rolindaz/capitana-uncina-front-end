import { fetchJson, normalizeDetailPayload, normalizeListPayload } from './http'

export async function fetchResourceList(resourcePath) {
  const payload = await fetchJson(resourcePath)
  return normalizeListPayload(payload)
}

export async function fetchResourceDetail(resourcePath, id) {
  const payload = await fetchJson(`${resourcePath}/${id}`)
  return normalizeDetailPayload(payload)
}
