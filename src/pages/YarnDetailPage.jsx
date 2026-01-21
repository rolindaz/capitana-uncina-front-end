//#region Importazioni

import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import ErrorState from '../components/ErrorState'
import Loading from '../components/Loading'
import { fetchResourceDetail } from '../api/resources'
import { getResourceLabel } from '../resource/get-data'
import { formatMinMax, formatDate, buildMediaUrl } from '../resource/format-data'

//#endregion

function MiniCalendar({ label, date }) {
  return (
    <div className="mini-calendar font-quicksand">
      <div className="mini-calendar__top">{label}</div>
      <div className="mini-calendar__date">{formatDate(date)}</div>
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

// Scheda progetti creati con il filato corrente
function ProjectCard({ project }) {

  // Prendo i dati che mi servono del progetto (id, slug, nome, status, immagine)
  const id = project?.id
  const slug = project?.slug ?? project?.translation?.slug
  const title = getResourceLabel(project)
  const status = project?.status ?? project?.translation?.status
  const img = buildMediaUrl(project?.image_path)

  if (id == null) return null

  return (
    <div className="col-12 col-md-6 col-lg-4">
      <Link to={`/projects/${encodeURIComponent(String(slug ?? id))}`} className="text-decoration-none">
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
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
}

// Scheda colore disponibile
function ColorwayCard({ colorway }) {

  // Prendo i dati che mi servono del colore (id, nome (per ora key), codice e immagine)
  const id = colorway?.id
  const name =
    colorway?.translation?.name ??
    colorway?.key ??
    (id != null ? `Colore #${id}` : 'Colore')
  const code = colorway?.color_code
  const img = buildMediaUrl(colorway?.image_path)

  return (
    <div className="col-12 col-sm-6 col-lg-4">
      <div className="card h-100 shadow-sm font-quicksand">
        {img ? (
          <img
            src={img}
            alt={String(name)}
            className="card-img-top"
            style={{ height: 160, width: 160, objectFit: 'cover', background: '#f6f6f6', margin: '0 auto', borderRadius: 0 }}
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
            {String(name)}
          </div>
          {code ? <div className="small text-muted">{String(code)}</div> : null}
        </div>
      </div>
    </div>
  )
}

// Etichetta fibra
function FiberChip({ fiberYarn, isActive, onClick }) {
  const fiber = fiberYarn?.fiber
  const name = fiber?.translation?.name ?? fiber?.key ?? 'Fibra'
  const pct = fiberYarn?.percentage

  return (
    <button
      type="button"
      className={`btn btn-sm ${isActive ? 'btn-dark' : 'btn-cute'} font-quicksand`}
      onClick={onClick}
    >
      {String(name)}{pct != null ? ` • ${pct}%` : ''}
    </button>
  )
}

export default function YarnDetailPage({ title, resourcePath, baseRoute }) {
  const params = useParams()
  const slug = params?.slug ?? params?.id
  const [item, setItem] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeFiberId, setActiveFiberId] = useState(null)

  // Fetch Yarn Data
  useEffect(() => {
    let isMounted = true

    async function load() {
      try {
        setIsLoading(true)
        setError(null)
        const detail = await fetchResourceDetail(resourcePath, slug)
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
  }, [resourcePath, slug])

  // Prendo i dati che mi servono del filato (nome, immagine, creato, aggiornato, fibre, progetti correlati, colori disponibili)
  const heading = item ? (item?.name ? String(item.name) : `${title} #${slug}`) : `${title} #${slug}`

  const imageUrl = useMemo(() => buildMediaUrl(item?.image_path), [item])

  const createdAt = item?.created_at
  const updatedAt = item?.updated_at

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

  const yarnColorways = useMemo(() => {
    const direct = Array.isArray(item?.colorways) ? item.colorways : []
    const fromProjects = Array.isArray(item?.project_yarns)
      ? item.project_yarns.map((py) => py?.colorway).filter(Boolean)
      : []

    const all = [...direct, ...fromProjects].filter(Boolean)
    const unique = new Map()
    for (const c of all) {
      if (c?.id == null) continue
      unique.set(c.id, c)
    }
    return Array.from(unique.values())
  }, [item])

  return (
    <div className="container py-4">

      {/* PRIMA SEZIONE del main: riga con: pulsante torna indietro | nome e marca del filato */}
      <div className="row g-2 align-items-end my-5">

        {/* Pulsante torna indietro */}
        <div className="col-12 col-md-4 d-flex justify-content-start">
          <Link className="btn btn-cute font-quicksand" to={baseRoute}>
            ← Indietro
          </Link>
        </div>

        {/* Nome e marca del filato */}
        <div className="col-12 col-md-4 text-center">
          <h2 className="mb-1 font-walter fs-1">{heading}</h2>
          {item?.brand ? <div className="font-quicksand fs-4 text-muted">{String(item.brand)}</div> : null}
        </div>

        <div className="col-12 col-md-4 d-flex justify-content-md-end justify-content-start" />
      </div>

      {isLoading ? <Loading label="Caricamento…" /> : null}
      {error ? <ErrorState title="Could not load item" error={error} /> : null}

      {/* SECONDA SEZIONE del main: scheda di dettaglio del filato, con progetti associati e colori disponibili */}
      {!isLoading && !error && item ? (
        <div className="row g-4">

          {/* Immagine del filato */}
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
          
          {/* Scheda di dettaglio e progetti correlati */}
          <div className="col-12 col-lg-7 px-4">
            
            {/* Minicalendari con data aggiunto, data aggiornato e numero di tipi di fibre */}
            <div className="d-flex gap-3 flex-wrap mb-4 justify-content-evenly">
              <MiniCalendar label="Aggiunto" date={createdAt} />
              <MiniCalendar label="Aggiornato" date={updatedAt} />
              <MiniStat label="Fibre" value={item?.fiber_types_number ?? fibers.length ?? '—'} />
            </div>
            
            {/* Dettagli */}
            <div className="card shadow-sm">
              <div className="card-body font-quicksand">
                <h5 className="font-walter mb-3" style={{color: '#F37046'}}>Dettagli</h5>

                <div className="row g-3">
                  <div className="col-6">
                    <div className="text-muted small">Marca</div>
                    <div className="fw-semibold">{item?.brand || '—'}</div>
                  </div>

                  <div className="col-6">
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

                  <div className="col-6">
                    <div className="text-muted small">Peso</div>
                    <div className="fw-semibold">{item?.weight || '—'}</div>
                  </div>

                  <div className="col-6">
                    <div className="text-muted small">Categoria</div>
                    <div className="fw-semibold">{item?.category || '—'}</div>
                  </div>

                  <div className="col-6">
                    <div className="text-muted small">Peso unità</div>
                    <div className="fw-semibold">
                      {item?.unit_weight != null ? `${String(item.unit_weight)} g` : '—'}
                    </div>
                  </div>

                  <div className="col-6">
                    <div className="text-muted small">Metri</div>
                    <div className="fw-semibold">
                      {item?.meterage != null ? String(item.meterage) : '—'}
                    </div>
                  </div>
                  
                  <div className="col-6">
                    <div className="text-muted small">Uncinetto</div>
                    <div className="fw-semibold">
                      {formatMinMax(item?.min_hook_size, item?.max_hook_size)}
                    </div>
                  </div>

                  <div className="col-6">
                    <div className="text-muted small">Ferri</div>
                    <div className="fw-semibold">
                      {formatMinMax(item?.min_needle_size, item?.max_needle_size)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Schede progetti correlati */}
            <div className="mt-4">
              <div className="d-flex align-items-end justify-content-between gap-2">
                <h5 className="font-walter fs-3 mb-0" style={{color: '#F37046'}}>
                  Progetti {relatedProjects.length > 0 ? `(${relatedProjects.length})` : ''}
                </h5>
              </div>

              {relatedProjects.length === 0 ? (
                <div className="font-walter fs-5 mt-3" role="alert">
                  Ancora nessuno!
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

          {/* Lista colori disponibili */}
          {yarnColorways.length > 0 ? (
              <div className="mt-5">
                <div className="d-flex align-items-end justify-content-between gap-2">
                  <h5 className="font-walter mb-0" style={{color: '#F37046'}}>
                    Colori che ho usato finora ({yarnColorways.length})
                  </h5>
                </div>

                <div className="row g-3 mt-1">
                  {yarnColorways.map((c) => (
                    <ColorwayCard key={c.id} colorway={c} />
                  ))}
                </div>
              </div>
            ) : null}
        </div>
      ) : null}

      {/* TERZA SEZIONE del main: pulsante torna indietro */}
      <div className="mt-4 d-flex justify-content-start">
        <Link className="btn btn-cute font-quicksand" to={baseRoute}>
          ← Indietro
        </Link>
      </div>
    </div>
  )
}
