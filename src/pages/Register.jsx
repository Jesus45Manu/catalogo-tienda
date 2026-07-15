import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Register() {
  const { registrarse } = useAuth()
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)
  const [exito, setExito] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setCargando(true)

    const formData = new FormData(e.target)
    const email = formData.get('email')
    const password = formData.get('password')

    const { error } = await registrarse(email, password)

    if (error) {
      setError(error.message)
    } else {
      setExito(true)
    }
    setCargando(false)
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <span className="text-2xl font-bold text-blue-600 mb-8">Mi Tienda</span>

      <div className="w-full max-w-sm">
        {exito ? (
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">¡Listo!</h1>
            <p className="text-gray-500">Revisa tu correo para confirmar tu cuenta antes de iniciar sesión.</p>
            <Link to="/login" className="inline-block mt-4 text-blue-600 hover:underline">Ir a iniciar sesión</Link>
          </div>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Crea tu cuenta</h1>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm text-gray-600">Correo</label>
                <input type="email" name="email" required className="w-full border border-gray-300 rounded px-3 py-2 mt-1" />
              </div>
              <div>
                <label className="text-sm text-gray-600">Contraseña</label>
                <input type="password" name="password" required minLength={6} className="w-full border border-gray-300 rounded px-3 py-2 mt-1" />
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <button type="submit" disabled={cargando} className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition disabled:bg-gray-300">
                {cargando ? 'Creando cuenta...' : 'Registrarme'}
              </button>
            </form>

            <p className="text-sm text-gray-500 mt-4 text-center">
              ¿Ya tienes cuenta?{' '}
              <Link to="/login" className="text-blue-600 hover:underline">Inicia sesión</Link>
            </p>
          </>
        )}
      </div>
    </main>
  )
}

export default Register