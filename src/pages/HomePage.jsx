import { Link } from 'react-router-dom'

function HomeCard({ title, description, to }) {
  return (
    <div className="col">
      <div className="card h-100">
        <div className="card-body">
          <h5 className="card-title">{title}</h5>
          <p className="card-text text-muted">{description}</p>
          <Link className="btn btn-outline-primary" to={to}>
            Browse {title}
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function HomePage() {
  return (
    <div className="container py-5">
      <div className="row align-items-center g-4 mb-5">
        <div className="col-12 col-lg-8">
          <h1 className="display-6 mb-3">Textile Projects Showcase</h1>
          <p className="lead mb-2">
            Hi! I’m <strong>Capitana Uncina</strong> — welcome to my small corner
            of yarn, crafts, and handmade projects.
          </p>
          <p className="text-muted mb-0">
            Use the sections below to browse what I’ve made and what I use.
          </p>
        </div>
        <div className="col-12 col-lg-4">
          <div className="p-4 bg-light border rounded">
            <div className="fw-semibold mb-1">Quick start</div>
            <div className="small text-muted">
              This UI reads data from your API (configured via <code>.env</code>).
            </div>
          </div>
        </div>
      </div>

      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-3">
        <HomeCard
          title="Projects"
          description="All finished pieces and works-in-progress."
          to="/projects"
        />
        <HomeCard
          title="Yarns"
          description="Yarns I’ve used (fiber, color, brand, etc.)."
          to="/yarns"
        />
        <HomeCard
          title="Crafts"
          description="Craft types and techniques I enjoy."
          to="/crafts"
        />
        <HomeCard
          title="Categories"
          description="Tags to keep everything organized."
          to="/categories"
        />
      </div>
    </div>
  )
}
