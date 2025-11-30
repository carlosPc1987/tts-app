import { useState, useEffect } from 'react'
import axios from 'axios'

const FileManagement = ({ onFileDeleted }) => {
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(null)

  useEffect(() => {
    fetchFiles()
  }, [])

  const fetchFiles = async () => {
    setLoading(true)
    try {
      const response = await axios.get('/admin/files', {
        withCredentials: true
      })
      // Asegurar que siempre sea un array
      const data = response.data
      if (Array.isArray(data)) {
        setFiles(data)
      } else {
        console.warn('La respuesta no es un array:', data)
        setFiles([])
      }
    } catch (error) {
      console.error('Error fetching files:', error)
      setFiles([]) // Asegurar que siempre sea un array
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (audioUrl) => {
    const filename = audioUrl.substring(audioUrl.lastIndexOf('/') + 1)
    if (!window.confirm(`¿Estás seguro de que deseas eliminar el archivo "${filename}"? Esta acción no se puede deshacer.`)) {
      return
    }

    setDeleting(audioUrl)
    try {
      await axios.delete('/admin/files', {
        params: { audioUrl },
        withCredentials: true
      })
      // Asegurar que files sea un array antes de filtrar
      const currentFiles = Array.isArray(files) ? files : []
      setFiles(currentFiles.filter((f) => f !== audioUrl))
      if (onFileDeleted) {
        onFileDeleted(audioUrl)
      }
    } catch (error) {
      console.error('Error deleting file:', error)
      alert('Error al eliminar archivo: ' + (error.response?.data?.message || error.message))
    } finally {
      setDeleting(null)
    }
  }

  const formatFileSize = (url) => {
    return 'N/A'
  }

  // Asegurar que files siempre sea un array antes de renderizar
  const safeFiles = Array.isArray(files) ? files : []

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-purple-900/40 to-blue-900/40 backdrop-blur-md rounded-xl border border-purple-500/30 p-12 text-center shadow-2xl">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto mb-4"></div>
        <div className="text-purple-300 text-lg">Cargando archivos...</div>
      </div>
    )
  }

  if (safeFiles.length === 0) {
    return (
      <div className="bg-gradient-to-br from-purple-900/40 to-blue-900/40 backdrop-blur-md rounded-xl border border-purple-500/30 p-12 text-center shadow-2xl">
        <div className="text-6xl mb-4">📁</div>
        <h3 className="text-2xl font-bold text-white mb-2">No hay archivos</h3>
        <p className="text-purple-200">Aún no hay archivos de audio en el sistema</p>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-br from-purple-900/40 to-blue-900/40 backdrop-blur-md rounded-xl border border-purple-500/30 overflow-hidden shadow-2xl">
      <div className="p-6 border-b border-purple-500/30 bg-gradient-to-r from-purple-600/20 to-blue-600/20">
        <h2 className="text-2xl font-bold text-white flex items-center">
          <span className="mr-3">📁</span>
          Gestión de Archivos de Audio
        </h2>
        <p className="text-purple-200 text-sm mt-1">Total: {safeFiles.length} archivos</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-purple-800/30 to-blue-800/30">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-purple-200 uppercase tracking-wider">
                Archivo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-purple-200 uppercase tracking-wider">
                URL
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-purple-200 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-purple-500/20">
            {safeFiles.map((fileUrl) => {
              const filename = fileUrl.substring(fileUrl.lastIndexOf('/') + 1)
              return (
                <tr key={fileUrl} className="hover:bg-purple-500/10 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-white flex items-center">
                      <span className="mr-2">🎵</span>
                      {filename}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-purple-200 truncate max-w-md">{fileUrl}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center space-x-4">
                      <a
                        href={`http://localhost:8080${fileUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 hover:text-blue-200 px-4 py-2 rounded-lg transition-colors flex items-center"
                      >
                        <span className="mr-2">▶️</span>
                        Escuchar
                      </a>
                      <button
                        onClick={() => handleDelete(fileUrl)}
                        disabled={deleting === fileUrl}
                        className="bg-red-500/20 hover:bg-red-500/30 text-red-300 hover:text-red-200 px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                      >
                        <span className="mr-2">🗑️</span>
                        {deleting === fileUrl ? 'Eliminando...' : 'Eliminar'}
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default FileManagement

