# Guía de Errores y Soluciones - TTS App

## 🔴 Errores de Registro

### 1. Username ya existe
**Mensaje de error:**
```
Username 'nombre_usuario' is already taken
```

**Qué significa:**
- El nombre de usuario que intentas usar ya está registrado en el sistema.

**Solución:**
- Elige un nombre de usuario diferente.
- Intenta con variaciones: añade números, guiones o caracteres especiales.
- Ejemplo: Si "juan" existe, prueba "juan123" o "juan_2024".

---

### 2. Email ya existe
**Mensaje de error:**
```
Email 'correo@ejemplo.com' is already registered
```

**Qué significa:**
- El correo electrónico que intentas usar ya está registrado.

**Solución:**
- Usa un correo electrónico diferente.
- Si es tu correo, intenta hacer login en lugar de registro.
- Verifica que no hayas olvidado tu contraseña.

---

### 3. Validación de campos
**Mensajes de error posibles:**
```
Username is required
Username must be between 3 and 50 characters
Email is required
Email must be valid
Password is required
Password must be at least 6 characters
```

**Qué significa:**
- Algún campo no cumple con los requisitos de validación.

**Solución:**
- **Username:** Debe tener entre 3 y 50 caracteres.
- **Email:** Debe ser un formato de email válido (ejemplo@dominio.com).
- **Password:** Debe tener al menos 6 caracteres.

---

### 4. Error de red durante registro
**Mensaje de error:**
```
Network error. Please check if the server is running.
```

**Qué significa:**
- No se puede conectar con el servidor backend.

**Solución:**
1. Verifica que el backend esté corriendo (puerto 8080).
2. Revisa la ventana de PowerShell del backend.
3. Espera unos segundos si el backend está iniciando.
4. Verifica tu conexión a internet.
5. Si el problema persiste, reinicia el backend.

---

## 🔴 Errores de Login

### 1. Credenciales incorrectas
**Mensaje de error:**
```
Invalid username or password
```

**Qué significa:**
- El username o la contraseña no son correctos.

**Solución:**
- Verifica que escribiste correctamente el username (sin espacios).
- Verifica que escribiste correctamente la contraseña (mayúsculas/minúsculas importan).
- Si olvidaste tu contraseña, necesitas crear una nueva cuenta o contactar al administrador.
- Asegúrate de estar en la pestaña "Login" y no en "Register".

---

### 2. Usuario no encontrado
**Mensaje de error:**
```
User not found: nombre_usuario
```

**Qué significa:**
- El usuario no existe en el sistema.

**Solución:**
- Verifica que el username sea correcto.
- Si no tienes cuenta, ve a la pestaña "Register" y crea una nueva cuenta.

---

### 3. Error de red durante login
**Mensaje de error:**
```
Network error. Please check if the server is running.
```

**Solución:**
- Misma solución que en el error de registro (ver arriba).

---

## 🔴 Errores al Crear Texto/Audio

### 1. Título requerido
**Mensaje de error:**
```
Title is required
```

**Solución:**
- Ingresa un título para tu texto antes de guardar.

---

### 2. Contenido requerido
**Mensaje de error:**
```
Content is required
```

**Solución:**
- Escribe algún texto en el campo de contenido antes de generar el audio.

---

### 3. Título muy largo
**Mensaje de error:**
```
Title must not exceed 200 characters
```

**Solución:**
- Acorta el título a menos de 200 caracteres.

---

### 4. Error al generar audio
**Mensaje de error:**
```
Failed to generate audio: [mensaje específico]
Empty audio response from TTS service
```

**Qué significa:**
- El servicio de Text-to-Speech no pudo generar el audio.

**Solución:**
1. Verifica tu conexión a internet (el servicio TTS requiere internet).
2. Intenta con un texto más corto.
3. Espera unos segundos y vuelve a intentar.
4. Verifica que el servicio de Microsoft Edge TTS esté disponible.
5. Si el problema persiste, contacta al administrador.

---

### 5. Error al guardar audio
**Mensaje de error:**
```
Failed to save audio file
```

**Solución:**
1. Verifica que el servidor tenga permisos de escritura.
2. Reinicia el backend.
3. Contacta al administrador si el problema persiste.

---

## 🔴 Errores de Autenticación

### 1. Sesión expirada
**Mensaje de error:**
```
User not found
```

**Qué significa:**
- Tu sesión ha expirado o el token JWT no es válido.

**Solución:**
1. Cierra sesión y vuelve a iniciar sesión.
2. Si el problema persiste, limpia las cookies del navegador.
3. Reinicia el navegador.

---

