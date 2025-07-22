# Railway Deployment Guide

## Prerequisites

- Railway account
- GitHub repository connected to Railway
- PostgreSQL database (Railway provides this)

## Deployment Steps

### 1. Environment Variables

Set these environment variables in your Railway project:

```
DEBUG=False
SECRET_KEY=your-secret-key-here
DATABASE_URL=your-railway-postgres-url
```

### 2. Database Setup

- Create a PostgreSQL database in Railway
- The `DATABASE_URL` will be automatically provided
- Django will automatically run migrations on deployment

### 3. Deployment Configuration

The following files have been configured for Railway deployment:

- `railway.json` - Railway-specific configuration
- `runtime.txt` - Python version specification
- `Procfile` - Process definition
- `requirements.txt` - Python dependencies
- `.railwayignore` - Files to exclude from deployment

### 4. Build Process

The deployment will:

1. Install Python dependencies
2. Run database migrations
3. Collect static files
4. Start the Gunicorn server

### 5. Health Check

After deployment, you can check if the app is running by visiting:
`https://your-app.railway.app/health/`

### 6. Troubleshooting

#### Common Issues:

1. **Build fails**: Check the build logs in Railway dashboard
2. **Database connection**: Ensure `DATABASE_URL` is set correctly
3. **Static files**: Ensure `STATIC_ROOT` is configured
4. **Port binding**: Ensure the app binds to `$PORT` environment variable

#### Debug Mode:

To enable debug mode for troubleshooting, set:

```
DEBUG=True
```

### 7. Monitoring

- Check Railway dashboard for deployment status
- Monitor logs for any errors
- Use the health check endpoint to verify the app is running

## File Structure

```
backend/
├── railway.json          # Railway configuration
├── runtime.txt           # Python version
├── Procfile             # Process definition
├── requirements.txt     # Dependencies
├── .railwayignore      # Ignore files
├── manage.py           # Django management
├── trucking_eld/       # Django project
│   ├── settings.py     # Settings (updated for production)
│   ├── urls.py         # URL configuration
│   └── views.py        # Health check view
└── eld_api/            # Django app
```
