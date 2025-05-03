from django.contrib import admin

# Register your models here.
from .models import User, DemandeAttestation, DemandeOrdreMission, OrdreMission

admin.site.register(User)
admin.site.register(DemandeAttestation)
admin.site.register(DemandeOrdreMission)
admin.site.register(OrdreMission)