# 🔄 API Flow Diagrams - TTS App

## Complete API Request Flow

```mermaid
sequenceDiagram
    participant Client as Client/Browser
    participant Frontend as React Frontend<br/>(Port 5173)
    participant Proxy as Vite Proxy
    participant Security as Security Filter<br/>(JWT)
    participant Controller as REST Controller
    participant Service as Service Layer
    participant Repository as Repository<br/>(JPA)
    participant DB as Database<br/>(H2/PostgreSQL)
    participant External as External Services<br/>(Google TTS)
    
    Client->>Frontend: User Action
    Frontend->>Proxy: HTTP Request (/api/**)
    Proxy->>Security: Forward Request
    Security->>Security: Validate JWT Token
    alt Token Valid
        Security->>Controller: Authenticated Request
        Controller->>Controller: Validate Input (@Valid)
        Controller->>Service: Call Business Logic
        Service->>Repository: Data Access
        Repository->>DB: SQL Query
        DB-->>Repository: Result Set
        Repository-->>Service: Entity Object
        alt External Service Needed
            Service->>External: API Call (e.g., Google TTS)
            External-->>Service: Response (e.g., Audio MP3)
        end
        Service->>Service: Business Logic Processing
        Service-->>Controller: DTO Object
        Controller-->>Security: ResponseEntity<DTO>
        Security-->>Proxy: JSON Response
        Proxy-->>Frontend: Response
        Frontend-->>Client: Update UI
    else Token Invalid/Expired
        Security-->>Proxy: 401 Unauthorized
        Proxy-->>Frontend: Error Response
        Frontend-->>Client: Redirect to Login
    end
```

## Authentication Flow

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant AuthController
    participant AuthManager
    participant UserService
    participant JwtProvider
    participant DB
    
    User->>Frontend: Enter credentials
    Frontend->>AuthController: POST /api/auth/login<br/>{username, password}
    AuthController->>AuthManager: authenticate()
    AuthManager->>UserService: loadUserByUsername()
    UserService->>DB: SELECT * FROM users WHERE username=?
    DB-->>UserService: User entity
    UserService->>AuthManager: UserDetails
    AuthManager->>AuthManager: Validate password
    alt Valid Credentials
        AuthManager-->>AuthController: Authentication Success
        AuthController->>JwtProvider: generateToken()
        JwtProvider-->>AuthController: JWT Token
        AuthController->>AuthController: Set HttpOnly Cookie
        AuthController-->>Frontend: 200 OK + Cookie
        Frontend->>Frontend: Store user in Context
        Frontend-->>User: Dashboard
    else Invalid Credentials
        AuthManager-->>AuthController: AuthenticationException
        AuthController-->>Frontend: 401 Unauthorized
        Frontend-->>User: Error Message
    end
```

## Text-to-Speech Flow

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant TextController
    participant TextService
    participant TtsService
    participant GoogleTTS as Google TTS API
    participant FileSystem
    participant Repository
    participant DB
    
    User->>Frontend: Enter text + select voice
    Frontend->>TextController: POST /api/texts<br/>{title, content, voice}
    TextController->>TextService: createTextEntry()
    TextService->>TtsService: generateAudio(content, voice)
    TtsService->>GoogleTTS: HTTP GET Request<br/>?text=...&tl=es
    GoogleTTS-->>TtsService: Audio MP3 (bytes)
    TtsService->>FileSystem: Save /uploads/audio/{UUID}.mp3
    FileSystem-->>TtsService: File path
    TtsService-->>TextService: Audio URL
    TextService->>Repository: save(TextEntry)
    Repository->>DB: INSERT INTO text_entries
    DB-->>Repository: Saved entity
    Repository-->>TextService: TextEntry entity
    TextService-->>TextController: TextEntryResponse DTO
    TextController-->>Frontend: 201 Created + JSON
    Frontend->>Frontend: Display audio player
    Frontend-->>User: Audio ready to play
```

## File Upload Flow

```mermaid
flowchart TD
    A[User selects file] --> B{File Type?}
    B -->|TXT| C[Read directly]
    B -->|PDF| D[Apache PDFBox<br/>Extract text]
    B -->|DOC/DOCX| E[Apache POI<br/>Extract text]
    C --> F[Text extracted]
    D --> F
    E --> F
    F --> G[TtsService.generateAudio]
    G --> H[Google TTS API]
    H --> I[Audio MP3 bytes]
    I --> J[Save to /uploads/audio/]
    J --> K[Create TextEntry entity]
    K --> L[Save to Database]
    L --> M[Return TextEntryResponse]
    M --> N[Frontend displays result]
```

## Admin Panel Flow

```mermaid
sequenceDiagram
    participant Admin
    participant Frontend
    participant Security
    participant AdminController
    participant UserQueryService
    participant Repository
    participant DB
    
    Admin->>Frontend: Click "Admin > Users"
    Frontend->>Security: GET /admin/users<br/>(with JWT cookie)
    Security->>Security: Check role == ADMIN
    alt Is Admin
        Security->>AdminController: Forward request
        AdminController->>UserQueryService: getAllUsers()
        UserQueryService->>Repository: findAll()
        Repository->>DB: SELECT * FROM users
        DB-->>Repository: List<User>
        Repository-->>UserQueryService: List<User>
        UserQueryService->>UserQueryService: Map to UserResponse DTO
        UserQueryService-->>AdminController: List<UserResponse>
        AdminController-->>Security: ResponseEntity<List<UserResponse>>
        Security-->>Frontend: 200 OK + JSON
        Frontend->>Frontend: Render user table
        Frontend-->>Admin: Display all users
    else Not Admin
        Security-->>Frontend: 403 Forbidden
        Frontend-->>Admin: Access Denied
    end
```

