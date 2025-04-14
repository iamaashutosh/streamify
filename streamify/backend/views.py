from django.shortcuts import HttpResponse
from rest_framework import generics
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import api_view,permission_classes,authentication_classes,parser_classes
from .serializers import *
from django.contrib.auth.models import User
from rest_framework.permissions import AllowAny,IsAuthenticated
from rest_framework_simplejwt.views import TokenObtainPairView,TokenRefreshView
from rest_framework import status
from rest_framework.exceptions import PermissionDenied
from .models import *
from django_filters import rest_framework as filters
from django.conf import settings
import stripe
from .authentication import CookiesJWTAuthentication
from .email import send_email
from django.views.decorators.csrf import csrf_exempt
from datetime import datetime

from collections import Counter
import random
import zipfile
from rest_framework.parsers import MultiPartParser
import pandas as pd
from django.core.files.base import ContentFile
from django.core.files import File



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

stripe.api_key = settings.STRIPE_TEST_SECRET_KEY

class CreateSubscriptionSession(APIView):
    def post(self, request):
        # Get the plan (assuming you have only one monthly plan)
        try:
            plan = Plan.objects.get(stripe_price_id=settings.STRIPE_PRICE_ID)
        except Plan.DoesNotExist:
            return Response({'error': 'Plan not found'}, status=status.HTTP_404_NOT_FOUND)

        # Create a new Checkout Session
        checkout_session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=[{
                'price': settings.STRIPE_PRICE_ID,
                'quantity': 1,
            }],
            mode='subscription',
            success_url='http://localhost:3000/success' + '?session_id={CHECKOUT_SESSION_ID}',
            cancel_url=request.build_absolute_uri('/cancel'),
            metadata={
                'user_id': request.user.id,
                'plan_id': plan.id
            }
        )
        
        return Response({'sessionId': checkout_session['id']}, status=status.HTTP_200_OK)

        
