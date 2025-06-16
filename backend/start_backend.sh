#!/bin/bash

# Script to start the FastAPI backend server with real-time recipe search

echo "🍳 Starting Recipe Search Backend Server..."
echo "========================================"

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python -m venv venv
fi

# Activate virtual environment
echo "🔧 Activating virtual environment..."
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
    source venv/Scripts/activate
else
    source venv/bin/activate
fi

# Install/upgrade dependencies
echo "📚 Installing dependencies..."
pip install --upgrade pip
pip install -r requirements.txt

# Check if all required packages are installed
echo "✅ Checking dependencies..."
python -c "
import fastapi
import uvicorn
import sqlalchemy
import pydantic
print('✅ All required packages are installed!')
"

# Start the FastAPI server
echo ""
echo "🚀 Starting FastAPI server on http://localhost:8000"
echo "📱 API Documentation: http://localhost:8000/docs"
echo "🔍 Live Search Endpoint: http://localhost:8000/search/live"
echo "💡 Search Suggestions: http://localhost:8000/search/suggestions"
echo ""
echo "Press Ctrl+C to stop the server"
echo "========================================"

python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload --log-level info
