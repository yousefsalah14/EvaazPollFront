import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './App.css'
import Layout from './components/Layout/Layout'
import Login from './pages/Login/Login'
import Home from './pages/Home/Home'
import Form from './pages/Form/Form'
import Schools from './pages/Schools/Schools'
import { CountdownProvider } from './contexts/CountdownContext'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute'
import Notfound from './components/Notfound/Notfound'

const routers = createBrowserRouter([
  {
    path: '/', 
    element: <Layout />, 
    children: [
      { index: true, element: <Home /> },
      { path: 'form', element: <Form /> },
    ]
  },
  {
    path: '/login', 
    element: <Login />
  },
  {
    path: '/schools', 
    element: (
      <ProtectedRoute>
        <Schools />
      </ProtectedRoute>
    )
  },
  { 
    path: '*', 
    element: <Notfound /> 
  },
])

function App() {
  return (
    <AuthProvider>
      <CountdownProvider>
        <RouterProvider router={routers} />
      </CountdownProvider>
    </AuthProvider>
  )
}

export default App
