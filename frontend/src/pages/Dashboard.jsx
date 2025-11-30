import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'
import TextEntryForm from '../components/TextEntryForm'
import TextEntryList from '../components/TextEntryList'
import AdminPanel from '../components/AdminPanel'
import UserManagement from '../components/UserManagement'
import FileManagement from '../components/FileManagement'
import AudioPlayer from '../components/AudioPlayer'
import BackgroundImage from '../components/BackgroundImage'
import EditTextModal from '../components/EditTextModal'

const Dashboard = () => {
  const { user, logout } = useAuth()
  const [texts, setTexts] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('create')
  const [adminSubTab, setAdminSubTab] = useState('texts')
  const [currentAudio, setCurrentAudio] = useState(null)
  const [adminTexts, setAdminTexts] = useState([])
  const [adminLoading, setAdminLoading] = useState(false)
  const [editingText, setEditingText] = useState(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  // Verificación ULTRA SIMPLE del rol de admin
  // Múltiples formas de verificar para asegurar que funcione
  const isAdmin = user && (
    // Verificación 1: Por rol
    (user.role && String(user.role).toUpperCase() === 'ADMIN') ||
    // Verificación 2: Por username (fallback)
    (user.username && String(user.username).toLowerCase() === 'admin') ||
    // Verificación 3: Por email (fallback)
    (user.email && String(user.email).toLowerCase().includes('admin'))
  )
  
  // Debug inmediato y detallado
  console.log('🔍 Dashboard - isAdmin check COMPLETO:', {
    hasUser: !!user,
    username: user?.username,
    email: user?.email,
    role: user?.role,
    roleString: user?.role ? String(user.role) : 'null',
    roleUpper: user?.role ? String(user.role).toUpperCase() : 'null',
    checkByRole: user?.role && String(user.role).toUpperCase() === 'ADMIN',
    checkByUsername: user?.username && String(user?.username).toLowerCase() === 'admin',
    checkByEmail: user?.email && String(user?.email).toLowerCase().includes('admin'),
    isAdmin: isAdmin,
    userObject: JSON.stringify(user, null, 2)
  })
  
  // Debug siempre visible - FORZAR LOGS
  useEffect(() => {
    if (user) {
      const roleUpper = user.role?.toString().toUpperCase()
      const calculatedIsAdmin = roleUpper === 'ADMIN' || roleUpper === 'ROLE_ADMIN'
      
      console.log('=== DEBUG ADMIN ACCESS ===')
      console.log('Usuario completo:', JSON.stringify(user, null, 2))
      console.log('user.role (raw):', user.role)
      console.log('user.role (string):', String(user.role))
      console.log('user.role (upper):', roleUpper)
      console.log('Tipo de user.role:', typeof user.role)
      console.log('isAdmin calculado:', calculatedIsAdmin)
      console.log('Condición ADMIN:', roleUpper === 'ADMIN')
      console.log('Condición ROLE_ADMIN:', roleUpper === 'ROLE_ADMIN')
      console.log('=========================')
      
      // Si el rol es ADMIN pero isAdmin es false, forzar
      if (roleUpper === 'ADMIN' && !calculatedIsAdmin) {
        console.error('⚠️ ERROR: Rol es ADMIN pero isAdmin es false!')
      }
    } else {
      console.log('⚠️ No hay usuario en Dashboard')
    }
  }, [user])
  
  useEffect(() => {
    if (!user) {
      return
    }
    
    // Si intenta acceder a admin sin ser admin, redirigir
    if (activeTab === 'admin' && !isAdmin) {
      console.warn('⚠️ Usuario no es admin, redirigiendo a create')
      console.warn('Rol actual:', user.role)
      console.warn('isAdmin:', isAdmin)
      setActiveTab('create')
    } else if (activeTab === 'admin' && isAdmin) {
      console.log('✅ Acceso a admin permitido - mostrando panel')
    }
  }, [user, isAdmin, activeTab])
  
  // Log cuando cambia activeTab
  useEffect(() => {
    console.log('🔄 activeTab cambió a:', activeTab)
    if (activeTab === 'admin') {
      console.log('   isAdmin:', isAdmin)
      console.log('   user.role:', user?.role)
    }
  }, [activeTab, isAdmin, user])

  useEffect(() => {
    fetchTexts()
  }, [])

  useEffect(() => {
    // Cargar datos cuando cambia la pestaña
    if (activeTab === 'my-texts') {
      fetchTexts()
    }
    if (activeTab === 'admin' && isAdmin) {
      if (adminSubTab === 'texts') {
        fetchAdminTexts()
      }
    }
  }, [activeTab, adminSubTab, isAdmin])

  const fetchTexts = async () => {
    try {
      setLoading(true)
      const response = await axios.get('/api/texts', { withCredentials: true })
      setTexts(response.data)
    } catch (error) {
      console.error('Error fetching texts:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchAdminTexts = async () => {
    try {
      setAdminLoading(true)
      const response = await axios.get('/admin/texts', { withCredentials: true })
      setAdminTexts(response.data || [])
    } catch (error) {
      console.error('Error fetching admin texts:', error)
      if (error.response?.status === 403 || error.response?.status === 401) {
        console.warn('No tienes permisos de administrador')
      }
      setAdminTexts([])
    } finally {
      setAdminLoading(false)
    }
  }

  const handleTextCreated = (newText) => {
    console.log('📝 Texto creado:', newText)
    console.log('🎵 audioUrl:', newText.audioUrl)
    setTexts([newText, ...texts])
    if (newText.audioUrl) {
      console.log('✅ Reproduciendo audio:', newText.audioUrl)
      setCurrentAudio(newText.audioUrl)
    } else {
      console.warn('⚠️ No hay audioUrl en la respuesta')
    }
  }

  const handleEdit = (text) => {
    console.log('✏️ Editando texto:', text)
    setEditingText(text)
    setIsEditModalOpen(true)
  }

  const handleTextUpdated = (updatedText) => {
    console.log('✅ Texto actualizado:', updatedText)
    setTexts(texts.map(t => t.id === updatedText.id ? updatedText : t))
    setIsEditModalOpen(false)
    setEditingText(null)
    if (updatedText.audioUrl) {
      setCurrentAudio(updatedText.audioUrl)
    }
    // Recargar textos para asegurar que estén actualizados
    fetchTexts()
  }

  const handleDelete = async (id) => {
    try {
      const endpoint = activeTab === 'admin' && adminSubTab === 'texts' 
        ? `/admin/texts/${id}` 
        : `/api/texts/${id}`
      await axios.delete(endpoint, { withCredentials: true })
      setTexts(texts.filter((t) => t.id !== id))
      if (activeTab === 'admin' && adminSubTab === 'texts') {
        fetchAdminTexts()
      }
    } catch (error) {
      console.error('Error deleting text:', error)
      if (error.response?.status === 403 || error.response?.status === 401) {
        alert('No tienes permisos para realizar esta acción')
      } else {
        alert('Error al eliminar el texto. Por favor, intenta nuevamente.')
      }
    }
  }

  const handlePlay = (audioUrl) => {
    setCurrentAudio(audioUrl)
  }

  return (
    <div className="min-h-screen text-white relative">
      <BackgroundImage />
      <header className="bg-gradient-to-r from-purple-900/90 via-blue-900/90 to-pink-900/90 backdrop-blur-md border-b border-purple-500/30 sticky top-0 z-50 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent flex items-center">
                <span className="mr-3 text-4xl">🎙️</span>
                TTS App
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-purple-200 font-medium">
                👤 {user?.username}
                {isAdmin && (
                  <span className="ml-2 px-3 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs rounded-full font-bold shadow-lg">
                    ⭐ ADMIN
                  </span>
                )}
              </span>
              <button
                onClick={logout}
                className="px-4 py-2 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500 text-white rounded-lg transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                🚪 Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <div className="flex space-x-2 mb-6 border-b border-purple-500/30 pb-2">
          <button
            onClick={() => {
              console.log('Clic en Crear')
              setActiveTab('create')
            }}
            className={`px-6 py-3 font-medium transition-all duration-200 rounded-t-lg flex items-center ${
              activeTab === 'create'
                ? 'text-white border-b-2 border-purple-400 bg-gradient-to-r from-purple-500/30 to-pink-500/30'
                : 'text-purple-300 hover:text-white hover:bg-purple-500/10'
            }`}
          >
            <span className="mr-2">✨</span>
            Crear
          </button>
          <button
            onClick={() => {
              console.log('Clic en Mis Textos')
              setActiveTab('my-texts')
            }}
            className={`px-6 py-3 font-medium transition-all duration-200 rounded-t-lg flex items-center ${
              activeTab === 'my-texts'
                ? 'text-white border-b-2 border-purple-400 bg-gradient-to-r from-purple-500/30 to-pink-500/30'
                : 'text-purple-300 hover:text-white hover:bg-purple-500/10'
            }`}
          >
            <span className="mr-2">📚</span>
            Mis Textos
          </button>
          <button
            onClick={() => {
              console.log('=== CLIC EN ADMINISTRACIÓN ===')
              console.log('isAdmin (calculado):', isAdmin)
              console.log('user completo:', JSON.stringify(user, null, 2))
              console.log('user.role:', user?.role)
              console.log('user.username:', user?.username)
              console.log('activeTab antes:', activeTab)
              
              // Verificación DIRECTA y MÚLTIPLE del rol
              const roleUpper = user?.role ? String(user?.role).toUpperCase() : ''
              const usernameLower = user?.username ? String(user?.username).toLowerCase() : ''
              const isAdminByRole = roleUpper === 'ADMIN'
              const isAdminByUsername = usernameLower === 'admin'
              const isAdminDirect = isAdminByRole || isAdminByUsername
              
              console.log('Verificación directa:')
              console.log('  - roleUpper:', roleUpper)
              console.log('  - usernameLower:', usernameLower)
              console.log('  - isAdminByRole:', isAdminByRole)
              console.log('  - isAdminByUsername:', isAdminByUsername)
              console.log('  - isAdminDirect:', isAdminDirect)
              
              if (isAdminDirect) {
                console.log('✅ Es admin, cambiando a tab admin')
                setActiveTab('admin')
                // Forzar renderizado inmediato
                setTimeout(() => {
                  console.log('activeTab después del cambio:', 'admin')
                  console.log('Verificando que el tab cambió...')
                }, 100)
              } else {
                console.warn('❌ No es admin, no se puede acceder')
                console.warn('Datos del usuario:', {
                  role: user?.role,
                  username: user?.username,
                  email: user?.email
                })
                alert(`No tienes permisos de administrador.\n\nDatos del usuario:\n- Rol: ${user?.role || 'No definido'}\n- Usuario: ${user?.username || 'No definido'}\n- Email: ${user?.email || 'No definido'}\n\nNecesitas ser ADMIN para acceder a esta sección.`)
              }
              console.log('=============================')
            }}
            className={`px-6 py-3 font-medium transition-all duration-200 rounded-t-lg flex items-center ${
              activeTab === 'admin'
                ? 'text-white border-b-2 border-purple-400 bg-gradient-to-r from-purple-500/30 to-pink-500/30'
                : isAdmin 
                  ? 'text-purple-300 hover:text-white hover:bg-purple-500/10'
                  : 'text-gray-500 cursor-not-allowed opacity-50'
            }`}
            title={!isAdmin ? `No eres admin. Rol: ${user?.role || 'No definido'}, Usuario: ${user?.username || 'No definido'}` : 'Panel de Administración'}
          >
            <span className="mr-2">⚙️</span>
            Administración
            {!isAdmin && <span className="ml-2 text-xs">(No disponible)</span>}
          </button>
        </div>

        <div className="transition-all duration-300 min-h-[400px]">
          {activeTab === 'create' && (
            <div className="animate-fadeIn">
              <TextEntryForm onTextCreated={handleTextCreated} />
            </div>
          )}

              {activeTab === 'my-texts' && (
                <div className="animate-fadeIn">
                  {loading ? (
                    <div className="text-center py-12">
                      <div className="text-gray-400">Cargando textos...</div>
                    </div>
                  ) : (
                    <TextEntryList
                      texts={texts}
                      loading={loading}
                      onDelete={handleDelete}
                      onPlay={handlePlay}
                      onEdit={handleEdit}
                    />
                  )}
                </div>
              )}

          {activeTab === 'admin' && (
            <div className="animate-fadeIn">
              {(() => {
                // Verificación FINAL antes de renderizar
                const roleUpper = user?.role ? String(user?.role).toUpperCase() : ''
                const usernameLower = user?.username ? String(user?.username).toLowerCase() : ''
                const isAdminFinal = roleUpper === 'ADMIN' || usernameLower === 'admin'
                
                console.log('🔄 Renderizando panel admin:')
                console.log('  - isAdmin (calculado):', isAdmin)
                console.log('  - isAdminFinal (verificación final):', isAdminFinal)
                console.log('  - user.role:', user?.role)
                console.log('  - user.username:', user?.username)
                console.log('  - roleUpper:', roleUpper)
                console.log('  - usernameLower:', usernameLower)
                
                if (!isAdminFinal) {
                  console.warn('⚠️ Acceso denegado - no es admin')
                  return (
                    <div className="bg-gradient-to-br from-red-900/40 to-orange-900/40 backdrop-blur-md rounded-xl border border-red-500/30 p-12 text-center shadow-2xl">
                      <div className="text-6xl mb-4">🚫</div>
                      <h3 className="text-2xl font-bold text-white mb-2">Acceso Denegado</h3>
                      <p className="text-red-200">No tienes permisos de administrador</p>
                      <p className="text-red-300 text-sm mt-2">Rol: {user?.role || 'No definido'}</p>
                      <p className="text-red-300 text-sm">Usuario: {user?.username || 'No definido'}</p>
                      <p className="text-red-400 text-xs mt-4">isAdmin: {String(isAdmin)}</p>
                      <p className="text-red-400 text-xs">isAdminFinal: {String(isAdminFinal)}</p>
                    </div>
                  )
                }
                
                console.log('✅ Acceso permitido - mostrando panel admin')
                return (
                  <>
                    <div className="flex space-x-2 mb-6 border-b border-purple-500/30 pb-2">
                      <button
                        onClick={() => {
                          console.log('Clic en sub-tab: texts')
                          setAdminSubTab('texts')
                        }}
                        className={`px-6 py-3 font-medium transition-all duration-200 rounded-t-lg flex items-center ${
                          adminSubTab === 'texts'
                            ? 'text-white border-b-2 border-purple-400 bg-purple-500/20'
                            : 'text-purple-300 hover:text-white hover:bg-purple-500/10'
                        }`}
                      >
                        <span className="mr-2">📋</span>
                        Textos
                      </button>
                      <button
                        onClick={() => {
                          console.log('Clic en sub-tab: users')
                          setAdminSubTab('users')
                        }}
                        className={`px-6 py-3 font-medium transition-all duration-200 rounded-t-lg flex items-center ${
                          adminSubTab === 'users'
                            ? 'text-white border-b-2 border-purple-400 bg-purple-500/20'
                            : 'text-purple-300 hover:text-white hover:bg-purple-500/10'
                        }`}
                      >
                        <span className="mr-2">👥</span>
                        Usuarios
                      </button>
                      <button
                        onClick={() => {
                          console.log('Clic en sub-tab: files')
                          setAdminSubTab('files')
                        }}
                        className={`px-6 py-3 font-medium transition-all duration-200 rounded-t-lg flex items-center ${
                          adminSubTab === 'files'
                            ? 'text-white border-b-2 border-purple-400 bg-purple-500/20'
                            : 'text-purple-300 hover:text-white hover:bg-purple-500/10'
                        }`}
                      >
                        <span className="mr-2">📁</span>
                        Archivos
                      </button>
                    </div>

                    <div className="min-h-[300px]">
                      {adminSubTab === 'texts' && (
                        <div className="animate-fadeIn">
                          <AdminPanel onDelete={async (id) => {
                            await handleDelete(id)
                            fetchAdminTexts()
                          }} />
                        </div>
                      )}

                      {adminSubTab === 'users' && (
                        <div className="animate-fadeIn">
                          <UserManagement onUserDeleted={() => {}} />
                        </div>
                      )}

                      {adminSubTab === 'files' && (
                        <div className="animate-fadeIn">
                          <FileManagement onFileDeleted={() => {}} />
                        </div>
                      )}
                    </div>
                  </>
                )
              })()}
            </div>
          )}
        </div>

            {currentAudio && (
              <AudioPlayer
                audioUrl={currentAudio}
                onClose={() => {
                  console.log('🔇 Cerrando reproductor')
                  setCurrentAudio(null)
                }}
              />
            )}

            {isEditModalOpen && editingText && (
              <EditTextModal
                text={editingText}
                isOpen={isEditModalOpen}
                onClose={() => {
                  setIsEditModalOpen(false)
                  setEditingText(null)
                }}
                onUpdate={handleTextUpdated}
              />
            )}
          </div>
        </div>
      )
    }

export default Dashboard

