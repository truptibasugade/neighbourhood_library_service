from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from apps.members.models import Member


class MemberApiTests(APITestCase):
    def setUp(self):
        self.member = Member.objects.create(
            first_name='Alice', last_name='Nguyen', email='alice@example.com',
        )

    def test_create_member(self):
        response = self.client.post(reverse('member-list'), {
            'first_name': 'Bob', 'last_name': 'Smith', 'email': 'bob@example.com',
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['status'], 'active')

    def test_create_member_rejects_duplicate_email(self):
        response = self.client.post(reverse('member-list'), {
            'first_name': 'Bob', 'last_name': 'Smith', 'email': self.member.email,
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_suspend_member(self):
        response = self.client.patch(
            reverse('member-detail', args=[self.member.id]), {'status': 'suspended'},
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.member.refresh_from_db()
        self.assertEqual(self.member.status, Member.Status.SUSPENDED)
