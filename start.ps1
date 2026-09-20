# ASCENTIA AI Platform PowerShell Launcher
Write-Host "====================================================================" -ForegroundColor Cyan
Write-Host "Starting ASCENTIA AI - Smart Skilling Navigator Platform" -ForegroundColor Green
Write-Host "====================================================================" -ForegroundColor Cyan

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path

Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$ScriptDir/backend'; python main.py"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$ScriptDir/frontend'; npm run dev"

Write-Host "Both servers launched! Open http://localhost:5173" -ForegroundColor Yellow
