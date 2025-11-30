# 🚀 TTS App - Text-to-Speech Application

A full-stack web application built with **Spring Boot 3.3** (Java) and **React 18** (JavaScript) that converts text to speech, manages content, and provides user administration with an advanced role-based system.

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Quick Start](#-quick-start)
- [Installation](#-installation)
- [Running the Application](#-running-the-application)
- [Project Structure](#-project-structure)
- [API Documentation](#-api-documentation)
- [Troubleshooting](#-troubleshooting)

---

## ✨ Features

- 🔐 **Authentication & Authorization**: Public registration, secure login with JWT, role-based access (USER/ADMIN)
- 🎤 **Text-to-Speech**: Convert text to MP3 audio using Google TTS API
- 📁 **File Upload**: Support for TXT, PDF, DOC, DOCX files with automatic text extraction
- ✏️ **Content Management**: Create, edit, and delete text entries with automatic audio regeneration
- 👥 **Admin Panel**: Complete user, text, and file management (ADMIN only)
- 🎨 **Modern UI**: Beautiful, responsive design with Tailwind CSS
- 🏗️ **SOLID Architecture**: Clean, maintainable code following SOLID principles

---

## 🛠️ Tech Stack

### Backend
- **Java 17** (JVM, Maven)
- **Spring Boot 3.3**
- **Spring Security** + JWT (HttpOnly cookies)
- **Spring Data JPA**
- **H2 Database** (file-based for development)
- **Google Cloud TTS API**
- **Apache POI** (DOC/DOCX extraction)
- **Apache PDFBox** (PDF extraction)

### Frontend
- **JavaScript (ES6+)** (Node.js, npm)
- **React 18**
- **Vite** (build tool)
- **Tailwind CSS**
- **Axios** (HTTP client)
- **React Router**

---

## 🚀 Quick Start

### Automatic Startup (Recommended) ⭐

**Windows PowerShell:**

```powershell
.\start-app.ps1
```

**Windows CMD:**

```cmd
start-app.bat
```

**Features:**
- ✅ Automatically checks dependencies
- ✅ Verifies ports and asks if they're occupied
- ✅ Installs npm dependencies if needed
- ✅ Waits for services to be ready
- ✅ Opens browser automatically
- ✅ Shows status of each service

**To stop:**

```powershell
.\stop-app.ps1
```

or

```cmd
stop-app.bat
```

---

## 📦 Installation

### Prerequisites

Before running the scripts, make sure you have:

- ✅ **Java 17+** installed
- ✅ **Maven** installed or Maven wrapper (mvnw.cmd)
- ✅ **Node.js 18+** installed
- ✅ **npm** (comes with Node.js)

**Verify installations:**

```bash
java -version
mvn --version
node --version
npm --version
```

---

## 🏃 Running the Application

### Method 1: Automatic Scripts (Recommended)

**PowerShell:**
```powershell
.\start-app.ps1
```

**Batch:**
```cmd
start-app.bat
```

### Method 2: Manual (Step by Step)

**Terminal 1 - Backend:**

```bash
cd C:\Users\cadec\tts-app
mvn spring-boot:run
```

**Terminal 2 - Frontend:**

```bash
cd C:\Users\cadec\tts-app\frontend
npm install  # Only the first time
npm run dev
```

**Then open:** http://localhost:5173

---

## 📁 Project Structure

```
tts-app/
├── src/
│   └── main/
│       ├── java/com/ttsapp/
│       │   ├── controller/     # REST Controllers
│       │   ├── service/        # Business Logic
│       │   ├── repository/     # Data Access (JPA)
│       │   ├── entity/        # Database Entities
│       │   ├── dto/            # Data Transfer Objects
│       │   ├── mapper/         # Entity-DTO Mappers
│       │   ├── security/       # JWT & Security
│       │   └── config/         # Configuration
│       └── resources/
│           ├── application.yml
│           ├── application-dev.yml
│           └── application-prod.yml
├── frontend/
│   ├── src/
│   │   ├── components/         # React Components
│   │   ├── pages/              # Page Components
│   │   └── context/            # React Context
│   ├── package.json
│   └── vite.config.js
├── pom.xml                     # Maven Configuration
├── mvnw.cmd                    # Maven Wrapper
├── start-app.ps1              # PowerShell Startup Script
├── start-app.bat               # Batch Startup Script
└── README.md                   # This file
```

---

## 📚 API Documentation

### Swagger UI

Once the backend is running, access the interactive API documentation at:

**http://localhost:8080/swagger-ui.html**

### Main Endpoints

**Authentication:**
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login (returns JWT in cookie)
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user

**Text Entries:**
- `GET /api/texts` - List user's texts
- `POST /api/texts` - Create text entry + generate audio
- `POST /api/texts/upload` - Upload file (TXT, PDF, DOC, DOCX)
- `PUT /api/texts/{id}` - Update text entry
- `GET /api/texts/{id}` - Get text entry
- `DELETE /api/texts/{id}` - Delete text entry

**Admin (ADMIN only):**
- `GET /admin/users` - List all users
- `DELETE /admin/users/{id}` - Delete user
- `GET /admin/texts` - List all texts
- `DELETE /admin/texts/{id}` - Delete any text
- `GET /admin/files` - List all audio files
- `DELETE /admin/files` - Delete audio file

**TTS:**
- `GET /api/tts/speak?text=...&voice=...` - Generate audio (streaming)

---

## 🔧 Troubleshooting

### Script won't execute (PowerShell)

If you get an execution policy error:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Ports are occupied

The PowerShell script will ask if you want to stop the processes.

Or you can run manually:

```powershell
.\stop-app.ps1
```

### Maven not found

The script will try to use:

1. Globally installed Maven
2. Maven wrapper (mvnw.cmd) if it exists
3. Maven from IntelliJ IDEA if installed

If none work, install Maven or create the wrapper:

```bash
mvn wrapper:wrapper
```

### Backend not responding

1. Check that port 8080 is free
2. Verify Java is installed: `java -version`
3. Check backend logs in the PowerShell/CMD window
4. Wait 30-60 seconds for Spring Boot to fully start

### Frontend not loading

1. Check that port 5173 is free
2. Verify Node.js is installed: `node --version`
3. Run `npm install` in the `frontend` directory
4. Check frontend logs in the PowerShell/CMD window

---

## 🐳 Docker (Optional)

If you prefer to use Docker:

```bash
docker-compose up -d
```

This starts:
- PostgreSQL
- Backend
- Frontend

Everything automatically in containers.

---

## 👤 Default Credentials

**Admin User:**
- Username: `admin`
- Password: `admin123`

---

## 📝 Notes

- Scripts open separate windows for each service
- You can close the windows to stop the services
- Browser opens automatically after 15-20 seconds
- If something fails, check the PowerShell/CMD windows for errors
- For more detailed error information, see `ERRORS_GUIDE.md`

---

## 🆘 Help

If you have problems:

1. Check `ERRORS_GUIDE.md` for common errors
2. Verify all prerequisites are installed
3. Make sure ports 8080 and 5173 are free
4. Review logs in PowerShell/CMD windows

---

## 📄 License

This project is part of a development portfolio.

---

## 👨‍💻 Author

**Carlos** - Full-Stack Developer

GitHub: [@carlosPc1987](https://github.com/carlosPc1987)

---

## 🎯 Project Presentation

For a complete presentation of the project, see:
- `PRESENTACION_HTML.html` - Interactive HTML presentation
- `PRESENTACION.md` - Markdown presentation

---

**Built with ❤️ using Spring Boot and React**

