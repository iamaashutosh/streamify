from django.shortcuts import render
from rest_framework import generics
from rest_framework.response import Response
from rest_framework.generics import mixins
from rest_framework.views import APIView
from rest_framework.decorators import api_view,permission_classes,authentication_classes
from .models import Movies
from .serializers import *
from django.contrib.auth.models import User
from rest_framework.permissions import AllowAny,IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework_simplejwt.views import TokenObtainPairView,TokenRefreshView

from .authentication import CookiesJWTAuthentication



#Create your views here.

class CustomTokenObtainPairView(TokenObtainPairView):

    def post(self, request, *args, **kwargs):
        try:
            response = super().post(request, *args, **kwargs)
            tokens = response.data

            access_token = tokens['access']
            refresh_token = tokens['refresh']

            seriliazer = UserSerializer(request.user, many=False)

            res = Response()

            res.data = {'success':True}

            res.set_cookie(
                key='access_token',
                value=str(access_token),
                httponly=True,
                secure=True,
                samesite='None',
                path='/'
            )

            res.set_cookie(
                key='refresh_token',
                value=str(refresh_token),
                httponly=True,
                secure=True,
                samesite='None',
                path='/'
            )
            res.data.update(tokens)
            return res
        
        except Exception as e:
            print(e)
            return Response({'success':False})
        
class CustomTokenRefreshView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        try:
            refresh_token = request.COOKIES.get('refresh_token')

            request.data['refresh'] = refresh_token

            response = super().post(request, *args, **kwargs)
            
            tokens = response.data
            access_token = tokens['access']

            res = Response()

            res.data = {'refreshed': True}

            res.set_cookie(
                key='access_token',
                value=access_token,
                httponly=True,
                secure=False,
                samesite='None',
                path='/'
            )
            return res

        except Exception as e:
            print(e)
            return Response({'refreshed': False})

@api_view(['POST'])
def logout(request):
    try:
        res=Response()
        res.data={'success':True}
        res.delete_cookie('access_token',path="/",samesite='None')
        res.delete_cookie('refresh_token',path="/",samesite='None')
        return res
    
    except:
        Response({'success':False})


class ListMovies(generics.ListCreateAPIView):
    queryset=Movies.objects.all()
    serializer_class = MovieSerializer
    # authentication_classes=[CookiesJWTAuthentication]
    # permission_classes=[IsAuthenticated]

    def post(self,request,*args, **kwargs):
        if request.user.is_supreuser:
            self.post(request.data)
        else:
            return Response({"You are not authenticated."})



class UpdateDetailMovie(generics.RetrieveUpdateAPIView):
    queryset=Movies.objects.all()
    serializer_class=MovieSerializer
    authentication_classes=[CookiesJWTAuthentication]
    permission_classes=[IsAuthenticated]
    lookup_field='pk'

class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class= UserSerializer
    permission_classes=[AllowAny]

class SearchMovie(generics.ListAPIView):
    queryset=Movies.objects.all()
    serializer_class = MovieSerializer
    # filter_backends = [DjangoFilterBackend]
    # filterset_fields=['title']
    def get_queryset(self):
        qs = Movies.objects.all()
        title = self.request.query_params.get('title')
        if title is not None:
            qs=qs.filter(title__icontains=title)
        return qs


@api_view(['GET'])
@authentication_classes([CookiesJWTAuthentication])
@permission_classes([IsAuthenticated])
def is_logged_in(request):
    serializer = UserSerializer(request.user)
    return Response(serializer.data)



# @api_view(['POST'])
# @authentication_classes(CookiesJWTAuthentication)
# @permission_classes([IsAuthenticated])
# def my_func(request):
#     return Response({"Hello":"World"})

# @api_view(["POST"])
# def is_authenticated(request):
#     if not request.user.is_authenticated:
#         return Response({'detail': 'Authentication credentials were not provided.'}, status=401)
#     return Response({'Authenticated': True})