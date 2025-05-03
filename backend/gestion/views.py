import json
import time
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from google.oauth2 import id_token
from google.auth.transport import requests
from datetime import datetime
from .models import User, DemandeOrdreMission, DemandeAttestation, DemandeAttestation, DemandeOrdreMission

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



@csrf_exempt
def create_demande_attestation(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            user = User.objects.get(email=data['user_id'])

            demande = DemandeAttestation.objects.create(
                user=user,
                Message_dem_attest=data.get('message', ''),
                Etat='en_attente'
            )

            return JsonResponse({'success': True, 'message': 'Demande d’attestation créée', 'id': demande.id_dem_attest})

        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)}, status=400)

    return JsonResponse({'success': False, 'message': 'Méthode non autorisée'}, status=405)

@csrf_exempt
def create_demande_ordre_mission(request):
    if request.method == 'POST':
        try:
            user = User.objects.get(email=request.POST['user_id'])

            demande = DemandeOrdreMission.objects.create(
                user=user,
                Message_ordre=request.POST.get('Message_ordre', ''),
                Etat='en_attente',
                nom_employe=request.POST['nom_employe'],
                poste=request.POST['poste'],
                departement=request.POST['departement'],
                date_debut_mission=datetime.strptime(request.POST['date_debut_mission'], '%Y-%m-%d').date(),
                date_fin_mission=datetime.strptime(request.POST['date_fin_mission'], '%Y-%m-%d').date(),
                piece_identite=request.POST.get('piece_identite', '')
            )

            if 'piece_identite' in request.FILES:
                demande.piece_identite = request.FILES['piece_identite']
                demande.save()

            return JsonResponse({'success': True, 'message': 'Demande d’ordre de mission créée', 'id': demande.id_dem_ordre})

        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)}, status=400)

    return JsonResponse({'success': False, 'message': 'Méthode non autorisée'}, status=405)




@csrf_exempt
def get_all_demandes_attestation(request):
    if request.method == 'GET':
        try:
            demandes = DemandeAttestation.objects.all().values(
                'id_dem_attest', 'user__username', 'Message_dem_attest', 'Etat', 'Date', 'Piece_jointe'
            )
            return JsonResponse({'success': True, 'demandes': list(demandes)})
        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)}, status=400)
    return JsonResponse({'success': False, 'message': 'Méthode non autorisée'}, status=405)

@csrf_exempt
def get_all_demandes_ordre_mission(request):
    if request.method == 'GET':
        try:
            demandes = DemandeOrdreMission.objects.all().values(
                'id_dem_ordre', 'user__username', 'Message_ordre', 'Etat', 'Date', 'Piece_jointe',
                'nom_employe', 'poste', 'departement', 'date_debut_mission', 'date_fin_mission', 'piece_identite'
            )
            return JsonResponse({'success': True, 'demandes': list(demandes)})
        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)}, status=400)
    return JsonResponse({'success': False, 'message': 'Méthode non autorisée'}, status=405)

from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Count, Q
from django.db.models.functions import TruncMonth
from django.utils import timezone
from .models import DemandeAttestation, DemandeOrdreMission

class RequestStatsView(APIView):
    def get(self, request):
        try:
            # Demande Attestation Status Counts
            attestation_en_attente = DemandeAttestation.objects.filter(Etat='en_attente').count()
            attestation_rejetee = DemandeAttestation.objects.filter(Etat='rejetee').count()
            attestation_validee = DemandeAttestation.objects.filter(Etat='validee').count()

            # Demande Ordre Mission Status Counts
            ordre_en_attente = DemandeOrdreMission.objects.filter(Etat='en_attente').count()
            ordre_rejetee = DemandeOrdreMission.objects.filter(Etat='rejetee').count()
            ordre_validee = DemandeOrdreMission.objects.filter(Etat='validee').count()

            # Monthly stats for DemandeAttestation
            attestation_monthly_stats = DemandeAttestation.objects.annotate(month=TruncMonth('Date'))\
                                                                 .values('month')\
                                                                 .annotate(en_attente=Count('id_dem_attest', filter=Q(Etat='en_attente')),
                                                                           rejetee=Count('id_dem_attest', filter=Q(Etat='rejetee')),
                                                                           validee=Count('id_dem_attest', filter=Q(Etat='validee')))\
                                                                 .order_by('month')

            # Monthly stats for DemandeOrdreMission
            ordre_monthly_stats = DemandeOrdreMission.objects.annotate(month=TruncMonth('Date'))\
                                                              .values('month')\
                                                              .annotate(en_attente=Count('id_dem_ordre', filter=Q(Etat='en_attente')),
                                                                        rejetee=Count('id_dem_ordre', filter=Q(Etat='rejetee')),
                                                                        validee=Count('id_dem_ordre', filter=Q(Etat='validee')))\
                                                              .order_by('month')

            # Total processed requests
            total_processed_requests = DemandeAttestation.objects.filter(Etat='validee').count() + \
                                       DemandeOrdreMission.objects.filter(Etat='validee').count()

            # Current month statistics (optional)
            current_month = timezone.now().month
            current_year = timezone.now().year
            current_month_stats = {
                'attestation': DemandeAttestation.objects.filter(Date__month=current_month, Date__year=current_year).count(),
                'ordre': DemandeOrdreMission.objects.filter(Date__month=current_month, Date__year=current_year).count()
            }

            # Prepare data in a dictionary to be returned as JSON
            data = {
                'attestation_status': {
                    'en_attente': attestation_en_attente,
                    'rejetee': attestation_rejetee,
                    'validee': attestation_validee
                },
                'ordre_status': {
                    'en_attente': ordre_en_attente,
                    'rejetee': ordre_rejetee,
                    'validee': ordre_validee
                },
                'monthly_stats': {
                    'attestation': list(attestation_monthly_stats),
                    'ordre': list(ordre_monthly_stats)
                },
                'total_processed_requests': total_processed_requests,
                'current_month_stats': current_month_stats,  # Stats pour le mois en cours
            }

            return Response(data)
        except Exception as e:
            # Gestion des erreurs
            return Response({'error': str(e)}, status=500)