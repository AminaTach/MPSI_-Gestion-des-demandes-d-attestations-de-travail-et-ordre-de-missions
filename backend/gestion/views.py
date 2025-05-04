import json
import time
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from google.oauth2 import id_token
from google.auth.transport import requests
from datetime import datetime
from .models import User, DemandeOrdreMission, DemandeAttestation, OrdreMission
from django.shortcuts import get_object_or_404
from django.template.loader import render_to_string
from django.http import HttpResponse
from django.conf import settings
import io
from weasyprint import HTML 
import os

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




@csrf_exempt
def get_user_documents(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            email = data.get('email')
            if not email:
                return JsonResponse({'success': False, 'error': 'Email manquant'}, status=400)

            try:
                user = User.objects.get(email=email)
            except User.DoesNotExist:
                return JsonResponse({'success': False, 'error': 'Utilisateur non trouvé'}, status=404)

            # Retrieve documents from DemandeAttestation
            attestation_docs = DemandeAttestation.objects.filter(user=user).values(
                'id_dem_attest', 'Piece_jointe', 'Date', 'Etat'
            ).exclude(Piece_jointe__isnull=True).exclude(Piece_jointe='')

            # Retrieve documents from DemandeOrdreMission
            ordre_docs = DemandeOrdreMission.objects.filter(user=user).values(
                'id_dem_ordre', 'Piece_jointe', 'Date', 'Etat', 'piece_identite', 'objet_mission'
            ).exclude(Piece_jointe__isnull=True).exclude(Piece_jointe='')

            documents = {
                'attestations': [
                    {
                        'id': doc['id_dem_attest'],
                        'type': 'Attestation de travail',
                        'file': str(doc['Piece_jointe']) if doc['Piece_jointe'] else None,
                        'date': doc['Date'],
                        'status': doc['Etat']
                    } for doc in attestation_docs
                ],
                'ordres': [
                    {
                        'id': doc['id_dem_ordre'],
                        'type': 'Ordre de mission',
                        'file': str(doc['Piece_jointe']) if doc['Piece_jointe'] else None,
                        'piece_identite': str(doc['piece_identite']) if doc['piece_identite'] else None,
                        'objet_mission': str(doc['objet_mission']) if doc['objet_mission'] else None,
                        'date': doc['Date'],
                        'status': doc['Etat']
                    } for doc in ordre_docs
                ]
            }

            return JsonResponse({'success': True, 'documents': documents})

        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)}, status=500)

    return JsonResponse({'success': False, 'message': 'Méthode non autorisée'}, status=405)


@csrf_exempt
def get_user_demands(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            email = data.get('email')
            if not email:
                return JsonResponse({'success': False, 'error': 'Email manquant'}, status=400)

            try:
                user = User.objects.get(email=email)
            except User.DoesNotExist:
                return JsonResponse({'success': False, 'error': 'Utilisateur non trouvé'}, status=404)

            # Retrieve demands from DemandeAttestation
            attestation_demands = DemandeAttestation.objects.filter(user=user).values(
                'id_dem_attest', 'Message_dem_attest', 'Etat', 'Date', 'Piece_jointe'
            )

            # Retrieve demands from DemandeOrdreMission
            ordre_demands = DemandeOrdreMission.objects.filter(user=user).values(
                'id_dem_ordre', 'Message_ordre', 'Etat', 'Date', 'Piece_jointe',
                'nom_employe', 'poste', 'departement', 'date_debut_mission', 'date_fin_mission', 'piece_identite', 'objet_mission'
            )

            demands = {
                'attestations': [
                    {
                        'id': dem['id_dem_attest'],
                        'type': 'Attestation de travail',
                        'message': dem['Message_dem_attest'],
                        'status': dem['Etat'],
                        'date': dem['Date'],
                        'piece_jointe': str(dem['Piece_jointe']) if dem['Piece_jointe'] else None
                    } for dem in attestation_demands
                ],
                'ordres': [
                    {
                        'id': dem['id_dem_ordre'],
                        'type': 'Ordre de mission',
                        'message': dem['Message_ordre'],
                        'status': dem['Etat'],
                        'date': dem['Date'],
                        'piece_jointe': str(dem['Piece_jointe']) if dem['Piece_jointe'] else None,
                        'nom_employe': dem['nom_employe'],
                        'poste': dem['poste'],
                        'departement': dem['departement'],
                        'date_debut_mission': dem['date_debut_mission'],
                        'date_fin_mission': dem['date_fin_mission'],
                        'piece_identite': str(dem['piece_identite']) if dem['piece_identite'] else None,
                        'objet_mission': str(dem['objet_mission']) if dem['objet_mission'] else None
                    } for dem in ordre_demands
                ]
            }

            return JsonResponse({'success': True, 'demands': demands})

        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)}, status=500)

    return JsonResponse({'success': False, 'message': 'Méthode non autorisée'}, status=405)


