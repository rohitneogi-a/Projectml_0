from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import yfinance as yf
from sklearn.linear_model import LinearRegression
from textblob import TextBlob
import requests
import json
from .predictor import predict
import numpy as np
import re

# Function to fetch stock price prediction
def predict_stock_price(stock_symbol="TSLA"):
    stock = yf.Ticker(stock_symbol)
    data = stock.history(period="5d")
    data = data[['Close']]
    data['Next Close'] = data['Close'].shift(-1)
    data = data.dropna()

    X = data[['Close']]
    y = data['Next Close']

    model = LinearRegression()
    model.fit(X, y)

    predicted_price = model.predict([[data['Close'].iloc[-1]]])
    return f"Predicted price for {stock_symbol} tomorrow: ${predicted_price[0]:.2f}"

# Function to check if text is English
def is_english(text):
    # Simple check for English text - looks for predominantly English characters and words
    # This is a simplified approach - more sophisticated language detection could be used
    if not text:
        return False
    
    # Check if text contains mostly Latin characters
    english_chars_ratio = len(re.findall(r'[a-zA-Z\s]', text)) / len(text) if len(text) > 0 else 0
    
    # Check if text doesn't contain too many non-Latin characters
    non_latin_chars = len(re.findall(r'[^\x00-\x7F]', text))
    
    # If mostly English characters and not too many non-Latin characters
    return english_chars_ratio > 0.7 and non_latin_chars / len(text) < 0.2 if len(text) > 0 else False

# Function to fetch news related to stock
def fetch_news(stock_symbol="Tesla"):
    api_key = "1556ca54e4b14912bf6e3866857a1295"  # Replace with your NewsAPI key
    url = f"https://newsapi.org/v2/everything?q={stock_symbol}&apiKey={api_key}"
    response = requests.get(url)
    
    if response.status_code != 200:
        return [{"title": "Error fetching news", "sentiment": "Neutral"}]

    articles = response.json().get("articles", [])
    
    news = []
    english_count = 0
    
    # Process all articles but only keep English ones up to 3
    for article in articles:
        if english_count >= 3:
            break
            
        title = article["title"]
        
        # Check if the article is in English
        if is_english(title):
            sentiment = TextBlob(title).sentiment.polarity
            sentiment_type = "Positive" if sentiment > 0 else "Negative" if sentiment < 0 else "Neutral"
            news.append({"title": title, "sentiment": sentiment_type})
            english_count += 1

    return news

# Chatbot view with CORS support
@csrf_exempt
def chatbot(request):
    if request.method == "POST":
        try:
            user_message = json.loads(request.body).get("message", "")
            response = ""

            if "predict" in user_message.lower():
                stock_symbol = user_message.split()[-1]  # Extract stock symbol from message
                response = predict_stock_price(stock_symbol)
            elif "news" in user_message.lower():
                stock_symbol = user_message.split()[-1]
                news_data = fetch_news(stock_symbol)
                
                # Format news data into a readable response
                if news_data:
                    news_text = f"Top English news for {stock_symbol}:\n"
                    for i, item in enumerate(news_data, 1):
                        news_text += f"{i}. {item['title']} - Sentiment: {item['sentiment']}\n"
                    response = news_text
                else:
                    response = f"No English news found for {stock_symbol}"
            
            if not response:
                response = "Sorry, I didn't understand your request. Please ask about 'predict' or 'news'."
            
            # Return JSON response with CORS headers
            response_obj = JsonResponse({"response": response})
            response_obj["Access-Control-Allow-Origin"] = "*"  # Allow all origins
            return response_obj

        except Exception as e:
            return JsonResponse({"response": f"Error: {str(e)}"}, status=500)
        
    return JsonResponse({"response": "Invalid request method. Only POST is allowed."}, status=405)

# Stock prediction view
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
    response["Access-Control-Allow-Origin"] = "*" 
    return response