import datetime

from django.db import models
from django.utils import timezone

from apps.books.models import Book
from apps.members.models import Member

LOAN_PERIOD_DAYS = 14


class Loan(models.Model):
    class Status(models.TextChoices):
        BORROWED = 'borrowed', 'Borrowed'
        RETURNED = 'returned', 'Returned'

    book = models.ForeignKey(Book, on_delete=models.PROTECT, related_name='loans')
    member = models.ForeignKey(Member, on_delete=models.PROTECT, related_name='loans')
    borrowed_at = models.DateTimeField(auto_now_add=True)
    due_date = models.DateField()
    returned_at = models.DateTimeField(null=True, blank=True)
    status = models.CharField(
        max_length=10, choices=Status.choices, default=Status.BORROWED
    )

    class Meta:
        ordering = ['-borrowed_at']

    def save(self, *args, **kwargs):
        if not self.due_date:
            self.due_date = timezone.localdate() + datetime.timedelta(days=LOAN_PERIOD_DAYS)
        super().save(*args, **kwargs)

    @property
    def is_overdue(self) -> bool:
        return self.status == self.Status.BORROWED and self.due_date < timezone.localdate()

    def __str__(self):
        return f'{self.member} - {self.book} ({self.status})'
