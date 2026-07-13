from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters, viewsets

from apps.members.models import Member
from apps.members.serializers import MemberSerializer


class MemberViewSet(viewsets.ModelViewSet):
    queryset = Member.objects.all()
    serializer_class = MemberSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['status']
    search_fields = ['first_name', 'last_name', 'email']
