import { Link } from 'react-router-dom'

function HomeCard({ title, description, to, variant }) {
  return (
    <div className="col-12 col-md-6">
      <div className={`card home-card home-card--${variant} h-100 border-0`}>
        <div className="card-body p-4 p-lg-5">
          <h3 className="home-card__title mb-3">{title}</h3>
          <p className="home-card__text mb-4">{description}</p>
          <Link className="btn btn-outline-dark" to={to}>
            Vedi {title}
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function HomePage() {
  return (
    <div>
      <div className="jumbotron">
        <div className="container py-5">
          <div className="row align-items-center g-4 mb-5">
            <div className="col-12 col-md-4 col-lg-4 d-flex justify-content-center justify-content-md-start">
              <div className="yarn-ball" />
            </div>
            <div className="col-12 col-md-8 col-lg-8">
              <h1 className="font-quicksand fw-semibold display-6 mb-5">
                Benvenute e benvenuti nella casa
                <br />
                virtuale della mia grande passione!
              </h1>
              <p className="font-quicksand fw-medium lead mb-3">
                Ciao! Mi chiamo Rolinda e adoro sferruzzare. Lo faccio dovunque, a qualunque ora e in presenza di chiunque ed è un istinto inarrestabile.
              </p>
              <p className="font-quicksand fw-medium lead">
                Ho deciso di raccogliere in un blog / sito vetrina i miei progetti ma anche i miei progressi, le mie ispirazioni, le idee e le osservazioni che vengono fuori dalla mia esperienza.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container-fluid px-0">
        <div className="row g-0">
          <HomeCard
            title="PROGETTI"
            description="Qui ci sono molti miei progetti completati e lavori in corso, piano piano li caricherò tutti! Purtroppo soprattutto per i più vecchi non ho foto carine né informazioni complete, ma ora che ho cominciato questo progetto cercherò di essere molto più metodica nel documentare le mie imprese uncinate!"
            to="/projects"
            variant="projects"
          />
          <HomeCard
            title="FILATI"
            description="Il cuore di tutto! Un tuffo fra i gomitoli che ho usato per i miei progetti. Io sono una fan dei filati sottili e in particolare del cotone, ma amo sperimentare con qualsiasi cosa di morbido e soprattutto di colorato."
            to="/yarns"
            variant="yarns"
          />
          <HomeCard
            title="TECNICHE"
            description="Creare con le fibre tessili è un universo di tecniche e competenze diverse che si completano e arricchiscono a vicenda. La parola d'ordine è SPERIMENTARE: tante volte monto qualcosa che non vedrà mai la luce, solo per vedere cosa succede, e poi lo disfo. Finora mi sono data all'uncinetto, ai ferri e al macramè. Sicuramente il prossimo è l'uncinetto tunisino, e poi chissà!"
            to="/crafts"
            variant="crafts"
          />
          <HomeCard
            title="FIBRE"
            description="Le protagoniste di questa passione sono le fibre tessili. Ce ne sono di tutti i tipi, vegetali, animali, artificiali e ognuna ha caratteristiche diverse e dona un carattere specifico alle creazioni per cui si usa. Il mio sogno è allevare i miei alpaca e produrre la mia lana con le tinte che voglio, sarebbe meraviglioso!"
            to="/categories"
            variant="categories"
          />
        </div>
      </div>
    </div>
  )
}
