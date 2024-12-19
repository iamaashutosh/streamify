from rest_framework import serializers
from .models import Movies
from django.contrib.auth.models import User
from .models import UserProfile


class MovieSerializer(serializers.ModelSerializer):
    class Meta:
        model=Movies
        fields='__all__'

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model=User
        fields = ['first_name','last_name','email','username','password']
        extra_kwargs = {"password":{"write_only":True}}

    def create(self,validated_data):
        user = User.objects.create_user(**validated_data)
        UserProfile.objects.create(user=user,first_name = user.first_name,last_name = user.last_name,email=user.email)
        return user
    
class LoginSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username','password']

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields='__all__'
        read_only_fields=['user']
        