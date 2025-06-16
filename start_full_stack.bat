@echo off
title Recipe Book - Full Stack Startup
color 0A

echo.
echo  ╔══════════════════════════════════════════════════════════════╗
echo  ║                    🍳 Recipe Book Application                ║
echo  ║              Frontend + Backend Startup Script              ║
echo  ╚══════════════════════════════════════════════════════════════╝
echo.

echo [1/4] 🔧 Setting up Backend...
echo ========================================

cd backend

REM Check if virtual environment exists
if not exist "Lib" (
    echo 📦 Installing backend dependencies...
    py -m pip install fastapi uvicorn[standard] python-multipart pydantic
)

echo.
echo [2/4] 🚀 Starting Backend Server...
echo ========================================

start "Recipe Backend API" cmd /k "py -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload"

timeout /t 3 /nobreak >nul

echo.
echo [3/4] 📦 Setting up Frontend...
echo ========================================

cd ..

REM Check if node_modules exists
if not exist "node_modules" (
    echo 📦 Installing frontend dependencies...
    npm install
)

echo.
echo [4/4] 🎨 Starting Frontend Server...
echo ========================================

start "Recipe Frontend" cmd /k "npm run dev"

timeout /t 3 /nobreak >nul

echo.
echo  ╔══════════════════════════════════════════════════════════════╗
echo  ║                        🎉 ALL SET!                          ║
echo  ║                                                              ║
echo  ║  📱 Frontend: http://localhost:5173                         ║
echo  ║  🔧 Backend:  http://localhost:8000                         ║
echo  ║  📚 API Docs: http://localhost:8000/docs                    ║
echo  ║                                                              ║
echo  ║  Press any key to close this window...                      ║
echo  ╚══════════════════════════════════════════════════════════════╝
echo.

pause >nul
