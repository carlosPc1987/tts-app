import { useState } from 'react'
import axios from 'axios'
import BackgroundMusic from './BackgroundMusic'

const TextEntryForm = ({ onTextCreated }) => {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [voice, setVoice] = useState('es-ES-ElviraNeural')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [selectedFile, setSelectedFile] = useState(null)
  const [uploadMode, setUploadMode] = useState('text')

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

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      let response
      
      if (uploadMode === 'file' && selectedFile) {
        const formData = new FormData()
        formData.append('file', selectedFile)
        if (title) {
          formData.append('title', title)
        }
        formData.append('voice', voice)

        response = await axios.post(
          '/api/texts/upload',
          formData,
          {
            withCredentials: true,
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
        )
      } else {
        if (!content.trim()) {
          setError('Por favor, ingresa texto o sube un archivo')
          setLoading(false)
          return
        }

        response = await axios.post(
          '/api/texts',
          { title, content, voice },
          { withCredentials: true }
        )
      }

      console.log('📤 Respuesta del servidor:', response)
      console.log('📤 Status:', response.status)
      console.log('📤 Data:', response.data)
      console.log('🎵 audioUrl en respuesta:', response.data?.audioUrl)
      console.log('📋 Datos completos:', JSON.stringify(response.data, null, 2))
      
      if (response.data) {
        // Verificar que audioUrl esté presente
        if (!response.data.audioUrl) {
          console.error('❌ ERROR: No hay audioUrl en la respuesta')
          console.error('Respuesta completa:', response.data)
          setError('Error: No se generó el audio. Por favor, intenta nuevamente.')
          setLoading(false)
          return
        }
        
        // Verificar que tenga ID (significa que se guardó)
        if (!response.data.id) {
          console.error('❌ ERROR: No hay ID en la respuesta (no se guardó)')
          setError('Error: No se guardó el texto. Por favor, intenta nuevamente.')
          setLoading(false)
          return
        }
        
        console.log('✅ Todo correcto, llamando onTextCreated')
        onTextCreated(response.data)
        setTitle('')
        setContent('')
        setSelectedFile(null)
        setError('')
      } else {
        console.error('❌ ERROR: No se recibió respuesta del servidor')
        setError('Error: No se recibió respuesta del servidor')
      }
    } catch (err) {
      console.error('❌ ERROR en handleSubmit:', err)
      console.error('Error response:', err.response)
      console.error('Error data:', err.response?.data)
      setError(err.response?.data?.message || err.message || 'Error al procesar el texto o archivo')
    } finally {
      setLoading(false)
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const allowedExtensions = ['.txt', '.pdf', '.doc', '.docx']
      const fileExtension = '.' + file.name.split('.').pop().toLowerCase()
      
      if (!allowedExtensions.includes(fileExtension)) {
        setError('Formato no soportado. Formatos permitidos: TXT, PDF, DOC, DOCX')
        setSelectedFile(null)
        return
      }

      if (file.size > 10 * 1024 * 1024) {
        setError('El archivo es demasiado grande. Tamaño máximo: 10MB')
        setSelectedFile(null)
        return
      }

      setSelectedFile(file)
      setError('')
      if (!title) {
        setTitle(file.name.replace(/\.[^/.]+$/, ''))
      }
    }
  }

  return (
    <div className="bg-gradient-to-br from-purple-900/50 via-blue-900/50 to-pink-900/50 backdrop-blur-md rounded-xl p-6 border border-purple-500/30 relative overflow-hidden shadow-2xl">
      <BackgroundMusic enabled={true} />
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-pink-500 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-blue-500 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '3s' }}></div>
      </div>
      <div className="relative z-10">
      <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent flex items-center">
        <span className="mr-3 text-4xl">✨</span>
        Crear Nueva Entrada de Texto
      </h2>
      
      <div className="flex space-x-2 mb-4 bg-gradient-to-r from-purple-800/30 to-blue-800/30 rounded-lg p-1 border border-purple-500/20">
        <button
          type="button"
          onClick={() => {
            setUploadMode('text')
            setSelectedFile(null)
            setError('')
          }}
          className={`flex-1 py-2 px-4 rounded-md font-medium transition-all flex items-center justify-center ${
            uploadMode === 'text'
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
              : 'text-purple-200 hover:text-white hover:bg-purple-500/20'
          }`}
        >
          <span className="mr-2">✍️</span>
          Escribir Texto
        </button>
        <button
          type="button"
          onClick={() => {
            setUploadMode('file')
            setContent('')
            setError('')
          }}
          className={`flex-1 py-2 px-4 rounded-md font-medium transition-all flex items-center justify-center ${
            uploadMode === 'file'
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
              : 'text-purple-200 hover:text-white hover:bg-purple-500/20'
          }`}
        >
          <span className="mr-2">📁</span>
          Subir Archivo
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            maxLength={200}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Enter title..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Voice
          </label>
          <select
            value={voice}
            onChange={(e) => setVoice(e.target.value)}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            {voices.map((v) => (
              <option key={v.value} value={v.value}>
                {v.label}
              </option>
            ))}
          </select>
        </div>

        {uploadMode === 'text' ? (
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Contenido
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required={uploadMode === 'text'}
              rows={10}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
              placeholder="Ingresa tu texto aquí..."
            />
          </div>
        ) : (
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Archivo (TXT, PDF, DOC, DOCX)
            </label>
            <div className="border-2 border-dashed border-gray-700 rounded-lg p-6 text-center hover:border-primary-500 transition-colors">
              <input
                type="file"
                id="file-upload"
                onChange={handleFileChange}
                accept=".txt,.pdf,.doc,.docx"
                className="hidden"
                required={uploadMode === 'file'}
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer flex flex-col items-center"
              >
                <svg className="w-12 h-12 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <span className="text-gray-400">
                  {selectedFile ? selectedFile.name : 'Haz clic para seleccionar un archivo'}
                </span>
                <span className="text-xs text-gray-500 mt-1">
                  Formatos: TXT, PDF, DOC, DOCX (máx. 10MB)
                </span>
              </label>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-400 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading || (uploadMode === 'file' && !selectedFile) || (uploadMode === 'text' && !content.trim())}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold py-4 px-6 rounded-lg transition-all shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
        >
          {loading ? (
            <>
              <span className="animate-spin mr-2">⏳</span>
              Procesando...
            </>
          ) : (
            <>
              <span className="mr-2">🎵</span>
              Reproducir y Guardar
            </>
          )}
        </button>
      </form>
      </div>
    </div>
  )
}

export default TextEntryForm

