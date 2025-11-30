# TTS APP - Proyecto Completo

## 📁 Ubicación del Proyecto
```
C:\Users\cadec\tts-app\
```

## 🎯 Descripción
Aplicación completa de Text-to-Speech desarrollada con Spring Boot 3.3 y React 18, siguiendo principios SOLID y arquitectura desacoplada.

## ✅ Estado del Proyecto
**✅ COMPLETO Y FUNCIONAL**

- ✅ Todos los archivos guardados
- ✅ Scripts de inicio creados
- ✅ Acceso directo en escritorio
- ✅ Aplicación funcionando
- ✅ Admin puede ver usuarios
- ✅ Registro y login funcionando
- ✅ Persistencia de datos funcionando
- ✅ Proxy Vite configurado correctamente

## 🚀 Funcionalidades Implementadas

### Autenticación y Usuarios
- ✅ Registro de usuarios públicos
- ✅ Login/Logout con JWT en cookies HttpOnly
- ✅ Roles: USER y ADMIN
- ✅ Gestión de usuarios (solo ADMIN)
- ✅ Persistencia de usuarios en base de datos

### Text-to-Speech
- ✅ Generación de audio con Google TTS
- ✅ Múltiples voces disponibles (8 voces)
- ✅ Guardado de textos y audios
- ✅ Reproducción de audio en el navegador
- ✅ Subida de archivos (TXT, PDF, DOC, DOCX)
- ✅ Extracción de texto de archivos
- ✅ Edición de textos guardados

### Panel de Administración
- ✅ Gestión de usuarios (listar, eliminar)
- ✅ Gestión de textos (listar, eliminar)
- ✅ Gestión de archivos de audio (listar, eliminar, reproducir)
- ✅ Acceso restringido a usuarios ADMIN

## 🏗️ Arquitectura

### Principios SOLID Aplicados
- ✅ **Single Responsibility**: Servicios separados por responsabilidad
  - `UserQueryService`: Solo consultas (lectura)
  - `UserCommandService`: Solo comandos (escritura)
  - `UserMapper`: Solo mapeo de entidades a DTOs
- ✅ **Open/Closed**: Interfaces para extensibilidad
- ✅ **Liskov Substitution**: Interfaces bien definidas
- ✅ **Interface Segregation**: Interfaces específicas
- ✅ **Dependency Inversion**: Dependencias de abstracciones

### Estructura del Backend
```
src/main/java/com/ttsapp/
├── controller/
│   ├── AdminController.java
│   ├── AuthController.java
│   ├── TextEntryController.java
│   └── TtsController.java
├── service/
│   ├── UserQueryService.java (interfaz)
│   ├── UserCommandService.java (interfaz)
│   ├── UserService.java (facade)
│   ├── impl/
│   │   ├── UserQueryServiceImpl.java
│   │   └── UserCommandServiceImpl.java
│   ├── TextEntryService.java
│   └── TtsService.java
├── repository/
│   ├── UserRepository.java
│   └── TextEntryRepository.java
├── entity/
│   ├── User.java
│   └── TextEntry.java
├── dto/
│   ├── UserResponse.java
│   ├── AuthResponse.java
│   ├── TextEntryRequest.java
│   └── TextEntryResponse.java
├── mapper/
│   └── UserMapper.java
├── security/
│   ├── SecurityConfig.java
│   ├── JwtTokenProvider.java
│   ├── JwtAuthenticationFilter.java
│   └── CustomUserDetailsService.java
├── exception/
│   ├── GlobalExceptionHandler.java
│   ├── UsernameAlreadyExistsException.java
│   ├── EmailAlreadyExistsException.java
│   └── UserNotFoundException.java
└── config/
    ├── DataInitializer.java
    └── WebConfig.java
```

### Estructura del Frontend
```
frontend/
├── src/
│   ├── pages/
│   │   ├── Login.jsx
│   │   └── Dashboard.jsx
│   ├── components/
│   │   ├── AdminPanel.jsx
│   │   ├── UserManagement.jsx
│   │   ├── FileManagement.jsx
│   │   ├── TextEntryForm.jsx
│   │   ├── TextEntryList.jsx
│   │   ├── EditTextModal.jsx
│   │   ├── AudioPlayer.jsx
│   │   ├── BackgroundMusic.jsx
│   │   └── BackgroundImage.jsx
│   ├── context/
│   │   └── AuthContext.jsx
│   └── utils/
│       └── errorMessages.js
├── vite.config.js
└── package.json
```

## 🔧 Tecnologías Utilizadas

### Backend
- Spring Boot 3.3
- Spring Security + JWT
- Spring Data JPA
- H2 Database (file-based, persistente)
- Lombok
- Maven
- Google Cloud TTS API
- Apache POI (para DOC/DOCX)
- Apache PDFBox (para PDF)

### Frontend
- React 18
- Vite
- Tailwind CSS
- Axios
- React Router
- Web Audio API (música de fondo)

## 📋 Configuración

### Base de Datos
- **Tipo**: H2 (file-based)
- **Ubicación**: `./data/ttsdb`
- **Persistencia**: ✅ Datos persisten entre reinicios
- **Console**: http://localhost:8080/h2-console
  - JDBC URL: `jdbc:h2:file:./data/ttsdb`
  - Usuario: `sa`
  - Contraseña: (vacía)

### Proxy Vite
Configurado en `frontend/vite.config.js`:
- `/api` → `http://localhost:8080`
- `/admin` → `http://localhost:8080`
- `/uploads` → `http://localhost:8080`

### CORS
Configurado para:
- `http://localhost:5173`
- `http://localhost:3000`
- Credenciales habilitadas

## 🔐 Credenciales

