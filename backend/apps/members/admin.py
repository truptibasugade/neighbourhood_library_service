from django.contrib import admin

from apps.members.models import Member


@admin.register(Member)
class MemberAdmin(admin.ModelAdmin):
    list_display = ('first_name', 'last_name', 'email', 'status', 'membership_date')
    search_fields = ('first_name', 'last_name', 'email')
    list_filter = ('status',)
