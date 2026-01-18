export default function Loading({ label = 'Loading…' }) {
  return (
    <div className="d-flex align-items-center gap-2">
      <div className="spinner-border" role="status" aria-label={label} />
      <span>{label}</span>
    </div>
  )
}
