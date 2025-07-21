import requests
from datetime import datetime, timedelta
from decimal import Decimal
from geopy.geocoders import Nominatim
from geopy.distance import geodesic
import math


class RouteService:
    """Service for calculating routes and stops"""
    
    def __init__(self):
        self.geolocator = Nominatim(user_agent="trucking_eld_app")
    
    def get_coordinates(self, location):
        """Get coordinates for a location string"""
        try:
            location_data = self.geolocator.geocode(location)
            if location_data:
                return (location_data.latitude, location_data.longitude)
            return None
        except Exception as e:
            print(f"Error geocoding {location}: {e}")
            return None
    
    def calculate_distance(self, location1, location2):
        """Calculate distance between two locations"""
        coords1 = self.get_coordinates(location1)
        coords2 = self.get_coordinates(location2)
        
        if coords1 and coords2:
            return geodesic(coords1, coords2).miles
        return None
    
    def calculate_route(self, pickup_location, dropoff_location, current_cycle_hours):
        """Calculate route with rest stops and fuel stops"""
        total_distance = self.calculate_distance(pickup_location, dropoff_location)
        if not total_distance:
            return None
        
        # Calculate estimated driving time (assuming 60 mph average)
        estimated_driving_hours = total_distance / 60
        
        # Calculate required rest stops
        # Property-carrying drivers: 11 hours driving max, 10 hours off-duty required
        max_driving_hours = 11
        required_rest_hours = 10
        
        # Calculate how many rest periods needed
        rest_periods_needed = math.ceil(estimated_driving_hours / max_driving_hours)
        
        # Calculate fuel stops (every 1000 miles)
        fuel_stops_needed = math.ceil(total_distance / 1000)
        
        # Generate route waypoints
        route_points = []
        
        # Add pickup location
        route_points.append({
            'sequence': 1,
            'location': pickup_location,
            'location_type': 'pickup',
            'distance_from_previous': 0,
            'duration_hours': 1  # 1 hour for pickup
        })
        
        # Add rest stops
        for i in range(rest_periods_needed):
            # Calculate rest stop location (approximately 1/3, 2/3 of the way)
            progress = (i + 1) / (rest_periods_needed + 1)
            route_points.append({
                'sequence': len(route_points) + 1,
                'location': f"Rest Stop {i+1}",
                'location_type': 'rest',
                'distance_from_previous': total_distance * progress / (rest_periods_needed + 1),
                'duration_hours': required_rest_hours
            })
        
        # Add fuel stops
        for i in range(fuel_stops_needed):
            fuel_progress = (i + 1) / (fuel_stops_needed + 1)
            route_points.append({
                'sequence': len(route_points) + 1,
                'location': f"Fuel Stop {i+1}",
                'location_type': 'fuel',
                'distance_from_previous': total_distance * fuel_progress / (fuel_stops_needed + 1),
                'duration_hours': 0.5  # 30 minutes for fueling
            })
        
        # Add dropoff location
        route_points.append({
            'sequence': len(route_points) + 1,
            'location': dropoff_location,
            'location_type': 'dropoff',
            'distance_from_previous': total_distance / (len(route_points) + 1),
            'duration_hours': 1  # 1 hour for dropoff
        })
        
        return {
            'total_distance': total_distance,
            'estimated_driving_hours': estimated_driving_hours,
            'rest_periods_needed': rest_periods_needed,
            'fuel_stops_needed': fuel_stops_needed,
            'route_points': route_points
        }


class ELDService:
    """Service for generating ELD logs"""
    
    def __init__(self):
        self.max_cycle_hours = 70  # 70 hours in 8 days
        self.max_driving_hours = 11  # 11 hours max driving
        self.required_rest_hours = 10  # 10 hours off-duty required
    
    def generate_log_sheets(self, trip, route_data):
        """Generate ELD log sheets for the trip"""
        total_distance = route_data['total_distance']
        estimated_hours = route_data['estimated_driving_hours']
        
        # Calculate how many days this trip will take
        days_needed = math.ceil(estimated_hours / self.max_driving_hours)
        
        log_sheets = []
        current_date = datetime.now().date()
        
        for day in range(days_needed):
            log_sheet = {
                'date': current_date + timedelta(days=day),
                'driver_name': 'John Driver',  # Default name
                'vehicle_id': 'Truck-001',
                'driving_hours': min(self.max_driving_hours, estimated_hours - (day * self.max_driving_hours)),
                'on_duty_hours': min(self.max_driving_hours + 2, estimated_hours - (day * self.max_driving_hours) + 2),
                'off_duty_hours': self.required_rest_hours,
                'sleeper_hours': 0,
                'cycle_hours_used': trip.current_cycle_hours + (day * self.max_driving_hours),
                'cycle_hours_remaining': self.max_cycle_hours - (trip.current_cycle_hours + (day * self.max_driving_hours)),
                'total_distance': total_distance / days_needed if day < days_needed - 1 else total_distance - (total_distance / days_needed * (days_needed - 1)),
                'fuel_stops': 1 if day % 2 == 0 else 0,  # Fuel every other day
                'rest_stops': 1,
                'entries': self.generate_log_entries(day, route_data)
            }
            log_sheets.append(log_sheet)
        
        return log_sheets
    
    def generate_log_entries(self, day, route_data):
        """Generate individual log entries for a day"""
        entries = []
        base_time = datetime.now().replace(hour=6, minute=0, second=0, microsecond=0)  # Start at 6 AM
        
        # Add driving entry
        entries.append({
            'time': (base_time + timedelta(hours=1)).time(),
            'status': 'driving',
            'location': route_data['route_points'][0]['location'],
            'remarks': f'Day {day + 1} - Start driving'
        })
        
        # Add rest entry
        rest_time = base_time + timedelta(hours=self.max_driving_hours + 1)
        entries.append({
            'time': rest_time.time(),
            'status': 'off_duty',
            'location': 'Rest Stop',
            'remarks': f'Day {day + 1} - Required rest period'
        })
        
        return entries 