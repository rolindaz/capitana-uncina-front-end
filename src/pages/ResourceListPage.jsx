import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import ErrorState from '../components/ErrorState'
import Loading from '../components/Loading'
import { fetchResourceList } from '../api/resources'
import { getItemId, getItemLabel } from '../api/http'

export default function ResourceListPage({ title, resourcePath, baseRoute }) {
  const [items, setItems] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) =>
      String(getItemLabel(a)).localeCompare(String(getItemLabel(b)))
    )
  }, [items])

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
      <div className="d-flex align-items-end justify-content-between gap-3 mb-3">
        <div>
          <h2 className="mb-1">{title}</h2>
          <div className="text-muted small">Endpoint: {resourcePath}</div>
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
        <div className="list-group">
          {sortedItems.map((item, index) => {
            const id = getItemId(item)
            const label = getItemLabel(item)

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
                <span className="fw-semibold">{label}</span>
                <span className="badge text-bg-light">#{id}</span>
              </Link>
            )
          })}
        </div>
      ) : null}

      <div className="mt-3">
        <Link className="btn btn-link px-0" to="/">
          ← Back home
        </Link>
      </div>
    </div>
  )
}
