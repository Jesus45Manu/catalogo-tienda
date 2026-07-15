import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function AdminRoute({ children }) {
  const { usuario, esAdmin, cargando } = useAuth()

  if (cargando || esAdmin === null) {
    return <main className="max-w-7xl mx-auto px-4 py-8"><p className="text-gray-400">Verificando acceso...</p></main>
  }

  if (!usuario || !esAdmin) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default AdminRoute