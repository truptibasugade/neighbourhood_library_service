from rest_framework import serializers

from apps.members.models import Member


class MemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = Member
        fields = [
            'id', 'first_name', 'last_name', 'email', 'phone', 'address',
            'membership_date', 'status', 'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'membership_date', 'created_at', 'updated_at']
