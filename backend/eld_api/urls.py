from django.urls import path
from . import views

urlpatterns = [
    path('trips/', views.trip_list, name='trip_list'),
    path('trips/create/', views.create_trip, name='create_trip'),
    path('trips/<int:trip_id>/', views.trip_detail, name='trip_detail'),
    path('log-sheets/<int:log_sheet_id>/', views.log_sheet_detail, name='log_sheet_detail'),
    path('log-sheets/<int:log_sheet_id>/pdf/', views.download_log_sheet_pdf, name='download_log_sheet_pdf'),
    path('calculate-route/', views.calculate_route_only, name='calculate_route_only'),
] 