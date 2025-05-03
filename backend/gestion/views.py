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
