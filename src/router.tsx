import { createBrowserRouter } from 'react-router-dom'

import Home from './Pages/Home/Home'
import Detail from './Pages/Detail/Detail'
import NotFound from './Pages/NotFound/NotFound'
import Layout from './components/Layout/Layout'

const router = createBrowserRouter([
    {
        element: <Layout/>,
        children: [
            {
                path:'/',
                element: <Home/>
            },
            {
                path:'/detail/:cripto',
                element: <Detail/>
            },
            {
                path:'*',
                element: <NotFound/>
            },
            
        ]
    },
    
],
            {
                future: {
                    v7_relativeSplatPath: true,
                    v7_fetcherPersist: true,
                    v7_normalizeFormMethod: true,
                    v7_partialHydration: true,
                    v7_skipActionErrorRevalidation: true
                },
            }
);

export { router }