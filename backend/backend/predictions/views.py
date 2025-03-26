from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import yfinance as yf
from sklearn.linear_model import LinearRegression
import json
from .predictor import predict
import numpy as np
import re
import google.generativeai as genai
from dotenv import load_dotenv
import os

load_dotenv()
# Stock mapping
STOCK_MAPPING = {
  "3M India": "3MINDIA",
  "Abbott India": "ABBOTINDIA",
  "Adani Enterprises": "ADANIENT",
  "Adani Green Energy": "ADANIGREEN",
  "Adani Power": "ADANIPOWER",
  "Adani Ports": "ADANIPORTS",
  "Alembic Pharmaceuticals": "APLLTD",
  "Alkem Laboratories": "ALKEM",
  "Ambuja Cements": "AMBUJACEM",
  "Aurobindo Pharma": "AUROPHARMA",
  "Axis Bank": "AXISBANK",
  "Bajaj Auto": "BAJAJ-AUTO",
  "Bajaj Finance": "BAJFINANCE",
  "Bajaj Finserv": "BAJAJFINSV",
  "Bandhan Bank": "BANDHANBNK",
  "Bank of Baroda": "BANKBARODA",
  "Bharti Airtel": "BHARTIARTL",
  "Birla Corporation": "BIRLACORPN",
  "Bosch Limited": "BOSCHLTD",
  "Britannia Industries": "BRITANNIA",
  "Cadila Healthcare": "CADILAHC",
  "Canara Bank": "CANBK",
  "Cipla": "CIPLA",
  "Coal India": "COALINDIA",
  "Container Corporation of India": "CONCOR",
  "Divi's Laboratories": "DIVISLAB",
  "Dabur India": "DABUR",
  "Dr. Reddy's Laboratories": "DRREDDY",
  "Eicher Motors": "EICHERMOT",
  "Federal Bank": "FEDERALBNK",
  "GAIL India": "GAIL",
  "Godrej Consumer Products": "GODREJCP",
  "Grasim Industries": "GRASIM",
  "HCL Technologies": "HCLTECH",
  "HDFC Asset Management": "HDFCAMC",
  "HDFC Bank": "HDFCBANK",
  "Hindalco Industries": "HINDALCO",
  "Hindustan Zinc": "HINDZINC",
  "ICICI Bank": "ICICIBANK",
  "ICICI Lombard General Insurance": "ICICIGI",
  "Indiabulls Housing Finance": "IBULHSGFIN",
  "IndusInd Bank": "INDUSINDBK",
  "Infosys": "INFY",
  "ITC Limited": "ITC",
  "JSW Steel": "JSWSTEEL",
  "Kajaria Ceramics": "KAJARIACER",
  "Kotak Mahindra Bank": "KOTAKBANK",
  "Larsen & Toubro": "LT",
  "Lupin": "LUPIN",
  "Mahindra & Mahindra": "M&M",
  "Motherson Sumi": "MOTHERSUMI",
  "Marico": "MARICO",
  "Nestlé India": "NESTLEIND",
  "NMDC Limited": "NMDC",
  "NTPC Limited": "NTPC",
  "Oberoi Realty": "OBEROIRLTY",
  "Oil and Natural Gas Corporation": "ONGC",
  "Power Grid Corporation of India": "POWERGRID",
  "Punjab National Bank": "PNB",
  "RBL Bank": "RBLBANK",
  "Reliance Industries": "RELIANCE",
  "SBI Life Insurance": "SBILIFE",
  "Shree Cement": "SHREECEM",
  "Siemens": "SIEMENS",
  "State Bank of India": "SBI",
  "Sun Pharmaceutical Industries": "SUNPHARMA",
  "Tata Chemicals": "TATACHEM",
  "Tata Consultancy Services": "TCS",
  "Tata Motors": "TATAMOTORS",
  "Tata Power": "TATAPOWER",
  "Tech Mahindra": "TECHM",
  "Titan": "TITAN",
  "UltraTech Cement": "ULTRACEMCO",
  "UPL": "UPL",
  "Wipro Limited": "WIPRO",
  "Zee Entertainment Enterprises": "ZEEL",
  "Zomato": "ZOMATO",
  "Ajanta Pharma": "AJANTPHARM",
  "Bajaj Hindusthan Sugar": "BAJAJHIND",
  "Balrampur Chini Mills": "BALRAMCHIN",
  "Bank of India": "BANKINDIA",
  "Bharti Infratel": "BHARTIINFR",
  "Blue Star": "BLUESTARCO",
  "Chennai Petrochemicals": "CHENNPETRO",
  "Cholamandalam Investment": "CHOLAFIN",
  "Coromandel International": "COROMANDEL",
  "Crisil": "CRISIL",
  "Exide Industries": "EXIDEIND",
  "Godrej Industries": "GODREJIND",
  "Hindustan Unilever": "HUL",
  "ICICI Prudential Life Insurance": "ICICIPRULI",
  "Indian Oil Corporation": "IOC",
  "L&T Technology Services": "LTTS",
  "Mahindra Lifespace Developers": "MAHLIFE",
  "National Aluminium Company": "NALCO",
  "Pidilite Industries": "PIDILITIND",
  "Piramal Enterprises": "PIRAMAL",
  "Power Finance Corporation": "PFC",
  "HDFC": "HDFC",
  "HINDUNILVR": "HINDUNILVR",
  "BHEL": "BHEL",
  "MARUTI": "MARUTI",
  "ASIANPAINT": "ASIANPAINT",
  "APOLLOHOSP": "APOLLOHOSP",
  "JINDALSTEL": "JINDALSTEL",
  "MUTHOOTFIN": "MUTHOOTFIN",
  "TATACONSUM": "TATACONSUM",
  "INDIAMART": "INDIAMART",
  "BERGEPAINT": "BERGEPAINT",
  "BEL": "BEL",
  "HAVELLS": "HAVELLS",
  "IOB": "IOB",
  "HEROMOTOCO": "HEROMOTOCO",
  "HDFCLIFE": "HDFCLIFE",
  "PVR": "PVR",
  "RAJESHEXPORTS": "RAJESHEXPORTS",
  "INFIBEAM": "INFIBEAM",
  "LTI": "LTI",
  "RELIANCEIND": "RELIANCEIND",
  "M&MFIN": "M&MFIN",
  "PERSISTENT": "PERSISTENT",
  "SRF": "SRF",
  "WELSPUNIND": "WELSPUNIND",
  "RAMCOCEM": "RAMCOCEM",
  "GICRE": "GICRE",
  "NLCINDIA": "NLCINDIA",
  "MCX": "MCX",
  "BAJJAUTO": "BAJJAUTO",
  "TATAELXSI": "TATAELXSI",
  "BALKRISIND": "BALKRISIND",
  "JUBLFOOD": "JUBLFOOD",
  "TATAGLOBAL": "TATAGLOBAL",
  "APOLLOTYRE": "APOLLOTYRE",
  "MRF": "MRF",
  "NAYARA": "NAYARA",
  "IDFCFIRSTB": "IDFCFIRSTB",
  "GMRINFRA": "GMRINFRA",
  "IRCTC": "IRCTC",
  "IEX": "IEX",
  "LALPATHLAB": "LALPATHLAB",
  "INFRATEL": "INFRATEL",
  "BIOCON": "BIOCON",
  "COLPAL": "COLPAL",
  "VGUARD": "VGUARD",
  "RELIANCEINFRA": "RELIANCEINFRA",
  "PUNJAB NATIONAL BANK": "PNB",
  "SOMANYCERA": "SOMANYCERA",
  "ACC": "ACC",
  "VODAFONE": "VODAFONE",
  "MOTHERSONSUMI": "MOTHERSONSUMI",
  "POLYCAB": "POLYCAB",
  "MINDTREE": "MINDTREE",
  "DELTA": "DELTA",
  "INDIACEM": "INDIACEM",
  "LICHSGFIN": "LICHSGFIN",
  "MAXHEALTH": "MAXHEALTH",
  "LIC": "LIC",
  "AARTIIND": "AARTIIND",
  # Add NSE suffix for yfinance
  
}

