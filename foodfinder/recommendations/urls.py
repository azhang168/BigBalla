from django.contrib import admin
from django.urls import path
from .views import *

urlpatterns = [
    path('signup/', SignupView.as_view(), name='signup'),
    path('login/', LoginView.as_view(), name='login'),
    path('my-recommendations/', MyRecommendationsView.as_view(), name='my-recommendations'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('edit-profile/', EditProfileView.as_view(), name='edit'),
    path('get-recommendation/', GetRecommendation.as_view, name='get-recommendation'),
]

