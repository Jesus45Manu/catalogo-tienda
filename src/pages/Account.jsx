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
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Mi cuenta</h1>

      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h2 className="text-sm font-semibold text-gray-500 mb-2">Datos personales</h2>
        <p className="text-gray-800">{usuario?.email}</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-sm font-semibold text-gray-500 mb-4">Cambiar contraseña</h2>

        <form onSubmit={handleCambiarPassword} className="space-y-4">
          <div>
            <label className="text-sm text-gray-600">Nueva contraseña</label>
            <input
              type="password"
              minLength={6}
              value={passwordNueva}
              onChange={(e) => setPasswordNueva(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
            />
          </div>
          <div>
            <label className="text-sm text-gray-600">Confirmar nueva contraseña</label>
            <input
              type="password"
              minLength={6}
              value={passwordConfirmar}
              onChange={(e) => setPasswordConfirmar(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}
          {mensaje && <p className="text-green-600 text-sm">{mensaje}</p>}

          <button
            type="submit"
            disabled={guardando}
            className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition disabled:bg-gray-300"
          >
            {guardando ? 'Guardando...' : 'Actualizar contraseña'}
          </button>
        </form>
      </div>

      <Link to="/" className="inline-block mt-6 text-sm text-blue-600 hover:underline">
        ← Volver a la tienda
      </Link>
    </main>
  )
}

export default Account