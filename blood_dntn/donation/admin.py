from django.contrib import admin
from .models import BloodRequest, DonationResponse, BloodBank, BloodInventory

@admin.register(BloodRequest)
class BloodRequestAdmin(admin.ModelAdmin):
    list_display = ('blood_group_needed', 'units_needed', 'urgency', 'status', 'hospital_name', 'created_at')
    list_filter = ('blood_group_needed', 'urgency', 'status', 'created_at')
    search_fields = ('hospital_name', 'contact_person', 'requester__username')
    date_hierarchy = 'created_at'

@admin.register(DonationResponse)
class DonationResponseAdmin(admin.ModelAdmin):
    list_display = ('donor', 'blood_request', 'status', 'created_at')
    list_filter = ('status', 'created_at')
    search_fields = ('donor__username', 'blood_request__hospital_name')

@admin.register(BloodBank)
class BloodBankAdmin(admin.ModelAdmin):
    list_display = ('name', 'city', 'state', 'phone', 'is_active')
    list_filter = ('city', 'state', 'is_active')
    search_fields = ('name', 'city', 'license_number')

@admin.register(BloodInventory)
class BloodInventoryAdmin(admin.ModelAdmin):
    list_display = ('blood_bank', 'blood_group', 'units_available', 'last_updated')
    list_filter = ('blood_group', 'blood_bank__city')
    search_fields = ('blood_bank__name',)
from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password

User = get_user_model()

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, validators=[validate_password])
    password_confirm = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'password_confirm', 'first_name', 
                 'last_name', 'phone', 'blood_group', 'user_type', 'date_of_birth',
                 'address', 'city', 'state', 'pincode')
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError("Passwords don't match")
        return attrs
    
    def create(self, validated_data):
        validated_data.pop('password_confirm')
        user = User.objects.create_user(**validated_data)
        return user

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 'phone',
                 'blood_group', 'user_type', 'date_of_birth', 'address', 'city',
                 'state', 'pincode', 'is_available', 'last_donation_date')
        read_only_fields = ('id', 'username')
