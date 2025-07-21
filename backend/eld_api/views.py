from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.http import HttpResponse
from .models import Trip, Route, LogSheet, LogEntry
from .serializers import TripSerializer, TripCreateSerializer, LogSheetSerializer
from .services import RouteService, ELDService
from .pdf_service import ELDPDFService
from decimal import Decimal


@api_view(['POST'])
def create_trip(request):
    """Create a new trip and calculate route"""
    serializer = TripCreateSerializer(data=request.data)
    if serializer.is_valid():
        trip = serializer.save()
        
        # Calculate route
        route_service = RouteService()
        route_data = route_service.calculate_route(
            trip.pickup_location,
            trip.dropoff_location,
            trip.current_cycle_hours
        )
        
        if route_data:
            # Update trip with calculated data
            trip.total_distance = route_data['total_distance']
            trip.estimated_duration = route_data['estimated_driving_hours']
            trip.save()
            
            # Create route entries
            for point in route_data['route_points']:
                Route.objects.create(
                    trip=trip,
                    sequence=point['sequence'],
                    location=point['location'],
                    location_type=point['location_type'],
                    distance_from_previous=point['distance_from_previous'],
                    duration_hours=point['duration_hours']
                )
            
            # Generate ELD logs
            eld_service = ELDService()
            log_sheets_data = eld_service.generate_log_sheets(trip, route_data)
            
            for sheet_data in log_sheets_data:
                log_sheet = LogSheet.objects.create(
                    trip=trip,
                    date=sheet_data['date'],
                    driver_name=sheet_data['driver_name'],
                    vehicle_id=sheet_data['vehicle_id'],
                    driving_hours=sheet_data['driving_hours'],
                    on_duty_hours=sheet_data['on_duty_hours'],
                    off_duty_hours=sheet_data['off_duty_hours'],
                    sleeper_hours=sheet_data['sleeper_hours'],
                    cycle_hours_used=sheet_data['cycle_hours_used'],
                    cycle_hours_remaining=sheet_data['cycle_hours_remaining'],
                    total_distance=sheet_data['total_distance'],
                    fuel_stops=sheet_data['fuel_stops'],
                    rest_stops=sheet_data['rest_stops']
                )
                
                # Create log entries
                for entry_data in sheet_data['entries']:
                    LogEntry.objects.create(
                        log_sheet=log_sheet,
                        time=entry_data['time'],
                        status=entry_data['status'],
                        location=entry_data['location'],
                        remarks=entry_data['remarks']
                    )
            
            # Return complete trip data
            trip_serializer = TripSerializer(trip)
            return Response({
                'trip': trip_serializer.data,
                'route_data': route_data,
                'message': 'Trip created successfully with route and ELD logs'
            }, status=status.HTTP_201_CREATED)
        else:
            trip.delete()
            return Response({
                'error': 'Could not calculate route for the given locations'
            }, status=status.HTTP_400_BAD_REQUEST)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def trip_detail(request, trip_id):
    """Get detailed trip information"""
    trip = get_object_or_404(Trip, id=trip_id)
    serializer = TripSerializer(trip)
    return Response(serializer.data)


@api_view(['GET'])
def trip_list(request):
    """Get list of all trips"""
    trips = Trip.objects.all().order_by('-created_at')
    serializer = TripSerializer(trips, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def log_sheet_detail(request, log_sheet_id):
    """Get detailed log sheet information"""
    log_sheet = get_object_or_404(LogSheet, id=log_sheet_id)
    serializer = LogSheetSerializer(log_sheet)
    return Response(serializer.data)


@api_view(['GET'])
def calculate_route_only(request):
    """Calculate route without creating a trip"""
    pickup_location = request.GET.get('pickup_location')
    dropoff_location = request.GET.get('dropoff_location')
    current_cycle_hours = request.GET.get('current_cycle_hours', 0)
    
    if not pickup_location or not dropoff_location:
        return Response({
            'error': 'pickup_location and dropoff_location are required'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        current_cycle_hours = Decimal(current_cycle_hours)
    except (ValueError, TypeError):
        current_cycle_hours = Decimal('0.00')
    
    route_service = RouteService()
    route_data = route_service.calculate_route(
        pickup_location,
        dropoff_location,
        current_cycle_hours
    )
    
    if route_data:
        return Response(route_data)
    else:
        return Response({
            'error': 'Could not calculate route for the given locations'
        }, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def download_log_sheet_pdf(request, log_sheet_id):
    """Download ELD log sheet as PDF"""
    log_sheet = get_object_or_404(LogSheet, id=log_sheet_id)
    trip = log_sheet.trip
    
    pdf_service = ELDPDFService()
    buffer = pdf_service.generate_log_sheet_pdf(log_sheet, trip)
    
    response = HttpResponse(buffer.getvalue(), content_type='application/pdf')
    response['Content-Disposition'] = f'attachment; filename="eld_log_sheet_{log_sheet.date}.pdf"'
    
    return response
