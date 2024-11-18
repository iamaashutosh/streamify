from django.urls import path
from . import views
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt.views import TokenObtainPairView,TokenRefreshView

urlpatterns = [
    path('movies/',views.ListCreateMovies.as_view(),name="list_create_movies"),
    path('movies/<int:pk>',views.UpdateDetailMovie.as_view(),name="update_detail_movie"),
    path('register/',views.CreateUserView.as_view(),name="register"),
    path('token',TokenObtainPairView.as_view(),name="token"),
    path('token/refresh',TokenRefreshView.as_view(),name="refresh")
]
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
