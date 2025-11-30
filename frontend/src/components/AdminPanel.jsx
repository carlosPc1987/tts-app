import { useState, useEffect } from 'react'
import axios from 'axios'

const AdminPanel = ({ texts: propsTexts, onDelete }) => {
  // Asegurar que siempre sea un array
  const [texts, setTexts] = useState(Array.isArray(propsTexts) ? propsTexts : [])
  const [loading, setLoading] = useState(true) // Iniciar en true para mostrar loading

  useEffect(() => {
    fetchAllTexts()
  }, [])

  const fetchAllTexts = async () => {
    try {
      setLoading(true)
      const response = await axios.get('/admin/texts', {
        withCredentials: true
      })
      // Asegurar que siempre sea un array
      const data = response.data
      if (Array.isArray(data)) {
        setTexts(data)
      } else {
        console.warn('La respuesta no es un array:', data)
        setTexts([])
      }
    } catch (error) {
      console.error('Error fetching all texts:', error)
      if (error.response?.status === 403 || error.response?.status === 401) {
        console.warn('No tienes permisos de administrador')
      }
      setTexts([]) // Asegurar que siempre sea un array
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/admin/texts/${id}`, { withCredentials: true })
      // Asegurar que texts sea un array antes de filtrar
      const currentTexts = Array.isArray(texts) ? texts : []
      setTexts(currentTexts.filter((t) => t.id !== id))
      if (onDelete) {
        onDelete(id)
      }
    } catch (error) {
      console.error('Error deleting text:', error)
      if (error.response?.status === 403 || error.response?.status === 401) {
        alert('No tienes permisos para eliminar este texto')
      } else {
        alert('Error al eliminar el texto. Por favor, intenta nuevamente.')
      }
    }
  }

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-purple-900/40 to-blue-900/40 backdrop-blur-md rounded-xl border border-purple-500/30 p-12 text-center shadow-2xl">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto mb-4"></div>
        <div className="text-purple-300 text-lg">Cargando textos...</div>
      </div>
    )
  }

  // Asegurar que texts siempre sea un array antes de renderizar
  const safeTexts = Array.isArray(texts) ? texts : []
  
  if (safeTexts.length === 0 && !loading) {
    return (
      <div className="bg-gradient-to-br from-purple-900/40 to-blue-900/40 backdrop-blur-md rounded-xl border border-purple-500/30 p-12 text-center shadow-2xl">
        <div className="text-6xl mb-4">📝</div>
        <h3 className="text-2xl font-bold text-white mb-2">No hay textos</h3>
        <p className="text-purple-200">Aún no se han creado textos en el sistema</p>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-br from-purple-900/40 to-blue-900/40 backdrop-blur-md rounded-xl border border-purple-500/30 overflow-hidden shadow-2xl">
      <div className="p-6 border-b border-purple-500/30 bg-gradient-to-r from-purple-600/20 to-blue-600/20">
        <h2 className="text-2xl font-bold text-white flex items-center">
          <span className="mr-3">📋</span>
          Todos los Textos (Administración)
        </h2>
        <p className="text-purple-200 text-sm mt-1">Total: {safeTexts.length} textos</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-purple-800/30 to-blue-800/30">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-purple-200 uppercase tracking-wider">
                Título
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-purple-200 uppercase tracking-wider">
                Usuario
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-purple-200 uppercase tracking-wider">
                Creado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-purple-200 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-purple-500/20">
            {safeTexts.map((text) => (
              <tr key={text.id} className="hover:bg-purple-500/10 transition-colors">
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-white">
                    {text.title}
                  </div>
                  <div className="text-sm text-purple-200 truncate max-w-md">
                    {text.content}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-200">
                  👤 {text.username}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-200">
                  📅 {new Date(text.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <button
                    onClick={() => handleDelete(text.id)}
                    className="bg-red-500/20 hover:bg-red-500/30 text-red-300 hover:text-red-200 px-4 py-2 rounded-lg transition-colors flex items-center"
                  >
                    <span className="mr-2">🗑️</span>
                    Eliminar
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

export default AdminPanel

