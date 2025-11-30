import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'

function AppRoutes() {
  const { user, loading } = useAuth()

  // Mientras carga, mostrar loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-white text-xl flex items-center">
          <span className="animate-spin mr-3">⏳</span>
          Cargando...
        </div>
      </div>
    )
  }

  // REGLA PRINCIPAL: SIEMPRE verificar usuario válido
  // Si no hay usuario, username, o id → FORZAR login
  const hasValidUser = user && user.username && user.id

  if (!hasValidUser) {
    // SIN USUARIO VÁLIDO → SIEMPRE A LOGIN
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    )
  }

  // CON USUARIO VÁLIDO → Mostrar Dashboard
  return (
    <Routes>
      <Route path="/login" element={<Navigate to="/" replace />} />
      <Route path="/" element={<Dashboard />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  )
}

export default App