class SubscriptionSuccess(APIView):
    def get(self, request):
        session_id = request.GET.get('session_id')
        if not session_id:
            return Response({'error': 'Session ID not provided'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            # Retrieve the session from Stripe
            session = stripe.checkout.Session.retrieve(session_id)
            
            # Get the subscription from Stripe
            stripe_subscription = stripe.Subscription.retrieve(session.subscription)
            
            # Get user and plan from session metadata
            user_id = session.metadata.get('user_id')
            user_email = User.objects.get(id=user_id).email
            plan_id = session.metadata.get('plan_id')
            
            if not user_id or not plan_id:
                return Response({'error': 'User or plan information missing'}, status=status.HTTP_400_BAD_REQUEST)
            
            try:
                user = User.objects.get(id=user_id)
                plan = Plan.objects.get(id=plan_id)
            except (User.DoesNotExist, Plan.DoesNotExist) as e:
                return Response({'error': str(e)}, status=status.HTTP_404_NOT_FOUND)
            
            # Create or update the subscription
            subscription, created = Subscription.objects.update_or_create(
                user=user,
                defaults={
                    'plan': plan,
                    'end_date': timezone.now() + timedelta(days=plan.duration),
                    'stripe_subscription_id': stripe_subscription.id,
                    'active': True
                }
            )
            em = "aashuparajuli31@gmail.com"
            send_email(user_email)
            send_email(em)
            
            return Response({
                'status': 'success',
                'customer_email': session.customer_details.email,
                'subscription_id': subscription.id,
                'plan_name': plan.name,
                'end_date': subscription.end_date
            })
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
@csrf_exempt
def stripe_webhook(request):
    payload = request.body
    sig_header = request.META['HTTP_STRIPE_SIGNATURE']
    event = None

    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, settings.STRIPE_WEBHOOK_SECRET_KEY
        )
    except ValueError as e:
        return HttpResponse(status=400)
    except stripe.error.SignatureVerificationError as e:
        return HttpResponse(status=400)

    # Handle checkout.session.completed event
    if event['type'] == 'checkout.session.completed':
        session = event['data']['object']
        # Fulfill the purchase
        handle_successful_payment(session)
    if event['type'] == 'invoice.paid':
        invoice = event['data']['object']
        subscription_id = invoice['subscription']
        
        try:
            subscription = Subscription.objects.get(stripe_subscription_id=subscription_id)
            subscription.end_date = timezone.now() + timedelta(days=30)  # Renew for another month
            subscription.save()
        except Subscription.DoesNotExist:
            pass  # Handle error

    elif event['type'] == 'invoice.payment_failed':
        # Handle payment failure
        invoice = event['data']['object']
        subscription_id = invoice['subscription']
        
        try:
            subscription = Subscription.objects.get(stripe_subscription_id=subscription_id)
            subscription.active = False
            subscription.save()
            # Notify user about payment failure
        except Subscription.DoesNotExist:
            pass

    return HttpResponse(status=200)

def handle_successful_payment(session):

    user_id = session.metadata.get('user_id')
    plan_id = session.metadata.get('plan_id')
    
    if not user_id or not plan_id:
        return False
    
    try:
        user = User.objects.get(id=user_id)
        plan = Plan.objects.get(id=plan_id)
        stripe_subscription = stripe.Subscription.retrieve(session.subscription)
        
        Subscription.objects.update_or_create(
            user=user,
            defaults={
                'plan': plan,
                'end_date': timezone.now() + timedelta(days=plan.duration),
                'stripe_subscription_id': stripe_subscription.id,
                'active': True
            }
        )
        return True
    except Exception as e:
        return False
    
class CancelSubscription(APIView):
    def post(self, request):
        user = request.user
        
        # Check if user has an active subscription
        try:
            subscription = Subscription.objects.get(user=user, active=True)
        except Subscription.DoesNotExist:
            return Response(
                {"error": "No active subscription found."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            # Cancel subscription in Stripe
            # stripe_sub = stripe.Subscription.delete(subscription.stripe_subscription_id)

            # Update local DB (set to free plan or mark inactive)
            free_plan = Plan.objects.get(name="Free")  # You should have a free plan
            subscription.plan = free_plan
            subscription.active = False
            subscription.save()

            return Response(
                {"status": "Subscription cancelled successfully."},
                status=status.HTTP_200_OK
            )
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout(request):

    try:

        res = Response()
        res.data = {'success':True}
        res.delete_cookie('access_token', path='/', samesite='None')
        res.delete_cookie('response_token', path='/', samesite='None')

        return res

    except Exception as e:
        print(e)
        return Response({'success':False})

class MoviesFilter(filters.FilterSet):
    title = filters.CharFilter(lookup_expr='icontains')
    category = filters.ChoiceFilter(choices=Movies.CATEGORY.choices)
    rating = filters.NumberFilter(lookup_expr='gte')
    is_premium = filters.BooleanFilter()
    release_date = filters.DateTimeFromToRangeFilter()
    class Meta:
        model = Movies
        fields = ['title', 'category', 'rating', 'is_premium', 'release_date']


class ListMovies(generics.ListCreateAPIView):
    queryset=Movies.objects.all()
    serializer_class = MovieSerializer
    authentication_classes=[CookiesJWTAuthentication]
    permission_classes=[IsAuthenticated]
    filter_backends = (filters.DjangoFilterBackend,)
    filterset_class = MoviesFilter

    # def post(self,request,*args,**kwargs):
    #     if not request.user.is_superuser:
    #         return Response({"Not authenticated"})
    #     serializer = self.get_serializer(data= request.data)
    #     if serializer.is_valid():
    #         serializer.save()
    #         return Response(serializer.data,status=status.HTTP_201_CREATED)
    #     return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
    def perform_create(self, serializer):
        if not self.request.user.is_superuser:
            raise PermissionDenied("You do not have permission to create a movie.")
        serializer.save()

class UpdateDetailMovie(generics.RetrieveUpdateDestroyAPIView):
    queryset=Movies.objects.all()
    serializer_class=MovieSerializer
    authentication_classes=[CookiesJWTAuthentication]
    permission_classes=[IsAuthenticated]
    lookup_field='pk'
        
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)

        try:
            WatchHistory.objects.update_or_create(
                user=request.user,
                movie=instance,
                defaults={'watched_at': datetime.now()}
            )
        except Exception as e:
            print("Failed to create WatchHistory:", e)
        
        return Response(serializer.data)

    def perform_update(self, serializer):
        if not self.request.user.is_superuser:
            raise PermissionDenied("You do not have permission to update this movie.")
        
        serializer.save()

class TypeCreateListView(generics.ListCreateAPIView):
    queryset = Type.objects.all()
    serializer_class = TypeSerializer
    authentication_classes = [CookiesJWTAuthentication]
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        if not self.request.user.is_superuser:
            raise PermissionDenied("You do not have permission to create a type.")
        serializer.save()

class TypeDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Type.objects.all()
    serializer_class = TypeSerializer
    authentication_classes = [CookiesJWTAuthentication]
    permission_classes = [IsAuthenticated]
    lookup_field = 'pk'

    def perform_update(self, serializer):
        if not self.request.user.is_superuser:
            raise PermissionDenied("You do not have permission to update this type.")
        serializer.save()

    def perform_destroy(self, instance):
        if not self.request.user.is_superuser:
            raise PermissionDenied("You do not have permission to delete this type.")
        instance.delete()


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
    
class UserProfileView(generics.RetrieveUpdateAPIView):
    authentication_classes=[CookiesJWTAuthentication]
    permission_classes=[IsAuthenticated]
    serializer_class=UserProfileSerializer
    
    def get_queryset(self):
        user = UserProfile.objects.get(user=self.request.user)
        return user
    
    def get_object(self):
        user = self.request.user
        profile, created = UserProfile.objects.get_or_create(user=user)
        return profile
    
    def perform_update(self,serializer):
        if serializer.is_valid(raise_exception=True):
            userprofile = self.request.user.userprofile
            self.request.user.userprofile.image.delete()
            self.request.user.first_name = userprofile.first_name
            self.request.user.last_name= userprofile.last_name
            self.request.user.email=userprofile.email
            self.request.user.save()
        serializer.save()

class CastCreateListView(generics.ListCreateAPIView):
    queryset = Cast.objects.all()
    serializer_class=CastSerializer
    authentication_classes=[CookiesJWTAuthentication]
    permission_classes=[IsAuthenticated]

class CastListView(APIView):
    # queryset=Cast.objects.all()
    # serializer_class=CastSerializer
    # authenticatoin_classes=[CookiesJWTAuthentication]
    # permission_classes=[IsAuthenticated]

    # def perform_create(self, serializer):
    #     if not self.request.user.is_superuser:
    #         raise PermissionDenied("You do not have permission to create a type.")
    #     serializer.save()
    
    def get(self, request, movie_id):
        cast = Cast.objects.filter(movies__id=movie_id)
        serializer = CastSerializer(cast, many=True)
        return Response(serializer.data)
    
    def post(self,request):
        serializer = CastSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data,status=status.HTTP_201_CREATED)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)

