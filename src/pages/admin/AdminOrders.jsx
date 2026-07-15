import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

const ESTADOS = ['pendiente', 'pagado', 'enviado', 'entregado']

const ESTADO_COLOR = {
  pendiente: 'bg-yellow-100 text-yellow-700',
  pagado: 'bg-blue-100 text-blue-700',
  enviado: 'bg-purple-100 text-purple-700',
  entregado: 'bg-green-100 text-green-700',
}

function AdminOrders() {
  const [pedidos, setPedidos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [expandido, setExpandido] = useState(null)
  const [detalles, setDetalles] = useState({})

  async function cargarPedidos() {
    setCargando(true)

    const { data: pedidosData, error } = await supabase
      .from('pedidos')
      .select('*')
      .order('creado_en', { ascending: false })

    if (error || !pedidosData) {
      setCargando(false)
      return
    }

    const idsUsuarios = [...new Set(pedidosData.map((p) => p.usuario_id))]
    const { data: perfiles } = await supabase
      .from('profiles')
      .select('id, email')
      .in('id', idsUsuarios)

    const mapaEmails = Object.fromEntries((perfiles || []).map((p) => [p.id, p.email]))

    setPedidos(
      pedidosData.map((p) => ({ ...p, email_cliente: mapaEmails[p.usuario_id] || 'Cliente' }))
    )
    setCargando(false)
  }

  useEffect(() => {
    cargarPedidos()
  }, [])

  async function handleCambiarEstado(id, nuevoEstado) {
    const { error } = await supabase.from('pedidos').update({ estado: nuevoEstado }).eq('id', id)
    if (error) {
      alert('No se pudo actualizar: ' + error.message)
    } else {
      cargarPedidos()
    }
  }

  async function toggleExpandir(id) {
    if (expandido === id) {
      setExpandido(null)
      return
    }
    setExpandido(id)

    if (!detalles[id]) {
      const { data } = await supabase
        .from('detalle_pedido')
        .select('*, productos(nombre)')
        .eq('pedido_id', id)

      setDetalles((prev) => ({ ...prev, [id]: data || [] }))
    }
  }

  return (
    <main className="p-6">
      <h1 className="text-xl font-bold text-gray-800 mb-6">Pedidos ({pedidos.length})</h1>

      {cargando && <p className="text-gray-400">Cargando...</p>}

      {!cargando && (
        <div className="space-y-3">
          {pedidos.map((pedido) => (
            <div key={pedido.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
              <button
                onClick={() => toggleExpandir(pedido.id)}
                className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50"
              >
                <div>
                  <p className="text-sm font-medium text-gray-800">{pedido.email_cliente}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(pedido.creado_en).toLocaleString('es-MX')}
                  </p>
                  <div className="flex gap-2 mt-1">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
                      {pedido.metodo_entrega === 'domicilio' ? 'Envío a domicilio' : 'Recoge en sucursal'}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
                      {pedido.metodo_pago === 'plataforma' ? 'Pago en línea' : 'Paga en sucursal'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-gray-800">${pedido.total.toFixed(2)}</span>
                  <select
                    value={pedido.estado}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => handleCambiarEstado(pedido.id, e.target.value)}
                    className={`text-xs px-2 py-1 rounded-full border-none ${ESTADO_COLOR[pedido.estado]}`}
                  >
                    {ESTADOS.map((estado) => (
                      <option key={estado} value={estado}>{estado}</option>
                    ))}
                  </select>
                </div>
              </button>

              {expandido === pedido.id && (
                <div className="px-4 py-3 border-t border-gray-100 bg-gray-50 text-sm">
                  <p className="text-gray-500 mb-2 whitespace-pre-line">
                    <span className="font-medium text-gray-700">Datos:</span> {pedido.direccion_envio}
                  </p>
                  {detalles[pedido.id]?.map((d) => (
                    <div key={d.id} className="flex justify-between text-gray-600 py-0.5">
                      <span>{d.cantidad}x {d.productos?.nombre}</span>
                      <span>${(d.precio_unitario * d.cantidad).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}

          {pedidos.length === 0 && (
            <p className="text-gray-400 text-center py-8">Aún no hay pedidos.</p>
          )}
        </div>
      )}
    </main>
  )
}

export default AdminOrders