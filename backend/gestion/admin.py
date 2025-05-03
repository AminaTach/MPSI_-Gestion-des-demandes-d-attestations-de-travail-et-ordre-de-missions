from django.contrib import admin

from .models import User, DemandeAttestation, DemandeOrdreMission, OrdreMission

admin.site.register(User)
admin.site.register(DemandeAttestation)
admin.site.register(DemandeOrdreMission)
admin.site.register(OrdreMission)
