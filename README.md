# 🚛 Trucking ELD System

A full-stack Electronic Logging Device (ELD) system built with Django and React for trucking companies to manage driver logs and route planning.

## 🌟 Features

- **Trip Management**: Create and manage trucking trips
- **Route Calculation**: Automatic route planning with rest stops and fuel stops
- **ELD Compliance**: Generate compliant driver log sheets
- **PDF Export**: Download professional PDF log sheets
- **Mobile Responsive**: Works perfectly on all devices
- **Real-time Validation**: Instant form validation and feedback

## 🚀 Live Demo

- **Frontend**: [Your Vercel URL]
- **Backend API**: [Your Railway URL]

## 🛠️ Tech Stack

### Frontend
- React 19
- Material-UI
- Axios
- React Router

### Backend
- Django 4.2
- Django REST Framework
- PostgreSQL
- ReportLab (PDF generation)
- Geopy (distance calculations)

## 📦 Installation

### Prerequisites
- Node.js 18+
- Python 3.8+
- Git

### Local Development

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd Spotter-full
```

2. **Backend Setup**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

3. **Frontend Setup**
```bash
cd frontend
npm install
npm start
```

4. **Access the application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000

## 🚀 Deployment

### Frontend Deployment (Vercel)

1. **Push to GitHub**
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

2. **Deploy to Vercel**
- Go to [vercel.com](https://vercel.com)
- Connect your GitHub repository
- Set environment variables:
  - `REACT_APP_API_URL`: Your backend URL
- Deploy!

### Backend Deployment (Railway)

1. **Prepare for Railway**
```bash
cd backend
# Ensure requirements.txt and Procfile are ready
```

2. **Deploy to Railway**
- Go to [railway.app](https://railway.app)
- Connect your GitHub repository
- Add PostgreSQL database
- Set environment variables:
  - `SECRET_KEY`: Generate a secure Django secret key
  - `DATABASE_URL`: Railway will provide this
- Deploy!

3. **Update CORS Settings**
- Update `CORS_ALLOWED_ORIGINS` in `settings_production.py` with your Vercel domain

## 📋 Environment Variables

### Frontend (.env.production)
```
REACT_APP_API_URL=https://your-backend-url.railway.app
```

### Backend (Railway Environment Variables)
```
SECRET_KEY=your-secure-secret-key
DATABASE_URL=postgresql://...
```

## 🎯 Usage

1. **Create a Trip**
   - Enter pickup and dropoff locations
   - Specify current cycle hours
   - Submit to generate route and logs

2. **View Trip Details**
   - See complete route with waypoints
   - View generated ELD log sheets
   - Download PDF versions

3. **Manage Trips**
   - View trip history
   - Access detailed information
   - Download compliance documents

## 🔧 API Endpoints

- `POST /api/trips/create/` - Create new trip
- `GET /api/trips/` - List all trips
- `GET /api/trips/{id}/` - Get trip details
- `GET /api/calculate-route/` - Calculate route only
- `GET /api/log-sheets/{id}/pdf/` - Download PDF log sheet

## 📄 License

MIT License

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📞 Support

For support, email [your-email] or create an issue in the repository.
