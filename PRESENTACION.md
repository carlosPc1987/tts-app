# TTS APP - Presentación del Proyecto
## Text-to-Speech Application con Spring Boot y React

---

## 📋 Índice

1. [Introducción](#introducción)
2. [Visión General del Proyecto](#visión-general)
3. [Funcionalidades Principales](#funcionalidades)
4. [Arquitectura y Tecnologías](#arquitectura)
5. [Retos y Soluciones](#retos)
6. [Desarrollo en 2 Semanas](#desarrollo)
7. [Demostración](#demostración)
8. [Conclusiones](#conclusiones)

---

## 🎯 Introducción

### ¿Qué es TTS APP?

Aplicación web completa de **Text-to-Speech** que permite:
- Convertir texto a audio en tiempo real
- Gestionar textos y audios generados
- Administrar usuarios y contenido
- Subir archivos y extraer texto automáticamente

### Objetivo del Proyecto

Desarrollar una aplicación full-stack moderna, escalable y segura que demuestre:
- Arquitectura SOLID
- Buenas prácticas de desarrollo
- Integración de servicios externos
- Gestión de usuarios y permisos

---

## 🌟 Visión General del Proyecto

### Stack Tecnológico

**Backend (Java):**
- **Java 17** - Lenguaje principal
- Spring Boot 3.3 (Framework Java)
- Spring Security + JWT
- Spring Data JPA
- H2 Database (persistente)
- Maven (Build tool)
- Google Cloud TTS API

**Frontend (JavaScript/Node.js):**
- **JavaScript ES6+** - Lenguaje principal
- **Node.js** - Runtime y entorno de desarrollo
- **npm** - Gestor de paquetes
- React 18
- Vite
- Tailwind CSS
- Axios
- React Router

### Características Principales

✅ **Seguridad**: JWT en cookies HttpOnly  
✅ **Persistencia**: Base de datos file-based  
✅ **Arquitectura**: Principios SOLID aplicados  
✅ **UI/UX**: Diseño moderno y responsive  
✅ **API REST**: Documentación con Swagger  

---

## 🚀 Funcionalidades Principales

### 1. Autenticación y Gestión de Usuarios

**¿Qué hace?**
Sistema completo de autenticación que permite a los usuarios registrarse, iniciar sesión y gestionar su cuenta de forma segura.

**¿Cómo funciona el Registro Público? (Flujo Visual)**

```
Usuario → React Form → Axios POST → Proxy Vite → Backend Java
                                                      │
                                                      ▼
                                            AuthController (Java)
                                                      │
                                                      ▼
                                         UserCommandService (Java)
                                                      │
                                    ┌─────────────────┴─────────────────┐
                                    │                                     │
                                    ▼                                     ▼
                          Valida username único              Valida email único
                                    │                                     │
                                    └─────────────────┬─────────────────┘
                                                      │
                                                      ▼
                                    Encripta password (bcrypt)
                                                      │
                                                      ▼
                                    Crea entidad User (Java)
                                                      │
                                                      ▼
                                    userRepository.saveAndFlush()
                                                      │
                                                      ▼
                                            Base de Datos H2
                                    INSERT INTO users VALUES (...)
                                                      │
                                                      ▼
                                    Retorna AuthResponse (JSON)
                                                      │
                                                      ▼
                                            Frontend recibe JSON
                                                      │
                                                      ▼
                                    Login automático del usuario
```

**¿Qué es bcrypt y por qué se usa?**
- Algoritmo de hash unidireccional (no se puede desencriptar)
- Las contraseñas NUNCA se guardan en texto plano
- Ejemplo: "admin123" → "$2a$10$N9qo8uLOickgx2ZMRZoMye..."
- Cada hash es único aunque la contraseña sea igual (salt aleatorio)

**Sistema de Roles - ¿Cómo funciona?**
- **USER (Rol por defecto):**
  - Puede crear, editar y eliminar SUS propios textos
  - Acceso a `/api/texts/**` (solo sus textos)
  - NO puede acceder a `/admin/**`
  
- **ADMIN (Rol especial):**
  - Credenciales: `admin` / `admin123`
  - Puede ver TODOS los usuarios en `/admin/users`
  - Puede eliminar cualquier texto en `/admin/texts/{id}`
  - Puede gestionar archivos de audio en `/admin/files`
  - Verificación en `SecurityConfig.java`: `.hasRole("ADMIN")`

**¿Cómo funciona el Login?**
1. Usuario ingresa username y password
2. Frontend envía POST a `/api/auth/login`
3. `AuthenticationManager` (Spring Security) valida credenciales
4. Si es correcto, `JwtTokenProvider` (Java) genera token JWT
5. Token se guarda en cookie HttpOnly (no accesible desde JavaScript)
6. Cookie se envía automáticamente en cada petición
7. `JwtAuthenticationFilter` (Java) valida token en cada request
8. Frontend obtiene datos del usuario con `/api/auth/me`

**¿Qué es JWT y por qué en cookies HttpOnly?**
- JWT (JSON Web Token): Token que contiene información del usuario
- Estructura: `header.payload.signature`
- HttpOnly: Cookie no accesible desde JavaScript (protección XSS)
- Secure: Solo se envía por HTTPS (en producción)
- Path: `/` (disponible en toda la aplicación)

**¿Cómo funciona el Logout?**
1. Usuario hace clic en "Cerrar Sesión"
2. Frontend llama a `/api/auth/logout`
3. Backend establece cookie con `MaxAge=0` (la elimina)
4. Frontend limpia estado de usuario en React Context
5. Redirige a `/login`

### 2. Text-to-Speech

**¿Qué hace?**
Convierte texto escrito en archivos de audio MP3 que se pueden reproducir, guardar y gestionar.

**¿Cómo funciona la Generación de Audio? (Flujo Visual)**

```
Usuario escribe texto
        │
        ▼
Frontend: Selecciona voz
        │
        ▼
POST /api/texts {text, voice}
        │
        ▼
TextEntryController (Java)
        │
        ▼
TextEntryService.createTextEntry()
        │
        ├─────────────────┐
        │                 │
        ▼                 ▼
TtsService.generateAudio()    TextEntry.builder()
        │                 │
        │                 │
        ▼                 │
Google TTS API            │
        │                 │
        ▼                 │
Audio MP3 (bytes)         │
        │                 │
        ▼                 │
TtsService.saveAudio()     │
        │                 │
        ▼                 │
/uploads/audio/UUID.mp3   │
        │                 │
        └────────┬────────┘
                 │
                 ▼
        TextEntry (Entity)
        - title
        - content
        - audioUrl
        - user
                 │
                 ▼
        textEntryRepository.save()
                 │
                 ▼
        Base de Datos H2
        INSERT INTO text_entries
                 │
                 ▼
        TextEntryResponse (JSON)
                 │
                 ▼
        Frontend muestra reproductor
```

**¿Qué es Google Cloud TTS?**
- Servicio de Google que convierte texto a voz
- API REST pública (gratuita con límites)
- Soporta múltiples idiomas y voces
- Devuelve audio en formato MP3
- Ejemplo de petición: `GET https://translate.google.com/translate_tts?text=Hola&tl=es`

**¿Cómo se guardan los audios?**
- Se guardan físicamente en: `C:\Users\cadec\tts-app\uploads\audio\`
- Nombre: UUID aleatorio + `.mp3` (ej: `a3f5b2c1-d4e6-7890.mp3`)
- URL pública: `http://localhost:8080/uploads/audio/{filename}`
- `AudioController` (Java) sirve los archivos con `Content-Type: audio/mpeg`

**¿Cómo funciona la Edición?**
1. Usuario hace clic en "Editar" en un texto guardado
2. Se abre modal con formulario pre-llenado
3. Usuario modifica título o contenido
4. Frontend envía PUT a `/api/texts/{id}`
5. Backend busca el `TextEntry` en base de datos
6. Actualiza título y contenido
7. **Regenera el audio** con el nuevo contenido (llama a Google TTS)
8. Elimina el audio anterior del disco
9. Guarda el nuevo audio
10. Actualiza la URL en la base de datos
11. Retorna el texto actualizado

**¿Por qué se regenera el audio al editar?**
- El audio debe coincidir exactamente con el texto
- Si cambias "Hola" por "Adiós", el audio debe cambiar
- Se elimina el archivo anterior para ahorrar espacio
- Proceso automático: usuario no necesita hacer nada

### 3. Subida de Archivos

**¿Qué hace?**
Permite subir archivos de diferentes formatos, extrae el texto automáticamente y genera el audio.

**¿Cómo funciona el Proceso Completo?**

**Paso 1: Subida del Archivo**
- Usuario selecciona archivo (TXT, PDF, DOC, DOCX)
- Frontend envía POST a `/api/texts/upload` con `MultipartFile`
- Backend recibe el archivo en `TextEntryController` (Java)

**Paso 2: Extracción de Texto (según formato)**

**Para TXT:**
- Se lee directamente el contenido del archivo
- `new String(file.getBytes(), StandardCharsets.UTF_8)`

**Para PDF:**
- Se usa **Apache PDFBox** (librería Java)
- `PDDocument.load(file.getInputStream())`
- Se extrae texto de todas las páginas
- Se concatena todo el texto

**Para DOC/DOCX:**
- Se usa **Apache POI** (librería Java)
- `XWPFDocument` para DOCX (formato moderno)
- `HWPFDocument` para DOC (formato antiguo)
- Se extrae texto de párrafos y tablas
- Se preserva estructura básica

**Paso 3: Generación de Audio**
- El texto extraído se envía a Google TTS
- Se genera audio MP3
- Se guarda en `/uploads/audio/`

**Paso 4: Guardado en Base de Datos**
- Se crea `TextEntry` con:
  - Título: nombre del archivo original
  - Contenido: texto extraído
  - AudioUrl: ruta del MP3 generado
  - Usuario: usuario actual (obtenido del JWT)

**Ejemplo Concreto:**
1. Usuario sube `documento.pdf` (3 páginas)
2. Backend extrae: "Este es el texto de la página 1. Este es el texto de la página 2..."
3. Se genera audio de todo el texto
4. Se guarda como: `Título: documento.pdf`, `Contenido: [texto extraído]`, `Audio: a3f5b2c1.mp3`

**¿Por qué diferentes librerías?**
- **PDFBox**: Especializada en PDFs, maneja bien formato complejo
- **Apache POI**: Especializada en documentos Office (Word, Excel)
- Cada formato tiene estructura diferente, necesita librería específica

### 4. Panel de Administración

**¿Qué hace?**
Panel exclusivo para usuarios ADMIN que permite gestionar todo el sistema: usuarios, textos y archivos.

**¿Cómo funciona el Control de Acceso?**
- `SecurityConfig.java` (Java) define: `.requestMatchers("/admin/**").hasRole("ADMIN")`
- Si usuario no es ADMIN → Error 403 (Forbidden)
- Verificación en cada petición mediante `JwtAuthenticationFilter`
- El token JWT contiene el rol del usuario
- Spring Security valida el rol antes de permitir acceso

**Gestión de Usuarios - ¿Cómo funciona?**

**Listar Usuarios:**
1. Admin hace clic en "Administración > Usuarios"
2. Frontend envía GET a `/admin/users` con cookie JWT
3. Backend valida que el usuario sea ADMIN
4. `UserQueryService.getAllUsers()` (Java) ejecuta:
   - `userRepository.findAllWithoutGraph()` (JPA)
   - Obtiene todas las entidades `User` de la base de datos
   - `UserMapper` (Java) convierte cada `User` a `UserResponse` (DTO)
   - Cuenta `textEntries` de cada usuario
5. Retorna lista JSON: `[{id: 1, username: "admin", role: "ADMIN", textEntriesCount: 5}, ...]`
6. Frontend muestra tabla con todos los usuarios

**Eliminar Usuario:**
1. Admin hace clic en "Eliminar" en un usuario
2. Frontend confirma acción
3. Envía DELETE a `/admin/users/{id}`
4. `UserCommandService.deleteUser()` (Java):
   - Busca usuario por ID
   - `userRepository.delete(user)` (JPA)
   - **Cascade**: Al eliminar usuario, se eliminan sus textos (configurado en `User.textEntries`)
5. Retorna 204 No Content
6. Frontend actualiza la lista

**Gestión de Textos - ¿Cómo funciona?**

**Ver Todos los Textos:**
1. Admin accede a "Administración > Textos"
2. Frontend llama a `/admin/texts`
3. `TextEntryService.getAllTextEntries()` (Java):
   - `textEntryRepository.findAll()` (JPA) - obtiene TODOS los textos
   - Convierte a `TextEntryResponse` (DTO)
   - Incluye información del usuario propietario
4. Retorna lista con textos de todos los usuarios
5. Admin puede ver quién creó cada texto

**Eliminar Texto:**
1. Admin elimina cualquier texto (no solo los suyos)
2. `deleteTextEntryAsAdmin()` (Java) no verifica propietario
3. Elimina el texto y su archivo de audio del disco
4. Cualquier usuario puede perder su texto si admin lo elimina

**Gestión de Archivos - ¿Cómo funciona?**

**Listar Archivos (Mejorado):**
1. Admin accede a "Administración > Archivos"
2. Frontend envía GET a `/admin/files?detailed=true`
3. `TtsService.getAllAudioFilesWithInfo()` (Java):
   - `TextEntryRepository.findAllWithUser()` con `@EntityGraph`:
     - Carga todos los `TextEntry` con la relación `User` (no lazy)
     - Ejecuta SQL: `SELECT t.*, u.* FROM text_entries t JOIN users u ON t.user_id = u.id`
   - Filtra los que tienen `audioUrl` no nulo
   - Lee directorio `/uploads/audio/` para obtener tamaños de archivos
   - Crea `AudioFileInfo` DTOs con:
     - Título del texto asociado
     - Usuario que lo creó
     - Fecha de creación
     - Tamaño del archivo
4. Retorna lista completa: `[{filename, title, username, createdAt, fileSize}, ...]`
5. Frontend muestra tabla con todas las columnas
6. Admin puede ver quién creó cada archivo y cuándo

**Eliminar Archivo:**
1. Admin elimina archivo de audio
2. Se elimina físicamente del disco
3. **Nota**: El `TextEntry` asociado queda con `audioUrl=null`
4. Usuario ya no podrá reproducir ese audio

**Mejoras Implementadas:**
- **Información detallada**: Ya no solo URLs, ahora muestra título, usuario, fecha y tamaño
- **@EntityGraph**: Evita problemas de lazy loading cargando User automáticamente
- **Ordenamiento**: Archivos ordenados por fecha (más reciente primero)
- **Archivos huérfanos**: También muestra archivos físicos sin texto asociado

---

## 🏗️ Arquitectura y Tecnologías

### Tipo de Arquitectura

**Arquitectura REST API + SPA (Single Page Application)**

- **Backend**: API REST con Spring Boot (Java)
  - Separación clara entre capas (Controller → Service → Repository)
  - Arquitectura en capas (Layered Architecture)
  - Patrón MVC (Model-View-Controller) en el backend
  - Stateless (sin estado de sesión en servidor)
  
- **Frontend**: Single Page Application (SPA) con React
  - Arquitectura basada en componentes
  - Estado global con React Context
  - Routing del lado del cliente
  - Comunicación asíncrona con el backend vía HTTP/REST

**Comunicación:**
- Frontend y Backend se comunican mediante **API REST**
- Protocolo HTTP/HTTPS
- Formato de datos: JSON
- Autenticación: JWT tokens en cookies HttpOnly

### Lenguajes y Entornos de Ejecución

**Backend - Java: ¿Cómo funciona?**

**Java 17 - ¿Qué es?**
- Lenguaje de programación compilado
- Código fuente (.java) → Bytecode (.class) → JVM ejecuta
- Ejemplo: `UserService.java` se compila a `UserService.class`
- JVM (Java Virtual Machine) ejecuta el bytecode
- **Ventaja**: "Write once, run anywhere" (mismo código en Windows, Linux, Mac)

**¿Cómo se ejecuta el Backend?**
1. Maven compila código Java a bytecode
2. Maven empaqueta en JAR (Java Archive)
3. `java -jar tts-app.jar` inicia la aplicación
4. Spring Boot embebe servidor Tomcat
5. Tomcat escucha en puerto 8080
6. Cada petición HTTP crea un hilo Java
7. Spring maneja la petición y retorna respuesta

**Maven - ¿Qué hace?**
- **Gestión de dependencias**: Descarga librerías automáticamente
- **Compilación**: `mvn compile` compila todo el código
- **Build**: `mvn package` crea JAR ejecutable
- **Ejecución**: `mvn spring-boot:run` compila y ejecuta
- **pom.xml**: Define dependencias (Spring, H2, JWT, etc.)

**Spring Boot - ¿Qué hace?**
- Framework que simplifica desarrollo Java
- **Auto-configuración**: Configura automáticamente Tomcat, JPA, etc.
- **Inyección de dependencias**: Crea objetos automáticamente
- Ejemplo: `@Autowired UserService` → Spring crea UserService automáticamente
- **Anotaciones**: `@RestController`, `@Service`, `@Repository` → Spring sabe qué hacer

**Frontend - JavaScript/Node.js: ¿Cómo funciona?**

**JavaScript - ¿Qué es?**
- Lenguaje interpretado (no compilado)
- Se ejecuta en el navegador (Chrome, Firefox, etc.)
- Ejemplo: `const user = {name: "admin"}` se ejecuta directamente
- **ES6+**: Versión moderna con clases, arrow functions, etc.

**Node.js - ¿Qué es y para qué se usa?**
- **Runtime de JavaScript fuera del navegador**
- Permite ejecutar JavaScript en el servidor (tu computadora)
- **Para desarrollo**: `npm run dev` ejecuta Vite (escrito en Node.js)
- **Para build**: `npm run build` compila React a archivos estáticos
- **No se usa en producción**: Solo para desarrollo y build
- En producción, el navegador ejecuta el JavaScript compilado

**¿Cómo funciona el Frontend en desarrollo?**
1. `npm run dev` inicia Vite (servidor Node.js en puerto 5173)
2. Vite compila React en tiempo real (hot reload)
3. Navegador carga `index.html`
4. Navegador descarga JavaScript compilado
5. React se ejecuta en el navegador (JavaScript del cliente)
6. Cada interacción ejecuta JavaScript en el navegador

**¿Cómo funciona el Frontend en producción?**
1. `npm run build` compila React a archivos estáticos
2. Se generan: `index.html`, `main.js`, `styles.css`
3. Estos archivos se sirven desde un servidor web (Nginx, Apache)
4. Navegador descarga y ejecuta JavaScript
5. **No necesita Node.js en producción**

**Vite - ¿Qué hace?**
- Build tool moderna (alternativa a Webpack)
- **Desarrollo**: Servidor rápido con hot reload
- **Build**: Compila React a JavaScript optimizado
- **Proxy**: Redirige `/api/**` a `http://localhost:8080`
- Configurado en `vite.config.js` (JavaScript)

**npm - ¿Qué hace?**
- Node Package Manager (gestor de paquetes)
- `package.json` lista dependencias (React, Axios, etc.)
- `npm install` descarga todas las dependencias
- `npm run dev` ejecuta script definido en package.json

### Principios SOLID Aplicados

#### Single Responsibility Principle
- **UserQueryService**: Solo consultas (lectura)
- **UserCommandService**: Solo comandos (escritura)
- **UserMapper**: Solo mapeo de entidades a DTOs

#### Open/Closed Principle
- Interfaces para extensibilidad
- Fácil agregar nuevas funcionalidades sin modificar código existente

#### Liskov Substitution Principle
- Interfaces bien definidas
- Implementaciones intercambiables

#### Interface Segregation Principle
- Interfaces específicas (Query vs Command)
- No forzar implementaciones innecesarias

#### Dependency Inversion Principle
- Dependencias de abstracciones (interfaces)
- Controladores dependen de interfaces, no de implementaciones

### Estructura del Proyecto

**Backend (Java/Spring Boot) - ¿Qué hace cada capa?**

```
Backend (Spring Boot - Java)
├── Controller (REST endpoints)
│   └── ¿Qué hace?: Recibe peticiones HTTP, valida datos, llama a Service
│   └── Ejemplo: AuthController recibe POST /api/auth/login
│   └── Retorna: ResponseEntity con JSON o status HTTP
│
├── Service (Lógica de negocio)
│   ├── Interfaces (Query/Command)
│   │   └── ¿Qué hace?: Define contratos (qué métodos debe tener)
│   │   └── Ejemplo: UserQueryService.getAllUsers()
│   │
│   └── Implementaciones
│       └── ¿Qué hace?: Implementa la lógica real
│       └── Ejemplo: UserQueryServiceImpl llama a Repository
│
├── Repository (Acceso a datos)
│   └── ¿Qué hace?: Accede a base de datos usando JPA
│   └── Ejemplo: userRepository.findAll() ejecuta SQL: SELECT * FROM users
│   └── Spring Data JPA genera SQL automáticamente
│
├── Entity (Modelos de datos)
│   └── ¿Qué hace?: Representa tablas de base de datos
│   └── Ejemplo: @Entity User → tabla "users" en H2
│   └── JPA mapea objetos Java a filas SQL
│
├── DTO (Data Transfer Objects)
│   └── ¿Qué hace?: Objetos para transferir datos (sin lógica)
│   └── Ejemplo: UserResponse solo tiene datos, no métodos de negocio
│   └── Se envía como JSON al frontend
│
├── Mapper (Conversión de entidades)
│   └── ¿Qué hace?: Convierte Entity → DTO
│   └── Ejemplo: UserMapper.toResponse(user) → UserResponse
│   └── Separa lógica de conversión del Service
│
└── Security (JWT, autenticación)
    └── ¿Qué hace?: Valida tokens, filtra peticiones
    └── JwtAuthenticationFilter: Se ejecuta ANTES de cada Controller
    └── Extrae token de cookie, valida, establece usuario en SecurityContext
```

**Frontend (React/JavaScript) - ¿Qué hace cada parte?**

```
Frontend (React - JavaScript)
├── Pages (Vistas principales)
│   └── ¿Qué hace?: Páginas completas (Login, Dashboard)
│   └── Ejemplo: Login.jsx renderiza formulario completo
│   └── Usa componentes más pequeños
│
├── Components (Componentes reutilizables)
│   └── ¿Qué hace?: Piezas de UI reutilizables
│   └── Ejemplo: UserManagement.jsx solo muestra tabla de usuarios
│   └── Se puede usar en múltiples páginas
│
├── Context (Estado global)
│   └── ¿Qué hace?: Comparte estado entre componentes
│   └── Ejemplo: AuthContext guarda usuario logueado
│   └── Cualquier componente puede acceder con useAuth()
│
└── Utils (Utilidades)
    └── ¿Qué hace?: Funciones auxiliares
    └── Ejemplo: extractErrorMessage() parsea errores del backend
```

**Flujo de Datos Completo - Ejemplo: Crear Texto**

```
┌─────────────────────────────────────────────────────────────┐
│                    FLUJO COMPLETO DE DATOS                   │
└─────────────────────────────────────────────────────────────┘

1. Usuario escribe texto en React (Frontend/JavaScript)
   │
   ├─► Usuario interactúa con textarea
   │
   ▼
2. onClick → handleSubmit() (JavaScript)
   │
   ├─► Event handler en React
   │
   ▼
3. axios.post('/api/texts', data) (JavaScript/Axios)
   │
   ├─► Petición HTTP POST con JSON
   │
   ▼
4. Proxy Vite redirige a http://localhost:8080/api/texts
   │
   ├─► vite.config.js: '/api' → 'http://localhost:8080'
   │
   ▼
5. TextEntryController.createTextEntry() (Java/Spring)
   │
   ├─► @PostMapping("/api/texts")
   │   Recibe @RequestBody TextEntryRequest
   │
   ▼
6. TextEntryService.createTextEntry() (Java)
   │
   ├─► Lógica de negocio
   │   Obtiene usuario actual
   │
   ▼
7. TtsService.generateAudio() (Java) → Google TTS API
   │
   ├─► HTTP Request a Google
   │   Recibe bytes de audio MP3
   │
   ▼
8. TtsService.saveAudio() (Java) → Guarda en disco
   │
   ├─► Escribe archivo en /uploads/audio/{UUID}.mp3
   │
   ▼
9. TextEntryRepository.save() (Java/JPA)
   │
   ├─► Crea entidad TextEntry
   │
   ▼
10. JPA ejecuta SQL: INSERT INTO text_entries ...
    │
    ├─► Hibernate genera SQL automáticamente
    │
    ▼
11. Retorna TextEntryResponse (Java → JSON)
    │
    ├─► Serialización automática a JSON
    │
    ▼
12. Frontend recibe JSON (JavaScript)
    │
    ├─► Axios parsea respuesta
    │
    ▼
13. React actualiza estado, muestra nuevo texto en UI
    │
    └─► setTexts([...texts, newText])
        Re-renderiza componente
```

**Diagrama Visual de Arquitectura:**

```
┌──────────────────────────────────────────────────────────────┐
│                        FRONTEND (React)                       │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐    │
│  │  Pages  │  │Components│  │ Context  │  │  Utils   │    │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘    │
│       │             │             │             │           │
│       └─────────────┴─────────────┴─────────────┘           │
│                          │                                    │
│                    HTTP/REST (JSON)                          │
└──────────────────────────┼──────────────────────────────────┘
                           │
                           ▼
┌──────────────────────────────────────────────────────────────┐
│                     BACKEND (Spring Boot)                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  Controller  │→ │   Service    │→ │  Repository  │     │
│  │  (REST API)  │  │ (Lógica)     │  │   (JPA/SQL)  │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│         │                │                    │              │
│         │                │                    │              │
│         ▼                ▼                    ▼              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Security   │  │    Mapper    │  │   Database   │     │
│  │  (JWT/Auth)  │  │ (Entity→DTO) │  │     (H2)     │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└──────────────────────────────────────────────────────────────┘
```

### Tecnologías Clave

**Backend (Java):**
- **Java 17** - Lenguaje de programación principal
- **Spring Boot 3.3** - Framework principal (Java)
- **Spring Security** - Autenticación y autorización
- **Spring Data JPA** - Persistencia (Java Persistence API)
- **H2 Database** - Base de datos embebida (Java)
- **Maven** - Gestión de dependencias y build (Java)
- **JWT (io.jsonwebtoken)** - Tokens de autenticación (Java)
- **Google Cloud TTS** - Generación de audio (API REST)
- **Apache POI** - Procesamiento de documentos Office (Java)
- **Apache PDFBox** - Procesamiento de PDFs (Java)
- **Lombok** - Reducción de código boilerplate (Java)

**Frontend (JavaScript/Node.js):**
- **JavaScript (ES6+)** - Lenguaje de programación
- **Node.js** - Runtime de JavaScript (para desarrollo y build)
- **npm** - Gestor de paquetes de Node.js
- **React 18** - Framework UI (JavaScript)
- **Vite** - Build tool y dev server (Node.js)
- **Tailwind CSS** - Framework de estilos
- **Axios** - Cliente HTTP (JavaScript)
- **React Router** - Navegación (JavaScript)
- **Web Audio API** - Música de fondo (JavaScript nativo)

---

## 🎯 Retos y Soluciones

### Reto 1: Persistencia de Datos

**Problema:**
- Los usuarios no se guardaban correctamente
- Datos se perdían al reiniciar el servidor
- Admin no podía ver usuarios registrados

**Solución:**
- Cambio de H2 in-memory a file-based
- Uso de `saveAndFlush()` para persistencia inmediata
- Configuración correcta de transacciones
- Logs detallados para debugging

### Reto 2: Proxy de Vite

**Problema:**
- Endpoints `/admin/**` devolvían HTML en lugar de JSON
- Frontend no podía comunicarse con el backend

**Solución:**
- Configuración del proxy en `vite.config.js`
- Añadido `/admin` al proxy
- Manejo de errores mejorado en el frontend

### Reto 3: Arquitectura y Desacoplamiento

**Problema:**
- Código acoplado
- Servicios con múltiples responsabilidades
- Difícil de mantener y extender

**Solución:**
- Refactorización completa siguiendo SOLID
- Separación de Query y Command services
- Creación de interfaces
- Implementación de Mapper pattern

### Reto 4: Autenticación y Roles

**Problema:**
- Admin no podía acceder a su panel
- Verificación de roles inconsistente
- Cookies JWT no se establecían correctamente

**Solución:**
- Verificación múltiple de roles (rol, username, email)
- Delay en login para establecer cookies
- Configuración correcta de CORS
- Logout que limpia correctamente el estado

### Reto 5: Extracción de Texto de Archivos

**Problema:**
- Diferentes formatos de archivo
- Necesidad de librerías específicas
- Manejo de errores en extracción

**Solución:**
- Apache POI para DOC/DOCX
- Apache PDFBox para PDF
- Manejo robusto de errores
- Validación de tipos de archivo

---

## 📅 Desarrollo en 2 Semanas

### Semana 1: Fundamentos y Backend

**Día 1-2: Configuración Inicial**
- ✅ Setup del proyecto Spring Boot
- ✅ Configuración de dependencias
- ✅ Estructura de carpetas
- ✅ Configuración de base de datos H2

**Día 3-4: Autenticación y Seguridad**
- ✅ Implementación de JWT
- ✅ Spring Security configurado
- ✅ Sistema de roles (USER, ADMIN)
- ✅ Endpoints de registro y login

**Día 5-7: Funcionalidades Core**
- ✅ Integración con Google TTS
- ✅ Endpoints de textos
- ✅ Guardado de audios
- ✅ Extracción de texto de archivos

### Semana 2: Frontend y Refinamiento

**Día 8-10: Frontend Básico**
- ✅ Setup de React + Vite
- ✅ Páginas de login y registro
- ✅ Dashboard de usuario
- ✅ Integración con backend

**Día 11-12: Panel de Administración**
- ✅ Componentes de administración
- ✅ Gestión de usuarios
- ✅ Gestión de textos y archivos
- ✅ Diseño con Tailwind CSS

**Día 13-14: Refactorización y Optimización**
- ✅ Aplicación de principios SOLID
- ✅ Separación de responsabilidades
- ✅ Corrección de bugs de persistencia
- ✅ Mejora de UX/UI
- ✅ Scripts de inicio automático
- ✅ Documentación completa

### Métricas del Proyecto

- **Líneas de código**: ~5,000+ líneas
- **Archivos Java**: 30+ archivos
- **Componentes React**: 10+ componentes
- **Endpoints API**: 15+ endpoints
- **Tiempo de desarrollo**: 2 semanas
- **Commits**: Múltiples iteraciones

---

## 🎬 Demostración

### Flujo de Usuario Normal

1. **Registro**
   - Usuario se registra con username, email y password
   - Sistema valida y crea el usuario
   - Login automático después del registro

2. **Crear Texto**
   - Usuario escribe texto o sube archivo
   - Selecciona voz
   - Sistema genera audio automáticamente
   - Texto y audio se guardan

3. **Gestionar Contenido**
   - Ver lista de textos guardados
   - Reproducir audios
   - Editar textos
   - Eliminar textos

### Flujo de Administrador

1. **Login como Admin**
   - Credenciales: `admin` / `admin123`
   - Acceso a panel de administración

2. **Gestión de Usuarios**
   - Ver todos los usuarios registrados
   - Ver detalles de cada usuario
   - Eliminar usuarios si es necesario

3. **Gestión de Contenido**
   - Ver todos los textos del sistema
   - Gestionar archivos de audio
   - Auditoría completa

---

## 📊 Características Técnicas Destacadas

### Seguridad
- ✅ JWT tokens en cookies HttpOnly (seguro contra XSS)
- ✅ Encriptación de contraseñas con bcrypt
- ✅ Validación de datos en backend y frontend
- ✅ CORS configurado correctamente
- ✅ Roles y permisos implementados

### Persistencia
- ✅ Base de datos file-based (datos persisten)
- ✅ Transacciones `@Transactional`
- ✅ Eager/Lazy loading optimizado
- ✅ `saveAndFlush()` para persistencia inmediata

### Arquitectura
- ✅ Principios SOLID aplicados
- ✅ Código desacoplado
- ✅ Interfaces bien definidas
- ✅ Separación de responsabilidades
- ✅ Fácil de mantener y extender

### UX/UI
- ✅ Diseño moderno con Tailwind CSS
- ✅ Responsive (funciona en móvil y desktop)
- ✅ Música de fondo generada dinámicamente
- ✅ Feedback visual en todas las acciones
- ✅ Manejo de errores amigable

---

## 🎓 Aprendizajes y Logros

### Técnicos
- ✅ Arquitectura SOLID en la práctica
- ✅ Integración de servicios externos (Google TTS)
- ✅ Manejo de archivos múltiples formatos
- ✅ Seguridad web moderna (JWT, cookies HttpOnly)
- ✅ Desarrollo full-stack completo

### Metodológicos
- ✅ Desarrollo iterativo
- ✅ Debugging sistemático
- ✅ Refactorización continua
- ✅ Documentación como parte del desarrollo

### Herramientas
- ✅ Spring Boot avanzado
- ✅ React moderno (hooks, context)
- ✅ Vite como build tool
- ✅ Tailwind CSS para estilos
- ✅ Git para control de versiones

---

## 🚀 Próximos Pasos (Futuras Mejoras)

### Funcionalidades
- [ ] Soporte para más idiomas
- [ ] Más voces disponibles
- [ ] Exportación de audios
- [ ] Compartir textos entre usuarios
- [ ] Sistema de favoritos

### Técnicas
- [ ] Migración a PostgreSQL
- [ ] Dockerización completa
- [ ] Tests unitarios y de integración
- [ ] CI/CD pipeline
- [ ] Monitoreo y logging avanzado

### UX/UI
- [ ] Modo oscuro/claro
- [ ] Personalización de temas
- [ ] Notificaciones en tiempo real
- [ ] Mejoras en accesibilidad

---

## 📈 Conclusiones

### Logros Principales

✅ **Aplicación Completa y Funcional**
- Todas las funcionalidades implementadas
- Sistema de autenticación robusto
- Panel de administración completo

✅ **Arquitectura Sólida**
- Principios SOLID aplicados
- Código desacoplado y mantenible
- Fácil de extender

✅ **Calidad del Código**
- Buenas prácticas aplicadas
- Manejo de errores robusto
- Documentación completa

✅ **Experiencia de Usuario**
- Interfaz moderna y responsive
- Feedback visual en todas las acciones
- Flujo intuitivo

### Impacto del Proyecto

- **Aprendizaje**: Desarrollo full-stack completo
- **Práctica**: Aplicación de principios SOLID
- **Experiencia**: Integración de múltiples tecnologías
- **Resultado**: Aplicación funcional y lista para producción

---

## 🙏 Agradecimientos

### Tecnologías Utilizadas
- Spring Boot Team
- React Team
- Google Cloud TTS
- Comunidad Open Source

### Recursos
- Documentación oficial
- Stack Overflow
- Comunidades de desarrollo

---

## 📞 Información del Proyecto

**Nombre**: TTS APP  
**Tipo**: Aplicación Web Full-Stack  
**Stack**: Spring Boot + React  
**Duración**: 2 semanas  
**Estado**: ✅ Completo y Funcional  

**Ubicación**: `C:\Users\cadec\tts-app\`  
**Documentación**: `PROYECTO_COMPLETO.md`

---

## 🎉 ¡Gracias por su atención!

### Preguntas y Respuestas

¿Tienen alguna pregunta sobre el proyecto?

---

**Desarrollado con ❤️ usando Spring Boot y React**

