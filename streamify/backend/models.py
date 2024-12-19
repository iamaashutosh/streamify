from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class Movies(models.Model):
    title = models.CharField(max_length=100)
    desc = models.TextField(max_length=500)
    image = models.ImageField(null=True,blank=True,upload_to="posters/")
    video = models.FileField(null=True,blank=True,upload_to="videos/")

class UserProfile(models.Model):
    user = models.OneToOneField(User,on_delete=models.CASCADE)
    first_name=models.CharField(null=True)
    last_name=models.CharField(null=True)
    email  = models.CharField(null=True)
    image = models.ImageField(null=True,blank=True,upload_to="user_images/")
