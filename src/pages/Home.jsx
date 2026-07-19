import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const ACENTOS = ['bg-brand', 'bg-accent', 'bg-brand-dark', 'bg-accent-dark']

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
    <main className="max-w-7xl mx-auto px-4 py-10">
      <section className="mb-12 bg-brand/5 border border-brand/10 rounded-2xl px-8 py-12">
        <h1 className="font-display text-4xl font-semibold text-ink mb-3">
          Bienvenido a Mi Tienda
        </h1>
        <p className="text-ink-soft text-lg">Encuentra todo lo que buscas, en un solo lugar.</p>
      </section>

      <section>
        <h2 className="font-display text-xl font-semibold text-ink mb-5">Categorías</h2>

        {cargando && <p className="text-ink-soft">Cargando categorías...</p>}

        {!cargando && categorias.length === 0 && (
          <p className="text-ink-soft">Todavía no hay categorías cargadas.</p>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {categorias.map((cat, i) => (
            <Link
              key={cat.id}
              to={`/categoria/${cat.id}`}
              className="group bg-surface border border-line rounded-xl overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
            >
              <div className={`h-1.5 ${ACENTOS[i % ACENTOS.length]}`} />
              <div className="p-4 text-center">
                <p className="text-sm font-medium text-ink group-hover:text-brand transition-colors">{cat.nombre}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  )
}

export default Home