# 🚀 Inicio Automático de TTS App

## Métodos para Iniciar la Aplicación

### Método 1: Script PowerShell (Recomendado) ⭐

**Windows PowerShell:**
```powershell
.\start-app.ps1
```

**Características:**
- ✅ Verifica dependencias automáticamente
- ✅ Verifica puertos y pregunta si están ocupados
- ✅ Instala dependencias npm si es necesario
- ✅ Espera a que los servicios estén listos
- ✅ Abre el navegador automáticamente
- ✅ Muestra estado de cada servicio

**Para detener:**
```powershell
.\stop-app.ps1
```

---

### Método 2: Script Batch (Simple)

**Doble clic o desde CMD:**
```cmd
start-app.bat
```

**Características:**
- ✅ Más simple y rápido
- ✅ Funciona sin PowerShell
- ✅ Abre ventanas separadas para cada servicio

**Para detener:**
```cmd
stop-app.bat
```

---

### Método 3: Manual (Paso a Paso)

**Terminal 1 - Backend:**
```bash
cd C:\Users\cadec\tts-app
mvn spring-boot:run
```

**Terminal 2 - Frontend:**
```bash
cd C:\Users\cadec\tts-app\frontend
npm install  # Solo la primera vez
npm run dev
```

**Luego abre:** http://localhost:5173

---

## 🔧 Requisitos Previos

Antes de ejecutar los scripts, asegúrate de tener:

- ✅ **Java 17+** instalado
- ✅ **Maven** instalado o Maven wrapper (mvnw.cmd)
- ✅ **Node.js 18+** instalado
- ✅ **npm** (viene con Node.js)

**Verificar instalaciones:**
```bash
java -version
mvn --version
node --version
npm --version
```

---

## 📋 Solución de Problemas

### El script no ejecuta (PowerShell)

Si obtienes un error de política de ejecución:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Los puertos están ocupados

El script PowerShell te preguntará si quieres detener los procesos. 
O puedes ejecutar manualmente:
```powershell
.\stop-app.ps1
```

### Maven no encontrado

El script intentará usar:
1. Maven instalado globalmente
2. Maven wrapper (mvnw.cmd) si existe
3. Maven de IntelliJ IDEA si está instalado

Si ninguno funciona, instala Maven o crea el wrapper:
```bash
mvn wrapper:wrapper
```

---

## 🎯 Atajos Rápidos

### Crear acceso directo en el escritorio:

1. Clic derecho en `start-app.ps1`
2. "Crear acceso directo"
3. Arrastrar al escritorio
4. Renombrar a "Iniciar TTS App"

### Agregar al menú de inicio:

1. Copiar `start-app.ps1` a:
   ```
   C:\Users\[TuUsuario]\AppData\Roaming\Microsoft\Windows\Start Menu\Programs
   ```

---

## ⚡ Inicio Rápido con Docker (Opcional)

Si prefieres usar Docker:
```bash
docker-compose up -d
```

Esto inicia:
- PostgreSQL
- Backend
- Frontend

Todo automáticamente en contenedores.

---

## 📝 Notas

- Los scripts abren ventanas separadas para cada servicio
- Puedes cerrar las ventanas para detener los servicios
- El navegador se abre automáticamente después de 15-20 segundos
- Si algo falla, revisa las ventanas de PowerShell/CMD para ver los errores

---

## 🆘 Ayuda

Si tienes problemas:
1. Revisa `ERRORS_GUIDE.md` para errores comunes
2. Verifica que todos los requisitos estén instalados
3. Asegúrate de que los puertos 8080 y 5173 estén libres
4. Revisa los logs en las ventanas de PowerShell/CMD

