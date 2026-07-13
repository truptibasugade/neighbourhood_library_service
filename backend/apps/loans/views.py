from django.db import transaction
from django.utils import timezone
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import mixins, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from apps.books.models import Book
from apps.loans.models import Loan
from apps.loans.serializers import LoanSerializer


class LoanViewSet(
    mixins.CreateModelMixin,
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    viewsets.GenericViewSet,
):
    queryset = Loan.objects.select_related('book', 'member').all()
    serializer_class = LoanSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['member', 'book', 'status']

    @action(detail=True, methods=['post'])
    def return_book(self, request, pk=None):
        loan = self.get_object()

        if loan.status == Loan.Status.RETURNED:
            return Response(
                {'detail': 'This loan has already been returned.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        with transaction.atomic():
            book = Book.objects.select_for_update().get(pk=loan.book_id)
            book.available_copies += 1
            book.save(update_fields=['available_copies', 'updated_at'])

            loan.status = Loan.Status.RETURNED
            loan.returned_at = timezone.now()
            loan.save(update_fields=['status', 'returned_at'])

        return Response(self.get_serializer(loan).data)

    @action(detail=False, methods=['get'])
    def overdue(self, request):
        overdue_loans = self.get_queryset().filter(
            status=Loan.Status.BORROWED,
            due_date__lt=timezone.localdate(),
        )
        page = self.paginate_queryset(overdue_loans)
        serializer = self.get_serializer(page if page is not None else overdue_loans, many=True)
        if page is not None:
            return self.get_paginated_response(serializer.data)
        return Response(serializer.data)
