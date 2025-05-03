from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from gestion import views

urlpatterns = [
    
    # Page d'accueil (redirection vers login)
    path('', lambda request: views.login(request), name='home'),

    # Routes API pour tests ThunderClient
    path('api/register/', views.api_register, name='api_register'),
    path('api/login/', views.api_login, name='api_login'),
    path('api/forgot-password/', views.api_forgot_password, name='api_forgot_password'),
    path('api/reset-password/', views.api_reset_password, name='api_reset_password'),
    path('api/switch-role/', views.api_switch_role, name='api_switch_role'),
    path('api/update-profile/', views.api_update_profile, name='api_update_profile'),
    path('api/get-user/', views.api_get_user, name='api_get_user'),
]

# Ajouter les patterns pour servir les fichiers média en développement
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)