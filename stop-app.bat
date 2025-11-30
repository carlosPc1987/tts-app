@echo off
REM Script para detener la aplicación TTS App (Windows Batch)
REM Ubicación: C:\Users\cadec\tts-app\stop-app.bat

echo ========================================
echo   TTS APP - DETENER APLICACION
echo ========================================
echo.

echo Deteniendo procesos...

REM Detener procesos Java (Backend)
tasklist /FI "IMAGENAME eq java.exe" 2>NUL | find /I /N "java.exe">NUL
if "%ERRORLEVEL%"=="0" (
    echo Deteniendo Backend (Java)...
    taskkill /F /IM java.exe >nul 2>&1
    echo [OK] Backend detenido
) else (
    echo [INFO] Backend no estaba corriendo
)

REM Detener procesos Node (Frontend)
tasklist /FI "IMAGENAME eq node.exe" 2>NUL | find /I /N "node.exe">NUL
if "%ERRORLEVEL%"=="0" (
    echo Deteniendo Frontend (Node)...
    taskkill /F /IM node.exe >nul 2>&1
    echo [OK] Frontend detenido
) else (
    echo [INFO] Frontend no estaba corriendo
)

echo.
echo ========================================
echo   APLICACION DETENIDA
echo ========================================
echo.
pause
