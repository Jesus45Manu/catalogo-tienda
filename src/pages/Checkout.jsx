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
        <p className="text-ink-soft text-lg">Tu carrito está vacío.</p>
      </main>
    )
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="font-display text-2xl font-semibold text-ink mb-6">Finalizar compra</h1>

      <div className="bg-surface border border-line rounded-xl p-4 mb-6">
        <h2 className="text-sm font-semibold text-ink-soft mb-3">Resumen del pedido</h2>
        {items.map((item) => (
          <div key={item.id} className="flex justify-between text-sm text-ink py-1">
            <span>{item.cantidad}x {item.nombre}</span>
            <span>${(item.precio * item.cantidad).toFixed(2)}</span>
          </div>
        ))}
        {costoEnvio > 0 && (
          <div className="flex justify-between text-sm text-ink py-1">
            <span>Envío a domicilio</span>
            <span>${costoEnvio.toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between font-semibold text-ink border-t border-line mt-3 pt-3">
          <span>Total</span>
          <span className="font-display text-accent-dark text-lg">${totalFinal.toFixed(2)}</span>
        </div>
      </div>

      <form onSubmit={handleConfirmar} className="space-y-6">
        <div className="bg-surface border border-line rounded-xl p-4">
          <h2 className="text-sm font-semibold text-ink-soft mb-3">¿Cómo quieres recibir tu pedido?</h2>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleCambiarEntrega('recoger')}
              className={`border-2 rounded-xl px-4 py-3 text-sm text-left transition-all ${metodoEntrega === 'recoger' ? 'border-brand bg-brand/5' : 'border-line hover:border-brand/40'}`}
            >
              <span className="font-medium block text-ink">Recoger en sucursal</span>
              <span className="text-xs text-ink-soft">Sin costo extra</span>
            </button>
            <button
              type="button"
              onClick={() => handleCambiarEntrega('domicilio')}
              className={`border-2 rounded-xl px-4 py-3 text-sm text-left transition-all ${metodoEntrega === 'domicilio' ? 'border-brand bg-brand/5' : 'border-line hover:border-brand/40'}`}
            >
              <span className="font-medium block text-ink">Envío a domicilio</span>
              <span className="text-xs text-ink-soft">+${COSTO_ENVIO}.00 · Solo Gómez Palacio y Lerdo</span>
            </button>
          </div>
        </div>

        <div className="bg-surface border border-line rounded-xl p-4 space-y-4">
          <h2 className="text-sm font-semibold text-ink-soft">Datos de contacto</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-ink-soft">Nombre</label>
              <input required value={nombre} onChange={(e) => setNombre(e.target.value)} className="w-full border border-line rounded-lg px-3 py-2 mt-1 text-sm focus:outline-none focus:ring-2 focus:ring-accent" />
            </div>
            <div>
              <label className="text-sm text-ink-soft">Apellidos</label>
              <input required value={apellidos} onChange={(e) => setApellidos(e.target.value)} className="w-full border border-line rounded-lg px-3 py-2 mt-1 text-sm focus:outline-none focus:ring-2 focus:ring-accent" />
            </div>
          </div>
          <div>
            <label className="text-sm text-ink-soft">Teléfono</label>
            <input required type="tel" value={telefono} onChange={(e) => setTelefono(e.target.value)} className="w-full border border-line rounded-lg px-3 py-2 mt-1 text-sm focus:outline-none focus:ring-2 focus:ring-accent" />
          </div>

          {metodoEntrega === 'domicilio' && (
            <>
              <div>
                <label className="text-sm text-ink-soft">Calle y número</label>
                <input required value={calle} onChange={(e) => setCalle(e.target.value)} className="w-full border border-line rounded-lg px-3 py-2 mt-1 text-sm focus:outline-none focus:ring-2 focus:ring-accent" />
              </div>
              <div>
                <label className="text-sm text-ink-soft">Colonia / Referencias</label>
                <input required value={colonia} onChange={(e) => setColonia(e.target.value)} className="w-full border border-line rounded-lg px-3 py-2 mt-1 text-sm focus:outline-none focus:ring-2 focus:ring-accent" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-ink-soft">Ciudad</label>
                  <select value={ciudad} onChange={(e) => setCiudad(e.target.value)} className="w-full border border-line rounded-lg px-3 py-2 mt-1 text-sm focus:outline-none focus:ring-2 focus:ring-accent">
                    <option value="Gómez Palacio">Gómez Palacio</option>
                    <option value="Lerdo">Lerdo</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-ink-soft">Código postal</label>
                  <input required value={codigoPostal} onChange={(e) => setCodigoPostal(e.target.value)} className="w-full border border-line rounded-lg px-3 py-2 mt-1 text-sm focus:outline-none focus:ring-2 focus:ring-accent" />
                </div>
              </div>
            </>
          )}
        </div>

        <div className="bg-surface border border-line rounded-xl p-4">
          <h2 className="text-sm font-semibold text-ink-soft mb-3">¿Cómo quieres pagar?</h2>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              disabled={metodoEntrega === 'domicilio'}
              onClick={() => setMetodoPago('sucursal')}
              className={`border-2 rounded-xl px-4 py-3 text-sm text-left transition-all ${metodoPago === 'sucursal' ? 'border-brand bg-brand/5' : 'border-line hover:border-brand/40'} ${metodoEntrega === 'domicilio' ? 'opacity-40 cursor-not-allowed hover:border-line' : ''}`}
            >
              <span className="font-medium block text-ink">Pagar en sucursal</span>
              <span className="text-xs text-ink-soft">
                {metodoEntrega === 'domicilio' ? 'No disponible con envío a domicilio' : 'Efectivo, al recoger tu pedido'}
              </span>
            </button>
            <button
              type="button"
              onClick={() => setMetodoPago('transferencia')}
              className={`border-2 rounded-xl px-4 py-3 text-sm text-left transition-all ${metodoPago === 'transferencia' ? 'border-brand bg-brand/5' : 'border-line hover:border-brand/40'}`}
            >
              <span className="font-medium block text-ink">Transferencia bancaria</span>
              <span className="text-xs text-ink-soft">Te damos los datos al confirmar</span>
            </button>
          </div>
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={enviando}
          className="w-full bg-brand text-white py-3 rounded-full font-medium hover:bg-brand-dark hover:scale-[1.01] active:scale-[0.98] transition-all duration-150 shadow-sm hover:shadow-md disabled:bg-line disabled:text-ink-soft disabled:hover:scale-100"
        >
          {enviando ? 'Procesando...' : 'Confirmar pedido'}
        </button>
      </form>
    </main>
  )
}

export default Checkout