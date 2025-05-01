from django.shortcuts import redirect
from google_auth_oauthlib.flow import Flow
import os

# Configure l’environnement
os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'  # Pour test en HTTP

def google_login(request):
    flow = Flow.from_client_secrets_file(
        'client_secret.json',  # Ton fichier téléchargé depuis Google Cloud
        scopes=['https://www.googleapis.com/auth/userinfo.email', 'openid'],
        redirect_uri='http://localhost:8000/google/callback'
    )
    auth_url, _ = flow.authorization_url(prompt='consent')
    return redirect(auth_url)

from django.http import HttpResponse
from google_auth_oauthlib.flow import Flow
import requests

def google_callback(request):
    flow = Flow.from_client_secrets_file(
        'client_secret.json',
        scopes=['https://www.googleapis.com/auth/userinfo.email', 'openid'],
        redirect_uri='http://localhost:8000/google/callback'
    )
    flow.fetch_token(authorization_response=request.build_absolute_uri())

    session = flow.authorized_session()
    user_info = session.get('https://www.googleapis.com/userinfo/v2/me').json()
    email = user_info.get('email')

    if not email.endswith('@esi.dz'):
        return HttpResponse("Accès refusé : utilisez une adresse @esi.dz")

    # Logique de login ou création utilisateur
    from django.contrib.auth import login, get_user_model
    User = get_user_model()

    user, created = User.objects.get_or_create(email=email, defaults={'username': email})
    login(request, user)

    return redirect('/')
