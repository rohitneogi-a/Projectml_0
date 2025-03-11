import { Github,  Linkedin ,Instagram} from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-white/90 dark:bg-gray-800/80 backdrop-blur-md shadow-md transition-colors duration-200 py-4 text-center">
      <div className="container mx-auto px-6 flex justify-center items-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">&copy; {new Date().getFullYear()} All rights reserved.</p>
      </div>
    </footer>
  )
}


