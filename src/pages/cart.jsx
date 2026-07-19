import { Link, useNavigate } from 'react-router-dom'
import { Trash2 } from 'lucide-react'
import { useCart } from '../context/CartContext'

function Cart() {
  const { items, quitarDelCarrito, actualizarCantidad, totalPrecio } = useCart()
  const navigate = useNavigate()

  if (items.length === 0) {
    return (
      <main className="max-w-3xl mx-auto px-4 py-12 text-center">
        <p className="text-gray-500 text-lg">Tu carrito está vacío.</p>
        <Link to="/" className="inline-block mt-4 text-blue-600 hover:underline">
          Ver productos
        </Link>
      </main>
    )
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Tu carrito</h1>

      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-4 bg-white rounded-lg shadow-sm p-4">
            <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center flex-shrink-0 overflow-hidden">
              {item.imagen_url ? (
                <img src={item.imagen_url} alt={item.nombre} className="w-full h-full object-contain rounded" />
              ) : (
                <span className="text-gray-300 text-xs">Sin foto</span>
              )}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-700">{item.nombre}</p>
              <p className="text-gray-900 font-bold">${item.precio.toFixed(2)}</p>
            </div>
            <input
              type="number"
              min="1"
              max={item.stock}
              value={item.cantidad}
              onChange={(e) => actualizarCantidad(item.id, Number(e.target.value))}
              className="w-16 border border-gray-300 rounded px-2 py-1 text-center"
            />
            <button onClick={() => quitarDelCarrito(item.id)} className="text-gray-400 hover:text-red-500">
              <Trash2 size={20} />
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-white rounded-lg shadow-sm p-4 flex items-center justify-between">
        <span className="text-lg font-semibold text-gray-800">Total</span>
        <span className="text-2xl font-bold text-gray-900">${totalPrecio.toFixed(2)}</span>
      </div>

      <button
        onClick={() => navigate('/checkout')}
        className="mt-4 w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition"
      >
        Proceder al pago
      </button>
    </main>
  )
}

export default Cart