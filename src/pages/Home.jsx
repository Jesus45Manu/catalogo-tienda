import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { Link } from 'react-router-dom'

function Home() {
  const [categorias, setCategorias] = useState([])
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    async function cargarCategorias() {
      const { data, error } = await supabase
        .from('categorias')
        .select('*')
        .order('nombre')

      if (error) {
        console.error('Error cargando categorías:', error)
      } else {
        setCategorias(data)
      }
      setCargando(false)
    }

    cargarCategorias()
  }, [])

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      <section className="mb-10">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Bienvenido a Mi Tienda
        </h1>
        <p className="text-gray-500">Encuentra todo lo que buscas, en un solo lugar.</p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Categorías</h2>

        {cargando && <p className="text-gray-400">Cargando categorías...</p>}

        {!cargando && categorias.length === 0 && (
          <p className="text-gray-400">Todavía no hay categorías cargadas.</p>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {categorias.map((cat) => (
            <Link
            key={cat.id}
            to={`/categoria/${cat.id}`}
            className="bg-white rounded-lg shadow-sm p-4 text-center hover:shadow-md transition">
            <p className="text-sm font-medium text-gray-700">{cat.nombre}</p>
            </Link>
        ))}
        </div>
      </section>
    </main>
  )
}

export default Home