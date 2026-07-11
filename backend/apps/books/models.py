from django.db import models


class Book(models.Model):
    isbn = models.CharField(max_length=20, unique=True)
    title = models.CharField(max_length=255)
    author = models.CharField(max_length=255)
    genre = models.CharField(max_length=100, blank=True)
    publisher = models.CharField(max_length=255, blank=True)
    published_year = models.PositiveIntegerField(null=True, blank=True)
    total_copies = models.PositiveIntegerField(default=1)
    available_copies = models.PositiveIntegerField(default=1)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['title']
        constraints = [
            models.CheckConstraint(
                condition=models.Q(available_copies__lte=models.F('total_copies')),
                name='books_available_lte_total',
            ),
        ]

    def __str__(self):
        return f'{self.title} by {self.author}'
