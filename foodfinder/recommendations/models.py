from django.db import models
import uuid
# Create your models here.
class User(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4)
    name = models.CharField(max_length=50, null=True)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=50)

class Recommendations(models.Model):
    name = models.CharField(max_length=100, null=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    
class Restaurant(models.Model):
    name = models.CharField(primary_key=True, max_length=100)
    location = models.CharField(max_length=50)
    budget = models.IntegerField(null=True)
    rating = models.FloatField(null=True)
    recommendations = models.ManyToManyField(Recommendations)