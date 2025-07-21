# Trucking ELD System

A full-stack application for generating route instructions and Electronic Logging Device (ELD) logs for trucking operations. Built with Django (backend) and React (frontend).

## Features

- **Trip Planning**: Create trips with pickup and dropoff locations
- **Route Calculation**: Automatically calculate optimal routes with rest stops and fuel stops
- **ELD Log Generation**: Generate compliant Electronic Logging Device logs
- **Hours of Service Compliance**: Ensure compliance with 70-hour/8-day rule
- **Modern UI**: Beautiful, responsive interface built with Material-UI

## Technology Stack

### Backend

- **Django 4.2.7**: Web framework
- **Django REST Framework**: API framework
- **Geopy**: Geocoding and distance calculations
- **SQLite**: Database (can be easily changed to PostgreSQL/MySQL)

### Frontend

- **React 18**: Frontend framework
- **Material-UI**: UI component library
- **React Router**: Client-side routing
- **Axios**: HTTP client
- **Leaflet**: Map integration (ready for implementation)

## Prerequisites

- Python 3.8+
- Node.js 16+
- npm or yarn

## Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd Spotter-full
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python3 -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
venv\Scripts\activate

# Install dependencies
pip install -r ../requirements.txt

# Run migrations
python manage.py migrate

# Create superuser (optional)
python manage.py createsuperuser

# Start the development server
python manage.py runserver
```

The Django backend will be available at `http://localhost:8000`

### 3. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm start
```

The React frontend will be available at `http://localhost:3000`

## API Endpoints

### Trips

- `GET /api/trips/` - List all trips
- `POST /api/trips/create/` - Create a new trip
- `GET /api/trips/{id}/` - Get trip details

### Route Calculation

- `GET /api/calculate-route/` - Calculate route without creating trip

### Log Sheets

- `GET /api/log-sheets/{id}/` - Get log sheet details

## Usage

### Creating a Trip

1. Navigate to the home page
2. Enter the following information:

   - **Current Location**: Your current position
   - **Pickup Location**: Where to pick up the load
   - **Dropoff Location**: Where to deliver the load
   - **Current Cycle Hours**: Hours already used in the current 8-day cycle

3. Click "Calculate Route" to preview the route
4. Click "Create Trip & Generate Logs" to create the trip and generate ELD logs

### Viewing Trip Details

1. Navigate to "Trip History" to see all created trips
2. Click "View Details" on any trip to see:
   - Route information with waypoints
   - Generated ELD log sheets
   - Hours of service compliance data

## ELD Compliance Features

The system automatically ensures compliance with:

- **70-Hour/8-Day Rule**: Tracks cycle hours used and remaining
- **11-Hour Driving Limit**: Calculates required rest periods
- **10-Hour Off-Duty Requirement**: Ensures adequate rest periods
- **Fuel Stop Planning**: Schedules fuel stops every 1000 miles

## Project Structure

```
Spotter-full/
├── backend/                 # Django backend
│   ├── trucking_eld/       # Django project settings
│   ├── eld_api/           # Main application
│   │   ├── models.py      # Database models
│   │   ├── views.py       # API views
│   │   ├── serializers.py # DRF serializers
│   │   └── services.py    # Business logic
│   └── requirements.txt   # Python dependencies
├── frontend/              # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   │   ├── TripForm.js
│   │   │   ├── TripList.js
│   │   │   ├── TripDetail.js
│   │   │   └── Navigation.js
│   │   └── App.js
│   └── package.json
└── README.md
```

## Deployment

### Backend Deployment

The Django backend can be deployed to:

- Heroku
- DigitalOcean
- AWS
- Any platform supporting Python

### Frontend Deployment

The React frontend can be deployed to:

- Vercel (recommended)
- Netlify
- GitHub Pages
- Any static hosting service

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support or questions, please open an issue in the repository.
