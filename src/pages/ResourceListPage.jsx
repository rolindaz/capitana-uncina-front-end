// #region Importazioni

// Importo da React
/*

useEffect: esegue delle operazioni dopo un render come conseguenza di quel render o, volendo, della variazione di una dipendenza che gli viene passata tra le quadre

useMemo: salva in una variabile un valore pesante da ricalcolare per preservarlo ad ogni render. Vuole una dipendenza il cui valore, quando varia, triggera il ricalcolo e quindi l'esecuzione della funzione useMemo (così la lista non viene ricalcolata ogni volta che la pagina viene renderizzata)

useState: salva in una variabile locale di stato un valore e gli associa un metodo per aggiornarlo. La variabile va passata ad un componente funzionale di React che si rirenderizza all'aggiornarsi di quel valore (se il valore non muta, viene conservato al suo stato attuale tra i vari render)

*/
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

// Importo i componenti
import ErrorState from '../components/ErrorState'
import Loading from '../components/Loading'

// Importo risorse utili dai file di logica api
import { fetchResourceList } from '../api/resources'
import { API_BASE_URL } from '../api/http'

// Importo risorse utili dal file di approvvigionamento dati
import { getItemSlug, getResourceId, getResourceLabel, getYarnFiberNames, getProjectCategory, getProjectStatus, getYarnStandardWeight } from '../resource/get-data'

// Importo risorse utili dal file di formattazione dati
import { formatDate, buildMediaUrl } from '../resource/format-data'

// #endregion

// Funzione per il menù a tendina per la selezione del filtro
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

// Card del progetto
function ProjectCard({ item, to }) {
  const title = getResourceLabel(item)
  const status = getProjectStatus(item)
  const category = getProjectCategory(item)
  const createdAt = formatDate(item?.created_at)
  const updatedAt = formatDate(item?.updated_at)
  const img = buildMediaUrl(item?.image_path)

  console.log(item);

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
                // Se l'immagine non è disponibile, nascondi l'area immagine
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
                <span className="fw-semibold span-title">
                  Stato: {' '}
                </span> 
                {status}
              </div>
              <div>
                <span className="fw-semibold span-title">
                  Categoria: {' '}
                </span> 
                {category}
              </div>
              <div className="mt-2">
                <div>
                  <span className="fw-semibold span-title">
                    Aggiunto: {' '}
                  </span> 
                  {createdAt}
                </div>
                <div>
                  <span className="fw-semibold span-title">
                    Aggiornato: {' '}
                  </span> 
                  {updatedAt}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
}

