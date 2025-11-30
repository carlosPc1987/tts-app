@echo off
REM Script de inicio automático para TTS App (Windows Batch)
REM Ubicación: C:\Users\cadec\tts-app\start-app.bat

echo ========================================
echo   TTS APP - INICIO AUTOMATICO
echo ========================================
echo.

REM Cambiar al directorio del proyecto
cd /d "C:\Users\cadec\tts-app"

REM Configurar Java
set JAVA_HOME=C:\Program Files\Java\jdk-21
echo [OK] Java configurado
echo.

REM Detener procesos existentes
echo Deteniendo procesos existentes...
taskkill /F /IM java.exe >nul 2>&1
taskkill /F /IM node.exe >nul 2>&1
timeout /t 2 /nobreak >nul
echo [OK] Procesos detenidos
echo.

REM Iniciar Backend
echo Iniciando Backend (Spring Boot)...
start "TTS Backend" cmd /k "set JAVA_HOME=C:\Program Files\Java\jdk-21 && cd /d C:\Users\cadec\tts-app && echo === SPRING BOOT BACKEND === && echo Puerto: http://localhost:8080 && echo. && mvnw.cmd spring-boot:run"
timeout /t 3 /nobreak >nul
echo [OK] Backend iniciado
echo.

REM Iniciar Frontend
echo Iniciando Frontend (React + Vite)...
start "TTS Frontend" cmd /k "cd /d C:\Users\cadec\tts-app\frontend && echo === REACT FRONTEND (Vite) === && echo Puerto: http://localhost:5173 && echo. && npm run dev"
timeout /t 3 /nobreak >nul
echo [OK] Frontend iniciado
echo.

REM Esperar y abrir navegador
echo Esperando 15 segundos para que los servicios inicien...
timeout /t 15 /nobreak >nul

echo.
echo ========================================
echo   APLICACION INICIADA
echo ========================================
echo.
echo Enlaces:
echo   Frontend: http://localhost:5173
echo   Backend:  http://localhost:8080
echo   Swagger:  http://localhost:8080/swagger-ui.html
echo.

REM Abrir navegador
echo Abriendo navegador...
start http://localhost:5173
echo [OK] Navegador abierto
echo.
echo Presiona cualquier tecla para salir (los servicios seguiran corriendo)...
pause >nul
