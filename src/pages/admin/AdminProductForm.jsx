import { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

function AdminProductForm() {
  const { id } = useParams()
  const esEdicion = !!id
  const navigate = useNavigate()

  const [categorias, setCategorias] = useState([])
  const [form, setForm] = useState({
    nombre: '', descripcion: '', precio: '', stock: '', categoria_id: '', imagen_url: '', activo: true,
  })
  const [cargando, setCargando] = useState(esEdicion)
  const [guardando, setGuardando] = useState(false)
  const [subiendoImagen, setSubiendoImagen] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    async function cargarCategorias() {
      const { data } = await supabase.from('categorias').select('*').order('nombre')
      setCategorias(data || [])
    }
    cargarCategorias()
  }, [])

  useEffect(() => {
    if (!esEdicion) return
    async function cargarProducto() {
      const { data, error } = await supabase.from('productos').select('*').eq('id', id).single()
      if (!error && data) {
        setForm({
          nombre: data.nombre,
          descripcion: data.descripcion || '',
          precio: data.precio,
          stock: data.stock,
          categoria_id: data.categoria_id || '',
          imagen_url: data.imagen_url || '',
          activo: data.activo,
        })
      }
      setCargando(false)
    }
    cargarProducto()
  }, [id, esEdicion])

  function handleChange(campo, valor) {
    setForm((prev) => ({ ...prev, [campo]: valor }))
  }

  async function handleImagenChange(e) {
    const archivo = e.target.files[0]
    if (!archivo) return

    setSubiendoImagen(true)
    const extension = archivo.name.split('.').pop()
    const nombreArchivo = `${crypto.randomUUID()}.${extension}`

    const { error } = await supabase.storage.from('productos').upload(nombreArchivo, archivo)

    if (error) {
      alert('No se pudo subir la imagen: ' + error.message)
      setSubiendoImagen(false)
      return
    }

    const { data } = supabase.storage.from('productos').getPublicUrl(nombreArchivo)
    handleChange('imagen_url', data.publicUrl)
    setSubiendoImagen(false)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setGuardando(true)

    const payload = {
      nombre: form.nombre,
      descripcion: form.descripcion,
      precio: Number(form.precio),
      stock: Number(form.stock),
      categoria_id: form.categoria_id || null,
      imagen_url: form.imagen_url || null,
      activo: form.activo,
    }

    const { error } = esEdicion
      ? await supabase.from('productos').update(payload).eq('id', id)
      : await supabase.from('productos').insert(payload)

    if (error) {
      setError('No se pudo guardar: ' + error.message)
      setGuardando(false)
    } else {
      navigate('/admin/productos')
    }
  }

  if (cargando) return <main className="p-6"><p className="text-gray-400">Cargando...</p></main>

  return (
    <main className="p-6 max-w-2xl">
      <Link to="/admin/productos" className="text-sm text-blue-600 hover:underline">← Volver a productos</Link>
      <h1 className="text-xl font-bold text-gray-800 mt-2 mb-6">{esEdicion ? 'Editar producto' : 'Nuevo producto'}</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6 space-y-4">
        <div>
          <label className="text-sm text-gray-600">Nombre</label>
          <input required value={form.nombre} onChange={(e) => handleChange('nombre', e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 mt-1" />
        </div>
        <div>
          <label className="text-sm text-gray-600">Descripción</label>
          <textarea rows={3} value={form.descripcion} onChange={(e) => handleChange('descripcion', e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 mt-1" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-600">Precio</label>
            <input required type="number" step="0.01" min="0" value={form.precio} onChange={(e) => handleChange('precio', e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 mt-1" />
          </div>
          <div>
            <label className="text-sm text-gray-600">Stock</label>
            <input required type="number" min="0" value={form.stock} onChange={(e) => handleChange('stock', e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 mt-1" />
          </div>
        </div>
        <div>
          <label className="text-sm text-gray-600">Categoría</label>
          <select value={form.categoria_id} onChange={(e) => handleChange('categoria_id', e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 mt-1">
            <option value="">Sin categoría</option>
            {categorias.map((cat) => <option key={cat.id} value={cat.id}>{cat.nombre}</option>)}
          </select>
        </div>

        <div>
          <label className="text-sm text-gray-600">Foto del producto</label>
          <div className="mt-1 flex items-center gap-4">
            <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center flex-shrink-0">
              {form.imagen_url ? (
                <img src={form.imagen_url} alt="" className="w-full h-full object-cover" />
              ) : (
                <span className="text-gray-300 text-xs">Sin foto</span>
              )}
            </div>
            <div>
              <input type="file" accept="image/*" onChange={handleImagenChange} disabled={subiendoImagen} className="text-sm" />
              {subiendoImagen && <p className="text-xs text-gray-400 mt-1">Subiendo...</p>}
            </div>
          </div>
        </div>

        <label className="flex items-center gap-2 text-sm text-gray-600">
          <input type="checkbox" checked={form.activo} onChange={(e) => handleChange('activo', e.target.checked)} />
          Producto activo (visible en la tienda)
        </label>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button type="submit" disabled={guardando || subiendoImagen} className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition disabled:bg-gray-300">
          {guardando ? 'Guardando...' : esEdicion ? 'Guardar cambios' : 'Crear producto'}
        </button>
      </form>
    </main>
  )
}

export default AdminProductForm