# Normalize company names (for better matching)
def normalize_company_name(name):
    name = name.lower().strip()
    name = re.sub(r'[^a-z0-9\s]', '', name)  # Remove special characters
    return name

# Create a normalized version of the mapping for better matching
NORMALIZED_STOCK_MAPPING = {normalize_company_name(k): v for k, v in STOCK_MAPPING.items()}

# Function to get stock symbol from company name or partial match
def get_stock_symbol(query):
    query = query.strip()
    
    # Direct match
    if query in STOCK_MAPPING:
        return STOCK_MAPPING[query]
    
    # Check if it's already a symbol
    if query.upper() in [symbol.split('.')[0] for symbol in STOCK_MAPPING.values()]:
        for symbol in STOCK_MAPPING.values():
            if query.upper() == symbol.split('.')[0]:
                return symbol
    
    # Try normalized matching
    normalized_query = normalize_company_name(query)
    if normalized_query in NORMALIZED_STOCK_MAPPING:
        return NORMALIZED_STOCK_MAPPING[normalized_query]
    
    # Partial match
    for company, symbol in STOCK_MAPPING.items():
        if query.lower() in company.lower():
            return symbol
    
    # If nothing works, return the original query with .NS suffix
    # This is a fallback for the Indian stock market
    return f"{query.upper()}.NS"

