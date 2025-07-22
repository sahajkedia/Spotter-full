# 🚀 Free Deployment Guide

This guide will help you deploy your Trucking ELD application completely for free using Vercel (frontend) and Railway (backend).

## 📋 Prerequisites

- GitHub account
- Vercel account (free)
- Railway account (free tier available)

## 🎯 Step-by-Step Deployment

### Step 1: Prepare Your Repository

1. **Initialize Git** (if not already done):
```bash
git init
git add .
git commit -m "Initial commit"
```

2. **Create GitHub Repository**:
   - Go to [GitHub](https://github.com)
   - Create a new repository
   - Push your code:
```bash
git remote add origin https://github.com/yourusername/your-repo-name.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy Backend to Railway

1. **Go to Railway**:
   - Visit [railway.app](https://railway.app)
   - Sign up with GitHub

2. **Create New Project**:
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository

3. **Configure Backend**:
   - Railway will detect it's a Python project
   - Set the root directory to `backend`
   - Add environment variables:
     - `SECRET_KEY`: Generate a secure key (use [this generator](https://djecrety.ir/))
     - `DJANGO_SETTINGS_MODULE`: `trucking_eld.settings_production`

4. **Add PostgreSQL Database**:
   - Click "New" → "Database" → "PostgreSQL"
   - Railway will automatically set `DATABASE_URL`

5. **Deploy**:
   - Railway will automatically deploy when you push changes
   - Note your backend URL (e.g., `https://your-app.railway.app`)

### Step 3: Deploy Frontend to Vercel

1. **Go to Vercel**:
   - Visit [vercel.com](https://vercel.com)
   - Sign up with GitHub

2. **Import Project**:
   - Click "New Project"
   - Import your GitHub repository
   - Set root directory to `frontend`

3. **Configure Environment Variables**:
   - Add: `REACT_APP_API_URL` = your Railway backend URL
   - Example: `https://your-app.railway.app`

4. **Deploy**:
   - Click "Deploy"
   - Vercel will build and deploy automatically
   - Note your frontend URL (e.g., `https://your-app.vercel.app`)

### Step 4: Update CORS Settings

1. **Update Backend CORS**:
   - Go to your Railway project
   - Edit `backend/trucking_eld/settings_production.py`
   - Update `CORS_ALLOWED_ORIGINS` with your Vercel domain:
```python
CORS_ALLOWED_ORIGINS = [
    "https://your-app.vercel.app",
    "http://localhost:3000",
]
```

2. **Redeploy Backend**:
   - Commit and push the changes
   - Railway will automatically redeploy

### Step 5: Test Your Deployment

1. **Test Frontend**: Visit your Vercel URL
2. **Test Backend**: Visit your Railway URL + `/api/trips/`
3. **Test Full Flow**: Create a trip and download PDF

## 🔧 Troubleshooting

### Common Issues:

1. **CORS Errors**:
   - Check CORS settings in `settings_production.py`
   - Ensure frontend URL is in `CORS_ALLOWED_ORIGINS`

2. **Database Errors**:
   - Check Railway database is running
   - Verify `DATABASE_URL` environment variable

3. **Build Errors**:
   - Check Railway logs for Python errors
   - Check Vercel logs for React build errors

4. **API Connection Issues**:
   - Verify `REACT_APP_API_URL` is correct
   - Check backend is accessible

### Railway Free Tier Limits:
- **Monthly Usage**: $5 credit (usually sufficient for small apps)
- **Sleep After Inactivity**: App may sleep after 30 minutes
- **Database**: 1GB PostgreSQL included

### Vercel Free Tier Limits:
- **Bandwidth**: 100GB/month
- **Build Time**: 6000 minutes/month
- **Custom Domains**: Unlimited

## 🎉 Success!

Your Trucking ELD application is now live at:
- **Frontend**: `https://your-app.vercel.app`
- **Backend**: `https://your-app.railway.app`

## 📞 Support

If you encounter issues:
1. Check the logs in Railway/Vercel dashboards
2. Verify all environment variables are set
3. Test locally first to isolate issues

## 🔄 Updates

To update your deployed app:
1. Make changes locally
2. Test locally
3. Commit and push to GitHub
4. Railway and Vercel will automatically redeploy 