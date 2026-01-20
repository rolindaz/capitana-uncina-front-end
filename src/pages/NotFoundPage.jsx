import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="container font-quicksand py-5">
      <div className="alert alert-warning" role="alert">
        <div className="fw-semibold">
          Pagina non trovata
        </div>
        <div className="small mt-1">
          La pagina che stai cercando non esiste!
        </div>
      </div>
      <Link className="fw-semibold btn btn-outline-dark" to="/">
        Vai alla home
      </Link>
    </div>
  )
}
