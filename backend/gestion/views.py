import json
import time
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from google.oauth2 import id_token
from google.auth.transport import requests
from .models import User  

@csrf_exempt
def google_login(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            token = data.get("token")
            if not token:
                return JsonResponse({"error": "Token manquant"}, status=400)

            client_id = "318367454563-v857090khdr2rk94jff2apmh0ifq7irh.apps.googleusercontent.com"
            idinfo = id_token.verify_oauth2_token(token, requests.Request(), client_id)

            if idinfo['aud'] != client_id:
                return JsonResponse({"error": "Client ID invalide"}, status=401)

            if idinfo['exp'] < int(time.time()):
                return JsonResponse({"error": "Token expiré"}, status=401)

            email = idinfo.get("email")
            if not email.endswith("@esi.dz"):
                return JsonResponse({"error": "Email non autorisé"}, status=403)

            # 🔍 Récupération de l'utilisateur
            try:
                user = User.objects.get(email=email)
                user_type = user.type
            except User.DoesNotExist:
                return JsonResponse({"error": "Utilisateur non trouvé"}, status=404)

            # ✅ Succès
            return JsonResponse({
                "success": True,
                "email": email,
                "name": idinfo.get("name"),
                "picture": idinfo.get("picture"),
                "user_type": user_type  # 👉 rôle renvoyé au frontend
            })

        except ValueError:
            return JsonResponse({"error": "Token invalide"}, status=401)
        except Exception as e:
            print(f"Erreur serveur: {e}")
            return JsonResponse({"error": "Erreur serveur"}, status=500)

    return JsonResponse({"error": "Méthode non autorisée"}, status=405)
