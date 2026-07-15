import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'

const COSTO_ENVIO = 50

function Checkout() {
  const { items, totalPrecio, vaciarCarrito } = useCart()
  const { usuario } = useAuth()
  const navigate = useNavigate()

  const [metodoEntrega, setMetodoEntrega] = useState('recoger')
  const [metodoPago, setMetodoPago] = useState('sucursal')
  const [nombre, setNombre] = useState('')
  const [apellidos, setApellidos] = useState('')
  const [telefono, setTelefono] = useState('')
  const [calle, setCalle] = useState('')
  const [colonia, setColonia] = useState('')
  const [ciudad, setCiudad] = useState('Gómez Palacio')
  const [codigoPostal, setCodigoPostal] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [error, setError] = useState('')

  const costoEnvio = metodoEntrega === 'domicilio' ? COSTO_ENVIO : 0
  const totalFinal = totalPrecio + costoEnvio

  function handleCambiarEntrega(valor) {
    setMetodoEntrega(valor)
    if (valor === 'domicilio') setMetodoPago('transferencia')
  }

  async function handleConfirmar(e) {
    e.preventDefault()
    setError('')
    setEnviando(true)

    const direccionTexto =
      metodoEntrega === 'domicilio'
        ? `Envío a domicilio\nNombre: ${nombre} ${apellidos}\nTeléfono: ${telefono}\nCalle: ${calle}\nColonia: ${colonia}\nCiudad: ${ciudad}, Durango\nC.P.: ${codigoPostal}`
        : `Recoge en sucursal\nNombre: ${nombre} ${apellidos}\nTeléfono: ${telefono}`

    const { data: pedido, error: errorPedido } = await supabase
      .from('pedidos')
      .insert({
        usuario_id: usuario.id,
        estado: 'pendiente',
        total: totalFinal,
        direccion_envio: direccionTexto,
        metodo_entrega: metodoEntrega,
        metodo_pago: metodoPago,
        costo_envio: costoEnvio,
      })
      .select()
      .single()

    if (errorPedido) {
      setError('No se pudo crear el pedido. Intenta de nuevo.')
      setEnviando(false)
      return
    }

    const detalles = items.map((item) => ({
      pedido_id: pedido.id,
      producto_id: item.id,
      cantidad: item.cantidad,
      precio_unitario: item.precio,
    }))

    const { error: errorDetalle } = await supabase.from('detalle_pedido').insert(detalles)

    if (errorDetalle) {
      setError('El pedido se creó pero hubo un problema guardando los productos.')
      setEnviando(false)
      return
    }

    vaciarCarrito()
    navigate(`/pedido-confirmado/${pedido.id}`)
  }

  if (items.length === 0) {
    return (
      <main className="max-w-3xl mx-auto px-4 py-12 text-center">
        <p className="text-gray-500 text-lg">Tu carrito está vacío.</p>
      </main>
    )
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Finalizar compra</h1>

      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <h2 className="text-sm font-semibold text-gray-700 mb-3">Resumen del pedido</h2>
        {items.map((item) => (
          <div key={item.id} className="flex justify-between text-sm text-gray-600 py-1">
            <span>{item.cantidad}x {item.nombre}</span>
            <span>${(item.precio * item.cantidad).toFixed(2)}</span>
          </div>
        ))}
        {costoEnvio > 0 && (
          <div className="flex justify-between text-sm text-gray-600 py-1">
            <span>Envío a domicilio</span>
            <span>${costoEnvio.toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between font-bold text-gray-900 border-t border-gray-100 mt-3 pt-3">
          <span>Total</span>
          <span>${totalFinal.toFixed(2)}</span>
        </div>
      </div>

      <form onSubmit={handleConfirmar} className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <h2 className="text-sm font-semibold text-gray-700 mb-3">¿Cómo quieres recibir tu pedido?</h2>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleCambiarEntrega('recoger')}
              className={`border rounded-lg px-4 py-3 text-sm text-left ${metodoEntrega === 'recoger' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-600'}`}
            >
              <span className="font-medium block">Recoger en sucursal</span>
              <span className="text-xs text-gray-400">Sin costo extra</span>
            </button>
            <button
              type="button"
              onClick={() => handleCambiarEntrega('domicilio')}
              className={`border rounded-lg px-4 py-3 text-sm text-left ${metodoEntrega === 'domicilio' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-600'}`}
            >
              <span className="font-medium block">Envío a domicilio</span>
              <span className="text-xs text-gray-400">+${COSTO_ENVIO}.00 · Solo Gómez Palacio y Lerdo</span>
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4 space-y-4">
          <h2 className="text-sm font-semibold text-gray-700">Datos de contacto</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-600">Nombre</label>
              <input required value={nombre} onChange={(e) => setNombre(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 mt-1 text-sm" />
            </div>
            <div>
              <label className="text-sm text-gray-600">Apellidos</label>
              <input required value={apellidos} onChange={(e) => setApellidos(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 mt-1 text-sm" />
            </div>
          </div>
          <div>
            <label className="text-sm text-gray-600">Teléfono</label>
            <input required type="tel" value={telefono} onChange={(e) => setTelefono(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 mt-1 text-sm" />
          </div>

          {metodoEntrega === 'domicilio' && (
            <>
              <div>
                <label className="text-sm text-gray-600">Calle y número</label>
                <input required value={calle} onChange={(e) => setCalle(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 mt-1 text-sm" />
              </div>
              <div>
                <label className="text-sm text-gray-600">Colonia / Referencias</label>
                <input required value={colonia} onChange={(e) => setColonia(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 mt-1 text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600">Ciudad</label>
                  <select value={ciudad} onChange={(e) => setCiudad(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 mt-1 text-sm">
                    <option value="Gómez Palacio">Gómez Palacio</option>
                    <option value="Lerdo">Lerdo</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Código postal</label>
                  <input required value={codigoPostal} onChange={(e) => setCodigoPostal(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 mt-1 text-sm" />
                </div>
              </div>
            </>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4">
          <h2 className="text-sm font-semibold text-gray-700 mb-3">¿Cómo quieres pagar?</h2>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              disabled={metodoEntrega === 'domicilio'}
              onClick={() => setMetodoPago('sucursal')}
              className={`border rounded-lg px-4 py-3 text-sm text-left ${metodoPago === 'sucursal' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-600'} ${metodoEntrega === 'domicilio' ? 'opacity-40 cursor-not-allowed' : ''}`}
            >
              <span className="font-medium block">Pagar en sucursal</span>
              <span className="text-xs text-gray-400">
                {metodoEntrega === 'domicilio' ? 'No disponible con envío a domicilio' : 'Efectivo, al recoger tu pedido'}
              </span>
            </button>
            <button
              type="button"
              onClick={() => setMetodoPago('transferencia')}
              className={`border rounded-lg px-4 py-3 text-sm text-left ${metodoPago === 'transferencia' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-600'}`}
            >
              <span className="font-medium block">Transferencia bancaria</span>
              <span className="text-xs text-gray-400">Te damos los datos al confirmar</span>
            </button>
          </div>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={enviando}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition disabled:bg-gray-300"
        >
          {enviando ? 'Procesando...' : 'Confirmar pedido'}
        </button>
      </form>
    </main>
  )
}

export default Checkout