### 2. No autorizado para esta acción
**Mensaje de error:**
```
Access Denied
Forbidden
```

**Qué significa:**
- No tienes permisos para realizar esta acción.

**Solución:**
- Si intentas acceder al panel de administración, necesitas ser usuario ADMIN.
- Contacta al administrador para obtener permisos de administrador.

---

## 🔴 Errores al Eliminar Textos

### 1. Texto no encontrado
**Mensaje de error:**
```
Text entry not found
```

**Qué significa:**
- El texto que intentas eliminar no existe o ya fue eliminado.

**Solución:**
- Recarga la página para ver la lista actualizada.
- Verifica que estés intentando eliminar tu propio texto (a menos que seas ADMIN).

---

### 2. No puedes eliminar este texto
**Mensaje de error:**
```
Text entry not found
```

**Qué significa:**
- Solo puedes eliminar tus propios textos (a menos que seas ADMIN).

**Solución:**
- Si necesitas eliminar un texto de otro usuario, necesitas ser ADMIN.
- Contacta al administrador si es necesario.

---

## 🔴 Errores del Sistema

### 1. Error interno del servidor
**Mensaje de error:**
```
Internal Server Error
An unexpected error occurred
```

**Qué significa:**
- Ocurrió un error inesperado en el servidor.

**Solución:**
1. Espera unos segundos y vuelve a intentar.
2. Recarga la página.
3. Si el problema persiste, reinicia el backend.
4. Contacta al administrador con los detalles del error.

---

### 2. Servicio no disponible
**Mensaje de error:**
```
Network error. Please check if the server is running.
```

**Solución:**
1. Verifica que el backend esté corriendo:
   - Busca la ventana de PowerShell con "SPRING BOOT BACKEND"
   - Debe mostrar "Started TtsApplication"
2. Verifica que el frontend esté corriendo:
   - Busca la ventana de PowerShell con "REACT FRONTEND"
   - Debe mostrar "Local: http://localhost:5173"
3. Reinicia ambos servicios si es necesario.

---

## 🔴 Errores de Carga de Página

### 1. Página no carga
**Síntomas:**
- La página muestra "Loading..." indefinidamente.
- La página está en blanco.

**Solución:**
1. Verifica que el frontend esté corriendo (puerto 5173).
2. Verifica que el backend esté corriendo (puerto 8080).
3. Abre la consola del navegador (F12) y revisa errores.
4. Limpia la caché del navegador (Ctrl+Shift+Delete).
5. Intenta en modo incógnito.
6. Reinicia ambos servicios.

---

### 2. Error 404 en recursos
**Síntomas:**
- Algunas imágenes o recursos no cargan.
- Errores 404 en la consola del navegador.

**Solución:**
1. Verifica que todos los archivos del frontend estén presentes.
2. Reinicia el frontend.
3. Limpia la caché del navegador.

---

## 📋 Checklist de Solución de Problemas

### Si el registro no funciona:
- [ ] Verifica que todos los campos estén completos
- [ ] Verifica que el username tenga entre 3-50 caracteres
- [ ] Verifica que el email sea válido
- [ ] Verifica que la contraseña tenga al menos 6 caracteres
- [ ] Verifica que el username/email no estén ya registrados
- [ ] Verifica que el backend esté corriendo
- [ ] Revisa la consola del navegador (F12) para más detalles

### Si el login no funciona:
- [ ] Verifica que el username sea correcto
- [ ] Verifica que la contraseña sea correcta (mayúsculas/minúsculas)
- [ ] Verifica que estés en la pestaña "Login"
- [ ] Verifica que el backend esté corriendo
- [ ] Intenta crear una nueva cuenta si olvidaste tus credenciales

### Si no se genera audio:
- [ ] Verifica tu conexión a internet
- [ ] Verifica que hayas escrito texto en el campo de contenido
- [ ] Intenta con un texto más corto
- [ ] Espera unos segundos y vuelve a intentar
- [ ] Verifica que el backend esté corriendo correctamente

### Si nada funciona:
- [ ] Reinicia el backend (Ctrl+C y luego mvn spring-boot:run)
- [ ] Reinicia el frontend (Ctrl+C y luego npm run dev)
- [ ] Limpia la caché del navegador
- [ ] Reinicia el navegador
- [ ] Verifica que los puertos 8080 y 5173 no estén ocupados por otros programas

---

## 🆘 Contacto

Si después de seguir todas estas soluciones el problema persiste, contacta al administrador del sistema con:
- El mensaje de error exacto
- Los pasos que seguiste antes del error
- Captura de pantalla si es posible
- Información del navegador y sistema operativo

