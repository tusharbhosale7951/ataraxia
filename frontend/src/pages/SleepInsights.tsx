import { SleepWidget } from '@/components/SleepWidget'
import { Sidebar } from '@/components/Sidebar'
import { FloatingLeaves } from '@/components/FloatingLeaves'
import { motion } from 'framer-motion'

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
}

export default function SleepInsights() {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="min-h-screen bg-[#1A2A1F] text-white relative"
    >
      <FloatingLeaves />
      <Sidebar />
      <div className="ml-20 p-6">
        <header className="mb-8">
          <h1 className="text-4xl font-serif font-bold bg-gradient-to-r from-indigo-300 to-purple-300 bg-clip-text text-transparent">
            Sleep Insights
          </h1>
          <p className="text-gray-400 mt-1">• Japanese sleep wisdom</p>
        </header>
        
        <div className="max-w-2xl mx-auto">
          <SleepWidget />
        </div>
      </div>
    </motion.div>
  )
}