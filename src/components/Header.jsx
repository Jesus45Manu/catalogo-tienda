import { Link, useNavigate } from 'react-router-dom'
import { ShoppingCart, UserCircle, Search, LogOut, Settings } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

function Header() {
  const { totalItems } = useCart()
  const { esAdmin, cerrarSesion } = useAuth()
  const navigate = useNavigate()

  async function handleSalir() {
    await cerrarSesion()
    navigate('/login')
  }

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
        <Link to="/" className="text-xl font-bold text-blue-600 whitespace-nowrap">
          Mi Tienda
        </Link>

        <div className="flex-1 flex items-center bg-gray-100 rounded-lg px-3 py-2">
          <Search size={18} className="text-gray-400" />
          <input
            type="text"
            placeholder="Buscar productos..."
            className="bg-transparent outline-none px-2 flex-1 text-sm"
          />
        </div>

        <div className="flex items-center gap-4">
          {esAdmin && (
            <Link to="/admin/productos" className="flex flex-col items-center text-gray-600 hover:text-blue-600">
              <Settings size={22} />
              <span className="text-xs hidden sm:block">Panel admin</span>
            </Link>
          )}
          <Link to="/cuenta" className="flex flex-col items-center text-gray-600 hover:text-blue-600">
            <UserCircle size={22} />
            <span className="text-xs hidden sm:block">Cuenta</span>
          </Link>
          <button onClick={handleSalir} className="flex flex-col items-center text-gray-600 hover:text-blue-600">
            <LogOut size={22} />
            <span className="text-xs hidden sm:block">Salir</span>
          </button>
          <Link to="/carrito" className="relative flex flex-col items-center text-gray-600 hover:text-blue-600">
            <ShoppingCart size={22} />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-2 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
            <span className="text-xs hidden sm:block">Carrito</span>
          </Link>
        </div>
      </div>
    </header>
  )
}

export default Header