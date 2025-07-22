from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

@csrf_exempt
def health_check(request):
    """Health check endpoint for deployment monitoring."""
    return JsonResponse({
        'status': 'healthy',
        'message': 'Django backend is running successfully'
    }) 