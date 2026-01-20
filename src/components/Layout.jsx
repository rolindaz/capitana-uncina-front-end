// Layout è il mio componente principale, quello attribuito alla Homepage e alla rotta '/'. Tutte le rotte figlie lo adottano, inserendo le specifiche dei propri componenti al suo interno

// #region Importazione

// Importo gli strumenti del router per navigazione e routing:
/*

Link: il corrispondente in React del tag <a> - Reindirizza l'utente dal lato client, senza ricaricare la pagina

NavLink: E' un wrapper per Link che serve a passargli dei props per stilizzare gli stati (attivo o in attesa)

Outlet: Renderizza la rotta figlia se la trova (simile a @yield in Laravel)

*/
import { Link, NavLink, Outlet } from 'react-router-dom'

// #endregion

// Creo una funzione per attribuire automaticamente ai link attivi la classe 'active' e gestirne così lo stile in modo automatico

const navLinkClassName = ({ isActive }) =>
  `nav-link${isActive ? ' active' : ''}`

export default function Layout() {
  return (
    // Contenitore principale del layout - a finestra completa - diviso in: navbar - main - footer
    <div className="min-vh-100 d-flex flex-column">

      {/* Navbar */} 
      <nav className="navbar navbar-expand-lg navbar-dark site-navbar">
        <div className="container">
          <Link className="navbar-brand site-brand" to="/">
            <img
              src="/yarn(1).png"
              height="80"
              className="site-brand__img"
              alt="Mascot"
              loading="eager"
              onError={(e) => {
                e.currentTarget.style.display = 'none'
              }}
            />
            <span className="site-brand__title">
              Capitana Uncina
            </span>
          </Link>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#mainNav"
            aria-controls="mainNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>

          <div className="collapse navbar-collapse" id="mainNav">
            <ul className="navbar-nav ms-lg-auto">
              <li className="nav-item">
                <NavLink className={navLinkClassName} to="/projects">
                  Progetti
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className={navLinkClassName} to="/yarns">
                  Filati
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className={navLinkClassName} to="/crafts">
                  Tecniche
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className={navLinkClassName} to="/categories">
                  Fibre
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      
      {/* Main */} 
      <main className="flex-grow-1">
        <Outlet />
      </main>
      
      {/* Footer */} 
      <footer className="site-footer py-3">
        <div className="container">
          <div className="d-flex flex-column flex-md-row align-items-center justify-content-between gap-2">
            <div className="site-footer__left font-quicksand">
              Made with <span aria-label="love" title="love">♥</span> by Rolinda
            </div>
            <div className="site-footer__right font-quicksand">
              JavaScript <span className="mx-2">|</span> ReactJS <span className="mx-2">|</span> Vite{' '}
              <span className="mx-2">|</span> Bootstrap
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
