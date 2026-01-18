import { createBrowserRouter } from 'react-router-dom'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import NotFoundPage from './pages/NotFoundPage'
import ResourceDetailPage from './pages/ResourceDetailPage'
import ResourceListPage from './pages/ResourceListPage'

const resources = {
  projects: { title: 'Projects', path: '/api/projects' },
  yarns: { title: 'Yarns', path: '/api/yarns' },
  crafts: { title: 'Crafts', path: '/api/crafts' },
  categories: { title: 'Categories', path: '/api/categories' },
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    errorElement: <NotFoundPage />,
    children: [
      { index: true, element: <HomePage /> },

      {
        path: 'projects',
        element: (
          <ResourceListPage
            title={resources.projects.title}
            resourcePath={resources.projects.path}
            baseRoute={resources.projects.path}
          />
        ),
      },
      {
        path: 'projects/:id',
        element: (
          <ResourceDetailPage
            title={resources.projects.title}
            resourcePath={resources.projects.path}
            baseRoute={resources.projects.path}
          />
        ),
      },

      {
        path: 'yarns',
        element: (
          <ResourceListPage
            title={resources.yarns.title}
            resourcePath={resources.yarns.path}
            baseRoute={resources.yarns.path}
          />
        ),
      },
      {
        path: 'yarns/:id',
        element: (
          <ResourceDetailPage
            title={resources.yarns.title}
            resourcePath={resources.yarns.path}
            baseRoute={resources.yarns.path}
          />
        ),
      },

      {
        path: 'crafts',
        element: (
          <ResourceListPage
            title={resources.crafts.title}
            resourcePath={resources.crafts.path}
            baseRoute={resources.crafts.path}
          />
        ),
      },
      {
        path: 'crafts/:id',
        element: (
          <ResourceDetailPage
            title={resources.crafts.title}
            resourcePath={resources.crafts.path}
            baseRoute={resources.crafts.path}
          />
        ),
      },

      {
        path: 'categories',
        element: (
          <ResourceListPage
            title={resources.categories.title}
            resourcePath={resources.categories.path}
            baseRoute={resources.categories.path}
          />
        ),
      },
      {
        path: 'categories/:id',
        element: (
          <ResourceDetailPage
            title={resources.categories.title}
            resourcePath={resources.categories.path}
            baseRoute={resources.categories.path}
          />
        ),
      },

      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
