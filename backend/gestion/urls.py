from django.urls import path
from .views import google_login

urlpatterns = [
    path("api/google-login/", google_login, name="google_login"),
]
