import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Login() {
  const { usuario, esAdmin, iniciarSesion } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)
  const [intentoLogin, setIntentoLogin] = useState(false)

  useEffect(() => {
    if (!intentoLogin || !usuario || esAdmin === null) return

    if (location.state?.from) {
      navigate(location.state.from, { replace: true })
    } else {
      navigate(esAdmin ? '/admin/productos' : '/', { replace: true })
    }
  }, [intentoLogin, usuario, esAdmin, location.state, navigate])

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setCargando(true)

    const formData = new FormData(e.target)
    const email = formData.get('email')
    const password = formData.get('password')

    const { error } = await iniciarSesion(email, password)

    if (error) {
      setError('Correo o contraseña incorrectos.')
      setCargando(false)
      return
    }

    setIntentoLogin(true)
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <span className="text-2xl font-bold text-blue-600 mb-8">Mi Tienda</span>

      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Inicia sesión</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-gray-600">Correo</label>
            <input type="email" name="email" required className="w-full border border-gray-300 rounded px-3 py-2 mt-1" />
          </div>
          <div>
            <label className="text-sm text-gray-600">Contraseña</label>
            <input type="password" name="password" required className="w-full border border-gray-300 rounded px-3 py-2 mt-1" />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button type="submit" disabled={cargando} className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition disabled:bg-gray-300">
            {cargando ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <p className="text-sm text-gray-500 mt-4 text-center">
          ¿No tienes cuenta?{' '}
          <Link to="/registro" className="text-blue-600 hover:underline">Regístrate</Link>
        </p>
      </div>
    </main>
  )
}

export default Login