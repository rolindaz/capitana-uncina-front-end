// Definisco un minicomponente per la renderizzazione chiara ed efficiente degli errori

export default function ErrorState({ title = 'Something went wrong', error }) {
  const message = error?.message || String(error || '')

  return (
    <div className="alert alert-danger" role="alert">
      <div className="fw-semibold">{title}</div>
      {message ? <div className="small mt-1">{message}</div> : null}
    </div>
  )
}
