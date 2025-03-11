"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search } from "lucide-react";

interface StockInputProps {
  onSubmit: (ticker: string) => void;
}

const stockMapping: { [key: string]: string } = {
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
  Cipla: "CIPLA",
  "Coal India": "COALINDIA",
  "Container Corporation of India": "CONCOR",
  "Divi’s Laboratories": "DIVISLAB",
  "Dabur India": "DABUR",
  "Dr. Reddy’s Laboratories": "DRREDDY",
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
  Infosys: "INFY",
  "ITC Limited": "ITC",
  "JSW Steel": "JSWSTEEL",
  "Kajaria Ceramics": "KAJARIACER",
  "Kotak Mahindra Bank": "KOTAKBANK",
  "Larsen & Toubro": "LT",
  Lupin: "LUPIN",
  "Mahindra & Mahindra": "M&M",
  "Motherson Sumi": "MOTHERSUMI",
  Marico: "MARICO",
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
  Siemens: "SIEMENS",
  "State Bank of India": "SBI",
  "Sun Pharmaceutical Industries": "SUNPHARMA",
  "Tata Chemicals": "TATACHEM",
  "Tata Consultancy Services": "TCS",
  "Tata Motors": "TATAMOTORS",
  "Tata Power": "TATAPOWER",
  "Tech Mahindra": "TECHM",
  Titan: "TITAN",
  "UltraTech Cement": "ULTRACEMCO",
  UPL: "UPL",
  "Wipro Limited": "WIPRO",
  "Zee Entertainment Enterprises": "ZEEL",
  Zomato: "ZOMATO",
  "Ajanta Pharma": "AJANTPHARM",
  "Bajaj Hindusthan Sugar": "BAJAJHIND",
  "Balrampur Chini Mills": "BALRAMCHIN",
  "Bank of India": "BANKINDIA",
  "Bharti Infratel": "BHARTIINFR",
  "Blue Star": "BLUESTARCO",
  "Chennai Petrochemicals": "CHENNPETRO",
  "Cholamandalam Investment": "CHOLAFIN",
  "Coromandel International": "COROMANDEL",
  Crisil: "CRISIL",
  "Exide Industries": "EXIDEIND",
  "Godrej Industries": "GODREJIND",
  "Hindustan Unilever": "HUL",
  "ICICI Prudential Life Insurance": "ICICIPRULI",
  "Indian Oil Corporation": "IOC",
  "L&T Technology Services": "LTTS",
  "Lupin Limited": "LUPIN",
  "Mahindra Lifespace Developers": "MAHLIFE",
  "National Aluminium Company": "NALCO",
  "Pidilite Industries": "PIDILITIND",
  "Piramal Enterprises": "PIRAMAL",
  "Power Finance Corporation": "PFC",
  "Power Grid Corporation": "POWERGRID",
  "Siemens Ltd": "SIEMENS",
  "Titan Company": "TITAN",
  Voltas: "VOLTAS",
  TCS: "TCS",
  INFY: "INFY",
  RELIANCE: "RELIANCE",
  HDFC: "HDFC",
  ICICIBANK: "ICICIBANK",
  SBIN: "SBIN",
  HINDUNILVR: "HINDUNILVR",
  BAJFINANCE: "BAJFINANCE",
  KOTAKBANK: "KOTAKBANK",
  LT: "LT",
  ITC: "ITC",
  AXISBANK: "AXISBANK",
  BHEL: "BHEL",
  MARUTI: "MARUTI",
  "M&M": "M&M",
  TITAN: "TITAN",
  BHARTIARTL: "BHARTIARTL",
  WIPRO: "WIPRO",
  ULTRACEMCO: "ULTRACEMCO",
  TATAMOTORS: "TATAMOTORS",
  TECHM: "TECHM",
  "HDFC BANK": "HDFCBANK",
  ADANIGREEN: "ADANIGREEN",
  ADANIPORTS: "ADANIPORTS",
  DIVISLAB: "DIVISLAB",
  SUNPHARMA: "SUNPHARMA",
  TATASTEEL: "TATASTEEL",
  RECLTD: "RECLTD",
  GAIL: "GAIL",
  POWERGRID: "POWERGRID",
  DRREDDY: "DRREDDY",
  INDUSINDBK: "INDUSINDBK",
  ASIANPAINT: "ASIANPAINT",
  EICHERMOT: "EICHERMOT",
  APOLLOHOSP: "APOLLOHOSP",
  CIPLA: "CIPLA",
  HCLTECH: "HCLTECH",
  GODREJCP: "GODREJCP",
  SHREECEM: "SHREECEM",
  BAJAJFINSV: "BAJAJFINSV",
  PNB: "PNB",
  BOSCHLTD: "BOSCHLTD",
  MARICO: "MARICO",
  DABUR: "DABUR",
  JINDALSTEL: "JINDALSTEL",
  MUTHOOTFIN: "MUTHOOTFIN",
  ICICIGI: "ICICIGI",
  TATACONSUM: "TATACONSUM",
  INDIAMART: "INDIAMART",
  BERGEPAINT: "BERGEPAINT",
  MOTHERSUMI: "MOTHERSUMI",
  CANBK: "CANBK",
  BEL: "BEL",
  HAVELLS: "HAVELLS",
  TATAPOWER: "TATAPOWER",
  IOB: "IOB",
  SBILIFE: "SBILIFE",
  HEROMOTOCO: "HEROMOTOCO",
  NTPC: "NTPC",
  VOLTAS: "VOLTAS",
  CHOLAFIN: "CHOLAFIN",
  LUPIN: "LUPIN",
  HDFCLIFE: "HDFCLIFE",
  COALINDIA: "COALINDIA",
  NESTLEIND: "NESTLEIND",
  PVR: "PVR",
  RAJESHEXPORTS: "RAJESHEXPORTS",
  INFIBEAM: "INFIBEAM",
  LTI: "LTI",
  RELIANCEIND: "RELIANCEIND",
  HINDALCO: "HINDALCO",
  "M&MFIN": "M&MFIN",
  PERSISTENT: "PERSISTENT",
  SRF: "SRF",
  WELSPUNIND: "WELSPUNIND",
  RAMCOCEM: "RAMCOCEM",
  ADANIPOWER: "ADANIPOWER",
  FEDERALBNK: "FEDERALBNK",
  "SBI LIFE": "SBILIFE",
  GICRE: "GICRE",
  NLCINDIA: "NLCINDIA",
  MCX: "MCX",
  ZOMATO: "ZOMATO",
  BAJJAUTO: "BAJJAUTO",
  TATAELXSI: "TATAELXSI",
  BALKRISIND: "BALKRISIND",
  JUBLFOOD: "JUBLFOOD",
  TATAGLOBAL: "TATAGLOBAL",
  APOLLOTYRE: "APOLLOTYRE",
  MRF: "MRF",
  BIRLACORPN: "BIRLACORPN",
  NAYARA: "NAYARA",
  IDFCFIRSTB: "IDFCFIRSTB",
  GMRINFRA: "GMRINFRA",
  IRCTC: "IRCTC",
  IEX: "IEX",
  LALPATHLAB: "LALPATHLAB",
  INFRATEL: "INFRATEL",
  BIOCON: "BIOCON",
  COLPAL: "COLPAL",
  NMDC: "NMDC",
  VGUARD: "VGUARD",
  RELIANCEINFRA: "RELIANCEINFRA",
  "PUNJAB NATIONAL BANK": "PNB",
  SOMANYCERA: "SOMANYCERA",
  ACC: "ACC",
  AMBUJACEM: "AMBUJACEM",
  VODAFONE: "VODAFONE",
  SBI: "SBI",
  MOTHERSONSUMI: "MOTHERSONSUMI",
  HUL: "HUL",
  RBLBANK: "RBLBANK",
  POLYCAB: "POLYCAB",
  MINDTREE: "MINDTREE",
  DELTA: "DELTA",
  HDFCAMC: "HDFCAMC",
  INDIACEM: "INDIACEM",
  LICHSGFIN: "LICHSGFIN",
  MAXHEALTH: "MAXHEALTH",
  LIC: "LIC",
  AARTIIND: "AARTIIND",
};

