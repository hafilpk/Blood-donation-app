from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    BLOOD_GROUPS = [
        ('A+', 'A+'), ('A-', 'A-'),
        ('B+', 'B+'), ('B-', 'B-'),
        ('AB+', 'AB+'), ('AB-', 'AB-'),
        ('O+', 'O+'), ('O-', 'O-'),
    ]
    
    USER_TYPES = [
        ('donor', 'Donor'),
        ('recipient', 'Recipient'),
        ('hospital', 'Hospital'),
        ('admin', 'Admin'),
    ]
    
    phone = models.CharField(max_length=15, blank=True)
    blood_group = models.CharField(max_length=3, choices=BLOOD_GROUPS, blank=True)
    user_type = models.CharField(max_length=10, choices=USER_TYPES, default='donor')
    date_of_birth = models.DateField(null=True, blank=True)
    address = models.TextField(blank=True)
    city = models.CharField(max_length=100, blank=True)
    state = models.CharField(max_length=100, blank=True)
    pincode = models.CharField(max_length=10, blank=True)
    is_available = models.BooleanField(default=True)
    last_donation_date = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.username} - {self.blood_group} ({self.user_type})"
