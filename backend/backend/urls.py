from django.contrib import admin
from django.urls import path, include
from gestion.views import (
    RequestStatsView, bulk_update_demandes_attestation, bulk_update_demandes_ordre_mission, 
    delete_demande_attestation, delete_mission_order, generate_mission_order, generate_work_certificate, get_attestation_details, 
    get_mission_order_details, get_user_demandes_attestation, get_user_demandes_ordre_mission, get_user_details, 
    google_login, create_demande_attestation, create_demande_ordre_mission, 
    get_all_demandes_attestation, get_all_demandes_ordre_mission, get_user_demands,
    get_user_documents, update_attestation_details, update_demande_attestation_status, update_demande_ordre_mission_status, 
    update_mission_order_details, SendEmailView
)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/stats/', RequestStatsView.as_view(), name='api_request_stats'),
    path("api/google-login/", google_login, name="google_login"),
    path('api/user/documents/', get_user_documents, name='get_user_documents'),
    path('api/user/demands/', get_user_demands, name='get_user_demands'),
    
    # Attestation de travail endpoints
    path('api/demande-attestation/create/', create_demande_attestation, name='create_demande_attestation'),
    path('api/demande-attestation/all/', get_all_demandes_attestation, name='get_all_demandes_attestation'),
    path('api/attestations/<int:demande_id>/generate/', generate_work_certificate, name='generate_work_certificate'),
    path('api/attestations/<int:demande_id>/update-status/', update_demande_attestation_status, name='update_demande_attestation_status'),
    path('api/attestations/<int:demande_id>/delete/', delete_demande_attestation, name='delete_demande_attestation'),
    path('api/attestations/user/<str:user_id>/', get_user_demandes_attestation, name='get_user_demandes_attestation'),
    path('api/attestations/bulk-update/', bulk_update_demandes_attestation, name='bulk_update_demandes_attestation'),
    path('api/attestations/<int:demande_id>/details/', get_attestation_details, name='get_attestation_details'),
    path('api/attestations/<int:demande_id>/update-details/', update_attestation_details, name='update_attestation_details'),
    path('api/users/<int:user_id>/', get_user_details, name='get_user_details'),
    
    # Ordre de mission endpoints
    path('api/demande-ordre-mission/create/', create_demande_ordre_mission, name='create_demande_ordre_mission'),
    path('api/demande-ordre-mission/all/', get_all_demandes_ordre_mission, name='get_all_demandes_ordre_mission'),
    path('api/mission-orders/<int:demande_id>/generate/', generate_mission_order, name='generate_mission_order'),
    path('api/mission-orders/<int:demande_id>/update-details/', update_mission_order_details, name='update_mission_order_details'),
    path('api/mission-orders/<int:demande_id>/details/', get_mission_order_details, name='get_mission_order_details'),
    path('api/mission-orders/<int:demande_id>/update-status/', update_demande_ordre_mission_status, name='update_demande_ordre_mission_status'),
    path('api/mission-orders/user/<str:user_id>/', get_user_demandes_ordre_mission, name='get_user_demandes_ordre_mission'),
    path('api/mission-orders/bulk-update/', bulk_update_demandes_ordre_mission, name='bulk_update_demandes_ordre_mission'),
    path('api/mission-orders/<int:demande_id>/delete/', delete_mission_order, name='delete_mission_order'),
    
    path('send-email/', SendEmailView.as_view(), name='send-email'),


]