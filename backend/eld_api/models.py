from django.db import models
from django.contrib.auth.models import User
from decimal import Decimal


class Trip(models.Model):
    """Model for storing trip information"""
    driver = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    current_location = models.CharField(max_length=255, blank=True, default='')
    pickup_location = models.CharField(max_length=255)
    dropoff_location = models.CharField(max_length=255)
    current_cycle_hours = models.DecimalField(max_digits=5, decimal_places=2, default=Decimal('0.00'))
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # Calculated fields
    total_distance = models.DecimalField(max_digits=8, decimal_places=2, null=True, blank=True)
    estimated_duration = models.DecimalField(max_digits=6, decimal_places=2, null=True, blank=True)
    
    def __str__(self):
        return f"Trip from {self.pickup_location} to {self.dropoff_location}"


class Route(models.Model):
    """Model for storing route information"""
    trip = models.ForeignKey(Trip, on_delete=models.CASCADE, related_name='routes')
    sequence = models.IntegerField()
    location = models.CharField(max_length=255)
    location_type = models.CharField(max_length=50, choices=[
        ('pickup', 'Pickup'),
        ('dropoff', 'Dropoff'),
        ('rest', 'Rest Stop'),
        ('fuel', 'Fuel Stop'),
        ('waypoint', 'Waypoint'),
    ])
    distance_from_previous = models.DecimalField(max_digits=8, decimal_places=2, null=True, blank=True)
    estimated_arrival = models.DateTimeField(null=True, blank=True)
    duration_hours = models.DecimalField(max_digits=4, decimal_places=2, default=Decimal('0.00'))
    
    class Meta:
        ordering = ['sequence']
    
    def __str__(self):
        return f"{self.get_location_type_display()}: {self.location}"


class LogSheet(models.Model):
    """Model for storing ELD log sheet information"""
    trip = models.ForeignKey(Trip, on_delete=models.CASCADE, related_name='log_sheets')
    date = models.DateField()
    driver_name = models.CharField(max_length=255)
    vehicle_id = models.CharField(max_length=50, default='Truck-001')
    
    # Hours of service
    driving_hours = models.DecimalField(max_digits=4, decimal_places=2, default=Decimal('0.00'))
    on_duty_hours = models.DecimalField(max_digits=4, decimal_places=2, default=Decimal('0.00'))
    off_duty_hours = models.DecimalField(max_digits=4, decimal_places=2, default=Decimal('0.00'))
    sleeper_hours = models.DecimalField(max_digits=4, decimal_places=2, default=Decimal('0.00'))
    
    # Cycle information
    cycle_hours_used = models.DecimalField(max_digits=5, decimal_places=2, default=Decimal('0.00'))
    cycle_hours_remaining = models.DecimalField(max_digits=5, decimal_places=2, default=Decimal('70.00'))
    
    # Trip information
    total_distance = models.DecimalField(max_digits=8, decimal_places=2, default=Decimal('0.00'))
    fuel_stops = models.IntegerField(default=0)
    rest_stops = models.IntegerField(default=0)
    
    def __str__(self):
        return f"Log Sheet - {self.date} - {self.driver_name}"


class LogEntry(models.Model):
    """Model for storing individual log entries"""
    log_sheet = models.ForeignKey(LogSheet, on_delete=models.CASCADE, related_name='entries')
    time = models.TimeField()
    status = models.CharField(max_length=20, choices=[
        ('driving', 'Driving'),
        ('on_duty', 'On Duty'),
        ('off_duty', 'Off Duty'),
        ('sleeper', 'Sleeper Berth'),
    ])
    location = models.CharField(max_length=255)
    remarks = models.TextField(blank=True)
    
    class Meta:
        ordering = ['time']
    
    def __str__(self):
        return f"{self.time} - {self.get_status_display()} - {self.location}"
