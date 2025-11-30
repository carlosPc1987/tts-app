import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import BackgroundMusic from '../components/BackgroundMusic'
import BackgroundImage from '../components/BackgroundImage'

const Login = () => {
  const [isLogin, setIsLogin] = useState(true)
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login, register, user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    // Si hay un usuario válido, redirigir al dashboard
    if (user && user.username && user.id) {
      navigate('/', { replace: true })
    }
  }, [user, navigate])
  
  // Función para volver al login sin cerrar sesión (limpiar formulario)
  const resetForm = () => {
    setUsername('')
    setEmail('')
    setPassword('')
    setError('')
    setIsLogin(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      let result
      if (isLogin) {
        result = await login(username, password)
      } else {
        if (!email) {
          setError('El correo electrónico es obligatorio. Por favor, ingresa un correo (puede ser inventado).')
          setLoading(false)
          return
        }
        result = await register(username, email, password)
      }

      if (result.success) {
        // Si el registro necesita login manual, mostrar mensaje y cambiar a login
        if (result.needsLogin) {
          setError(result.message || 'Registro exitoso. Por favor, inicia sesión.')
          setIsLogin(true) // Cambiar a modo login
          setUsername(username) // Pre-llenar el username
          setEmail('') // Limpiar email
          setPassword('') // Limpiar password para que el usuario la ingrese
        } else {
          // Login exitoso o registro con login automático exitoso
          navigate('/')
        }
      } else {
        setError(result.error || 'Ocurrió un error. Por favor, intenta nuevamente.')
      }
    } catch (err) {
      console.error('Error:', err)
      setError('Ocurrió un error inesperado. Por favor, intenta nuevamente.')
    } finally {
      setLoading(false)
    }
  }

  const handleTabChange = (newIsLogin) => {
    setIsLogin(newIsLogin)
    setError('')
    setUsername('')
    setEmail('')
    setPassword('')
  }


  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      <BackgroundImage />
      <BackgroundMusic enabled={true} />
      {/* Efectos visuales */}
      <div className="absolute inset-0 opacity-5 z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>
      <div className="w-full max-w-md relative z-10">
        <div className="bg-gradient-to-br from-purple-900/60 via-blue-900/60 to-pink-900/60 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-purple-500/30">
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-300 via-pink-300 to-blue-300 bg-clip-text text-transparent mb-2 flex items-center justify-center">
              <span className="mr-3 text-6xl">🎙️</span>
              TTS App
            </h1>
            <p className="text-purple-200 text-lg">Text to Speech Generator</p>
          </div>

          <div className="flex mb-6 bg-gradient-to-r from-purple-800/30 to-blue-800/30 rounded-lg p-1 border border-purple-500/20">
            <button
              type="button"
              onClick={() => handleTabChange(true)}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition-all ${
                isLogin
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                  : 'text-purple-200 hover:text-white hover:bg-purple-500/20'
              }`}
            >
              🔐 Iniciar Sesión
            </button>
            <button
              type="button"
              onClick={() => handleTabChange(false)}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition-all ${
                !isLogin
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                  : 'text-purple-200 hover:text-white hover:bg-purple-500/20'
              }`}
            >
              ✨ Registrarse
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Nombre de Usuario
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                minLength={2}
                maxLength={50}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Ingresa tu nombre de usuario (mínimo 2 caracteres)"
              />
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required={!isLogin}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="ejemplo@correo.com (puede ser inventado)"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={4}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Ingresa tu contraseña (mínimo 4 caracteres)"
              />
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500 text-red-400 px-4 py-3 rounded-lg text-sm animate-pulse">
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span>{error}</span>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold py-4 px-4 rounded-lg transition-all shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
            >
              {loading ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  Procesando...
                </>
              ) : (
                <>
                  <span className="mr-2">{isLogin ? '🔐' : '✨'}</span>
                  {isLogin ? 'Iniciar Sesión' : 'Registrarse'}
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login
