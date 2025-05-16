import os
import sys
import django
import json
from datetime import datetime, timedelta

# Configurer l'environnement Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

# Importer les modèles après configuration de Django
from django.contrib.auth.hashers import make_password
from gestion.models import User, DemandeAttestation, DemandeOrdreMission, OrdreMission

def create_users():
    """Créer des utilisateurs fictifs"""
    users = [
        {
            'username': 'ahmed_rh',
            'email': 'ahmed.rh@esi.dz',
            'password': 'Pass1234',
            'type': 'rh',
            'prenom_arabe': 'أحمد',
            'nom_arabe': 'بن محمد',
            'eps_arabe': '',
            'nom_latin': 'BEN MOHAMED',
            'prenom_latin': 'Ahmed',
            'genre': 'homme',
            'dateNais': '1980-05-15',
            'Lieu_Nais': 'Alger',
            'Grade': 'Chef RH',
            'Date1erEmbauche': '2010-01-10',
            'Stu_Adm': 'Actif'
        },
        {
            'username': 'fatima_rh',
            'email': 'fatima.rh@esi.dz',
            'password': 'Pass1234',
            'type': 'rh',
            'prenom_arabe': 'فاطمة',
            'nom_arabe': 'الزهراء',
            'eps_arabe': '',
            'nom_latin': 'ZAHRA',
            'prenom_latin': 'Fatima',
            'genre': 'femme',
            'dateNais': '1985-08-20',
            'Lieu_Nais': 'Constantine',
            'Grade': 'Assistante RH',
            'Date1erEmbauche': '2012-03-15',
            'Stu_Adm': 'Actif'
        },
        {
            'username': 'karim_prof',
            'email': 'karim.prof@esi.dz',
            'password': 'Pass1234',
            'type': 'demandeur',
            'prenom_arabe': 'كريم',
            'nom_arabe': 'مالك',
            'eps_arabe': '',
            'nom_latin': 'MALIK',
            'prenom_latin': 'Karim',
            'genre': 'homme',
            'dateNais': '1975-12-03',
            'Lieu_Nais': 'Oran',
            'Grade': 'Professeur',
            'Date1erEmbauche': '2005-09-01',
            'Stu_Adm': 'Actif'
        },
        {
            'username': 'amina_prof',
            'email': 'amina.prof@esi.dz',
            'password': 'Pass1234',
            'type': 'demandeur',
            'prenom_arabe': 'أمينة',
            'nom_arabe': 'بلقاسم',
            'eps_arabe': 'علي',
            'nom_latin': 'BELKACEM',
            'prenom_latin': 'Amina',
            'genre': 'femme',
            'dateNais': '1982-04-25',
            'Lieu_Nais': 'Annaba',
            'Grade': 'Maître de conférences',
            'Date1erEmbauche': '2011-09-01',
            'Stu_Adm': 'Actif'
        },
        {
            'username': 'yacine_admin',
            'email': 'yacine.admin@esi.dz',
            'password': 'Pass1234',
            'type': 'demandeur',
            'prenom_arabe': 'ياسين',
            'nom_arabe': 'عمراني',
            'eps_arabe': '',
            'nom_latin': 'AMRANI',
            'prenom_latin': 'Yacine',
            'genre': 'homme',
            'dateNais': '1978-07-12',
            'Lieu_Nais': 'Sétif',
            'Grade': 'Administrateur',
            'Date1erEmbauche': '2008-02-01',
            'Stu_Adm': 'Actif'
        }
    ]
    
    created_users = []
    for user_data in users:
        # Hasher le mot de passe
        user_data['password'] = make_password(user_data['password'])
        user = User.objects.create(**user_data)
        created_users.append(user)
        print(f"Utilisateur créé: {user.username}")
    
    return created_users

def create_attestations(users):
    """Créer des demandes d'attestation fictives"""
    attestations = []
    
    # Créer des demandes pour les utilisateurs demandeurs
    for user in users:
        if user.type == 'demandeur':
            for i in range(1, 4):  # 3 demandes par utilisateur
                attestation = DemandeAttestation.objects.create(
                    user=user,
                    Message_dem_attest=f"Demande d'attestation de travail #{i} pour {user.prenom_latin} {user.nom_latin}. Cette attestation est nécessaire pour des démarches administratives.",
                    Etat='en_attente' if i == 1 else ('validee' if i == 2 else 'rejetee'),
                    Date=datetime.now() - timedelta(days=i*5)
                )
                attestations.append(attestation)
                print(f"Demande d'attestation créée pour {user.username}: {attestation.id_dem_attest}")
    
    return attestations

def create_ordres_mission(users):
    """Créer des demandes d'ordre de mission fictives"""
    ordres = []
    
    # Créer des demandes pour les utilisateurs demandeurs
    for user in users:
        if user.type == 'demandeur':
            for i in range(1, 3):  # 2 demandes par utilisateur
                date_debut = datetime.now() + timedelta(days=10*i)
                date_fin = date_debut + timedelta(days=5)
                
                ordre = DemandeOrdreMission.objects.create(
                    user=user,
                    Message_ordre=f"Demande d'ordre de mission #{i} pour une conférence à l'étranger. Besoin d'une autorisation officielle.",
                    Etat='en_attente' if i == 1 else 'validee',
                    Date=datetime.now() - timedelta(days=i*3),
                    nom_employe=f"{user.prenom_latin} {user.nom_latin}",
                    poste=user.Grade,
                    departement="Informatique",
                    date_debut_mission=date_debut.strftime('%Y-%m-%d'),
                    date_fin_mission=date_fin.strftime('%Y-%m-%d'),
                    piece_identite="Passeport"
                )
                ordres.append(ordre)
                print(f"Demande d'ordre de mission créée pour {user.username}: {ordre.id_dem_ordre}")
                
                # Pour les demandes validées, créer un ordre de mission
                if ordre.Etat == 'validee':
                    mission = OrdreMission.objects.create(
                        dem_ordre=ordre,
                        Moyens_transport=json.dumps(["Avion", "Taxi"]),
                        date_depart=date_debut.strftime('%Y-%m-%d'),
                        date_retour=date_fin.strftime('%Y-%m-%d'),
                        date_delivrance=datetime.now().strftime('%Y-%m-%d'),
                        lieu_delivrance="Alger",
                        nom_respo="BELKACEM",
                        prenom_respo="Mohammed"
                    )
                    print(f"Ordre de mission créé pour la demande {ordre.id_dem_ordre}")
    
    return ordres

def main():
    """Fonction principale"""
    print("Création de données fictives...")
    users = create_users()
    attestations = create_attestations(users)
    ordres = create_ordres_mission(users)
    print("Données fictives créées avec succès!")
    
    print("\nRésumé:")
    print(f"- {len(users)} utilisateurs créés")
    print(f"- {len(attestations)} demandes d'attestation créées")
    print(f"- {len(ordres)} demandes d'ordre de mission créées")
    print(f"- {OrdreMission.objects.count()} ordres de mission générés")

if __name__ == "__main__":
    main()