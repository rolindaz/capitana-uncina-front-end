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

function formatHours(value) {
  if (value == null || value === '') return '—'
  const number = typeof value === 'number' ? value : Number(value)
  if (Number.isNaN(number)) return String(value)
  return `${number} h`
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

function YarnUsedCard({ projectYarn }) {
  const yarn = projectYarn?.yarn
  const yarnId = yarn?.id ?? projectYarn?.yarn_id
  const title = yarn?.name ?? (yarnId != null ? `Filato #${yarnId}` : 'Filato')
  const subtitleParts = [yarn?.brand, yarn?.weight].filter(Boolean)
  const subtitle = subtitleParts.length ? subtitleParts.join(' • ') : null

  const imgUrl = buildMediaUrl(yarn?.image_path)

  const qty = projectYarn?.quantity
  const meterage = projectYarn?.meterage
  const weight = projectYarn?.weight

  return (
    <div className="col-12 col-md-6 col-lg-4">
      <Link to={yarnId != null ? `/yarns/${yarnId}` : '#'} className="text-decoration-none">
        <div className="card h-100 shadow-sm font-quicksand">
          {imgUrl ? (
            <img
              src={imgUrl}
              alt={title}
              className="card-img-top"
              style={{ height: 160, objectFit: 'cover', background: '#f3f3f3' }}
              loading="lazy"
              onError={(e) => {
                e.currentTarget.style.display = 'none'
              }}
            />
          ) : (
            <div className="bg-light" style={{ height: 160 }} aria-hidden="true" />
          )}

          <div className="card-body">
            <div className="fw-semibold font-walter" style={{ lineHeight: 1.2 }}>
              {title}
            </div>
            {subtitle ? <div className="small text-muted">{subtitle}</div> : null}

            <div className="mt-2 small text-muted">
              {qty != null ? (
                <div>
                  <span className="fw-semibold">Quantità:</span> {String(qty)}
                </div>
              ) : null}
              {meterage != null ? (
                <div>
                  <span className="fw-semibold">Metri:</span> {String(meterage)}
                </div>
              ) : null}
              {weight != null ? (
                <div>
                  <span className="fw-semibold">Peso:</span> {String(weight)} g
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
}

export default function ProjectDetailPage({ title, resourcePath, baseRoute }) {
  const { id } = useParams()
  const [item, setItem] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

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

  const heading = item ? getItemLabel(item) : `${title} #${id}`

  const status = item?.translation?.status ?? '—'
  const notes = item?.translation?.notes
  const destinationUse = item?.translation?.destination_use
  const categoryName =
    item?.category?.translation?.name ?? item?.category?.translation?.title ?? item?.category?.name ?? item?.category?.key

  const started = item?.started
  const completed = item?.completed
  const executionTime = item?.execution_time

  const patternName = item?.pattern_name
  const patternUrl = item?.pattern_url
  const size = item?.size

  const imageUrl = useMemo(() => buildMediaUrl(item?.image_path), [item])
  const yarnsUsed = Array.isArray(item?.project_yarns) ? item.project_yarns : []

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
          {status ? <div className="font-quicksand text-muted">{String(status)}</div> : null}
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
              <MiniCalendar label="Inizio" date={started} />
              <MiniCalendar label="Completato" date={completed} />
              <div className="mini-calendar font-quicksand">
                <div className="mini-calendar__top">Tempo</div>
                <div className="mini-calendar__date">{formatHours(executionTime)}</div>
              </div>
            </div>

            <div className="card shadow-sm">
              <div className="card-body font-quicksand">
                <h5 className="font-walter mb-3">Dettagli</h5>

                <div className="row g-3">
                  <div className="col-12 col-md-6">
                    <div className="text-muted small">Categoria</div>
                    <div className="fw-semibold">{categoryName || '—'}</div>
                  </div>

                  <div className="col-12 col-md-6">
                    <div className="text-muted small">Uso</div>
                    <div className="fw-semibold">{destinationUse || '—'}</div>
                  </div>

                  <div className="col-12 col-md-6">
                    <div className="text-muted small">Taglia</div>
                    <div className="fw-semibold">{size || '—'}</div>
                  </div>

                  <div className="col-12 col-md-6">
                    <div className="text-muted small">Schema</div>
                    {patternUrl ? (
                      <a className="fw-semibold" href={patternUrl} target="_blank" rel="noreferrer">
                        {patternName || patternUrl}
                      </a>
                    ) : (
                      <div className="fw-semibold">{patternName || '—'}</div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {notes ? (
              <div className="mt-4">
                <h5 className="font-walter mb-2">Note</h5>
                <div className="font-quicksand text-muted" style={{ whiteSpace: 'pre-wrap' }}>
                  {String(notes)}
                </div>
              </div>
            ) : null}

            <div className="mt-4">
              <div className="d-flex align-items-end justify-content-between gap-2">
                <h5 className="font-walter mb-0">Filati usati</h5>
                <div className="small text-muted font-quicksand">{yarnsUsed.length} totale</div>
              </div>

              {yarnsUsed.length === 0 ? (
                <div className="alert alert-secondary mt-3" role="alert">
                  Nessun filato associato a questo progetto.
                </div>
              ) : (
                <div className="row g-3 mt-1">
                  {yarnsUsed.map((py) => (
                    <YarnUsedCard key={py.id ?? `${py.project_id}-${py.yarn_id}`} projectYarn={py} />
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
