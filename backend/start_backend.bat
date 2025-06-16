@echo off
REM Windows batch script to start the FastAPI backend server

echo 🍳 Starting Recipe Search Backend Server...
echo ========================================

REM Check if virtual environment exists
if not exist "venv" (
    echo 📦 Creating virtual environment...
    python -m venv venv
)

REM Activate virtual environment
echo 🔧 Activating virtual environment...
call venv\Scripts\activate.bat

REM Install/upgrade dependencies
echo 📚 Installing dependencies...
python -m pip install --upgrade pip
pip install -r requirements.txt

REM Check if all required packages are installed
echo ✅ Checking dependencies...
python -c "import fastapi; import uvicorn; import sqlalchemy; import pydantic; print('✅ All required packages are installed!')"

REM Start the FastAPI server
echo.
echo 🚀 Starting FastAPI server on http://localhost:8000
echo 📱 API Documentation: http://localhost:8000/docs
echo 🔍 Live Search Endpoint: http://localhost:8000/search/live
echo 💡 Search Suggestions: http://localhost:8000/search/suggestions
echo.
echo Press Ctrl+C to stop the server
echo ========================================

python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload --log-level info

pause
