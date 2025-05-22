from django.db import models
from django.utils import timezone
from datetime import timedelta

class User(models.Model):
    TYPE_CHOICES = (
        ('rh', 'Ressources Humaines'),
        ('demandeur', 'Demandeur'),
    )
    
    ROLE_CHOICES = (
        ('rh', 'Ressources Humaines'),
        ('demandeur', 'Demandeur'),
    )
    
    id_user = models.AutoField(primary_key=True)
    username = models.CharField(max_length=150, unique=True)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=128)
    type = models.CharField(max_length=20, choices=TYPE_CHOICES, default='demandeur')
    temporary_role = models.CharField(max_length=20, choices=ROLE_CHOICES, null=True, blank=True)
    prenom_arabe = models.CharField(max_length=100, blank=True)
    nom_arabe = models.CharField(max_length=100, blank=True)
    eps_arabe = models.CharField(max_length=100, blank=True)
    nom_latin = models.CharField(max_length=100, blank=True)
    prenom_latin = models.CharField(max_length=100, blank=True)
    genre = models.CharField(max_length=10, blank=True)
    dateNais = models.DateField(null=True, blank=True)
    Lieu_Nais = models.CharField(max_length=100, blank=True)
    Grade = models.CharField(max_length=100, blank=True)
    Date1erEmbauche = models.DateField(null=True, blank=True)
    Stu_Adm = models.CharField(max_length=100, blank=True)
    
    def __str__(self):
        return self.username

class DemandeAttestation(models.Model):
    ETAT_CHOICES = [
        ('en_attente', 'En attente'),
        ('rejetee', 'Rejetée'),
        ('validee', 'Validée'),
    ]

    id_dem_attest = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    Message_dem_attest = models.TextField(blank=True, null=True)
    Etat = models.CharField(max_length=20, choices=ETAT_CHOICES)
    Date = models.DateField(auto_now_add=True)
    Piece_jointe = models.FileField(upload_to='attestations/', blank=True, null=True)

    def __str__(self):
        return f"Demande Attestation {self.id_dem_attest} de {self.user.username}"

class DemandeOrdreMission(models.Model):
    ETAT_CHOICES = [
        ('en_attente', 'En attente'),
        ('rejetee', 'Rejetée'),
        ('validee', 'Validée'),
    ]

    id_dem_ordre = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    Message_ordre = models.TextField(blank=True, null=True)
    Etat = models.CharField(max_length=20, choices=ETAT_CHOICES)
    Date = models.DateField(auto_now_add=True)
    Piece_jointe = models.FileField(upload_to='ordres_mission/', blank=True, null=True)
    nom_employe = models.CharField(max_length=255)
    poste = models.CharField(max_length=255)
    departement = models.CharField(max_length=255)
    date_debut_mission = models.DateField()
    date_fin_mission = models.DateField()
    objet_mission = models.TextField(blank=True, null=True)  # Changed from FileField to TextField
    piece_identite = models.CharField(max_length=255)

    def __str__(self):
        return f"Demande Ordre Mission {self.id_dem_ordre} de {self.user.username}"

class OrdreMission(models.Model):
    id_ordre_mission = models.AutoField(primary_key=True)
    dem_ordre = models.OneToOneField(DemandeOrdreMission, on_delete=models.CASCADE)
    # Changed from JSONField to CharField to match frontend usage
    Moyens_transport = models.CharField(max_length=255)
    date_depart = models.DateField()
    date_retour = models.DateField()
    date_delivrance = models.DateField()
    lieu_delivrance = models.CharField(max_length=255)
    nom_respo = models.CharField(max_length=255)
    prenom_respo = models.CharField(max_length=255)

    def __str__(self):
        return f"Ordre Mission {self.id_ordre_mission} pour {self.dem_ordre.nom_employe}"
    
class PasswordResetCode(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    code = models.CharField(max_length=6, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()

    def save(self, *args, **kwargs):
        if not self.expires_at:
            self.expires_at = timezone.now() + timedelta(minutes=15)  # Expire dans 15 minutes
        super().save(*args, **kwargs)

    def is_expired(self):
        return timezone.now() > self.expires_at

    def __str__(self):
        return f"Code {self.code} pour {self.user.username}"