class CastUpdateView(generics.RetrieveUpdateAPIView):
    queryset=Cast.objects.all()
    serializer_class=CastSerializer
    authenticatoin_classes=[CookiesJWTAuthentication]
    permission_classes=[IsAuthenticated]
    lookup_field='pk'
    def perform_update(self, serializer):
        if not self.request.user.is_superuser:
            raise PermissionDenied("You do not have permission to update this cast.")
        serializer.save()



class SubscriptionCreateView(generics.CreateAPIView):
    queryset = Subscription.objects.all()
    serializer_class = SubscriptionSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class SubscriptionUpgradeView(generics.UpdateAPIView):
    queryset = Subscription.objects.all()
    serializer_class = SubscriptionSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'pk'

    def patch(self, request, *args, **kwargs):
        try:
            subscription = Subscription.objects.get(user=request.user)
            if subscription.upgrade():
                return Response({"message": "Subscription upgraded to Premium!"}, status=status.HTTP_200_OK)
            return Response({"error": "Already on Premium Plan!"}, status=status.HTTP_400_BAD_REQUEST)
        except Subscription.DoesNotExist:
            return Response({"error": "Subscription not found!"}, status=status.HTTP_404_NOT_FOUND)


class SubscriptionCancelView(generics.DestroyAPIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, *args, **kwargs):
        try:
            subscription = Subscription.objects.get(user=request.user)
            if subscription.cancel():
                return Response({"message": "Subscription downgraded to Free Plan."}, status=status.HTTP_200_OK)
            return Response({"error": "Already on Free Plan!"}, status=status.HTTP_400_BAD_REQUEST)
        except Subscription.DoesNotExist:
            return Response({"error": "Subscription not found!"}, status=status.HTTP_404_NOT_FOUND)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def subscription_status(request):
    user = request.user  # Get the logged-in user
    
    try:
        subscription = Subscription.objects.get(user=user)
    except Subscription.DoesNotExist:
        subscription = None

    # days_since_signup = (now() - user.signup_date).days
    # requires_upgrade = days_since_signup > 5 and (not subscription or subscription.type == "FREE")

    return Response({
        "username": user.username,
        "subscription_type": subscription.plan.name if subscription else "None",
        "start_date": subscription.start_date if subscription else None,
        "end_date": subscription.end_date if subscription else None,
        #"requires_upgrade": requires_upgrade
    })

@api_view(['GET'])
@authentication_classes([CookiesJWTAuthentication])
@permission_classes([IsAuthenticated])
def is_logged_in(request):
    serializer = UserSerializer(request.user)
    return Response(serializer.data)



class MovieSearchView(generics.ListAPIView):
    serializer_class = MovieSerializer

    def get_queryset(self):
        qs = Movies.objects.all()

        title = self.request.query_params.get('title')
        release_year = self.request.query_params.get('release_year')
        category = self.request.query_params.get('category')
        min_rating = self.request.query_params.get('min_rating')

        if title is not None:
            qs = qs.filter(title__icontains=title)

        if release_year:
            qs = qs.filter(release_date__year=release_year)

        if category:
            if category in dict(Movies.CATEGORY.choices):
                qs = qs.filter(category=category)

        if min_rating:
            try:
                qs = qs.filter(rating__gte=float(min_rating))
            except ValueError:
                pass  # Ignore invalid number
        print(qs)
        return qs

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

