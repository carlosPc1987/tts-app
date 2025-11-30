# 📋 Referencia Rápida de Errores - TTS App

## 🔴 REGISTRO

| Error | Mensaje | Solución |
|-------|---------|----------|
| Username ya existe | `Username 'xxx' is already taken` | Elige otro username |
| Email ya existe | `Email 'xxx' is already registered` | Usa otro email o haz login |
| Username muy corto | `Username must be between 3 and 50 characters` | Usa 3-50 caracteres |
| Email inválido | `Email must be valid` | Formato: user@domain.com |
| Password muy corta | `Password must be at least 6 characters` | Mínimo 6 caracteres |
| Campo vacío | `[Campo] is required` | Completa todos los campos |

---

## 🔴 LOGIN

| Error | Mensaje | Solución |
|-------|---------|----------|
| Credenciales incorrectas | `Invalid username or password` | Verifica username y password |
| Usuario no existe | `User not found: xxx` | Verifica username o regístrate |
| Campo vacío | `Username/Password is required` | Completa ambos campos |

---

## 🔴 CREAR TEXTO/AUDIO

| Error | Mensaje | Solución |
|-------|---------|----------|
| Título vacío | `Title is required` | Ingresa un título |
| Contenido vacío | `Content is required` | Escribe algún texto |
| Título muy largo | `Title must not exceed 200 characters` | Acorta el título |
| Error generando audio | `Failed to generate audio` | Verifica internet, intenta de nuevo |
| Audio vacío | `Empty audio response` | Texto muy largo, acórtalo |
| Error de red TTS | `Network error while generating audio` | Verifica conexión a internet |

---

## 🔴 AUTENTICACIÓN

| Error | Mensaje | Solución |
|-------|---------|----------|
| Sesión expirada | `Your session has expired` | Vuelve a hacer login |
| No autorizado | `You are not authorized` | No tienes permisos |
| Acceso denegado | `Access denied` | Solo ADMIN puede hacer esto |

---

## 🔴 ELIMINAR TEXTOS

| Error | Mensaje | Solución |
|-------|---------|----------|
| Texto no encontrado | `Text entry not found` | Ya fue eliminado o no tienes acceso |
| No puedes eliminar | `You can only delete your own texts` | Solo puedes eliminar tus textos |

---

## 🔴 RED/SERVIDOR

| Error | Mensaje | Solución |
|-------|---------|----------|
| Error de red | `Network error. Check if server is running` | Verifica que backend esté corriendo |
| Servidor no responde | `Server is not responding` | Reinicia el backend |
| Timeout | `Connection timeout` | El servidor tarda mucho, intenta de nuevo |
| Error interno | `Internal Server Error` | Reinicia backend, contacta soporte |

---

## ✅ CHECKLIST RÁPIDO

### Si el registro falla:
- [ ] Username: 3-50 caracteres, único
- [ ] Email: formato válido, único
- [ ] Password: mínimo 6 caracteres
- [ ] Backend corriendo (puerto 8080)

### Si el login falla:
- [ ] Username correcto (sin espacios)
- [ ] Password correcta (mayúsculas/minúsculas)
- [ ] Backend corriendo

### Si no se genera audio:
- [ ] Conexión a internet activa
- [ ] Texto escrito en el campo contenido
- [ ] Backend corriendo
- [ ] Intenta con texto más corto

### Si nada funciona:
- [ ] Reinicia backend (Ctrl+C → mvn spring-boot:run)
- [ ] Reinicia frontend (Ctrl+C → npm run dev)
- [ ] Limpia caché del navegador
- [ ] Verifica puertos 8080 y 5173 libres

---

## 📞 CÓDIGOS HTTP

| Código | Significado | Acción |
|--------|-------------|--------|
| 400 | Bad Request | Verifica los datos enviados |
| 401 | Unauthorized | Haz login de nuevo |
| 403 | Forbidden | No tienes permisos |
| 404 | Not Found | Recurso no existe |
| 409 | Conflict | Username/Email ya existe |
| 500 | Server Error | Reinicia backend |

---

**📖 Para más detalles, consulta: ERRORS_GUIDE.md**

