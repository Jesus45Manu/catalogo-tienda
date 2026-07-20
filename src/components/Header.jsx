import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ShoppingCart, UserCircle, Search, LogOut, Settings } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

function Header() {
  const { totalItems } = useCart()
  const { esAdmin, cerrarSesion } = useAuth()
  const navigate = useNavigate()
  const [busqueda, setBusqueda] = useState('')

  async function handleSalir() {
    await cerrarSesion()
    navigate('/login')
  }

  function handleBuscar(e) {
    e.preventDefault()
    if (!busqueda.trim()) return
    navigate(`/buscar?q=${encodeURIComponent(busqueda.trim())}`)
  }

  return (
    <header className="bg-surface border-b border-line sticky top-0 z-50">
      <div className="h-1 bg-brand" />
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-3 sm:gap-4">
        <Link to="/" className="font-display text-xl sm:text-2xl font-semibold text-brand whitespace-nowrap tracking-tight">
          Mi Tienda
        </Link>

        <form onSubmit={handleBuscar} className="hidden sm:flex flex-1 items-center bg-bg border border-line rounded-full px-4 py-2 mx-2 focus-within:ring-2 focus-within:ring-accent transition">
          <Search size={18} className="text-ink-soft" />
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar productos..."
            className="bg-transparent outline-none px-2 flex-1 text-sm placeholder:text-ink-soft"
          />
        </form>

        <div className="flex items-center gap-3 sm:gap-5">
          <Link to="/buscar" className="sm:hidden flex flex-col items-center text-ink-soft hover:text-brand transition-colors">
            <Search size={22} />
          </Link>
          {esAdmin && (
            <Link to="/admin/productos" className="flex flex-col items-center text-ink-soft hover:text-brand transition-colors hover:-translate-y-0.5 duration-150">
              <Settings size={22} />
              <span className="text-xs hidden sm:block mt-0.5">Panel admin</span>
            </Link>
          )}
          <Link to="/cuenta" className="flex flex-col items-center text-ink-soft hover:text-brand transition-colors hover:-translate-y-0.5 duration-150">
            <UserCircle size={22} />
            <span className="text-xs hidden sm:block mt-0.5">Cuenta</span>
          </Link>
          <button onClick={handleSalir} className="flex flex-col items-center text-ink-soft hover:text-brand transition-colors hover:-translate-y-0.5 duration-150">
            <LogOut size={22} />
            <span className="text-xs hidden sm:block mt-0.5">Salir</span>
          </button>
          <Link to="/carrito" className="relative flex flex-col items-center text-ink-soft hover:text-brand transition-colors hover:-translate-y-0.5 duration-150">
            <ShoppingCart size={22} />
            {totalItems > 0 && (
              <span className="absolute -top-1.5 -right-2.5 bg-accent text-white text-xs font-semibold rounded-full w-5 h-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
            <span className="text-xs hidden sm:block mt-0.5">Carrito</span>
          </Link>
        </div>
      </div>
    </header>
  )
}

export default Header