### Usuario Administrador
- **Usuario**: `admin`
- **Contraseña**: `admin123`
- **Rol**: ADMIN

### Usuarios Registrados
Los usuarios se registran públicamente a través de `/api/auth/register`

## 🌐 URLs de Acceso

- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:8080
- **Swagger UI**: http://localhost:8080/swagger-ui.html
- **H2 Console**: http://localhost:8080/h2-console

## 🚀 Scripts de Inicio

### Iniciar Aplicación

#### Opción 1: Acceso Directo (Recomendado)
- Busca `TTS App - Iniciar` en tu escritorio
- Doble clic para iniciar

#### Opción 2: Script Batch
- Navega a `C:\Users\cadec\tts-app\`
- Doble clic en `start-app.bat`

#### Opción 3: PowerShell
```powershell
cd C:\Users\cadec\tts-app
.\start-app.ps1
```

### Detener Aplicación
- Doble clic en `stop-app.bat`
- O ejecuta `.\stop-app.ps1`

### Qué Hacen los Scripts
1. Detienen procesos existentes (Java y Node)
2. Inician Backend (Spring Boot) en ventana separada
3. Inician Frontend (React + Vite) en ventana separada
4. Esperan 15 segundos
5. Abren navegador automáticamente en http://localhost:5173

## 📝 Endpoints API

### Autenticación
- `POST /api/auth/register` - Registro de usuarios
- `POST /api/auth/login` - Login (devuelve JWT en cookie)
- `POST /api/auth/logout` - Logout (limpia cookie)
- `GET /api/auth/me` - Obtener usuario actual

### Text-to-Speech
- `GET /api/tts/speak?text=...&voice=...` - Generar audio (streaming)

### Textos
- `GET /api/texts` - Listar textos del usuario actual
- `POST /api/texts` - Crear texto y generar audio
- `POST /api/texts/upload` - Subir archivo y generar audio
- `PUT /api/texts/{id}` - Actualizar texto
- `GET /api/texts/{id}` - Obtener texto por ID
- `DELETE /api/texts/{id}` - Eliminar texto

### Administración (Solo ADMIN)
- `GET /admin/users` - Listar todos los usuarios
- `DELETE /admin/users/{id}` - Eliminar usuario
- `GET /admin/texts` - Listar todos los textos
- `DELETE /admin/texts/{id}` - Eliminar texto
- `GET /admin/files` - Listar todos los archivos de audio
- `DELETE /admin/files?audioUrl=...` - Eliminar archivo de audio
- `GET /admin/users/debug` - Endpoint de debug

## 🗄️ Entidades

### User
- `id` (Long)
- `username` (String, único)
- `email` (String, único)
- `password` (String, bcrypt)
- `role` (Enum: USER, ADMIN)
- `createdAt` (LocalDateTime)
- `textEntries` (List<TextEntry>)

### TextEntry
- `id` (Long)
- `title` (String)
- `content` (String, texto largo)
- `user` (User, ManyToOne)
- `createdAt` (LocalDateTime)
- `audioUrl` (String, opcional)

## 🔍 Características Técnicas

### Seguridad
- JWT tokens en cookies HttpOnly
- Spring Security configurado
- Roles y permisos (USER, ADMIN)
- CORS configurado
- Validación de datos con `@Valid`

### Persistencia
- H2 database file-based
- `saveAndFlush()` para persistencia inmediata
- Transacciones `@Transactional`
- `@EntityGraph` para eager loading cuando es necesario

### Manejo de Errores
- `@RestControllerAdvice` para manejo global
- Excepciones personalizadas
- Mensajes de error en español
- Logging detallado

### Frontend
- React Context para autenticación
- Manejo de errores robusto
- Validación de respuestas (HTML vs JSON)
- Diseño responsive con Tailwind CSS
- Música de fondo con Web Audio API

## 📦 Dependencias Principales

### Backend (pom.xml)
- Spring Boot Starter Web
- Spring Boot Starter Security
- Spring Boot Starter Data JPA
- H2 Database
- Lombok
- JWT (io.jsonwebtoken)
- Google Cloud TTS
- Apache POI
- Apache PDFBox

### Frontend (package.json)
- React 18
- Vite
- Tailwind CSS
- Axios
- React Router DOM
- date-fns

## 🐛 Problemas Resueltos

1. ✅ Persistencia de usuarios (H2 file-based + saveAndFlush)
2. ✅ Admin puede ver usuarios (proxy /admin configurado)
3. ✅ Registro y login funcionando correctamente
4. ✅ Logout funcionando (limpia cookies y estado)
5. ✅ Proxy Vite configurado para /admin
6. ✅ Arquitectura SOLID implementada
7. ✅ Código desacoplado

## 📚 Documentación Adicional

- Swagger UI: http://localhost:8080/swagger-ui.html
- H2 Console: http://localhost:8080/h2-console

## ✅ Checklist Final

- [x] Backend funcionando
- [x] Frontend funcionando
- [x] Registro de usuarios
- [x] Login/Logout
- [x] Text-to-Speech
- [x] Guardado de textos
- [x] Subida de archivos
- [x] Edición de textos
- [x] Panel de administración
- [x] Gestión de usuarios (admin)
- [x] Gestión de textos (admin)
- [x] Gestión de archivos (admin)
- [x] Persistencia de datos
- [x] Scripts de inicio
- [x] Acceso directo en escritorio
- [x] Arquitectura SOLID
- [x] Código desacoplado

## 🎉 Proyecto Completo

**Fecha de finalización**: 29 de noviembre de 2025
**Estado**: ✅ COMPLETO Y FUNCIONAL
**Ubicación**: `C:\Users\cadec\tts-app\`

---

**¡Proyecto listo para usar!**

