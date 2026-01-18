import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import ErrorState from '../components/ErrorState'
import Loading from '../components/Loading'
import { fetchResourceDetail } from '../api/resources'
import { getItemLabel } from '../api/http'
import { API_BASE_URL } from '../api/config'

function formatDateEU(value) {
  if (!value) return '—'
  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return String(value)
  const dd = String(date.getDate()).padStart(2, '0')
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const yyyy = String(date.getFullYear())
  return `${dd}/${mm}/${yyyy}`
}

function buildMediaUrl(path) {
  if (!path) return null
  const asString = String(path)
  if (/^https?:\/\//i.test(asString)) return asString

  const clean = asString.replace(/^\/+/, '')
  const base = (API_BASE_URL || '').replace(/\/+$/, '')

  if (!base) return `/${clean}`
  if (clean.startsWith('storage/')) return `${base}/${clean}`
  return `${base}/storage/${clean}`
}

function MiniCalendar({ label, date }) {
  return (
    <div className="mini-calendar font-quicksand">
      <div className="mini-calendar__top">{label}</div>
      <div className="mini-calendar__date">{formatDateEU(date)}</div>
    </div>
  )
}

function MiniStat({ label, value }) {
  return (
    <div className="mini-calendar font-quicksand">
      <div className="mini-calendar__top">{label}</div>
      <div className="mini-calendar__date">{value ?? '—'}</div>
    </div>
  )
}

function ProjectCard({ project }) {
  const id = project?.id
  const title = getItemLabel(project)
  const status = project?.translation?.status
  const category =
    project?.category?.translation?.name ??
    project?.category?.translation?.title ??
    project?.category?.name ??
    project?.category?.key

  const createdAt = formatDateEU(project?.created_at)
  const updatedAt = formatDateEU(project?.updated_at)
  const img = buildMediaUrl(project?.image_path)

  if (id == null) return null

  return (
    <div className="col-12 col-md-6 col-lg-4">
      <Link to={`/projects/${id}`} className="text-decoration-none">
        <div className="card h-100 shadow-sm font-quicksand">
          {img ? (
            <img
              src={img}
              alt={title}
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
              {title}
            </div>

            <div className="small text-muted">
              {status ? (
                <div>
                  <span className="fw-semibold">Stato:</span> {String(status)}
                </div>
              ) : null}
              {category ? (
                <div>
                  <span className="fw-semibold">Categoria:</span> {String(category)}
                </div>
              ) : null}
              <div className="mt-2">
                <div>
                  <span className="fw-semibold">Aggiunto:</span> {createdAt}
                </div>
                <div>
                  <span className="fw-semibold">Aggiornato:</span> {updatedAt}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
}

function FiberChip({ fiberYarn, isActive, onClick }) {
  const fiber = fiberYarn?.fiber
  const name = fiber?.translation?.name ?? fiber?.translation?.title ?? fiber?.name ?? fiber?.key ?? 'Fibra'
  const pct = fiberYarn?.percentage

  return (
    <button
      type="button"
      className={`btn btn-sm ${isActive ? 'btn-dark' : 'btn-outline-secondary'} font-quicksand`}
      onClick={onClick}
    >
      {String(name)}{pct != null ? ` • ${pct}%` : ''}
    </button>
  )
}

export default function YarnDetailPage({ title, resourcePath, baseRoute }) {
  const { id } = useParams()
  const [item, setItem] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeFiberId, setActiveFiberId] = useState(null)

  useEffect(() => {
    let isMounted = true

    async function load() {
      try {
        setIsLoading(true)
        setError(null)
        const detail = await fetchResourceDetail(resourcePath, id)
        if (isMounted) setItem(detail)
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
  }, [resourcePath, id])

  const heading = item ? (item?.name ? String(item.name) : getItemLabel(item)) : `${title} #${id}`

  const imageUrl = useMemo(() => buildMediaUrl(item?.image_path), [item])

  const createdAt = item?.created_at
  const updatedAt = item?.updated_at
  const colorType = item?.translation?.color_type

  const fibers = Array.isArray(item?.fiber_yarns) ? item.fiber_yarns : []
  const activeFiber = fibers.find((fy) => (fy?.fiber?.id ?? fy?.fiber_id) === activeFiberId) || null

  const relatedProjects = useMemo(() => {
    const projectYarns = Array.isArray(item?.project_yarns) ? item.project_yarns : []
    const projects = projectYarns.map((py) => py?.project).filter(Boolean)

    const unique = new Map()
    for (const p of projects) {
      if (p?.id == null) continue
      unique.set(p.id, p)
    }
    return Array.from(unique.values())
  }, [item])

  return (
    <div className="container py-4">
      <div className="row g-2 align-items-end mb-3">
        <div className="col-12 col-md-4 d-flex justify-content-start">
          <Link className="btn btn-outline-secondary font-quicksand" to={baseRoute}>
            ← Indietro
          </Link>
        </div>

        <div className="col-12 col-md-4 text-center">
          <h2 className="mb-1 font-walter">{heading}</h2>
          {item?.brand ? <div className="font-quicksand text-muted">{String(item.brand)}</div> : null}
        </div>

        <div className="col-12 col-md-4 d-flex justify-content-md-end justify-content-start" />
      </div>

      {isLoading ? <Loading label="Caricamento…" /> : null}
      {error ? <ErrorState title="Could not load item" error={error} /> : null}

      {!isLoading && !error && item ? (
        <div className="row g-4">
          <div className="col-12 col-lg-5">
            <div className="polaroid">
              {imageUrl ? (
                <img
                  className="polaroid__img"
                  src={imageUrl}
                  alt={heading}
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                  }}
                />
              ) : (
                <div className="polaroid__placeholder" aria-hidden="true" />
              )}
              <div className="polaroid__caption font-walter">{heading}</div>
            </div>
          </div>

          <div className="col-12 col-lg-7">
            <div className="d-flex gap-3 flex-wrap mb-4">
              <MiniCalendar label="Aggiunto" date={createdAt} />
              <MiniCalendar label="Aggiornato" date={updatedAt} />
              <MiniStat label="Fibre" value={item?.fiber_types_number ?? fibers.length ?? '—'} />
            </div>

            <div className="card shadow-sm">
              <div className="card-body font-quicksand">
                <h5 className="font-walter mb-3">Dettagli</h5>

                <div className="row g-3">
                  <div className="col-12 col-md-6">
                    <div className="text-muted small">Marca</div>
                    <div className="fw-semibold">{item?.brand || '—'}</div>
                  </div>

                  <div className="col-12 col-md-6">
                    <div className="text-muted small">Peso</div>
                    <div className="fw-semibold">{item?.weight || '—'}</div>
                  </div>

                  <div className="col-12 col-md-6">
                    <div className="text-muted small">Categoria</div>
                    <div className="fw-semibold">{item?.category || '—'}</div>
                  </div>

                  <div className="col-12 col-md-6">
                    <div className="text-muted small">Colore</div>
                    <div className="fw-semibold">{colorType || '—'}</div>
                  </div>

                  <div className="col-12 col-md-6">
                    <div className="text-muted small">Peso unità</div>
                    <div className="fw-semibold">
                      {item?.unit_weight != null ? `${String(item.unit_weight)} g` : '—'}
                    </div>
                  </div>

                  <div className="col-12 col-md-6">
                    <div className="text-muted small">Metri</div>
                    <div className="fw-semibold">
                      {item?.meterage != null ? String(item.meterage) : '—'}
                    </div>
                  </div>

                  <div className="col-12 col-md-6">
                    <div className="text-muted small">Uncinetto</div>
                    <div className="fw-semibold">
                      {item?.min_hook_size || item?.max_hook_size
                        ? `${item?.min_hook_size || '—'} – ${item?.max_hook_size || '—'}`
                        : '—'}
                    </div>
                  </div>

                  <div className="col-12 col-md-6">
                    <div className="text-muted small">Ferri</div>
                    <div className="fw-semibold">
                      {item?.min_needle_size || item?.max_needle_size
                        ? `${item?.min_needle_size || '—'} – ${item?.max_needle_size || '—'}`
                        : '—'}
                    </div>
                  </div>

                  <div className="col-12">
                    <div className="text-muted small">Fibre</div>
                    {fibers.length === 0 ? (
                      <div className="fw-semibold">—</div>
                    ) : (
                      <div className="d-flex flex-wrap gap-2">
                        {fibers.map((fy) => {
                          const fiberId = fy?.fiber?.id ?? fy?.fiber_id
                          const isActive = fiberId != null && fiberId === activeFiberId
                          return (
                            <FiberChip
                              key={fy.id ?? `${fy.yarn_id}-${fiberId}`}
                              fiberYarn={fy}
                              isActive={isActive}
                              onClick={() => setActiveFiberId(isActive ? null : fiberId)}
                            />
                          )
                        })}
                      </div>
                    )}

                    {activeFiber ? (
                      <div className="mt-2 small text-muted">
                        Selezionata: {activeFiber?.fiber?.translation?.name ?? activeFiber?.fiber?.key}
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <div className="d-flex align-items-end justify-content-between gap-2">
                <h5 className="font-walter mb-0">Progetti</h5>
                <div className="small text-muted font-quicksand">{relatedProjects.length} totale</div>
              </div>

              {relatedProjects.length === 0 ? (
                <div className="alert alert-secondary mt-3" role="alert">
                  Nessun progetto associato a questo filato.
                </div>
              ) : (
                <div className="row g-3 mt-1">
                  {relatedProjects.map((p) => (
                    <ProjectCard key={p.id} project={p} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : null}

      <div className="mt-4 d-flex justify-content-start">
        <Link className="btn btn-outline-secondary font-quicksand" to={baseRoute}>
          ← Indietro
        </Link>
      </div>
    </div>
  )
}