@csrf_exempt
def generate_work_certificate(request, demande_id):
    """Generate a work certificate (attestation de travail) PDF for a specific request."""
    try:
        # Get the attestation request
        demande = get_object_or_404(DemandeAttestation, id_dem_attest=demande_id)
        
        # Check if the request is approved
        if demande.Etat != 'validee':
            return JsonResponse({
                'success': False, 
                'message': 'Cette demande n\'est pas encore validée.'
            }, status=400)
        
        # Get the user details
        user = demande.user
        
        # Format the date in Arabic style
        today = datetime.now()
        formatted_date = today.strftime("%Y/%m/%d")
        
        # Build the absolute path to static files
        static_base_url = request.build_absolute_uri(settings.STATIC_URL)
        
        # Prepare the context for the template
        context = {
            'nom_arabe': user.nom_arabe,
            'prenom_arabe': user.prenom_arabe,
            'date_naissance': user.dateNais.strftime("%Y/%m/%d"),
            'lieu_naissance': user.Lieu_Nais,
            'grade': user.Grade,
            'date_embauche': user.Date1erEmbauche.strftime("%Y/%m/%d"),
            'current_date': formatted_date,
            'ref_number': f"م م/م و ع/{today.year}/{demande_id}",
            # Use the complete URL for static files
            'static_url': static_base_url,
        }
        
        # Create absolute path to the template
        template_path = os.path.join(settings.BASE_DIR, 'templates', 'rh', 'work_certificate_template.html')
        
        # Check if the template exists
        if not os.path.exists(template_path):
            return JsonResponse({
                'success': False, 
                'message': f'Template not found at {template_path}'
            }, status=500)
        
        # Modify the template with embedded fonts instead of linked fonts
        with open(template_path, 'r', encoding='utf-8') as f:
            template_content = f.read()
        
        # Render the HTML template with context
        html_string = render_to_string('rh/work_certificate_template.html', context)
        
        # Set base URL for WeasyPrint to properly resolve static files
        base_url = request.build_absolute_uri('/')
        
        # Create the PDF file
        pdf_file = io.BytesIO()
        HTML(string=html_string, base_url=base_url).write_pdf(pdf_file)
        pdf_file.seek(0)
        
        # Update the request with the generated PDF
        filename = f"attestation_travail_{user.nom_latin}_{user.prenom_latin}.pdf"
        if demande.Piece_jointe:
            demande.Piece_jointe.delete()  # Remove old file if it exists
        demande.Piece_jointe.save(filename, pdf_file)
        demande.save()
        
        # Create a fresh copy for downloading
        pdf_file.seek(0)
        
        # Return the PDF as download
        response = HttpResponse(pdf_file, content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="{filename}"'
        
        return response
        
    except Exception as e:
        import traceback
        error_details = traceback.format_exc()
        print(f"Error generating PDF: {error_details}")
        return JsonResponse({'success': False, 'error': str(e), 'details': error_details}, status=500)

@csrf_exempt
def update_demande_attestation_status(request, demande_id):
    """Update the status of a work certificate request."""
    if request.method == 'POST':
        try:
            import json
            data = json.loads(request.body)
            new_status = data.get('status')
            
            if new_status not in ['en_attente', 'rejetee', 'validee']:
                return JsonResponse({'success': False, 'message': 'Statut invalide'}, status=400)
                
            demande = get_object_or_404(DemandeAttestation, id_dem_attest=demande_id)
            demande.Etat = new_status
            demande.save()
            
            return JsonResponse({
                'success': True, 
                'message': 'Statut mis à jour avec succès',
                'new_status': new_status
            })
            
        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)}, status=400)
            
    return JsonResponse({'success': False, 'message': 'Méthode non autorisée'}, status=405)

