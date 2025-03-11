# stock_predictor/views.py
from django.shortcuts import render
from django.http import JsonResponse
from .predictor import predict
import numpy as np


def stock_prediction_view(request):
    if request.method == "OPTIONS":
        # Handle preflight request
        response = JsonResponse({"message": "CORS preflight successful"})
        response["Access-Control-Allow-Origin"] = "*"
        response["Access-Control-Allow-Methods"] = "GET, OPTIONS"
        response["Access-Control-Allow-Headers"] = "Content-Type"
        return response

    if request.method == "GET":
        ticker = request.GET.get("ticker", "")
        if ticker:
            prediction_result = predict(ticker)
            if isinstance(prediction_result, np.ndarray):
                prediction_result = prediction_result.tolist()

            response = JsonResponse({"prediction": prediction_result})
            response["Access-Control-Allow-Origin"] = "*"  # Explicitly add header
            return response
        else:
            response = JsonResponse({"error": "Please provide a ticker symbol"}, status=400)
            response["Access-Control-Allow-Origin"] = "*"  # Explicitly add header
            return response

    response = JsonResponse({"error": "Method not allowed"}, status=405)
    response["Access-Control-Allow-Origin"] = "*"  # Explicitly add header
    return response