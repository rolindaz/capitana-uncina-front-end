// #region Funzioni per risorse in generale

// Creo una funzione per ottenere l'id dell'item
export function getResourceId(item) {
  const id = item?.id
  return id == null ? null : id
}

// Una per ottenere la label (nome della risorsa)
export function getResourceLabel(item) {
  const translation = item?.translation
  const label = translation?.name ?? item?.name

  if (label != null && String(label).trim() !== '') return String(label)

  const id = getResourceId(item)
  return id != null ? `#${id}` : '—'
}

// Una per ottenere lo slug
export function getItemSlug(item) {
  const direct = item?.slug
  if (direct) return direct

  const translationSlug = item?.translation?.slug
  if (translationSlug) return translationSlug

  return null
}

//#endregion

//#region Funzioni per progetti

// Una per ottenere lo stato del progetto
export function getProjectStatus(item) {
  const status = item?.status ?? item?.translation?.status
  return status ? String(status) : '—'
}

// Una per ottenere la categoria del progetto
export function getProjectCategory(item) {
  const cat = item?.category?.name ?? item?.translation?.category?.name
  return cat ? String(cat) : '—'
}

//#endregion

//#region Funzioni per filati

// Una per ottenere il peso del filato
export function getYarnStandardWeight(item) {
  return item?.weight
}

// Una per ottenere l'array di fibre del filato
export function getYarnFiberNames(item) {
  const yarnFibers = []

  const fiberYarns = Array.isArray(item?.fiber_yarns) ? item.fiber_yarns : []
  for (const fy of fiberYarns) {
    const fiber = fy?.fiber
    const name = fiber?.translation?.name
    console.log(name);
    if (name) yarnFibers.push(name)
  }

  return Array.from(new Set(yarnFibers))
}

//#endregion