@csrf_exempt
def get_user_demandes_attestation(request, user_id):
    """Get all work certificate requests for a specific user."""
    if request.method == 'GET':
        try:
            user = get_object_or_404(User, email=user_id)
            demandes = DemandeAttestation.objects.filter(user=user).values(
                'id_dem_attest', 'Message_dem_attest', 'Etat', 'Date', 'Piece_jointe'
            )
            return JsonResponse({'success': True, 'demandes': list(demandes)})
        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)}, status=400)
    return JsonResponse({'success': False, 'message': 'Méthode non autorisée'}, status=405)

@csrf_exempt
def bulk_update_demandes_attestation(request):
    """Update multiple work certificate requests at once."""
    if request.method == 'POST':
        try:
            import json
            data = json.loads(request.body)
            demande_ids = data.get('demande_ids', [])
            new_status = data.get('status')
            
            if not demande_ids:
                return JsonResponse({'success': False, 'message': 'Aucune demande spécifiée'}, status=400)
                
            if new_status not in ['en_attente', 'rejetee', 'validee']:
                return JsonResponse({'success': False, 'message': 'Statut invalide'}, status=400)
                
            # Update all the specified requests
            DemandeAttestation.objects.filter(id_dem_attest__in=demande_ids).update(Etat=new_status)
            
            return JsonResponse({
                'success': True, 
                'message': f'{len(demande_ids)} demandes mises à jour avec succès',
                'updated_ids': demande_ids,
                'new_status': new_status
            })
            
        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)}, status=400)
            
    return JsonResponse({'success': False, 'message': 'Méthode non autorisée'}, status=405)

@csrf_exempt
def delete_demande_attestation(request, demande_id):
    """Delete a work certificate request."""
    if request.method == 'DELETE':
        try:
            # Find the attestation request
            demande = get_object_or_404(DemandeAttestation, id_dem_attest=demande_id)
            
            # Delete any attached files if they exist
            if demande.Piece_jointe:
                demande.Piece_jointe.delete()
            
            # Delete the request itself
            demande.delete()
            
            return JsonResponse({
                'success': True,
                'message': 'Demande d\'attestation supprimée avec succès'
            })
            
        except Exception as e:
            import traceback
            error_details = traceback.format_exc()
            print(f"Error deleting attestation: {error_details}")
            return JsonResponse({
                'success': False, 
                'message': f'Erreur lors de la suppression: {str(e)}',
                'details': error_details
            }, status=500)
            
    return JsonResponse({
        'success': False, 
        'message': 'Méthode non autorisée'
    }, status=405)

@csrf_exempt
def get_attestation_details(request, demande_id):
    """Get the details of an attestation request."""
    if request.method == 'GET':
        try:
            # Get the attestation request
            demande = get_object_or_404(DemandeAttestation, id_dem_attest=demande_id)
            
            # Get the user associated with the request
            user = demande.user
            
            # Prepare the response data
            response_data = {
                'success': True,
                'demande': {
                    'id': demande.id_dem_attest,
                    'message': demande.Message_dem_attest,
                    'etat': demande.Etat,
                    'date': demande.Date,
                    'piece_jointe': str(demande.Piece_jointe) if demande.Piece_jointe else None,
                },
                'user': {
                    'id': user.id_user,
                    'username': user.username,
                    'email': user.email,
                    'nom_arabe': user.nom_arabe,
                    'prenom_arabe': user.prenom_arabe,
                    'eps_arabe': user.eps_arabe,
                    'nom_latin': user.nom_latin,
                    'prenom_latin': user.prenom_latin,
                    'genre': user.genre,
                    'dateNais': user.dateNais.strftime('%Y-%m-%d'),
                    'Lieu_Nais': user.Lieu_Nais,
                    'Grade': user.Grade,
                    'Date1erEmbauche': user.Date1erEmbauche.strftime('%Y-%m-%d'),
                    'Stu_Adm': user.Stu_Adm,
                }
            }
                
            return JsonResponse(response_data)
            
        except Exception as e:
            import traceback
            error_details = traceback.format_exc()
            print(f"Error getting attestation details: {error_details}")
            return JsonResponse({'success': False, 'error': str(e)}, status=400)
            
    return JsonResponse({'success': False, 'message': 'Méthode non autorisée'}, status=405)

