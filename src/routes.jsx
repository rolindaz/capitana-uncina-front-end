import { createBrowserRouter } from 'react-router-dom'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import NotFoundPage from './pages/NotFoundPage'
import ProjectDetailPage from './pages/ProjectDetailPage'
import ResourceDetailPage from './pages/ResourceDetailPage'
import ResourceListPage from './pages/ResourceListPage'

const resources = {
  projects: { title: 'Progetti', apiPath: '/api/projects', uiPath: '/projects' },
  yarns: { title: 'Filati', apiPath: '/api/yarns', uiPath: '/yarns' },
  crafts: { title: 'Tecniche', apiPath: '/api/crafts', uiPath: '/crafts' },
  categories: { title: 'Fibre', apiPath: '/api/categories', uiPath: '/categories' },
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    errorElement: <NotFoundPage />,
    children: [
      { index: true, element: <HomePage /> },

      { path: 'login', element: <LoginPage /> },

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
        path: 'projects/:id',
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
        path: 'yarns/:id',
        element: (
          <ResourceDetailPage
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
