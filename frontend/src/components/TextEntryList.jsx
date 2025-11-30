const TextEntryList = ({ texts, loading, onDelete, onPlay, onEdit }) => {
  if (loading) {
    return (
      <div className="bg-gradient-to-br from-purple-900/40 to-blue-900/40 backdrop-blur-md rounded-xl border border-purple-500/30 p-12 text-center shadow-2xl">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto mb-4"></div>
        <div className="text-purple-300 text-lg">Cargando textos...</div>
      </div>
    )
  }

  if (texts.length === 0) {
    return (
      <div className="bg-gradient-to-br from-purple-900/40 to-blue-900/40 backdrop-blur-md rounded-xl border border-purple-500/30 p-12 text-center shadow-2xl">
        <div className="text-6xl mb-4">📝</div>
        <h3 className="text-2xl font-bold text-white mb-2">No hay textos aún</h3>
        <p className="text-purple-200">Crea tu primer texto para comenzar</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {texts.map((text) => (
        <div
          key={text.id}
          className="bg-gradient-to-br from-purple-900/40 to-blue-900/40 backdrop-blur-md rounded-xl p-6 border border-purple-500/30 hover:border-pink-500/50 transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-white mb-2 flex items-center">
                <span className="mr-2">📄</span>
                {text.title}
              </h3>
              <p className="text-purple-200 mb-4 line-clamp-3">{text.content}</p>
              <div className="flex items-center space-x-4 text-sm text-purple-300">
                <span className="flex items-center">
                  <span className="mr-1">👤</span>
                  {text.username}
                </span>
                <span>•</span>
                <span className="flex items-center">
                  <span className="mr-1">📅</span>
                  {new Date(text.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-2 ml-4">
              {text.audioUrl && (
                <button
                  onClick={() => onPlay(text.audioUrl)}
                  className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white rounded-lg transition-all shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center space-x-2"
                >
                  <span>▶️</span>
                  <span>Reproducir</span>
                </button>
              )}
              {onEdit && (
                <button
                  onClick={() => onEdit(text)}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-lg transition-all shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center space-x-2"
                >
                  <span>✏️</span>
                  <span>Editar</span>
                </button>
              )}
              <button
                onClick={() => onDelete(text.id)}
                className="px-4 py-2 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500 text-white rounded-lg transition-all shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center space-x-2"
              >
                <span>🗑️</span>
                <span>Eliminar</span>
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default TextEntryList