@csrf_exempt
def update_attestation_details(request, demande_id):
    """Update the details of an attestation request."""
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            
            # Get the attestation request
            demande = get_object_or_404(DemandeAttestation, id_dem_attest=demande_id)
            
            # Update status if provided
            if 'status' in data:
                new_status = data.get('status')
                if new_status in ['en_attente', 'rejetee', 'validee']:
                    demande.Etat = new_status
            
            # Update message if provided
            if 'message' in data:
                demande.Message_dem_attest = data.get('message')
            
            # Save the changes
            demande.save()
            
            return JsonResponse({
                'success': True, 
                'message': 'Détails de la demande d\'attestation mis à jour avec succès',
                'demande_id': demande.id_dem_attest,
                'status': demande.Etat,
                'message': demande.Message_dem_attest
            })
            
        except Exception as e:
            import traceback
            error_details = traceback.format_exc()
            print(f"Error updating attestation details: {error_details}")
            return JsonResponse({'success': False, 'error': str(e), 'details': error_details}, status=400)
            
    return JsonResponse({'success': False, 'message': 'Méthode non autorisée'}, status=405)

@csrf_exempt
def get_user_details(request, user_id):
    """Get the details of a user."""
    if request.method == 'GET':
        try:
            # Get the user
            user = get_object_or_404(User, id_user=user_id)
            
            # Prepare the response data
            response_data = {
                'success': True,
                'user': {
                    'id': user.id_user,
                    'username': user.username,
                    'email': user.email,
                    'type': user.type,
                    'nom_arabe': user.nom_arabe,
                    'prenom_arabe': user.prenom_arabe,
                    'eps_arabe': user.eps_arabe,
                    'nom_latin': user.nom_latin,
                    'prenom_latin': user.prenom_latin,
                    'genre': user.genre,
                    'dateNais': user.dateNais.strftime('%Y-%m-%d'),
                    'Lieu_Nais': user.Lieu_Nais,
                    'Grade': user.Grade,
                    'Date1erEmbauche': user.Date1erEmbauche.strftime('%Y-%m-%d'),
                    'Stu_Adm': user.Stu_Adm,
                }
            }
            
            # Get counts of attestation requests by status
            attestation_stats = {
                'en_attente': DemandeAttestation.objects.filter(user=user, Etat='en_attente').count(),
                'rejetee': DemandeAttestation.objects.filter(user=user, Etat='rejetee').count(),
                'validee': DemandeAttestation.objects.filter(user=user, Etat='validee').count(),
                'total': DemandeAttestation.objects.filter(user=user).count()
            }
            
            # Get counts of mission order requests by status
            ordre_mission_stats = {
                'en_attente': DemandeOrdreMission.objects.filter(user=user, Etat='en_attente').count(),
                'rejetee': DemandeOrdreMission.objects.filter(user=user, Etat='rejetee').count(),
                'validee': DemandeOrdreMission.objects.filter(user=user, Etat='validee').count(),
                'total': DemandeOrdreMission.objects.filter(user=user).count()
            }
            
            # Add statistics to response data
            response_data['statistics'] = {
                'attestations': attestation_stats,
                'ordres_mission': ordre_mission_stats
            }
                
            return JsonResponse(response_data)
            
        except Exception as e:
            import traceback
            error_details = traceback.format_exc()
            print(f"Error getting user details: {error_details}")
            return JsonResponse({'success': False, 'error': str(e)}, status=400)
            
    return JsonResponse({'success': False, 'message': 'Méthode non autorisée'}, status=405)

