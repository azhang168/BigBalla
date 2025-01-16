from django.db import models
from django.contrib.auth.models import User
import uuid
# Create your models here.
class Recommendations(models.Model):
    name = models.CharField(max_length=100, null=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    
class Restaurant(models.Model):
    name = models.CharField(primary_key=True, max_length=100)
    location = models.CharField(max_length=50)
    budget = models.IntegerField(null=True)
    rating = models.FloatField(null=True)
    recommendations = models.ManyToManyField(Recommendations)