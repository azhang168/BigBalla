from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Recommendations
from .models import Restaurant
from django.contrib.auth.hashers import make_password

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['email', 'password']
    def create(self, validated_data):
        if User.objects.filter(username=validated_data['email']).exists():
            raise serializers.ValidationError("Email already registered")
        user = User.objects.create_user(
            username=validated_data['email'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user

class RecommendationsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Recommendations
        fields = '__all__'

class RestaurantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Restaurant
        fields = '__all__'