class PlanListCreateView(generics.ListCreateAPIView):
    queryset = Plan.objects.all()
    serializer_class=PlanSerializer
    authentication_classes=[CookiesJWTAuthentication]
    permission_classes=[IsAuthenticated]

class PlanDetailView(generics.RetrieveUpdateAPIView):
    queryset =Plan.objects.all()
    serializer_class=PlanSerializer
    authentication_classes=[CookiesJWTAuthentication]
    permission_classes=[IsAuthenticated]
    lookup_field='pk'
    def perform_update(self, serializer):
        if not self.request.user.is_superuser:
            raise PermissionDenied("You do not have permission to update this plan.")
        serializer.save()

@api_view(['POST'])
@parser_classes([MultiPartParser])
def bulk_upload_movies_zip(request):
    zip_file = request.FILES.get('file')
    if not zip_file.name.endswith('.zip'):
        return Response({'error': 'Only .zip files are allowed'}, status=status.HTTP_400_BAD_REQUEST)

    # Unzip to memory
    with zipfile.ZipFile(zip_file) as zf:
        file_names = zf.namelist()
        if 'movies.csv' not in file_names:
            return Response({'error': 'CSV file "movies.csv" not found in ZIP'}, status=400)

        # Read CSV
        csv_file = zf.open('movies.csv')
        df = pd.read_csv(csv_file)

        created_movies = []

        for _, row in df.iterrows():
            title = row['title']
            description = row['desc']
            category = row['category']
            rating = row['rating']
            release_date=row['release_date']
            is_premium=row['is_premium']
            image_name = row['image']
            video_name = row['video']
            banner_name= row['banner']
            # cast_names = str(row['cast']).split('|')
            # cast_image_names = str(row['cast_image']).split('|')

            image_file = zf.open(image_name)
            video_file = zf.open(video_name)
            banner_file = zf.open(banner_name)

            movie = Movies(
                title=title,
                desc=description,
                category=category,
                rating=rating,
                release_date=release_date,
                is_premium=is_premium
            )
            movie.image.save(image_name, ContentFile(image_file.read()),save=False)
            movie.video.save(video_name, ContentFile(video_file.read()),save=False)
            movie.banner.save(banner_name,ContentFile(banner_file.read()),save=False)
            movie.save()
            

            # for cast_name, cast_image_name in zip(cast_names, cast_image_names):
            #     cast_name = cast_name.strip()
            #     cast_obj, created = Cast.objects.get_or_create(name=cast_name)
            #     cast_obj.movies.add(movie)

            #     if cast_image_name and cast_image_name in file_names:
            #         cast_image_file = zf.open(cast_image_name)
            #         cast_obj.image.save(cast_image_name, ContentFile(cast_image_file.read()), save=False)

            #     cast_obj.save()
                    

            
            created_movies.append(movie.title)

        return Response({'success': f"{len(created_movies)} movies uploaded", 'movies': created_movies}, status=201)

class HistoryRetrieveView(generics.ListAPIView):
    serializer_class=WatchHistorySerializer
    authentication_classes=[CookiesJWTAuthentication]
    permission_classes=[IsAuthenticated]


    def get_queryset(self):
        return WatchHistory.objects.filter(user=self.request.user)

class WatchlistListCreateView(generics.ListCreateAPIView):
    serializer_class = WatchlistSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Watchlist.objects.filter(user=self.request.user).order_by('-added_at')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class WatchlistDeleteView(generics.DestroyAPIView):
    serializer_class = WatchlistSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'pk'

    def get_queryset(self):
        return Watchlist.objects.filter(user=self.request.user)

class RecommendationView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        recent_movies = WatchHistory.objects.filter(user=user).order_by('-watched_at')[:10]
        category_counter = Counter()

        for record in recent_movies:
            if record.movie.category:
                category_counter[record.movie.category] += 1

        recommended_movies = []
        seen_movie_ids = set(w.movie.id for w in WatchHistory.objects.filter(user=user))

        for category, count in category_counter.items():
            fetch_count = int(count * 1.5)
            category_movies = Movies.objects.filter(category=category)#.exclude(id__in=seen_movie_ids)
            sampled = random.sample(list(category_movies), min(len(category_movies), fetch_count))
            recommended_movies.extend(sampled)


        random.shuffle(recommended_movies)

        serialized = MovieSerializer(recommended_movies, many=True)
        return Response(serialized.data)