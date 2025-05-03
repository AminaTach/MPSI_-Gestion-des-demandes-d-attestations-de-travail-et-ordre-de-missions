from django.shortcuts import get_object_or_404
from django.contrib.auth.hashers import make_password, check_password
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.core.mail import send_mail
from django.conf import settings
import random
import json
from datetime import datetime
from django.db.models import Q
from .models import User, PasswordResetCode

# Fonction utilitaire pour convertir un modèle en dict
def model_to_dict(instance, exclude_fields=None):
    if exclude_fields is None:
        exclude_fields = []
    
    result = {}
    for field in instance._meta.fields:
        if field.name not in exclude_fields:
            value = getattr(instance, field.name)
            if isinstance(value, datetime):
                value = value.strftime('%Y-%m-%d')
            result[field.name] = value
    return result

#1. Inscription
@csrf_exempt
def api_register(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Corps de la requête JSON invalide.'}, status=400)
        
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')
        
        if not username or not email or not password:
            return JsonResponse({'error': 'Champs manquants.'}, status=400)
        
        if User.objects.filter(username=username).exists():
            return JsonResponse({'error': 'Ce nom d\'utilisateur existe déjà.'}, status=400)
        
        if User.objects.filter(email=email).exists():
            return JsonResponse({'error': 'Cet email existe déjà.'}, status=400)
        
        user_type = 'demandeur'
        if email and '@esi.dz' in email:
            rh_prefixes = ['rh.', 'hr.', 'ressources.', 'admin.']
            if any(prefix in email.split('@')[0].lower() for prefix in rh_prefixes):
                user_type = 'rh'
        
        user = User(
            username=username,
            email=email,
            password=make_password(password),
            type=user_type,
            temporary_role=user_type,  # Initialiser temporary_role avec type
            prenom_arabe=data.get('prenom_arabe', ''),
            nom_arabe=data.get('nom_arabe', ''),
            eps_arabe=data.get('eps_arabe', ''),
            nom_latin=data.get('nom_latin', ''),
            prenom_latin=data.get('prenom_latin', ''),
            genre=data.get('genre', 'homme'),
            dateNais=data.get('dateNais'),
            Lieu_Nais=data.get('Lieu_Nais', ''),
            Grade=data.get('Grade', ''),
            Date1erEmbauche=data.get('Date1erEmbauche'),
            Stu_Adm=data.get('Stu_Adm', '')
        )
        user.save()
        
        return JsonResponse({
            'success': True,
            'message': 'Inscription réussie',
            'user_id': user.id_user
        })
    
    return JsonResponse({'error': 'Méthode non autorisée'}, status=405)

#2. Connexion
@csrf_exempt
def api_login(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Corps de la requête JSON invalide.'}, status=400)
        
        identifier = data.get('identifier')
        password = data.get('password')
        
        if not identifier or not password:
            return JsonResponse({'error': 'Champs manquants.'}, status=400)
        
        try:
            user = None
            if '@' in identifier:
                user = User.objects.get(email=identifier)
            else:
                user = User.objects.get(username=identifier)
                
            if check_password(password, user.password):
                token = f"session_{user.id_user}_{hash(datetime.now())}"
                
                return JsonResponse({
                    'success': True,
                    'message': f'Bienvenue, {user.username}!',
                    'user_id': user.id_user,
                    'username': user.username,
                    'user_type': user.temporary_role or user.type,
                    'token': token
                })
            else:
                return JsonResponse({'error': 'Mot de passe incorrect.'}, status=401)
        except User.DoesNotExist:
            return JsonResponse({'error': 'Utilisateur ou email non trouvé.'}, status=404)
    
    return JsonResponse({'error': 'Méthode non autorisée'}, status=405)

#3. Réinitialisation de mot de passe
@csrf_exempt
def api_forgot_password(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Corps de la requête JSON invalide.'}, status=400)
        
        email = data.get('email')
        if not email:
            return JsonResponse({'error': 'Champ email manquant.'}, status=400)
        
        try:
            user = User.objects.get(email=email)
            code = ''.join([str(random.randint(0, 9)) for _ in range(6)])  # Générer un code à 6 chiffres
            
            # Supprimer les anciens codes pour cet utilisateur
            PasswordResetCode.objects.filter(user=user).delete()
            PasswordResetCode.objects.create(user=user, code=code)
            
            # Envoyer l'email avec le code
            try:
                send_mail(
                    'Réinitialisation de mot de passe',
                    f'Votre code de réinitialisation est : {code}\nCe code est valide pendant 15 minutes.',
                    settings.DEFAULT_FROM_EMAIL,
                    [email],
                    fail_silently=False,
                )
            except Exception as e:
                return JsonResponse({'error': f'Échec de l\'envoi de l\'email: {str(e)}'}, status=500)
            
            return JsonResponse({
                'success': True,
                'message': 'Code de réinitialisation envoyé.'
            })
        except User.DoesNotExist:
            return JsonResponse({'error': 'Aucun compte associé à cet email.'}, status=404)
    
    return JsonResponse({'error': 'Méthode non autorisée'}, status=405)

#4. Réinitialisation de mot de passe
@csrf_exempt
def api_reset_password(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Corps de la requête JSON invalide.'}, status=400)
        
        code = data.get('code')
        new_password = data.get('new_password')
        confirm_password = data.get('confirm_password')
        
        if not code or not new_password or not confirm_password:
            return JsonResponse({'error': 'Champs manquants.'}, status=400)
        
        if new_password != confirm_password:
            return JsonResponse({'error': 'Les mots de passe ne correspondent pas.'}, status=400)
        
        try:
            reset_code = PasswordResetCode.objects.get(code=code)
            
            if reset_code.is_expired():
                return JsonResponse({'error': 'Le code de réinitialisation a expiré.'}, status=400)
            
            user = reset_code.user
            user.password = make_password(new_password)
            user.save()
            
            reset_code.delete()
            
            return JsonResponse({
                'success': True,
                'message': 'Mot de passe réinitialisé avec succès.'
            })
        except PasswordResetCode.DoesNotExist:
            return JsonResponse({'error': 'Code de réinitialisation invalide.'}, status=400)
    
    return JsonResponse({'error': 'Méthode non autorisée'}, status=405)

#5. Changer de rôle
@csrf_exempt
def api_switch_role(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Corps de la requête JSON invalide.'}, status=400)
        
        user_id = data.get('user_id')
        target_role = data.get('target_role')
        
        if not user_id or not target_role:
            return JsonResponse({'error': 'Champs user_id ou target_role manquants.'}, status=400)
        
        if target_role not in ['rh', 'demandeur']:
            return JsonResponse({'error': 'Rôle cible invalide.'}, status=400)
        
        try:
            user = User.objects.get(id_user=user_id)
            
            if '@esi.dz' not in user.email:
                return JsonResponse({'error': 'Vous n\'êtes pas autorisé à changer de rôle.'}, status=403)
            
            if user.type != 'rh':
                return JsonResponse({'error': 'Seuls les utilisateurs RH peuvent basculer de rôle.'}, status=403)
            
            user.temporary_role = target_role
            user.save()
            
            return JsonResponse({
                'success': True,
                'message': f'Rôle changé : vous êtes maintenant en mode {target_role}.',
                'user_type': target_role
            })
        except User.DoesNotExist:
            return JsonResponse({'error': 'Utilisateur non trouvé.'}, status=404)
    
    return JsonResponse({'error': 'Méthode non autorisée'}, status=405)

#6. Mettre à jour le profil
@csrf_exempt
def api_update_profile(request):
    if request.method == 'PUT':
        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Corps de la requête JSON invalide.'}, status=400)
        
        user_id = data.get('user_id')
        
        if not user_id:
            return JsonResponse({'error': 'Champ user_id manquant.'}, status=400)
        
        try:
            user = User.objects.get(id_user=user_id)
            
            username = data.get('username')
            current_password = data.get('current_password')
            new_password = data.get('new_password')
            confirm_password = data.get('confirm_password')
            
            if username and username != user.username:
                if User.objects.filter(username=username).exists():
                    return JsonResponse({'error': 'Ce nom d\'utilisateur est déjà pris.'}, status=400)
                user.username = username
            
            if current_password and new_password and confirm_password:
                if not check_password(current_password, user.password):
                    return JsonResponse({'error': 'Mot de passe actuel incorrect.'}, status=401)
                if new_password != confirm_password:
                    return JsonResponse({'error': 'Les nouveaux mots de passe ne correspondent pas.'}, status=400)
                user.password = make_password(new_password)
            
            user.save()
            
            return JsonResponse({
                'success': True,
                'message': 'Profil mis à jour avec succès.',
                'username': user.username
            })
        except User.DoesNotExist:
            return JsonResponse({'error': 'Utilisateur non trouvé.'}, status=404)
    
    return JsonResponse({'error': 'Méthode non autorisée'}, status=405)

#7. Obtenir les informations de l'utilisateur
@csrf_exempt
def api_get_user(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Corps de la requête JSON invalide.'}, status=400)
        
        nom_latin = data.get('nom_latin')
        prenom_latin = data.get('prenom_latin')
        
        if not nom_latin or not prenom_latin:
            return JsonResponse({'error': 'Champs nom_latin ou prenom_latin manquants.'}, status=400)
        
        try:
            user = User.objects.get(
                Q(nom_latin__iexact=nom_latin) & Q(prenom_latin__iexact=prenom_latin)
            )
            return JsonResponse({
                'success': True,
                'user': {
                    'id_user': user.id_user,
                    'username': user.username,
                    'email': user.email,
                    'nom_latin': user.nom_latin,
                    'prenom_latin': user.prenom_latin,
                    'type': user.type,
                    'temporary_role': user.temporary_role or user.type
                }
            })
        except User.DoesNotExist:
            return JsonResponse({'error': 'Utilisateur non trouvé avec ce nom et prénom.'}, status=404)
        except User.MultipleObjectsReturned:
            return JsonResponse({'error': 'Plusieurs utilisateurs correspondent à ces critères.'}, status=400)
    
    return JsonResponse({'error': 'Méthode non autorisée'}, status=405)