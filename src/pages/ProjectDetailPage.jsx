//#region Importazioni

import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import ErrorState from '../components/ErrorState'
import Loading from '../components/Loading'
import { fetchResourceDetail } from '../api/resources'
import { getResourceLabel } from '../resource/get-data'
import {
  formatDate,
  formatInteger,
  toNumberOrNull,
  buildMediaUrl
} from '../resource/format-data'

//#endregion

// Minicomponente calendario
function MiniCalendar({ label, date }) {
  return (
    <div className="mini-calendar font-quicksand">
      <div className="mini-calendar__top">{label}</div>
      <div className="mini-calendar__date">{formatDate(date)}</div>
    </div>
  )
}

// Componente per la visualizzazione dei filati utilizzati
function YarnUsedCard({ list }) {

  // Prendo i dati dei filati (id, slug, nome, marca, peso standard, immagine)
  const yarn = list?.yarn
  const yarnId = yarn?.id ?? list?.yarn_id
  const yarnSlug = yarn?.slug
  const title = yarn?.name ?? (yarnId != null ? `Filato #${yarnId}` : 'Filato')
  const subtitleParts = [yarn?.brand, yarn?.weight].filter(Boolean)
  const subtitle = subtitleParts.length ? subtitleParts.join(' • ') : null

  const yarnImgUrl = buildMediaUrl(yarn?.image_path)

  // Prendo i singoli oggetti della lista (se ce ne sono più d'uno) di filati
  const entriesRaw = list?.entries
  const entries = Array.isArray(entriesRaw) ? entriesRaw : []

  // Calcolo per ogni voce della lista la quantità di filato (n. di gomitoli), i metri e i grammi usati (se presenti, sennò null)
  const totalQtyNumber = entries.reduce((sum, entry) => {
    const numeric = toNumberOrNull(entry?.quantity)
    return numeric == null ? sum : sum + numeric
  }, 0)
  const hasAnyQty = entries.some((entry) => entry?.quantity != null && entry?.quantity !== '')
  const qty = hasAnyQty ? totalQtyNumber : null

  const totalMeterageNumber = entries.reduce((sum, entry) => {
    const numeric = toNumberOrNull(entry?.meterage)
    return numeric == null ? sum : sum + numeric
  }, 0)
  const hasAnyMeterage = entries.some((entry) => entry?.meterage != null && entry?.meterage !== '')
  const meterage = hasAnyMeterage ? totalMeterageNumber : null

  const totalWeightNumber = entries.reduce((sum, entry) => {
    const numeric = toNumberOrNull(entry?.weight)
    return numeric == null ? sum : sum + numeric
  }, 0)
  const hasAnyWeight = entries.some((entry) => entry?.weight != null && entry?.weight !== '')
  const weight = hasAnyWeight ? totalWeightNumber : null

  return (
    <div className="col-12">
      <Link
        to={yarnSlug || yarnId != null ? `/yarns/${encodeURIComponent(String(yarnSlug ?? yarnId))}` : '#'}
        className="text-decoration-none d-block"
      >
        <div className="card shadow-sm font-quicksand overflow-hidden">
          <div className="d-flex yarn-used-card">
            <div className="yarn-used-card__media" aria-hidden={!yarnImgUrl}>
              {yarnImgUrl ? (
                <img
                  src={yarnImgUrl}
                  alt={title}
                  className="yarn-used-card__img"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                  }}
                />
              ) : (
                <div className="yarn-used-card__img yarn-used-card__img--placeholder" aria-hidden="true" />
              )}
            </div>

            <div className="card-body flex-grow-1">
              <div className="d-flex align-items-start justify-content-between gap-3 flex-wrap">
                <div style={{ minWidth: 0 }}>
                  <div className="fw-semibold font-walter" style={{ lineHeight: 1.2 }}>
                    {title}
                  </div>
                  {subtitle ? <div className="small text-muted">{subtitle}</div> : null}
                </div>

                <div className="small text-muted" style={{ whiteSpace: 'nowrap' }}>
                  {qty != null ? (
                    <span>
                      <span className="fw-semibold">Tot:</span> {formatInteger(qty)} gomitoli
                    </span>
                  ) : null}
                  {meterage != null ? (
                    <span className={qty != null ? 'ms-3' : ''}>
                      <span className="fw-semibold">Metri:</span> {formatInteger(meterage)}
                    </span>
                  ) : null}
                  {weight != null ? (
                    <span className={qty != null || meterage != null ? 'ms-3' : ''}>
                      <span className="fw-semibold">Peso:</span> {formatInteger(weight)} g
                    </span>
                  ) : null}
                </div>
              </div>
              
              {/* N.B.: ENTRY = UN'ISTANZA DI PROJECT_YARN */}
              {entries.length > 0 ? (
                <div className="mt-3">

                  {/* Titoli delle colonne */}
                  <div className="yarnused-colorway-grid yarnused-colorway-grid--header text-muted">
                    <span />
                    <span>
                      Colore
                    </span>
                    <span className="text-end">
                      Qtà
                    </span>
                    <span className="text-end">
                      Metri
                    </span>
                    <span className="text-end">
                      Peso
                    </span>
                  </div>

                  {/* Ciclo sulla entry/project_yarn per formare le righe della tabella */}
                  <div className="d-flex flex-column gap-2 mt-2">
                    {entries.map((entry, index) => {

                      {/* Mi prendo il colore */}
                      const colorway = entry?.colorway
                      const colorwayId = colorway?.id ?? entry?.colorway_id
                      const colorwayName =
                        colorway?.name ??
                        colorway?.translation?.name ??
                        colorway?.key ??
                        (entry?.colorway_id != null ? `Colorway #${entry?.colorway_id}` : '—')

                      const colorwayImg = buildMediaUrl(
                        colorway?.image_path
                      )

                      {/* Mi prendo quantità, peso e metraggio */}
                      const entryQty = entry?.quantity
                      const entryWeight = entry?.weight
                      const entryMeterage = entry?.meterage

                      return (
                        <div key={String(colorwayId)} className="yarnused-colorway-grid">
                          {colorwayImg ? (
                            <img
                              src={colorwayImg}
                              alt={String(colorwayName)}
                              className="colorway-thumb"
                              loading="lazy"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none'
                              }}
                            />
                          ) : (
                            <div className="colorway-thumb colorway-thumb--placeholder" aria-hidden="true" />
                          )}

                          <div className="text-truncate" title={String(colorwayName)}>
                            {String(colorwayName)}
                          </div>

                          <div className="text-end" style={{ whiteSpace: 'nowrap' }}>
                            {entryQty != null && entryQty !== '' ? formatInteger(entryQty) : '—'}
                          </div>

                          <div className="text-end" style={{ whiteSpace: 'nowrap' }}>
                            {entryMeterage != null && entryMeterage !== '' ? formatInteger(entryMeterage) : '—'}
                          </div>

                          <div className="text-end" style={{ whiteSpace: 'nowrap' }}>
                            {entryWeight != null && entryWeight !== '' ? `${formatInteger(entryWeight)} g` : '—'}
                          </div>
                        </div>
                      )
                    })}
                  </div>
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
  const params = useParams()
  const slug = params?.slug ?? params?.id
  const [item, setItem] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch del progetto
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

  console.log(item);

  // Prendo il titlo del progetto
  const heading = item ? getResourceLabel(item) : `${title} #${slug}`

  // Prendo i dettagli del progetto che voglio mostrare (stato, note, per chi è, categoria, tecniche, data di inizio, data di fine, ore totali, nome e link dello schema, nome del designer, taglia, percorso dell'immagine, lista di filati usati (project_yarns))
  const status = item?.status ?? item?.translation?.status ?? '—'
  const notes = item?.notes ?? item?.translation?.notes
  const destinationUse = item?.destination_use ?? item?.translation?.destination_use
  const categoryName = item?.category?.name ?? item?.category?.translation?.name ?? item?.category?.key
  const crafts = item?.crafts

  // Estraggo e salvo i nomi delle tecniche come useMemo
  const craftNames = useMemo(() => {
    if (!Array.isArray(crafts)) return []
    return crafts
      .map((craft) => craft?.name ?? craft?.translation?.name ?? craft?.key)
      .filter(Boolean)
  }, [crafts])
  
  const started = item?.started
  const completed = item?.completed
  const executionTime = item?.execution_time

  const patternName = item?.pattern_name
  const patternUrl = item?.pattern_url
  const designerName = item?.designer_name ?? item?.translation?.designer_name
  const size = item?.size

  const imageUrl = useMemo(() => buildMediaUrl(item?.image_path), [item])
  const yarnsUsed = Array.isArray(item?.project_yarns) ? item.project_yarns : []

  // Estraggo la lista di id dei filati usati e lo salvo con useMemo
  const yarnLists = useMemo(() => {
    const lists = new Map()
    for (const py of yarnsUsed) {
      const yarn = py?.yarn
      const yarnId = yarn?.id ?? py?.yarn_id
      const key = yarnId != null ? String(yarnId) : String(py?.id ?? Math.random())
      const existing = lists.get(key)
      if (existing) {
        existing.entries.push(py)
      } else {
        lists.set(key, { yarn, yarn_id: yarnId, entries: [py] })
      }
    }
    return Array.from(lists.values())
  }, [yarnsUsed])

  return (
    <div className="container py-4">

      {/* PRIMA SEZIONE del main: riga con: pulsante torna indietro + titolo e stato del progetto */}
      <div className="row g-2 align-items-end my-5">

        {/* Pulsante torna indietro */}
        <div className="col-12 col-md-4 d-flex justify-content-start">
          <Link className="btn btn-cute font-quicksand" to={baseRoute}>
            ← Indietro
          </Link>
        </div>

        {/* Titolo */}
        <div className="col-12 col-md-4 text-center">
          <h2 className="mb-1 fs-1 font-walter">{heading}</h2>
          {status ? <div className="font-quicksand fs-4 text-muted">{String(status)}</div> : null}
        </div>

        <div className="col-12 col-md-4 d-flex justify-content-md-end justify-content-start" />
      </div>

      {isLoading ? <Loading label="Caricamento…" /> : null}
      {error ? <ErrorState title="Could not load item" error={error} /> : null}

      {/* SECONDA SEZIONE del main: Scheda dettaglio progetto */}
      {!isLoading && !error && item ? (
        <div className="row g-4">
          
          {/* Immagine progetto */}
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
          
          <div className="col-12 col-lg-7 px-4">
            {/* Date di inizio e conclusione */}
            <div className="d-flex gap-3 flex-wrap mb-4 justify-content-evenly">
              <MiniCalendar label="Iniziato" date={started} />
              <MiniCalendar label="Completato" date={completed} />
              <div className="mini-calendar font-quicksand">
                <div className="mini-calendar__top">Ore totali</div>
                <div className="mini-calendar__date">{executionTime ? `${executionTime} h` : '-'}</div>
              </div>
            </div>
            
            {/* Dettagli */}
            <div className="card shadow-sm">
              <div className="card-body font-quicksand">
                <h5 className="font-walter mb-3" style={{color: '#F37046'}}>
                  Dettagli
                </h5>

                <div className="row g-3">
                  <div className="col-12 col-md-6">
                    <div className="text-muted small">Categoria</div>
                    <div className="fw-semibold">{categoryName || '—'}</div>
                  </div>

                  <div className="col-12 col-md-6">
                    <div className="text-muted small">Tecniche</div>
                    <div className="fw-semibold">{craftNames.length ? craftNames.join(', ') : '—'}</div>
                  </div>

                  <div className="col-12 col-md-6">
                    <div className="text-muted small">Per chi?</div>
                    <div className="fw-semibold">{destinationUse || '—'}</div>
                  </div>

                  <div className="col-12 col-md-6">
                    <div className="text-muted small">Taglia</div>
                    <div className="fw-semibold">{size || '—'}</div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Schema */}
            <div className="card shadow-sm mt-4">
              <div className="card-body font-quicksand">
                <h5 className="font-walter mb-3" style={{color: '#F37046'}}>Schema</h5>

                <div className="row align-items-baseline justify-content-between flex-wrap">
                  <div className='col col-12 col-md-6'>
                    <span className="text-muted small">Designer</span>
                    <div className="fw-semibold">{designerName || '—'}</div>
                  </div>

                  <div className='col col-12 col-md-6'>
                    <span className="text-muted small">Schema</span>
                    <div className="fw-semibold">
                      {patternUrl ? (
                        <a href={patternUrl} target="_blank" rel="noreferrer" className="text-decoration-none">
                          {patternName || patternUrl}
                        </a>
                      ) : (
                        <span>{patternName || '—'}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Note */}
            {notes ? (
              <div className="mt-4">
                <h5 className="font-walter fs-3 mb-2" style={{color: '#F37046'}}>Note</h5>
                <div className="font-quicksand fs-5 text-muted" style={{ whiteSpace: 'pre-wrap' }}>
                  {String(notes)}
                </div>
              </div>
            ) : null}

            {/* Scheda filati usati */}
            {yarnLists.length > 0 ? (
              <div className="mt-4">
                <div className="d-flex align-items-end justify-content-between gap-2">
                  <h5 className="font-walter mb-0" style={{color: '#F37046'}}>Filati usati {yarnLists.length > 0 ? `(${yarnLists.length})` : ''}</h5>
                </div>
                <div className="row g-3 mt-1">
                  {yarnLists.map((list) => (
                    <YarnUsedCard key={list?.yarn_id ?? list?.yarn?.id ?? Math.random()} list={list} />
                  ))}
                </div>
              </div>
            ) : null}
          </div>
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
