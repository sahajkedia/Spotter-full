from rest_framework import serializers
from .models import Trip, Route, LogSheet, LogEntry


class RouteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Route
        fields = '__all__'


class LogEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = LogEntry
        fields = '__all__'


class LogSheetSerializer(serializers.ModelSerializer):
    entries = LogEntrySerializer(many=True, read_only=True)
    
    class Meta:
        model = LogSheet
        fields = '__all__'


class TripSerializer(serializers.ModelSerializer):
    routes = RouteSerializer(many=True, read_only=True)
    log_sheets = LogSheetSerializer(many=True, read_only=True)
    
    class Meta:
        model = Trip
        fields = '__all__'


class TripCreateSerializer(serializers.ModelSerializer):
    current_location = serializers.CharField(required=False, allow_blank=True, default='')
    
    class Meta:
        model = Trip
        fields = ['current_location', 'pickup_location', 'dropoff_location', 'current_cycle_hours']
    
    def create(self, validated_data):
        # Set a default driver or make it optional
        validated_data['driver'] = None  # Make driver optional for now
        return super().create(validated_data) 