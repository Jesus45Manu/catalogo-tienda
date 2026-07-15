import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { CheckCircle, Copy } from 'lucide-react'

const DATOS_BANCARIOS = {
  banco: 'Banamex',
  clabe: '002180905572689862',
  titular: 'JESUS MANUEL RUIZ ROMO',
}

function OrderConfirmation() {
  const { id } = useParams()
  const [pedido, setPedido] = useState(null)
  const [copiado, setCopiado] = useState(false)

  useEffect(() => {
    async function cargarPedido() {
      const { data } = await supabase.from('pedidos').select('*').eq('id', id).single()
      setPedido(data)
    }
    cargarPedido()
  }, [id])

  function copiarClabe() {
    navigator.clipboard.writeText(DATOS_BANCARIOS.clabe)
    setCopiado(true)
    setTimeout(() => setCopiado(false), 2000)
  }

  return (
    <main className="max-w-md mx-auto px-4 py-16 text-center">
      <CheckCircle size={56} className="text-green-500 mx-auto mb-4" />
      <h1 className="text-2xl font-bold text-gray-800 mb-2">¡Pedido recibido!</h1>
      <p className="text-gray-500">
        Tu pedido {pedido ? `por $${pedido.total.toFixed(2)}` : ''} quedó registrado.
      </p>
      {pedido && (
        <p className="text-gray-500 mt-2 text-sm">
          {pedido.metodo_entrega === 'domicilio' ? 'Te lo enviaremos a domicilio.' : 'Puedes recogerlo en sucursal.'}
        </p>
      )}

      {pedido?.metodo_pago === 'transferencia' && (
        <div className="bg-white rounded-lg shadow-sm p-5 mt-6 text-left">
          <h2 className="text-sm font-semibold text-gray-700 mb-3">Datos para tu transferencia</h2>
          <div className="space-y-2 text-sm">
            <p><span className="text-gray-500">Banco:</span> <span className="text-gray-800 font-medium">{DATOS_BANCARIOS.banco}</span></p>
            <div className="flex items-center justify-between">
              <p><span className="text-gray-500">CLABE:</span> <span className="text-gray-800 font-medium">{DATOS_BANCARIOS.clabe}</span></p>
              <button onClick={copiarClabe} className="text-blue-600 hover:text-blue-700 flex items-center gap-1 text-xs">
                <Copy size={14} /> {copiado ? 'Copiado' : 'Copiar'}
              </button>
            </div>
            <p><span className="text-gray-500">Titular:</span> <span className="text-gray-800 font-medium">{DATOS_BANCARIOS.titular}</span></p>
            <p><span className="text-gray-500">Monto exacto:</span> <span className="text-gray-800 font-medium">${pedido.total.toFixed(2)}</span></p>
          </div>
          <p className="text-xs text-gray-400 mt-4">
            En el concepto de la transferencia, pon tu nombre para que podamos identificarla. Tu pedido se marcará como pagado en cuanto confirmemos que llegó.
          </p>
        </div>
      )}

      <Link to="/" className="inline-block mt-6 text-blue-600 hover:underline">
        Volver al inicio
      </Link>
    </main>
  )
}

export default OrderConfirmation