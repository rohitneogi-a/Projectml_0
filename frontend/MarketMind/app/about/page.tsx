'use client'

import { motion } from 'framer-motion'
import { BarChart2, Database, Brain, TrendingUp } from 'lucide-react'
import Link from 'next/link'

export default function About() {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <motion.div 
        className="max-w-4xl mx-auto space-y-12"
        initial="initial"
        animate="animate"
        variants={{
          animate: {
            transition: {
              staggerChildren: 0.1
            }
          }
        }}
      >
        <motion.h1 
          className="text-4xl md:text-5xl font-bold text-center mb-8 gradient-text"
          variants={fadeInUp}
        >
          Welcome to Our Stock Prediction Platform!
        </motion.h1>

        <motion.p 
          className="text-lg text-gray-600 dark:text-gray-300 text-center mb-12"
          variants={fadeInUp}
        >
          Gain insights into future stock movements with advanced machine learning and technical analysis.
        </motion.p>

        <motion.div 
          variants={fadeInUp}
          className="glassmorphism p-8 rounded-xl space-y-6"
        >
          <h2 className="text-2xl font-semibold mb-4">How the Platform Works</h2>
          
          <div className="space-y-4">
            {[
              { 
                title: "Data Collection and Preprocessing", 
                description: "We fetch real-time stock data from Yahoo Finance, dating back to January 2000.",
                icon: <Database className="w-6 h-6" />
              },
              { 
                title: "Feature Engineering with Technical Indicators", 
                description: "We apply various technical analysis indicators like SMA, EMA, RSI, OBV, and Bollinger Bands.",
                icon: <BarChart2 className="w-6 h-6" />
              },
              { 
                title: "Machine Learning for Stock Prediction", 
                description: "We use XGBoost Regressor, a powerful algorithm suited for time-series data like stock prices.",
                icon: <Brain className="w-6 h-6" />
              },
              { 
                title: "Predicting the Future", 
                description: "Our platform predicts the next day's closing price and forecasts for the next 10 days.",
                icon: <TrendingUp className="w-6 h-6" />
              }
            ].map((item, index) => (
              <motion.div 
                key={index}
                className="flex items-start space-x-4"
                variants={fadeInUp}
              >
                <div className="bg-blue-500 p-2 rounded-full text-white">
                  {item.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{item.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div 
          variants={fadeInUp}
          className="glassmorphism p-8 rounded-xl space-y-6"
        >
          <h2 className="text-2xl font-semibold mb-4">User Interface - The Key to a Great Experience</h2>
          <p className="text-gray-600 dark:text-gray-300">
            Our platform&apos;s UI/UX design is crafted with simplicity and functionality in mind, ensuring that users can access the most important features quickly and easily.
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300">
            <li>Clean and simple stock ticker input</li>
            <li>Real-time data display with predicted stock prices</li>
            <li>Interactive charts for technical indicators</li>
            <li>Easy navigation with a minimalist approach</li>
            <li>Responsive design for all devices</li>
          </ul>
        </motion.div>

        <motion.div 
          variants={fadeInUp}
          className="glassmorphism p-8 rounded-xl space-y-6"
        >
          <h2 className="text-2xl font-semibold mb-4">Why This Platform is Valuable</h2>
          <ul className="space-y-4">
            {[
              "Accurate Predictions",
              "Data-Driven Insights",
              "Comprehensive Analysis",
              "User-Friendly Interface",
              "Long-Term Forecasting"
            ].map((item, index) => (
              <motion.li 
                key={index}
                className="flex items-center space-x-2"
                variants={fadeInUp}
              >
                <div className="bg-green-500 p-1 rounded-full">
                  <svg className="w-4 h-4 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <span>{item}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        <motion.div 
          variants={fadeInUp}
          className="text-center space-y-6"
        >
          <h2 className="text-2xl font-semibold">Get Started Today</h2>
          <p className="text-gray-600 dark:text-gray-300">
            Ready to try out the platform? Enter any valid stock ticker and get predictions to help you make informed decisions.
          </p>
          <Link 
            href="/"
            className="inline-block bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-3 px-6 rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
          >
            Start Predicting Now
          </Link>
        </motion.div>

        <motion.div 
          variants={fadeInUp}
          className="text-center text-gray-500 dark:text-gray-400"
        >
          <p>Join us and start making data-driven investment decisions today!</p>
        </motion.div>
      </motion.div>
    </div>
  )
}