export default function StockInput({ onSubmit }: StockInputProps) {
  const [ticker, setTicker] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const [noMatches, setNoMatches] = useState(false);
  const [predictionResult, setPredictionResult] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Create a ref to hold the timeout
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Debounce the search logic
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(() => {
      if (ticker.length > 0) {
        const filteredSuggestions = Object.keys(stockMapping).filter((stock) =>
          stock.toLowerCase().includes(ticker.toLowerCase())
        );
        setSuggestions(filteredSuggestions);
        setNoMatches(filteredSuggestions.length === 0);
      } else {
        setSuggestions([]);
        setNoMatches(false);
      }
    }, 300);

    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, [ticker]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedTicker = stockMapping[ticker];
    if (selectedTicker) {
      setPredictionResult(`Prediction for: ${selectedTicker}`); // Show the prediction result
      onSubmit(selectedTicker);
    } else {
      setPredictionResult(`No prediction available for: ${ticker}`);
      onSubmit(ticker);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setTicker(suggestion);
    const selectedTicker = stockMapping[suggestion];
    if (selectedTicker) {
      setPredictionResult(`Prediction for: ${selectedTicker}`); // Show the prediction result
      onSubmit(selectedTicker);
    } else {
      setPredictionResult(`No prediction available for: ${suggestion}`);
      onSubmit(suggestion);
    }
    setSuggestions([]);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-md mx-auto mb-12 relative"
    >
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <input
            ref={inputRef}
            className="w-full bg-gray-800/50 text-gray-200 border-2 border-blue-500 rounded-full py-3 px-6 pr-24 leading-tight focus:outline-none focus:border-purple-500 transition-colors duration-200 backdrop-blur-sm"
            type="text"
            placeholder="Enter company name (e.g., TCS)"
            value={ticker}
            onChange={(e) => setTicker(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          />
          <motion.button
            
            
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-teal-200 to-pink-200 text-black font-bold py-2 px-4 rounded-full transition-all duration-200 flex items-center hover:scale-105 hover:shadow-lg z-20"
            style={{ transformOrigin: "center" }}
            type="submit"
          >
            <Search size={18} className="mr-2" />
            Predict
          </motion.button>
        </div>
      </form>

      <AnimatePresence>
        {isFocused && suggestions.length > 0 && !noMatches && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute z-10 w-full mt-2 bg-gray-800/90 border border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto backdrop-blur-sm"
          >
            {suggestions.map((suggestion, index) => (
              <motion.div
                key={suggestion}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                className="px-4 py-2 cursor-pointer hover:bg-blue-900 transition-colors duration-200"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion}
              </motion.div>
            ))}
          </motion.div>
        )}
        {isFocused && noMatches && ticker && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-10 w-full mt-2 bg-gray-800/90 border border-gray-600 rounded-lg shadow-lg backdrop-blur-sm"
          >
            <div className="px-4 py-2 text-gray-300">No matching results</div>
          </motion.div>
        )}
      </AnimatePresence>

      {predictionResult && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-4 bg-gray-800/80 text-white p-4 rounded-lg shadow-lg"
        >
          {predictionResult}
        </motion.div>
      )}
    </motion.div>
  );
}
