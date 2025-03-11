# stock_predictor/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('', views.stock_prediction_view, name='stock_prediction'),
]
