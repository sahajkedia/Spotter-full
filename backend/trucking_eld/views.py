from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

@csrf_exempt
def health_check(request):
    """Health check endpoint for deployment monitoring."""
    return JsonResponse({
        'status': 'healthy',
        'message': 'Django backend is running successfully'
    })

@csrf_exempt
def root_view(request):
    """Root endpoint to handle requests to /"""
    return JsonResponse({
        'message': 'Spotter Backend API',
        'endpoints': {
            'health': '/health/',
            'api_test': '/api/test/',
            'trips': '/api/trips/',
            'create_trip': '/api/trips/create/',
            'calculate_route': '/api/calculate-route/'
        },
        'status': 'running'
    }) 