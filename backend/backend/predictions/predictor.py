import yfinance as yf
import pandas_ta as ta
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from xgboost import XGBRegressor
from sklearn.metrics import mean_squared_error, r2_score
import matplotlib.pyplot as plt
import datetime


def predict(ticker, start_date="2020-01-01", end_date="2025-01-01"):
    # Set the end date to the current date if it's not provided
    end = datetime.datetime.now().date()

    # Step 1: Download Data with start and end dates
    try:
        data = yf.download(ticker, start=start_date, end=end_date)
    except Exception as e:
        print(f"Failed to download data for {ticker}: {e}")
        return None  # If an error occurs, return None or an appropriate message

    if data.empty:
        print(f"Error: No data available for ticker {ticker}. It may be delisted.")
        return None  # Or return a default result or error response

    # Flatten multi-level columns if present
    data.columns = ['_'.join(col).strip() for col in data.columns]

    # Step 2: Dynamically identify the 'Close' and 'Volume' columns
    close_column = [col for col in data.columns if 'Close' in col][0]  # Find the Close column
    volume_column = [col for col in data.columns if 'Volume' in col][0]  # Find the Volume column

    # Step 3: Check for missing values and drop rows with NaN values
    data = data.dropna(subset=[close_column, volume_column])

    # Step 4: Feature Engineering - Calculate Technical Indicators
    data['SMA'] = ta.sma(data[close_column], length=50)  # Simple Moving Average
    data['EMA'] = ta.ema(data[close_column], length=50)  # Exponential Moving Average
    data['RSI'] = ta.rsi(data[close_column], length=14)  # Relative Strength Index

    try:
        data['OBV'] = ta.obv(data[close_column], data[volume_column])  # On-Balance Volume
    except Exception as e:
        print(f"Error calculating OBV: {e}")
        data['OBV'] = np.nan  # Fallback to NaN if OBV cannot be calculated

    bollinger_bands = ta.bbands(data[close_column], length=50)
    if bollinger_bands is not None:
        data['Bollinger_Upper'] = bollinger_bands['BBU_50_2.0']
        data['Bollinger_Middle'] = bollinger_bands['BBM_50_2.0']
        data['Bollinger_Lower'] = bollinger_bands['BBL_50_2.0']
    else:
        print("Error: Bollinger Bands could not be calculated.")

    # Drop any rows with missing values
    data = data.dropna()

    # Step 5: Prepare Target Variable (Next day's Close Price)
    data['Next_Close'] = data[close_column].shift(-1)
    data = data.dropna()

    # Step 6: Prepare Features and Target
    features = ['SMA', 'EMA', 'RSI', 'OBV', 'Bollinger_Upper', 'Bollinger_Lower']
    X = data[features]
    y = data['Next_Close']

    # Step 7: Normalize Features
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)

    # Step 8: Train-Test Split
    X_train, X_test, y_train, y_test = train_test_split(X_scaled, y, test_size=0.2, random_state=42)

    # Step 9: Train XGBoost Model
    model = XGBRegressor(n_estimators=100, learning_rate=0.1, max_depth=5)
    model.fit(X_train, y_train)

    # Step 10: Evaluate Model
    y_pred = model.predict(X_test)
    mse = mean_squared_error(y_test, y_pred)
    r2 = r2_score(y_test, y_pred)
    smse = np.sqrt(mse)

    # Step 11: Predict Next Day's Stock Price
    last_data_point = data.iloc[-1][features].values.reshape(1, -1)
    last_data_point_scaled = scaler.transform(last_data_point)
    next_day_price = model.predict(last_data_point_scaled)[0]

    # Step 12: Predict Future Prices (Next 10 Days)
    future_predictions = []
    for day in range(1, 11):
        prediction = model.predict(last_data_point_scaled)[0]
        future_predictions.append(prediction)
        last_data_point_scaled = np.roll(last_data_point_scaled, shift=-1, axis=1)
        last_data_point_scaled[0, -1] = prediction

    # Step 13: Get Actual and Predicted Prices for the Last 30 Days
    actual_prices_last_30 = data[close_column].tail(30).values.tolist()  # Last 30 days actual prices
    predicted_prices_last_30 = model.predict(X_scaled[-30:]).tolist()  # Last 30 predicted prices

    # Step 14: Get Technical Indicator Values for the Last 30 Days
    sma_values = data['SMA'][-30:].values.tolist()
    ema_values = data['EMA'][-30:].values.tolist()
    rsi_values = data['RSI'][-30:].values.tolist()
    obv_values = data['OBV'][-30:].values.tolist()
    bollinger_upper_values = data['Bollinger_Upper'][-30:].values.tolist()
    bollinger_middle_values = data['Bollinger_Middle'][-30:].values.tolist()
    bollinger_lower_values = data['Bollinger_Lower'][-30:].values.tolist()

    # Step 15: Prepare the result as a structured JSON-like dictionary
    result = {
        "nextDayPrice": float(next_day_price),
        "actualPrices": actual_prices_last_30,
        "predictedPrices": predicted_prices_last_30,
        "futurePredictions": [float(p) for p in future_predictions],
        "technicalIndicators": {
            "sma": sma_values,
            "ema": ema_values,
            "rsi": rsi_values,
            "obv": obv_values,
            "bollingerBands": {
                "upper": bollinger_upper_values,
                "middle": bollinger_middle_values,
                "lower": bollinger_lower_values
            }
        },
        "mse": mse,  # Mean Squared Error
        "r2": r2,    # R-squared (RF)
        "smse": smse # Root Mean Squared Error
    }

    
   

    return result
