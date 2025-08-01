from django.urls import path
from . import views

urlpatterns = [
    path('blood-requests/', views.BloodRequestListCreateView.as_view(), name='blood-requests'),
    path('blood-requests/<int:pk>/', views.BloodRequestDetailView.as_view(), name='blood-request-detail'),
    path('donation-responses/', views.DonationResponseListCreateView.as_view(), name='donation-responses'),
    path('blood-banks/', views.BloodBankListView.as_view(), name='blood-banks'),
    path('blood-inventory/', views.blood_inventory_view, name='blood-inventory'),
]