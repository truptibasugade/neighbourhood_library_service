from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from apps.books.models import Book


class BookApiTests(APITestCase):
    def setUp(self):
        self.book = Book.objects.create(
            isbn='978-0141439518', title='Pride and Prejudice',
            author='Jane Austen', total_copies=2, available_copies=2,
        )

    def test_create_book_defaults_available_copies_to_total(self):
        response = self.client.post(reverse('book-list'), {
            'isbn': '111', 'title': 'New Book', 'author': 'Someone', 'total_copies': 3,
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['available_copies'], 3)

    def test_create_book_rejects_available_exceeding_total(self):
        response = self.client.post(reverse('book-list'), {
            'isbn': '222', 'title': 'Bad Book', 'author': 'Someone',
            'total_copies': 1, 'available_copies': 5,
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_book_rejects_duplicate_isbn(self):
        response = self.client.post(reverse('book-list'), {
            'isbn': self.book.isbn, 'title': 'Dup', 'author': 'X', 'total_copies': 1,
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_list_books(self):
        response = self.client.get(reverse('book-list'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['count'], 1)

    def test_delete_book(self):
        response = self.client.delete(reverse('book-detail', args=[self.book.id]))
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Book.objects.filter(id=self.book.id).exists())
