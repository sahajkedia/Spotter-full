#!/bin/bash

echo "🚀 Starting deployment process..."

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "❌ Git repository not found. Please initialize git first:"
    echo "   git init"
    echo "   git add ."
    echo "   git commit -m 'Initial commit'"
    exit 1
fi

# Check if we're on main branch
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "main" ]; then
    echo "⚠️  You're not on the main branch. Current branch: $CURRENT_BRANCH"
    read -p "Continue anyway? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Build frontend
echo "📦 Building frontend..."
cd frontend
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Frontend build failed"
    exit 1
fi
cd ..

# Commit changes
echo "💾 Committing changes..."
git add .
git commit -m "Deploy: Production build ready"

# Push to remote
echo "📤 Pushing to remote repository..."
git push origin main

echo "✅ Deployment preparation complete!"
echo ""
echo "🎯 Next steps:"
echo ""
echo "1. Frontend (Vercel):"
echo "   - Go to https://vercel.com"
echo "   - Connect your GitHub repository"
echo "   - Set environment variable: REACT_APP_API_URL=https://your-backend-url.railway.app"
echo "   - Deploy!"
echo ""
echo "2. Backend (Railway):"
echo "   - Go to https://railway.app"
echo "   - Connect your GitHub repository"
echo "   - Add PostgreSQL database"
echo "   - Set environment variables:"
echo "     - SECRET_KEY: Generate a secure Django secret key"
echo "     - DATABASE_URL: Railway will provide this"
echo "   - Deploy!"
echo ""
echo "3. Update CORS settings in backend/trucking_eld/settings_production.py"
echo "   with your Vercel domain"
echo ""
echo "🌐 Your app will be live at:"
echo "   Frontend: https://your-app.vercel.app"
echo "   Backend: https://your-app.railway.app" 