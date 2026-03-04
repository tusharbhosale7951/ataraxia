import { Sidebar } from '@/components/Sidebar'
import { FloatingLeaves } from '@/components/FloatingLeaves'
import { KaizenWidget } from '@/components/KaizenWidget'
import { motion } from 'framer-motion'

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
}

export default function Habits() {
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
          <h1 className="text-4xl font-serif font-bold bg-gradient-to-r from-sage-300 to-emerald-300 bg-clip-text text-transparent">
            Kaizen Habits
          </h1>
          <p className="text-gray-400 mt-1">Small steps, big changes 🌱</p>
        </header>

        <div className="max-w-2xl mx-auto">
          <KaizenWidget />
        </div>
      </div>
    </motion.div>
  )
}