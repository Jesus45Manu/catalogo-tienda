import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { supabase } from '../../lib/supabase'

function AdminProducts() {
  const [productos, setProductos] = useState([])
  const [cargando, setCargando] = useState(true)

  async function cargarProductos() {
    setCargando(true)
    const { data, error } = await supabase
      .from('productos')
      .select('*, categorias(nombre)')
      .order('nombre')

    if (!error) setProductos(data)
    setCargando(false)
  }

  useEffect(() => {
    cargarProductos()
  }, [])

  async function handleEliminar(id) {
    if (!confirm('¿Seguro que quieres eliminar este producto?')) return

    const { error } = await supabase.from('productos').delete().eq('id', id)

    if (error) {
      if (error.code === '23503') {
        const desactivar = confirm(
          'Este producto ya tiene pedidos registrados, así que no se puede eliminar (se perdería ese historial de ventas).\n\n¿Quieres desactivarlo en su lugar? Deja de verse en la tienda, pero conserva el historial.'
        )
        if (desactivar) {
          await handleToggleActivo(id, true)
        }
      } else {
        alert('No se pudo eliminar: ' + error.message)
      }
    } else {
      cargarProductos()
    }
  }

  async function handleToggleActivo(id, activoActual) {
    const { error } = await supabase
      .from('productos')
      .update({ activo: !activoActual })
      .eq('id', id)

    if (error) {
      alert('No se pudo actualizar: ' + error.message)
    } else {
      cargarProductos()
    }
  }

  return (
    <main className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-800">Productos ({productos.length})</h1>
        <Link to="/admin/productos/nuevo" className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">
          <Plus size={18} /> Agregar producto
        </Link>
      </div>

      {cargando && <p className="text-gray-400">Cargando...</p>}

      {!cargando && (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-left">
              <tr>
                <th className="px-4 py-3">Nombre</th>
                <th className="px-4 py-3">Categoría</th>
                <th className="px-4 py-3">Precio</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {productos.map((p) => (
                <tr key={p.id} className="border-t border-gray-100">
                  <td className="px-4 py-3 text-gray-800">{p.nombre}</td>
                  <td className="px-4 py-3 text-gray-500">{p.categorias?.nombre || '—'}</td>
                  <td className="px-4 py-3 text-gray-800">${p.precio.toFixed(2)}</td>
                  <td className="px-4 py-3 text-gray-500">{p.stock}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleToggleActivo(p.id, p.activo)}
                      className={`px-2 py-0.5 rounded-full text-xs ${p.activo ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}
                      title="Clic para cambiar"
                    >
                      {p.activo ? 'Activo' : 'Inactivo'}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <Link to={`/admin/productos/${p.id}`} className="text-gray-400 hover:text-blue-600">
                        <Pencil size={18} />
                      </Link>
                      <button onClick={() => handleEliminar(p.id)} className="text-gray-400 hover:text-red-500">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {productos.length === 0 && (
            <p className="text-gray-400 text-center py-8">Aún no hay productos. Agrega el primero.</p>
          )}
        </div>
      )}
    </main>
  )
}

export default AdminProducts