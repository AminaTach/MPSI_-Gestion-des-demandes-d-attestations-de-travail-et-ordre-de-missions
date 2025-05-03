from django.urls import path
from .views import google_login, create_demande_attestation, create_demande_ordre_mission, get_all_demandes_attestation, get_all_demandes_ordre_mission


urlpatterns = [
    path("api/google-login/", google_login, name="google_login"),
    path('api/demande-attestation/create/', create_demande_attestation, name='create_demande_attestation'),
    path('api/demande-ordre-mission/create/', create_demande_ordre_mission, name='create_demande_ordre_mission'),
    path('api/demande-attestation/all/', get_all_demandes_attestation, name='get_all_demandes_attestation'),
    path('api/demande-ordre-mission/all/', get_all_demandes_ordre_mission, name='get_all_demandes_ordre_mission'),
]
