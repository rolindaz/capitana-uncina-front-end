// #region Importazioni

// importo il router
import { createBrowserRouter } from 'react-router-dom'
// importo i componenti a cui devo fare riferimento
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import NotFoundPage from './pages/NotFoundPage'
import ProjectDetailPage from './pages/ProjectDetailPage'
import ResourceDetailPage from './pages/ResourceDetailPage'
import ResourceListPage from './pages/ResourceListPage'
import YarnDetailPage from './pages/YarnDetailPage'

// #endregion

// creo una variabile con nome e percorso dell'API di tutte le risorse che chiamerò per il mio progetto (PER ORA SOLO PROJECTS E YARNS FUNZIONANTI)

const resources = {
  projects: { title: 'Progetti', apiPath: '/api/projects', uiPath: '/projects' },
  yarns: { title: 'Filati', apiPath: '/api/yarns', uiPath: '/yarns' },
  crafts: { title: 'Tecniche', apiPath: '/api/crafts', uiPath: '/crafts' },
  categories: { title: 'Fibre', apiPath: '/api/categories', uiPath: '/categories' },
}

// creo il router, cioè un oggetto di configurazione con una struttura ad albero in cui imposto i percorsi, i componenti da renderizzare e la gestione degli errori

// createBrowserRouter crea un'istanza di routing che usa la cronologia API del browser per sincronizzare la URL e ciò che React renderizza - io gli passo un array di oggetti route e lui crea un oggetto che svolge tutte le operazioni di routing (estrae parametri, trova la rotta giusta ecc.)

// Funziona un po' come @yield nei layout di Laravel

export const router = createBrowserRouter([
  {
    // Suffissi URL
    path: '/',
    // Componente
    element: <Layout />,
    // Gestione errori
    errorElement: <NotFoundPage />,
    // Rotte figlie
    children: [
      { index: true, element: <HomePage /> },

      {
        path: 'projects',
        element: (
          <ResourceListPage
            title={resources.projects.title}
            resourcePath={resources.projects.apiPath}
            baseRoute={resources.projects.uiPath}
            variant="projects"
          />
        ),
      },
      {
        path: 'projects/:slug',
        element: (
          <ProjectDetailPage
            title={resources.projects.title}
            resourcePath={resources.projects.apiPath}
            baseRoute={resources.projects.uiPath}
          />
        ),
      },

      {
        path: 'yarns',
        element: (
          <ResourceListPage
            title={resources.yarns.title}
            resourcePath={resources.yarns.apiPath}
            baseRoute={resources.yarns.uiPath}
            variant="yarns"
          />
        ),
      },
      {
        path: 'yarns/:slug',
        element: (
          <YarnDetailPage
            title={resources.yarns.title}
            resourcePath={resources.yarns.apiPath}
            baseRoute={resources.yarns.uiPath}
          />
        ),
      },

      {
        path: 'crafts',
        element: (
          <ResourceListPage
            title={resources.crafts.title}
            resourcePath={resources.crafts.apiPath}
            baseRoute={resources.crafts.uiPath}
          />
        ),
      },
      {
        path: 'crafts/:id',
        element: (
          <ResourceDetailPage
            title={resources.crafts.title}
            resourcePath={resources.crafts.apiPath}
            baseRoute={resources.crafts.uiPath}
          />
        ),
      },

      {
        path: 'categories',
        element: (
          <ResourceListPage
            title={resources.categories.title}
            resourcePath={resources.categories.apiPath}
            baseRoute={resources.categories.uiPath}
          />
        ),
      },
      {
        path: 'categories/:id',
        element: (
          <ResourceDetailPage
            title={resources.categories.title}
            resourcePath={resources.categories.apiPath}
            baseRoute={resources.categories.uiPath}
          />
        ),
      },

      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
