from django.shortcuts import render
from rest_framework import generics
from rest_framework.generics import mixins
from rest_framework.views import APIView
from .models import Movies
from .serializers import *
from django.contrib.auth.models import User
from rest_framework.permissions import AllowAny,IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from django_filters.rest_framework import DjangoFilterBackend



#Create your views here.
class ListCreateMovies(generics.ListCreateAPIView):
    queryset=Movies.objects.all()
    serializer_class = MovieSerializer
    authentication_classes=[JWTAuthentication]
    permission_classes=[IsAuthenticated]


class UpdateDetailMovie(generics.RetrieveUpdateAPIView):
    queryset=Movies.objects.all()
    serializer_class=MovieSerializer
    authentication_classes=[JWTAuthentication]
    lookup_field='pk'

class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class= UserSerializer
    permission_classes=[AllowAny]

class SearchMovie(generics.ListAPIView):
    queryset=Movies.objects.all()
    serializer_class = MovieSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields=['title']
