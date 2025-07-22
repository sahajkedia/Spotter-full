#!/bin/bash

echo "🚀 Starting Spotter Keep-Alive Service..."
echo "📡 This will keep your backend warm every 30 minutes"
echo "🎯 Target: https://eld-connect.onrender.com"
echo ""

# Navigate to keep-alive directory
cd keep-alive

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Start the keep-alive service
echo "🔄 Starting keep-alive service..."
echo "Press Ctrl+C to stop"
echo ""

npm start 