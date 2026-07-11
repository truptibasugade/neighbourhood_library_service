from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('apps.books.urls')),
    path('api/', include('apps.members.urls')),
    path('api/', include('apps.loans.urls')),
]