# Configure Gemini API
def configure_gemini():
    # You'll need to set your API key here
    GEMINI_API_KEY = os.getenv('GEMINI_API_KEY') 
    genai.configure(api_key=GEMINI_API_KEY)

# Initialize Gemini
configure_gemini()

# Helper function to list available models
def list_available_models():
    try:
        models = genai.list_models()
        return [model.name for model in models]
    except Exception as e:
        return f"Error listing models: {str(e)}"

# Function to fetch stock price prediction
# Function to fetch stock price prediction
def predict_stock_price(stock_symbol):
    try:
        # Get the appropriate stock symbol
        symbol = get_stock_symbol(stock_symbol)
        
        # Remove .NS if present and add it separately if needed
        symbol = symbol.replace('.NS', '')
        
        # Try multiple suffixes for Indian stocks
        suffixes = ['', '.NS', '.BO', '.BSE']
        data = None
        
        for suffix in suffixes:
            try:
                stock = yf.Ticker(f"{symbol}{suffix}")
                data = stock.history(period="1mo")
                if not data.empty:
                    break
            except Exception as e:
                print(f"Failed to fetch data with suffix {suffix}: {e}")
        
        if data is None or data.empty:
            return f"No data found for {stock_symbol}. Please verify the stock symbol."

        # Ensure 'Close' column exists
        if 'Close' not in data.columns:
            return f"Unable to retrieve closing price data for {stock_symbol}"

        data = data[['Close']]
        data['Next Close'] = data['Close'].shift(-1)
        data = data.dropna()

        if len(data) < 2:
            return f"Not enough data for {stock_symbol} to make a prediction."

        X = data[['Close']]
        y = data['Next Close']

        model = LinearRegression()
        model.fit(X, y)

        # Get the last closing price
        last_close = data['Close'].iloc[-1]
        
        # Predict next day's close
        predicted_price = model.predict([[last_close]])

        # Format response in Indian Rupees
        return f"Current price of {stock_symbol}: ₹{last_close:.2f}\nPredicted price tomorrow: ₹{predicted_price[0]:.2f}"
    
    except Exception as e:
        # More detailed error logging
        print(f"Full error details for {stock_symbol}: {str(e)}")
        return f"Error predicting price for {stock_symbol}: {str(e)}"

# Function to fetch news related to stock using Gemini
def fetch_news(stock_symbol):
    try:
        # Get the appropriate stock symbol
        symbol = get_stock_symbol(stock_symbol)
        
        # Get company name from mapping if available
        company_name = stock_symbol
        for name, sym in STOCK_MAPPING.items():
            if sym == symbol or sym.split('.')[0] == symbol:
                company_name = name
                break
        
        # Create a prompt for Gemini
        prompt = f"""
        Generate 3 recent business news headlines about {company_name} ({symbol}).
        For each headline, analyze the sentiment as Positive, Negative, or Neutral.
        Return your response in this format:
        1. [Headline] - Sentiment: [Sentiment]
        2. [Headline] - Sentiment: [Sentiment] 
        3. [Headline] - Sentiment: [Sentiment]
        Only include the formatted headlines and sentiments, nothing else.
        """
        
        # Generate content with Gemini - use the correct model name
        model = genai.GenerativeModel('gemini-1.5-pro')  # Updated model name
        response = model.generate_content(prompt)
        
        # Check if we got a valid response
        if not response or not response.text:
            return [{"title": "Error fetching news from Gemini", "sentiment": "Neutral"}]
        
        # Parse the response to extract headlines and sentiments
        news_items = []
        lines = response.text.strip().split('\n')
        
        for line in lines:
            # Skip empty lines
            if not line.strip():
                continue
                
            # Extract headline and sentiment using regex
            match = re.search(r'\d+\.\s+(.*)\s+-\s+Sentiment:\s+(\w+)', line)
            if match:
                headline = match.group(1).strip()
                sentiment = match.group(2).strip()
                news_items.append({"title": headline, "sentiment": sentiment})
        
        # If parsing failed, return a formatted version of the raw response
        if not news_items:
            return [{"title": line.strip(), "sentiment": "Unknown"} for line in lines if line.strip()]
            
        return news_items
        
    except Exception as e:
        return [{"title": f"Error generating news: {str(e)}", "sentiment": "Neutral"}]

