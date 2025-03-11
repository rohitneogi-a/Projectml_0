import Link from 'next/link'
import { motion } from 'framer-motion'



export default function Header() {
  

  return (
    <motion.header
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white/90 dark:bg-gray-800/80 backdrop-blur-md shadow-md transition-colors duration-200"
    >
      <nav className="container mx-auto px-6 py-4 max-w-6xl">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-3xl font-bold gradient-text">
            MarketMind
          </Link>
          <div className="flex items-center space-x-6">
            {['Home', 'About'].map((item) => (
              <Link key={item} href={item === 'Home' ? '/' : `/${item.toLowerCase()}`} className="relative group">
                <motion.span
                  className="text-gray-700 dark:text-gray-300 hover:text-blue-700 dark:hover:text-blue-400 transition-colors duration-200"
                  whileHover={{ scale: 1.1 }}
                >
                  {item}
                </motion.span>
                <motion.div
                  className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 dark:bg-blue-400 origin-left"
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </Link>
            ))}
            
          </div>
        </div>
      </nav>
    </motion.header>
  )
}

