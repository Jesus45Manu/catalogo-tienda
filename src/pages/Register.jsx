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
    <main className="min-h-screen flex flex-col items-center justify-center bg-bg px-4">
      <span className="font-display text-3xl font-semibold text-brand mb-8">Mi Tienda</span>

      <div className="w-full max-w-sm bg-surface border border-line rounded-2xl p-8">
        {exito ? (
          <div className="text-center">
            <h1 className="font-display text-2xl font-semibold text-ink mb-2">¡Listo!</h1>
            <p className="text-ink-soft">Revisa tu correo para confirmar tu cuenta antes de iniciar sesión.</p>
            <Link to="/login" className="inline-block mt-4 text-brand hover:underline font-medium">Ir a iniciar sesión</Link>
          </div>
        ) : (
          <>
            <h1 className="font-display text-2xl font-semibold text-ink mb-6">Crea tu cuenta</h1>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm text-ink-soft">Correo</label>
                <input type="email" name="email" required className="w-full border border-line rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-accent" />
              </div>
              <div>
                <label className="text-sm text-ink-soft">Contraseña</label>
                <input type="password" name="password" required minLength={6} className="w-full border border-line rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-accent" />
              </div>

              {error && <p className="text-red-600 text-sm">{error}</p>}

              <button type="submit" disabled={cargando} className="w-full bg-brand text-white py-2.5 rounded-full font-medium hover:bg-brand-dark hover:scale-[1.02] active:scale-[0.97] transition-all duration-150 shadow-sm hover:shadow-md disabled:bg-line disabled:text-ink-soft disabled:hover:scale-100">
                {cargando ? 'Creando cuenta...' : 'Registrarme'}
              </button>
            </form>

            <p className="text-sm text-ink-soft mt-4 text-center">
              ¿Ya tienes cuenta?{' '}
              <Link to="/login" className="text-brand hover:underline font-medium">Inicia sesión</Link>
            </p>
          </>
        )}
      </div>
    </main>
  )
}

export default Register