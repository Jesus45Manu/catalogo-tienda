import { Link } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'

function Account() {
  const { usuario } = useAuth()
  const [passwordNueva, setPasswordNueva] = useState('')
  const [passwordConfirmar, setPasswordConfirmar] = useState('')
  const [guardando, setGuardando] = useState(false)
  const [mensaje, setMensaje] = useState('')
  const [error, setError] = useState('')

  async function handleCambiarPassword(e) {
    e.preventDefault()
    setError('')
    setMensaje('')

    if (passwordNueva.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.')
      return
    }
    if (passwordNueva !== passwordConfirmar) {
      setError('Las contraseñas no coinciden.')
      return
    }

    setGuardando(true)
    const { error } = await supabase.auth.updateUser({ password: passwordNueva })

    if (error) {
      setError('No se pudo cambiar la contraseña: ' + error.message)
    } else {
      setMensaje('Contraseña actualizada correctamente.')
      setPasswordNueva('')
      setPasswordConfirmar('')
    }
    setGuardando(false)
  }

  return (
    <main className="max-w-lg mx-auto px-4 py-8">
      <h1 className="font-display text-2xl font-semibold text-ink mb-6">Mi cuenta</h1>

      <div className="bg-surface border border-line rounded-xl p-6 mb-6">
        <h2 className="text-sm font-semibold text-ink-soft mb-2">Datos personales</h2>
        <p className="text-ink">{usuario?.email}</p>
      </div>

      <div className="bg-surface border border-line rounded-xl p-6">
        <h2 className="text-sm font-semibold text-ink-soft mb-4">Cambiar contraseña</h2>

        <form onSubmit={handleCambiarPassword} className="space-y-4">
          <div>
            <label className="text-sm text-ink-soft">Nueva contraseña</label>
            <input
              type="password"
              minLength={6}
              value={passwordNueva}
              onChange={(e) => setPasswordNueva(e.target.value)}
              className="w-full border border-line rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <div>
            <label className="text-sm text-ink-soft">Confirmar nueva contraseña</label>
            <input
              type="password"
              minLength={6}
              value={passwordConfirmar}
              onChange={(e) => setPasswordConfirmar(e.target.value)}
              className="w-full border border-line rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}
          {mensaje && <p className="text-brand text-sm">{mensaje}</p>}

          <button
            type="submit"
            disabled={guardando}
            className="bg-brand text-white px-6 py-2.5 rounded-full font-medium hover:bg-brand-dark hover:scale-[1.02] active:scale-[0.97] transition-all duration-150 shadow-sm hover:shadow-md disabled:bg-line disabled:text-ink-soft disabled:hover:scale-100"
          >
            {guardando ? 'Guardando...' : 'Actualizar contraseña'}
          </button>
        </form>
      </div>

      <Link to="/" className="inline-block mt-6 text-sm text-brand hover:underline font-medium">
        ← Volver a la tienda
      </Link>
    </main>
  )
}

export default Account