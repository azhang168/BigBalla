from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.
class CustomUser(AbstractUser):
    profile_picture = models.ImageField(upload_to='profile_pics/', default='/DefaultProfilePicture.png', blank=True, null=True)

    groups = models.ManyToManyField(
        'auth.Group',
        related_name='customuser_set',  # Change related_name to avoid clashes
        blank=True
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='customuser_set',  # Change related_name to avoid clashes
        blank=True
    )

class Recommendations(models.Model):
    name = models.CharField(max_length=100, null=True)
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    
class Restaurant(models.Model):
    name = models.CharField(primary_key=True, max_length=100)
    location = models.CharField(max_length=50)
    budget = models.IntegerField(null=True)
    rating = models.FloatField(null=True)
    recommendations = models.ManyToManyField(Recommendations)
    