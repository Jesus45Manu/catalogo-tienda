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
      <CheckCircle size={56} className="text-brand mx-auto mb-4" />
      <h1 className="font-display text-2xl font-semibold text-ink mb-2">¡Pedido recibido!</h1>
      <p className="text-ink-soft">
        Tu pedido {pedido ? `por $${pedido.total.toFixed(2)}` : ''} quedó registrado.
      </p>
      {pedido && (
        <p className="text-ink-soft mt-2 text-sm">
          {pedido.metodo_entrega === 'domicilio' ? 'Te lo enviaremos a domicilio.' : 'Puedes recogerlo en sucursal.'}
        </p>
      )}

      {pedido?.metodo_pago === 'transferencia' && (
        <div className="bg-surface border border-line rounded-xl p-5 mt-6 text-left">
          <h2 className="text-sm font-semibold text-ink-soft mb-3">Datos para tu transferencia</h2>
          <div className="space-y-2 text-sm">
            <p><span className="text-ink-soft">Banco:</span> <span className="text-ink font-medium">{DATOS_BANCARIOS.banco}</span></p>
            <div className="flex items-center justify-between">
              <p><span className="text-ink-soft">CLABE:</span> <span className="text-ink font-medium">{DATOS_BANCARIOS.clabe}</span></p>
              <button onClick={copiarClabe} className="text-brand hover:text-brand-dark flex items-center gap-1 text-xs font-medium">
                <Copy size={14} /> {copiado ? 'Copiado' : 'Copiar'}
              </button>
            </div>
            <p><span className="text-ink-soft">Titular:</span> <span className="text-ink font-medium">{DATOS_BANCARIOS.titular}</span></p>
            <p><span className="text-ink-soft">Monto exacto:</span> <span className="font-display text-accent-dark font-semibold">${pedido.total.toFixed(2)}</span></p>
          </div>
          <p className="text-xs text-ink-soft mt-4">
            En el concepto de la transferencia, pon tu nombre para que podamos identificarla. Tu pedido se marcará como pagado en cuanto confirmemos que llegó.
          </p>
        </div>
      )}

      <Link to="/" className="inline-block mt-6 text-brand hover:underline font-medium">
        Volver al inicio
      </Link>
    </main>
  )
}

export default OrderConfirmation