import { useState, useEffect } from 'react'
import axios from 'axios'

const EditTextModal = ({ text, isOpen, onClose, onUpdate }) => {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [voice, setVoice] = useState('es-ES-ElviraNeural')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const voices = [
    { value: 'es-ES-ElviraNeural', label: 'Español - Elvira (Femenino)' },
    { value: 'es-ES-AlvaroNeural', label: 'Español - Álvaro (Masculino)' },
    { value: 'es-ES-NuriaNeural', label: 'Español - Nuria (Femenino)' },
    { value: 'es-ES-TrianaNeural', label: 'Español - Triana (Femenino)' },
    { value: 'en-US-AriaNeural', label: 'Inglés - Aria (Femenino)' },
    { value: 'en-US-DavisNeural', label: 'Inglés - Davis (Masculino)' },
    { value: 'en-US-GuyNeural', label: 'Inglés - Guy (Masculino)' },
    { value: 'en-US-JennyNeural', label: 'Inglés - Jenny (Femenino)' },
  ]

  useEffect(() => {
    if (text && isOpen) {
      setTitle(text.title || '')
      setContent(text.content || '')
      setVoice('es-ES-ElviraNeural') // Por defecto, se regenerará el audio
      setError('')
    }
  }, [text, isOpen])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      console.log('📝 Editando texto ID:', text.id)
      console.log('📝 Datos a enviar:', { title, content, voice })
      
      const requestData = { title, content, voice }
      console.log('📤 Enviando PUT request a:', `/api/texts/${text.id}`)
      console.log('📤 Request data:', JSON.stringify(requestData, null, 2))
      
      const response = await axios.put(
        `/api/texts/${text.id}`,
        requestData,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )

      console.log('✅ Respuesta recibida:', response)
      console.log('✅ Status:', response.status)
      console.log('✅ Data:', response.data)
      
      if (response.data) {
        onUpdate(response.data)
        onClose()
      } else {
        setError('Error: No se recibió respuesta del servidor')
      }
    } catch (err) {
      console.error('❌ Error al actualizar texto:', err)
      console.error('❌ Error response:', err.response)
      console.error('❌ Error status:', err.response?.status)
      console.error('❌ Error data:', err.response?.data)
      console.error('❌ Error message:', err.message)
      
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.error || 
                          err.message || 
                          'Error al actualizar el texto'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-purple-900/95 to-blue-900/95 backdrop-blur-md rounded-xl border border-purple-500/30 shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center">
              <span className="mr-3">✏️</span>
              Editar Texto
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Título
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                maxLength={200}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Ingresa un título..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Voz (se regenerará el audio)
              </label>
              <select
                value={voice}
                onChange={(e) => setVoice(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                {voices.map((v) => (
                  <option key={v.value} value={v.value}>
                    {v.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Contenido
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                rows={10}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                placeholder="Ingresa tu texto aquí..."
              />
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500 text-red-400 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div className="flex space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold rounded-lg transition-all shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? (
                  <>
                    <span className="animate-spin mr-2">⏳</span>
                    Guardando...
                  </>
                ) : (
                  <>
                    <span className="mr-2">💾</span>
                    Guardar Cambios
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default EditTextModal

