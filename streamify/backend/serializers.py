from rest_framework import serializers
from .models import Movies,Subscription
from django.contrib.auth.models import User
from .models import *


class MovieSerializer(serializers.ModelSerializer):
    class Meta:
        model=Movies
        fields='__all__'
    # def update(self, instance, validated_data):
    #     # Handle file fields conditionally
    #     image = validated_data.get('image', None)
    #     video = validated_data.get('video', None)
    #     banner = validated_data.get('banner', None)

    #     if image is None and 'image' not in self.initial_data:
    #         validated_data['image'] = instance.image
    #     if video is None and 'video' not in self.initial_data:
    #         validated_data['video'] = instance.video
    #     if banner is None and 'banner' not in self.initial_data:
    #         validated_data['banner'] = instance.banner

    #     return super().update(instance, validated_data)

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model=User
        fields = ['first_name','last_name','email','username','password','is_superuser']
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



class TypeSerializer(serializers.ModelSerializer):
    
    movies = serializers.PrimaryKeyRelatedField(
        queryset=Movies.objects.all(), many=True
    )
    movies_info = MovieSerializer(source='movies', many=True, read_only=True)
    class Meta:
        model = Type
        fields=['id','name','movies','movies_info']

class CastSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cast
        fields='__all__'

class PlanSerializer(serializers.ModelSerializer):
    class Meta:
        model=Plan
        fields='__all__'

class SubscriptionSerializer(serializers.ModelSerializer):
    plan = PlanSerializer(source='plan', read_only=True)
    class Meta:
        model = Subscription
        fields = '__all__'
        read_only_fields = ['user', 'start_date', 'end_date','plan']

    def create(self, validated_data):
        user = self.context['request'].user
        if Subscription.objects.filter(user=user).exists()and Subscription.objects.get(user=user).plan.name != 'Free':
            raise serializers.ValidationError("User already has a subscription.")
        
        validated_data['user'] = user
        return super().create(validated_data)
    
class WatchHistorySerializer(serializers.ModelSerializer):
    movies_info = MovieSerializer(source='movie')
    class Meta:
        model = WatchHistory
        fields =['user','movie','watched_at','movies_info']

class WatchlistSerializer(serializers.ModelSerializer):
    movies_info = MovieSerializer(source='movie',read_only=True)
    class Meta:
        model = Watchlist
        fields = ['id', 'movie', 'added_at','movies_info']
        read_only_fields=['movies_info']