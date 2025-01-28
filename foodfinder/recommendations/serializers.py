from rest_framework import serializers
from .models import Recommendations, CustomUser
from .models import Restaurant
from django.contrib.auth.hashers import make_password

class RecommendationsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Recommendations
        fields = '__all__'

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['profile_picture']