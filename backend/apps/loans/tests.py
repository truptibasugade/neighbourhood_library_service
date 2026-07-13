import datetime

from django.urls import reverse
from django.utils import timezone
from rest_framework import status
from rest_framework.test import APITestCase

from apps.books.models import Book
from apps.members.models import Member
from apps.loans.models import Loan


class LoanApiTests(APITestCase):
    def setUp(self):
        self.book = Book.objects.create(
            isbn='978-0060850524', title='Brave New World',
            author='Aldous Huxley', total_copies=1, available_copies=1,
        )
        self.active_member = Member.objects.create(
            first_name='Marcus', last_name='Chen', email='marcus@example.com',
        )
        self.suspended_member = Member.objects.create(
            first_name='Alice', last_name='Nguyen', email='alice@example.com',
            status=Member.Status.SUSPENDED,
        )

    def test_borrow_book_decrements_availability(self):
        response = self.client.post(reverse('loan-list'), {
            'book': self.book.id, 'member': self.active_member.id,
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.book.refresh_from_db()
        self.assertEqual(self.book.available_copies, 0)

    def test_cannot_borrow_book_with_no_copies_available(self):
        self.client.post(reverse('loan-list'), {
            'book': self.book.id, 'member': self.active_member.id,
        })
        second_member = Member.objects.create(
            first_name='Jane', last_name='Doe', email='jane@example.com',
        )
        response = self.client.post(reverse('loan-list'), {
            'book': self.book.id, 'member': second_member.id,
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_cannot_borrow_as_suspended_member(self):
        response = self.client.post(reverse('loan-list'), {
            'book': self.book.id, 'member': self.suspended_member.id,
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_return_book_increments_availability(self):
        loan = Loan.objects.create(book=self.book, member=self.active_member)
        self.book.available_copies = 0
        self.book.save()

        response = self.client.post(reverse('loan-return-book', args=[loan.id]))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.book.refresh_from_db()
        self.assertEqual(self.book.available_copies, 1)
        loan.refresh_from_db()
        self.assertEqual(loan.status, Loan.Status.RETURNED)

    def test_cannot_return_already_returned_loan(self):
        loan = Loan.objects.create(
            book=self.book, member=self.active_member,
            status=Loan.Status.RETURNED, returned_at=timezone.now(),
        )
        response = self.client.post(reverse('loan-return-book', args=[loan.id]))
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_filter_loans_by_member(self):
        Loan.objects.create(book=self.book, member=self.active_member)
        response = self.client.get(reverse('loan-list'), {'member': self.active_member.id})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['count'], 1)

    def test_overdue_endpoint_returns_only_past_due_loans(self):
        Loan.objects.create(
            book=self.book, member=self.active_member,
            due_date=timezone.localdate() - datetime.timedelta(days=1),
        )
        response = self.client.get(reverse('loan-overdue'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['count'], 1)