# Function to get business insights for a stock
def get_business_insights(stock_symbol):
    try:
        # Get the appropriate stock symbol
        symbol = get_stock_symbol(stock_symbol)
        
        # Get company name from mapping if available
        company_name = stock_symbol
        for name, sym in STOCK_MAPPING.items():
            if sym == symbol or sym.split('.')[0] == symbol:
                company_name = name
                break
        
        # Create a prompt for Gemini
        prompt = f"""
        Provide a brief business analysis for {company_name} ({symbol}). Include:
        1. Current market position
        2. Key competitive advantages or challenges
        3. Recent business developments
        4. Short-term outlook
        
        Keep the response concise and factual, without the need for point numbering or bullet points.
        """
        
        # Generate content with Gemini - use the correct model name
        model = genai.GenerativeModel('gemini-1.5-pro')  # Updated model name
        response = model.generate_content(prompt)
        
        if response and response.text:
            # Format the response to make it concise without bullet points or numbers
            response_text = response.text.strip()

            # Remove stars, bullets, or numbers if present
            response_text = response_text.replace("*", "").replace("•", "").replace("\n", " ").strip()

            # Optionally split by full stops to make it a clearer readable paragraph
            response_text = response_text.replace("\n", " ").strip()  # Replaces all newlines with spaces

            return response_text  # Return the final concise summary
            
        else:
            return f"Unable to generate business insights for {stock_symbol}"
            
    except Exception as e:
        return f"Error fetching business insights: {str(e)}"
    
    




# Function to list all available stocks
def list_stocks():
    stocks = []
    for company, symbol in STOCK_MAPPING.items():
        # Skip duplicate entries
        if isinstance(company, str) and company not in stocks:
            stocks.append(company)
    
    # Sort alphabetically
    stocks.sort()
    return stocks

# Chatbot view with CORS support
@csrf_exempt
def chatbot(request):
    if request.method == "POST":
        try:
            # More robust JSON parsing
            try:
                request_data = request.body.decode('utf-8')
                user_message = json.loads(request_data).get("message", "")
            except json.JSONDecodeError:
                return JsonResponse({
                    "response": "Invalid JSON in request",
                    "error": "JSONDecodeError"
                }, status=400)

            # Logging for debugging
            print(f"Received message: {user_message}")

            response = ""

            # Price Prediction Logic
            if "predict" in user_message.lower():
                stock_symbol = user_message.split("predict")[1].strip()
                if not stock_symbol:
                    response = "Please specify a stock symbol or company name. For example: 'predict RELIANCE'"
                else:
                    response = predict_stock_price(stock_symbol)
            
            # News Fetching Logic
            elif "news" in user_message.lower():
                stock_symbol = user_message.split("news")[1].strip()
                if not stock_symbol:
                    response = "Please specify a stock symbol or company name. For example: 'news RELIANCE'"
                else:
                    news_items = fetch_news(stock_symbol)
                    response = "\n".join([f"{item['title']} (Sentiment: {item['sentiment']})" for item in news_items])
            
            # Business Insights Logic
            elif "insights" in user_message.lower():
                stock_symbol = user_message.split("insights")[1].strip()
                if not stock_symbol:
                    response = "Please specify a stock symbol or company name. For example: 'insights RELIANCE'"
                else:
                    response = get_business_insights(stock_symbol)
            
            # Fallback response
            if not response:
                response = "Sorry, I couldn't process your request. Please try again."

            return JsonResponse({"response": response})

        except Exception as e:
            # Comprehensive error logging
            print(f"Unexpected error in chatbot view: {e}")
            print(f"Error type: {type(e)}")
            import traceback
            traceback.print_exc()

            return JsonResponse({
                "response": "Server encountered an unexpected error",
                "error": str(e)
            }, status=500)

    return JsonResponse({
        "response": "Invalid request method. Only POST is allowed."
    }, status=405)

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