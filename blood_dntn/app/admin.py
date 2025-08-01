from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser

class CustomUserAdmin(UserAdmin):
    model = CustomUser
    list_display = ('username', 'email', 'first_name', 'last_name', 'blood_group', 'user_type', 'is_staff')
    list_filter = ('blood_group', 'user_type', 'is_staff', 'is_active', 'city', 'state')
    fieldsets = UserAdmin.fieldsets + (
        ('Additional Info', {
            'fields': ('phone', 'blood_group', 'user_type', 'date_of_birth', 'address', 
                      'city', 'state', 'pincode', 'is_available', 'last_donation_date')
        }),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        ('Additional Info', {
            'fields': ('phone', 'blood_group', 'user_type', 'date_of_birth', 'address',
                      'city', 'state', 'pincode')
        }),
    )

admin.site.register(CustomUser, CustomUserAdmin)