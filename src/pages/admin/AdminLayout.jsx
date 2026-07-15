import { Link, Outlet, useNavigate } from 'react-router-dom'
import { Package, Tag, ClipboardList, LogOut } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

function AdminLayout() {
  const { cerrarSesion } = useAuth()
  const navigate = useNavigate()

  async function handleSalir() {
    await cerrarSesion()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <aside className="w-56 bg-white border-r border-gray-200 flex flex-col">
        <div className="px-4 py-4 border-b border-gray-200">
          <p className="font-bold text-gray-800">Panel de administración</p>
        </div>
        <nav className="flex-1 px-2 py-4 space-y-1">
          <Link to="/admin/productos" className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100 text-sm">
            <Package size={18} /> Productos
          </Link>
          <Link to="/admin/categorias" className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100 text-sm">
            <Tag size={18} /> Categorías
          </Link>
          <Link to="/admin/pedidos" className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100 text-sm">
            <ClipboardList size={18} /> Pedidos
          </Link>
        </nav>
        <div className="px-2 py-4 border-t border-gray-200">
          <button onClick={handleSalir} className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-500 hover:bg-gray-100 text-sm w-full">
            <LogOut size={18} /> Salir
          </button>
        </div>
      </aside>
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  )
}

export default AdminLayout