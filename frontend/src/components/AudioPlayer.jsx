import { useState, useEffect, useRef } from 'react'

const AudioPlayer = ({ audioUrl, onClose }) => {
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)
  const audioRef = useRef(null)

  const fullUrl = audioUrl.startsWith('http') 
    ? audioUrl 
    : `http://localhost:8080${audioUrl}`

  useEffect(() => {
    setLoading(true)
    setError(null)
    
    const audio = audioRef.current
    if (!audio) return

    const handleCanPlay = () => {
      setLoading(false)
      setError(null)
      console.log('Audio cargado correctamente:', fullUrl)
    }

    const handleError = (e) => {
      setLoading(false)
      const errorMsg = audio.error 
        ? `Error ${audio.error.code}: ${getAudioErrorMessage(audio.error.code)}`
        : 'Error al cargar el audio'
      setError(errorMsg)
      console.error('Error en audio:', audio.error, fullUrl)
    }

    const handleLoadStart = () => {
      setLoading(true)
      console.log('Cargando audio:', fullUrl)
    }

    audio.addEventListener('canplay', handleCanPlay)
    audio.addEventListener('error', handleError)
    audio.addEventListener('loadstart', handleLoadStart)

    // Intentar cargar el audio
    audio.load()

    return () => {
      audio.removeEventListener('canplay', handleCanPlay)
      audio.removeEventListener('error', handleError)
      audio.removeEventListener('loadstart', handleLoadStart)
    }
  }, [fullUrl])

  const getAudioErrorMessage = (code) => {
    switch (code) {
      case 1: return 'MEDIA_ERR_ABORTED - El usuario canceló la carga'
      case 2: return 'MEDIA_ERR_NETWORK - Error de red'
      case 3: return 'MEDIA_ERR_DECODE - Error al decodificar el audio'
      case 4: return 'MEDIA_ERR_SRC_NOT_SUPPORTED - Formato no soportado'
      default: return 'Error desconocido'
    }
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900/90 backdrop-blur-md border-t border-gray-800/50 p-4 z-50 shadow-2xl">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4 flex-1">
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div className="flex-1 max-w-2xl">
            {loading && (
              <div className="text-yellow-400 text-sm mb-2">
                Cargando audio...
              </div>
            )}
            {error && (
              <div className="text-red-400 text-sm mb-2">
                {error}
                <br />
                <span className="text-xs text-gray-500">URL: {fullUrl}</span>
              </div>
            )}
            <audio
              ref={audioRef}
              controls
              autoPlay
              className="w-full"
              src={fullUrl}
              preload="auto"
            >
              Tu navegador no soporta el elemento de audio.
            </audio>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AudioPlayer

