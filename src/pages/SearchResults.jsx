import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import { Search } from 'lucide-react'
import { supabase } from '../lib/supabase'
import ProductCard from '../components/ProductCard'

function SearchResults() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const query = searchParams.get('q') || ''
  const [texto, setTexto] = useState(query)
  const [productos, setProductos] = useState([])
  const [cargando, setCargando] = useState(false)

  useEffect(() => {
    setTexto(query)

    async function buscarProductos() {
      if (!query.trim()) {
        setProductos([])
        return
      }
      setCargando(true)
     const { data, error } = await supabase.rpc('buscar_productos', { termino: query })

      if (!error) setProductos(data)
      setCargando(false)
    }

    buscarProductos()
  }, [query])

  function handleSubmit(e) {
    e.preventDefault()
    if (!texto.trim()) return
    navigate(`/buscar?q=${encodeURIComponent(texto.trim())}`)
  }

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      <Link to="/" className="text-sm text-brand hover:underline font-medium">
        ← Volver al inicio
      </Link>

      <form onSubmit={handleSubmit} className="sm:hidden flex items-center bg-bg border border-line rounded-full px-4 py-2 mt-3 mb-4 focus-within:ring-2 focus-within:ring-accent transition">
        <Search size={18} className="text-ink-soft" />
        <input
          type="text"
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder="Buscar productos..."
          className="bg-transparent outline-none px-2 flex-1 text-sm placeholder:text-ink-soft"
          autoFocus
        />
      </form>

      {query ? (
        <h1 className="font-display text-2xl font-semibold text-ink mt-2 mb-6">
          Resultados para "{query}"
        </h1>
      ) : (
        <h1 className="font-display text-2xl font-semibold text-ink mt-2 mb-6">
          ¿Qué estás buscando?
        </h1>
      )}

      {cargando && <p className="text-ink-soft">Buscando...</p>}

      {!cargando && query && productos.length === 0 && (
        <p className="text-ink-soft">No encontramos productos que coincidan con tu búsqueda.</p>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {productos.map((prod) => (
          <ProductCard key={prod.id} producto={prod} />
        ))}
      </div>
    </main>
  )
}

export default SearchResults