from django.urls import path
from . import views
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt.views import TokenObtainPairView,TokenRefreshView

urlpatterns = [
    path('movies/',views.ListMovies.as_view(),name="list_create_movies"),
    path('movies/<int:pk>/',views.UpdateDetailMovie.as_view(),name="update_detail_movie"),
    path('movies/search/',views.SearchMovie.as_view(),name="search_movie"),
    path('register/',views.CreateUserView.as_view(),name="register"),
    path('token/',views.CustomTokenObtainPairView.as_view(),name="token"),
    path('token/refresh/',views.CustomTokenRefreshView.as_view(),name="refresh"),
    path('logout/',views.logout,name="logout"),
    path('authenticated/',views.is_logged_in,name='is_authenticated'),
    path('user_profile/',views.UserProfileView.as_view(),name="user_profile"),
    path('create_sub/', views.SubscriptionCreateView.as_view(), name='subscription-create'),
    path('upgrade_sub/', views.SubscriptionUpgradeView.as_view(), name='subscription-upgrade'),
    path('subscription/status/', views.subscription_status, name='subscription-status'),
    path('type/',views.TypeCreateListView.as_view(),name="create_type"),
    path('update_type/<int:pk>/',views.TypeDetailView.as_view(),name="update_type"),
    path('movies/<int:movie_id>/cast/',views.CastListView.as_view(),name="create_cast"),
    path('cast/',views.CastCreateListView.as_view(),name='list_cast'),
    path('update_cast/<int:pk>/',views.CastUpdateView.as_view(),name="update_cast"),
    path('plan/',views.PlanListCreateView.as_view(),name="create_list_plan"),
    path('update_plan/<int:pk>/',views.PlanDetailView.as_view(),name="update_plan"),
    path('history/',views.HistoryRetrieveView.as_view(),name="history"),
    path('watchlist/', views.WatchlistListCreateView.as_view(), name='watchlist'),
    path('watchlist/<int:pk>/', views.WatchlistDeleteView.as_view(), name='watchlist-delete'),

    path('create-upgrade-checkout-session/',views.CreateSubscriptionSession.as_view(), name='checkout_session'),
    path('cancel_sub/', views.CancelSubscription.as_view(), name='subscription-cancel'),
    path('subscription-success/', views.SubscriptionSuccess.as_view(), name='subscription-success'),
    path('webhook/',views.stripe_webhook,name="webhook"),
    path('movies/bulk-upload/',views.bulk_upload_movies_zip,name='bulk_upload'),
    path('recommendations/', views.RecommendationView.as_view(), name='recommendations'),

]
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
