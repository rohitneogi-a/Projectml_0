# predictions/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('predict/', views.stock_prediction_view, name='stock_prediction'),
    path('chatbot/', views.chatbot, name='chatbot'),
]