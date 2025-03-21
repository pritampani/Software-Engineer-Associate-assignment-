from django.urls import path
from .views import DataEntryList

urlpatterns = [
    path('data/', DataEntryList.as_view(), name='data-list'),
]