from django.contrib import admin

from apps.loans.models import Loan


@admin.register(Loan)
class LoanAdmin(admin.ModelAdmin):
    list_display = ('book', 'member', 'borrowed_at', 'due_date', 'returned_at', 'status')
    list_filter = ('status',)
    search_fields = ('book__title', 'member__first_name', 'member__last_name')
