import { Link, useNavigate } from 'react-router-dom'
import { Trash2 } from 'lucide-react'
import { useCart } from '../context/CartContext'

function Cart() {
  const { items, quitarDelCarrito, actualizarCantidad, totalPrecio } = useCart()
  const navigate = useNavigate()

  if (items.length === 0) {
    return (
      <main className="max-w-3xl mx-auto px-4 py-12 text-center">
        <p className="text-ink-soft text-lg">Tu carrito está vacío.</p>
        <Link to="/" className="inline-block mt-4 text-brand hover:underline font-medium">
          Ver productos
        </Link>
      </main>
    )
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="font-display text-2xl font-semibold text-ink mb-6">Tu carrito</h1>

      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-4 bg-surface border border-line rounded-xl p-4">
            <div className="w-16 h-16 bg-bg rounded-lg overflow-hidden flex items-center justify-center flex-shrink-0">
              {item.imagen_url ? (
                <img src={item.imagen_url} alt={item.nombre} className="w-full h-full object-contain" />
              ) : (
                <span className="text-ink-soft/50 text-xs">Sin foto</span>
              )}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-ink">{item.nombre}</p>
              <p className="font-display text-accent-dark font-semibold">${item.precio.toFixed(2)}</p>
            </div>
            <input
              type="number"
              min="1"
              max={item.stock}
              value={item.cantidad}
              onChange={(e) => actualizarCantidad(item.id, Number(e.target.value))}
              className="w-16 border border-line rounded-lg px-2 py-1 text-center focus:outline-none focus:ring-2 focus:ring-accent"
            />
            <button onClick={() => quitarDelCarrito(item.id)} className="text-ink-soft hover:text-red-600 transition-colors">
              <Trash2 size={20} />
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-surface border border-line rounded-xl p-4 flex items-center justify-between">
        <span className="text-lg font-semibold text-ink">Total</span>
        <span className="font-display text-2xl font-semibold text-accent-dark">${totalPrecio.toFixed(2)}</span>
      </div>

      <button
        onClick={() => navigate('/checkout')}
        className="mt-4 w-full bg-brand text-white py-3 rounded-full font-medium hover:bg-brand-dark hover:scale-[1.01] active:scale-[0.98] transition-all duration-150 shadow-sm hover:shadow-md"
      >
        Proceder al pago
      </button>
    </main>
  )
}

export default Cart