// Card del filato
function YarnCard({ item, to }) {
  const name = item?.name ? String(item.name) : getResourceLabel(item)
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
            <div className="card-title fw-semibold mb-2 font-walter" style={{ lineHeight: 1.2, color: '#F37046' }}>
              {name}
            </div>

            <div className="small text-muted">
              <div>
                <span className="fw-semibold span-title">
                  Marca: {' '}
                </span> 
                {brand}
              </div>
              <div className="mt-2">
                <div>
                  <span className="fw-semibold span-title">
                    Aggiunto: {' '}
                  </span> 
                  {createdAt}
                </div>
                <div>
                  <span className="fw-semibold span-title">
                    Aggiornato: {' '}
                  </span> 
                  {updatedAt}
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

  {/* Variabili di stato generali */}
  const [items, setItems] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [orderBy, setOrderBy] = useState('name')

  {/* Variabili di stato per la paginazione */}
  const [page, setPage] = useState(1)
  const pageSize = 9

  {/* Variabili di stato per i filtri */}
  const [projectCategoryFilter, setProjectCategoryFilter] = useState(null)
  const [projectStatusFilter, setProjectStatusFilter] = useState(null)
  const [yarnFiberFilter, setYarnFiberFilter] = useState(null)
  const [yarnWeightFilter, setYarnWeightFilter] = useState(null)

  const isPaginated = variant === 'projects' || variant === 'yarns'

  // #region Variabili useMemo per ordinazione e filtri
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
      const label = getProjectCategory(item)
      if (label && label !== '—') unique.add(label)
    }
    return Array.from(unique.values()).sort((a, b) => a.localeCompare(b))
  }, [items, variant])

  const projectStatusOptions = useMemo(() => {
    if (variant !== 'projects') return []
    const unique = new Set()
    for (const item of items) {
      const label = getProjectStatus(item)
      if (label && label !== '—') unique.add(label)
    }
    return Array.from(unique.values()).sort((a, b) => a.localeCompare(b))
  }, [items, variant])

  const yarnFiberOptions = useMemo(() => {
    if (variant !== 'yarns') return []
    const unique = new Set()
    for (const item of items) {
      for (const name of getYarnFiberNames(item)) {
        const label = name
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
        String(getResourceLabel(a)).localeCompare(String(getResourceLabel(b)))
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
          return getResourceLabel(item)
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
        cmp = String(getResourceLabel(a)).localeCompare(String(getResourceLabel(b)))
      }

      return direction === 'desc' ? -cmp : cmp
    })
  }, [filteredItems, variant, orderBy])

  // #endregion

  // #region Variabili e useEffect per la paginazione

  // Torno a pagina 1 ogni volta che cambio l'ordine delle risorse o applico un filtro
  useEffect(() => {
    setPage(1)
  }, [orderBy, projectCategoryFilter, projectStatusFilter, yarnFiberFilter, yarnWeightFilter, variant])

  const totalItems = sortedItems.length
  const totalPages = useMemo(() => {
    if (!isPaginated) return 1
    if (totalItems <= 0) return 1
    return Math.max(1, Math.ceil(totalItems / pageSize))
  }, [isPaginated, totalItems])

  const currentPage = Math.min(Math.max(1, page), totalPages)

  useEffect(() => {
    if (page !== currentPage) setPage(currentPage)
  }, [page, currentPage])

  const paginatedItems = useMemo(() => {
    if (!isPaginated) return sortedItems

    const start = (currentPage - 1) * pageSize
    const end = start + pageSize
    return sortedItems.slice(start, end)
  }, [sortedItems, isPaginated, currentPage])

  const paginationPages = useMemo(() => {
    if (!isPaginated) return []
    if (totalPages <= 1) return [1]

    const pages = new Set([1, totalPages, currentPage - 1, currentPage, currentPage + 1])
    const numeric = Array.from(pages)
      .filter((n) => n >= 1 && n <= totalPages)
      .sort((a, b) => a - b)

    const out = []
    let prev = null
    for (const n of numeric) {
      if (prev != null && n - prev > 1) out.push('ellipsis')
      out.push(n)
      prev = n
    }
    return out
  }, [isPaginated, totalPages, currentPage])

  const paginationControls =
    !isLoading && !error && isPaginated && sortedItems.length > 0 && totalPages > 1 ? (
      <nav className="mt-4 mb-4" aria-label="Pagination">
        <div className="d-flex align-items-center justify-content-between gap-2">
          <ul className="pagination pagination-cute mb-0">
            <li className={`page-item ${currentPage <= 1 ? 'disabled' : ''}`}>
              <button
                type="button"
                className="page-link"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                aria-label="Previous"
              >
                ‹
              </button>
            </li>
          </ul>

          <ul className="pagination pagination-cute mb-0 justify-content-center flex-wrap">
            {paginationPages.map((p, idx) =>
              p === 'ellipsis' ? (
                <li key={`e-${idx}`} className="page-item disabled" aria-hidden="true">
                  <span className="page-link">…</span>
                </li>
              ) : (
                <li key={p} className={`page-item ${p === currentPage ? 'active' : ''}`}>
                  <button type="button" className="page-link" onClick={() => setPage(p)}>
                    {p}
                  </button>
                </li>
              )
            )}
          </ul>

          <ul className="pagination pagination-cute mb-0">
            <li className={`page-item ${currentPage >= totalPages ? 'disabled' : ''}`}>
              <button
                type="button"
                className="page-link"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                aria-label="Next"
              >
                ›
              </button>
            </li>
          </ul>
        </div>
      </nav>
    ) : null

  // #endregion

  // Fetch delle risorse
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

      {/* PRIMA SEZIONE del main: Pulsante torna indietro, Titolo e pulsanti filtro e ordina per */}
      <div className="row g-2 align-items-end mt-4 mb-5">

        {/* Pulsante torna indietro */}
        <div className="col-12 col-md-4 d-flex justify-content-start">
          <Link className="btn btn-cute font-quicksand" to="/">
            ← Indietro
          </Link>
        </div>

        {/* Titolo */}
        <div className="col-12 col-md-4 text-center">
          <h2 className="mb-1 font-walter fs-1">
            {title}
          </h2>
        </div>

        {/* Pulsanti filtro e ordina per */}
        <div className="col-12 col-md-4 d-flex justify-content-md-end justify-content-start">
          {variant === 'projects' || variant === 'yarns' ? (
            <div className="d-flex gap-2 flex-wrap justify-content-md-end justify-content-start">
              {variant === 'projects' ? (
                <>

                  {/* Filtra progetti per categoria */}
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
                  
                  {/* Filtra progetti per stato */}
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
                  {/* Filtra filati per fibra */}
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

                  {/* Filtra filati per peso standard */}
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

              {/* Pulsante ordina per */}
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

                  {/* Ordina per stato se la risorsa è progetti */}
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

                  {/* Ordina per marca se la risorsa è filati */}
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

                  {/* Ordina per data di creazione o di aggiornamento */}
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
      
      {/* Gestione errori di caricamento */}
      {isLoading ? <Loading label={`Carico ${title.toLowerCase()}…`} /> : null}
      {error ? <ErrorState title={`Non sono riuscito a caricare ${title}`} error={error} /> : null}

      {!isLoading && !error && sortedItems.length === 0 ? (
        <div className="alert alert-secondary" role="alert">
          Qui non c'è niente.
        </div>
      ) : null}

      {/* SECONDA SEZIONE del main: controlli di paginazione */}
      {paginationControls}
      
      {/* TERZA SEZIONE del main: griglia elenco risorse - 1: se progetti; 2: se filati */}
      {!isLoading && !error && sortedItems.length > 0 ? (
        variant === 'projects' ? (
          <div className="row g-3">
            {paginatedItems.map((item) => {
              const id = getResourceId(item)
              if (id == null) return null
              const slug = getItemSlug(item) ?? id
              return (
                <ProjectCard
                  key={id}
                  item={item}
                  to={`${baseRoute}/${encodeURIComponent(String(slug))}`}
                />
              )
            })}
          </div>
        ) : variant === 'yarns' ? (
          <div className="row g-3">
            {paginatedItems.map((item) => {
              const id = getResourceId(item)
              if (id == null) return null
              const slugOrId = getItemSlug(item) ?? id
              return (
                <YarnCard
                  key={id}
                  item={item}
                  to={`${baseRoute}/${encodeURIComponent(String(slugOrId))}`}
                />
              )
            })}
          </div>
        ) : null
      ): null}

      {/* QUARTA SEZIONE del main: controlli di paginazione */}
      {paginationControls}

      {/* QUINTA SEZIONE del main: pulsante torna indietro */}
      <div className="mt-4 d-flex justify-content-start">
        <Link className="btn btn-cute font-quicksand" to="/">
          ← Indietro
        </Link>
      </div>
    </div>
  )
}
