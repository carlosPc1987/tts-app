import { createContext, useState, useContext, useEffect } from 'react'
import axios from 'axios'
import { extractErrorMessage } from '../utils/errorMessages'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // NO hacer checkAuth automático - SIEMPRE empezar sin usuario
    // Solo establecer loading en false para mostrar login
    setLoading(false)
    setUser(null)
  }, [])

  const checkAuth = async () => {
    try {
      const response = await axios.get('/api/auth/me', { withCredentials: true })
      // Verificación ESTRICTA: debe ser 200, tener data, username e id
      if (response.status === 200 && 
          response.data && 
          response.data.username && 
          response.data.id) {
        setUser({ ...response.data, authenticated: true })
        return true
      } else {
        setUser(null)
        return false
      }
    } catch (error) {
      setUser(null)
      return false
    }
  }

  const getErrorMessage = (error) => {
    return extractErrorMessage(error)
  }

  const login = async (username, password) => {
    try {
      console.log('=== INICIO LOGIN ===')
      console.log('Username:', username)
      
      const response = await axios.post(
        '/api/auth/login',
        { username, password },
        { withCredentials: true }
      )
      
      console.log('Login response:', response.data)
      
      // Esperar un momento para que la cookie se establezca
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Obtener información completa del usuario incluyendo el rol
      const userInfo = await axios.get('/api/auth/me', { withCredentials: true })
      console.log('UserInfo recibido después de login:', userInfo.data)
      
      if (userInfo.data && userInfo.data.username && userInfo.data.id) {
        const userData = { ...userInfo.data, authenticated: true }
        console.log('Usuario establecido:', userData)
        console.log('Rol del usuario:', userData.role)
        setUser(userData)
        console.log('=== LOGIN EXITOSO ===')
        return { success: true, data: userInfo.data }
      } else {
        console.error('❌ UserInfo inválido:', userInfo.data)
        return {
          success: false,
          error: 'Error al obtener información del usuario'
        }
      }
    } catch (error) {
      console.error('❌ Error en login:', error)
      console.error('Error response:', error.response?.data)
      return {
        success: false,
        error: getErrorMessage(error)
      }
    }
  }

  const register = async (username, email, password) => {
    try {
      console.log('=== INICIO REGISTRO ===')
      console.log('Username:', username)
      console.log('Email:', email)
      
      // Primero registrar el usuario
      const response = await axios.post(
        '/api/auth/register',
        { username, email, password },
        { withCredentials: true }
      )
      
      console.log('Registro exitoso:', response.data)
      
      // Si el registro fue exitoso, hacer login automático
      if (response.data && response.data.username) {
        console.log('Intentando login automático...')
        // Hacer login automático con las credenciales
        const loginResult = await login(username, password)
        if (loginResult.success) {
          console.log('Login automático exitoso')
          return { success: true, data: loginResult.data }
        } else {
          console.warn('Login automático falló:', loginResult.error)
          // Si el login falla, NO establecer usuario, permitir login manual
          setUser(null)
          return { 
            success: true, 
            data: response.data,
            needsLogin: true,
            message: 'Registro exitoso. Por favor, inicia sesión con tus credenciales.'
          }
        }
      }
      
      return { success: true, data: response.data }
    } catch (error) {
      console.error('Registration error:', error)
      console.error('Error details:', error.response?.data)
      setUser(null) // Asegurar que no hay usuario en caso de error
      return {
        success: false,
        error: getErrorMessage(error)
      }
    }
  }

  const logout = async () => {
    try {
      await axios.post('/api/auth/logout', {}, { withCredentials: true })
    } catch (error) {
      // Ignorar errores en logout
    } finally {
      setUser(null)
      // Forzar recarga de la página para limpiar todo
      window.location.href = '/login'
    }
  }

  const value = {
    user,
    login,
    register,
    logout,
    loading
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
