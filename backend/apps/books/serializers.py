from rest_framework import serializers

from apps.books.models import Book


class BookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = [
            'id', 'isbn', 'title', 'author', 'genre', 'publisher',
            'published_year', 'total_copies', 'available_copies',
            'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def validate(self, attrs):
        total_copies = attrs.get(
            'total_copies',
            getattr(self.instance, 'total_copies', None),
        )
        available_copies = attrs.get(
            'available_copies',
            getattr(self.instance, 'available_copies', None),
        )
        if (
            total_copies is not None
            and available_copies is not None
            and available_copies > total_copies
        ):
            raise serializers.ValidationError(
                'available_copies cannot exceed total_copies.'
            )
        return attrs

    def create(self, validated_data):
        validated_data.setdefault(
            'available_copies', validated_data.get('total_copies', 1)
        )
        return super().create(validated_data)
