import { Link } from 'react-router-dom'

function HomeCard({ title, description, to }) {
  return (
    <div className="col">
      <div className="card h-100">
        <div className="card-body">
          <h5 className="card-title">{title}</h5>
          <p className="card-text text-muted">{description}</p>
          <Link className="btn btn-outline-primary" to={to}>
            Vedi {title}
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
        <div className='yarn-ball'></div>
        <div className="welcome col-12 col-lg-8">
          <h1 className="display-6 mb-5">
            Benvenute e benvenuti nella casa virtuale della mia grande passione!
          </h1>
          <p className="lead mb-2">
            Ciao! Mi chiamo Rolinda e adoro sferruzzare. Lo faccio dovunque, a qualunque ora e in presenza di chiunque ed è un istinto inarrestabile.
            <br/>
            Ho deciso di raccogliere in un blog / sito vetrina i miei progetti ma anche i miei progressi, le mie ispirazioni, le idee e le osservazioni che vengono fuori dalla mia esperienza. 
          </p>
          <p className="text-muted mb-0">
            Use the sections below to browse what I’ve made and what I use.
          </p>
        </div>
      </div>

      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-2 g-3">
        <HomeCard
          title="Progetti"
          description="Qui ci sono molti miei progetti completati e lavori in corso, piano piano li caricherò tutti! Purtroppo soprattutto per i più vecchi non ho foto carine né informazioni complete, ma ora che ho cominciato questo progetto cercherò di essere molto più metodica nel documentare le mie imprese uncinate!"
          to="/projects"
        />
        <HomeCard
          title="Filati"
          description="Il cuore di tutto! Un tuffo fra i gomitoli che ho usato per i miei progetti. Io sono una fan dei filati sottili e in particolare del cotone, ma amo sperimentare con qualsiasi cosa di morbido e soprattutto di colorato."
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
