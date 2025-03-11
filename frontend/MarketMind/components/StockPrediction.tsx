'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'
import { TrendingUp, TrendingDown  } from 'lucide-react'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

interface PredictionData {
  
  prediction: any
  nextDayPrice: number
  actualPrices: number[]
  predictedPrices: number[]
  futurePredictions: number[]
  technicalIndicators: {
    sma: number[]
    ema: number[]
    rsi: number[]
    obv: number[]
    bollingerBands: {
      upper: number[]
      middle: number[]
      lower: number[]
    }
  }
  mse: number          
}



export default function StockPrediction({ ticker }: { ticker: string }) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<PredictionData | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)
      try {
        const tick=ticker+'.NS'
        const host = "http://127.0.0.1:8000"
        const response = await fetch(`${host}/api/predict/?ticker=${tick}`,{
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        })
        if (!response.ok) {
          throw new Error('Failed to fetch prediction data')
        }
        const result = await response.json()
        console.log(result)
        setData(result)
      } catch (err) {
        console.log(err)
        setError('An error occurred while fetching the prediction data')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [ticker])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 2,
            ease: "easeInOut",
            times: [0, 0.5, 1],
            repeat: Infinity,
          }}
          className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    )
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mt-8 text-red-500 bg-red-100 dark:bg-red-900 p-4 rounded-lg"
      >
        {error}
      </motion.div>
    )
  }

  if (!data) {
    return null
  }

  const chartData = {
    labels: Array.from({ length: data?.prediction?.actualPrices?.length || 0 }, (_, i) => `Day ${i + 1}`),
    datasets: [
      {
        label: 'Actual Prices',
        data: data?.prediction?.actualPrices || [],
        borderColor: 'rgba(53, 162, 235, 0.8)',
        backgroundColor: 'rgba(53, 162, 235, 0.3)',
        fill: true,
      },
      {
        label: 'Predicted Prices',
        data: data?.prediction?.predictedPrices || [],
        borderColor: 'rgba(255, 99, 132, 0.8)',
        backgroundColor: 'rgba(255, 99, 132, 0.3)',
        fill: true,
      },
    ],
  }
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (error || !data?.prediction) {
    return <div>Error loading prediction data</div>;
  }
  

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: 'rgba(255, 255, 255, 0.8)'
        }
      },
      title: {
        display: true,
        text: 'Stock Price Prediction',
        color: 'rgba(255, 255, 255, 0.8)'
      },
    },
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    scales: {
      y: {
        title: {
          display: true,
          text: 'Price (Rs.)',
          color: 'rgba(255, 255, 255, 0.8)'
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.8)'
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        }
      },
      x: {
        ticks: {
          color: 'rgba(255, 255, 255, 0.8)'
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        }
      }
    },
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mt-8 space-y-8"
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-gray-800/90 backdrop-blur-md shadow-lg rounded-lg p-6 border-l-4 border-blue-500"
      >
        <h2 className="text-2xl font-bold mb-4 text-gray-200">Prediction Results for {ticker}</h2>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-5xl font-bold text-blue-400 mb-2">
              {data.prediction.nextDayPrice.toFixed(2)}
            </div>
            <p className="text-gray-400">Predicted price for tomorrow</p>
          </div>
          <div className="text-4xl">
            {data.nextDayPrice > data.prediction.actualPrices[data.prediction.actualPrices.length - 1] ? (
              <TrendingUp className="text-green-500" />
            ) : (
              <TrendingDown className="text-red-500" />
            )}
          </div>
        </div>
      </motion.div>
      {/* Display Mean Squared Error and Random Forest */}
<motion.div
  initial={{ scale: 0.9 }}
  animate={{ scale: 1 }}
  transition={{ duration: 0.3 }}
  className="bg-gray-800/90 backdrop-blur-md shadow-lg rounded-lg p-6"
>
  <h3 className="text-xl font-semibold mb-4 text-gray-200">Model Evaluation</h3>
  <div className="flex justify-between">
    <div>
      <div className="text-xl font-bold text-gray-400 mb-2">Mean Squared Error (MSE)</div>
      <div className="text-lg text-gray-200">{Math.sqrt(data.prediction.mse.toFixed(2)).toFixed(2)}</div>
    </div>
    <div>
      <div className="text-xl font-bold text-gray-400 mb-2">Model: Random Forest</div>
      <div className="text-lg text-gray-200">{data.prediction.r2.toFixed(4)}</div>
    </div>
  </div>
</motion.div>


      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="bg-gray-800/90 backdrop-blur-md shadow-lg rounded-lg p-6"
      >
        <h3 className="text-xl font-semibold mb-4 text-gray-200">Actual vs Predicted Stock Prices</h3>
        <div className="h-[300px] md:h-[400px] lg:h-[500px]">
          <Line options={chartOptions} data={chartData} />
        </div>
      </motion.div>

      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="bg-gray-800/90 backdrop-blur-md shadow-lg rounded-lg p-6"
      >
        <h3 className="text-xl font-semibold mb-4 text-gray-200">Future Predictions (Next 10 Days)</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-700">
                <th className="text-left p-2">Day</th>
                <th className="text-left p-2">Predicted Price</th>
                <th className="text-left p-2">Change</th>
              </tr>
            </thead>
            <tbody>
              {data.prediction.futurePredictions.map((price:number, index:number) => (
                <motion.tr
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="border-b border-gray-600"
                >
                  <td className="p-2">Day {index + 1}</td>
                  <td className="p-2">Rs.{price.toFixed(2)}</td>
                  <td className="p-2">
                    <span className={price > data.prediction.nextDayPrice ? "text-green-500" : "text-red-500"}>
                      {price > data.prediction.nextDayPrice ? "▲" : "▼"} 
                      {((price - data.prediction.nextDayPrice) / data.prediction.nextDayPrice * 100).toFixed(2)}%
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3, delay: 0.3 }}
        className="bg-gray-800/90 backdrop-blur-md shadow-lg rounded-lg p-6"
      >
        <h3 className="text-xl font-semibold mb-4 text-gray-200">Technical Indicators</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold mb-2 text-gray-300">SMA</h4>
            <div className="h-[200px] md:h-[250px] lg:h-[300px]">
              <Line
                options={{
                  ...chartOptions,
                  plugins: {
                    ...chartOptions.plugins,
                    legend: { display: false },
                  },
                }}
                data={{
                  labels: Array.from({ length: data.prediction.technicalIndicators.sma.length }, (_, i) => `Day ${i + 1}`),
                  datasets: [{ 
                    data: data.prediction.technicalIndicators.sma, 
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.1
                  }],
                }}
              />
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-2 text-gray-300">RSI</h4>
            <div className="h-[200px] md:h-[250px] lg:h-[300px]">
              <Line
                options={{
                  ...chartOptions,
                  plugins: {
                    ...chartOptions.plugins,
                    legend: { display: false },
                  },
                  scales: {
                    ...chartOptions.scales,
                    y: {
                      ...chartOptions.scales.y,
                      min: 0,
                      max: 100,
                    },
                  },
                }}
                data={{
                  labels: Array.from({ length: data.prediction.technicalIndicators.rsi.length }, (_, i) => `Day ${i + 1}`),
                  datasets: [{ 
                    data: data.prediction.technicalIndicators.rsi, 
                    borderColor: 'rgb(153, 102, 255)',
                    tension: 0.1
                  }],
                }}
              />
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