## Registration Flow

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant AuthController
    participant UserCommandService
    participant PasswordEncoder
    participant Repository
    participant DB
    
    User->>Frontend: Fill registration form
    Frontend->>AuthController: POST /api/auth/register<br/>{username, email, password}
    AuthController->>UserCommandService: register(request)
    UserCommandService->>Repository: existsByUsername()
    Repository->>DB: SELECT COUNT(*) WHERE username=?
    DB-->>Repository: Count result
    alt Username exists
        Repository-->>UserCommandService: true
        UserCommandService-->>AuthController: UsernameAlreadyExistsException
        AuthController-->>Frontend: 400 Bad Request
        Frontend-->>User: Error: Username taken
    else Username available
        UserCommandService->>Repository: existsByEmail()
        Repository->>DB: SELECT COUNT(*) WHERE email=?
        DB-->>Repository: Count result
        alt Email exists
            Repository-->>UserCommandService: true
            UserCommandService-->>AuthController: EmailAlreadyExistsException
            AuthController-->>Frontend: 400 Bad Request
            Frontend-->>User: Error: Email taken
        else Email available
            UserCommandService->>PasswordEncoder: encode(password)
            PasswordEncoder-->>UserCommandService: Hashed password
            UserCommandService->>Repository: save(User)
            Repository->>DB: INSERT INTO users
            DB-->>Repository: Saved User
            Repository-->>UserCommandService: User entity
            UserCommandService-->>AuthController: AuthResponse
            AuthController-->>Frontend: 201 Created
            Frontend->>Frontend: Auto login
            Frontend-->>User: Registration success
        end
    end
```

## Update Text Entry Flow

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant TextController
    participant TextService
    participant TtsService
    participant GoogleTTS
    participant FileSystem
    participant Repository
    participant DB
    
    User->>Frontend: Edit text entry
    Frontend->>TextController: PUT /api/texts/{id}<br/>{title, content, voice}
    TextController->>TextService: updateTextEntry(id, request)
    TextService->>Repository: findByIdAndUser()
    Repository->>DB: SELECT * WHERE id=? AND user_id=?
    DB-->>Repository: TextEntry
    Repository-->>TextService: TextEntry entity
    TextService->>TextService: Compare content/voice
    alt Content or voice changed
        TextService->>TtsService: generateAudio(newContent, voice)
        TtsService->>GoogleTTS: Request audio
        GoogleTTS-->>TtsService: Audio MP3
        TtsService->>FileSystem: Save new audio
        FileSystem-->>TtsService: New audio URL
        TtsService->>FileSystem: Delete old audio
        TtsService-->>TextService: New audio URL
        TextService->>TextEntry: setAudioUrl(newUrl)
    end
    TextService->>TextEntry: setTitle(), setContent()
    TextService->>Repository: save(TextEntry)
    Repository->>DB: UPDATE text_entries
    DB-->>Repository: Updated entity
    Repository-->>TextService: TextEntry
    TextService-->>TextController: TextEntryResponse
    TextController-->>Frontend: 200 OK + JSON
    Frontend-->>User: Updated text displayed
```

## Error Handling Flow

```mermaid
flowchart TD
    A[Request arrives] --> B{Valid Request?}
    B -->|No| C[ValidationException]
    B -->|Yes| D{Authenticated?}
    D -->|No| E[401 Unauthorized]
    D -->|Yes| F{Authorized?}
    F -->|No| G[403 Forbidden]
    F -->|Yes| H{Resource exists?}
    H -->|No| I[404 Not Found]
    H -->|Yes| J{Business Logic OK?}
    J -->|No| K[BusinessException<br/>UsernameExists, etc.]
    J -->|Yes| L{External Service OK?}
    L -->|No| M[500 Internal Server Error]
    L -->|Yes| N[200 OK / 201 Created]
    
    C --> O[GlobalExceptionHandler]
    E --> O
    G --> O
    I --> O
    K --> O
    M --> O
    N --> P[Return Response]
    O --> Q[Format Error Response]
    Q --> P
    P --> R[Client receives response]
```

## API Endpoint Summary

### Public Endpoints (No Authentication)

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login (returns JWT cookie)
- `GET /swagger-ui.html` - API documentation

### Protected Endpoints (Require Authentication)

**User Endpoints:**
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout
- `GET /api/texts` - List user's texts
- `POST /api/texts` - Create text entry
- `POST /api/texts/upload` - Upload file
- `PUT /api/texts/{id}` - Update text entry
- `GET /api/texts/{id}` - Get text entry
- `DELETE /api/texts/{id}` - Delete text entry
- `GET /api/tts/speak` - Generate audio (streaming)
- `GET /uploads/audio/{filename}` - Serve audio file

**Admin Endpoints (Require ADMIN role):**
- `GET /admin/users` - List all users
- `DELETE /admin/users/{id}` - Delete user
- `GET /admin/texts` - List all texts
- `DELETE /admin/texts/{id}` - Delete any text
- `GET /admin/files` - List all audio files
- `DELETE /admin/files` - Delete audio file

## Notes

- **JWT Token**: Stored in HttpOnly cookie, automatically sent with each request
- **CORS**: Configured for `http://localhost:5173` (frontend)
- **Proxy**: Vite proxy redirects `/api/**` to `http://localhost:8080`
- **Error Handling**: Global exception handler formats all errors consistently
- **Validation**: Input validation using `@Valid` and custom validators
- **Security**: Role-based access control (RBAC) for admin endpoints

