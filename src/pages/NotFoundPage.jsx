import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="container py-5">
      <div className="alert alert-warning" role="alert">
        <div className="fw-semibold">Page not found</div>
        <div className="small mt-1">
          The page you’re looking for doesn’t exist.
        </div>
      </div>
      <Link className="btn btn-primary" to="/">
        Go home
      </Link>
    </div>
  )
}
