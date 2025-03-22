'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, ArrowRight, Database, LineChart, RefreshCw } from 'lucide-react'
import Header from '../components/Header'
import StockInput from '../components/StockInput'
import StockPrediction from '../components/StockPrediction'

export default function Home() {
  const [ticker, setTicker] = useState('')
  const [showWelcome, setShowWelcome] = useState(true)
  
  useEffect(() => {
    if (showWelcome) {
      const timer = setTimeout(() => {
        setShowWelcome(false)
      }, 4000) 
      
      return () => clearTimeout(timer)
    }
  }, [showWelcome])

  if (showWelcome) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1 }}
        className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex flex-col items-center justify-center p-6"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl w-full mx-auto bg-gray-800/90 backdrop-blur-md rounded-2xl p-10 shadow-2xl border-l-4 border-blue-500"
        >
          <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="flex items-center justify-center mb-8"
          >
            <TrendingUp size={48} className="text-blue-500 mr-4" />
            <h1 className="text-5xl font-bold gradient-text bg-clip-text text-transparent ">
              MarketMind
            </h1>
          </motion.div>

          <motion.h2 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-2xl text-center text-gray-300 mb-8"
          >
            Advanced Stock Prediction with Machine Learning
          </motion.h2>

          <motion.div 
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
          >
            <div className="bg-gray-700/50 p-6 rounded-lg text-center">
              <Database className="mx-auto mb-4 text-blue-400" size={32} />
              <h3 className="text-lg font-medium text-gray-200 mb-2">Real-Time Data</h3>
              <p className="text-gray-400">Access latest market data for accurate predictions</p>
            </div>
            
            <div className="bg-gray-700/50 p-6 rounded-lg text-center">
              <LineChart className="mx-auto mb-4 text-purple-400" size={32} />
              <h3 className="text-lg font-medium text-gray-200 mb-2">AI Predictions</h3>
              <p className="text-gray-400">Advanced machine learning algorithms to forecast trends</p>
            </div>
            
            <div className="bg-gray-700/50 p-6 rounded-lg text-center">
              <RefreshCw className="mx-auto mb-4 text-green-400" size={32} />
              <h3 className="text-lg font-medium text-gray-200 mb-2">Technical Analysis</h3>
              <p className="text-gray-400">Comprehensive indicators for better investment decisions</p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="text-center"
          >
            <p className="text-gray-400 mb-6">Loading your personalized market analysis dashboard...</p>
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 180, 360]
              }}
              transition={{
                duration: 2,
                ease: "easeInOut",
                times: [0, 0.5, 1],
                repeat: Infinity
              }}
              className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"
            />
          </motion.div>
        </motion.div>
      </motion.div>
    )
  }

  return (
    <div className="min-h-screen pb-12" suppressHydrationWarning={true}>
      <Header />
      <main className="container mx-auto px-4 py-8 relative max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-6xl font-bold mb-4 text-gray-200 relative inline-block">
            MarketMind AI
            <motion.div
              className="absolute -bottom-2 left-0 w-full h-2 bg-blue-700"
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 0.5, delay: 0.5 }}
            />
          </h1>
          <p className="text-xl mb-8 text-gray-400">
            Predict the future of stocks with cutting-edge AI technology
          </p>
          
        </motion.div>
        <div className="glassmorphism p-8 mt-12 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
          <StockInput onSubmit={setTicker} />
          {ticker && <StockPrediction ticker={ticker} />}
        </div>
      </main>
    </div>
  )
}