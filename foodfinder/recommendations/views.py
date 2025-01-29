from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Recommendations, Restaurant, CustomUser
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.status import HTTP_200_OK, HTTP_401_UNAUTHORIZED
from django.contrib.auth import authenticate
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import permission_classes
from .serializers import RecommendationsSerializer, ProfileSerializer
from rest_framework.parsers import MultiPartParser, FormParser
from datetime import datetime
import openai
import os
from dotenv import load_dotenv
import json
from django.http import JsonResponse

load_dotenv()
openai.api_key = os.getenv("OPENAPI_API_KEY")


# Create your views here.
class SignupView(APIView):
    def post(self, request):
        username = request.data.get('email')
        password = request.data.get('password')
        email = request.data.get('email')

        if CustomUser.objects.filter(username=username).exists():
            return Response({'error': 'Username already exists'}, status=status.HTTP_400_BAD_REQUEST)

        user = CustomUser.objects.create_user(username=username, password=password, email=email)
        return Response({'message': 'User created successfully'}, status=status.HTTP_201_CREATED)

class LoginView(APIView):
    def post(self, request):
        username = request.data.get('email')
        password = request.data.get('password')

        user = authenticate(username=username, password=password)
        if user is not None:
            refresh = RefreshToken.for_user(user)
            user.last_login = datetime.now()
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'first_name': user.first_name,
                'last_name': user.last_name,
            })
        return Response({'error': 'Email or password is incorrect'}, status=status.HTTP_401_UNAUTHORIZED)
    
class LogoutView(APIView):
    def post(self, request):
        try:
            refresh_token = request.data.get('refresh_token')
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({"message": "You are now logged out"})
        except Exception:
            return Response({"error": "Invalid token"}, status=status.HTTP_400_BAD_REQUEST)

@permission_classes([IsAuthenticated])    
class MyRecommendationsView(APIView):
    def get(self, request):
        try:
            user = request.user
            recommendations = Recommendations.objects.filter(user=user)
            seralizer = RecommendationsSerializer(recommendations, many=True)
            return Response({'data': seralizer.data}, status=status.HTTP_200_OK)
        except Exception:
            return Response({'error': 'User not found'}, status=status.HTTP_400_BAD_REQUEST)
        
class ProfilePictureUpdateView(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request, format=None):
        user = user.request
        serializer = ProfileSerializer(user, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@permission_classes([IsAuthenticated])
class EditProfileView(APIView):
    def post(self, request):
        try:
            user = request.user
            first_name = request.data.get('first_name')
            last_name = request.data.get('last_name')
            user.first_name = first_name
            user.last_name = last_name
            user.save()
            return Response({"message": "Profile updated"}, status=status.HTTP_200_OK)
        except Exception as e:
            print(e)
            return Response({"error": "Name not provided"}, status=status.HTTP_400_BAD_REQUEST)
        
class GetRecommendation(APIView):
    def post(self, request):
        try:
            data = json.loads(request.body)
            location = data.get('city')
            budget = data.get('budget')
            rating = data.get('rating')
            num_people = data.get('num_people')
            prompt = (
                f"Recommend restaurants in {location} for {num_people} people "
                f"with a budget of {budget} per person and a minimum rating of {rating}. "
                f"Provide the response in JSON format with the following keys: name, location, budget, rating."
            )
            response = openai.ChatCompletion.create(
                model='gpt-4o-mini',
                messages=[{"role": "system", "content": "You are a helpful assistant."},
                          {"role": "user", "content": prompt}],
                response_format="json"
            )
            recommendations = json.loads(response["choices"][0]["message"]["content"])
            for restaurant in recommendations:
                restaurant = Restaurant.objects.create(
                    name = restaurant['name'], 
                    location = restaurant['location'], 
                    budget = restaurant['budget'],
                    rating = restaurant['rating']
                    )
            return JsonResponse(recommendations, safe=False)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)