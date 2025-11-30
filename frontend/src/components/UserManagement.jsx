import { useState, useEffect } from 'react'
import axios from 'axios'

const UserManagement = ({ onUserDeleted }) => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(null)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    setLoading(true)
    try {
      console.log('📥 Solicitando usuarios al servidor...')
      const response = await axios.get('/admin/users', {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      })
      
      // Verificar que la respuesta sea JSON
      if (typeof response.data === 'string' && response.data.trim().startsWith('<!')) {
        console.error('❌ ERROR: El servidor devolvió HTML en lugar de JSON')
        console.error('Esto puede indicar un error de autenticación o un problema con el proxy')
        setUsers([])
        alert('Error: El servidor no está respondiendo correctamente. Verifica que estés autenticado como admin.')
        return
      }
      
      console.log('📤 Respuesta completa:', response)
      console.log('📤 Status:', response.status)
      console.log('📤 Data:', response.data)
      console.log('📤 Data type:', typeof response.data)
      console.log('📤 Is Array:', Array.isArray(response.data))
      console.log('📤 Data length:', response.data?.length)
      
      // Asegurar que siempre sea un array
      const data = response.data
      if (Array.isArray(data)) {
        console.log('✅ Usuarios recibidos correctamente:', data.length)
        data.forEach((user, index) => {
          console.log(`  ${index + 1}. ID: ${user.id}, Username: ${user.username}, Email: ${user.email}, Rol: ${user.role}`)
        })
        setUsers(data)
      } else {
        console.error('❌ ERROR: La respuesta no es un array:', data)
        console.error('Tipo de dato:', typeof data)
        setUsers([])
        if (data && typeof data === 'object') {
          console.error('Contenido de la respuesta:', JSON.stringify(data, null, 2))
        }
      }
    } catch (error) {
      console.error('❌ ERROR al obtener usuarios:', error)
      console.error('Error response:', error.response)
      console.error('Error status:', error.response?.status)
      console.error('Error data:', error.response?.data)
      
      // Si el error es 403, el usuario no tiene permisos
      if (error.response?.status === 403) {
        alert('Error: No tienes permisos para acceder a esta sección. Debes ser administrador.')
      } else if (error.response?.status === 401) {
        alert('Error: No estás autenticado. Por favor, inicia sesión nuevamente.')
      } else {
        alert('Error al cargar usuarios: ' + (error.response?.data?.message || error.message))
      }
      
      setUsers([]) // Asegurar que siempre sea un array
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (userId, username) => {
    if (!window.confirm(`¿Estás seguro de que deseas eliminar al usuario "${username}"? Esta acción no se puede deshacer.`)) {
      return
    }

    setDeleting(userId)
    try {
      await axios.delete(`/admin/users/${userId}`, { withCredentials: true })
      // Asegurar que users sea un array antes de filtrar
      const currentUsers = Array.isArray(users) ? users : []
      setUsers(currentUsers.filter((u) => u.id !== userId))
      if (onUserDeleted) {
        onUserDeleted(userId)
      }
    } catch (error) {
      console.error('Error deleting user:', error)
      alert('Error al eliminar usuario: ' + (error.response?.data?.message || error.message))
    } finally {
      setDeleting(null)
    }
  }

  // Asegurar que users siempre sea un array antes de renderizar
  const safeUsers = Array.isArray(users) ? users : []

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-purple-900/40 to-blue-900/40 backdrop-blur-md rounded-xl border border-purple-500/30 p-12 text-center shadow-2xl">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto mb-4"></div>
        <div className="text-purple-300 text-lg">Cargando usuarios...</div>
      </div>
    )
  }

  if (safeUsers.length === 0) {
    return (
      <div className="bg-gradient-to-br from-purple-900/40 to-blue-900/40 backdrop-blur-md rounded-xl border border-purple-500/30 p-12 text-center shadow-2xl">
        <div className="text-6xl mb-4">👥</div>
        <h3 className="text-2xl font-bold text-white mb-2">No hay usuarios</h3>
        <p className="text-purple-200">Aún no hay usuarios registrados en el sistema</p>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-br from-purple-900/40 to-blue-900/40 backdrop-blur-md rounded-xl border border-purple-500/30 overflow-hidden shadow-2xl">
      <div className="p-6 border-b border-purple-500/30 bg-gradient-to-r from-purple-600/20 to-blue-600/20">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center">
              <span className="mr-3">👥</span>
              Gestión de Usuarios
            </h2>
            <p className="text-purple-200 text-sm mt-1">Total: {safeUsers.length} usuarios</p>
          </div>
          <button
            onClick={fetchUsers}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-colors flex items-center"
          >
            <span className="mr-2">🔄</span>
            Recargar
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-purple-800/30 to-blue-800/30">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-purple-200 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-purple-200 uppercase tracking-wider">
                Usuario
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-purple-200 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-purple-200 uppercase tracking-wider">
                Rol
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-purple-200 uppercase tracking-wider">
                Textos
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-purple-200 uppercase tracking-wider">
                Registrado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-purple-200 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-purple-500/20">
            {safeUsers.map((user) => (
              <tr key={user.id} className="hover:bg-purple-500/10 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-200">
                  #{user.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-white flex items-center">
                    👤 {user.username}
                    {user.role === 'ADMIN' && (
                      <span className="ml-2 px-2 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs rounded-full font-bold">
                        ⭐ ADMIN
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-200">
                  📧 {user.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    user.role === 'ADMIN' 
                      ? 'bg-gradient-to-r from-yellow-500/30 to-orange-500/30 text-yellow-200'
                      : 'bg-gradient-to-r from-blue-500/30 to-purple-500/30 text-blue-200'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-200">
                  📝 {user.textEntriesCount ?? user.textEntryCount ?? 0}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-200">
                  📅 {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <button
                    onClick={() => handleDelete(user.id, user.username)}
                    disabled={deleting === user.id}
                    className="bg-red-500/20 hover:bg-red-500/30 text-red-300 hover:text-red-200 px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    <span className="mr-2">🗑️</span>
                    {deleting === user.id ? 'Eliminando...' : 'Eliminar'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default UserManagement

