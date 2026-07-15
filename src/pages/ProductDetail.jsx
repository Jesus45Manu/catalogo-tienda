import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useCart } from '../context/CartContext'

function ProductDetail() {
  const { id } = useParams()
  const { agregarAlCarrito } = useCart()
  const [producto, setProducto] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [cantidad, setCantidad] = useState(1)
  const [agregado, setAgregado] = useState(false)

  useEffect(() => {
    async function cargarProducto() {
      setCargando(true)
      const { data, error } = await supabase
        .from('productos')
        .select('*, categorias(nombre)')
        .eq('id', id)
        .single()

      if (error) {
        console.error('Error cargando producto:', error)
      } else {
        setProducto(data)
      }
      setCargando(false)
    }

    cargarProducto()
  }, [id])

  function handleAgregar() {
    agregarAlCarrito(producto, cantidad)
    setAgregado(true)
    setTimeout(() => setAgregado(false), 2000)
  }

  if (cargando) {
    return <main className="max-w-7xl mx-auto px-4 py-8"><p className="text-gray-400">Cargando producto...</p></main>
  }

  if (!producto) {
    return (
      <main className="max-w-7xl mx-auto px-4 py-8">
        <p className="text-gray-400">Producto no encontrado.</p>
        <Link to="/" className="text-blue-600 hover:underline text-sm">← Volver al inicio</Link>
      </main>
    )
  }

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      <Link to={`/categoria/${producto.categoria_id}`} className="text-sm text-blue-600 hover:underline">
        ← Volver a {producto.categorias?.nombre || 'la categoría'}
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
        <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
          {producto.imagen_url ? (
            <img src={producto.imagen_url} alt={producto.nombre} className="w-full h-full object-cover rounded-lg" />
          ) : (
            <span className="text-gray-300">Sin foto</span>
          )}
        </div>

        <div>
          <h1 className="text-2xl font-bold text-gray-800">{producto.nombre}</h1>
          <p className="text-3xl font-bold text-gray-900 mt-3">${producto.precio.toFixed(2)}</p>
          <p className="text-gray-600 mt-4">{producto.descripcion}</p>
          <p className="text-sm text-gray-500 mt-2">
            {producto.stock > 0 ? `${producto.stock} disponibles` : 'Sin stock por el momento'}
          </p>

          <div className="flex items-center gap-3 mt-6">
            <label className="text-sm text-gray-600">Cantidad:</label>
            <input
              type="number"
              min="1"
              max={producto.stock}
              value={cantidad}
              onChange={(e) => setCantidad(Number(e.target.value))}
              className="w-20 border border-gray-300 rounded px-2 py-1 text-center"
            />
          </div>

          <button
            onClick={handleAgregar}
            disabled={producto.stock === 0}
            className="mt-6 w-full md:w-auto bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {agregado ? '✓ Agregado al carrito' : 'Agregar al carrito'}
          </button>
        </div>
      </div>
    </main>
  )
}

export default ProductDetail