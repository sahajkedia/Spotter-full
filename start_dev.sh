#!/bin/bash

# Function to cleanup processes on exit
cleanup() {
    echo -e "\nShutting down servers..."
    kill $DJANGO_PID $REACT_PID 2>/dev/null
    exit 0
}

# Set trap to cleanup on script exit
trap cleanup SIGINT SIGTERM

# Start Django backend
echo "Starting Django backend..."
cd backend

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "Error: Virtual environment not found. Please run:"
    echo "cd backend && python3 -m venv venv"
    echo "source venv/bin/activate && pip install -r ../requirements.txt"
    exit 1
fi

# Activate virtual environment
source venv/bin/activate

# Check if Django is installed
if ! python -c "import django" 2>/dev/null; then
    echo "Error: Django not found. Please install dependencies:"
    echo "source venv/bin/activate && pip install -r ../requirements.txt"
    exit 1
fi

# Start Django server
echo "Starting Django server on http://localhost:8000..."
python manage.py runserver 0.0.0.0:8000 &
DJANGO_PID=$!

# Wait a moment for Django to start
sleep 3

# Check if Django started successfully
if ! curl -s http://localhost:8000/admin/ > /dev/null; then
    echo "Warning: Django server may not have started properly"
fi

# Start React frontend
echo "Starting React frontend..."
cd ../frontend

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "Installing React dependencies..."
    npm install
fi

# Start React server
echo "Starting React server on http://localhost:3000..."
npm start &
REACT_PID=$!

echo ""
echo "✅ Development servers started!"
echo "🌐 Django backend: http://localhost:8000"
echo "⚛️  React frontend: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop both servers"

# Wait for user to stop
wait $DJANGO_PID $REACT_PID 