@csrf_exempt
def generate_mission_order(request, demande_id):
    """Generate a mission order PDF for a specific request."""
    try:
        # Get the mission order request
        demande = get_object_or_404(DemandeOrdreMission, id_dem_ordre=demande_id)
        
        # Check if the request is approved
        if demande.Etat != 'validee':
            return JsonResponse({
                'success': False, 
                'message': 'Cette demande n\'est pas encore validée.'
            }, status=400)
        
        # Get the user details
        user = demande.user
        
        # Format the date in the desired style
        today = datetime.now()
        formatted_date = today.strftime("%Y/%m/%d")
        
        # Get mission order details if they exist
        ordre_mission = None
        try:
            ordre_mission = OrdreMission.objects.get(dem_ordre=demande)
        except OrdreMission.DoesNotExist:
            # If no details exist yet, use default values
            ordre_mission = {
                'Moyens_transport': 'À préciser',
                'date_depart': demande.date_debut_mission,
                'date_retour': demande.date_fin_mission,
                'date_delivrance': today.date(),
                'lieu_delivrance': 'Alger',
                'nom_respo': '',
                'prenom_respo': ''
            }
        
        # Build the absolute path to static files
        static_base_url = request.build_absolute_uri(settings.STATIC_URL)
        
        # Prepare the context for the template
        context = {
            'nom': demande.nom_employe,
            'poste': demande.poste,
            'departement': demande.departement,
            'date_debut': demande.date_debut_mission.strftime("%Y/%m/%d"),
            'date_fin': demande.date_fin_mission.strftime("%Y/%m/%d"),
            'moyens_transport': ordre_mission.Moyens_transport if isinstance(ordre_mission, OrdreMission) else ordre_mission['Moyens_transport'],
            'date_depart': ordre_mission.date_depart.strftime("%Y/%m/%d") if isinstance(ordre_mission, OrdreMission) else ordre_mission['date_depart'].strftime("%Y/%m/%d"),
            'date_retour': ordre_mission.date_retour.strftime("%Y/%m/%d") if isinstance(ordre_mission, OrdreMission) else ordre_mission['date_retour'].strftime("%Y/%m/%d"),
            'date_delivrance': ordre_mission.date_delivrance.strftime("%Y/%m/%d") if isinstance(ordre_mission, OrdreMission) else ordre_mission['date_delivrance'].strftime("%Y/%m/%d"),
            'lieu_delivrance': ordre_mission.lieu_delivrance if isinstance(ordre_mission, OrdreMission) else ordre_mission['lieu_delivrance'],
            'nom_responsable': ordre_mission.nom_respo if isinstance(ordre_mission, OrdreMission) else ordre_mission['nom_respo'],
            'prenom_responsable': ordre_mission.prenom_respo if isinstance(ordre_mission, OrdreMission) else ordre_mission['prenom_respo'],
            'piece_identite': demande.piece_identite,
            'ref_number': f"م م/أ م/{today.year}/{demande_id}",
            'static_url': static_base_url,
        }
        
        # Render the HTML template with context
        html_string = render_to_string('rh/mission_order_template.html', context)
        
        # Set base URL for WeasyPrint to properly resolve static files
        base_url = request.build_absolute_uri('/')
        
        # Create the PDF file
        pdf_file = io.BytesIO()
        HTML(string=html_string, base_url=base_url).write_pdf(pdf_file)
        pdf_file.seek(0)
        
        # Update the request with the generated PDF
        filename = f"ordre_mission_{demande.nom_employe}.pdf"
        if demande.Piece_jointe:
            demande.Piece_jointe.delete()  # Remove old file if it exists
        demande.Piece_jointe.save(filename, pdf_file)
        demande.save()
        
        # Create a fresh copy for downloading
        pdf_file.seek(0)
        
        # Return the PDF as download
        response = HttpResponse(pdf_file, content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="{filename}"'
        
        return response
        
    except Exception as e:
        import traceback
        error_details = traceback.format_exc()
        print(f"Error generating PDF: {error_details}")
        return JsonResponse({'success': False, 'error': str(e), 'details': error_details}, status=500)

@csrf_exempt
def update_mission_order_details(request, demande_id):
    """Update or create mission order details for a request."""
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            demande = get_object_or_404(DemandeOrdreMission, id_dem_ordre=demande_id)
            
            # Update status if provided
            if 'status' in data:
                new_status = data.get('status')
                if new_status in ['en_attente', 'rejetee', 'validee']:
                    demande.Etat = new_status
                    demande.save()
            
            # Update or create mission order details
            ordre_mission, created = OrdreMission.objects.get_or_create(
                dem_ordre=demande,
                defaults={
                    'Moyens_transport': data.get('moyens_transport', ''),
                    'date_depart': datetime.strptime(data.get('date_depart', demande.date_debut_mission.strftime('%Y-%m-%d')), '%Y-%m-%d').date(),
                    'date_retour': datetime.strptime(data.get('date_retour', demande.date_fin_mission.strftime('%Y-%m-%d')), '%Y-%m-%d').date(),
                    'date_delivrance': datetime.strptime(data.get('date_delivrance', datetime.now().strftime('%Y-%m-%d')), '%Y-%m-%d').date(),
                    'lieu_delivrance': data.get('lieu_delivrance', 'Alger'),
                    'nom_respo': data.get('nom_responsable', ''),
                    'prenom_respo': data.get('prenom_responsable', ''),
                }
            )
            
            # If record already existed, update it
            if not created:
                ordre_mission.Moyens_transport = data.get('moyens_transport', ordre_mission.Moyens_transport)
                ordre_mission.date_depart = datetime.strptime(data.get('date_depart', ordre_mission.date_depart.strftime('%Y-%m-%d')), '%Y-%m-%d').date()
                ordre_mission.date_retour = datetime.strptime(data.get('date_retour', ordre_mission.date_retour.strftime('%Y-%m-%d')), '%Y-%m-%d').date()
                ordre_mission.date_delivrance = datetime.strptime(data.get('date_delivrance', ordre_mission.date_delivrance.strftime('%Y-%m-%d')), '%Y-%m-%d').date()
                ordre_mission.lieu_delivrance = data.get('lieu_delivrance', ordre_mission.lieu_delivrance)
                ordre_mission.nom_respo = data.get('nom_responsable', ordre_mission.nom_respo)
                ordre_mission.prenom_respo = data.get('prenom_responsable', ordre_mission.prenom_respo)
                ordre_mission.save()
            
            return JsonResponse({
                'success': True, 
                'message': 'Détails de l\'ordre de mission mis à jour avec succès',
                'ordre_id': ordre_mission.id_ordre_mission
            })
            
        except Exception as e:
            import traceback
            error_details = traceback.format_exc()
            print(f"Error updating mission order details: {error_details}")
            return JsonResponse({'success': False, 'error': str(e), 'details': error_details}, status=400)
            
    return JsonResponse({'success': False, 'message': 'Méthode non autorisée'}, status=405)

@csrf_exempt
def get_mission_order_details(request, demande_id):
    """Get the details of a mission order."""
    if request.method == 'GET':
        try:
            demande = get_object_or_404(DemandeOrdreMission, id_dem_ordre=demande_id)
            
            # Base response with request details
            response_data = {
                'success': True,
                'demande': {
                    'id': demande.id_dem_ordre,
                    'nom_employe': demande.nom_employe,
                    'poste': demande.poste,
                    'departement': demande.departement,
                    'date_debut_mission': demande.date_debut_mission.strftime('%Y-%m-%d'),
                    'date_fin_mission': demande.date_fin_mission.strftime('%Y-%m-%d'),
                    'piece_identite': demande.piece_identite,
                    'etat': demande.Etat,
                    'message': demande.Message_ordre,
                }
            }
            
            # Add mission order details if they exist
            try:
                ordre_mission = OrdreMission.objects.get(dem_ordre=demande)
                response_data['ordre_mission'] = {
                    'id': ordre_mission.id_ordre_mission,
                    'moyens_transport': ordre_mission.Moyens_transport,
                    'date_depart': ordre_mission.date_depart.strftime('%Y-%m-%d'),
                    'date_retour': ordre_mission.date_retour.strftime('%Y-%m-%d'),
                    'date_delivrance': ordre_mission.date_delivrance.strftime('%Y-%m-%d'),
                    'lieu_delivrance': ordre_mission.lieu_delivrance,
                    'nom_responsable': ordre_mission.nom_respo,
                    'prenom_responsable': ordre_mission.prenom_respo,
                }
            except OrdreMission.DoesNotExist:
                response_data['ordre_mission'] = None
                
            return JsonResponse(response_data)
            
        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)}, status=400)
            
    return JsonResponse({'success': False, 'message': 'Méthode non autorisée'}, status=405)

