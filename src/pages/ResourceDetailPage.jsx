import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import ErrorState from '../components/ErrorState'
import Loading from '../components/Loading'
import { fetchResourceDetail } from '../api/resources'
import { getItemLabel } from '../api/http'

function ObjectTable({ data }) {
  if (!data || typeof data !== 'object') return null

  const entries = Object.entries(data)

  return (
    <div className="table-responsive">
      <table className="table table-sm align-middle">
        <tbody>
          {entries.map(([key, value]) => (
            <tr key={key}>
              <th style={{ width: '30%' }} className="text-nowrap">
                {key}
              </th>
              <td>
                {typeof value === 'object' && value !== null ? (
                  <pre className="mb-0 small" style={{ whiteSpace: 'pre-wrap' }}>
                    {JSON.stringify(value, null, 2)}
                  </pre>
                ) : (
                  String(value)
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function ResourceDetailPage({ title, resourcePath, baseRoute }) {
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

  return (
    <div className="container py-4">
      <div className="mb-3">
        <Link className="btn btn-outline-secondary font-quicksand" to={baseRoute}>
          ← Indietro
        </Link>
      </div>

      <h2 className="mb-1 text-center">{heading}</h2>

      {isLoading ? <Loading label="Loading details…" /> : null}
      {error ? <ErrorState title="Could not load item" error={error} /> : null}

      {!isLoading && !error && item ? (
        <div className="card">
          <div className="card-body">
            <ObjectTable data={item} />
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
