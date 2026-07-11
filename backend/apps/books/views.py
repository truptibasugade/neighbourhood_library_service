from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters, viewsets

from apps.books.models import Book
from apps.books.serializers import BookSerializer


class BookViewSet(viewsets.ModelViewSet):
    queryset = Book.objects.all()
    serializer_class = BookSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['genre', 'author']
    search_fields = ['title', 'author', 'isbn']
