/**
 * Mensajes de error centralizados para el frontend (en español)
 * Facilita el mantenimiento y la consistencia de mensajes
 */

export const ErrorMessages = {
  // Errores de Registro
  USERNAME_REQUIRED: 'El nombre de usuario es obligatorio. Por favor, ingresa un nombre de usuario.',
  USERNAME_SIZE: 'El nombre de usuario debe tener entre 2 y 50 caracteres. Intenta con un nombre más corto o más largo.',
  USERNAME_TAKEN: (username) => `El nombre de usuario '${username}' ya está en uso. Por favor, elige otro nombre de usuario diferente.`,
  EMAIL_REQUIRED: 'El correo electrónico es obligatorio. Por favor, ingresa un correo (puede ser inventado).',
  EMAIL_INVALID: 'El formato del correo no es válido. Debe tener el formato: nombre@dominio.com (puede ser inventado).',
  EMAIL_TAKEN: (email) => `El correo '${email}' ya está registrado. Si este es tu correo, intenta iniciar sesión en lugar de registrarte.`,
  PASSWORD_REQUIRED: 'La contraseña es obligatoria. Por favor, ingresa una contraseña.',
  PASSWORD_MIN_LENGTH: 'La contraseña debe tener al menos 4 caracteres. Intenta con una contraseña más larga.',

  // Errores de Login
  INVALID_CREDENTIALS: 'Nombre de usuario o contraseña incorrectos. Verifica tus credenciales e intenta nuevamente.',
  USER_NOT_FOUND: 'Usuario no encontrado. Verifica tu nombre de usuario o regístrate si no tienes cuenta.',

  // Errores de Red
  NETWORK_ERROR: 'Error de conexión. Verifica que el servidor esté corriendo y tu conexión a internet.',
  SERVER_NOT_RESPONDING: 'El servidor no responde. Espera un momento e intenta nuevamente, o reinicia el servicio del backend.',
  CONNECTION_TIMEOUT: 'Tiempo de espera agotado. El servidor está tardando mucho en responder. Por favor, intenta nuevamente.',

  // Errores de TextEntry
  TITLE_REQUIRED: 'El título es obligatorio. Por favor, ingresa un título para tu texto.',
  TITLE_MAX_LENGTH: 'El título no debe exceder 200 caracteres. Por favor, acorta tu título.',
  CONTENT_REQUIRED: 'El contenido es obligatorio. Por favor, ingresa algún texto para convertir a voz.',
  TEXT_NOT_FOUND: 'Texto no encontrado. Puede que haya sido eliminado o no tengas permiso para acceder a él.',

  // Errores de TTS
  TTS_GENERATION_FAILED: 'Error al generar el audio. Verifica tu conexión a internet e intenta nuevamente.',
  TTS_EMPTY_RESPONSE: 'El servicio de texto a voz no devolvió audio. Intenta nuevamente con un texto más corto.',
  TTS_NETWORK_ERROR: 'Error de conexión al generar el audio. Verifica tu conexión a internet.',

  // Errores de Autenticación
  SESSION_EXPIRED: 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.',
  UNAUTHORIZED: 'No estás autorizado para realizar esta acción.',
  FORBIDDEN: 'Acceso denegado. No tienes permiso para acceder a este recurso.',

  // Errores Generales
  UNKNOWN_ERROR: 'Ocurrió un error inesperado. Por favor, intenta nuevamente más tarde o contacta al soporte.',
  VALIDATION_ERROR: 'Datos inválidos. Por favor, verifica todos los campos e intenta nuevamente.',
  INTERNAL_SERVER_ERROR: 'Error interno del servidor. Por favor, intenta nuevamente más tarde.',

  // Mensajes de Ayuda
  HELP_USERNAME: 'El nombre de usuario debe tener entre 2 y 50 caracteres. Puedes usar letras, números y guiones bajos.',
  HELP_EMAIL: 'Ingresa un correo electrónico con formato válido (ejemplo: usuario@ejemplo.com). Puede ser inventado.',
  HELP_PASSWORD: 'La contraseña debe tener al menos 4 caracteres. Puedes usar letras, números y símbolos.',
  HELP_TITLE: 'Ingresa un título descriptivo (máximo 200 caracteres) para tu texto.',
  HELP_CONTENT: 'Ingresa el texto que deseas convertir a voz. El texto puede ser tan largo como necesites.',
}

/**
 * Extrae el mensaje de error de una respuesta de error de axios
 */
export const extractErrorMessage = (error) => {
  if (!error.response) {
    // Error de red
    if (error.code === 'ECONNABORTED') {
      return ErrorMessages.CONNECTION_TIMEOUT
    }
    return ErrorMessages.NETWORK_ERROR
  }

  const data = error.response.data

  // Manejar errores de validación con múltiples campos
  if (data.errors && typeof data.errors === 'object') {
    const errorMessages = Object.values(data.errors)
    return errorMessages.join('. ')
  }

  // Mensaje directo del servidor
  if (data.message) {
    return data.message
  }

  // Mensaje de error genérico
  if (data.error) {
    return data.error
  }

  // Mensajes según código de estado HTTP
  switch (error.response.status) {
    case 400:
      return ErrorMessages.VALIDATION_ERROR
    case 401:
      return ErrorMessages.UNAUTHORIZED
    case 403:
      return ErrorMessages.FORBIDDEN
    case 404:
      return ErrorMessages.TEXT_NOT_FOUND
    case 409:
      return 'Este nombre de usuario o correo ya está en uso. Por favor, elige otros datos.'
    case 500:
      return ErrorMessages.INTERNAL_SERVER_ERROR
    default:
      return ErrorMessages.UNKNOWN_ERROR
  }
}