@csrf_exempt
def update_demande_ordre_mission_status(request, demande_id):
    """Update the status of a mission order request."""
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            new_status = data.get('status')
            
            if new_status not in ['en_attente', 'rejetee', 'validee']:
                return JsonResponse({'success': False, 'message': 'Statut invalide'}, status=400)
                
            demande = get_object_or_404(DemandeOrdreMission, id_dem_ordre=demande_id)
            demande.Etat = new_status
            demande.save()
            
            return JsonResponse({
                'success': True, 
                'message': 'Statut mis à jour avec succès',
                'new_status': new_status
            })
            
        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)}, status=400)
            
    return JsonResponse({'success': False, 'message': 'Méthode non autorisée'}, status=405)

@csrf_exempt
def get_user_demandes_ordre_mission(request, user_id):
    """Get all mission order requests for a specific user."""
    if request.method == 'GET':
        try:
            user = get_object_or_404(User, email=user_id)
            demandes = DemandeOrdreMission.objects.filter(user=user).values(
                'id_dem_ordre', 'nom_employe', 'poste', 'departement', 
                'date_debut_mission', 'date_fin_mission', 'Message_ordre', 
                'Etat', 'Date', 'Piece_jointe'
            )
            
            # Add mission order details if they exist
            response_data = list(demandes)
            for demande in response_data:
                try:
                    ordre_mission = OrdreMission.objects.get(dem_ordre_id=demande['id_dem_ordre'])
                    demande['ordre_mission'] = {
                        'id': ordre_mission.id_ordre_mission,
                        'moyens_transport': ordre_mission.Moyens_transport,
                        'date_depart': ordre_mission.date_depart.strftime('%Y-%m-%d'),
                        'date_retour': ordre_mission.date_retour.strftime('%Y-%m-%d'),
                        'date_delivrance': ordre_mission.date_delivrance.strftime('%Y-%m-%d'),
                        'lieu_delivrance': ordre_mission.lieu_delivrance,
                        'nom_responsable': ordre_mission.nom_respo,
                        'prenom_responsable': ordre_mission.prenom_respo,
                    }
                except OrdreMission.DoesNotExist:
                    demande['ordre_mission'] = None
            
            return JsonResponse({'success': True, 'demandes': response_data})
        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)}, status=400)
    return JsonResponse({'success': False, 'message': 'Méthode non autorisée'}, status=405)

