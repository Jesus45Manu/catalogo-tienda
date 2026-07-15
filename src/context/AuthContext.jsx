import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null)
  const [esAdmin, setEsAdmin] = useState(null)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUsuario(session?.user ?? null)
      setCargando(false)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUsuario(session?.user ?? null)
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  // Cuando el navegador restaura la página desde su caché (botón "atrás"/"adelante"),
  // volvemos a comprobar la sesión real en vez de confiar en lo que quedó dibujado en pantalla.
  useEffect(() => {
    function handlePageShow(event) {
      if (event.persisted) {
        supabase.auth.getSession().then(({ data: { session } }) => {
          setUsuario(session?.user ?? null)
        })
      }
    }
    window.addEventListener('pageshow', handlePageShow)
    return () => window.removeEventListener('pageshow', handlePageShow)
  }, [])

  useEffect(() => {
    async function verificarAdmin() {
      if (!usuario) {
        setEsAdmin(false)
        return
      }
      const { data } = await supabase
        .from('admins')
        .select('usuario_id')
        .eq('usuario_id', usuario.id)
        .maybeSingle()

      setEsAdmin(!!data)
    }

    if (!cargando) verificarAdmin()
  }, [usuario, cargando])

  async function registrarse(email, password) {
    return await supabase.auth.signUp({ email, password })
  }

  async function iniciarSesion(email, password) {
    return await supabase.auth.signInWithPassword({ email, password })
  }

  async function cerrarSesion() {
    await supabase.auth.signOut()
  }

  return (
    <AuthContext.Provider value={{ usuario, esAdmin, cargando, registrarse, iniciarSesion, cerrarSesion }}>
      {children}
    </AuthContext.Provider>
  )
}