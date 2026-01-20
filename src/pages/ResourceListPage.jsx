import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import ErrorState from '../components/ErrorState'
import Loading from '../components/Loading'
import { fetchResourceList } from '../api/resources'
import { getItemId, getItemLabel } from '../api/http'
import { API_BASE_URL } from '../api/config'

function formatDate(value) {
  if (!value) return '—'
  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return String(value)
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = String(date.getFullYear())
  return `${day}/${month}/${year}`
}

function normalizeLabel(value) {
  if (value == null) return null
  const text = String(value).trim()
  return text ? text : null
}

function getProjectStatus(item) {
  const status = item?.translation?.status ?? item?.status
  return status ? String(status) : '—'
}

function getProjectCategory(item) {
  const cat = item?.category
  const label = cat?.translation?.name ?? cat?.translation?.title ?? cat?.name ?? cat?.key
  return label ? String(label) : '—'
}

function buildProjectImageUrl(item) {
  const raw = item?.image_path ?? item?.image ?? item?.imageUrl ?? null
  if (!raw) return null
  const asString = String(raw)
  if (/^https?:\/\//i.test(asString)) return asString

  const clean = asString.replace(/^\/+/, '')
  const base = (API_BASE_URL || '').replace(/\/+$/, '')

  // Common Laravel-ish patterns; pick the most likely first.
  if (clean.startsWith('storage/')) return `${base}/${clean}`
  return `${base}/storage/${clean}`
}

function buildMediaUrl(path) {
  if (!path) return null
  const asString = String(path)
  if (/^https?:\/\//i.test(asString)) return asString
  const clean = asString.replace(/^\/+/, '')
  const base = (API_BASE_URL || '').replace(/\/+$/, '')
  if (clean.startsWith('storage/')) return `${base}/${clean}`
  return `${base}/storage/${clean}`
}

function getYarnStandardWeight(item) {
  return (
    normalizeLabel(item?.standard_weight) ||
    normalizeLabel(item?.weight) ||
    normalizeLabel(item?.translation?.weight) ||
    normalizeLabel(item?.translation?.standard_weight)
  )
}

function getYarnFiberNames(item) {
  const candidates = []

  const fiberYarns = Array.isArray(item?.fiber_yarns) ? item.fiber_yarns : []
  for (const fy of fiberYarns) {
    const fiber = fy?.fiber
    const name =
      normalizeLabel(fiber?.translation?.name) ||
      normalizeLabel(fiber?.translation?.title) ||
      normalizeLabel(fiber?.name) ||
      normalizeLabel(fiber?.key)
    if (name) candidates.push(name)
  }

  const fibersDirect = Array.isArray(item?.fibers) ? item.fibers : []
  for (const fiber of fibersDirect) {
    const name =
      normalizeLabel(fiber?.translation?.name) ||
      normalizeLabel(fiber?.translation?.title) ||
      normalizeLabel(fiber?.name) ||
      normalizeLabel(fiber?.key) ||
      normalizeLabel(fiber)
    if (name) candidates.push(name)
  }

  const fiberTypes = Array.isArray(item?.fiber_types) ? item.fiber_types : []
  for (const fiber of fiberTypes) {
    const name =
      normalizeLabel(fiber?.translation?.name) ||
      normalizeLabel(fiber?.translation?.title) ||
      normalizeLabel(fiber?.name) ||
      normalizeLabel(fiber?.key) ||
      normalizeLabel(fiber)
    if (name) candidates.push(name)
  }

  return Array.from(new Set(candidates))
}

function DropdownFilter({ label, valueLabel, children, isDisabled = false }) {
  return (
    <div className="dropdown">
      <button
        className="btn btn-cute dropdown-toggle font-quicksand"
        type="button"
        data-bs-toggle="dropdown"
        aria-expanded="false"
        disabled={isDisabled}
      >
        {label}: {valueLabel}
      </button>
      <ul className="dropdown-menu dropdown-menu-end">{children}</ul>
    </div>
  )
}

function ProjectCard({ item, to }) {
  const title = getItemLabel(item)
  const status = getProjectStatus(item)
  const category = getProjectCategory(item)
  const createdAt = formatDate(item?.created_at)
  const updatedAt = formatDate(item?.updated_at)
  const img = buildProjectImageUrl(item)

  return (
    <div className="col-12 col-md-6 col-lg-4">
      <Link to={to} className="text-decoration-none">
        <div className="card h-100 shadow-sm font-quicksand">
          {img ? (
            <img
              src={img}
              alt={title}
              className="card-img-top"
              style={{ height: 220, objectFit: 'cover', background: '#f3f3f3' }}
              loading="lazy"
              onError={(e) => {
                // If the backend image URL is not reachable, hide image area.
                e.currentTarget.style.display = 'none'
              }}
            />
          ) : (
            <div className="bg-light" style={{ height: 220 }} aria-hidden="true" />
          )}

          <div className="card-body">
            <div
              className="card-title fw-semibold mb-2 font-walter"
              style={{ lineHeight: 1.2, color: '#F37046' }}
            >
              {title}
            </div>

            <div className="small text-muted">
              <div>
                <span className="fw-semibold span-title">Stato:</span> {status}
              </div>
              <div>
                <span className="fw-semibold span-title">Categoria:</span> {category}
              </div>
              <div className="mt-2">
                <div>
                  <span className="fw-semibold span-title">Aggiunto:</span> {createdAt}
                </div>
                <div>
                  <span className="fw-semibold span-title">Aggiornato:</span> {updatedAt}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
}

function YarnCard({ item, to }) {
  const name = item?.name ? String(item.name) : getItemLabel(item)
  const brand = item?.brand ? String(item.brand) : '—'
  const createdAt = formatDate(item?.created_at)
  const updatedAt = formatDate(item?.updated_at)
  const img = buildMediaUrl(item?.image_path)

  return (
    <div className="col-12 col-md-6 col-lg-4">
      <Link to={to} className="text-decoration-none">
        <div className="card h-100 shadow-sm font-quicksand">
          {img ? (
            <img
              src={img}
              alt={name}
              className="card-img-top"
              style={{ height: 220, objectFit: 'cover', background: '#f3f3f3' }}
              loading="lazy"
              onError={(e) => {
                e.currentTarget.style.display = 'none'
              }}
            />
          ) : (
            <div className="bg-light" style={{ height: 220 }} aria-hidden="true" />
          )}

          <div className="card-body">
            <div className="card-title fw-semibold mb-2 font-walter" style={{ lineHeight: 1.2 }}>
              {name}
            </div>

            <div className="small text-muted">
              <div>
                <span className="fw-semibold span-title">Marca:</span> {brand}
              </div>
              <div className="mt-2">
                <div>
                  <span className="fw-semibold span-title">Aggiunto:</span> {createdAt}
                </div>
                <div>
                  <span className="fw-semibold span-title">Aggiornato:</span> {updatedAt}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
}

export default function ResourceListPage({ title, resourcePath, baseRoute, variant = 'default' }) {
  const [items, setItems] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [orderBy, setOrderBy] = useState('name')

  const [projectCategoryFilter, setProjectCategoryFilter] = useState(null)
  const [projectStatusFilter, setProjectStatusFilter] = useState(null)
  const [yarnFiberFilter, setYarnFiberFilter] = useState(null)
  const [yarnWeightFilter, setYarnWeightFilter] = useState(null)

  const orderLabel = useMemo(() => {
    switch (orderBy) {
      case 'created_at':
        return 'Aggiunto'
      case 'updated_at':
        return 'Aggiornato'
      case 'status':
        return 'Stato'
      case 'brand':
        return 'Marca'
      case 'name':
      default:
        return 'Nome'
    }
  }, [orderBy])

  const projectCategoryOptions = useMemo(() => {
    if (variant !== 'projects') return []
    const unique = new Set()
    for (const item of items) {
      const label = normalizeLabel(getProjectCategory(item))
      if (label && label !== '—') unique.add(label)
    }
    return Array.from(unique.values()).sort((a, b) => a.localeCompare(b))
  }, [items, variant])

  const projectStatusOptions = useMemo(() => {
    if (variant !== 'projects') return []
    const unique = new Set()
    for (const item of items) {
      const label = normalizeLabel(getProjectStatus(item))
      if (label && label !== '—') unique.add(label)
    }
    return Array.from(unique.values()).sort((a, b) => a.localeCompare(b))
  }, [items, variant])

  const yarnFiberOptions = useMemo(() => {
    if (variant !== 'yarns') return []
    const unique = new Set()
    for (const item of items) {
      for (const name of getYarnFiberNames(item)) {
        const label = normalizeLabel(name)
        if (label) unique.add(label)
      }
    }
    return Array.from(unique.values()).sort((a, b) => a.localeCompare(b))
  }, [items, variant])

  const yarnWeightOptions = useMemo(() => {
    if (variant !== 'yarns') return []
    const unique = new Set()
    for (const item of items) {
      const label = getYarnStandardWeight(item)
      if (label) unique.add(label)
    }
    return Array.from(unique.values()).sort((a, b) => a.localeCompare(b))
  }, [items, variant])

  const filteredItems = useMemo(() => {
    if (variant === 'projects') {
      return items.filter((item) => {
        if (projectCategoryFilter && getProjectCategory(item) !== projectCategoryFilter) return false
        if (projectStatusFilter && getProjectStatus(item) !== projectStatusFilter) return false
        return true
      })
    }

    if (variant === 'yarns') {
      return items.filter((item) => {
        if (yarnWeightFilter && getYarnStandardWeight(item) !== yarnWeightFilter) return false

        if (yarnFiberFilter) {
          const fibers = getYarnFiberNames(item)
          if (!fibers.includes(yarnFiberFilter)) return false
        }

        return true
      })
    }

    return items
  }, [items, variant, projectCategoryFilter, projectStatusFilter, yarnFiberFilter, yarnWeightFilter])

  const sortedItems = useMemo(() => {
    const copy = [...filteredItems]

    if (variant !== 'projects' && variant !== 'yarns') {
      return copy.sort((a, b) =>
        String(getItemLabel(a)).localeCompare(String(getItemLabel(b)))
      )
    }

    const getValue = (item) => {
      switch (orderBy) {
        case 'created_at':
          return new Date(item?.created_at || 0).getTime() || 0
        case 'updated_at':
          return new Date(item?.updated_at || 0).getTime() || 0
        case 'status':
          return getProjectStatus(item)
        case 'brand':
          return item?.brand ?? ''
        case 'name':
        default:
          return getItemLabel(item)
      }
    }

    const direction = orderBy === 'created_at' || orderBy === 'updated_at' ? 'desc' : 'asc'

    return copy.sort((a, b) => {
      const aVal = getValue(a)
      const bVal = getValue(b)

      let cmp = 0
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        cmp = aVal - bVal
      } else {
        cmp = String(aVal).localeCompare(String(bVal))
      }

      if (cmp === 0) {
        cmp = String(getItemLabel(a)).localeCompare(String(getItemLabel(b)))
      }

      return direction === 'desc' ? -cmp : cmp
    })
  }, [filteredItems, variant, orderBy])

  useEffect(() => {
    let isMounted = true

    async function load() {
      try {
        setIsLoading(true)
        setError(null)
        const list = await fetchResourceList(resourcePath)
        if (isMounted) setItems(list)
      } catch (err) {
        if (isMounted) setError(err)
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }

    load()
    return () => {
      isMounted = false
    }
  }, [resourcePath])

  return (
    <div className="container py-4">
      <div className="row g-2 align-items-end mt-4 mb-5">
        <div className="col-12 col-md-4 d-flex justify-content-start">
          <Link className="btn btn-cute font-quicksand" to="/">
            ← Indietro
          </Link>
        </div>

        <div className="col-12 col-md-4 text-center">
          <h2 className="mb-1 font-walter fs-1">{title}</h2>
        </div>

        <div className="col-12 col-md-4 d-flex justify-content-md-end justify-content-start">
          {variant === 'projects' || variant === 'yarns' ? (
            <div className="d-flex gap-2 flex-wrap justify-content-md-end justify-content-start">
              {variant === 'projects' ? (
                <>
                  <DropdownFilter
                    label="Categoria"
                    valueLabel={projectCategoryFilter ?? 'Tutte'}
                    isDisabled={projectCategoryOptions.length === 0}
                  >
                    <li>
                      <button
                        className={`dropdown-item ${projectCategoryFilter == null ? 'active' : ''}`}
                        type="button"
                        onClick={() => setProjectCategoryFilter(null)}
                      >
                        Tutte
                      </button>
                    </li>
                    {projectCategoryOptions.map((opt) => (
                      <li key={opt}>
                        <button
                          className={`dropdown-item ${projectCategoryFilter === opt ? 'active' : ''}`}
                          type="button"
                          onClick={() => setProjectCategoryFilter(opt)}
                        >
                          {opt}
                        </button>
                      </li>
                    ))}
                  </DropdownFilter>

                  <DropdownFilter
                    label="Stato"
                    valueLabel={projectStatusFilter ?? 'Tutti'}
                    isDisabled={projectStatusOptions.length === 0}
                  >
                    <li>
                      <button
                        className={`dropdown-item ${projectStatusFilter == null ? 'active' : ''}`}
                        type="button"
                        onClick={() => setProjectStatusFilter(null)}
                      >
                        Tutti
                      </button>
                    </li>
                    {projectStatusOptions.map((opt) => (
                      <li key={opt}>
                        <button
                          className={`dropdown-item ${projectStatusFilter === opt ? 'active' : ''}`}
                          type="button"
                          onClick={() => setProjectStatusFilter(opt)}
                        >
                          {opt}
                        </button>
                      </li>
                    ))}
                  </DropdownFilter>
                </>
              ) : null}

              {variant === 'yarns' ? (
                <>
                  <DropdownFilter
                    label="Fibra"
                    valueLabel={yarnFiberFilter ?? 'Tutte'}
                    isDisabled={yarnFiberOptions.length === 0}
                  >
                    <li>
                      <button
                        className={`dropdown-item ${yarnFiberFilter == null ? 'active' : ''}`}
                        type="button"
                        onClick={() => setYarnFiberFilter(null)}
                      >
                        Tutte
                      </button>
                    </li>
                    {yarnFiberOptions.map((opt) => (
                      <li key={opt}>
                        <button
                          className={`dropdown-item ${yarnFiberFilter === opt ? 'active' : ''}`}
                          type="button"
                          onClick={() => setYarnFiberFilter(opt)}
                        >
                          {opt}
                        </button>
                      </li>
                    ))}
                  </DropdownFilter>

                  <DropdownFilter
                    label="Peso"
                    valueLabel={yarnWeightFilter ?? 'Tutti'}
                    isDisabled={yarnWeightOptions.length === 0}
                  >
                    <li>
                      <button
                        className={`dropdown-item ${yarnWeightFilter == null ? 'active' : ''}`}
                        type="button"
                        onClick={() => setYarnWeightFilter(null)}
                      >
                        Tutti
                      </button>
                    </li>
                    {yarnWeightOptions.map((opt) => (
                      <li key={opt}>
                        <button
                          className={`dropdown-item ${yarnWeightFilter === opt ? 'active' : ''}`}
                          type="button"
                          onClick={() => setYarnWeightFilter(opt)}
                        >
                          {opt}
                        </button>
                      </li>
                    ))}
                  </DropdownFilter>
                </>
              ) : null}

              <div className="dropdown">
                <button
                  className="btn btn-cute dropdown-toggle font-quicksand"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Ordina per: {orderLabel}
                </button>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li>
                    <button
                      className={`dropdown-item ${orderBy === 'name' ? 'active' : ''}`}
                      type="button"
                      onClick={() => setOrderBy('name')}
                    >
                      Nome
                    </button>
                  </li>
                  {variant === 'projects' ? (
                    <li>
                      <button
                        className={`dropdown-item ${orderBy === 'status' ? 'active' : ''}`}
                        type="button"
                        onClick={() => setOrderBy('status')}
                      >
                        Stato
                      </button>
                    </li>
                  ) : null}

                  {variant === 'yarns' ? (
                    <li>
                      <button
                        className={`dropdown-item ${orderBy === 'brand' ? 'active' : ''}`}
                        type="button"
                        onClick={() => setOrderBy('brand')}
                      >
                        Marca
                      </button>
                    </li>
                  ) : null}
                  <li>
                    <button
                      className={`dropdown-item ${orderBy === 'created_at' ? 'active' : ''}`}
                      type="button"
                      onClick={() => setOrderBy('created_at')}
                    >
                      Aggiunto
                    </button>
                  </li>
                  <li>
                    <button
                      className={`dropdown-item ${orderBy === 'updated_at' ? 'active' : ''}`}
                      type="button"
                      onClick={() => setOrderBy('updated_at')}
                    >
                      Aggiornato
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {isLoading ? <Loading label={`Loading ${title.toLowerCase()}…`} /> : null}
      {error ? <ErrorState title={`Could not load ${title}`} error={error} /> : null}

      {!isLoading && !error && sortedItems.length === 0 ? (
        <div className="alert alert-secondary" role="alert">
          No items found.
        </div>
      ) : null}

      {!isLoading && !error && sortedItems.length > 0 ? (
        variant === 'projects' ? (
          <div className="row g-3">
            {sortedItems.map((item, index) => {
              const id = getItemId(item)
              if (id == null) return null
              return <ProjectCard key={id} item={item} to={`${baseRoute}/${id}`} />
            })}
          </div>
        ) : variant === 'yarns' ? (
          <div className="row g-3">
            {sortedItems.map((item, index) => {
              const id = getItemId(item)
              if (id == null) return null
              return <YarnCard key={id} item={item} to={`${baseRoute}/${id}`} />
            })}
          </div>
        ) : (
          <div className="list-group">
            {sortedItems.map((item, index) => {
              const id = getItemId(item)
              const label = getItemLabel(item)
              const secondary =
                (item && typeof item === 'object' && item.translation && typeof item.translation === 'object'
                  ? item.translation.status
                  : null) ??
                (item && typeof item === 'object' ? item.status : null)

              if (id == null) {
                return (
                  <div key={index} className="list-group-item">
                    <div className="fw-semibold">{label}</div>
                    <div className="small text-muted">Missing id field</div>
                  </div>
                )
              }

              return (
                <Link
                  key={id}
                  className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                  to={`${baseRoute}/${id}`}
                >
                  <span>
                    <div className="fw-semibold">{label}</div>
                    {secondary ? <div className="small text-muted">{String(secondary)}</div> : null}
                  </span>
                  <span className="badge text-bg-light">#{id}</span>
                </Link>
              )
            })}
          </div>
        )
      ) : null}

      <div className="mt-4 d-flex justify-content-start">
        <Link className="btn btn-cute font-quicksand" to="/">
          ← Indietro
        </Link>
      </div>
    </div>
  )
}
