@echo off
echo ====================================================================
echo Starting ASCENTIA AI - Smart Skilling Navigator Platform
echo ====================================================================
echo.

echo Launching FastAPI Backend Server on http://127.0.0.1:8000 ...
start "Backend - FastAPI" cmd /k "cd /d "%~dp0backend" && python main.py"

echo Launching React Frontend Server on http://localhost:5173 ...
start "Frontend - React Vite" cmd /k "cd /d "%~dp0frontend" && npm run dev"

echo.
echo ====================================================================
echo Success! Both servers are starting up in separate windows.
echo Open http://localhost:5173 in your browser to view the app!
echo ====================================================================
