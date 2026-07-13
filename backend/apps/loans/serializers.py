from django.db import transaction
from rest_framework import serializers

from apps.books.models import Book
from apps.members.models import Member
from apps.loans.models import Loan


class LoanSerializer(serializers.ModelSerializer):
    book_title = serializers.CharField(source='book.title', read_only=True)
    member_name = serializers.SerializerMethodField()

    class Meta:
        model = Loan
        fields = [
            'id', 'book', 'book_title', 'member', 'member_name',
            'borrowed_at', 'due_date', 'returned_at', 'status',
        ]
        read_only_fields = ['id', 'borrowed_at', 'due_date', 'returned_at', 'status']

    def get_member_name(self, obj):
        return f'{obj.member.first_name} {obj.member.last_name}'

    def validate_book(self, book):
        if book.available_copies < 1:
            raise serializers.ValidationError(
                f'"{book.title}" has no available copies.'
            )
        return book

    def validate_member(self, member):
        if member.status != Member.Status.ACTIVE:
            raise serializers.ValidationError(
                f'{member.first_name} {member.last_name} is not an active member.'
            )
        return member

    def create(self, validated_data):
        with transaction.atomic():
            book = Book.objects.select_for_update().get(pk=validated_data['book'].pk)
            if book.available_copies < 1:
                raise serializers.ValidationError(
                    {'book': f'"{book.title}" has no available copies.'}
                )
            book.available_copies -= 1
            book.save(update_fields=['available_copies', 'updated_at'])
            return Loan.objects.create(book=book, member=validated_data['member'])
