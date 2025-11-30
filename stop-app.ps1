# Script para detener la aplicación TTS App
# Ubicación: C:\Users\cadec\tts-app\stop-app.ps1

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  TTS APP - DETENER APLICACIÓN" -ForegroundColor Red
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Deteniendo procesos..." -ForegroundColor Yellow

# Detener procesos Java (Backend)
$javaProcs = Get-Process | Where-Object {$_.ProcessName -like "*java*"}
if ($javaProcs) {
    Write-Host "Deteniendo Backend (Java)..." -ForegroundColor Yellow
    $javaProcs | Stop-Process -Force
    Write-Host "✓ Backend detenido" -ForegroundColor Green
} else {
    Write-Host "⚠ Backend no estaba corriendo" -ForegroundColor Yellow
}

# Detener procesos Node (Frontend)
$nodeProcs = Get-Process | Where-Object {$_.ProcessName -like "*node*"}
if ($nodeProcs) {
    Write-Host "Deteniendo Frontend (Node)..." -ForegroundColor Yellow
    $nodeProcs | Stop-Process -Force
    Write-Host "✓ Frontend detenido" -ForegroundColor Green
} else {
    Write-Host "⚠ Frontend no estaba corriendo" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  APLICACIÓN DETENIDA" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Presiona cualquier tecla para salir..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