@csrf_exempt
def bulk_update_demandes_ordre_mission(request):
    """Update multiple mission order requests at once."""
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            demande_ids = data.get('demande_ids', [])
            new_status = data.get('status')
            
            if not demande_ids:
                return JsonResponse({'success': False, 'message': 'Aucune demande spécifiée'}, status=400)
                
            if new_status not in ['en_attente', 'rejetee', 'validee']:
                return JsonResponse({'success': False, 'message': 'Statut invalide'}, status=400)
                
            # Update all the specified requests
            DemandeOrdreMission.objects.filter(id_dem_ordre__in=demande_ids).update(Etat=new_status)
            
            return JsonResponse({
                'success': True, 
                'message': f'{len(demande_ids)} demandes mises à jour avec succès',
                'updated_ids': demande_ids,
                'new_status': new_status
            })
            
        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)}, status=400)
            
    return JsonResponse({'success': False, 'message': 'Méthode non autorisée'}, status=405)


@csrf_exempt
def delete_mission_order(request, demande_id):
    """Delete a mission order and its associated data."""
    if request.method == 'DELETE':
        try:
            # Get the mission order request
            demande = get_object_or_404(DemandeOrdreMission, id_dem_ordre=demande_id)
            
            # Delete associated OrdreMission if it exists
            try:
                ordre_mission = OrdreMission.objects.get(dem_ordre=demande)
                ordre_mission.delete()
            except OrdreMission.DoesNotExist:
                pass  # No associated OrdreMission to delete
            
            # Delete the attached file if it exists
            if demande.Piece_jointe:
                demande.Piece_jointe.delete()
            
            # Finally, delete the DemandeOrdreMission itself
            demande.delete()
            
            return JsonResponse({
                'success': True,
                'message': 'Mission order and all associated data deleted successfully'
            })
            
        except Exception as e:
            import traceback
            error_details = traceback.format_exc()
            print(f"Error deleting mission order: {error_details}")
            return JsonResponse({
                'success': False,
                'error': str(e),
                'details': error_details
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'message': 'Method not allowed'
    }, status=405)