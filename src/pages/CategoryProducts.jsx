import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import ProductCard from '../components/ProductCard'

function CategoryProducts() {
  const { id } = useParams()
  const [productos, setProductos] = useState([])
  const [categoria, setCategoria] = useState(null)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    async function cargarDatos() {
      setCargando(true)

      const { data: cat } = await supabase
        .from('categorias')
        .select('*')
        .eq('id', id)
        .single()

      setCategoria(cat)

      const { data: prods, error } = await supabase
        .from('productos')
        .select('*')
        .eq('categoria_id', id)
        .eq('activo', true)
        .order('nombre')

      if (error) {
        console.error('Error cargando productos:', error)
      } else {
        setProductos(prods)
      }

      setCargando(false)
    }

    cargarDatos()
  }, [id])

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      <Link to="/" className="text-sm text-blue-600 hover:underline">
        ← Volver al inicio
      </Link>

      <h1 className="text-2xl font-bold text-gray-800 mt-2 mb-6">
        {categoria ? categoria.nombre : 'Categoría'}
      </h1>

      {cargando && <p className="text-gray-400">Cargando productos...</p>}

      {!cargando && productos.length === 0 && (
        <p className="text-gray-400">Todavía no hay productos en esta categoría.</p>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {productos.map((prod) => (
          <ProductCard key={prod.id} producto={prod} />
        ))}
      </div>
    </main>
  )
}

export default CategoryProducts