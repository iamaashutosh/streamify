from django.shortcuts import render
from rest_framework import generics
from .models import Movies
from .serializers import *
from django.contrib.auth.models import User
from rest_framework.permissions import AllowAny,IsAuthenticated



#Create your views here.
class ListCreateMovies(generics.ListCreateAPIView):
    queryset=Movies.objects.all()
    serializer_class = MovieSerializer

class UpdateDetailMovie(generics.RetrieveUpdateAPIView):
    queryset=Movies.objects.all()
    serializer_class=MovieSerializer
    lookup_field='pk'

class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class= UserSerializer
    permission_classes=[AllowAny]
