import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, Check, X } from 'lucide-react'
import { supabase } from '../../lib/supabase'

function AdminCategories() {
  const [categorias, setCategorias] = useState([])
  const [cargando, setCargando] = useState(true)
  const [nuevoNombre, setNuevoNombre] = useState('')
  const [creando, setCreando] = useState(false)
  const [editandoId, setEditandoId] = useState(null)
  const [nombreEditado, setNombreEditado] = useState('')

  async function cargarCategorias() {
    setCargando(true)
    const { data, error } = await supabase.from('categorias').select('*').order('nombre')
    if (!error) setCategorias(data)
    setCargando(false)
  }

  useEffect(() => {
    cargarCategorias()
  }, [])

  async function handleCrear(e) {
    e.preventDefault()
    if (!nuevoNombre.trim()) return

    setCreando(true)
    const { error } = await supabase.from('categorias').insert({ nombre: nuevoNombre.trim() })

    if (error) {
      alert('No se pudo crear: ' + error.message)
    } else {
      setNuevoNombre('')
      cargarCategorias()
    }
    setCreando(false)
  }

  function iniciarEdicion(cat) {
    setEditandoId(cat.id)
    setNombreEditado(cat.nombre)
  }

  async function guardarEdicion(id) {
    if (!nombreEditado.trim()) return

    const { error } = await supabase.from('categorias').update({ nombre: nombreEditado.trim() }).eq('id', id)

    if (error) {
      alert('No se pudo guardar: ' + error.message)
    } else {
      setEditandoId(null)
      cargarCategorias()
    }
  }

  async function handleEliminar(id) {
    if (!confirm('¿Seguro que quieres eliminar esta categoría?')) return

    const { error } = await supabase.from('categorias').delete().eq('id', id)

    if (error) {
      if (error.code === '23503') {
        alert('Esta categoría tiene productos asignados, así que no se puede eliminar. Cambia esos productos a otra categoría primero (desde Productos → Editar) y vuelve a intentarlo.')
      } else {
        alert('No se pudo eliminar: ' + error.message)
      }
    } else {
      cargarCategorias()
    }
  }

  return (
    <main className="p-6 max-w-2xl">
      <h1 className="text-xl font-bold text-gray-800 mb-6">Categorías ({categorias.length})</h1>

      <form onSubmit={handleCrear} className="flex gap-2 mb-6">
        <input
          value={nuevoNombre}
          onChange={(e) => setNuevoNombre(e.target.value)}
          placeholder="Nombre de la nueva categoría"
          className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm"
        />
        <button
          type="submit"
          disabled={creando}
          className="flex items-center gap-1 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:bg-gray-300"
        >
          <Plus size={18} /> Agregar
        </button>
      </form>

      {cargando && <p className="text-gray-400">Cargando...</p>}

      {!cargando && (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {categorias.map((cat) => (
            <div key={cat.id} className="flex items-center justify-between px-4 py-3 border-t border-gray-100 first:border-t-0">
              {editandoId === cat.id ? (
                <>
                  <input
                    value={nombreEditado}
                    onChange={(e) => setNombreEditado(e.target.value)}
                    autoFocus
                    className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm mr-2"
                  />
                  <div className="flex gap-2">
                    <button onClick={() => guardarEdicion(cat.id)} className="text-green-600 hover:text-green-700">
                      <Check size={18} />
                    </button>
                    <button onClick={() => setEditandoId(null)} className="text-gray-400 hover:text-gray-600">
                      <X size={18} />
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <span className="text-gray-800 text-sm">{cat.nombre}</span>
                  <div className="flex gap-2">
                    <button onClick={() => iniciarEdicion(cat)} className="text-gray-400 hover:text-blue-600">
                      <Pencil size={16} />
                    </button>
                    <button onClick={() => handleEliminar(cat.id)} className="text-gray-400 hover:text-red-500">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}

          {categorias.length === 0 && (
            <p className="text-gray-400 text-center py-8">Aún no hay categorías. Agrega la primera.</p>
          )}
        </div>
      )}
    </main>
  )
}

export default AdminCategories