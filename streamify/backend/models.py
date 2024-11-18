from django.db import models

# Create your models here.
class Movies(models.Model):
    title = models.CharField(max_length=100)
    desc = models.TextField(max_length=500)
    image = models.ImageField(null=True,blank=True,upload_to="posters/")