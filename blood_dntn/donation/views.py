from rest_framework import generics, filters
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import BloodRequest, DonationResponse, BloodBank, BloodInventory
from .serializers import (BloodRequestSerializer, DonationResponseSerializer,
                         BloodBankSerializer, BloodInventorySerializer)

class BloodRequestListCreateView(generics.ListCreateAPIView):
    serializer_class = BloodRequestSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['blood_group_needed', 'urgency', 'status', 'city']
    search_fields = ['hospital_name', 'contact_person']
    ordering_fields = ['created_at', 'needed_by_date', 'urgency']
    ordering = ['-created_at']
    
    def get_queryset(self):
        return BloodRequest.objects.filter(status='active')
    
    def perform_create(self, serializer):
        serializer.save(requester=self.request.user)

class BloodRequestDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = BloodRequestSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return BloodRequest.objects.filter(requester=self.request.user)

class DonationResponseListCreateView(generics.ListCreateAPIView):
    serializer_class = DonationResponseSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return DonationResponse.objects.filter(donor=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(donor=self.request.user)

class BloodBankListView(generics.ListAPIView):
    queryset = BloodBank.objects.filter(is_active=True)
    serializer_class = BloodBankSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['city', 'state']
    search_fields = ['name', 'city', 'state']

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def blood_inventory_view(request):
    inventory = BloodInventory.objects.select_related('blood_bank').all()
    serializer = BloodInventorySerializer(inventory, many=True)
    return Response(serializer.data)