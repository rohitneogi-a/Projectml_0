
# ProjectML_0

## Description
**MarketMind: Stock Price Prediction Using Machine Learning** explores the use of advanced machine learning models like LSTM, SVM, GANs, and hybrid approaches (e.g., CNN-LSTM-XGBoost) to improve stock price forecasting. By leveraging diverse financial data—historical stock prices, technical indicators, macroeconomic factors, and sentiment analysis—this study aims to enhance prediction accuracy. It demonstrates that hybrid deep learning models outperform traditional methods in capturing market trends and dependencies. Despite challenges like data quality and market unpredictability, the research highlights the potential of ML for algorithmic trading, risk assessment, and portfolio optimization.

## Project Structure

The project is divided into two main parts:

1. **Backend** - Located in the `backend` directory.
2. **Frontend** - Located in the `frontend` directory.

## Installation and Setup

Follow the steps below to set up both the backend and frontend.

### 1. Clone the Repository

To begin, clone this repository to your local machine:

```bash
git clone https://github.com/rohitneogi-a/Projectml_0.git
cd Projectml_0
```

### 2. Split Terminal in VS Code

After you've cloned the repository and navigated into the `Projectml_0` directory, it's recommended to use **split terminals** in VS Code to run both the backend and frontend simultaneously.

1. Open **VS Code** in the `Projectml_0` folder.
2. Open a **split terminal** in VS Code:
   - Use the shortcut `Ctrl + Shift + \` to split the terminal.
   - Or, click on the **Terminal** menu and select **Split Terminal**.

Once you have split the terminal, you can follow the steps below to set up the backend and frontend.

### 3. Backend Setup

1. In the **first terminal**, navigate to the `backend` directory twice:
   ```bash
   cd backend
   cd backend
   ```

2. Run the `setup.bat` script to install necessary dependencies and configure the backend:
   ```bash
   setup.bat
   ```

### 4. Frontend Setup

1. In the **second terminal**, navigate to the `frontend` directory:
   ```bash
   cd ..
   cd frontend
   ```

2. Navigate to the `marketmind` directory:
   ```bash
   cd marketmind
   ```

3. Install the required packages and dependencies:
   ```bash
   npm install
   ```

4. Start the frontend development server:
   ```bash
   npm run dev
   ```

The frontend should now be running locally in one terminal, and the backend should be configured and ready to handle requests in the other terminal.

## Usage

Once the setup is complete, you can access the frontend application locally. The frontend will interact with the backend to display machine learning results and provide user interaction.

## Contributing

Feel free to fork the repository, create a branch, and submit pull requests for any enhancements, bug fixes, or improvements you may have.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
```


