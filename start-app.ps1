# Script de inicio automático para TTS App
# Ubicación: C:\Users\cadec\tts-app\start-app.ps1

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  TTS APP - INICIO AUTOMÁTICO" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Configurar Java
$env:JAVA_HOME = "C:\Program Files\Java\jdk-21"
Write-Host "✓ Java configurado: $env:JAVA_HOME" -ForegroundColor Green

# Cambiar al directorio del proyecto
$projectPath = "C:\Users\cadec\tts-app"
Set-Location $projectPath
Write-Host "✓ Directorio: $projectPath" -ForegroundColor Green
Write-Host ""

# Detener procesos existentes
Write-Host "Deteniendo procesos existentes..." -ForegroundColor Yellow
Get-Process | Where-Object {$_.ProcessName -like "*java*"} | Stop-Process -Force -ErrorAction SilentlyContinue
Get-Process | Where-Object {$_.ProcessName -like "*node*"} | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2
Write-Host "✓ Procesos detenidos" -ForegroundColor Green
Write-Host ""

# Iniciar Backend
Write-Host "Iniciando Backend (Spring Boot)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "`$env:JAVA_HOME = 'C:\Program Files\Java\jdk-21'; cd '$projectPath'; Write-Host '=== SPRING BOOT BACKEND ===' -ForegroundColor Green; Write-Host 'Puerto: http://localhost:8080' -ForegroundColor Cyan; Write-Host ''; .\mvnw.cmd spring-boot:run" -WindowStyle Normal
Start-Sleep -Seconds 3
Write-Host "✓ Backend iniciado" -ForegroundColor Green
Write-Host ""

# Iniciar Frontend
Write-Host "Iniciando Frontend (React + Vite)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$projectPath\frontend'; Write-Host '=== REACT FRONTEND (Vite) ===' -ForegroundColor Green; Write-Host 'Puerto: http://localhost:5173' -ForegroundColor Cyan; Write-Host ''; npm run dev" -WindowStyle Normal
Start-Sleep -Seconds 3
Write-Host "✓ Frontend iniciado" -ForegroundColor Green
Write-Host ""

# Esperar y abrir navegador
Write-Host "Esperando 15 segundos para que los servicios inicien..." -ForegroundColor Yellow
Start-Sleep -Seconds 15

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  APLICACIÓN INICIADA" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Enlaces:" -ForegroundColor Yellow
Write-Host "  Frontend: http://localhost:5173" -ForegroundColor Cyan
Write-Host "  Backend:  http://localhost:8080" -ForegroundColor Cyan
Write-Host "  Swagger:  http://localhost:8080/swagger-ui.html" -ForegroundColor Cyan
Write-Host ""

# Abrir navegador
Write-Host "Abriendo navegador..." -ForegroundColor Yellow
Start-Process "http://localhost:5173"
Write-Host "✓ Navegador abierto" -ForegroundColor Green
Write-Host ""
Write-Host "Presiona cualquier tecla para salir (los servicios seguiran corriendo)..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey('NoEcho,IncludeKeyDown')
