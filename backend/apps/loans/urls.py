from rest_framework.routers import DefaultRouter

from apps.loans.views import LoanViewSet

router = DefaultRouter()
router.register('loans', LoanViewSet, basename='loan')

urlpatterns = router.urls
