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
      console.log('📥 Solicitando archivos al servidor...')
      // Solicitar información detallada
      const response = await axios.get('/admin/files?detailed=true', {
        withCredentials: true
      })
      console.log('📤 Respuesta completa:', response)
      console.log('📤 Status:', response.status)
      console.log('📤 Data:', response.data)
      console.log('📤 Data type:', typeof response.data)
      console.log('📤 Is Array:', Array.isArray(response.data))
      console.log('📤 Data length:', response.data?.length)
      
      // Asegurar que siempre sea un array
      const data = response.data
      if (Array.isArray(data)) {
        console.log('✅ Archivos recibidos correctamente:', data.length)
        data.forEach((file, index) => {
          console.log(`  ${index + 1}. ${file.title || file.filename} - Usuario: ${file.username || 'N/A'}`)
        })
        setFiles(data)
      } else {
        console.error('❌ ERROR: La respuesta no es un array:', data)
        console.error('Tipo de dato:', typeof data)
        setFiles([])
      }
    } catch (error) {
      console.error('❌ ERROR al obtener archivos:', error)
      console.error('Error response:', error.response)
      console.error('Error status:', error.response?.status)
      console.error('Error data:', error.response?.data)
      setFiles([]) // Asegurar que siempre sea un array
      if (error.response?.status === 403) {
        alert('Error: No tienes permisos para ver archivos. Asegúrate de estar logueado como ADMIN.')
      } else {
        alert('Error al cargar archivos: ' + (error.response?.data?.message || error.message))
      }
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (file) => {
    const audioUrl = typeof file === 'string' ? file : file.audioUrl
    const filename = typeof file === 'string' 
      ? file.substring(file.lastIndexOf('/') + 1)
      : file.filename
    const title = file.title || filename
    
    if (!window.confirm(`¿Estás seguro de que deseas eliminar el archivo "${title}"?\n\nArchivo: ${filename}\n\nEsta acción no se puede deshacer.`)) {
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
      setFiles(currentFiles.filter((f) => {
        const fUrl = typeof f === 'string' ? f : f.audioUrl
        return fUrl !== audioUrl
      }))
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

  const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return 'N/A'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch (e) {
      return 'N/A'
    }
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
                Título / Archivo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-purple-200 uppercase tracking-wider">
                Usuario
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-purple-200 uppercase tracking-wider">
                Fecha
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-purple-200 uppercase tracking-wider">
                Tamaño
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-purple-200 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-purple-500/20">
            {safeFiles.map((file) => {
              // Compatibilidad: puede ser string (URL) u objeto (AudioFileInfo)
              const isString = typeof file === 'string'
              const audioUrl = isString ? file : file.audioUrl
              const filename = isString 
                ? file.substring(file.lastIndexOf('/') + 1)
                : file.filename
              const title = isString ? null : file.title
              const username = isString ? null : file.username
              const createdAt = isString ? null : file.createdAt
              const fileSize = isString ? null : file.fileSize
              
              return (
                <tr key={audioUrl} className="hover:bg-purple-500/10 transition-colors">
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      {title && title !== '(Sin texto asociado)' ? (
                        <div className="font-medium text-white flex items-center">
                          <span className="mr-2">📝</span>
                          {title}
                        </div>
                      ) : null}
                      <div className={`text-purple-300 text-xs mt-1 flex items-center ${title && title !== '(Sin texto asociado)' ? '' : 'font-medium'}`}>
                        <span className="mr-2">🎵</span>
                        {filename}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-purple-200 flex items-center">
                      <span className="mr-2">👤</span>
                      {username && username !== '(Desconocido)' ? username : (
                        <span className="text-purple-400 italic">Sin usuario</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-purple-200">
                      {createdAt ? formatDate(createdAt) : (
                        <span className="text-purple-400 italic">N/A</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-purple-200">
                      {fileSize ? formatFileSize(fileSize) : (
                        <span className="text-purple-400 italic">N/A</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center space-x-4">
                      <a
                        href={`http://localhost:8080${audioUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 hover:text-blue-200 px-4 py-2 rounded-lg transition-colors flex items-center"
                      >
                        <span className="mr-2">▶️</span>
                        Escuchar
                      </a>
                      <button
                        onClick={() => handleDelete(file)}
                        disabled={deleting === audioUrl}
                        className="bg-red-500/20 hover:bg-red-500/30 text-red-300 hover:text-red-200 px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                      >
                        <span className="mr-2">🗑️</span>
                        {deleting === audioUrl ? 'Eliminando...' : 'Eliminar'}
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

