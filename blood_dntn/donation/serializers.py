from rest_framework import serializers
from .models import BloodRequest, DonationResponse, BloodBank, BloodInventory
from app.serializers import UserProfileSerializer

class BloodRequestSerializer(serializers.ModelSerializer):
    requester = UserProfileSerializer(read_only=True)
    
    class Meta:
        model = BloodRequest
        fields = '__all__'
        read_only_fields = ('requester', 'created_at', 'updated_at')

class DonationResponseSerializer(serializers.ModelSerializer):
    donor = UserProfileSerializer(read_only=True)
    blood_request = BloodRequestSerializer(read_only=True)
    
    class Meta:
        model = DonationResponse
        fields = '__all__'
        read_only_fields = ('donor', 'created_at', 'updated_at')

class BloodBankSerializer(serializers.ModelSerializer):
    class Meta:
        model = BloodBank
        fields = '__all__'

class BloodInventorySerializer(serializers.ModelSerializer):
    blood_bank = BloodBankSerializer(read_only=True)
    
    class Meta:
        model = BloodInventory
        fields = '__all__'