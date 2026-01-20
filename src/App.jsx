// Importo RouterProvider -> preferisco questo approccio alla struttura a scatola di browserRouter ecc perché è più compatto e gestibile; tutto è controllato in un unico posto e in caso di variazioni va modificato solo lì (ad esempio in caso di modifiche API o risorse, per me abbastanza probabili)
// RouterProvider monta il router (oggetto che ho da createBrowserRouter()) che ho creato dentro React e fornisce tutto il contesto di routing

import { RouterProvider } from 'react-router-dom'

// Importo il mio router
import { router } from './routes'

// Lo monto per poterlo utilizzare
export default function App() {
  return <RouterProvider router={router} />
}
