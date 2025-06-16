#!/bin/bash

# Recipe Book - Full Stack Startup Script (Linux/Mac)

echo "
╔══════════════════════════════════════════════════════════════╗
║                    🍳 Recipe Book Application                ║
║              Frontend + Backend Startup Script              ║
╚══════════════════════════════════════════════════════════════╝
"

echo "[1/4] 🔧 Setting up Backend..."
echo "========================================"

cd backend

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
source venv/bin/activate

# Install dependencies
echo "📚 Installing backend dependencies..."
pip install fastapi uvicorn[standard] python-multipart pydantic

echo ""
echo "[2/4] 🚀 Starting Backend Server..."
echo "========================================"

# Start backend in background
python3 -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload &
BACKEND_PID=$!

sleep 3

echo ""
echo "[3/4] 📦 Setting up Frontend..."
echo "========================================"

cd ..

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    npm install
fi

echo ""
echo "[4/4] 🎨 Starting Frontend Server..."
echo "========================================"

# Start frontend in background
npm run dev &
FRONTEND_PID=$!

sleep 3

echo "
╔══════════════════════════════════════════════════════════════╗
║                        🎉 ALL SET!                          ║
║                                                              ║
║  📱 Frontend: http://localhost:5173                         ║
║  🔧 Backend:  http://localhost:8000                         ║
║  📚 API Docs: http://localhost:8000/docs                    ║
║                                                              ║
║  Press Ctrl+C to stop both servers...                       ║
╚══════════════════════════════════════════════════════════════╝
"

# Function to cleanup processes
cleanup() {
    echo ""
    echo "🛑 Stopping servers..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    echo "✅ Servers stopped successfully!"
    exit 0
}

# Trap Ctrl+C
trap cleanup INT

# Wait for user input
wait
