from django.urls import path
from . import views
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt.views import TokenObtainPairView,TokenRefreshView

urlpatterns = [
    path('movies/',views.ListMovies.as_view(),name="list_create_movies"),
    path('movies/<int:pk>/',views.UpdateDetailMovie.as_view(),name="update_detail_movie"),
    path('search/',views.SearchMovie.as_view(),name="search_movie"),
    path('register/',views.CreateUserView.as_view(),name="register"),
    path('token/',views.CustomTokenObtainPairView.as_view(),name="token"),
    path('token/refresh/',views.CustomTokenRefreshView.as_view(),name="refresh"),
    path('logout/',views.logout,name="logout"),
    path('authenticated/',views.is_logged_in,name='is_authenticated'),

]
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
